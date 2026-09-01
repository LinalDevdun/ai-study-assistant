import { useNavigate } from 'react-router-dom';
import '../index.css';

function Grades() {
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
          <div onClick={() => navigate('/notifications')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔔 Notifications
          </div>
          <div onClick={() => navigate('/tutor')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🤖 AI Assistant
          </div>
          
          {/* Active State for Recent Grades */}
          <div style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: '#4318FF', color: '#FFFFFF', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          <h1 style={{ color: '#111C44', margin: '0 0 5px 0' }}>Recent Grades 🏆</h1>
          <p style={{ color: '#A3AED0', margin: 0 }}>Review your scores and academic performance across courses.</p>
        </div>

        {/* Grades Table/List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '900px' }}>
          
          {/* Grade Item 1 */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px 25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#111C44' }}>React UI Refactoring</h3>
              <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>Course: Frontend Development • Submitted May 12</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '15px' }}>100 / 100</span>
              <p style={{ margin: '5px 0 0 0', color: '#10B981', fontSize: '12px', fontWeight: 'bold' }}>Grade: A+</p>
            </div>
          </div>

          {/* Grade Item 2 */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px 25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#111C44' }}>Database Optimization Lab</h3>
              <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>Course: Advanced Databases • Submitted May 05</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ backgroundColor: '#E0F7FA', color: '#00838F', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '15px' }}>88 / 100</span>
              <p style={{ margin: '5px 0 0 0', color: '#00ACC1', fontSize: '12px', fontWeight: 'bold' }}>Grade: B+</p>
            </div>
          </div>

          {/* Grade Item 3 */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px 25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#111C44' }}>Midterm Architecture Exam</h3>
              <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>Course: System Architecture • Submitted Apr 28</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '15px' }}>78 / 100</span>
              <p style={{ margin: '5px 0 0 0', color: '#F59E0B', fontSize: '12px', fontWeight: 'bold' }}>Grade: C+</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Grades;