import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Admin/Dashboard";
import ManageProjects from "./pages/Admin/ManageProjects";
import ManageTasks from "./pages/Admin/ManageTasks";
import ManageUsers from "./pages/Admin/ManageUsers";
import MemberDashboard from "./pages/Member/MemberDashboard";
import MemberTasks from "./pages/Member/MemberTasks";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

// Admin only routes
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return user.role === "admin" ? children : <Navigate to="/member/dashboard" />;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <AdminRoute><Dashboard /></AdminRoute>
      } />
      <Route path="/admin/projects" element={
        <AdminRoute><ManageProjects /></AdminRoute>
      } />
      <Route path="/admin/tasks" element={
        <AdminRoute><ManageTasks /></AdminRoute>
      } />
      <Route path="/admin/users" element={
        <AdminRoute><ManageUsers /></AdminRoute>
      } />

      {/* Member Routes */}
      <Route path="/member/dashboard" element={
        <PrivateRoute><MemberDashboard /></PrivateRoute>
      } />
      <Route path="/member/tasks" element={
        <PrivateRoute><MemberTasks /></PrivateRoute>
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;