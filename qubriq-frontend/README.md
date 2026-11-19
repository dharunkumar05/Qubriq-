# Qubriq frontend

Vite + React frontend for the Qubriq logistics platform. Authentication and business data come
from the ASP.NET Core backend; the frontend contains no mock credentials or role data.

## Setup

```bash
npm install
```

Set `VITE_BACKEND_URL` when the backend is not on the default origin:

```powershell
$env:VITE_BACKEND_URL="https://localhost:7001"
npm run dev
```

The Vite proxy forwards `/api` requests to that origin. Build with `npm run build`.

## Routes

- Public: `/`, `/login`, `/signup`, `/forgot-password`, `/unauthorized`, `/session-expired`
- Admin: `/admin/organization`, `/admin/users`, `/admin/finance`, `/admin/settings`
- Operations: `/operations`, `/operations/bookings`, `/operations/fleet`, `/operations/load`,
  `/operations/compliance`, `/operations/routes`, `/operations/tracking`,
  `/operations/predictive`, `/operations/network`, `/operations/connect`
- Booking customer: `/customer/create-booking`, `/customer/shipments`,
  `/customer/shipments/:shipmentId/tracking`, `/customer/notifications`
- Shipment recipient: `/recipient/incoming`, `/recipient/status`, `/recipient/confirm`
