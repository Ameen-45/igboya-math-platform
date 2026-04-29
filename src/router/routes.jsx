import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Splash from "../components/Splash";
import Topics from "../pages/Topics";
import Auth from "../components/Auth";
import ProtectedRoute from "../components/ProtectedRoute";
import Community from "../pages/Community";
import Settings from "../pages/Settings";

// Topic imports
import Algebra from "../pages/topics/algebra/Algebra.jsx";
import Geometry from "../pages/topics/geometry/Geometry.jsx";
import Statistics from "../pages/topics/statistics/Statistics.jsx";
import Calculus from "../pages/topics/calculus/Calculus.jsx";
import Trigonometry from "../pages/topics/trigonometry/Trigonometry.jsx";

export default function AppRoutes() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/splash" />} />
      <Route path="/splash" element={<Splash />} />
      <Route path="/auth" element={<Auth />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard user={user} /></ProtectedRoute>} />
      <Route path="/topics" element={<ProtectedRoute><Topics /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings user={user} onLogout={() => {}} /></ProtectedRoute>} />

      {/* Topic Routes */}
      <Route path="/topics/algebra" element={<ProtectedRoute><Algebra /></ProtectedRoute>} />
      <Route path="/topics/geometry" element={<ProtectedRoute><Geometry /></ProtectedRoute>} />
      <Route path="/topics/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
      <Route path="/topics/calculus" element={<ProtectedRoute><Calculus /></ProtectedRoute>} />
      <Route path="/topics/trigonometry" element={<ProtectedRoute><Trigonometry /></ProtectedRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/splash" />} />
    </Routes>
  );
}
