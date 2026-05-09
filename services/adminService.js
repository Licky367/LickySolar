const User = require("../modules/User");
const AdminInvite = require("../modules/AdminInvite");
const DeviceStatus = require("../modules/DeviceStatus");


// =========================
// CLIENTS
// =========================

// Get all clients
exports.getClients = async()=>{

    return await User
    .find({ role:"client" })
    .sort({ createdAt:-1 });
};


// Get single client with device
exports.getClientWithDevice = async(id)=>{

    const client = await User.findById(id);

    const device = await DeviceStatus.findOne({
        clientId:id
    });

    return {
        client,
        device
    };
};


// =========================
// ADMINS
// =========================

// Get all admins
exports.getAdmins = async()=>{

    return await User.find({
        role:{ $in:["admin","super_admin"] }
    }).sort({ createdAt:-1 });
};


// Check if email is invited
exports.isInvitedAdmin = async(email)=>{

    return await AdminInvite.findOne({ email });
};


// Invite admin
exports.inviteAdmin = async(data)=>{

    // Prevent duplicate invites
    const existing = await AdminInvite.findOne({
        email:data.email
    });

    if(existing){
        throw new Error("Admin already invited");
    }

    return await AdminInvite.create(data);
};


// =========================
// CLIENT DETAILS
// =========================

// Get client basic info
exports.getClientById = async(id)=>{

    return await User.findById(id);
};


// =========================
// DEVICE OPERATIONS (ADMIN SIDE)
// =========================

// Get all devices (for admin dashboard)
exports.getAllDevices = async()=>{

    return await DeviceStatus
    .find()
    .populate("clientId")
    .sort({ createdAt:-1 });
};


// Get unassigned devices
exports.getUnassignedDevices = async()=>{

    return await DeviceStatus.find({
        assigned:false
    });
};


// Assign device to client
exports.assignDeviceToClient = async(
    deviceId,
    clientId
)=>{

    const device = await DeviceStatus.findOne({
        deviceId
    });

    if(!device){
        throw new Error("Device not found");
    }

    if(device.assigned){
        throw new Error("Device already assigned");
    }

    device.clientId = clientId;
    device.assigned = true;

    await device.save();

    return device;
};


// Remove device from client (optional but important)
exports.unassignDevice = async(deviceId)=>{

    const device = await DeviceStatus.findOne({
        deviceId
    });

    if(!device){
        throw new Error("Device not found");
    }

    device.clientId = null;
    device.assigned = false;

    await device.save();

    return device;
};