import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Truck, Package, MapPin } from "lucide-react";
import RoleCard from "./RoleCard.jsx";
import { ROLES, ROLE_LABELS } from "../../config/roles.js";
import { register } from "../../services/authService.js";
import { ApiError } from "../../services/apiClient.js";

const ROLE_OPTIONS = [
  [ROLES.ADMIN, Shield, "Full platform control and organization management."],
  [ROLES.OPERATIONS, Truck, "Dispatch, fleet, routes and operations."],
  [ROLES.CUSTOMER, Package, "Create bookings and track your shipments."],
  [ROLES.RECIPIENT, MapPin, "Track incoming shipments and confirm delivery."],
];

export default function SignupForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    acceptTerms: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    else if (!/^(?:[0-9]{7,20}|\+[0-9]{7,19})$/.test(form.phone)) next.phone = "Enter a valid phone number.";
    if (!form.password) next.password = "Password is required.";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password)) {
      next.password = "Password must be at least 8 characters and include uppercase, lowercase, and a digit.";
    }
    if (!form.confirmPassword) next.confirmPassword = "Confirm password is required.";
    else if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match.";
    if (!form.role) next.role = "Select a role.";
    if (!form.acceptTerms) next.acceptTerms = "Accept the terms.";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: form.role,
        acceptTerms: form.acceptTerms,
      });
      setForm((current) => ({ ...current, password: "", confirmPassword: "" }));
      navigate("/login", { state: { registered: true }, replace: true });
    } catch (caught) {
      if (caught instanceof ApiError) {
        if (caught.status === 400 || caught.status === 403 || caught.status === 429) {
          setError(caught.message);
        } else if (caught.status === 409) {
          setError("An account with this email already exists.");
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
    <section className="panel panel--narrow">
      <h1 className="panel__title">Create your Qubriq account</h1>
      {error && <div className="form-error" role="alert">{error}</div>}
      <form onSubmit={submit}>
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input id="fullName" name="fullName" type="text" value={form.fullName} onChange={change} />
          {fieldErrors.fullName && <small className="field-error">{fieldErrors.fullName}</small>}
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={change} />
          {fieldErrors.email && <small className="field-error">{fieldErrors.email}</small>}
        </div>
        <div className="field">
          <label htmlFor="phone">Phone number</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={change} />
          {fieldErrors.phone && <small className="field-error">{fieldErrors.phone}</small>}
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={change} />
          {fieldErrors.password && <small className="field-error">{fieldErrors.password}</small>}
        </div>
        <div className="field">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={change} />
          {fieldErrors.confirmPassword && <small className="field-error">{fieldErrors.confirmPassword}</small>}
        </div>

        <div className="field">
          <label>Role</label>
          <div className="roles signup-roles">
            {ROLE_OPTIONS.map(([role, Icon, description]) => (
              <RoleCard
                key={role}
                title={ROLE_LABELS[role]}
                description={description}
                Icon={Icon}
                selected={form.role === role}
                onClick={() => setForm((current) => ({ ...current, role }))}
              />
            ))}
          </div>
          {fieldErrors.role && <small className="field-error">{fieldErrors.role}</small>}
        </div>

        <label className="check terms">
          <input name="acceptTerms" type="checkbox" checked={form.acceptTerms} onChange={change} />
          <span>I accept the <a className="link" href="/terms">terms</a>.</span>
        </label>
        {fieldErrors.acceptTerms && <small className="field-error">{fieldErrors.acceptTerms}</small>}

        <button className="btn btn--primary btn--block" disabled={loading || !form.role} style={{ marginTop: 18 }}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="panel__note">Accounts are created with the role you select. Your dashboard is determined by that role.</p>
      <p className="panel__note">Already have an account? <Link className="link" to="/login">Sign in</Link></p>
    </section>
  );
}
