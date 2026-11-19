import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";
import { ROLE_HOME } from "../../config/roles.js";
import Loading from "../layout/Loading.jsx";

export default function RedirectIfAuthenticated({ children }) {
  const { status, user } = useAuth();

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "authenticated" && user?.role) {
    const destination = ROLE_HOME[user.role] || "/unauthorized";
    return <Navigate to={destination} replace />;
  }

  return children;
}
