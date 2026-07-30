import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import "../../styles/TaskList.css";
import Loader from "../../components/Loader"; // Update path if needed
import showError from "../../utils/showError";

const TodoList = () => {
  const [todoList, setTodoList] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);
  const [searchTask, setSearchTask] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTask);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTask]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filter]);

  useEffect(() => {
    getTodoList();
  }, [page, debouncedSearch, filter]);

  // const getTodoList = async () => {
  //   setLoading(true);

  //   try {
  //     const { data } = await api.get("/todo/list");
  //     // console.log(data);

  //     setTodoList(data.todos);
  //   } catch (error) {
  //     showError(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getTodoList = async () => {
    setLoading(true);

    try {
      const { data } = await api.get(`/todo/list/`, {
        params: {
          search: debouncedSearch.trim(),
          filter,
          page,
          limit,
        },
      });
      // console.log(data);

      setTodoList(data.todos);
      setPagination(data.pagination);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmDelete) return;

    try {
      const { data } = await api.delete(`/todo/${id}`);

      toast.success(data.message);

      setSelectedTask((prev) => prev.filter((item) => item !== id));

      if (todoList.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        getTodoList();
      }
    } catch (error) {
      showError(error);
    }
  };

  const selectAllTask = (e) => {
    if (e.target.checked) {
      setSelectedTask(todoList.map((task) => task._id));
    } else {
      setSelectedTask([]);
    }
  };

  const selectSingleTask = (id) => {
    setSelectedTask((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const deleteMultiple = async () => {
    if (selectedTask.length === 0) {
      toast.error("Please select at least one task.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected tasks?",
    );

    if (!confirmDelete) return;

    try {
      const { data } = await api.delete("/todo", {
        data: {
          ids: selectedTask,
        },
      });

      toast.success(data.message);

      setSelectedTask([]);

      if (todoList.length === selectedTask.length && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        getTodoList();
      }
    } catch (error) {
      showError(error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const { data } = await api.patch(`/todo/${id}/status`);

      toast.success(data.message);

      setTodoList((prev) =>
        prev.map((task) => (task._id === id ? data.todo : task)),
      );
    } catch (error) {
      showError(error);
    }
  };

  // const handleSearch = async (e) => {
  //   try {
  //     const value = e.target.value;
  //     console.log(setSearchTask(value));
  //     const { data } = await api.get(`/todo/list/?search=${value}`);
  //     setTodoList(data.todos);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="todo-page">
      <div className="todo-header">
        <div>
          <h1>📝 My Tasks</h1>
          <p>Manage your daily work efficiently.</p>
        </div>
      </div>

      {/* Search + Filter */}

      <div className="top-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={searchTask}
            onChange={(e) => setSearchTask(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <label>Status</label>

          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Statistics */}

      <div className="stats">
        <div className="stat-card">
          <h2>{todoList.length}</h2>
          <span>Total</span>
        </div>

        <div className="stat-card green">
          <h2>{todoList.filter((task) => task.completed).length}</h2>

          <span>Completed</span>
        </div>

        <div className="stat-card yellow">
          <h2>{todoList.filter((task) => !task.completed).length}</h2>

          <span>Pending</span>
        </div>
      </div>

      {todoList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>

          <h2>No Tasks Found</h2>

          <p>
            {searchTask
              ? "Try another keyword."
              : "Create your first task to get started."}
          </p>
        </div>
      ) : (
        <>
          <div className="todo-toolbar">
            <button className="delete-all-btn" onClick={deleteMultiple}>
              🗑 Delete Selected
            </button>

            <label className="select-all">
              <input
                type="checkbox"
                checked={
                  todoList.length > 0 && selectedTask.length === todoList.length
                }
                onChange={selectAllTask}
              />
              Select All
            </label>
          </div>

          <div className="todo-list">
            {todoList.map((task) => (
              <div className="todo-card" key={task._id}>
                <div className="card-top">
                  <input
                    type="checkbox"
                    checked={selectedTask.includes(task._id)}
                    onChange={() => selectSingleTask(task._id)}
                  />

                  <span
                    className={
                      task.completed ? "badge completed" : "badge pending"
                    }
                  >
                    {task.completed ? "🟢 Completed" : "🟡 Pending"}
                  </span>
                </div>

                <h3 className={task.completed ? "completed-task" : ""}>
                  {task.title}
                </h3>

                <p className={task.completed ? "completed-task" : ""}>
                  {task.description}
                </p>

                <label className="complete-checkbox">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleStatus(task._id)}
                  />
                  Mark as Completed
                </label>

                <div className="card-footer">
                  <small>
                    📅 {new Date(task.createdAt).toLocaleDateString()}
                  </small>

                  <div className="actions">
                    <Link className="edit-btn" to={`/todo/${task._id}`}>
                      ✏ Edit
                    </Link>

                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task._id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              ← Previous
            </button>

            <div className="page-info">
              <span>Page</span>

              <strong>{pagination.currentPage}</strong>

              <span>of</span>

              <strong>{pagination.totalPages}</strong>
            </div>

            <button
              className="page-btn"
              disabled={page === pagination.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoList;
