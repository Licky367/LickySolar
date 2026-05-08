const solarService = require("./solarService");

const batteryService = require("./batteryService");

const gridService = require("./gridService");

const faultService = require("./faultService");

const OMRequest = require("../modules/OMRequest");

const DeviceStatus = require("../modules/DeviceStatus");

exports.getClientDashboard = async(clientId)=>{

    const solar =
    await solarService.getLatestByClient(clientId);

    const battery =
    await batteryService.getLatestByClient(clientId);

    const grid =
    await gridService.getLatestByClient(clientId);

    const faults =
    await faultService.getClientFaults(clientId);

    const deviceStatus =
    await DeviceStatus.findOne({ clientId });

    const omRequests =
    await OMRequest.find({ clientId });

    return {

        solar,

        battery,

        grid,

        faults,

        deviceStatus,

        omRequests
    };
};

exports.getAdminDashboard = async()=>{

    const DeviceStatus =
    require("../modules/DeviceStatus");

    const User =
    require("../modules/User");

    const FaultLog =
    require("../modules/FaultLog");

    const OMRequest =
    require("../modules/OMRequest");

    const totalClients =
    await User.countDocuments({
        role:"client"
    });

    const activeSystems =
    await DeviceStatus.countDocuments({
        internetStatus:"online"
    });

    const pendingFaults =
    await FaultLog.countDocuments({
        resolved:false
    });

    const pendingOM =
    await OMRequest.countDocuments({
        status:"pending"
    });

    return {

        totalClients,

        activeSystems,

        pendingFaults,

        pendingOM
    };
};