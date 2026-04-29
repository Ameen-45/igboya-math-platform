import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Splash from "../components/Splash";
import Topics from "../pages/Topics";
import Auth from "../components/Auth";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  // Get user from localStorage for dashboard
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      {/* Public Routes - No login required */}
      <Route path="/" element={<Navigate to="/splash" />} />
      <Route path="/splash" element={<Splash />} />
      <Route path="/auth" element={<Auth />} />

      {/* Protected Routes - Login required */}
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
      
      <Route 
        path="/topics/:topic" 
        element={
          <ProtectedRoute>
            <Topics />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/community" 
        element={
          <ProtectedRoute>
            <div>Community Page (Coming Soon)</div>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <div>Settings Page (Coming Soon)</div>
          </ProtectedRoute>
        } 
      />

      {/* Catch unknown routes - redirect to splash */}
      <Route path="*" element={<Navigate to="/splash" />} />
    </Routes>
  );
}