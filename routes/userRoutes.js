const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const { isEmailExist } = require("../middleware/userMiddlewares");
const {
  auth,
  validatePwd,
  replacePwd,
  encryptPwd,
  checkAdmin,
} = require("../middleware/authMiddleware");

router.get("/", auth, userControllers.getUsers);

router.put("/:userId/role", auth, checkAdmin, userControllers.changeRole);

router.get("/:id/all", auth, userControllers.getUserAll);

router.put("/:userId/email", auth, isEmailExist, userControllers.updateEmail);

router.put("/:userId", auth, userControllers.updateInfo);

router.put(
  "/:userId/password",
  auth,
  validatePwd,
  replacePwd,
  encryptPwd,
  userControllers.updatePassword
);

module.exports = router;
