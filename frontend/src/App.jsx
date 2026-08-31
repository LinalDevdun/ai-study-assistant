import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Course from './pages/Course';
import Tutor from './pages/Tutor';
import LecturerDashboard from './pages/LecturerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute'; // <-- IMPORT THE GUARD

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