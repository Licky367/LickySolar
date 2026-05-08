const router = require("express").Router();

const gridController =
require("../controllers/gridController");

router.post(
    "/",
    gridController.createReading
);

module.exports = router;