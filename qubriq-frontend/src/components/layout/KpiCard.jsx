export default function KpiCard({ title, value = "—", note = "No data yet" }) { return <article className="kpi-card"><span>{title}</span><strong>{value}</strong><small>{note}</small></article>; }
