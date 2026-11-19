import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignIn() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call the backend auth endpoint here.
    console.log({ identifier, remember });
  };

  return (
    <main className="center-page">
      <section className="panel panel--narrow">
        <h1 className="panel__title">Sign in to Qubriq</h1>
        <p className="panel__subtitle">Use your Qubriq account credentials.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="identifier">Email / Username</label>
            <input
              id="identifier"
              type="text"
              placeholder="Enter email or username"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label className="check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <Link to="/signin" className="link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn btn--primary btn--block">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
