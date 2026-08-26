import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../index.css'; // This imports your new global theme!

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Send the login request to your backend
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      });
      
      // 2. Save the JWT token to the browser's localStorage
      localStorage.setItem('token', response.data.token);
      
      // 3. Send the user to the dashboard page
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    // The "card" class applies the white floating box from your new CSS
    <div className="card">
      <h2 style={{ marginBottom: '30px', color: '#1E293B' }}>🎓 Study Assistant</h2>
      
      {/* Show an error message if the login fails */}
      {error && <p style={{ color: '#EF4444', fontWeight: 'bold' }}>{error}</p>}
      
      <form onSubmit={handleLogin}>
        {/* Notice how clean this is now! The CSS handles all the sizing and colors */}
        <input 
          type="text" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">
          Login
        </button>
      </form>

      {/* Link to the registration page */}
      <p style={{ marginTop: '25px', color: '#64748B' }}>
        Don't have an account? <Link to="/register">Sign up here</Link>
      </p>
    </div>
  );
}

export default Login;