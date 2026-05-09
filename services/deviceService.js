const DeviceStatus = require("../models/DeviceStatus");
const crypto = require("crypto");

// Generate API key
const generateApiKey = () =>{
    return crypto.randomBytes(24).toString("hex");
};


// =========================
// CREATE DEVICE
// =========================

exports.createDevice = async(data)=>{

    const apiKey = generateApiKey();

    const device = await DeviceStatus.create({

        deviceId:data.deviceId,

        name:data.name,

        location:data.location,

        apiKey

    });

    return device;
};


// =========================
// GET ALL DEVICES
// =========================

exports.getAllDevices = async()=>{

    return await DeviceStatus
    .find()
    .populate("clientId")
    .sort({ createdAt:-1 });
};


// =========================
// GET UNASSIGNED DEVICES
// =========================

exports.getUnassignedDevices = async()=>{

    return await DeviceStatus.find({
        assigned:false
    });
};


// =========================
// ASSIGN DEVICE TO CLIENT
// =========================

exports.assignDevice = async(
    deviceId,
    clientId
)=>{

    return await DeviceStatus.findOneAndUpdate(

        { deviceId },

        {
            clientId,
            assigned:true
        },

        { new:true }

    );
};


// =========================
// GET CLIENT DEVICE
// =========================

exports.getClientDevice = async(clientId)=>{

    return await DeviceStatus.findOne({
        clientId
    });
};