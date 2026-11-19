import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ROLE_HOME } from "../../config/roles.js";
import { ApiError } from "../../services/apiClient.js";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login({ identifier, password, rememberMe });
      navigate(ROLE_HOME[user?.role] || "/unauthorized", { replace: true });
    } catch (caught) {
      if (caught instanceof ApiError) {
        if (caught.status === 401) {
          setError("Invalid email/username or password.");
          setPassword("");
        } else if (caught.status === 423 || caught.status === 429) {
          setError(caught.message);
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <header className="auth-top">
        <Link to="/" className="navbar__brand">Qubriq</Link>
      </header>
      <div className="center-page">
        <section className="panel panel--narrow">
          <h1 className="panel__title">Sign in to Qubriq</h1>
          <p className="panel__subtitle">Use your Qubriq account credentials.</p>
          {location.state?.registered === true && (
            <p className="notice" role="status">Account created. Sign in to continue.</p>
          )}
          {error && <div id="login-error" className="form-error" role="alert">{error}</div>}
          <form onSubmit={submit} aria-describedby={error ? "login-error" : undefined}>
            <div className="field">
              <label htmlFor="identifier">Email or username</label>
              <input id="identifier" name="identifier" type="text" value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="username" required />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input id="password" name="password" type={show ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
                <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((current) => !current)}>
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="form-row">
              <label className="check">
                <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
                Remember me
              </label>
              <Link to="/forgot-password" className="link">Forgot password?</Link>
            </div>
            <button className="btn btn--primary btn--block" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="panel__note"><Link className="link" to="/">Back to home</Link></p>
        </section>
      </div>
    </main>
  );
}
