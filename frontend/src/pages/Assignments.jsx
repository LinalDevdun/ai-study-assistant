import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function Assignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [submittedAssignments, setSubmittedAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/assignments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setAssignments(response.data);
      } catch (err) {
        console.error('Error fetching assignments:', err);
      }
    };

    fetchAssignments();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleFileChange = (assignmentId, file) => {
    setSelectedFiles(prev => ({
      ...prev,
      [assignmentId]: file
    }));
  };

  const handleSubmit = async (assignmentId) => {
    const file = selectedFiles[assignmentId];
    
    if (!file) {
      alert("Please select a file to upload first!");
      return;
    }

    const formData = new FormData();
    formData.append('assignmentId', assignmentId);
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/submissions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      alert(response.data.message); // Will say "Submitted" or "Resubmitted" based on backend
      setSubmittedAssignments(prev => [...prev, assignmentId]);
      
    } catch (error) {
      console.error("Error submitting assignment:", error);
      if (error.response && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("Failed to submit assignment. Make sure the backend is running!");
      }
    }
  };

  const formatDueDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, backgroundColor: '#F4F7FE', fontFamily: 'sans-serif' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
        <div style={{ padding: '0 20px', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, color: '#111C44', fontSize: '22px' }}>🎓 LMS <span style={{ color: '#4318FF' }}>Pro</span></h2>
        </div>

        <nav style={{ flex: 1, padding: '0 15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div onClick={() => navigate('/dashboard')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>📚 My Courses</div>
          <div onClick={() => navigate('/progress')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>📈 Learning Progress</div>
          <div style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: '#4318FF', color: '#FFFFFF', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>📝 Assignments</div>
          <div onClick={() => navigate('/deadlines')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>📅 Upcoming Deadlines</div>
          <div onClick={() => navigate('/tutor')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>🤖 AI Assistant</div>
          <div onClick={() => navigate('/grades')} style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>🏆 Recent Grades</div>
        </nav>

        <div style={{ padding: '0 15px' }}>
          <div onClick={handleLogout} style={{ padding: '12px 20px', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>🚪 Log Out</div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#111C44', margin: '0 0 5px 0' }}>Course Assignments 📝</h1>
          <p style={{ color: '#A3AED0', margin: 0 }}>Review, submit, and manage your coursework.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px', marginBottom: '50px' }}>
          {assignments.length === 0 ? (
            <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: '#64748B', margin: 0 }}>No assignments available! 🎉</h3>
              <p style={{ color: '#A3AED0', marginTop: '8px' }}>You are all caught up.</p>
            </div>
          ) : (
            assignments.map((assignment) => {
              const isGraded = assignment.is_graded;
              const isSubmitted = assignment.is_submitted || submittedAssignments.includes(assignment.id);

              return (
                <div key={assignment.id} style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#111C44', fontSize: '20px' }}>{assignment.title}</h3>
                    <p style={{ margin: '0 0 15px 0', color: '#64748B', fontSize: '15px', lineHeight: '1.5' }}>{assignment.description}</p>
                    
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ backgroundColor: '#FEF2F2', color: '#EF4444', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>🚨 Due: {formatDueDate(assignment.due_date)}</span>
                      <span style={{ backgroundColor: '#F1F5F9', color: '#475569', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>Cohort: {assignment.degree} ({assignment.batch})</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '240px' }}>
                    {assignment.file_path && (
                      <a href={`http://localhost:5000/${assignment.file_path.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <button style={{ width: '100%', padding: '10px 20px', backgroundColor: '#F8FAFC', color: '#4318FF', border: '1px solid #E2E8F0', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>📄 Download Brief</button>
                      </a>
                    )}
                    
                    {/* UI LOGIC: Graded vs Submitted vs Pending */}
                    {isGraded ? (
                      <div style={{ padding: '12px', backgroundColor: '#F0FDF4', border: '1px solid #10B981', borderRadius: '8px', textAlign: 'center' }}>
                        <p style={{ margin: 0, color: '#10B981', fontWeight: 'bold' }}>🏆 Graded & Locked</p>
                        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748B' }}>Check the Recent Grades tab</p>
                      </div>
                    ) : isSubmitted ? (
                      <div style={{ padding: '12px', backgroundColor: '#ECFDF5', border: '1px dashed #10B981', borderRadius: '8px', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 10px 0', color: '#10B981', fontWeight: 'bold' }}>✅ Submitted</p>
                        <input type="file" onChange={(e) => handleFileChange(assignment.id, e.target.files[0])} style={{ border: '1px solid #E2E8F0', padding: '6px', borderRadius: '6px', fontSize: '12px', color: '#64748B', backgroundColor: '#FFFFFF', width: '100%', boxSizing: 'border-box', marginBottom: '8px' }} />
                        <button onClick={() => handleSubmit(assignment.id)} style={{ width: '100%', padding: '8px', backgroundColor: '#F59E0B', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                          🔄 Resubmit Work
                        </button>
                      </div>
                    ) : (
                      <>
                        <input type="file" onChange={(e) => handleFileChange(assignment.id, e.target.files[0])} style={{ border: '1px solid #E2E8F0', padding: '8px', borderRadius: '6px', fontSize: '13px', color: '#64748B', backgroundColor: '#F8FAFC' }} />
                        <button onClick={() => handleSubmit(assignment.id)} style={{ width: '100%', padding: '12px 24px', backgroundColor: '#4318FF', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(67, 24, 255, 0.2)' }}>
                          Upload & Submit
                        </button>
                      </>
                    )}

                  </div>
                </div>
              );
            })
          )}
        </div>

      </main>
    </div>
  );
}

export default Assignments;