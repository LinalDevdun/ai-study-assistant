import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Course from './pages/Course';
import Tutor from './pages/Tutor';
import LecturerDashboard from './pages/LecturerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Progress from './pages/Progress';
import Deadlines from './pages/Deadlines';
import Assignments from './pages/Assignments';
import Notifications from './pages/Notifications';
import Grades from './pages/Grades'; // <-- IMPORTED HERE

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Student Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/progress" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <Progress />
          </ProtectedRoute>
        } />

        <Route path="/assignments" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <Assignments />
          </ProtectedRoute>
        } />

        <Route path="/deadlines" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <Deadlines />
          </ProtectedRoute>
        } />

        <Route path="/notifications" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <Notifications />
          </ProtectedRoute>
        } />

        {/* NEW: Grades Route */}
        <Route path="/grades" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <Grades />
          </ProtectedRoute>
        } />
        
        {/* Protected Lecturer Routes */}
        <Route path="/lecturer-dashboard" element={
          <ProtectedRoute allowedRoles={['LECTURER']}>
            <LecturerDashboard />
          </ProtectedRoute>
        } />
        
        {/* Protected Admin Routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Shared Protected Routes (Anyone logged in can access) */}
        <Route path="/course/:id" element={
          <ProtectedRoute allowedRoles={['STUDENT', 'LECTURER', 'ADMIN']}>
            <Course />
          </ProtectedRoute>
        } />
        <Route path="/tutor" element={
          <ProtectedRoute allowedRoles={['STUDENT', 'LECTURER', 'ADMIN']}>
            <Tutor />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;