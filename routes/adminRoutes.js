const router = require("express").Router();

const adminController =
require("../controllers/adminController");

const authMiddleware =
require("../middlewares/authMiddleware");

const adminMiddleware =
require("../middlewares/adminMiddleware");

const superAdminMiddleware =
require("../middlewares/superAdminMiddleware");

router.get(
    "/clients",
    authMiddleware,
    adminMiddleware,
    adminController.clientsPage
);

router.get(
    "/client/:id",
    authMiddleware,
    adminMiddleware,
    adminController.clientDetailsPage
);

router.get(
    "/admins",
    authMiddleware,
    adminMiddleware,
    adminController.adminsPage
);

router.get(
    "/invite-admin",
    authMiddleware,
    superAdminMiddleware,
    adminController.getInvitePage
);

router.post(
    "/invite-admin",
    authMiddleware,
    superAdminMiddleware,
    adminController.inviteAdmin
);

module.exports = router;