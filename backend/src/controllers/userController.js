const User = require("../models/userModels");

async function getProfile(req, res) {
  // console.log("get profile mei aaya");
  
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = getProfile;
