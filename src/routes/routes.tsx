import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import { Layout } from "../layout/Layout";
// import DashboardPage from "../pages/Dashboard";
// import RegisterPage from "../pages/Register";
import ProtectedRoutes from "../guards/ProtectedRoutes";
import LoginPage from "../pages/Login";
import DashboardPage from "../pages/Dashboard";
import { Layout } from "../layout/layout";
import AdminDashboard from "../pages/AdminDashdoard";
// import ProjectPage from "../pages/projects/ProjectPage";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
        path="/app"
        element={
          <ProtectedRoutes>
          <Layout />
        </ProtectedRoutes>
        }>
          <Route path="Dashboard" element={<DashboardPage/>}/>
          <Route path="AdminDashboard" element={<AdminDashboard/>}/>

        </Route>
        <Route path="/" element={<Navigate to="/app/Dashboard" replace />} />
        <Route path="/" element={<Navigate to="/app/AdminDashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}