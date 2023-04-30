const express = require("express");
const router = express.Router();
const { validateBody } = require("../middleware/validateBody");
const { userSchema } = require("../schemas/allSchemas");
const usersController = require("../controllers/usersController");
const { isEmailExists } = require("../middleware/usersMiddleware");

router.get("/", usersController.getAllUsers);

router.post(
  "/signup",
  validateBody(userSchema),
  isEmailExists,
  usersController.signup
);

router.post("/login", usersController.login);

router.put(
  "/:userId",
  (req, res, next) => {},
  (req, res) => {}
);

module.exports = router;
