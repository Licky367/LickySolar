const router = require("express").Router();

const authController =
require("../controllers/authController");

router.get(
    "/login",
    authController.getLogin
);

router.get(
    "/signup",
    authController.getSignup
);

router.post(
    "/signup",
    authController.signup
);

router.post(
    "/login",
    authController.login
);

router.get(
    "/logout",
    authController.logout
);

module.exports = router;