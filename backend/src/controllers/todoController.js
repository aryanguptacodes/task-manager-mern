const Todo = require("../models/todoModels");

async function addTodoTask(req, res) {
  try {
    const { title, description } = req.body;

    // console.log(title, description, "fdsfdfsd");

    const todoTask = await Todo.create({
      title,
      description,
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Task added Successfully",
      task: {
        title,
        description,
      },
    });
    // console.log(req.params.id); // Route parameter
    // console.log(req.query.page); // Query parameter
    // console.log(req.body); // Body data
    // console.log(req.headers.authorization); // Header
    // console.log(req.method); // POST
    // console.log(req.url); // Full URL
    // console.log(req.ip); // Client IP

    // console.log("aaya addd mei axios se");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server",
      error: error.message,
    });
  }
}

async function todoList(req, res) {
  try {
    // console.log("chala list");
    const { search = "", filter = "all", page = 1, limit = 10 } = req.query;
    const keyword = search.trim();
    const currentPage = Number(page);
    const pageSize = Number(limit);

    let query = {
      user: req.user._id,
    };

    if (keyword) {
      query.$or = [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    if (filter === "completed") {
      query.completed = true;
    }
    // if (filter === "pending") { this is line is ggod for fresher
    //   query.completed = false;
    // }
    else if (filter === "pending") {
      // this is better and very readable
      query.completed = false;
    }
    const todos = await Todo.find(query)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);
    const totalTasks = await Todo.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "TodoList data fetched",
      todos,
      pagination: {
        currentPage,
        pageSize,
        totalTasks,
        totalPages: Math.ceil(totalTasks / pageSize),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      todo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function updateTask(req, res) {
  try {
    // const { id } = req.params;
    const { title, description } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true, runValidators: true },
    );
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      todo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getSingleTask(req, res) {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Task not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: " Task fetched",
      todo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function deleteManyTasks(req, res) {
  try {
    const { ids } = req.body;
    const allDeleteTask = await Todo.deleteMany({
      _id: { $in: ids },
    });

    return res.status(200).json({
      success: true,
      message: `${allDeleteTask.deletedCount} task(s) deleted successfully.`,
      deletedCount: allDeleteTask.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function toggleTodoStatus(req, res) {
  try {
    // console.log(req.params);
    const { id } = req.params;
    const todo = await Todo.findOne({
      _id: id,
      user: req.user._id,
    });
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    todo.completed = !todo.completed;
    await todo.save();

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      todo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getTodoDashboard(req, res) {
  try {
    const total = await Todo.countDocuments({
      user: req.user._id,
    });
    const completed = await Todo.countDocuments({
      user: req.user._id,
      completed: true,
    });
    const pending = await Todo.countDocuments({
      user: req.user._id,
      completed: false,
    });
    return res.status(200).json({
      success: true,
      counts: {
        total,
        completed,
        pending,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
module.exports = {
  addTodoTask,
  todoList,
  deleteTask,
  updateTask,
  getSingleTask,
  deleteManyTasks,
  toggleTodoStatus,
  getTodoDashboard,
};
