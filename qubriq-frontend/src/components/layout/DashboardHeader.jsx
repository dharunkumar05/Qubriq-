import { LogOut, Menu } from "lucide-react";

export default function DashboardHeader({
  user,
  onMenu,
  onLogout,
  menuOpen = false,
}) {
  return (
    <header className="dashboard-header">
      <button
        className="menu-btn"
        type="button"
        aria-label="Open menu"
        aria-expanded={menuOpen}
        onClick={onMenu}
      >
        <Menu size={22} />
      </button>

      <div className="dashboard-header__user">
        <strong>{user?.fullName || user?.email}</strong>
        <span className="badge">{user?.role}</span>
      </div>

      <button
        className="btn btn--outline"
        type="button"
        onClick={onLogout}
      >
        <LogOut size={16} />
        Log out
      </button>
    </header>
  );
}
