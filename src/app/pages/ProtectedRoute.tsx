import React, { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

interface ProtectedRouteProps {
  children?: ReactNode;
  user: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children ? (
    children
  ) : (
    <section className="relative">
      <div className="fixed top-0 left-0 h-screen bg-sidebar sidebar-width">
        {/* <Sidebar /> */}
      </div>

      <div className="main-width md:pr-4">
        {/* <Navbar /> */}
        <Outlet />
      </div>
    </section>
  );
};

export default ProtectedRoute;
