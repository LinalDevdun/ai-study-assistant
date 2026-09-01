import { useNavigate } from 'react-router-dom';
import '../index.css';

function Progress() {
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
          
          {/* Active State for Progress */}
          <div style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: '#4318FF', color: '#FFFFFF', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📈 Learning Progress
          </div>
          
          <div onClick={() => navigate('/assignments')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📝 Upcoming Assignments
          </div>
          
          <div onClick={() => navigate('/deadlines')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📅 Upcoming Deadlines
          </div>
          
          {/* FIXED: Added Notifications onClick handler! */}
          <div onClick={() => navigate('/notifications')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔔 Notifications
          </div>
          
          <div onClick={() => navigate('/tutor')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🤖 AI Assistant
          </div>
          
          {/* BONUS FIXED: Added Grades onClick handler for the future! */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ color: '#111C44', margin: '0 0 5px 0' }}>Learning Progress 📈</h1>
            <p style={{ color: '#A3AED0', margin: 0 }}>Track your course completion and grades.</p>
          </div>
        </div>

        {/* Progress Cards */}
        <div style={{ display: 'grid', gap: '20px', maxWidth: '800px' }}>
          
          {/* Example Course Progress 1 */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#111C44' }}>Introduction to React</h3>
              <span style={{ color: '#10B981', fontWeight: 'bold' }}>75%</span>
            </div>
            {/* The Progress Bar Container */}
            <div style={{ width: '100%', backgroundColor: '#F1F5F9', borderRadius: '999px', height: '12px', overflow: 'hidden' }}>
              {/* The Actual Progress Fill */}
              <div style={{ width: '75%', backgroundColor: '#10B981', height: '100%', borderRadius: '999px' }}></div>
            </div>
            <p style={{ margin: '15px 0 0 0', color: '#64748B', fontSize: '14px' }}>3 out of 4 modules completed.</p>
          </div>

          {/* Example Course Progress 2 */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#111C44' }}>Advanced Database Design</h3>
              <span style={{ color: '#4318FF', fontWeight: 'bold' }}>40%</span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#F1F5F9', borderRadius: '999px', height: '12px', overflow: 'hidden' }}>
              <div style={{ width: '40%', backgroundColor: '#4318FF', height: '100%', borderRadius: '999px' }}></div>
            </div>
            <p style={{ margin: '15px 0 0 0', color: '#64748B', fontSize: '14px' }}>2 out of 5 modules completed.</p>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Progress;