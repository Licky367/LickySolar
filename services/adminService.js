const User = require("../modules/User");
const AdminInvite = require("../modules/AdminInvite");
const DeviceStatus = require("../modules/DeviceStatus");
const crypto = require("crypto");


// =========================
// HELPERS
// =========================

// 🔐 Generate API key
const generateApiKey = () => {
    return crypto.randomBytes(24).toString("hex");
};

// 🔥 Normalize MAC
const normalizeMac = (mac) => {
    if (!mac) return null;
    return mac.trim().toUpperCase();
};


// =========================
// CLIENTS
// =========================

exports.getClients = async () => {
    return await User
        .find({ role: "client" })
        .sort({ createdAt: -1 });
};


exports.getClientWithDevice = async (id) => {

    const client = await User.findById(id);

    if (!client) return { client: null, device: null };

    const device = await DeviceStatus.findOne({
        clientId: id
    });

    return { client, device };
};


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
// CREATE DEVICE
// =========================

exports.createDevice = async (data) => {

    if (!data.deviceId || !data.deviceId.trim()) {
        throw new Error("Device ID is required");
    }

    const deviceId = data.deviceId.trim();

    // Unique deviceId
    const existing = await DeviceStatus.findOne({ deviceId });

    if (existing) {
        throw new Error("Device already exists");
    }

    let macAddress = normalizeMac(data.macAddress);

    // Validate MAC
    if (macAddress) {

        const macRegex =
            /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/;

        if (!macRegex.test(macAddress)) {
            throw new Error("Invalid MAC address format");
        }

        const existingMac =
            await DeviceStatus.findOne({ macAddress });

        if (existingMac) {
            throw new Error("MAC address already registered");
        }
    }

    const apiKey = generateApiKey();

    const device = await DeviceStatus.create({

        deviceId,
        name: data.name || "Solar Device",
        location: data.location || "",
        macAddress: macAddress || null,

        apiKey,
        assigned: false,

        internetStatus: "offline",
        lastHeartbeat: null
    });

    return device;
};


// =========================
// GET DEVICES
// =========================

exports.getAllDevices = async () => {
    return await DeviceStatus
        .find()
        .populate("clientId")
        .sort({ createdAt: -1 });
};


exports.getUnassignedDevices = async () => {
    return await DeviceStatus.find({ assigned: false });
};


exports.getDeviceByDeviceId = async (deviceId) => {
    return await DeviceStatus.findOne({ deviceId });
};


exports.getDeviceByMac = async (macAddress) => {
    return await DeviceStatus.findOne({
        macAddress: normalizeMac(macAddress)
    });
};


// =========================
// ✅ ASSIGN DEVICE (FIXED)
// =========================

exports.assignDeviceByMacAndEmail = async (
    macAddress,
    email
) => {

    if (!macAddress || !email) {
        throw new Error("MAC address and email are required");
    }

    macAddress = normalizeMac(macAddress);

    // 🔥 Find device
    const device = await DeviceStatus.findOne({ macAddress });

    if (!device) {
        throw new Error(
            "Device not found. Ensure ESP32 has connected at least once."
        );
    }

    if (device.assigned) {
        throw new Error("Device already assigned");
    }

    // 🔥 Find client
    const client = await User.findOne({
        email: email.trim(),
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

    const device = await DeviceStatus.findOne({ deviceId });

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

exports.transferDevice = async (deviceId, newClientId) => {

    const device = await DeviceStatus.findOne({ deviceId });

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
// HEARTBEAT (ESP32)
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
        new Date(Date.now() - 5 * 60 * 1000);

    return await DeviceStatus.updateMany(
        { lastHeartbeat: { $lt: threshold } },
        { internetStatus: "offline" }
    );
};