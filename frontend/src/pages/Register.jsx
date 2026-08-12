import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [name, setName] = useState(''); // State for the new Name field
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
    <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Create an Account</h2>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* THIS IS THE NEW NAME FIELD */}
        <input 
          type="text" 
          placeholder="Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

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
        <button type="submit" style={{ padding: '10px', fontSize: '16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Sign Up
        </button>
      </form>
      
      {message && (
        <p style={{ marginTop: '20px', color: message.includes('successful') ? 'green' : 'red', fontWeight: 'bold' }}>
          {message}
        </p>
      )}

      <p style={{ marginTop: '20px' }}>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
}

export default Register;