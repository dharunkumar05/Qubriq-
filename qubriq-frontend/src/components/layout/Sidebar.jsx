import { NavLink } from "react-router-dom";
import { NAV_CONFIG } from "../../config/navConfig.js";
export default function Sidebar({ role, open, onClose }) {
  return <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>
    <div className="sidebar__brand">Qubriq</div>
    <nav aria-label="Dashboard"><div className="sidebar__nav">{(NAV_CONFIG[role] || []).map(([label, path]) =>
      <NavLink key={path} to={path} onClick={onClose} className={({ isActive }) => isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"}>{label}</NavLink>)}</div></nav>
  </aside>;
}
