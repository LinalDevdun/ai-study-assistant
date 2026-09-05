import { useNavigate } from 'react-router-dom';
import '../index.css';

function Deadlines() {
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
            📝 Assignments
          </div>
          
          {/* Active State for Deadlines */}
          <div style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: '#4318FF', color: '#FFFFFF', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📅 Upcoming Deadlines
          </div>

          
          <div onClick={() => navigate('/tutor')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🤖 AI Assistant
          </div>
          
          <div onClick={() => navigate('/grades')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🏆 Recent Grades
          </div>
        </nav>


      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#111C44', margin: '0 0 5px 0' }}>Upcoming Deadlines 📅</h1>
          <p style={{ color: '#A3AED0', margin: 0 }}>Stay on top of your schedule. Here is what is due soon.</p>
        </div>

        {/* Deadlines List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '800px' }}>
          
          {/* Urgent Deadline */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', borderLeft: '6px solid #EF4444', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#111C44' }}>React UI Refactoring</h3>
              <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>Course: Frontend Development</p>
            </div>
            <div>
              <span style={{ backgroundColor: '#FEE2E2', color: '#EF4444', padding: '8px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>Due Tomorrow</span>
            </div>
          </div>

          {/* Warning Deadline */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', borderLeft: '6px solid #F59E0B', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#111C44' }}>Database Schema Design</h3>
              <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>Course: Advanced Databases</p>
            </div>
            <div>
              <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '8px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>Due in 3 Days</span>
            </div>
          </div>

          {/* Normal Deadline */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', borderLeft: '6px solid #10B981', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#111C44' }}>Weekly Quiz 4</h3>
              <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>Course: System Architecture</p>
            </div>
            <div>
              <span style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '8px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>Due Next Week</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Deadlines;