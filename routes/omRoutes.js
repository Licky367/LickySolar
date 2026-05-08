const router = require("express").Router();

const omController =
require("../controllers/omController");

const authMiddleware =
require("../middlewares/authMiddleware");

const adminMiddleware =
require("../middlewares/adminMiddleware");

router.get(
    "/request",
    authMiddleware,
    omController.getRequestPage
);

router.post(
    "/request",
    authMiddleware,
    omController.createRequest
);

router.get(
    "/history",
    authMiddleware,
    omController.clientRequestHistory
);

router.get(
    "/admin/om",
    authMiddleware,
    adminMiddleware,
    omController.adminRequestsPage
);

router.post(
    "/admin/om/:id",
    authMiddleware,
    adminMiddleware,
    omController.updateRequest
);

module.exports = router;