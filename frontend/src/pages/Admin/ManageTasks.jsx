import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import "./Dashboard.css";
import "./Pages.css";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", project: "",
    assignedTo: "", priority: "medium", dueDate: "", status: "pending",
  });

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        axiosInstance.get("/tasks"),
        axiosInstance.get("/projects"),
        axiosInstance.get("/auth/users"),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axiosInstance.post("/tasks", {
        ...form,
        assignedTo: form.assignedTo ? [form.assignedTo] : [],
      });
      setShowModal(false);
      setForm({ title: "", description: "", project: "", assignedTo: "", priority: "medium", dueDate: "", status: "pending" });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axiosInstance.put(`/tasks/${taskId}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout title="Tasks" subtitle="Manage and assign tasks">
      <div className="page-header">
        <div>
          <h2>All Tasks</h2>
          <p>{tasks.length} tasks total</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          ➕ New Task
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state"><p>No tasks yet. Create your first task!</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>
                    <strong>{task.title}</strong>
                    <p style={{ fontSize: "12px", color: "#888", margin: "2px 0 0" }}>
                      {task.description?.slice(0, 40)}...
                    </p>
                  </td>
                  <td>{task.project?.name || "—"}</td>
                  <td>
                    {task.assignedTo?.map((u) => u.name).join(", ") || "Unassigned"}
                  </td>
                  <td>
                    <span className={`priority-badge ${task.priority}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #e8e8e8", fontSize: "13px" }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn-danger" onClick={() => handleDelete(task._id)}>
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Task Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Task</h3>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Task Title</label>
                <input type="text" placeholder="Enter task title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Task description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Project</label>
                <select value={form.project}
                  onChange={(e) => setForm({ ...form, project: e.target.value })}
                  required>
                  <option value="">Select a project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select value={form.assignedTo}
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                  <option value="">Select a team member</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageTasks;