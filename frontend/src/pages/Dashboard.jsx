import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    // 1. Check if the user has a token (the "wristband")
    const token = localStorage.getItem('token');
    
    // 2. If they don't have a token, kick them back to the login page!
    if (!token) {
      navigate('/');
      return;
    }

    // 3. If they DO have a token, fetch their private data from the backend
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/subjects', {
          headers: { Authorization: `Bearer ${token}` } // Show the wristband to the bouncer!
        });
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching data, token might be expired.");
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    fetchSubjects();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Destroy the wristband
    navigate('/'); // Send back to login
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
        <h2>🎓 Student Dashboard</h2>
        <Link to="/tutor" style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px', marginLeft: '15px' }}>
          Talk to AI Tutor
        </Link>
        <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Your Subjects</h3>
        {subjects.length === 0 ? (
          <p style={{ color: '#666' }}>No subjects found. You are starting fresh!</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: '1fr 1fr' }}>
            {subjects.map(subject => (
              <div key={subject.id} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>{subject.name}</h4>
                <p style={{ margin: '0', fontSize: '14px', color: '#555' }}>{subject.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;