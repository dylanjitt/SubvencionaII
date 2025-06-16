import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthGuard from "../guards/AuthGuard";
import RoleGuard from "../guards/RoleGuard";
import { RoleBasedRedirect } from "./RoleBasedRedirect";
import LoginPage from "../pages/Login";
import DashboardPage from "../pages/Dashboard";
import { Layout } from "../layout/Layout";
import AdminDashboard from "../pages/AdminDashdoard";
import { ReportsPage } from "../pages/Reports";
import BookingPage from "../pages/BookingPage";
import BookingConfirmation from "../pages/BookingConfirmation";
import StationDetail from "../pages/StationDetail";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<></>/* TODO: add Register page */} />

        <Route element={
          <AuthGuard>
            <Layout />
          </AuthGuard>}>
          <Route path="/dashboard" element={<RoleBasedRedirect />} />

          <Route path="profile" element={<></>/* TODO: add profile page */} />

          <Route element={<RoleGuard allowedRoles={["admin"]} />}>
            <Route path="admin">
              <Route index element={<AdminDashboard />} />
              <Route path="gasStation/:id" element={<StationDetail />} />
              
              <Route path="gasStation/:id" element={<></>} />
              <Route path="reports" element={<ReportsPage/>} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Route>

          <Route element={<RoleGuard allowedRoles={["client"]} />}>
            <Route path="user">
              <Route index element={<DashboardPage />} />
              <Route path="history" element={<></>} />
              <Route path="*" element={<Navigate to="/user" replace />} />
            </Route>
            <Route path="bookings">
              <Route index element={<BookingPage/>} />
              <Route path="history" element={<></>} />
              <Route path="*" element={<Navigate to="/bookings" replace />} />
              <Route path="confirmation" element={<BookingConfirmation />} />
            </Route>
          </Route>

        </Route>

        <Route path="*" element={<></>/* TODO: add 404 page */} />
      </Routes>
    </BrowserRouter>
  )
}
