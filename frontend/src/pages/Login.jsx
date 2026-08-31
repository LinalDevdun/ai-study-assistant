import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

      setMessage('Login successful! Redirecting...');
      
      setTimeout(() => {
        const userRole = response.data.role;
        
        if (userRole === 'ADMIN') {
           navigate('/admin-dashboard'); 
        } else if (userRole === 'LECTURER') {
           navigate('/lecturer-dashboard'); 
        } else {
           navigate('/dashboard'); 
        }
      }, 1000);
      
    } catch (error) {
      setMessage(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      width: '100vw', 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      backgroundColor: '#F4F7FE', 
      fontFamily: 'sans-serif' 
    }}>
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        padding: '40px', 
        borderRadius: '16px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
        width: '100%', 
        maxWidth: '400px', 
        textAlign: 'center' 
      }}>
        
        <h2 style={{ margin: '0 0 10px 0', color: '#111C44', fontSize: '28px' }}>Welcome Back 👋</h2>
        <p style={{ color: '#A3AED0', marginBottom: '30px', fontSize: '15px' }}>Enter your email and password to sign in.</p>
        
        {message && (
          <p style={{ 
            marginBottom: '20px', 
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: message.includes('successful') ? '#D1FAE5' : '#FEE2E2',
            color: message.includes('successful') ? '#059669' : '#DC2626', 
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {message}
          </p>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{
              padding: '14px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
              color: '#111C44',
              outline: 'none',
              fontSize: '15px'
            }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{
              padding: '14px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
              color: '#111C44',
              outline: 'none',
              fontSize: '15px'
            }}
          />
          <button type="submit" style={{
            padding: '14px',
            backgroundColor: '#4318FF',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '10px',
            boxShadow: '0 4px 12px rgba(67, 24, 255, 0.2)'
          }}>
            Sign In
          </button>
        </form>
        
        <p style={{ marginTop: '25px', color: '#A3AED0', fontSize: '14px' }}>
          Don't have an account? <Link to="/register" style={{ color: '#4318FF', fontWeight: 'bold', textDecoration: 'none' }}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;