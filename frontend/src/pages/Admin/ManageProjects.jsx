import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import "./Dashboard.css";
import "./Pages.css";

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", status: "active", members: [] });
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreateModal = () => {
    setEditProject(null);
    setForm({ name: "", description: "", status: "active" });
    setError("");
    setShowModal(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editProject) {
        await axiosInstance.put(`/projects/${editProject._id}`, form);
      } else {
        await axiosInstance.post("/projects", form);
      }
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axiosInstance.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
  try {
    const [projectsRes, usersRes] = await Promise.all([
      axiosInstance.get("/projects"),
      axiosInstance.get("/auth/users"),
    ]);
    setProjects(projectsRes.data);
    setUsers(usersRes.data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => { fetchData(); }, []);

const openEditModal = (project) => {
  setEditProject(project);
  setForm({
    name: project.name,
    description: project.description,
    status: project.status,
    members: project.members?.map((m) => m._id) || [],
  });
  setError("");
  setShowModal(true);
};

  return (
    <DashboardLayout title="Projects" subtitle="Manage all your projects">
      <div className="page-header">
        <div>
          <h2>All Projects</h2>
          <p>{projects.length} projects total</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          ➕ New Project
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <p>No projects yet. Create your first project!</p>
        </div>
      ) : (
        <div className="cards-grid">
          {projects.map((project) => (
            <div className="card" key={project._id}>
              <div className="card-header">
                <h3>{project.name}</h3>
                <span className={`status-badge ${project.status}`}>
                  {project.status}
                </span>
              </div>
              <p>{project.description || "No description provided"}</p>
              <div className="card-footer">
                <span style={{ fontSize: "12px", color: "#aaa" }}>
                  👥 {project.members?.length || 0} members
                </span>
                <div className="card-actions">
                  <button className="btn-edit" onClick={() => openEditModal(project)}>
                    ✏️ Edit
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(project._id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editProject ? "Edit Project" : "Create New Project"}</h3>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  placeholder="Enter project name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Enter project description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
  <label>Team Members</label>
  <select
    multiple
    value={form.members}
    onChange={(e) =>
      setForm({
        ...form,
        members: Array.from(
          e.target.selectedOptions,
          (option) => option.value
        ),
      })
    }
    style={{
      height: "120px",
      padding: "8px",
    }}
  >
    {users.map((u) => (
      <option key={u._id} value={u._id}>
        {u.name} ({u.role})
      </option>
    ))}
  </select>
  <small style={{ color: "#888", fontSize: "12px" }}>
    💡 Hold Ctrl (Windows) or Cmd (Mac) to select multiple members
  </small>
</div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageProjects;