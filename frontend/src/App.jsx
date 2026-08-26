import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tutor from './pages/Tutor'; // Import the AI Tutor component
import Register from './pages/Register';
import Course from './pages/Course';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tutor" element={<Tutor />} />
          <Route path="/course/:id" element={<Course />} />
        </Routes>
    </Router>
  );
}

export default App;