const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const getProfile = require("../controllers/userController");

const router = express.Router();

router.get("/profile", verifyToken, getProfile);

module.exports = router;
