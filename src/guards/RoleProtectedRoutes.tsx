import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const RoleProtectedRoute = ({ 
  children,
  allowedRoles 
}: { 
  children: React.ReactNode,
  allowedRoles: string[]
}) => {
  const user = useAuthStore((state) => state.user);
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/user'} replace />;
  }
  
  return <>{children}</>;
};

export default RoleProtectedRoute;