import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [pendingRoles, setPendingRoles] = useState({}); 
  const [activeTab, setActiveTab] = useState('users'); // Set 'users' as default for now to see your changes
  
  // --- NEW STATES FOR ADVANCED USER MANAGEMENT ---
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // ALL, STUDENT, LECTURER, ADMIN
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [selectedUser, setSelectedUser] = useState(null); // For the View Details Modal

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

  const handleDropdownChange = (userId, newRole) => {
    setPendingRoles({ ...pendingRoles, [userId]: newRole });
  };

  const handleSaveRole = async (userId) => {
    const roleToSave = pendingRoles[userId];
    if (!roleToSave) return; 
    
    // Add confirmation for sensitive role changes (like making someone an Admin)
    if (roleToSave === 'ADMIN') {
      const confirmAdmin = window.confirm("⚠️ WARNING: You are about to grant Administrator privileges to this user. They will have full system access. Proceed?");
      if (!confirmAdmin) {
        // Revert dropdown if cancelled
        const updatedPending = { ...pendingRoles };
        delete updatedPending[userId];
        setPendingRoles(updatedPending);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/admin/users/${userId}/role`, 
        { role: roleToSave },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setUsers(users.map(user => user.id === userId ? { ...user, role: roleToSave } : user));
      const updatedPending = { ...pendingRoles };
      delete updatedPending[userId];
      setPendingRoles(updatedPending);
      alert("Role updated successfully!");

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

  // --- MOCK ACTIONS FOR UI ---
  const handleDeleteUser = (name) => {
    const confirmDelete = window.confirm(`🛑 Are you sure you want to permanently delete ${name}? This action cannot be undone.`);
    if (confirmDelete) {
      alert("Backend route for deletion needs to be connected!"); // Placeholder
    }
  };

  // --- FILTERING & PAGINATION LOGIC ---
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

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
            <div onClick={() => setActiveTab('dashboard')} style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: activeTab === 'dashboard' ? '#4318FF' : 'transparent', color: activeTab === 'dashboard' ? '#FFFFFF' : '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
              🏠 Dashboard
            </div>
            <div onClick={() => setActiveTab('users')} style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: activeTab === 'users' ? '#4318FF' : 'transparent', color: activeTab === 'users' ? '#FFFFFF' : '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
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
          
          {/* TAB: USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div style={{ maxWidth: '1200px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
                <div>
                  <h1 style={{ color: '#111C44', margin: '0 0 10px 0', fontSize: '28px' }}>User Management</h1>
                  <p style={{ color: '#A3AED0', margin: 0 }}>View, filter, and manage all registered accounts.</p>
                </div>
                {/* Search Bar */}
                <div>
                  <input 
                    type="text" 
                    placeholder="🔍 Search name or email..." 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #E2E8F0', width: '250px', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Role Filters (Tabs) */}
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                {['ALL', 'STUDENT', 'LECTURER', 'ADMIN'].map(role => (
                  <button 
                    key={role}
                    onClick={() => { setRoleFilter(role); setCurrentPage(1); }}
                    style={{ 
                      padding: '8px 16px', 
                      borderRadius: '20px', 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      border: roleFilter === role ? 'none' : '1px solid #E2E8F0',
                      backgroundColor: roleFilter === role ? '#4318FF' : '#FFFFFF',
                      color: roleFilter === role ? '#FFFFFF' : '#A3AED0',
                      transition: '0.2s'
                    }}
                  >
                    {role === 'ALL' ? 'All Users' : role + 'S'}
                  </button>
                ))}
              </div>

              {/* The Users Table */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '13px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '16px 20px' }}>ID</th>
                      <th style={{ padding: '16px 20px' }}>User</th>
                      <th style={{ padding: '16px 20px' }}>Role</th>
                      <th style={{ padding: '16px 20px' }}>Status</th>
                      <th style={{ padding: '16px 20px' }}>Last Login</th>
                      <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#A3AED0' }}>No users found matching your search.</td>
                      </tr>
                    ) : (
                      currentUsers.map(user => {
                        const currentDisplayRole = pendingRoles[user.id] || user.role;
                        const hasChanged = pendingRoles[user.id] && pendingRoles[user.id] !== user.role;

                        return (
                          <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '16px 20px', color: '#2B3674', fontWeight: 'bold' }}>#{user.id}</td>
                            
                            <td style={{ padding: '16px 20px' }}>
                              <div style={{ color: '#111C44', fontWeight: 'bold' }}>{user.name}</div>
                              <div style={{ color: '#A3AED0', fontSize: '13px' }}>{user.email}</div>
                            </td>

                            <td style={{ padding: '16px 20px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <select 
                                  value={currentDisplayRole} 
                                  onChange={(e) => handleDropdownChange(user.id, e.target.value)}
                                  style={{
                                    padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0',
                                    backgroundColor: currentDisplayRole === 'ADMIN' ? '#FEE2E2' : currentDisplayRole === 'LECTURER' ? '#E0E7FF' : '#F3F4F6',
                                    color: currentDisplayRole === 'ADMIN' ? '#EF4444' : currentDisplayRole === 'LECTURER' ? '#4318FF' : '#4B5563',
                                    fontWeight: 'bold', cursor: 'pointer', outline: 'none'
                                  }}
                                >
                                  <option value="STUDENT">STUDENT</option>
                                  <option value="LECTURER">LECTURER</option>
                                  <option value="ADMIN">ADMIN</option>
                                </select>
                                {hasChanged && (
                                  <button onClick={() => handleSaveRole(user.id)} style={{ padding: '6px 12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                                    Save
                                  </button>
                                )}
                              </div>
                            </td>

                            <td style={{ padding: '16px 20px' }}>
                              <span style={{ padding: '4px 10px', backgroundColor: '#ECFDF5', color: '#10B981', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                                Active 🟢
                              </span>
                            </td>

                            <td style={{ padding: '16px 20px', color: '#64748B', fontSize: '14px' }}>
                              {formatDate(user.last_login)}
                            </td>
                            
                            <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <button onClick={() => setSelectedUser(user)} style={{ padding: '6px 12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#4318FF' }}>View</button>
                                <button onClick={() => handleDeleteUser(user.name)} style={{ padding: '6px 12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#EF4444' }}>Delete</button>
                              </div>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B', fontSize: '14px' }}>
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                  </span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      disabled={currentPage === 1} 
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      style={{ padding: '6px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', backgroundColor: currentPage === 1 ? '#F1F5F9' : '#FFFFFF', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: '#475569' }}
                    >
                      Previous
                    </button>
                    <button 
                      disabled={currentPage === totalPages || totalPages === 0} 
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      style={{ padding: '6px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', backgroundColor: currentPage === totalPages || totalPages === 0 ? '#F1F5F9' : '#FFFFFF', cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: '#475569' }}
                    >
                      Next
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: DASHBOARD (Placeholder from previous step) */}
          {activeTab === 'dashboard' && (
            <div><h1 style={{ color: '#111C44' }}>Dashboard Overview</h1><p style={{color: '#A3AED0'}}>Click the "Users" tab to see the new management features!</p></div>
          )}

        </main>
      </div>

      {/* VIEW USER MODAL / OVERLAY */}
      {selectedUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '30px', borderRadius: '16px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '15px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#111C44' }}>User Profile</h2>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94A3B8' }}>✖</button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 5px 0', color: '#64748B', fontSize: '13px', fontWeight: 'bold' }}>FULL NAME</p>
              <p style={{ margin: 0, color: '#111C44', fontSize: '16px', fontWeight: 'bold' }}>{selectedUser.name}</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 5px 0', color: '#64748B', fontSize: '13px', fontWeight: 'bold' }}>EMAIL ADDRESS</p>
              <p style={{ margin: 0, color: '#111C44', fontSize: '16px' }}>{selectedUser.email}</p>
            </div>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
              <div>
                <p style={{ margin: '0 0 5px 0', color: '#64748B', fontSize: '13px', fontWeight: 'bold' }}>ROLE</p>
                <span style={{ backgroundColor: '#E0E7FF', color: '#4318FF', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>{selectedUser.role}</span>
              </div>
              <div>
                <p style={{ margin: '0 0 5px 0', color: '#64748B', fontSize: '13px', fontWeight: 'bold' }}>COHORT</p>
                <p style={{ margin: 0, color: '#111C44', fontSize: '14px' }}>{selectedUser.degree || 'N/A'} ({selectedUser.batch || 'N/A'})</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
              <button onClick={() => setSelectedUser(null)} style={{ flex: 1, padding: '10px', backgroundColor: '#F1F5F9', border: 'none', borderRadius: '8px', fontWeight: 'bold', color: '#475569', cursor: 'pointer' }}>Close</button>
              <button onClick={() => { setSelectedUser(null); handleDeleteUser(selectedUser.name); }} style={{ flex: 1, padding: '10px', backgroundColor: '#EF4444', border: 'none', borderRadius: '8px', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}>Suspend User</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;