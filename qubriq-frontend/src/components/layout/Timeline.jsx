const STEPS = ["Booking confirmed", "Picked up", "Dispatched", "In transit", "At hub", "Out for delivery", "Delivered"];
export default function Timeline() { return <ol className="timeline">{STEPS.map((step) => <li key={step}><span className="timeline__dot" />{step}</li>)}</ol>; }
