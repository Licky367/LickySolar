const solarService = require("./solarService");
const batteryService = require("./batteryService");
const gridService = require("./gridService");
const faultService = require("./faultService");

const OMRequest = require("../modules/OMRequest");
const DeviceStatus = require("../modules/DeviceStatus");
const User = require("../modules/User");
const FaultLog = require("../modules/FaultLog");


// =========================
// CLIENT DASHBOARD
// =========================

exports.getClientDashboard = async(clientId)=>{

    // Fetch latest readings in parallel (faster)
    const [
        solar,
        battery,
        grid,
        faults,
        device,
        omRequests
    ] = await Promise.all([

        solarService.getLatestByClient(clientId),

        batteryService.getLatestByClient(clientId),

        gridService.getLatestByClient(clientId),

        faultService.getClientFaults(clientId),

        DeviceStatus.findOne({ clientId }),

        OMRequest
        .find({ clientId })
        .sort({ createdAt:-1 })
        .limit(5) // latest requests only
    ]);

    return {

        solar: solar || null,

        battery: battery || null,

        grid: grid || null,

        faults: faults || [],

        device: device || null,

        omRequests: omRequests || []
    };
};



// =========================
// ADMIN DASHBOARD
// =========================

exports.getAdminDashboard = async()=>{

    // Run all queries in parallel
    const [
        totalClients,
        activeSystems,
        pendingFaults,
        pendingOM,
        totalDevices,
        offlineDevices
    ] = await Promise.all([

        User.countDocuments({ role:"client" }),

        DeviceStatus.countDocuments({
            internetStatus:"online"
        }),

        FaultLog.countDocuments({
            resolved:false
        }),

        OMRequest.countDocuments({
            status:"pending"
        }),

        DeviceStatus.countDocuments(),

        DeviceStatus.countDocuments({
            internetStatus:"offline"
        })
    ]);

    return {

        totalClients,

        totalDevices,

        activeSystems,

        offlineDevices,

        pendingFaults,

        pendingOM
    };
};