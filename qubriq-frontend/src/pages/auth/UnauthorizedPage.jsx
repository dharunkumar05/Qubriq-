import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ROLE_HOME } from "../../config/roles.js";
export default function UnauthorizedPage(){const {user}=useAuth();return <main className="center-page"><section className="panel panel--narrow"><h1 className="panel__title">You do not have access to this area.</h1><p className="panel__subtitle">Your account cannot open this page.</p><Link className="btn btn--primary" to={ROLE_HOME[user?.role]||"/login"}>Go to my dashboard</Link></section></main>}
