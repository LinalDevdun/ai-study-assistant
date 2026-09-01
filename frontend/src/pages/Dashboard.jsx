import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function Dashboard() {
  const [courses, setCourses] = useState([]);
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

  // UPGRADED: Added the final /grades path! The menu is now complete!
  const menuItems = [
    { name: 'My Courses', icon: '📚', path: '/dashboard', active: true },
    { name: 'Learning Progress', icon: '📈', path: '/progress' },
    { name: 'Upcoming Assignments', icon: '📝', path: '/assignments' }, 
    { name: 'Upcoming Deadlines', icon: '📅', path: '/deadlines' }, 
    { name: 'Notifications', icon: '🔔', path: '/notifications' },
    { name: 'AI Assistant', icon: '🤖', path: '/tutor' },
    { name: 'Recent Grades', icon: '🏆', path: '/grades' }, // <-- UPDATED HERE
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, backgroundColor: '#F4F7FE', color: '#2B3674', fontFamily: 'sans-serif' }}>
      
      {/* 1. LEFT SIDEBAR */}
      <aside style={{ width: '260px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
        
        {/* Logo Area */}
        <div style={{ padding: '0 20px', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, color: '#111C44', fontSize: '24px' }}>🎓 LMS <span style={{ color: '#4318FF' }}>Pro</span></h2>
        </div>

        {/* Navigation Links */}
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

        {/* Logout Button */}
        <div style={{ padding: '0 15px' }}>
          <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 20px', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold' }}>
            <span style={{ fontSize: '18px' }}>🚪</span>
            <span>Log Out</span>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <header style={{ backgroundColor: '#FFFFFF', padding: '20px 30px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#111C44' }}>Hello, Student! 👋</h1>
            <p style={{ margin: '5px 0 0 0', color: '#A3AED0', fontSize: '14px' }}>Let's learn something new today!</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '20px', cursor: 'pointer' }}>🔔</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#4318FF', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              ST
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div style={{ padding: '30px' }}>
          
          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
             <div style={{ backgroundColor: '#E0F7FA', padding: '20px', borderRadius: '12px' }}>
                <p style={{ margin: 0, color: '#006064', fontWeight: 'bold' }}>Courses</p>
                <h2 style={{ margin: '10px 0 0 0', color: '#00838F', fontSize: '28px' }}>{courses.length}</h2>
             </div>
             <div style={{ backgroundColor: '#FFF3E0', padding: '20px', borderRadius: '12px' }}>
                <p style={{ margin: 0, color: '#E65100', fontWeight: 'bold' }}>Class Attendance</p>
                <h2 style={{ margin: '10px 0 0 0', color: '#EF6C00', fontSize: '28px' }}>64 <span style={{fontSize: '14px'}}>points</span></h2>
             </div>
             <div style={{ backgroundColor: '#F3E5F5', padding: '20px', borderRadius: '12px' }}>
                <p style={{ margin: 0, color: '#4A148C', fontWeight: 'bold' }}>Average Grade</p>
                <h2 style={{ margin: '10px 0 0 0', color: '#6A1B9A', fontSize: '28px' }}>85%</h2>
             </div>
             <div style={{ backgroundColor: '#4318FF', padding: '20px', borderRadius: '12px' }}>
                <p style={{ margin: 0, color: '#FFFFFF', fontWeight: 'bold' }}>Leaderboard</p>
                <h2 style={{ margin: '10px 0 0 0', color: '#FFFFFF', fontSize: '28px' }}>1st 🏆</h2>
             </div>
          </div>

          {/* Enrolled Courses Section */}
          <h2 style={{ color: '#111C44', marginBottom: '20px' }}>My Enrolled Courses</h2>
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

export default Dashboard;