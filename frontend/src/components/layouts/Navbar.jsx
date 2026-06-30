import { useAuth } from "../../context/authContext";
import "./Layout.css";

const Navbar = ({ title, subtitle }) => {
  const { user } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar-title">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          <div className="navbar-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="navbar-user-name">{user?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;