import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  Award,
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Sparkles,
  BrainCircuit,
  Database,
  Code2,
  Globe2,
  Sigma,
  Network,
} from "lucide-react";

import "../styles/dashboard.css";


function Dashboard() {
  const navigate = useNavigate();


  /* ========================================
     LOGGED-IN STUDENT
  ======================================== */

  const [student, setStudent] = useState({
    name: "Student",
    email: "",
    role: "STUDENT",
    degree: "",
    batch: "",
  });


  /* ========================================
     GET LOGGED-IN STUDENT
  ======================================== */

  useEffect(() => {

    const fetchStudent = async () => {

      try {

        const token =
          localStorage.getItem("token");


        if (!token) {

          navigate("/login");

          return;

        }


        const response =
          await axios.get(
            "http://localhost:5000/me",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        setStudent(response.data);

      } catch (error) {

        console.error(
          "Failed to load dashboard user:",
          error
        );


        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {

          localStorage.removeItem("token");
          localStorage.removeItem("role");

          navigate("/login");

        }

      }

    };


    fetchStudent();

  }, [navigate]);


  /* ========================================
     GREETING
  ======================================== */

  const hour = new Date().getHours();


  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
        ? "Good afternoon"
        : "Good evening";


  /* ========================================
     STATISTICS
  ======================================== */

  const stats = [
    {
      label: "Enrolled Courses",
      value: "6",
      description: "Active courses",
      icon: BookOpen,
      color: "stat-purple",
    },

    {
      label: "Assignments",
      value: "4",
      description: "2 due this week",
      icon: ClipboardCheck,
      color: "stat-blue",
    },

    {
      label: "Overall Progress",
      value: "77%",
      description: "Great progress",
      icon: TrendingUp,
      color: "stat-green",
    },

    {
      label: "Current GPA",
      value: "3.7",
      description: "This semester",
      icon: Award,
      color: "stat-orange",
    },
  ];


  /* ========================================
     COURSES
  ======================================== */

  const courses = [
    {
      id: 1,
      title:
        "Artificial Intelligence & Machine Learning",
      instructor:
        "Dr. Sarah Johnson",
      progress: 72,
      category:
        "Computer Science",
      icon: BrainCircuit,
      cover: "course-violet",
    },

    {
      id: 2,
      title:
        "Database Systems",
      instructor:
        "Prof. Michael Brown",
      progress: 85,
      category:
        "Database",
      icon: Database,
      cover: "course-emerald",
    },

    {
      id: 3,
      title:
        "Software Engineering",
      instructor:
        "Dr. Emily Davis",
      progress: 61,
      category:
        "Software",
      icon: Code2,
      cover: "course-blue",
    },

    {
      id: 4,
      title:
        "Web Development Fundamentals",
      instructor:
        "Mr. David Wilson",
      progress: 45,
      category:
        "Web Development",
      icon: Globe2,
      cover: "course-amber",
    },

    {
      id: 5,
      title:
        "Discrete Mathematics",
      instructor:
        "Dr. James Lee",
      progress: 30,
      category:
        "Mathematics",
      icon: Sigma,
      cover: "course-rose",
    },

    {
      id: 6,
      title:
        "Data Structures & Algorithms",
      instructor:
        "Dr. Robert Taylor",
      progress: 90,
      category:
        "Algorithms",
      icon: Network,
      cover: "course-cyan",
    },
  ];


  /* ========================================
     ASSIGNMENTS
  ======================================== */

  const assignments = [
    {
      title:
        "Machine Learning Model Evaluation",
      course:
        "Artificial Intelligence",
      due:
        "Tomorrow",
    },

    {
      title:
        "Database Normalization Exercise",
      course:
        "Database Systems",
      due:
        "Sep 26",
    },

    {
      title:
        "React Interface Development",
      course:
        "Web Development",
      due:
        "Sep 28",
    },

    {
      title:
        "Sorting Algorithms Report",
      course:
        "Data Structures",
      due:
        "Oct 02",
    },
  ];


  /* ========================================
     CURRENT DATE
  ======================================== */

  const currentDate =
    new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        month: "short",
        day: "numeric",
      }
    );


  return (
    <div className="dashboard-page">


      {/* ====================================
          WELCOME
      ==================================== */}

      <section className="dashboard-welcome">

        <div>

          <h1>
            {greeting}, {student.name} 👋
          </h1>

          <p>
            Here's what is happening with your learning today.
          </p>

        </div>


        <div className="dashboard-date">

          <CalendarDays size={16} />

          {currentDate}

        </div>

      </section>



      {/* ====================================
          STATS
      ==================================== */}

      <section className="dashboard-stats">

        {stats.map((stat) => {

          const Icon = stat.icon;


          return (
            <div
              className={`stat-card ${stat.color}`}
              key={stat.label}
            >

              <div className="stat-icon">

                <Icon
                  size={23}
                  strokeWidth={2}
                />

              </div>


              <div className="stat-content">

                <p className="stat-value">
                  {stat.value}
                </p>


                <p className="stat-label">
                  {stat.label}
                </p>


                <span className="stat-small">
                  {stat.description}
                </span>

              </div>

            </div>
          );

        })}

      </section>



      {/* ====================================
          COURSES
      ==================================== */}

      <section className="dashboard-section">


        <div className="dashboard-section-heading">

          <div>

            <h2>
              Continue Learning
            </h2>

            <p>
              Pick up where you left off.
            </p>

          </div>


          <button
            className="dashboard-text-button"
            onClick={() =>
              navigate("/courses")
            }
          >

            View all

            <ArrowRight size={15} />

          </button>

        </div>



        <div className="dashboard-courses">

          {courses.map((course) => {

            const CourseIcon =
              course.icon;


            return (
              <article
                className="dashboard-course-card"
                key={course.id}
              >

                <div
                  className={
                    `course-cover ${course.cover}`
                  }
                >

                  <div className="course-cover-icon">

                    <CourseIcon
                      size={27}
                      strokeWidth={1.8}
                    />

                  </div>

                </div>



                <div className="course-card-body">


                  <span className="course-category">

                    {course.category}

                  </span>


                  <h3>

                    {course.title}

                  </h3>


                  <p className="course-instructor">

                    {course.instructor}

                  </p>



                  <div className="course-progress-info">

                    <span>
                      Course progress
                    </span>

                    <strong>
                      {course.progress}%
                    </strong>

                  </div>



                  <div className="course-progress-track">

                    <div
                      className="course-progress-bar"
                      style={{
                        width:
                          `${course.progress}%`,
                      }}
                    />

                  </div>



                  <div className="course-footer">

                    <button
                      className="continue-button"
                      onClick={() =>
                        navigate("/courses")
                      }
                    >

                      Continue

                      <ArrowRight
                        size={14}
                      />

                    </button>


                    <span className="course-percentage">

                      {course.progress}%
                      {" "}
                      complete

                    </span>

                  </div>

                </div>

              </article>
            );

          })}

        </div>

      </section>



      {/* ====================================
          ASSIGNMENTS + PROGRESS
      ==================================== */}

      <section className="dashboard-bottom-grid">


        {/* ==================================
            ASSIGNMENTS
        ================================== */}

        <div className="dashboard-panel">


          <div className="panel-header">

            <h2>
              Upcoming Assignments
            </h2>


            <button
              className="dashboard-text-button"
              onClick={() =>
                navigate("/assignments")
              }
            >

              View all

              <ArrowRight size={14} />

            </button>

          </div>



          <div className="assignment-list">

            {assignments.map(
              (assignment, index) => (

                <div
                  className="assignment-item"
                  key={index}
                >

                  <div className="assignment-icon">

                    <ClipboardList
                      size={18}
                    />

                  </div>


                  <div className="assignment-details">

                    <h4>

                      {assignment.title}

                    </h4>

                    <p>

                      {assignment.course}

                    </p>

                  </div>


                  <span className="assignment-due">

                    {assignment.due}

                  </span>

                </div>

              )
            )}

          </div>

        </div>



        {/* ==================================
            PROGRESS
        ================================== */}

        <div className="dashboard-panel weekly-progress-card">


          <div className="panel-header">

            <h2>
              Learning Progress
            </h2>

          </div>



          <div className="progress-summary">


            <div className="progress-ring">

              <div className="progress-ring-inner">

                <strong>
                  77%
                </strong>

                <span>
                  COMPLETED
                </span>

              </div>

            </div>



            <p className="weekly-message">

              You're making great progress.
              Keep going! 🎉

            </p>



            <button
              className="dashboard-text-button"
              onClick={() =>
                navigate("/progress")
              }
            >

              View progress

              <ArrowRight size={14} />

            </button>

          </div>

        </div>

      </section>



      {/* ====================================
          AI ASSISTANT
      ==================================== */}

      <section className="ai-dashboard-banner">


        <div className="ai-dashboard-content">


          <div className="ai-dashboard-icon">

            <Sparkles size={25} />

          </div>


          <div>

            <h3>
              Need help with your studies?
            </h3>

            <p>
              Ask your AI Study Tutor questions,
              explain difficult concepts, or get
              help preparing for your next class.
            </p>

          </div>

        </div>



        <button
          className="ai-dashboard-button"
          onClick={() =>
            navigate("/tutor")
          }
        >

          Ask AI Tutor

          <ArrowRight size={15} />

        </button>

      </section>

    </div>
  );
}


export default Dashboard;