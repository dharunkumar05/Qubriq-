import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import RedirectIfAuthenticated from "./components/auth/RedirectIfAuthenticated.jsx";
import RoleRoute from "./components/auth/RoleRoute.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import { ROLES } from "./config/roles.js";

import Landing from "./pages/Landing.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import SessionExpiredPage from "./pages/auth/SessionExpiredPage.jsx";
import SignupPage from "./pages/auth/SignupPage.jsx";
import UnauthorizedPage from "./pages/auth/UnauthorizedPage.jsx";

import OrganizationPage from "./pages/admin/OrganizationPage.jsx";
import UsersPage from "./pages/admin/UsersPage.jsx";
import FinancePage from "./pages/admin/FinancePage.jsx";
import SettingsPage from "./pages/admin/SettingsPage.jsx";

import OverviewPage from "./pages/operations/OverviewPage.jsx";
import BookingsPage from "./pages/operations/BookingsPage.jsx";
import FleetPage from "./pages/operations/FleetPage.jsx";
import LoadOptimizationPage from "./pages/operations/LoadOptimizationPage.jsx";
import CompliancePage from "./pages/operations/CompliancePage.jsx";
import RoutesPage from "./pages/operations/RoutesPage.jsx";
import TrackingPage from "./pages/operations/TrackingPage.jsx";
import PredictivePage from "./pages/operations/PredictivePage.jsx";
import NetworkPage from "./pages/operations/NetworkPage.jsx";
import ConnectPage from "./pages/operations/ConnectPage.jsx";

import CreateBookingPage from "./pages/customer/CreateBookingPage.jsx";
import MyShipmentsPage from "./pages/customer/MyShipmentsPage.jsx";
import ShipmentTrackingPage from "./pages/customer/ShipmentTrackingPage.jsx";
import NotificationsPage from "./pages/customer/NotificationsPage.jsx";

import IncomingShipmentsPage from "./pages/recipient/IncomingShipmentsPage.jsx";
import DeliveryStatusPage from "./pages/recipient/DeliveryStatusPage.jsx";
import DeliveryConfirmationPage from "./pages/recipient/DeliveryConfirmationPage.jsx";

function protectedPage(allowedRoles, page) {
  return (
    <ProtectedRoute>
      <RoleRoute allowedRoles={allowedRoles}>
        {page}
      </RoleRoute>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        }
      />

      <Route
        path="/signup"
        element={
          <RedirectIfAuthenticated>
            <SignupPage />
          </RedirectIfAuthenticated>
        }
      />

      <Route path="/access" element={<Navigate to="/signup" replace />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/session-expired" element={<SessionExpiredPage />} />

      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route
          path="/admin"
          element={protectedPage(
            [ROLES.ADMIN],
            <Navigate to="/admin/organization" replace />,
          )}
        />
        <Route
          path="/admin/organization"
          element={protectedPage([ROLES.ADMIN], <OrganizationPage />)}
        />
        <Route
          path="/admin/users"
          element={protectedPage([ROLES.ADMIN], <UsersPage />)}
        />
        <Route
          path="/admin/finance"
          element={protectedPage([ROLES.ADMIN], <FinancePage />)}
        />
        <Route
          path="/admin/settings"
          element={protectedPage([ROLES.ADMIN], <SettingsPage />)}
        />

        <Route
          path="/operations"
          element={protectedPage([ROLES.OPERATIONS], <OverviewPage />)}
        />
        <Route
          path="/operations/bookings"
          element={protectedPage([ROLES.OPERATIONS], <BookingsPage />)}
        />
        <Route
          path="/operations/fleet"
          element={protectedPage([ROLES.OPERATIONS], <FleetPage />)}
        />
        <Route
          path="/operations/load"
          element={protectedPage([ROLES.OPERATIONS], <LoadOptimizationPage />)}
        />
        <Route
          path="/operations/compliance"
          element={protectedPage([ROLES.OPERATIONS], <CompliancePage />)}
        />
        <Route
          path="/operations/routes"
          element={protectedPage([ROLES.OPERATIONS], <RoutesPage />)}
        />
        <Route
          path="/operations/tracking"
          element={protectedPage([ROLES.OPERATIONS], <TrackingPage />)}
        />
        <Route
          path="/operations/predictive"
          element={protectedPage([ROLES.OPERATIONS], <PredictivePage />)}
        />
        <Route
          path="/operations/network"
          element={protectedPage([ROLES.OPERATIONS], <NetworkPage />)}
        />
        <Route
          path="/operations/connect"
          element={protectedPage([ROLES.OPERATIONS], <ConnectPage />)}
        />

        <Route
          path="/customer"
          element={protectedPage(
            [ROLES.CUSTOMER],
            <Navigate to="/customer/create-booking" replace />,
          )}
        />
        <Route
          path="/customer/create-booking"
          element={protectedPage([ROLES.CUSTOMER], <CreateBookingPage />)}
        />
        <Route
          path="/customer/shipments"
          element={protectedPage([ROLES.CUSTOMER], <MyShipmentsPage />)}
        />
        <Route
          path="/customer/shipments/:shipmentId/tracking"
          element={protectedPage([ROLES.CUSTOMER], <ShipmentTrackingPage />)}
        />
        <Route
          path="/customer/notifications"
          element={protectedPage([ROLES.CUSTOMER], <NotificationsPage />)}
        />

        <Route
          path="/recipient"
          element={protectedPage(
            [ROLES.RECIPIENT],
            <Navigate to="/recipient/incoming" replace />,
          )}
        />
        <Route
          path="/recipient/incoming"
          element={protectedPage([ROLES.RECIPIENT], <IncomingShipmentsPage />)}
        />
        <Route
          path="/recipient/status"
          element={protectedPage([ROLES.RECIPIENT], <DeliveryStatusPage />)}
        />
        <Route
          path="/recipient/confirm"
          element={protectedPage([ROLES.RECIPIENT], <DeliveryConfirmationPage />)}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
