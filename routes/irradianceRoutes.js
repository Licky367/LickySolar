const express = require("express");
const router = express.Router();

const irradianceController = require("../controllers/irradianceController");

// Dashboard + filter
router.get("/", irradianceController.irradianceDashboard);

module.exports = router;