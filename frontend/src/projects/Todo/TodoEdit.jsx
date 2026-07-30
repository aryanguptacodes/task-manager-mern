import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const TodoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    getTask();
  }, []);

  const getTask = async () => {
    const { data } = await api.get(`/todo/${id}`);
    setTask({
      title: data.todo.title,
      description: data.todo.description,
    });
  };

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/todo/${id}`, task);
      navigate("/todo");
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };
  return (
    <div className="todo-form-container">
      <div className="todo-form-card">
        <h2>Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="Enter task title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              placeholder="Enter task description"
            ></textarea>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/todo")}
            >
              Cancel
            </button>

            <button type="submit" className="update-btn">
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoEdit;
