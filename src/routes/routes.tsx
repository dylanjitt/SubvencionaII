import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import { Layout } from "../layout/Layout";
// import DashboardPage from "../pages/Dashboard";
// import RegisterPage from "../pages/Register";
import ProtectedRoutes from "../guards/ProtectedRoutes";
import RoleProtectedRoute from "../guards/RoleProtectedRoutes";
import LoginPage from "../pages/Login";
import DashboardPage from "../pages/Dashboard";
import { Layout } from "../layout/layout";
import AdminDashboard from "../pages/AdminDashdoard";
import { useAuthStore } from "../store/authStore";
import { ReportsPage } from "../pages/Reports";
// import ProjectPage from "../pages/projects/ProjectPage";

export const AppRoutes = () => {
  const {user}=useAuthStore()
  console.log(user)
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
          {/* TODO: Correct the actual Component: AdminDashboard */}
          <Route path="admin" element={<ReportsPage/>}>
            <Route path="reports" element={<ReportsPage/>}/>
          </Route>

        </Route>
        {/* <Route path="/" element={<Navigate to={!user?'/login':(user.role==='user'?"/user":"/admin")} replace />} /> */}
        <Route path="/" element={<Navigate to={user.role==='user'?"/user":"/admin"} replace />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>

  )
}