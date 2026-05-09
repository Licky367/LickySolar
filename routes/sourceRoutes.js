const router = require("express").Router();

const sourceController =
require("../controllers/sourceController");

const authMiddleware =
require("../middlewares/authMiddleware");

const clientMiddleware =
require("../middlewares/clientMiddleware");


// All routes require client login
router.use(authMiddleware, clientMiddleware);


// Source monitoring page
router.get(
    "/source",
    sourceController.sourcePage
);

module.exports = router;