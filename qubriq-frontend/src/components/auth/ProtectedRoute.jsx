import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";
import Loading from "../layout/Loading.jsx";

export default function ProtectedRoute({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "expired") {
    return (
      <Navigate
        to="/session-expired"
        state={{ from: location }}
        replace
      />
    );
  }

  if (status !== "authenticated") {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}
