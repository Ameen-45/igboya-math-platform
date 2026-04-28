import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Splash from "../components/Splash";  // Splash is in components
import Topics from "../pages/Topics";
import Auth from "../components/Auth";  // Auth is in components

export default function AppRoutes() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/splash" />} />

      {/* Splash screen */}
      <Route path="/splash" element={<Splash />} />

      {/* Auth page */}
      <Route path="/auth" element={<Auth />} />

      {/* Main app */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/topics" element={<Topics />} />

      {/* Catch unknown routes */}
      <Route path="*" element={<Navigate to="/splash" />} />
    </Routes>
  );
}