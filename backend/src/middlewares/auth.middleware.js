const jwt = require("jsonwebtoken");
const { User } = require("../models/userModels");

async function verifyToken(req, res, next) {
  try {
    const token = req.cookies.token;
    // console.log(token);
    if (!token) {
      // console.log("aaya invalid mei");

      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded, "decoded mei aaya");

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // console.log(user);
    req.user = user;
    // console.log("miiddd", req.user);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}
module.exports = verifyToken;
