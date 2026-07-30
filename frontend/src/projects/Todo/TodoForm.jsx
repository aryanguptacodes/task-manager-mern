import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/TodoForm.css";

const TodoForm = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: "",
    description: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!task.title.trim()) {
      return alert("Title is required.");
    }

    if (!task.description.trim()) {
      return alert("Description is required.");
    }

    try {
      const { data } = await api.post("/todo/add-task", task);

      alert(data.message);

      // Clear Form
      setTask({
        title: "",
        description: "",
      });

      // Redirect to Todo List
      navigate("/todo");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="todo-form-container">
      <div className="todo-form-card">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Title</label>

            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter task title"
              value={task.title}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              name="description"
              rows="5"
              placeholder="Enter task description"
              value={task.description}
              onChange={handleChange}
            />
          </div>

          {/* Button */}
          <button type="submit" className="add-btn">
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;
