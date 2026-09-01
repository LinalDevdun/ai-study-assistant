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
    // 1. Fixed the background color and allowed scrolling for long AI answers
    <div style={{ 
      minHeight: '100vh', 
      width: '100vw', 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      backgroundColor: '#F4F7FE', 
      fontFamily: 'sans-serif',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      boxSizing: 'border-box'
    }}>
      
      {/* 2. Container to keep everything centered and readable */}
      <div style={{ width: '100%', maxWidth: '900px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#111C44', margin: 0, fontSize: '28px' }}>🤖 AI Study Tutor</h1>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{ 
              backgroundColor: '#FFFFFF', 
              color: '#4318FF', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              border: '1px solid #E2E8F0', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              ← Back to Dashboard
            </button>
          </Link>
        </div>

        {/* 3. The Modern Card */}
        <div style={{ 
          backgroundColor: '#FFFFFF', 
          padding: '40px', 
          borderRadius: '16px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
          width: '100%', 
          boxSizing: 'border-box' 
        }}>
          
          {/* Context Banner */}
          {lessonTitle && (
            <div style={{ backgroundColor: '#E0E7FF', color: '#4318FF', padding: '15px', borderRadius: '8px', marginBottom: '25px', fontWeight: 'bold', border: '1px solid #C7D2FE', textAlign: 'left' }}>
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
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: '#111C44',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <button type="submit" style={{ 
              padding: '16px', 
              backgroundColor: '#4318FF', 
              color: '#FFFFFF', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              fontSize: '18px', 
              cursor: 'pointer', 
              boxShadow: '0 4px 12px rgba(67, 24, 255, 0.2)' 
            }}>
              {loading ? 'Thinking...' : 'Ask AI'}
            </button>
          </form>

          {/* AI Answer Display */}
          {answer && (
            <div style={{ 
              marginTop: '30px', 
              padding: '25px', 
              backgroundColor: '#F8FAFC', 
              border: '1px solid #E2E8F0',
              borderLeft: '5px solid #4318FF', 
              borderRadius: '8px', 
              textAlign: 'left'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#111C44', fontSize: '18px' }}>Tutor's Explanation:</h4>
              <p style={{ margin: '0', color: '#4B5563', lineHeight: '1.8', whiteSpace: 'pre-wrap', fontSize: '16px' }}>
                {answer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tutor;