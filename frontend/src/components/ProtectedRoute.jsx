import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // 1. If they are not logged in at all, kick them to the login screen
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. If they are logged in but don't have the right role, redirect them to their proper home
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === 'ADMIN') return <Navigate to="/admin-dashboard" replace />;
    if (userRole === 'LECTURER') return <Navigate to="/lecturer-dashboard" replace />;
    
    // Default fallback for students or unrecognized roles
    return <Navigate to="/dashboard" replace />;
  }

  // 3. If they pass both checks, let them into the page!
  return children;
}

export default ProtectedRoute;