import EmptyState from "./EmptyState.jsx";
export default function DataTable({ columns = [] }) { return <div className="table-wrap"><table><thead><tr>{columns.map((c) => <th scope="col" key={c}>{c}</th>)}</tr></thead><tbody><tr><td colSpan={columns.length}><EmptyState /></td></tr></tbody></table></div>; }
