import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/authContext";
import "../Admin/Dashboard.css";
import "../Admin/Pages.css";

const MemberDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axiosInstance.get("/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;

  const stats = [
    { label: "My Tasks", value: tasks.length, icon: "✅", color: "#667eea" },
    { label: "In Progress", value: inProgressTasks, icon: "⏳", color: "#ed8936" },
    { label: "Completed", value: completedTasks, icon: "🏆", color: "#48bb78" },
    { label: "Pending", value: pendingTasks, icon: "📋", color: "#e53e3e" },
  ];

  return (
    <DashboardLayout
      title="My Dashboard"
      subtitle={`Welcome back, ${user?.name}!`}
    >
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-icon" style={{ background: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">My Recent Tasks</h2>
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state"><p>No tasks assigned to you yet!</p></div>
        ) : (
          <div className="tasks-list">
            {tasks.slice(0, 5).map((task) => (
              <div className="task-item" key={task._id}>
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p>{task.project?.name || "No project"}</p>
                </div>
                <div className="task-meta">
                  <span className={`priority-badge ${task.priority}`}>
                    {task.priority}
                  </span>
                  <span className={`status-badge ${task.status}`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MemberDashboard;