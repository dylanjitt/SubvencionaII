import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const RoleBasedRedirect = () => {
  const { user } = useAuthStore( state => state);
  if (!user.role) {
    return <Navigate to="/login" replace />;
  }
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  if (user.role === 'client') {
    return <Navigate to="/user" replace />;
  }
};