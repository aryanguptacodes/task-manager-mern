import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import "../../styles/dashboard.css";
import showError from "../../utils/showError";
import { useEffect } from "react";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [counts, setCounts] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    getDashboard();
  }, []);
  const getDashboard = async () => {
    try {
      const { data } = await api.get("/todo");
      setCounts(data.counts);
    } catch (error) {
      showError(error);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>👋 Welcome, {user.name}</h1>
          <p>Stay organized and keep your productivity high.</p>
        </div>

        <div className="dashboard-date">{new Date().toLocaleDateString()}</div>
      </div>

      <div className="stats-grid">
        <div className="stats-card total">
          <div className="icon">📋</div>

          <div>
            <h2>{counts.total}</h2>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stats-card completed">
          <div className="icon">✅</div>

          <div>
            <h2>{counts.completed}</h2>
            <p>Completed</p>
          </div>
        </div>

        <div className="stats-card pending">
          <div className="icon">⏳</div>

          <div>
            <h2>{counts.pending}</h2>
            <p>Pending</p>
          </div>
        </div>
      </div>

      <div className="progress-card">
        <h3>Task Progress</h3>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${
                counts.total === 0 ? 0 : (counts.completed / counts.total) * 100
              }%`,
            }}
          />
        </div>

        <p>
          {counts.total === 0
            ? "0%"
            : Math.round((counts.completed / counts.total) * 100)}
          % Completed
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
