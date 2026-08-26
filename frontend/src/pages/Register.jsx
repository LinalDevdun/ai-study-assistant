import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../index.css'; // This applies your global theme!

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Sending name, email, and password
      await axios.post('http://localhost:5000/register', { name, email, password });
      setMessage('Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    // The "card" class puts everything inside a beautiful white floating box
    <div className="card">
      <h2 style={{ marginBottom: '30px', color: '#1E293B' }}>Create an Account</h2>
      
      {message && (
        <p style={{ marginBottom: '20px', color: message.includes('successful') ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>
          {message}
        </p>
      )}

      <form onSubmit={handleRegister}>
        {/* CSS handles all the padding, borders, and hover effects now */}
        <input 
          type="text" 
          placeholder="Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
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
        <button type="submit" className="btn-green">
          Sign Up
        </button>
      </form>
      
      <p style={{ marginTop: '25px', color: '#64748B' }}>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
}

export default Register;