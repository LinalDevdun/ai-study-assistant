import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tutor from './pages/Tutor'; // Import the AI Tutor component
import Register from './pages/Register';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tutor" element={<Tutor />} />
        </Routes>
    </Router>
  );
}

export default App;