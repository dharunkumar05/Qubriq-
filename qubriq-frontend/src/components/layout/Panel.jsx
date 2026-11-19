export default function Panel({ title, children, className = "" }) { return <section className={`dash-panel ${className}`}>{title && <h2>{title}</h2>}{children}</section>; }
