import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import "./Layout.css";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminMenuItems = [
    { path: "/admin/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/admin/projects", icon: "📁", label: "Projects" },
    { path: "/admin/tasks", icon: "✅", label: "Tasks" },
    { path: "/admin/users", icon: "👥", label: "Team Members" },
  ];

  const memberMenuItems = [
    { path: "/member/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/member/tasks", icon: "✅", label: "My Tasks" },
  ];

  const menuItems =
    user?.role === "admin" ? adminMenuItems : memberMenuItems;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>📋 TaskFlow</h2>
        <p>Project Management</p>
      </div>

      <div className="sidebar-menu">
        <div className="menu-section">
          <div className="menu-section-title">
            {user?.role === "admin" ? "Admin Panel" : "My Workspace"}
          </div>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              <span className="menu-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h4>{user?.name}</h4>
            <p>{user?.role}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;