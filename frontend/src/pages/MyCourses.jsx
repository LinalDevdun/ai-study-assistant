import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
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
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { name: 'My Courses', icon: '📚', path: '/courses', active: true }, // <-- Active state here!
    { name: 'Learning Progress', icon: '📈', path: '/progress' },
    { name: 'Assignments', icon: '📝', path: '/assignments' }, 
    { name: 'Upcoming Deadlines', icon: '📅', path: '/deadlines' }, 
    { name: 'AI Assistant', icon: '🤖', path: '/tutor' },
    { name: 'Recent Grades', icon: '🏆', path: '/grades' }, 
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, backgroundColor: '#F4F7FE', color: '#2B3674', fontFamily: 'sans-serif' }}>
      
      {/* 1. LEFT SIDEBAR */}
      <aside style={{ width: '260px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
        <div style={{ padding: '0 20px', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, color: '#111C44', fontSize: '24px' }}>🎓 LMS <span style={{ color: '#4318FF' }}>Pro</span></h2>
        </div>

        <nav style={{ flex: 1, padding: '0 15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {menuItems.map((item, index) => (
            <Link key={index} to={item.path} style={{ textDecoration: 'none' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 20px', 
                borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                backgroundColor: item.active ? '#4318FF' : 'transparent',
                color: item.active ? '#FFFFFF' : '#A3AED0',
                transition: 'all 0.2s'
              }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span>{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <header style={{ backgroundColor: '#FFFFFF', padding: '20px 30px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#111C44' }}>My Courses 📚</h1>
            <p style={{ margin: '5px 0 0 0', color: '#A3AED0', fontSize: '14px' }}>Access your enrolled modules and start learning.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            
            <span onClick={() => navigate('/notifications')} style={{ fontSize: '20px', cursor: 'pointer' }}>🔔</span>
            
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#4318FF', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}
              >
                ST
              </div>

              {isProfileOpen && (
                <div style={{ position: 'absolute', top: '50px', right: '0', backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '200px', overflow: 'hidden', border: '1px solid #E2E8F0', zIndex: 100 }}>
                  <div style={{ padding: '12px 20px', borderBottom: '1px solid #E2E8F0' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#111C44' }}>Student User</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#A3AED0' }}>student@lms.edu</p>
                  </div>
                  <div style={{ padding: '8px 0' }}>
                    <div style={{ padding: '10px 20px', cursor: 'pointer', color: '#475569', display: 'flex', gap: '10px', alignItems: 'center' }} onClick={() => setIsProfileOpen(false)}>👤 My Profile</div>
                    <div style={{ padding: '10px 20px', cursor: 'pointer', color: '#475569', display: 'flex', gap: '10px', alignItems: 'center' }} onClick={() => setIsProfileOpen(false)}>⚙️ Settings</div>
                    <div style={{ padding: '10px 20px', cursor: 'pointer', color: '#475569', display: 'flex', gap: '10px', alignItems: 'center' }} onClick={() => setIsProfileOpen(false)}>🔒 Change Password</div>
                  </div>
                  <div style={{ borderTop: '1px solid #E2E8F0' }}>
                    <div style={{ padding: '12px 20px', cursor: 'pointer', color: '#EF4444', fontWeight: 'bold', display: 'flex', gap: '10px', alignItems: 'center' }} onClick={handleLogout}>🚪 Log Out</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Courses Grid Content */}
        <div style={{ padding: '30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {courses.length === 0 ? (
              <p style={{ color: '#A3AED0' }}>No courses found. Check back later!</p>
            ) : (
              courses.map(course => (
                <div key={course.id} style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#111C44' }}>{course.title}</h3>
                  <p style={{ margin: '0 0 20px 0', color: '#A3AED0', lineHeight: '1.5', fontSize: '14px' }}>{course.description}</p>
                  <button 
                    onClick={() => navigate(`/course/${course.id}`)} 
                    style={{ width: '100%', padding: '12px', backgroundColor: '#4318FF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Open Course
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyCourses;