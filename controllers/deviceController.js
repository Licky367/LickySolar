const deviceService =
require("../services/deviceService");


// =========================
// REGISTER DEVICE
// =========================
exports.registerDevice = async (req, res) => {

    try {

        const result =
        await deviceService.registerDevice(req.body);

        res.json({
            success: true,
            data: result
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};


// =========================
// HEARTBEAT
// =========================
exports.heartbeat = async (req, res) => {

    try {

        await deviceService.heartbeat(req.body);

        res.json({ success: true });

    } catch (error) {

        res.status(400).json({
            error: error.message
        });
    }
};


// =========================
// SOLAR DATA
// =========================
exports.sendSolarData = async (req, res) => {

    try {

        await deviceService.saveSolar(req.body);

        res.json({ success: true });

    } catch (error) {

        res.status(400).json({
            error: error.message
        });
    }
};


// =========================
// BATTERY DATA
// =========================
exports.sendBatteryData = async (req, res) => {

    try {

        await deviceService.saveBattery(req.body);

        res.json({ success: true });

    } catch (error) {

        res.status(400).json({
            error: error.message
        });
    }
};


// =========================
// GRID DATA
// =========================
exports.sendGridData = async (req, res) => {

    try {

        await deviceService.saveGrid(req.body);

        res.json({ success: true });

    } catch (error) {

        res.status(400).json({
            error: error.message
        });
    }
};