import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SplashPage } from '../pages/SplashPage';
import { LoginPage } from '../pages/LoginPage';
import { RoleSelectionPage } from '../pages/RoleSelectionPage';
import { NurseDashboard } from '../pages/NurseDashboard';
import { NurseRoster } from '../pages/NurseRoster';
import { ShiftDetailsPage } from '../pages/ShiftDetailsPage';
import { LeaveRequestPage } from '../pages/LeaveRequestPage';
import { ShiftSwapPage } from '../pages/ShiftSwapPage';
import { MyRequestsPage } from '../pages/MyRequestsPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { AdminDashboard } from '../pages/AdminDashboard';
import { CreateRosterPage } from '../pages/CreateRosterPage';
import { PendingRequestsPage } from '../pages/PendingRequestsPage';
import { DutyReportPage } from '../pages/DutyReportPage';
import { StaffManagementPage } from '../pages/StaffManagementPage';
import { CommunicationSimulatorPage } from '../pages/CommunicationSimulatorPage';
import { CommunicationSessionPage } from '../pages/CommunicationSessionPage';
import { CommunicationResultsPage } from '../pages/CommunicationResultsPage';
import { TicTacToeGamePage } from '../pages/TicTacToeGamePage';
import { PublicPage } from '../pages/PublicPage';
import { MainLayout } from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-12 text-center text-xs text-[#707080]">Loading NurseFlow Portal...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/nurse/dashboard'} replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<SplashPage />} />
      <Route path="/public" element={<PublicPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/select-role" element={<RoleSelectionPage />} />

      {/* Main Authenticated Layout App */}
      <Route element={<MainLayout />}>
        {/* Nurse Protected Routes */}
        <Route
          path="/nurse/dashboard"
          element={
            <ProtectedRoute allowedRoles={['NURSE', 'ADMIN', 'HEAD_NURSE']}>
              <NurseDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/roster"
          element={
            <ProtectedRoute allowedRoles={['NURSE', 'ADMIN', 'HEAD_NURSE']}>
              <NurseRoster />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/shifts/:id"
          element={
            <ProtectedRoute allowedRoles={['NURSE', 'ADMIN', 'HEAD_NURSE']}>
              <ShiftDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/leave-request"
          element={
            <ProtectedRoute allowedRoles={['NURSE', 'ADMIN', 'HEAD_NURSE']}>
              <LeaveRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/shift-swap"
          element={
            <ProtectedRoute allowedRoles={['NURSE', 'ADMIN', 'HEAD_NURSE']}>
              <ShiftSwapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/requests"
          element={
            <ProtectedRoute allowedRoles={['NURSE', 'ADMIN', 'HEAD_NURSE']}>
              <MyRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/communication-simulator"
          element={
            <ProtectedRoute allowedRoles={['NURSE', 'ADMIN', 'HEAD_NURSE']}>
              <CommunicationSimulatorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/communication-simulator/session/:id"
          element={
            <ProtectedRoute allowedRoles={['NURSE', 'ADMIN', 'HEAD_NURSE']}>
              <CommunicationSessionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/communication-simulator/session/:id/results"
          element={
            <ProtectedRoute allowedRoles={['NURSE', 'ADMIN', 'HEAD_NURSE']}>
              <CommunicationResultsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/break-games/tic-tac-toe"
          element={
            <ProtectedRoute allowedRoles={['NURSE', 'ADMIN', 'HEAD_NURSE']}>
              <TicTacToeGamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Shared Routes */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'HEAD_NURSE']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/roster/create"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'HEAD_NURSE']}>
              <CreateRosterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'HEAD_NURSE']}>
              <PendingRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'HEAD_NURSE']}>
              <DutyReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'HEAD_NURSE']}>
              <StaffManagementPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
