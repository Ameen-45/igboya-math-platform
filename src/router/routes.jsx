import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Splash from "../components/Splash";
import Topics from "../pages/Topics";
import Auth from "../components/Auth";
import ProtectedRoute from "../components/ProtectedRoute";
import Community from "../pages/Community";
import Settings from "../pages/Settings";

// Topic main pages
import Algebra from "../pages/topics/algebra/Algebra";
import Geometry from "../pages/topics/geometry/Geometry";
import Statistics from "../pages/topics/statistics/Statistics";
import Calculus from "../pages/topics/calculus/Calculus";
import Trigonometry from "../pages/topics/trigonometry/Trigonometry";

// Algebra sub-pages
import AlgebraIntroduction from "../pages/topics/algebra/Introduction";
import AlgebraExamples from "../pages/topics/algebra/Examples";
import AlgebraSolver from "../pages/topics/algebra/EquationSolver";
import AlgebraQuiz from "../pages/topics/algebra/Quiz";
import AlgebraPractice from "../pages/topics/algebra/InteractivePractice";

// Geometry sub-pages
import GeometryIntroduction from "../pages/topics/geometry/Introduction";
import GeometryExamples from "../pages/topics/geometry/Examples";
import GeometryPractice from "../pages/topics/geometry/InteractivePractice";
import GeometryQuiz from "../pages/topics/geometry/Quiz";

// Calculus sub-pages
import CalculusIntroduction from "../pages/topics/calculus/Introduction";
import CalculusExamples from "../pages/topics/calculus/Examples";
import CalculusPractice from "../pages/topics/calculus/InteractivePractice";
import CalculusQuiz from "../pages/topics/calculus/Quiz";

// Statistics sub-pages
import StatisticsIntroduction from "../pages/topics/statistics/Introduction";
import StatisticsExamples from "../pages/topics/statistics/Examples";
import StatisticsDataAnalyzer from "../pages/topics/statistics/DataAnalyzer";
import StatisticsQuiz from "../pages/topics/statistics/Quiz";
import StatisticsPractice from "../pages/topics/statistics/InteractivePractice";

// Trigonometry sub-pages
import TrigonometryIntroduction from "../pages/topics/trigonometry/Introduction";
import TrigonometryExamples from "../pages/topics/trigonometry/Examples";
import TrigonometryTriangleSolver from "../pages/topics/trigonometry/TriangleSolver";
import TrigonometryQuiz from "../pages/topics/trigonometry/Quiz";
import TrigonometryPractice from "../pages/topics/trigonometry/InteractivePractice";

export default function AppRoutes({ user }) {
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

      {/* Topic Main Routes */}
      <Route path="/topics/algebra" element={<ProtectedRoute><Algebra /></ProtectedRoute>} />
      <Route path="/topics/geometry" element={<ProtectedRoute><Geometry /></ProtectedRoute>} />
      <Route path="/topics/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
      <Route path="/topics/calculus" element={<ProtectedRoute><Calculus /></ProtectedRoute>} />
      <Route path="/topics/trigonometry" element={<ProtectedRoute><Trigonometry /></ProtectedRoute>} />

      {/* Algebra Sub-pages */}
      <Route path="/topics/algebra/introduction" element={<ProtectedRoute><AlgebraIntroduction /></ProtectedRoute>} />
      <Route path="/topics/algebra/examples" element={<ProtectedRoute><AlgebraExamples /></ProtectedRoute>} />
      <Route path="/topics/algebra/solver" element={<ProtectedRoute><AlgebraSolver /></ProtectedRoute>} />
      <Route path="/topics/algebra/quiz" element={<ProtectedRoute><AlgebraQuiz /></ProtectedRoute>} />
      <Route path="/topics/algebra/practice" element={<ProtectedRoute><AlgebraPractice /></ProtectedRoute>} />

      {/* Geometry Sub-pages */}
      <Route path="/topics/geometry/introduction" element={<ProtectedRoute><GeometryIntroduction /></ProtectedRoute>} />
      <Route path="/topics/geometry/examples" element={<ProtectedRoute><GeometryExamples /></ProtectedRoute>} />
      <Route path="/topics/geometry/practice" element={<ProtectedRoute><GeometryPractice /></ProtectedRoute>} />
      <Route path="/topics/geometry/quiz" element={<ProtectedRoute><GeometryQuiz /></ProtectedRoute>} />

      {/* Calculus Sub-pages */}
      <Route path="/topics/calculus/introduction" element={<ProtectedRoute><CalculusIntroduction /></ProtectedRoute>} />
      <Route path="/topics/calculus/examples" element={<ProtectedRoute><CalculusExamples /></ProtectedRoute>} />
      <Route path="/topics/calculus/practice" element={<ProtectedRoute><CalculusPractice /></ProtectedRoute>} />
      <Route path="/topics/calculus/quiz" element={<ProtectedRoute><CalculusQuiz /></ProtectedRoute>} />

      {/* Statistics Sub-pages */}
      <Route path="/topics/statistics/introduction" element={<ProtectedRoute><StatisticsIntroduction /></ProtectedRoute>} />
      <Route path="/topics/statistics/examples" element={<ProtectedRoute><StatisticsExamples /></ProtectedRoute>} />
      <Route path="/topics/statistics/data-analyzer" element={<ProtectedRoute><StatisticsDataAnalyzer /></ProtectedRoute>} />
      <Route path="/topics/statistics/quiz" element={<ProtectedRoute><StatisticsQuiz /></ProtectedRoute>} />
      <Route path="/topics/statistics/practice" element={<ProtectedRoute><StatisticsPractice /></ProtectedRoute>} />

      {/* Trigonometry Sub-pages */}
      <Route path="/topics/trigonometry/introduction" element={<ProtectedRoute><TrigonometryIntroduction /></ProtectedRoute>} />
      <Route path="/topics/trigonometry/examples" element={<ProtectedRoute><TrigonometryExamples /></ProtectedRoute>} />
      <Route path="/topics/trigonometry/triangle-solver" element={<ProtectedRoute><TrigonometryTriangleSolver /></ProtectedRoute>} />
      <Route path="/topics/trigonometry/quiz" element={<ProtectedRoute><TrigonometryQuiz /></ProtectedRoute>} />
      <Route path="/topics/trigonometry/practice" element={<ProtectedRoute><TrigonometryPractice /></ProtectedRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/splash" />} />
    </Routes>
  );
}
