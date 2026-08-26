import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function Tutor() {
  const location = useLocation();
  
  const lessonContext = location.state?.lessonContext || '';
  const lessonTitle = location.state?.lessonTitle || '';

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskAI = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnswer('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post('http://localhost:5000/tutor', 
        { question, context: lessonContext },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAnswer(response.data.answer);
    } catch (err) {
      setAnswer('The AI encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // UPGRADED: Increased maxWidth from 750px to 900px for a much wider page layout
    <div style={{ width: '100%', maxWidth: '900px', padding: '40px 20px', margin: '0 auto' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#FFFFFF', margin: 0, fontSize: '28px' }}>🤖 AI Study Tutor</h1>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <button style={{ backgroundColor: '#475569', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            ← Back
          </button>
        </Link>
      </div>

      {/* UPGRADED: Added maxWidth: '100%' here to override the default narrow card width */}
      <div className="card" style={{ width: '100%', maxWidth: '100%', padding: '35px', boxSizing: 'border-box' }}>
        
        {/* Context Banner */}
        {lessonTitle && (
          <div style={{ backgroundColor: '#ECFDF5', color: '#065F46', padding: '15px', borderRadius: '8px', marginBottom: '25px', fontWeight: 'bold', border: '1px solid #A7F3D0', textAlign: 'left' }}>
            🧠 Context Active: Assisting with "{lessonTitle}"
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleAskAI} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          <input 
            type="text" 
            placeholder={lessonTitle ? `Ask a question about ${lessonTitle}...` : "Ask me to explain a concept..."}
            value={question} 
            onChange={(e) => setQuestion(e.target.value)} 
            required 
            style={{ 
              width: '100%', 
              padding: '16px', 
              fontSize: '16px', 
              borderRadius: '8px', 
              border: '1px solid #CBD5E1',
              boxSizing: 'border-box'
            }}
          />
          <button type="submit" className="btn-green" style={{ padding: '16px', fontSize: '18px', borderRadius: '8px' }}>
            {loading ? 'Thinking...' : 'Ask AI'}
          </button>
        </form>

        {/* AI Answer Display */}
        {answer && (
          <div style={{ marginTop: '30px', padding: '25px', backgroundColor: '#F8FAFC', borderLeft: '5px solid #2563EB', borderRadius: '8px', textAlign: 'left', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#1E293B', fontSize: '18px' }}>Tutor's Explanation:</h4>
            <p style={{ margin: '0', color: '#334155', lineHeight: '1.8', whiteSpace: 'pre-wrap', fontSize: '16px' }}>
              {answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tutor;