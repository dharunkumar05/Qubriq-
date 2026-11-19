import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        Qubriq
      </Link>

      <nav className="navbar__links" aria-label="Main">
        <a href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#solutions">Solutions</a>
        <a href="#contact">Contact</a>
      </nav>

      <div className="navbar__actions">
        <button className="btn btn--outline" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="btn btn--primary" onClick={() => navigate("/signup")}>
          Get Started
        </button>
      </div>
    </header>
  );
}
