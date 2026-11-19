import { useNavigate } from "react-router-dom";
import { Shield, Truck, Package, MapPin } from "lucide-react";

const ROLES = [
  {
    id: "admin",
    title: "Admin",
    Icon: Shield,
    text: "Full platform control: users, organization, finance, settings and all modules.",
  },
  {
    id: "operations",
    title: "Operations / Dispatcher",
    Icon: Truck,
    text: "Booking, fleet, load, compliance, routing, dispatch, tracking and disruption management.",
  },
  {
    id: "customer",
    title: "Booking Customer",
    Icon: Package,
    text: "Create bookings, track your own shipments and manage notification preferences.",
  },
  {
    id: "recipient",
    title: "Shipment Recipient",
    Icon: MapPin,
    text: "Track an incoming shipment, view delivery status and confirm delivery.",
  },
];

export default function RoleSelection() {
  const navigate = useNavigate();

  // Every role leads to the sign-in page; the chosen role is passed along for later use.
  const handleSelect = (role) => navigate("/signin", { state: { role: role.id } });

  return (
    <main className="center-page">
      <section className="panel panel--wide">
        <h1 className="panel__title">Select your access point</h1>
        <p className="panel__subtitle">
          Your role determines which dashboard you enter after sign in.
        </p>

        <div className="roles">
          {ROLES.map((role) => (
            <button
              type="button"
              key={role.id}
              className="role"
              onClick={() => handleSelect(role)}
            >
              <span className="role__icon">
                <role.Icon size={26} strokeWidth={1.8} />
              </span>
              <span className="role__title">{role.title}</span>
              <span className="role__text">{role.text}</span>
            </button>
          ))}
        </div>

        <p className="panel__note">
          Access points are prototype entry points. Real authentication and role enforcement
          happen on the backend.
        </p>
      </section>
    </main>
  );
}
