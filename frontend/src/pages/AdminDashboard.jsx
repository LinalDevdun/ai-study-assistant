import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  // NEW: Tracks dropdown changes before they are saved to the database
  const [pendingRoles, setPendingRoles] = useState({}); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

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

  // 1. Updates the dropdown locally (but doesn't save to the DB yet)
  const handleDropdownChange = (userId, newRole) => {
    setPendingRoles({
      ...pendingRoles,
      [userId]: newRole
    });
  };

  // 2. Triggers when you click "Save"
  const handleSaveRole = async (userId) => {
    const roleToSave = pendingRoles[userId];
    if (!roleToSave) return; 

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/admin/users/${userId}/role`, 
        { role: roleToSave },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Update the main user list with the new permanent role
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: roleToSave } : user
      ));
      
      // Clear the pending state so the Save button hides itself again
      const updatedPending = { ...pendingRoles };
      delete updatedPending[userId];
      setPendingRoles(updatedPending);

    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update user role.');
    }
  };

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
          <h2 style={{ margin: 0, color: '#111C44', fontSize: '22px' }}>🛡️ Admin Panel</h2>
        </div>

        <nav style={{ flex: 1, padding: '0 15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: '#4318FF', color: '#FFFFFF', fontWeight: 'bold' }}>
            👥 Manage Users
          </div>
          <div style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer' }}>
            📖 Course Directory
          </div>
          <div style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer' }}>
            📊 System Analytics
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
        <h1 style={{ color: '#111C44', margin: '0 0 10px 0' }}>User Management</h1>
        <p style={{ color: '#A3AED0', marginBottom: '30px' }}>View and update user roles across the system.</p>

        {/* Admin Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px' }}>
            <p style={{ margin: 0, color: '#A3AED0', fontWeight: 'bold' }}>Total Users</p>
            <h2 style={{ margin: '10px 0 0 0', color: '#111C44', fontSize: '28px' }}>{users.length}</h2>
          </div>
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px' }}>
            <p style={{ margin: 0, color: '#A3AED0', fontWeight: 'bold' }}>Total Courses</p>
            <h2 style={{ margin: '10px 0 0 0', color: '#111C44', fontSize: '28px' }}>Active</h2>
          </div>
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px' }}>
            <p style={{ margin: 0, color: '#A3AED0', fontWeight: 'bold' }}>System Status</p>
            <h2 style={{ margin: '10px 0 0 0', color: '#10B981', fontSize: '28px' }}>Healthy 🟢</h2>
          </div>
        </div>

        {/* The Users Table */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#111C44', marginTop: 0, marginBottom: '20px' }}>Registered Users</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F4F7FE', color: '#A3AED0' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Role</th>
                <th style={{ padding: '12px' }}>Actions</th> {/* <-- NEW COLUMN */}
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                // Figure out what role is currently selected in the dropdown
                const currentDisplayRole = pendingRoles[user.id] || user.role;
                // Check if the dropdown is different from the database
                const hasChanged = pendingRoles[user.id] && pendingRoles[user.id] !== user.role;

                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid #F4F7FE' }}>
                    <td style={{ padding: '12px', color: '#2B3674', fontWeight: 'bold' }}>#{user.id}</td>
                    <td style={{ padding: '12px', color: '#2B3674' }}>{user.name}</td>
                    <td style={{ padding: '12px', color: '#A3AED0' }}>{user.email}</td>
                    <td style={{ padding: '12px' }}>
                      
                      <select 
                        value={currentDisplayRole} 
                        onChange={(e) => handleDropdownChange(user.id, e.target.value)}
                        style={{
                          padding: '8px', 
                          borderRadius: '6px', 
                          border: '1px solid #E2E8F0',
                          backgroundColor: currentDisplayRole === 'ADMIN' ? '#FEE2E2' : currentDisplayRole === 'LECTURER' ? '#E0E7FF' : '#F3F4F6',
                          color: currentDisplayRole === 'ADMIN' ? '#EF4444' : currentDisplayRole === 'LECTURER' ? '#4318FF' : '#4B5563',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="STUDENT">STUDENT</option>
                        <option value="LECTURER">LECTURER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    
                    {/* The Action Column for the Save Button */}
                    <td style={{ padding: '12px' }}>
                      {hasChanged && (
                        <button 
                          onClick={() => handleSaveRole(user.id)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          Save
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;