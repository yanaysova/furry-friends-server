const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const { isUserExist } = require("../middleware/userMiddlewares");
const { validatePwd, auth } = require("../middleware/authMiddleware");

router.post("/login", isUserExist, validatePwd, authControllers.login);

router.post("/refresh", authControllers.refresh);

router.get("/validate", auth, authControllers.validate);

module.exports = router;
