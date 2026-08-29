import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function Splash() {
  const navigate = useNavigate();

  // This runs when the splash screen loads
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if the user is already logged in
      const token = localStorage.getItem('token');
      
      if (token) {
        navigate('/dashboard'); // Send to dashboard if logged in
      } else {
        navigate('/login'); // Otherwise, send to the login page
      }
    }, 2500); // 2500 milliseconds = 2.5 seconds of splash screen

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#4318FF', // The signature deep purple from your Dashboard
      color: '#FFFFFF',
      position: 'fixed',
      top: 0,
      left: 0,
      fontFamily: 'sans-serif',
      zIndex: 9999 // Ensures it sits on top of everything else
    }}>
      
      {/* App Logo */}
      <h1 style={{ fontSize: '4rem', margin: '0 0 10px 0', letterSpacing: '2px' }}>
        🎓 LMS <span style={{ color: '#E0F7FA' }}>Pro</span>
      </h1>
      
      <p style={{ margin: 0, fontSize: '1.2rem', color: '#A3AED0', fontWeight: '500' }}>
        Your AI-Powered Learning Hub
      </p>

      {/* Animated SVG Loading Spinner */}
      <div style={{ marginTop: '50px' }}>
        <svg width="50" height="50" viewBox="0 0 50 50">
          <circle 
            cx="25" cy="25" r="20" 
            fill="none" 
            stroke="#FFFFFF" 
            strokeWidth="4" 
            strokeDasharray="31.4 31.4" 
            strokeLinecap="round"
          >
            <animateTransform 
              attributeName="transform" 
              type="rotate" 
              from="0 25 25" 
              to="360 25 25" 
              dur="1s" 
              repeatCount="indefinite" 
            />
          </circle>
        </svg>
      </div>
      
    </div>
  );
}

export default Splash;