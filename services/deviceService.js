const DeviceStatus = require("../modules/DeviceStatus");
const SolarReading = require("../modules/SolarReading");
const BatteryReading = require("../modules/BatteryReading");
const GridReading = require("../modules/GridReading");


// =========================
// AUTH DEVICE
// =========================
const validateDevice = async (deviceId, apiKey) => {

    const device = await DeviceStatus.findOne({
        deviceId,
        apiKey
    });

    if (!device) {
        throw new Error("Invalid device credentials");
    }

    return device;
};


// =========================
// REGISTER DEVICE
// =========================
exports.registerDevice = async (data) => {

    const { deviceId, apiKey, macAddress } = data;

    const device =
    await validateDevice(deviceId, apiKey);

    // Save MAC if not set
    if (!device.macAddress) {
        device.macAddress = macAddress;
    }

    device.internetStatus = "online";
    device.lastHeartbeat = new Date();

    await device.save();

    return device;
};


// =========================
// HEARTBEAT
// =========================
exports.heartbeat = async (data) => {

    const { deviceId, apiKey } = data;

    const device =
    await validateDevice(deviceId, apiKey);

    device.lastHeartbeat = new Date();
    device.internetStatus = "online";

    await device.save();
};


// =========================
// SOLAR DATA
// =========================
exports.saveSolar = async (data) => {

    const {
        deviceId,
        apiKey,
        voltage,
        current,
        temperature
    } = data;

    const device =
    await validateDevice(deviceId, apiKey);

    const power = voltage * current;

    const efficiency = voltage > 0
        ? (power / (voltage * current)) * 100
        : 0;

    await SolarReading.create({
        clientId: device.clientId,
        voltage,
        current,
        power,
        efficiency,
        temperature
    });

    device.lastSolarPower = power;
    await device.save();
};


// =========================
// BATTERY DATA
// =========================
exports.saveBattery = async (data) => {

    const {
        deviceId,
        apiKey,
        voltage,
        current,
        percentage,
        temperature
    } = data;

    const device =
    await validateDevice(deviceId, apiKey);

    const power = voltage * current;

    await BatteryReading.create({
        clientId: device.clientId,
        voltage,
        current,
        power,
        percentage,
        temperature
    });

    device.lastBatteryLevel = percentage;
    await device.save();
};


// =========================
// GRID DATA
// =========================
exports.saveGrid = async (data) => {

    const {
        deviceId,
        apiKey,
        voltage,
        current,
        frequency
    } = data;

    const device =
    await validateDevice(deviceId, apiKey);

    const power = voltage * current;

    await GridReading.create({
        clientId: device.clientId,
        voltage,
        current,
        power,
        frequency,
        available: voltage > 0
    });
};