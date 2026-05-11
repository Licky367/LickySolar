const router = require("express").Router();

const deviceController =
require("../../controllers/deviceController");


// =========================
// DEVICE HEARTBEAT
// =========================
router.post(
    "/heartbeat",
    deviceController.heartbeat
);


// =========================
// SOLAR DATA
// =========================
router.post(
    "/solar",
    deviceController.sendSolarReading
);


// =========================
// BATTERY DATA
// =========================
router.post(
    "/battery",
    deviceController.sendBatteryReading
);


// =========================
// GRID DATA
// =========================
router.post(
    "/grid",
    deviceController.sendGridReading
);


// =========================
// SOURCE TRANSITION
// =========================
router.post(
    "/transition",
    deviceController.logTransition
);


module.exports = router;