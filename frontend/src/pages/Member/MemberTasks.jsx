import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import "../Admin/Dashboard.css";
import "../Admin/Pages.css";

const MemberTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { fetchTasks(); }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axiosInstance.put(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout title="My Tasks" subtitle="View and update your tasks">
      <div className="page-header">
        <div>
          <h2>My Tasks</h2>
          <p>{tasks.length} tasks assigned to you</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state"><p>No tasks assigned to you yet!</p></div>
      ) : (
        <div className="cards-grid">
          {tasks.map((task) => (
            <div className="card" key={task._id}>
              <div className="card-header">
                <h3>{task.title}</h3>
                <span className={`priority-badge ${task.priority}`}>
                  {task.priority}
                </span>
              </div>
              <p>{task.description || "No description"}</p>

              <div className="progress-bar-container">
                <div className="progress-bar-label">
                  <span>Progress</span>
                  <span>{task.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>

              <div className="card-footer">
                <span style={{ fontSize: "12px", color: "#aaa" }}>
                  📁 {task.project?.name || "No project"}
                </span>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  style={{ padding: "6px 10px", borderRadius: "8px", border: "1px solid #e8e8e8", fontSize: "13px" }}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MemberTasks;