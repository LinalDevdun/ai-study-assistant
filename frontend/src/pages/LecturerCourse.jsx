import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import axios from "axios";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  FileText,
  GraduationCap,
  Layers3,
  ExternalLink,
  Users,
  CircleCheckBig,
  ClipboardList,
} from "lucide-react";

import "../styles/courseDetails.css";


function LecturerCourse() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();


  const [course, setCourse] =
    useState(null);

  const [lessons, setLessons] =
    useState([]);

  const [studentCount, setStudentCount] =
    useState(0);

  const [materialCount, setMaterialCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* ========================================
     FETCH COURSE DATA
  ======================================== */

  useEffect(() => {

    const fetchCourseData =
      async () => {

        try {

          setLoading(true);

          setError("");


          const token =
            localStorage.getItem(
              "token"
            );


          if (!token) {

            navigate("/login");

            return;

          }


          const headers = {
            Authorization:
              `Bearer ${token}`,
          };


          const [
            courseResponse,
            lessonsResponse,
            lecturerCoursesResponse,
          ] =
            await Promise.all([

              axios.get(
                `http://localhost:5000/courses/${id}`,
                {
                  headers,
                }
              ),

              axios.get(
                `http://localhost:5000/courses/${id}/lessons`,
                {
                  headers,
                }
              ),

              axios.get(
                "http://localhost:5000/lecturer/courses",
                {
                  headers,
                }
              ),

            ]);


          const lecturerCourses =
            Array.isArray(
              lecturerCoursesResponse
                .data?.courses
            )
              ? lecturerCoursesResponse
                  .data.courses
              : [];


          /*
            Make sure this course actually
            belongs to the logged-in lecturer.
          */

          const lecturerCourse =
            lecturerCourses.find(
              (item) =>
                String(item.id) ===
                String(id)
            );


          if (!lecturerCourse) {

            setError(
              "This course is not assigned to your lecturer account."
            );

            setCourse(null);

            return;

          }


          setCourse(
            courseResponse.data
          );


          setLessons(
            Array.isArray(
              lessonsResponse.data
            )
              ? lessonsResponse.data
              : []
          );


          setStudentCount(
            Number(
              lecturerCourse
                .student_count ||
                0
            )
          );


          setMaterialCount(
            Number(
              lecturerCourse
                .material_count ||
                0
            )
          );


        } catch (error) {

          console.error(
            "Lecturer course error:",
            error
          );


          if (
            error.response?.status ===
              401 ||
            error.response?.status ===
              403
          ) {

            localStorage.removeItem(
              "token"
            );

            localStorage.removeItem(
              "role"
            );

            navigate("/login");

            return;

          }


          setError(
            error.response?.data
              ?.error ||
              "We couldn't load this course right now."
          );


        } finally {

          setLoading(false);

        }

      };


    fetchCourseData();

  }, [
    id,
    navigate,
  ]);


  /* ========================================
     COURSE MATERIAL URL
  ======================================== */

  const getMaterialUrl = (
    filePath
  ) => {

    if (!filePath) {
      return null;
    }


    const cleanPath =
      String(filePath)
        .replace(/\\/g, "/")
        .replace(
          /^.*?uploads\//,
          "uploads/"
        );


    return (
      `http://localhost:5000/${cleanPath}`
    );

  };


  const materialUrl =
    getMaterialUrl(
      course?.file_path
    );


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
              Loading course
            </h3>

            <p>
              Please wait while we load
              your teaching module.
            </p>

          </div>

        </div>

      </div>

    );

  }


  /* ========================================
     ERROR
  ======================================== */

  if (
    error ||
    !course
  ) {

    return (

      <div className="course-details-page">

        <button
          className="course-back-button"
          onClick={() =>
            navigate(
              "/lecturer/courses"
            )
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
          navigate(
            "/lecturer/courses"
          )
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

            Teaching Course

          </div>


          <h1>
            {course.title}
          </h1>


          <p className="course-hero-description">

            Manage your course resources,
            lessons and student learning
            content from one place.

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


            <span className="course-hero-badge">

              <Users size={13} />

              {studentCount}{" "}

              {studentCount === 1
                ? "Student"
                : "Students"}

            </span>

          </div>

        </div>


        <div className="course-hero-icon">

          <GraduationCap
            size={46}
          />

        </div>

      </section>


      {/* ====================================
          QUICK INFORMATION
      ==================================== */}

      <section className="course-information-grid">


        <div className="course-info-card course-info-purple">

          <div className="course-info-icon">

            <Layers3 size={21} />

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

            <Users size={21} />

          </div>


          <div>

            <strong>
              {studentCount}
            </strong>

            <span>
              Enrolled Students
            </span>

          </div>

        </div>


        <div className="course-info-card course-info-green">

          <div className="course-info-icon">

            <FileText size={21} />

          </div>


          <div>

            <strong>
              {materialCount}
            </strong>

            <span>
              Learning Materials
            </span>

          </div>

        </div>

      </section>


      {/* ====================================
          MAIN CONTENT
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
                Review the learning
                content currently available
                to your students.
              </p>

            </div>

          </div>


          {lessons.length === 0 ? (

            <div className="course-empty-lessons">


              <div className="course-empty-icon">

                <BookOpen size={25} />

              </div>


              <h3>
                No lessons yet
              </h3>


              <p>
                No lessons have been added
                to this course yet.
              </p>

            </div>

          ) : (

            <div className="course-lessons-list">


              {lessons.map(
                (
                  lesson,
                  index
                ) => (

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

                          {lesson.content ||
                            "No lesson description has been added."}

                        </p>

                      </div>

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
              Main Course Material
            </h3>


            <p>
              Open the main learning
              material currently uploaded
              for this course.
            </p>


            {materialUrl ? (

              <a
                href={materialUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration:
                    "none",
                }}
              >

                <button
                  className="course-material-button"
                  type="button"
                >

                  <ExternalLink
                    size={14}
                  />

                  Open Course Material

                </button>

              </a>

            ) : (

              <div className="material-unavailable">

                No course material
                available yet.

              </div>

            )}

          </div>


          {/* TEACHING TOOLS */}

          <div className="course-ai-card">


            <div className="course-ai-card-icon">

              <ClipboardList
                size={22}
              />

            </div>


            <h3>
              Teaching Tools
            </h3>


            <p>
              Manage coursework,
              submissions and grading
              for your students.
            </p>


            <button
              className="course-ai-button"
              type="button"
              onClick={() =>
                navigate(
                  "/lecturer/assignments"
                )
              }
            >

              <CircleCheckBig
                size={14}
              />

              Manage Assignments

            </button>

          </div>

        </aside>

      </section>

    </div>

  );

}


export default LecturerCourse;