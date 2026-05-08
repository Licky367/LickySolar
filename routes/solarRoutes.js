const router = require("express").Router();

const solarController =
require("../controllers/solarController");

const authMiddleware =
require("../middlewares/authMiddleware");

router.post(
    "/",
    solarController.createReading
);

router.get(
    "/history",
    authMiddleware,
    solarController.clientSolarPage
);

module.exports = router;