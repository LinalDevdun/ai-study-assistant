import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [degree, setDegree] = useState(''); // <-- NEW: Degree state
  const [batch, setBatch] = useState('');   // <-- NEW: Batch state
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Send degree and batch along with name, email, and password
      await axios.post('http://localhost:5000/register', { 
        name, 
        email, 
        password, 
        degree, 
        batch 
      });
      
      setMessage('Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      width: '100vw', 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      backgroundColor: '#F4F7FE', 
      fontFamily: 'sans-serif',
      overflowY: 'auto',
      padding: '20px 0'
    }}>
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        padding: '35px 40px', 
        borderRadius: '16px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
        width: '100%', 
        maxWidth: '450px', 
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        
        <h2 style={{ margin: '0 0 8px 0', color: '#111C44', fontSize: '26px' }}>Create an Account 🚀</h2>
        <p style={{ color: '#A3AED0', marginBottom: '20px', fontSize: '14px' }}>Join us to start learning today.</p>
        
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

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#111C44' }}>Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. John Doe" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: '#111C44',
                outline: 'none',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#111C44' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="e.g. student@lms.edu" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: '#111C44',
                outline: 'none',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#111C44' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: '#111C44',
                outline: 'none',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* NEW: Degree Selection Dropdown */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#111C44' }}>Degree Program</label>
            <select 
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: degree ? '#111C44' : '#94A3B8',
                outline: 'none',
                fontSize: '14px',
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
            >
              <option value="" disabled>Select your degree...</option>
              <option value="BSc Software Engineering">BSc Software Engineering</option>
              <option value="BSc Data Science">BSc Data Science</option>
              <option value="BSc IT">BSc Information Technology</option>
            </select>
          </div>

          {/* NEW: Batch Selection Dropdown */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#111C44' }}>Batch / Intake</label>
            <select 
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: batch ? '#111C44' : '#94A3B8',
                outline: 'none',
                fontSize: '14px',
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
            >
              <option value="" disabled>Select your batch...</option>
              <option value="25.1">Batch 25.1</option>
              <option value="25.2">Batch 25.2</option>
              <option value="26.1">Batch 26.1</option>
              <option value="26.2">Batch 26.2</option>
            </select>
          </div>

          <button type="submit" style={{
            padding: '14px',
            backgroundColor: '#4318FF',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: 'pointer',
            marginTop: '10px',
            boxShadow: '0 4px 12px rgba(67, 24, 255, 0.2)'
          }}>
            Sign Up
          </button>
        </form>
        
        <p style={{ marginTop: '20px', marginBottom: 0, color: '#A3AED0', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#4318FF', fontWeight: 'bold', textDecoration: 'none' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;