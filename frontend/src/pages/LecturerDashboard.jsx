import { useNavigate } from 'react-router-dom';
import '../index.css';

function LecturerDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, backgroundColor: '#F4F7FE', color: '#2B3674', fontFamily: 'sans-serif' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
        <div style={{ padding: '0 20px', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, color: '#111C44', fontSize: '22px' }}>👨‍🏫 Lecturer Portal</h2>
        </div>

        <nav style={{ flex: 1, padding: '0 15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: '#4318FF', color: '#FFFFFF', fontWeight: 'bold' }}>
            📚 Manage Courses
          </div>
          <div style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold' }}>
            📝 Assignments & Grading
          </div>
          <div style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold' }}>
            🧠 AI Quiz Generator
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
        <h1 style={{ color: '#111C44', margin: '0 0 10px 0' }}>Lecturer Control Center</h1>
        <p style={{ color: '#A3AED0', marginBottom: '30px' }}>Create courses, upload materials, and review student progress.</p>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <button style={{ backgroundColor: '#10B981', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            + Create New Course
          </button>
          <button style={{ backgroundColor: '#4318FF', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            + Create Assignment
          </button>
        </div>
      </main>
    </div>
  );
}

export default LecturerDashboard;