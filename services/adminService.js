const User = require("../modules/User");
const AdminInvite = require("../modules/AdminInvite");
const DeviceStatus = require("../modules/DeviceStatus");

const crypto = require("crypto");


// =========================
// CLIENTS
// =========================

// Get all clients
exports.getClients = async () => {
    return await User
        .find({ role: "client" })
        .sort({ createdAt: -1 });
};


// Get single client with device
exports.getClientWithDevice = async (id) => {

    const client = await User.findById(id);

    if (!client) return { client: null, device: null };

    const device = await DeviceStatus.findOne({
        clientId: id
    });

    return { client, device };
};


// Get client basic info
exports.getClientById = async (id) => {
    return await User.findById(id);
};



// =========================
// ADMINS
// =========================

exports.getAdmins = async () => {
    return await User.find({
        role: { $in: ["admin", "super_admin"] }
    }).sort({ createdAt: -1 });
};


exports.isInvitedAdmin = async (email) => {
    return await AdminInvite.findOne({ email });
};


exports.inviteAdmin = async (data) => {

    const existing = await AdminInvite.findOne({
        email: data.email
    });

    if (existing) {
        throw new Error("Admin already invited");
    }

    return await AdminInvite.create(data);
};



// =========================
// DEVICE OPERATIONS
// =========================


// 🔐 Generate API key
const generateApiKey = () => {
    return crypto.randomBytes(24).toString("hex");
};


// =========================
// CREATE DEVICE
// =========================

exports.createDevice = async (data) => {

    // 🔥 Ensure deviceId is unique
    const existing = await DeviceStatus.findOne({
        deviceId: data.deviceId
    });

    if (existing) {
        throw new Error("Device already exists");
    }

    // 🔥 Optional: Validate MAC address format
    if (data.macAddress) {

        const macRegex =
            /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;

        if (!macRegex.test(data.macAddress)) {
            throw new Error("Invalid MAC address format");
        }

        const existingMac =
            await DeviceStatus.findOne({
                macAddress: data.macAddress
            });

        if (existingMac) {
            throw new Error("MAC address already registered");
        }
    }

    const apiKey = generateApiKey();

    const device = await DeviceStatus.create({

        deviceId: data.deviceId,

        name: data.name || "Solar Device",

        location: data.location || "",

        macAddress: data.macAddress || null,

        apiKey,

        assigned: false,

        internetStatus: "offline",

        lastHeartbeat: null
    });

    return device;
};



// =========================
// GET ALL DEVICES
// =========================

exports.getAllDevices = async () => {

    return await DeviceStatus
        .find()
        .populate("clientId")
        .sort({ createdAt: -1 });
};


// =========================
// GET UNASSIGNED DEVICES
// =========================

exports.getUnassignedDevices = async () => {

    return await DeviceStatus.find({
        assigned: false
    });
};


// =========================
// GET DEVICE BY DEVICE ID
// =========================

exports.getDeviceByDeviceId = async (deviceId) => {

    return await DeviceStatus.findOne({
        deviceId
    });
};


// =========================
// GET DEVICE BY MAC ADDRESS
// =========================

exports.getDeviceByMac = async (macAddress) => {

    return await DeviceStatus.findOne({
        macAddress
    });
};



// =========================
// ASSIGN DEVICE (MAC + EMAIL)
// =========================

exports.assignDeviceToClient = async (
    macAddress,
    email
) => {

    // 🔥 Find device using MAC
    const device = await DeviceStatus.findOne({
        macAddress
    });

    if (!device) {
        throw new Error("Device not found with this MAC address");
    }

    if (device.assigned) {
        throw new Error("Device already assigned");
    }

    // 🔥 Find client using email
    const client = await User.findOne({
        email,
        role: "client"
    });

    if (!client) {
        throw new Error("Client not found");
    }

    // 🔥 Assign
    device.clientId = client._id;
    device.assigned = true;

    await device.save();

    return device;
};



// =========================
// UNASSIGN DEVICE
// =========================

exports.unassignDevice = async (deviceId) => {

    const device = await DeviceStatus.findOne({
        deviceId
    });

    if (!device) {
        throw new Error("Device not found");
    }

    device.clientId = null;
    device.assigned = false;

    await device.save();

    return device;
};



// =========================
// TRANSFER DEVICE
// =========================

exports.transferDevice = async (
    deviceId,
    newClientId
) => {

    const device = await DeviceStatus.findOne({
        deviceId
    });

    if (!device) {
        throw new Error("Device not found");
    }

    const newClient = await User.findById(newClientId);

    if (!newClient) {
        throw new Error("Target client not found");
    }

    device.clientId = newClientId;
    device.assigned = true;

    await device.save();

    return device;
};



// =========================
// DEVICE HEARTBEAT (ESP32)
// =========================

exports.updateHeartbeat = async (deviceId) => {

    return await DeviceStatus.findOneAndUpdate(

        { deviceId },

        {
            lastHeartbeat: new Date(),
            internetStatus: "online"
        },

        { new: true }
    );
};



// =========================
// OFFLINE CHECK
// =========================

exports.markOfflineDevices = async () => {

    const threshold =
        new Date(Date.now() - 5 * 60 * 1000); // 5 mins

    return await DeviceStatus.updateMany(

        {
            lastHeartbeat: { $lt: threshold }
        },

        {
            internetStatus: "offline"
        }
    );
};