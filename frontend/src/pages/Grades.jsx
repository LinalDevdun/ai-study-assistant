import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function Grades() {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/my-grades', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setGrades(response.data);
      } catch (err) {
        console.error('Error fetching grades:', err);
      }
    };

    fetchGrades();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Helper function to format the database timestamp
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, backgroundColor: '#F4F7FE', fontFamily: 'sans-serif' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
        <div style={{ padding: '0 20px', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, color: '#111C44', fontSize: '22px' }}>🎓 LMS <span style={{ color: '#4318FF' }}>Pro</span></h2>
        </div>

        <nav style={{ flex: 1, padding: '0 15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div onClick={() => navigate('/dashboard')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📚 My Courses
          </div>
          <div onClick={() => navigate('/progress')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📈 Learning Progress
          </div>
          <div onClick={() => navigate('/assignments')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📝 Assignments
          </div>
          <div onClick={() => navigate('/deadlines')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📅 Upcoming Deadlines
          </div>
          <div onClick={() => navigate('/tutor')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🤖 AI Assistant
          </div>
          
          {/* Active State for Grades */}
          <div style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: '#4318FF', color: '#FFFFFF', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🏆 Recent Grades
          </div>
        </nav>

        <div style={{ padding: '0 15px' }}>
          <div onClick={handleLogout} style={{ padding: '12px 20px', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🚪 Log Out
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ color: '#111C44', margin: '0 0 10px 0', fontSize: '32px' }}>Recent Grades 🏆</h1>
          <p style={{ color: '#A3AED0', margin: 0, fontSize: '16px' }}>Review your scores and feedback from your lecturers.</p>
        </div>

        {/* Grades List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px', maxWidth: '1200px' }}>
          
          {grades.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: '#64748B', margin: 0 }}>No grades returned yet.</h3>
              <p style={{ color: '#A3AED0', marginTop: '8px' }}>Your graded assignments will appear here once reviewed by your lecturer.</p>
            </div>
          ) : (
            grades.map((item) => (
              <div key={item.submission_id} style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <h3 style={{ margin: '0', color: '#111C44', fontSize: '18px', lineHeight: '1.4' }}>{item.assignment_title}</h3>
                    <div style={{ backgroundColor: '#F0FDF4', color: '#10B981', padding: '8px 12px', borderRadius: '8px', fontWeight: '900', fontSize: '18px', border: '1px solid #A7F3D0' }}>
                      {item.grade}
                    </div>
                  </div>
                  
                  <p style={{ margin: '0 0 15px 0', color: '#64748B', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📅 Submitted on {formatDate(item.submitted_at)}
                  </p>
                </div>

                {item.feedback ? (
                  <div style={{ backgroundColor: '#F8FAFC', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #4318FF' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lecturer Feedback</p>
                    <p style={{ margin: 0, color: '#111C44', fontSize: '14px', fontStyle: 'italic' }}>"{item.feedback}"</p>
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#F8FAFC', padding: '15px', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                    <p style={{ margin: 0, color: '#94A3B8', fontSize: '13px', fontStyle: 'italic', textAlign: 'center' }}>No additional feedback provided.</p>
                  </div>
                )}
              </div>
            ))
          )}

        </div>
      </main>
    </div>
  );
}

export default Grades;