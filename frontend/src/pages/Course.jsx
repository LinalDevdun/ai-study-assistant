import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  FileText,
  GraduationCap,
  Layers3,
  Sparkles,
  ExternalLink,
  CircleCheckBig,
} from "lucide-react";

import "../styles/courseDetails.css";


function Course() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* ========================================
     FETCH COURSE + LESSONS
  ======================================== */

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }


        const courseResponse =
          await axios.get(
            `http://localhost:5000/courses/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const lessonsResponse =
          await axios.get(
            `http://localhost:5000/courses/${id}/lessons`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        setCourse(courseResponse.data);

        setLessons(
          Array.isArray(lessonsResponse.data)
            ? lessonsResponse.data
            : []
        );

      } catch (err) {

        console.error(
          "Error fetching course data:",
          err
        );

        setError(
          "We couldn't load this course right now."
        );

      } finally {

        setLoading(false);

      }
    };


    fetchCourseData();

  }, [id, navigate]);


  /* ========================================
     COURSE MATERIAL URL
  ======================================== */

  const materialUrl =
    course?.file_path
      ? `http://localhost:5000/${course.file_path.replace(
          /\\/g,
          "/"
        )}`
      : null;


  /* ========================================
     LOADING
  ======================================== */

  if (loading) {
    return (
      <div className="course-details-page">

        <div className="course-page-state">

          <div className="course-state-card">

            <div className="course-state-icon">
              <BookOpen size={27} />
            </div>

            <h3>
              Loading course...
            </h3>

            <p>
              Please wait while we prepare
              your course content.
            </p>

          </div>

        </div>

      </div>
    );
  }


  /* ========================================
     ERROR
  ======================================== */

  if (error || !course) {
    return (
      <div className="course-details-page">

        <button
          className="course-back-button"
          onClick={() =>
            navigate("/courses")
          }
        >
          <ArrowLeft size={15} />

          Back to My Courses
        </button>


        <div className="course-page-state">

          <div className="course-state-card">

            <div className="course-state-icon">
              <BookOpen size={27} />
            </div>

            <h3>
              Course unavailable
            </h3>

            <p>
              {error ||
                "This course could not be found."}
            </p>

          </div>

        </div>

      </div>
    );
  }


  return (
    <div className="course-details-page">

      {/* ====================================
          BACK
      ==================================== */}

      <button
        className="course-back-button"
        onClick={() =>
          navigate("/courses")
        }
      >
        <ArrowLeft size={15} />

        Back to My Courses
      </button>


      {/* ====================================
          HERO
      ==================================== */}

      <section className="course-details-hero">

        <div className="course-hero-content">

          <div className="course-hero-label">
            <BookOpen size={13} />

            Course
          </div>


          <h1>
            {course.title}
          </h1>


          <p className="course-hero-description">

            {course.description ||
              "Access your course lessons, learning resources and study materials from one place."}

          </p>


          <div className="course-hero-meta">

            {course.degree && (
              <span className="course-hero-badge">

                <GraduationCap
                  size={13}
                />

                {course.degree}

              </span>
            )}


            {course.batch && (
              <span className="course-hero-badge">

                <CalendarDays
                  size={13}
                />

                Batch {course.batch}

              </span>
            )}


            <span className="course-hero-badge">

              <Layers3 size={13} />

              {lessons.length}{" "}
              {lessons.length === 1
                ? "Lesson"
                : "Lessons"}

            </span>

          </div>

        </div>


        <div className="course-hero-icon">

          <GraduationCap
            size={50}
            strokeWidth={1.5}
          />

        </div>

      </section>


      {/* ====================================
          QUICK INFORMATION
      ==================================== */}

      <section className="course-information-grid">

        <div className="course-info-card course-info-purple">

          <div className="course-info-icon">
            <Layers3 size={20} />
          </div>

          <div>
            <strong>
              {lessons.length}
            </strong>

            <span>
              Course Lessons
            </span>
          </div>

        </div>


        <div className="course-info-card course-info-blue">

          <div className="course-info-icon">
            <FileText size={20} />
          </div>

          <div>
            <strong>
              {materialUrl
                ? "Available"
                : "Not Added"}
            </strong>

            <span>
              Course Material
            </span>
          </div>

        </div>


        <div className="course-info-card course-info-green">

          <div className="course-info-icon">
            <CircleCheckBig size={20} />
          </div>

          <div>
            <strong>
              Active
            </strong>

            <span>
              Course Status
            </span>
          </div>

        </div>

      </section>


      {/* ====================================
          CONTENT
      ==================================== */}

      <section className="course-content-grid">


        {/* ==================================
            LESSONS
        ================================== */}

        <div className="course-panel">

          <div className="course-panel-header">

            <div>
              <h2>
                Course Lessons
              </h2>

              <p>
                Explore the learning content
                available for this course.
              </p>
            </div>

          </div>


          {lessons.length === 0 ? (

            <div className="course-empty-lessons">

              <div className="course-empty-icon">
                <BookOpen size={24} />
              </div>

              <h3>
                No lessons yet
              </h3>

              <p>
                Your lecturer hasn't added any
                lessons to this course yet.
              </p>

            </div>

          ) : (

            <div className="course-lessons-list">

              {lessons.map(
                (lesson, index) => (
                  <article
                    className="course-lesson-card"
                    key={lesson.id}
                  >

                    <div className="lesson-card-top">

                      <div className="lesson-number">

                        {String(
                          lesson.order_number ??
                            index + 1
                        ).padStart(
                          2,
                          "0"
                        )}

                      </div>


                      <div className="lesson-details">

                        <h3>
                          {lesson.title}
                        </h3>


                        <p>
                          {lesson.content}
                        </p>

                      </div>

                    </div>


                    <div className="lesson-actions">

                      <button
                        className="lesson-ai-button"
                        onClick={() =>
                          navigate("/tutor")
                        }
                      >
                        <Sparkles
                          size={14}
                        />

                        Ask AI about this lesson
                      </button>

                    </div>

                  </article>
                )
              )}

            </div>

          )}

        </div>


        {/* ==================================
            RIGHT COLUMN
        ================================== */}

        <aside className="course-side-column">


          {/* COURSE MATERIAL */}

          <div className="course-material-card">

            <div className="material-icon">
              <FileText size={23} />
            </div>


            <h3>
              Course Material
            </h3>


            <p>
              Open the main learning material
              uploaded for this course.
            </p>


            {materialUrl ? (

              <a
                href={materialUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                }}
              >

                <button className="course-material-button">

                  <ExternalLink
                    size={14}
                  />

                  Open PDF Material

                </button>

              </a>

            ) : (

              <div className="material-unavailable">
                No course material available yet.
              </div>

            )}

          </div>


          {/* AI CARD */}

          <div className="course-ai-card">

            <div className="course-ai-card-icon">
              <Sparkles size={22} />
            </div>


            <h3>
              AI Study Assistant
            </h3>


            <p>
              Need help understanding this
              module? Ask your AI tutor to
              explain difficult concepts.
            </p>


            <button
              className="course-ai-button"
              onClick={() =>
                navigate("/tutor")
              }
            >
              Ask AI Tutor

              <ArrowRight size={14} />
            </button>

          </div>

        </aside>

      </section>

    </div>
  );
}

export default Course;