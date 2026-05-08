const router = require("express").Router();

const faultController =
require("../controllers/faultController");

const authMiddleware =
require("../middlewares/authMiddleware");

const adminMiddleware =
require("../middlewares/adminMiddleware");

router.get(
    "/",
    authMiddleware,
    faultController.clientFaultsPage
);

router.post(
    "/resolve/:id",
    authMiddleware,
    adminMiddleware,
    faultController.resolveFault
);

module.exports = router;