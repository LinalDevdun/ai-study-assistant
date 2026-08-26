import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function Course() {
  const { id } = useParams(); // This grabs the course ID from the URL
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }
        
        // Fetch lessons for this specific course
        const response = await axios.get(`http://localhost:5000/courses/${id}/lessons`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLessons(response.data);
      } catch (err) {
        console.error('Error fetching lessons:', err);
      }
    };

    fetchLessons();
  }, [id, navigate]);

  return (
    <div style={{ width: '100%', maxWidth: '800px', padding: '40px 20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#FFFFFF', margin: 0 }}>📚 Course Lessons</h1>
        <Link to="/dashboard">
          <button className="btn-green" style={{ width: 'auto', padding: '10px 20px' }}>Back to Dashboard</button>
        </Link>
      </div>

      {/* Lessons List */}
      <div className="card" style={{ maxWidth: '100%', textAlign: 'left', marginTop: '0' }}>
        {lessons.length === 0 ? (
          <p style={{ color: '#64748B' }}>No lessons found for this course.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {lessons.map((lesson) => (
              <div key={lesson.id} style={{ padding: '20px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#2563EB' }}>
                  Lesson {lesson.order_number}: {lesson.title}
                </h3>
                <p style={{ margin: '0 0 15px 0', color: '#1E293B', lineHeight: '1.6' }}>
                  {lesson.content}
                </p>
                
                {/* Future AI integration goes here! */}
                <Link to="/tutor">
                   <button style={{ width: 'auto', padding: '8px 16px', marginTop: '10px' }}>
                     Ask AI About This Lesson
                   </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Course;