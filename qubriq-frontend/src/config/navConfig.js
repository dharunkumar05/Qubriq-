export const NAV_CONFIG = {
  Admin: [
    ["Organization", "/admin/organization"], ["Users", "/admin/users"],
    ["Finance", "/admin/finance"], ["Settings", "/admin/settings"],
  ],
  Operations: [
    ["Overview", "/operations"], ["Bookings", "/operations/bookings"], ["Fleet", "/operations/fleet"],
    ["Load Optimization", "/operations/load"], ["Compliance", "/operations/compliance"],
    ["Routes", "/operations/routes"], ["Tracking", "/operations/tracking"], ["Predictive", "/operations/predictive"],
    ["Network", "/operations/network"], ["Qubriq Connect", "/operations/connect"],
  ],
  BookingCustomer: [
    ["Create Booking", "/customer/create-booking"], ["My Shipments", "/customer/shipments"],
    ["Notifications", "/customer/notifications"],
  ],
  ShipmentRecipient: [
    ["Incoming Shipments", "/recipient/incoming"], ["Delivery Status", "/recipient/status"],
    ["Delivery Confirmation", "/recipient/confirm"],
  ],
};
