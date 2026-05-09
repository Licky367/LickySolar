const router = require("express").Router();

const controller =
require("../controllers/deviceAdminController");

const auth =
require("../middlewares/authMiddleware");

const admin =
require("../middlewares/adminMiddleware");


router.get(
    "/devices",
    auth,
    admin,
    controller.devicesPage
);

router.get(
    "/devices/create",
    auth,
    admin,
    controller.getCreateDevicePage
);

router.post(
    "/devices/create",
    auth,
    admin,
    controller.createDevice
);

router.get(
    "/devices/assign",
    auth,
    admin,
    controller.getAssignPage
);

router.post(
    "/devices/assign",
    auth,
    admin,
    controller.assignDevice
);

module.exports = router;