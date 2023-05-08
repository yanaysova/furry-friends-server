const express = require("express");
const router = express.Router();
const { validateBody } = require("../middleware/validateBody");
const { userSchema, emailSchema } = require("../schemas/allSchemas");
const userControllers = require("../controllers/userControllers");
const {
  isEmailExist,
  isUserExist,
  encryptPwd,
  validatePwd,
  generateToken,
} = require("../middleware/userMiddlewares");

router.param("userId", userControllers.checkId);

router.get("/", userControllers.getAllUsers);

router.post("/signup", isEmailExist, encryptPwd, userControllers.signup);

router.post(
  "/login",
  isUserExist,
  validatePwd,
  generateToken,
  userControllers.login
);

router.put("/:userId", userControllers.update);

router.put(
  "/:userId/email",
  validateBody(emailSchema),
  isEmailExist,
  userControllers.updateEmail
);

router.put("/:userId/password", userControllers.updatePassword);

module.exports = router;
