const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const { isUserExist, isEmailExist } = require("../middleware/userMiddlewares");
const {
  encryptPwd,
  validatePwd,
  auth,
} = require("../middleware/authMiddleware");

router.post("/signup", isEmailExist, encryptPwd, authControllers.signup);

router.post("/login", isUserExist, validatePwd, authControllers.login);

router.post("/refresh", authControllers.refresh);

router.get("/validate", auth, authControllers.validate);

router.post("/logout", authControllers.logout);

module.exports = router;
