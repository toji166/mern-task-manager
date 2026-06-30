import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import "./Dashboard.css";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          axiosInstance.get("/projects"),
          axiosInstance.get("/tasks"),
        ]);
        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;

  const stats = [
    { label: "Total Projects", value: projects.length, icon: "📁", color: "#667eea" },
    { label: "Total Tasks", value: totalTasks, icon: "✅", color: "#48bb78" },
    { label: "In Progress", value: inProgressTasks, icon: "⏳", color: "#ed8936" },
    { label: "Completed", value: completedTasks, icon: "🏆", color: "#38b2ac" },
  ];

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="loading">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening."
    >
      {/* Stats Cards */}
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

      {/* Recent Projects */}
      <div className="dashboard-section">
        <h2 className="section-title">Recent Projects</h2>
        {projects.length === 0 ? (
          <div className="empty-state">
            <p>No projects yet. Create your first project!</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.slice(0, 4).map((project) => (
              <div className="project-card" key={project._id}>
                <div className="project-header">
                  <h3>{project.name}</h3>
                  <span className={`status-badge ${project.status}`}>
                    {project.status}
                  </span>
                </div>
                <p>{project.description || "No description"}</p>
                <div className="project-meta">
  <span>
    👥 {project.members?.length || 0} member
    {project.members?.length !== 1 ? "s" : ""}
  </span>
</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Tasks */}
      <div className="dashboard-section">
        <h2 className="section-title">Recent Tasks</h2>
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Create your first task!</p>
          </div>
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

export default Dashboard;