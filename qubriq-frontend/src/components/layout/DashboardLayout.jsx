import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar.jsx";
import DashboardHeader from "./DashboardHeader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  const toggleMenu = () => {
    setOpen((current) => !current);
  };

  return (
    <div className="dashboard-shell">
      <Sidebar
        role={user?.role}
        open={open}
        onClose={() => setOpen(false)}
      />

      <div className="dashboard-main">
        <DashboardHeader
          user={user}
          menuOpen={open}
          onMenu={toggleMenu}
          onLogout={handleLogout}
        />

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>

      {open && (
        <button
          className="drawer-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
