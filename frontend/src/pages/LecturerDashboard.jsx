import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // <-- NEW: Added axios for HTTP requests
import '../index.css';

function LecturerDashboard() {
  const navigate = useNavigate();
  
  // State to toggle the Create Course form
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form states
  const [courseTitle, setCourseTitle] = useState('');
  const [degree, setDegree] = useState('');
  const [batch, setBatch] = useState('');
  const [file, setFile] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // UPDATED: Now sends the file to your backend!
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    // We MUST use FormData to send files via HTTP
    const formData = new FormData();
    formData.append('courseTitle', courseTitle);
    formData.append('degree', degree);
    formData.append('batch', batch);
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      
      // Send the POST request to your backend Multer endpoint
      const response = await axios.post('http://localhost:5000/courses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Pass the JWT so the backend knows you are a Lecturer
        }
      });
      
      console.log("Server Response:", response.data);
      alert(`Successfully created "${courseTitle}" for ${degree} (Batch ${batch})!`);
      
      // Reset form and hide it
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

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, backgroundColor: '#F4F7FE', fontFamily: 'sans-serif' }}>
      
      {/* LEFT SIDEBAR (Restored to your exact design) */}
      <aside style={{ width: '260px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
        <div style={{ padding: '0 20px', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, color: '#111C44', fontSize: '22px' }}>👩‍🏫 Lecturer Portal</h2>
        </div>

        <nav style={{ flex: 1, padding: '0 15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '12px 20px', borderRadius: '8px', backgroundColor: '#4318FF', color: '#FFFFFF', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📚 Manage Courses
          </div>
          <div style={{ padding: '12px 20px', color: '#A3AED0', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📝 Assignments & Grading
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
          <p style={{ color: '#A3AED0', margin: 0, fontSize: '16px' }}>Create courses, upload materials, and review student progress.</p>
        </div>

        {/* Action Buttons Row */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{ flex: 1, padding: '16px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            {showCreateForm ? 'Cancel Creation' : '+ Create New Course'}
          </button>
          
          <button style={{ flex: 1, padding: '16px', backgroundColor: '#4318FF', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            + Create Assignment
          </button>
        </div>

        {/* The Upload Form (Toggles when you click the green button) */}
        {showCreateForm && (
          <div style={{ backgroundColor: '#FFFFFF', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '800px' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#111C44' }}>Course Details</h2>
            
            <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#111C44' }}>Course Title</label>
                <input 
                  type="text" 
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Database Management Systems" 
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', boxSizing: 'border-box' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#111C44' }}>Target Degree</label>
                  <select 
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                  >
                    <option value="" disabled>Select a Degree...</option>
                    <option value="BSc Software Engineering">BSc Software Engineering</option>
                    <option value="BSc Data Science">BSc Data Science</option>
                    <option value="BSc IT">BSc Information Technology</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#111C44' }}>Target Batch</label>
                  <select 
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                  >
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
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                    style={{ color: '#111C44' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                style={{ padding: '14px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
              >
                Launch Course to Batch {batch || '...'}
              </button>

            </form>
          </div>
        )}

      </main>
    </div>
  );
}

export default LecturerDashboard;