import { useAuth } from "../../context/AuthContext.jsx";
import UnauthorizedPage from "../../pages/auth/UnauthorizedPage.jsx";

export default function RoleRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (user && allowedRoles.includes(user.role)) {
    return children;
  }

  return <UnauthorizedPage />;
}
