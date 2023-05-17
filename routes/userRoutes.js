const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const { isEmailExist } = require("../middleware/userMiddlewares");
const { auth, encryptPwd } = require("../middleware/authMiddleware");

router.param("userId", userControllers.checkId);

router.get("/", auth, userControllers.getUsers);

router.post("/signup", isEmailExist, encryptPwd, userControllers.signup);

router.put("/:userId", userControllers.update);

router.put("/:userId/email", isEmailExist, userControllers.updateEmail);

router.put("/:userId/password", userControllers.updatePassword);

module.exports = router;
