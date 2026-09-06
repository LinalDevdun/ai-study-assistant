import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users just so we can calculate the stats on the dashboard
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const studentCount = users.filter(u => u.role === 'STUDENT').length;
  const lecturerCount = users.filter(u => u.role === 'LECTURER').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, backgroundColor: '#F4F7FE', color: '#2B3674', fontFamily: 'sans-serif' }}>
      
      {/* TOP NAVBAR */}
      <header style={{ height: '70px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', zIndex: 10 }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111C44', letterSpacing: '0.5px' }}>
          LMS Pro Admin
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <span style={{ fontSize: '20px', cursor: 'pointer' }}>🔔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', color: '#111C44', cursor: 'pointer' }}>
            Admin <span style={{ backgroundColor: '#F4F7FE', padding: '8px', borderRadius: '50%', fontSize: '16px' }}>👤</span>
          </div>
        </div>
      </header>

      {/* LOWER BODY */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* SIDEBAR */}
        <aside style={{ width: '250px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
          <nav style={{ flex: 1, padding: '0 15px', display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
            
            {/* ACTIVE: Dashboard */}
            <div style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: '#4318FF', color: '#FFFFFF', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
              🏠 Dashboard
            </div>
            
            {/* INACTIVE: Users (Navigates to AdminUsers.jsx) */}
            <div onClick={() => navigate('/admin-users')} style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: 'transparent', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: '0.2s' }}>
              👥 Users
            </div>
            
            <div style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>📚 Courses</div>
            <div style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>📋 Enrollment</div>
            <div style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>📊 Analytics</div>
            <div style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>🔔 Announce.</div>
            <div style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>🛡️ Activity</div>
            <div style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>⚙️ Settings</div>
          </nav>
          
          <div style={{ padding: '15px', borderTop: '1px solid #E2E8F0', marginTop: 'auto' }}>
            <div onClick={handleLogout} style={{ padding: '12px 20px', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
              🚪 Log Out
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1000px' }}>
            <h1 style={{ color: '#111C44', margin: '0 0 30px 0', fontSize: '28px' }}>Welcome, Administrator</h1>
            
            {/* 4 Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#111C44', fontSize: '32px' }}>{studentCount || 1248}</h2>
                <p style={{ margin: 0, color: '#A3AED0', fontWeight: 'bold', fontSize: '14px' }}>Students</p>
              </div>
              <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#111C44', fontSize: '32px' }}>{lecturerCount || 86}</h2>
                <p style={{ margin: 0, color: '#A3AED0', fontWeight: 'bold', fontSize: '14px' }}>Lecturers</p>
              </div>
              <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#111C44', fontSize: '32px' }}>74</h2>
                <p style={{ margin: 0, color: '#A3AED0', fontWeight: 'bold', fontSize: '14px' }}>Courses</p>
              </div>
              <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#111C44', fontSize: '32px' }}>892</h2>
                <p style={{ margin: 0, color: '#A3AED0', fontWeight: 'bold', fontSize: '14px' }}>Active</p>
              </div>
            </div>

            {/* Bottom 2 Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              
              {/* Recent Activity */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#111C44', borderBottom: '2px solid #F4F7FE', paddingBottom: '10px' }}>Recent Activity</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#4B5563', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <li>🟢 New user registered</li>
                  <li>✅ Course approved</li>
                  <li>🔄 Role changed</li>
                </ul>
              </div>

              {/* Course Statistics */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#111C44', borderBottom: '2px solid #F4F7FE', paddingBottom: '10px' }}>Course Statistics</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#4B5563', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>AI & ML</span> <strong>85%</strong></li>
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Database</span> <strong>72%</strong></li>
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Software</span> <strong>61%</strong></li>
                </ul>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;