import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import RoleSelection from "./pages/RoleSelection.jsx";
import SignIn from "./pages/SignIn.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/access" element={<RoleSelection />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
