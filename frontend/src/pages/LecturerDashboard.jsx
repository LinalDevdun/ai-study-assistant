import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function LecturerDashboard() {
  const navigate = useNavigate();
  
  // Tab Navigation State
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' or 'submissions'
  const [studentSubmissions, setStudentSubmissions] = useState([]);

  // NEW: Grading States (Maps submission ID to the input values)
  const [grades, setGrades] = useState({});
  const [feedbacks, setFeedbacks] = useState({});

  // UI Toggles
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  
  // History States
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);

  // Course Form States
  const [courseTitle, setCourseTitle] = useState('');
  const [degree, setDegree] = useState('');
  const [batch, setBatch] = useState('');
  const [file, setFile] = useState(null);

  // Assignment Form States
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDesc, setAssignmentDesc] = useState('');
  const [assignmentDueDate, setAssignmentDueDate] = useState('');
  const [assignmentDegree, setAssignmentDegree] = useState('');
  const [assignmentBatch, setAssignmentBatch] = useState('');
  const [assignmentFile, setAssignmentFile] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const coursesRes = await axios.get('http://localhost:5000/courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecentCourses(coursesRes.data);

        const assignmentsRes = await axios.get('http://localhost:5000/assignments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecentAssignments(assignmentsRes.data);

      } catch (error) {
        console.error("Error fetching lecturer history:", error);
      }
    };

    fetchHistory();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/submissions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudentSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  // NEW: Handle Grade Submission
  const handleGradeSubmit = async (submissionId) => {
    const grade = grades[submissionId];
    const feedback = feedbacks[submissionId] || ''; // Feedback is optional

    if (!grade) {
      alert("Please enter a grade before submitting.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/submissions/${submissionId}/grade`, 
        { grade, feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Grade submitted successfully! ✅');
      
      // Refresh the submissions list so the new grade appears instantly
      fetchSubmissions();
      
      // Clear the inputs for this specific submission
      setGrades(prev => ({ ...prev, [submissionId]: '' }));
      setFeedbacks(prev => ({ ...prev, [submissionId]: '' }));
      
    } catch (error) {
      console.error("Error submitting grade:", error);
      alert("Failed to submit grade. Check backend connection.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const toggleCourseForm = () => {
    setShowCreateForm(!showCreateForm);
    setShowAssignmentForm(false);
  };

  const toggleAssignmentForm = () => {
    setShowAssignmentForm(!showAssignmentForm);
    setShowCreateForm(false);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('courseTitle', courseTitle);
    formData.append('degree', degree);
    formData.append('batch', batch);
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
      });
      
      alert(`Successfully created "${courseTitle}" for ${degree} (Batch ${batch})!`);
      setRecentCourses(prev => [...prev, response.data.course]);
      
      setCourseTitle('');
      setDegree('');
      setBatch('');
      setFile(null);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error uploading course:", error);
      alert("Failed to upload course. Make sure your backend is running!");
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!assignmentFile) {
      alert("Please attach an assignment file.");
      return;
    }

    const formData = new FormData();
    formData.append('title', assignmentTitle);
    formData.append('description', assignmentDesc);
    formData.append('dueDate', assignmentDueDate);
    formData.append('degree', assignmentDegree);
    formData.append('batch', assignmentBatch);
    formData.append('file', assignmentFile);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/assignments', formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
      });
      
      alert(`Assignment "${assignmentTitle}" successfully launched to Batch ${assignmentBatch}!`);
      setRecentAssignments(prev => [...prev, response.data.assignment]);

      setAssignmentTitle('');
      setAssignmentDesc('');
      setAssignmentDueDate('');
      setAssignmentDegree('');
      setAssignmentBatch('');
      setAssignmentFile(null);
      setShowAssignmentForm(false);
    } catch (error) {
      console.error("Error uploading assignment:", error);
      alert("Failed to upload assignment. Make sure your backend is running!");
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, backgroundColor: '#F4F7FE', fontFamily: 'sans-serif' }}>
      
      {/* LEFT SIDEBAR */}
      <aside style={{ width: '260px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
        <div style={{ padding: '0 20px', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, color: '#111C44', fontSize: '22px' }}>👩‍🏫 Lecturer Portal</h2>
        </div>

        <nav style={{ flex: 1, padding: '0 15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div 
            onClick={() => setActiveTab('manage')} 
            style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: activeTab === 'manage' ? '#4318FF' : 'transparent', color: activeTab === 'manage' ? '#FFFFFF' : '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}>
            📚 Manage Content
          </div>
          
          <div 
            onClick={() => { setActiveTab('submissions'); fetchSubmissions(); }} 
            style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: activeTab === 'submissions' ? '#4318FF' : 'transparent', color: activeTab === 'submissions' ? '#FFFFFF' : '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}>
            📊 View Submissions
          </div>
          
          <div style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🧠 AI Quiz Generator
          </div>
        </nav>

        <div style={{ padding: '0 15px' }}>
          <div onClick={handleLogout} style={{ padding: '12px 20px', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🚪 Log Out
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {activeTab === 'manage' ? (
          <>
            {/* --- MANAGE CONTENT TAB --- */}
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{ color: '#111C44', margin: '0 0 10px 0', fontSize: '32px' }}>Lecturer Control Center</h1>
              <p style={{ color: '#A3AED0', margin: 0, fontSize: '16px' }}>Create courses, distribute assignments, and review student progress.</p>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
              <button onClick={toggleCourseForm} style={{ flex: 1, padding: '16px', backgroundColor: showCreateForm ? '#EF4444' : '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
                {showCreateForm ? 'Cancel Course Creation' : '+ Create New Course'}
              </button>
              
              <button onClick={toggleAssignmentForm} style={{ flex: 1, padding: '16px', backgroundColor: showAssignmentForm ? '#EF4444' : '#4318FF', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 12px rgba(67, 24, 255, 0.2)' }}>
                {showAssignmentForm ? 'Cancel Assignment' : '+ Create Assignment'}
              </button>
            </div>

            {!showCreateForm && !showAssignmentForm && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <h2 style={{ margin: '0 0 20px 0', color: '#111C44', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>📚 Launched Courses</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {recentCourses.length === 0 ? <p style={{ color: '#A3AED0', fontStyle: 'italic', margin: 0 }}>No courses created yet.</p> : recentCourses.map(course => (
                      <div key={course.id} style={{ padding: '15px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#4318FF', fontSize: '16px' }}>{course.title}</h4>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ fontSize: '12px', color: '#475569', backgroundColor: '#E2E8F0', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{course.degree}</span>
                          <span style={{ fontSize: '12px', color: '#475569', backgroundColor: '#E2E8F0', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Batch {course.batch}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <h2 style={{ margin: '0 0 20px 0', color: '#111C44', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>📝 Active Assignments</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {recentAssignments.length === 0 ? <p style={{ color: '#A3AED0', fontStyle: 'italic', margin: 0 }}>No assignments active.</p> : recentAssignments.map(assignment => (
                      <div key={assignment.id} style={{ padding: '15px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#10B981', fontSize: '16px' }}>{assignment.title}</h4>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ fontSize: '12px', color: '#475569', backgroundColor: '#E2E8F0', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{assignment.degree}</span>
                          <span style={{ fontSize: '12px', color: '#475569', backgroundColor: '#E2E8F0', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Batch {assignment.batch}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Course Form */}
            {showCreateForm && (
              <div style={{ backgroundColor: '#FFFFFF', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '800px' }}>
                <h2 style={{ margin: '0 0 20px 0', color: '#111C44' }}>Course Details</h2>
                <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#111C44' }}>Course Title</label>
                    <input type="text" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder="e.g. Database Management Systems" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#111C44' }}>Target Degree</label>
                      <select value={degree} onChange={(e) => setDegree(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}>
                        <option value="" disabled>Select a Degree...</option>
                        <option value="BSc Software Engineering">BSc Software Engineering</option>
                        <option value="BSc Data Science">BSc Data Science</option>
                        <option value="BSc IT">BSc Information Technology</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#111C44' }}>Target Batch</label>
                      <select value={batch} onChange={(e) => setBatch(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}>
                        <option value="" disabled>Select a Batch...</option>
                        <option value="25.1">Batch 25.1</option>
                        <option value="25.2">Batch 25.2</option>
                        <option value="26.1">Batch 26.1</option>
                        <option value="26.2">Batch 26.2</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#111C44' }}>Upload Initial Material (PDF, PPTX, etc.)</label>
                    <div style={{ border: '2px dashed #A3AED0', padding: '30px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#F4F7FE' }}>
                      <input type="file" onChange={(e) => setFile(e.target.files[0])} required style={{ color: '#111C44' }} />
                    </div>
                  </div>
                  <button type="submit" style={{ padding: '14px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>Launch Course to Batch {batch || '...'}</button>
                </form>
              </div>
            )}

            {/* Assignment Form */}
            {showAssignmentForm && (
              <div style={{ backgroundColor: '#FFFFFF', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '800px' }}>
                <h2 style={{ margin: '0 0 20px 0', color: '#4318FF' }}>Create New Assignment</h2>
                <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#111C44' }}>Assignment Title</label>
                    <input type="text" value={assignmentTitle} onChange={(e) => setAssignmentTitle(e.target.value)} placeholder="e.g. Midterm SQL Project" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#111C44' }}>Instructions / Description</label>
                    <textarea value={assignmentDesc} onChange={(e) => setAssignmentDesc(e.target.value)} placeholder="Provide instructions for the students..." required rows="4" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#111C44' }}>Due Date & Time</label>
                    <input type="datetime-local" value={assignmentDueDate} onChange={(e) => setAssignmentDueDate(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#111C44' }}>Target Degree</label>
                      <select value={assignmentDegree} onChange={(e) => setAssignmentDegree(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}>
                        <option value="" disabled>Select a Degree...</option>
                        <option value="BSc Software Engineering">BSc Software Engineering</option>
                        <option value="BSc Data Science">BSc Data Science</option>
                        <option value="BSc IT">BSc Information Technology</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#111C44' }}>Target Batch</label>
                      <select value={assignmentBatch} onChange={(e) => setAssignmentBatch(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}>
                        <option value="" disabled>Select a Batch...</option>
                        <option value="25.1">Batch 25.1</option>
                        <option value="25.2">Batch 25.2</option>
                        <option value="26.1">Batch 26.1</option>
                        <option value="26.2">Batch 26.2</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#111C44' }}>Attach Assignment File (PDF, DOCX)</label>
                    <div style={{ border: '2px dashed #4318FF', padding: '30px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#F8FAFC' }}>
                      <input type="file" onChange={(e) => setAssignmentFile(e.target.files[0])} required style={{ color: '#111C44' }} />
                    </div>
                  </div>
                  <button type="submit" style={{ padding: '14px', backgroundColor: '#4318FF', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(67,24,255,0.2)' }}>Post Assignment to Batch {assignmentBatch || '...'}</button>
                </form>
              </div>
            )}
          </>
        ) : (
          <>
            {/* --- VIEW SUBMISSIONS TAB WITH GRADING --- */}
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{ color: '#111C44', margin: '0 0 10px 0', fontSize: '32px' }}>Student Submissions</h1>
              <p style={{ color: '#A3AED0', margin: 0, fontSize: '16px' }}>Review, download, and grade student assignments.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px' }}>
              {studentSubmissions.length === 0 ? (
                <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ color: '#64748B', margin: 0 }}>No submissions yet.</h3>
                  <p style={{ color: '#A3AED0', marginTop: '8px' }}>Student work will appear here once submitted.</p>
                </div>
              ) : (
                studentSubmissions.map((sub) => (
                  <div key={sub.submission_id} style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    
                    <div style={{ flex: 1, minWidth: '300px' }}>
                      <h3 style={{ margin: '0 0 8px 0', color: '#111C44', fontSize: '18px' }}>{sub.assignment_title}</h3>
                      <p style={{ margin: '0 0 12px 0', color: '#4318FF', fontWeight: 'bold', fontSize: '16px' }}>👤 {sub.student_name}</p>
                      
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', backgroundColor: '#F1F5F9', color: '#475569', padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold' }}>
                          🎓 {sub.degree} (Batch {sub.batch})
                        </span>
                        <span style={{ fontSize: '12px', backgroundColor: '#FEF2F2', color: '#EF4444', padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold' }}>
                          📅 Submitted: {new Date(sub.submitted_at).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '250px' }}>
                      <a 
                        href={`http://localhost:5000/${sub.file_path.replace(/\\/g, '/')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none' }}
                      >
                        <button style={{ width: '100%', padding: '12px 24px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
                          📥 Download Work
                        </button>
                      </a>

                      {/* --- NEW: GRADING SECTION --- */}
                      {sub.grade ? (
                        <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                          <p style={{ margin: '0 0 4px 0', color: '#111C44', fontWeight: 'bold' }}>
                            Score: <span style={{ color: '#4318FF' }}>{sub.grade}</span>
                          </p>
                          {sub.feedback && <p style={{ margin: 0, color: '#64748B', fontSize: '13px' }}>💬 {sub.feedback}</p>}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                          <input 
                            type="text" 
                            placeholder="Grade (e.g. A, 85/100)" 
                            value={grades[sub.submission_id] || ''}
                            onChange={(e) => setGrades({...grades, [sub.submission_id]: e.target.value})}
                            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px' }}
                          />
                          <input 
                            type="text" 
                            placeholder="Feedback (optional)" 
                            value={feedbacks[sub.submission_id] || ''}
                            onChange={(e) => setFeedbacks({...feedbacks, [sub.submission_id]: e.target.value})}
                            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '14px' }}
                          />
                          <button 
                            onClick={() => handleGradeSubmit(sub.submission_id)}
                            style={{ padding: '10px', backgroundColor: '#4318FF', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px' }}>
                            Submit Grade
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default LecturerDashboard;