import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing when you submit the form
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
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>AI Study Assistant Login</h2>
      
      {/* Show an error message if the login fails */}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px', fontSize: '16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Login
        </button>
      </form>

      {/* --- NEW: Link to the registration page --- */}
      <p style={{ marginTop: '20px' }}>
        Don't have an account? <Link to="/register">Sign up here</Link>
      </p>
    </div>
  );
}

export default Login;