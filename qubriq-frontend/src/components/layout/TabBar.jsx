import { useState } from "react";
export default function TabBar({ tabs }) { const [active, setActive] = useState(tabs[0]); return <div className="tabs" role="tablist">{tabs.map((tab) => <button key={tab} role="tab" aria-selected={active === tab} className={active === tab ? "tab tab--active" : "tab"} onClick={() => setActive(tab)}>{tab}</button>)}</div>; }
