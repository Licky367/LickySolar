const router = require("express").Router();

const adminController =
require("../controllers/adminController");

const authMiddleware =
require("../middlewares/authMiddleware");

const adminMiddleware =
require("../middlewares/adminMiddleware");

const superAdminMiddleware =
require("../middlewares/superAdminMiddleware");


// =========================
// GLOBAL MIDDLEWARE
// =========================

router.use(authMiddleware, adminMiddleware);


// =========================
// CLIENTS
// =========================

router.get(
    "/clients",
    adminController.clientsPage
);

router.get(
    "/client/:id",
    adminController.clientDetailsPage
);


// =========================
// ADMINS
// =========================

router.get(
    "/admins",
    adminController.adminsPage
);


// =========================
// INVITE ADMIN (SUPER ADMIN)
// =========================

router.get(
    "/invite-admin",
    superAdminMiddleware,
    adminController.getInvitePage
);

router.post(
    "/invite-admin",
    superAdminMiddleware,
    adminController.inviteAdmin
);


// =========================
// DEVICES
// =========================

// 📋 List all devices
router.get(
    "/devices",
    adminController.devicesPage
);


// =========================
// 🔥 DEVICE CONFIG (NEW FLOW)
// =========================

// Render config page (replaces create-device.ejs)
router.get(
    "/devices/config",
    adminController.getDeviceConfigPage
);

// Create device (from config page)
router.post(
    "/devices/create",
    adminController.createDevice
);


// =========================
// DEVICE ASSIGNMENT
// =========================

// Assign page (MAC + Email)
router.get(
    "/devices/assign",
    adminController.assignDevicePage
);

// Assign action
router.post(
    "/devices/assign",
    adminController.assignDevice
);

// Unassign device
router.post(
    "/devices/unassign",
    adminController.unassignDevice
);


module.exports = router;