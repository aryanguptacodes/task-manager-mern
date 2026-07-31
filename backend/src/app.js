const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Add this line
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    credentials: true,
  }),
);
//auth routes
app.use("/api/v1/auth", authRoutes);

//user routes
app.use("/api/v1/user/", userRoutes);

//todo
app.use("/api/v1/todo", todoRoutes);
module.exports = app;
