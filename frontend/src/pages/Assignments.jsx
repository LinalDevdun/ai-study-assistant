import { useNavigate } from 'react-router-dom';
import '../index.css';

function Assignments() {
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
          
          {/* Active State for Assignments */}
          <div style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: '#4318FF', color: '#FFFFFF', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📝 Upcoming Assignments
          </div>
          
          <div onClick={() => navigate('/deadlines')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📅 Upcoming Deadlines
          </div>
          

          
          <div onClick={() => navigate('/tutor')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🤖 AI Assistant
          </div>
          
          {/* BONUS FIXED: Added Grades onClick handler for the future! */}
          <div onClick={() => navigate('/grades')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🏆 Recent Grades
          </div>
        </nav>


      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#111C44', margin: '0 0 5px 0' }}>Upcoming Assignments 📝</h1>
          <p style={{ color: '#A3AED0', margin: 0 }}>Review and submit your pending coursework.</p>
        </div>

        {/* Assignments List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' }}>
          
          {/* Assignment Card 1 */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', color: '#111C44' }}>Build a React Navigation Bar</h3>
              <p style={{ margin: '0 0 10px 0', color: '#64748B', fontSize: '14px' }}>Course: Frontend Development</p>
              <span style={{ backgroundColor: '#F1F5F9', color: '#475569', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>Worth: 15 Points</span>
            </div>
            <button style={{ padding: '12px 24px', backgroundColor: '#4318FF', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(67, 24, 255, 0.2)' }}>
              Submit Work
            </button>
          </div>

          {/* Assignment Card 2 */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', color: '#111C44' }}>PostgreSQL ER Diagram</h3>
              <p style={{ margin: '0 0 10px 0', color: '#64748B', fontSize: '14px' }}>Course: Advanced Databases</p>
              <span style={{ backgroundColor: '#F1F5F9', color: '#475569', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>Worth: 20 Points</span>
            </div>
            <button style={{ padding: '12px 24px', backgroundColor: '#4318FF', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(67, 24, 255, 0.2)' }}>
              Submit Work
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Assignments;