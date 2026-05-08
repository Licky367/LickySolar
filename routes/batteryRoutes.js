const router = require("express").Router();

const batteryController =
require("../controllers/batteryController");

const authMiddleware =
require("../middlewares/authMiddleware");

router.post(
    "/",
    batteryController.createReading
);

router.get(
    "/history",
    authMiddleware,
    batteryController.clientBatteryPage
);

module.exports = router;