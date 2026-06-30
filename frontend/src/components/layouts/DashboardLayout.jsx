import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Layout.css";

const DashboardLayout = ({ children, title, subtitle }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title={title} subtitle={subtitle} />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;