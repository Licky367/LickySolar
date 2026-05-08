const router = require("express").Router();

const dashboardController =
require("../controllers/dashboardController");

const authMiddleware =
require("../middlewares/authMiddleware");

const adminMiddleware =
require("../middlewares/adminMiddleware");

const clientMiddleware =
require("../middlewares/clientMiddleware");

router.get(
    "/",
    authMiddleware,
    clientMiddleware,
    dashboardController.clientDashboard
);

router.get(
    "/admin",
    authMiddleware,
    adminMiddleware,
    dashboardController.adminDashboard
);

module.exports = router;