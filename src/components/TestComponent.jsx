import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Splash from "../components/Splash";
import Topics from "../pages/Topics";
import Auth from "../components/Auth";
import ProtectedRoute from "../components/ProtectedRoute";
import TestComponent from "../components/TestComponent"; // Add this for testing

export default function AppRoutes() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/splash" />} />
      <Route path="/splash" element={<Splash />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Test Route - Remove after testing */}
      <Route path="/test" element={<TestComponent />} />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/topics" 
        element={
          <ProtectedRoute>
            <Topics />
          </ProtectedRoute>
        } 
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/splash" />} />
    </Routes>
  );
}