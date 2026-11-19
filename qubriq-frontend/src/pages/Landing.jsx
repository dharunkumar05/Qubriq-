import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const CAPABILITIES = [
  {
    title: "Smart Booking & Fleet Planning",
    text: "Create bookings, allocate vehicles and plan capacity from one workspace.",
  },
  {
    title: "3D Load Optimization",
    text: "Priority-aware cargo packing with loading and unloading sequence checks.",
  },
  {
    title: "E-Way Bill Compliance",
    text: "Track E-Way Bill validity, documents and compliance risk levels.",
  },
  {
    title: "Intelligent Route Optimization",
    text: "Compare route options with travel time, cost and delivery feasibility.",
  },
  {
    title: "AI Predictive Intelligence",
    text: "Delivery delay, vehicle breakdown and shipment exception predictions.",
  },
  {
    title: "Real-Time Shipment Tracking",
    text: "Live vehicle positions, shipment timelines and estimated arrival.",
  },
  {
    title: "Network Disruption Intelligence",
    text: "Analyze hub and route disruptions and generate recovery plans.",
  },
  {
    title: "WhatsApp AI Agent",
    text: "Automated shipment updates and customer conversations on WhatsApp.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="page" id="home">
      <Navbar />

      <section className="hero">
        <div className="container">
          <h1 className="hero__title">Intelligent Logistics. Complete Transparency.</h1>
          <p className="hero__text">
            Qubriq is a unified logistics operating system that connects the full journey from
            customer booking to final delivery, with fleet planning, compliance, routing,
            tracking and predictive intelligence in one platform.
          </p>
          <div className="hero__actions">
            <button className="btn btn--primary btn--lg" onClick={() => navigate("/access")}>
              Get Started
            </button>
            <button className="btn btn--light btn--lg" onClick={() => navigate("/signin")}>
              Login
            </button>
          </div>
        </div>
      </section>

      <section className="capabilities" id="features">
        <div className="container">
          <h2 className="capabilities__title">Platform capabilities</h2>
          <div className="capabilities__grid">
            {CAPABILITIES.map((item) => (
              <article className="card" key={item.title}>
                <div className="card__icon" aria-hidden="true" />
                <h3 className="card__title">{item.title}</h3>
                <p className="card__text">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
