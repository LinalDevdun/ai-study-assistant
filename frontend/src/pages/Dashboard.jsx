import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function Dashboard() {
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    // Keep your backend fetch logic here
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: '🏠', path: '/dashboard', active: true }, 
    { name: 'My Courses', icon: '📖', path: '/courses' }, 
    { name: 'Assignments', icon: '📝', path: '/assignments' }, 
    { name: 'Learning Progress', icon: '📊', path: '/progress' },
    { name: 'Grades', icon: '🏆', path: '/grades' }, 
    { name: 'AI Assistant', icon: '🤖', path: '/tutor' },

  ];

  const coursesData = [
    { id: 1, title: 'Artificial Intelligence & Machine Learning', instructor: 'Dr. Sarah Johnson', progress: 72, color: '#6366F1', icon: '🧠', bg: '#EEF2FF' },
    { id: 2, title: 'Database Systems', instructor: 'Prof. Michael Brown', progress: 85, color: '#10B981', icon: '🛢️', bg: '#ECFDF5' },
    { id: 3, title: 'Software Engineering', instructor: 'Dr. Emily Davis', progress: 61, color: '#3B82F6', icon: '💻', bg: '#EFF6FF' },
    { id: 4, title: 'Web Development Fundamentals', instructor: 'Mr. David Wilson', progress: 45, color: '#F59E0B', icon: '🌐', bg: '#FFFBEB' },
    { id: 5, title: 'Discrete Mathematics', instructor: 'Dr. James Lee', progress: 30, color: '#EF4444', icon: '📈', bg: '#FEF2F2' },
    { id: 6, title: 'Data Structures & Algorithms', instructor: 'Dr. Robert Taylor', progress: 90, color: '#06B6D4', icon: '🔗', bg: '#ECFEFF' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, backgroundColor: '#FAFBFF', color: '#1E293B', fontFamily: 'sans-serif' }}>
      
      {/* 1. LEFT SIDEBAR */}
      <aside style={{ width: '260px', backgroundColor: '#FFFFFF', borderRight: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', padding: '24px 0', justifyContent: 'space-between' }}>
        <div>
          <div style={{ padding: '0 24px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🎓</span>
            <h2 style={{ margin: 0, color: '#0F172A', fontSize: '22px', fontWeight: '800' }}>LMS <span style={{ color: '#6366F1' }}>Pro</span></h2>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 16px' }}>
            {menuItems.map((item, index) => (
              <Link key={index} to={item.path} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', 
                  borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px',
                  backgroundColor: item.active ? '#6366F1' : 'transparent',
                  color: item.active ? '#FFFFFF' : '#64748B',
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '18px', opacity: item.active ? 1 : 0.7 }}>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  {item.hasBadge && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6366F1' }}></div>}
                </div>
              </Link>
            ))}
          </nav>
        </div>
        <div style={{ padding: '0 16px' }}>
          <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#EF4444', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
            <span style={{ fontSize: '18px' }}>🚪</span>
            <span>Log Out</span>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <header style={{ backgroundColor: '#FFFFFF', padding: '16px 32px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>Hello, Student! 👋</h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '13px' }}>Keep learning, keep growing.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            
            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>🔍</span>
              <input type="text" placeholder="Search courses..." style={{ padding: '10px 16px 10px 36px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', width: '250px', outline: 'none', color: '#0F172A' }} />
            </div>

            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <span onClick={() => navigate('/notifications')} style={{ fontSize: '22px', color: '#64748B' }}>🔔</span>
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', backgroundColor: '#6366F1', color: 'white', fontSize: '10px', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>3</div>
            </div>
            
            <div style={{ position: 'relative' }}>
              <div onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#6366F1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}>ST</div>
              
              {/* FIXED: Dropdown Menu with all options restored */}
              {isProfileOpen && (
                <div style={{ position: 'absolute', top: '50px', right: '0', backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '200px', overflow: 'hidden', border: '1px solid #E2E8F0', zIndex: 100 }}>
                  <div style={{ padding: '12px 20px', borderBottom: '1px solid #E2E8F0' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#0F172A' }}>Student User</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>student@lms.edu</p>
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

        {/* Content Wrapper */}
        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Subheader: Title & Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#0F172A' }}>My Courses</h2>
              <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>View and manage all the courses you are enrolled in.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontWeight: '600' }}>
                <span style={{ fontSize: '14px' }}>Y</span> Filter
              </button>
              <select style={{ padding: '8px 16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontWeight: '600', outline: 'none' }}>
                <option>Sort by: Recent</option>
                <option>Alphabetical</option>
                <option>Progress</option>
              </select>
              <div style={{ display: 'flex', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
                <button style={{ padding: '8px 12px', backgroundColor: '#EEF2FF', border: 'none', borderRight: '1px solid #E2E8F0', cursor: 'pointer', color: '#6366F1' }}>🔲</button>
                <button style={{ padding: '8px 12px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>📋</button>
              </div>
            </div>
          </div>

          {/* Top Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
             <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EEF2FF', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📖</div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#0F172A', fontWeight: '700', fontSize: '20px' }}>6</p>
                  <p style={{ margin: 0, color: '#64748B', fontSize: '12px' }}>Enrolled Courses<br/>Active courses</p>
                </div>
             </div>
             <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>☑️</div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#0F172A', fontWeight: '700', fontSize: '20px' }}>2</p>
                  <p style={{ margin: 0, color: '#64748B', fontSize: '12px' }}>Completed<br/>Courses completed</p>
                </div>
             </div>
             <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FFFBEB', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>⏱️</div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#0F172A', fontWeight: '700', fontSize: '20px' }}>4</p>
                  <p style={{ margin: 0, color: '#64748B', fontSize: '12px' }}>In Progress<br/>Keep it up!</p>
                </div>
             </div>
             <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📊</div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#0F172A', fontWeight: '700', fontSize: '20px' }}>68%</p>
                  <p style={{ margin: 0, color: '#64748B', fontSize: '12px' }}>Total Progress<br/>Overall completion</p>
                </div>
             </div>
          </div>

          {/* Courses Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {coursesData.map(course => (
              <div key={course.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
                <div style={{ height: '140px', backgroundColor: course.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', opacity: 0.9 }}>
                  {course.icon}
                </div>
                
                <div style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0', color: '#0F172A', fontSize: '18px', lineHeight: '1.4' }}>{course.title}</h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>👨‍🏫</div>
                      <span style={{ color: '#64748B', fontSize: '13px' }}>{course.instructor}</span>
                    </div>
                    <span style={{ color: course.color, fontWeight: '700', fontSize: '14px' }}>{course.progress}%</span>
                  </div>

                  <div style={{ width: '100%', height: '6px', backgroundColor: '#F1F5F9', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
                    <div style={{ width: `${course.progress}%`, height: '100%', backgroundColor: course.color, borderRadius: '4px' }}></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button style={{ padding: '8px 16px', backgroundColor: 'transparent', border: `1px solid ${course.color}`, color: course.color, borderRadius: '6px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
                      Continue Learning
                    </button>
                    <span style={{ color: '#94A3B8', cursor: 'pointer', fontSize: '20px' }}>⋮</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Banner */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#EEF2FF', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>ℹ️</div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: '#0F172A', fontSize: '16px' }}>Don't see your course?</h4>
                <p style={{ margin: 0, color: '#64748B', fontSize: '13px' }}>If you think you should have access to a course, please contact your instructor or administrator.</p>
              </div>
            </div>
            <button style={{ padding: '10px 20px', backgroundColor: '#FFFFFF', border: '1px solid #6366F1', color: '#6366F1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
              📖 Browse All Courses
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;