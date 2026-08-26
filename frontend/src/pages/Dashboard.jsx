import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // This runs automatically when the page loads to fetch the courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/'); // Kick them back to login if they aren't authenticated
          return;
        }
        
        // Call our brand new LMS backend route!
        const response = await axios.get('http://localhost:5000/courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };

    fetchCourses();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', padding: '40px 20px' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#FFFFFF', margin: 0 }}>🎓 Student Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/tutor">
            <button className="btn-green" style={{ width: 'auto', padding: '10px 20px' }}>Ask AI Tutor</button>
          </Link>
          <button className="btn-red" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Courses Section */}
      <div className="card" style={{ maxWidth: '100%', textAlign: 'left', marginTop: '0' }}>
        <h2 style={{ marginTop: '0', color: '#1E293B', borderBottom: '2px solid #F1F5F9', paddingBottom: '15px' }}>
          My Enrolled Courses
        </h2>
        
        {courses.length === 0 ? (
          <p style={{ color: '#64748B' }}>No courses found. Check back later!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            
            {/* Loop through the courses from the database and create a card for each */}
            {courses.map(course => (
              <div key={course.id} style={{ padding: '20px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#2563EB' }}>{course.title}</h3>
                <p style={{ margin: '0 0 15px 0', color: '#64748B', lineHeight: '1.5' }}>{course.description}</p>
                
                {/* UPGRADED: This button now routes the user to the specific course page! */}
                <button 
                  onClick={() => navigate(`/course/${course.id}`)} 
                  style={{ width: 'auto', padding: '10px 20px' }}
                >
                  Open Course
                </button>
              </div>
            ))}

          </div>
        )}
      </div>
      
    </div>
  );
}

export default Dashboard;