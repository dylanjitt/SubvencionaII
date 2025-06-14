import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import { Layout } from "../layout/Layout";
// import DashboardPage from "../pages/Dashboard";
// import RegisterPage from "../pages/Register";
import ProtectedRoutes from "../guards/ProtectedRoutes";
import LoginPage from "../pages/Login";
import DashboardPage from "../pages/Dashboard";
import { Layout } from "../layout/layout";
import AdminDashboard from "../pages/AdminDashdoard";
import { useAuthStore } from "../store/authStore";
// import ProjectPage from "../pages/projects/ProjectPage";

export const AppRoutes = () => {
  const {user}=useAuthStore()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
        path="/"
        element={
          <ProtectedRoutes>
          <Layout />
        </ProtectedRoutes>
        }>
          <Route path="user" element={<DashboardPage/>}/>
          <Route path="admin" element={<AdminDashboard/>}/>

        </Route>
        {/* <Route path="/" element={<Navigate to={!user?'/login':(user.role==='user'?"/user":"/admin")} replace />} /> */}
        <Route path="/" element={<Navigate to={user.role==='user'?"/user":"/admin"} replace />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}