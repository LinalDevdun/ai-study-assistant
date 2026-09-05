import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function LecturerDashboard() {
  const navigate = useNavigate();
  
  // UI Toggles
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false); // NEW: Toggle for Assignment form
  
  // Course Form States
  const [courseTitle, setCourseTitle] = useState('');
  const [degree, setDegree] = useState('');
  const [batch, setBatch] = useState('');
  const [file, setFile] = useState(null);

  // NEW: Assignment Form States
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDesc, setAssignmentDesc] = useState('');
  const [assignmentDueDate, setAssignmentDueDate] = useState('');
  const [assignmentDegree, setAssignmentDegree] = useState('');
  const [assignmentBatch, setAssignmentBatch] = useState('');
  const [assignmentFile, setAssignmentFile] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Toggle helpers (so only one form is open at a time)
  const toggleCourseForm = () => {
    setShowCreateForm(!showCreateForm);
    setShowAssignmentForm(false);
  };

  const toggleAssignmentForm = () => {
    setShowAssignmentForm(!showAssignmentForm);
    setShowCreateForm(false);
  };

  // 1. Handle Course Upload
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
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Server Response:", response.data);
      alert(`Successfully created "${courseTitle}" for ${degree} (Batch ${batch})!`);
      
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

  // 2. NEW: Handle Assignment Upload
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!assignmentFile) {
      alert("Please attach an assignment file.");
      return;
    }

    const formData = new FormData();
    formData.append('title', assignmentTitle);
    formData.append('description', assignmentDesc);
    formData.append('dueDate', assignmentDueDate); // Make sure your backend expects 'dueDate'
    formData.append('degree', assignmentDegree);
    formData.append('batch', assignmentBatch);
    formData.append('file', assignmentFile);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/assignments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Server Response:", response.data);
      alert(`Assignment "${assignmentTitle}" successfully launched to Batch ${assignmentBatch}!`);
      
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
          <div style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: '#4318FF', color: '#FFFFFF', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📚 Manage Content
          </div>
          <div style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
        
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ color: '#111C44', margin: '0 0 10px 0', fontSize: '32px' }}>Lecturer Control Center</h1>
          <p style={{ color: '#A3AED0', margin: 0, fontSize: '16px' }}>Create courses, distribute assignments, and review student progress.</p>
        </div>

        {/* Action Buttons Row */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
          <button 
            onClick={toggleCourseForm}
            style={{ flex: 1, padding: '16px', backgroundColor: showCreateForm ? '#EF4444' : '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
            {showCreateForm ? 'Cancel Course Creation' : '+ Create New Course'}
          </button>
          
          <button 
            onClick={toggleAssignmentForm}
            style={{ flex: 1, padding: '16px', backgroundColor: showAssignmentForm ? '#EF4444' : '#4318FF', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
            {showAssignmentForm ? 'Cancel Assignment' : '+ Create Assignment'}
          </button>
        </div>

        {/* 1. THE COURSE UPLOAD FORM */}
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

              <button type="submit" style={{ padding: '14px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                Launch Course to Batch {batch || '...'}
              </button>
            </form>
          </div>
        )}

        {/* 2. THE ASSIGNMENT UPLOAD FORM (NEW) */}
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

              <button type="submit" style={{ padding: '14px', backgroundColor: '#4318FF', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(67,24,255,0.2)' }}>
                Post Assignment to Batch {assignmentBatch || '...'}
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}

export default LecturerDashboard;