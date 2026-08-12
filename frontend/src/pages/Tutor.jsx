import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function Tutor() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question) return;

    setLoading(true);
    setAnswer(''); // Clear previous answer

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Send to login if no token
        return;
      }

      // Send the question to your backend AI route
      const response = await axios.post('http://localhost:5000/tutor', 
        { question },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error asking AI:", error);
      setAnswer("Sorry, I had trouble connecting to the AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Navigation Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
        <h2>🤖 AI Study Tutor</h2>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007BFF', fontWeight: 'bold' }}>
          ← Back to Dashboard
        </Link>
      </div>

      {/* Chat Area */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        
        <form onSubmit={handleAskQuestion} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="Ask me to explain a concept..." 
            value={question} 
            onChange={(e) => setQuestion(e.target.value)} 
            style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '12px 20px', backgroundColor: loading ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Thinking...' : 'Ask AI'}
          </button>
        </form>

            
        {/* AI Response Box */}
        {answer && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', border: '1px solid #c3e6cb', color: '#155724', lineHeight: '1.6' }}>
            <strong>Tutor says:</strong>
            <div style={{ marginTop: '10px' }}>
            <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
        </div>
)}
        
      </div>
    </div>
  );
}

export default Tutor;