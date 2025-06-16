import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
interface RoleGuardProps {
  allowedRoles: string[];
}
const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
  const {user, isAuthenticated} = useAuthStore((state) => state);
  debugger;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};
export default RoleGuard;