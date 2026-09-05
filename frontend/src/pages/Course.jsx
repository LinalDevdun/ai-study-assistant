import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function Course() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }
        
        const courseResponse = await axios.get(`http://localhost:5000/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourse(courseResponse.data);

        const lessonsResponse = await axios.get(`http://localhost:5000/courses/${id}/lessons`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLessons(lessonsResponse.data);

      } catch (err) {
        console.error('Error fetching course data:', err);
      }
    };

    fetchCourseData();
  }, [id, navigate]);

  return (
    // Outer container: Absolute positioning forces it to cover the dark background completely
    <div style={{ 
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 50%, #0EA5E9 100%)', // Premium vibrant blue gradient
      padding: '60px 20px',
      boxSizing: 'border-box',
      fontFamily: "'Inter', sans-serif",
      zIndex: 10
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Modern Header Area */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <h1 style={{ color: '#FFFFFF', margin: '0 0 16px 0', fontSize: '36px', fontWeight: '800', letterSpacing: '-0.5px' }}>
              {course ? course.title : 'Loading Course...'}
            </h1>
            
            {/* Pill Badges for Degree and Batch */}
            {course && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: '20px', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  🎓 {course.degree}
                </span>
                <span style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: '20px', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  📅 Batch {course.batch}
                </span>
              </div>
            )}
          </div>

          <Link to="/courses" style={{ textDecoration: 'none' }}>
            <button style={{ 
              padding: '12px 24px', 
              backgroundColor: '#FFFFFF', 
              color: '#4F46E5', 
              border: 'none', 
              borderRadius: '12px', 
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '15px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⬅ Back to Dashboard
            </button>
          </Link>
        </div>

        {/* Floating Course Material Card */}
        {course && course.file_path && (
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: '20px', 
            padding: '32px', 
            marginBottom: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', color: '#1E293B', fontSize: '22px', fontWeight: '800' }}>📚 Course Material</h2>
              <p style={{ color: '#64748B', margin: 0, fontSize: '15px', lineHeight: '1.5' }}>
                View or download the primary module material provided by your lecturer.
              </p>
            </div>
            
            <a 
              href={`http://localhost:5000/${course.file_path.replace(/\\/g, '/')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button style={{ 
                padding: '14px 28px', 
                background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 20px rgba(79, 70, 229, 0.3)',
                transition: 'opacity 0.2s'
              }}>
                📄 Open PDF Material
              </button>
            </a>
          </div>
        )}

        {/* Floating Lessons Card */}
        <div style={{ 
          backgroundColor: '#FFFFFF', 
          borderRadius: '20px', 
          padding: '32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
        }}>
          <h2 style={{ margin: '0 0 24px 0', color: '#1E293B', fontSize: '22px', fontWeight: '800' }}>📝 Lessons</h2>
          
          {lessons.length === 0 ? (
            <div style={{ 
              padding: '50px', 
              textAlign: 'center', 
              backgroundColor: '#F8FAFC', 
              borderRadius: '16px',
              border: '2px dashed #CBD5E1'
            }}>
              <p style={{ color: '#64748B', fontSize: '16px', margin: 0, fontWeight: '500' }}>No lessons found for this course yet. Check back later!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {lessons.map((lesson) => (
                <div key={lesson.id} style={{ 
                  padding: '24px', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '16px', 
                  backgroundColor: '#F8FAFC',
                  transition: 'border-color 0.2s'
                }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#4F46E5', fontSize: '18px', fontWeight: '800' }}>
                    Lesson {lesson.order_number}: {lesson.title}
                  </h3>
                  <p style={{ margin: '0 0 20px 0', color: '#334155', lineHeight: '1.7', fontSize: '15px' }}>
                    {lesson.content}
                  </p>
                  
                  <div style={{ paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
                    <Link to="/tutor" style={{ textDecoration: 'none' }}>
                       <button style={{ 
                         padding: '10px 20px', 
                         backgroundColor: '#EFF6FF',
                         color: '#4F46E5',
                         border: '1px solid #DBEAFE',
                         borderRadius: '8px',
                         cursor: 'pointer',
                         fontWeight: '700',
                         fontSize: '14px',
                         display: 'flex',
                         alignItems: 'center',
                         gap: '8px',
                         transition: 'background-color 0.2s'
                       }}>
                         🤖 Ask AI About This Lesson
                       </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Course;