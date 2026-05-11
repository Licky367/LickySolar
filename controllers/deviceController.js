const deviceService =
require("../services/deviceService");


// =========================
// HEARTBEAT
// =========================
exports.heartbeat = async(req,res)=>{
    try{

        const { deviceId, apiKey } = req.body;

        await deviceService.validateDevice(
            deviceId,
            apiKey
        );

        await deviceService.updateHeartbeat(
            deviceId
        );

        res.json({ success:true });

    }catch(error){
        res.status(400).json({
            error:error.message
        });
    }
};


// =========================
// SOLAR READING
// =========================
exports.sendSolarReading = async(req,res)=>{
    try{

        const {
            deviceId,
            apiKey,
            voltage,
            current,
            power,
            temperature
        } = req.body;

        const device =
        await deviceService.validateDevice(
            deviceId,
            apiKey
        );

        await deviceService.saveSolarReading(
            device,
            { voltage, current, power, temperature }
        );

        res.json({ success:true });

    }catch(error){
        res.status(400).json({
            error:error.message
        });
    }
};


// =========================
// BATTERY READING
// =========================
exports.sendBatteryReading = async(req,res)=>{
    try{

        const {
            deviceId,
            apiKey,
            voltage,
            current,
            power,
            percentage,
            temperature
        } = req.body;

        const device =
        await deviceService.validateDevice(
            deviceId,
            apiKey
        );

        await deviceService.saveBatteryReading(
            device,
            {
                voltage,
                current,
                power,
                percentage,
                temperature
            }
        );

        res.json({ success:true });

    }catch(error){
        res.status(400).json({
            error:error.message
        });
    }
};


// =========================
// GRID READING
// =========================
exports.sendGridReading = async(req,res)=>{
    try{

        const {
            deviceId,
            apiKey,
            voltage,
            current,
            power,
            frequency
        } = req.body;

        const device =
        await deviceService.validateDevice(
            deviceId,
            apiKey
        );

        await deviceService.saveGridReading(
            device,
            {
                voltage,
                current,
                power,
                frequency
            }
        );

        res.json({ success:true });

    }catch(error){
        res.status(400).json({
            error:error.message
        });
    }
};


// =========================
// SOURCE TRANSITION
// =========================
exports.logTransition = async(req,res)=>{
    try{

        const {
            deviceId,
            apiKey,
            fromSource,
            toSource,
            reason,
            solarVoltage,
            batteryVoltage,
            gridVoltage,
            loadPower
        } = req.body;

        const device =
        await deviceService.validateDevice(
            deviceId,
            apiKey
        );

        await deviceService.logTransition(
            device,
            {
                fromSource,
                toSource,
                reason,
                solarVoltage,
                batteryVoltage,
                gridVoltage,
                loadPower
            }
        );

        res.json({ success:true });

    }catch(error){
        res.status(400).json({
            error:error.message
        });
    }
};