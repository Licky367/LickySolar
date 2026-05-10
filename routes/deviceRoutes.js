const router = require("express").Router();

const deviceController =
require("../../controllers/deviceController");


// =========================
// DEVICE REGISTER (FIRST CALL)
// =========================
router.post(
    "/register",
    deviceController.registerDevice
);


// =========================
// HEARTBEAT (ONLINE STATUS)
// =========================
router.post(
    "/heartbeat",
    deviceController.heartbeat
);


// =========================
// SEND SOLAR DATA
// =========================
router.post(
    "/solar",
    deviceController.sendSolarData
);


// =========================
// SEND BATTERY DATA
// =========================
router.post(
    "/battery",
    deviceController.sendBatteryData
);


// =========================
// SEND GRID DATA
// =========================
router.post(
    "/grid",
    deviceController.sendGridData
);


module.exports = router;