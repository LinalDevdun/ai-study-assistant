import { useNavigate } from 'react-router-dom';
import '../index.css';

function Notifications() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
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
            📝 Upcoming Assignments
          </div>
          <div onClick={() => navigate('/deadlines')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📅 Upcoming Deadlines
          </div>
          
          {/* Active State for Notifications */}
          <div style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: '#4318FF', color: '#FFFFFF', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔔 Notifications
          </div>
          
          <div onClick={() => navigate('/tutor')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🤖 AI Assistant
          </div>
          
          {/* FIXED: Added Grades onClick handler! */}
          <div onClick={() => navigate('/grades')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🏆 Recent Grades
          </div>
        </nav>

        <div style={{ padding: '0 15px' }}>
          <div onClick={handleLogout} style={{ padding: '12px 20px', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold' }}>
            🚪 Log Out
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#111C44', margin: '0 0 5px 0' }}>Notifications 🔔</h1>
          <p style={{ color: '#A3AED0', margin: 0 }}>Stay updated with course announcements and alerts.</p>
        </div>

        {/* Notifications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '800px' }}>
          
          {/* New Grade Notification */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', borderLeft: '6px solid #10B981', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '24px' }}>🎉</div>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#111C44', fontSize: '16px' }}>New Grade Posted</h3>
              <p style={{ margin: 0, color: '#64748B', fontSize: '14px', lineHeight: '1.5' }}>Your assignment "React UI Refactoring" has been graded. You scored 100/100!</p>
              <span style={{ display: 'inline-block', marginTop: '10px', color: '#A3AED0', fontSize: '12px' }}>2 hours ago</span>
            </div>
          </div>

          {/* Course Announcement Notification */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', borderLeft: '6px solid #4318FF', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '24px' }}>📢</div>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#111C44', fontSize: '16px' }}>New Course Material</h3>
              <p style={{ margin: 0, color: '#64748B', fontSize: '14px', lineHeight: '1.5' }}>Prof. Smith uploaded a new lecture video for "Advanced Database Design".</p>
              <span style={{ display: 'inline-block', marginTop: '10px', color: '#A3AED0', fontSize: '12px' }}>Yesterday</span>
            </div>
          </div>

          {/* System Alert Notification */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', borderLeft: '6px solid #3B82F6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '24px' }}>⚙️</div>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#111C44', fontSize: '16px' }}>Scheduled Maintenance</h3>
              <p style={{ margin: 0, color: '#64748B', fontSize: '14px', lineHeight: '1.5' }}>The LMS will be offline for 30 minutes this Sunday at 2:00 AM for a system upgrade.</p>
              <span style={{ display: 'inline-block', marginTop: '10px', color: '#A3AED0', fontSize: '12px' }}>2 days ago</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Notifications;