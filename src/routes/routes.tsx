import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import { Layout } from "../layout/Layout";
// import DashboardPage from "../pages/Dashboard";
// import RegisterPage from "../pages/Register";
import ProtectedRoutes from "../guards/ProtectedRoutes";
import LoginPage from "../pages/Login";
// import ProjectPage from "../pages/projects/ProjectPage";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
    
      <Routes>
      <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}