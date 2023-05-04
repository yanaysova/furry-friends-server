const express = require("express");
const router = express.Router();
const { validateBody } = require("../middleware/validateBody");
const { userSchema, emailSchema } = require("../schemas/allSchemas");
const usersController = require("../controllers/usersController");
const { isEmailExists } = require("../middleware/usersMiddleware");

router.param("userId", usersController.checkId);

router.get("/", usersController.getAllUsers);

router.post(
  "/signup",
  validateBody(userSchema),
  isEmailExists,
  usersController.signup
);

router.post("/login", usersController.login);

router.put("/:userId", usersController.update);

router.put(
  "/:userId/email",
  validateBody(emailSchema),
  isEmailExists,
  usersController.updateEmail
);

router.put("/:userId/password", usersController.updatePassword);

module.exports = router;
