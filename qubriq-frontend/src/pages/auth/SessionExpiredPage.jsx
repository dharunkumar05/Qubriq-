import { Link } from "react-router-dom";
export default function SessionExpiredPage(){return <main className="center-page"><section className="panel panel--narrow"><h1 className="panel__title">Your session has expired.</h1><p className="panel__subtitle">Please sign in again to continue.</p><Link className="btn btn--primary" to="/login">Sign in again</Link></section></main>}
