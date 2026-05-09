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
// APPLY GLOBAL MIDDLEWARES
// =========================

// All admin routes require login + admin role
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
// INVITE ADMIN (SUPER ADMIN ONLY)
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

// List devices
router.get(
    "/devices",
    adminController.devicesPage
);

// Create device
router.get(
    "/devices/create",
    adminController.getCreateDevicePage
);

router.post(
    "/devices/create",
    adminController.createDevice
);


// =========================
// DEVICE ASSIGNMENT
// =========================

// Assign page
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