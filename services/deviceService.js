const DeviceStatus =
require("../modules/DeviceStatus");

const SolarReading =
require("../modules/SolarReading");

const BatteryReading =
require("../modules/BatteryReading");

const GridReading =
require("../modules/GridReading");

const SourceTransition =
require("../modules/SourceTransition");


// =========================
// VALIDATE DEVICE
// =========================
exports.validateDevice = async(
    deviceId,
    apiKey
)=>{

    const device =
    await DeviceStatus.findOne({ deviceId });

    if(!device){
        throw new Error("Device not found");
    }

    if(device.apiKey !== apiKey){
        throw new Error("Unauthorized device");
    }

    return device;
};


// =========================
// HEARTBEAT
// =========================
exports.updateHeartbeat = async(deviceId)=>{

    return await DeviceStatus.findOneAndUpdate(

        { deviceId },

        {
            lastHeartbeat:new Date(),
            internetStatus:"online"
        },

        { new:true }
    );
};


// =========================
// SAVE SOLAR
// =========================
exports.saveSolarReading = async(
    device,
    data
)=>{

    await SolarReading.create({
        clientId:device.clientId,
        ...data
    });

    // update device snapshot
    device.lastSolarPower = data.power || 0;
    device.solarActive = true;

    await device.save();
};


// =========================
// SAVE BATTERY
// =========================
exports.saveBatteryReading = async(
    device,
    data
)=>{

    await BatteryReading.create({
        clientId:device.clientId,
        ...data
    });

    device.lastBatteryLevel =
    data.percentage || 0;

    device.batteryActive = true;

    await device.save();
};


// =========================
// SAVE GRID
// =========================
exports.saveGridReading = async(
    device,
    data
)=>{

    await GridReading.create({
        clientId:device.clientId,
        available:true,
        ...data
    });

    device.gridActive = true;

    await device.save();
};


// =========================
// LOG TRANSITION
// =========================
exports.logTransition = async(
    device,
    data
)=>{

    await SourceTransition.create({
        clientId:device.clientId,
        ...data
    });

    // update active source
    device.activeSource = data.toSource;

    await device.save();
};