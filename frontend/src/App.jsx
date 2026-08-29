import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Course from './pages/Course';
import Tutor from './pages/Tutor';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Splash screen is now the default front door */}
        <Route path="/" element={<Splash />} />
        
        {/* 2. Login is moved to /login */}
        <Route path="/login" element={<Login />} />
        
        {/* The rest remain exactly the same */}
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:id" element={<Course />} />
        <Route path="/tutor" element={<Tutor />} />
      </Routes>
    </Router>
  );
}

export default App;