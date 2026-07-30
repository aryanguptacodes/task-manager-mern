const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");
const { loginLimiter } = require("../middlewares/rateLimiter");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/logout", logoutUser);
module.exports = router;
