const express = require("express");
const {
  addTodoTask,
  todoList,
  deleteTask,
  updateTask,
  getSingleTask,
  deleteManyTasks,
  toggleTodoStatus,
  getTodoDashboard,
} = require("../controllers/todoController");
const verifyToken = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, getTodoDashboard);
router.post("/add-task", verifyToken, addTodoTask);
router.get("/list", verifyToken, todoList);
router.get("/:id", verifyToken, getSingleTask);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);
router.delete("/", verifyToken, deleteManyTasks);
router.patch("/:id/status", verifyToken, toggleTodoStatus);

module.exports = router;
