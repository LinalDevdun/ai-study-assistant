import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

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

  const navigate =
    useNavigate();


  /* ========================================
     DASHBOARD DATA
  ======================================== */

  const [
    dashboardData,
    setDashboardData,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  /* ========================================
     FETCH STUDENT DASHBOARD
  ======================================== */

  useEffect(() => {

    const fetchDashboard =
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


          const response =
            await axios.get(
              "http://localhost:5000/student/dashboard",
              {
                headers: {

                  Authorization:
                    `Bearer ${token}`,

                },
              }
            );


          setDashboardData(
            response.data
          );


        } catch (error) {

          console.error(
            "Failed to load student dashboard:",
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
              "Failed to load dashboard."
          );


        } finally {

          setLoading(false);

        }

      };


    fetchDashboard();

  }, [navigate]);


  /* ========================================
     GREETING
  ======================================== */

  const hour =
    new Date().getHours();


  const greeting =
    hour < 12

      ? "Good morning"

      : hour < 18

        ? "Good afternoon"

        : "Good evening";


  /* ========================================
     CURRENT DATE
  ======================================== */

  const currentDate =
    new Date()
      .toLocaleDateString(
        "en-US",
        {
          weekday: "short",
          month: "short",
          day: "numeric",
        }
      );


  /* ========================================
     DATE FORMATTER
  ======================================== */

  const formatDueDate =
    (dateValue) => {

      if (!dateValue) {

        return "No due date";

      }


      const dueDate =
        new Date(dateValue);


      const today =
        new Date();


      const tomorrow =
        new Date();


      tomorrow.setDate(
        today.getDate() + 1
      );


      const dueOnly =
        dueDate
          .toDateString();


      const todayOnly =
        today
          .toDateString();


      const tomorrowOnly =
        tomorrow
          .toDateString();


      if (
        dueOnly === todayOnly
      ) {

        return "Today";

      }


      if (
        dueOnly === tomorrowOnly
      ) {

        return "Tomorrow";

      }


      return dueDate
        .toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          }
        );

    };


  /* ========================================
     COURSE VISUAL STYLES
  ======================================== */

  const courseStyles = [

    {
      icon: BrainCircuit,
      cover: "course-violet",
    },

    {
      icon: Database,
      cover: "course-emerald",
    },

    {
      icon: Code2,
      cover: "course-blue",
    },

    {
      icon: Globe2,
      cover: "course-amber",
    },

    {
      icon: Sigma,
      cover: "course-rose",
    },

    {
      icon: Network,
      cover: "course-cyan",
    },

  ];


  /* ========================================
     LOADING
  ======================================== */

  if (loading) {

    return (

      <div className="dashboard-page">

        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >

          Loading dashboard...

        </div>

      </div>

    );

  }


  /* ========================================
     ERROR
  ======================================== */

  if (
    error ||
    !dashboardData
  ) {

    return (

      <div className="dashboard-page">

        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >

          {error ||
            "Dashboard data unavailable."}

        </div>

      </div>

    );

  }


  /* ========================================
     EXTRACT API DATA
  ======================================== */

  const student =
    dashboardData.student || {};


  const dashboardStats =
    dashboardData.stats || {};


  const courses =
    dashboardData.courses || [];


  const assignments =
    dashboardData
      .upcoming_assignments || [];


  const overallProgress =
    Number(
      dashboardStats
        .overall_progress
    ) || 0;


  const averageScore =
    Number(
      dashboardStats
        .average_score
    ) || 0;


  /* ========================================
     STATISTICS
  ======================================== */

  const stats = [

    {

      label:
        "Enrolled Courses",

      value:
        dashboardStats
          .enrolled_courses ?? 0,

      description:
        "Active courses",

      icon:
        BookOpen,

      color:
        "stat-purple",

    },

    {

      label:
        "Assignments",

      value:
        dashboardStats
          .total_assignments ?? 0,

      description:
        `${
          dashboardStats
            .due_this_week ?? 0
        } due this week`,

      icon:
        ClipboardCheck,

      color:
        "stat-blue",

    },

    {

      label:
        "Overall Progress",

      value:
        `${overallProgress}%`,

      description:
        `${
          dashboardStats
            .submitted_assignments ??
          0
        } submitted`,

      icon:
        TrendingUp,

      color:
        "stat-green",

    },

    {

      label:
        "Average Score",

      value:
        `${Math.round(
          averageScore
        )}%`,

      description:
        averageScore > 0
          ? "Graded assignments"
          : "No grades yet",

      icon:
        Award,

      color:
        "stat-orange",

    },

  ];


  return (

    <div className="dashboard-page">


      {/* ====================================
          WELCOME
      ==================================== */}

      <section className="dashboard-welcome">

        <div>

          <h1>

            {greeting},{" "}
            {student.name ||
              "Student"} 👋

          </h1>


          <p>

            Here's what is happening
            with your learning today.

          </p>

        </div>


        <div className="dashboard-date">

          <CalendarDays
            size={16}
          />

          {currentDate}

        </div>

      </section>



      {/* ====================================
          STATS
      ==================================== */}

      <section className="dashboard-stats">

        {stats.map((stat) => {

          const Icon =
            stat.icon;


          return (

            <div
              className={
                `stat-card ${stat.color}`
              }
              key={
                stat.label
              }
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
              Courses available for your
              degree and batch.
            </p>

          </div>


          <button
            className="dashboard-text-button"
            onClick={() =>
              navigate("/courses")
            }
          >

            View all

            <ArrowRight
              size={15}
            />

          </button>

        </div>


        {courses.length === 0 ? (

          <div
            className="dashboard-panel"
            style={{
              textAlign: "center",
              padding: "35px",
            }}
          >

            No courses have been
            assigned to your degree
            and batch yet.

          </div>

        ) : (

          <div className="dashboard-courses">

            {courses.map(
              (
                course,
                index
              ) => {

                const style =
                  courseStyles[
                    index %
                    courseStyles.length
                  ];


                const CourseIcon =
                  style.icon;


                return (

                  <article
                    className="dashboard-course-card"
                    key={
                      course.id
                    }
                  >

                    <div
                      className={
                        `course-cover ${style.cover}`
                      }
                    >

                      <div className="course-cover-icon">

                        <CourseIcon
                          size={27}
                          strokeWidth={
                            1.8
                          }
                        />

                      </div>

                    </div>


                    <div className="course-card-body">


                      <span className="course-category">

                        {course.degree ||
                          "Course"}

                      </span>


                      <h3>

                        {course.title}

                      </h3>


                      <p className="course-instructor">

                        {course
                          .lecturer_name ||
                          "Not assigned"}

                      </p>


                      <div className="course-progress-info">

                        <span>

                          Overall assignment
                          progress

                        </span>

                        <strong>

                          {overallProgress}%

                        </strong>

                      </div>


                      <div className="course-progress-track">

                        <div
                          className="course-progress-bar"
                          style={{
                            width:
                              `${overallProgress}%`,
                          }}
                        />

                      </div>


                      <div className="course-footer">

                        <button
                          className="continue-button"
                          onClick={() =>
                            navigate(
                              "/courses"
                            )
                          }
                        >

                          Continue

                          <ArrowRight
                            size={14}
                          />

                        </button>


                        <span className="course-percentage">

                          {
                            course.lesson_count
                          }{" "}
                          {
                            course.lesson_count ===
                            1
                              ? "lesson"
                              : "lessons"
                          }

                        </span>

                      </div>

                    </div>

                  </article>

                );

              }
            )}

          </div>

        )}

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
                navigate(
                  "/assignments"
                )
              }
            >

              View all

              <ArrowRight
                size={14}
              />

            </button>

          </div>


          <div className="assignment-list">

            {assignments.length ===
            0 ? (

              <div
                style={{
                  padding:
                    "25px 10px",
                  textAlign:
                    "center",
                }}
              >

                No pending assignments.
                🎉

              </div>

            ) : (

              assignments.map(
                (assignment) => (

                  <div
                    className="assignment-item"
                    key={
                      assignment.id
                    }
                  >

                    <div className="assignment-icon">

                      <ClipboardList
                        size={18}
                      />

                    </div>


                    <div className="assignment-details">

                      <h4>

                        {
                          assignment.title
                        }

                      </h4>


                      <p>

                        {
                          assignment.degree ||
                          "Assignment"
                        }

                      </p>

                    </div>


                    <span className="assignment-due">

                      {formatDueDate(
                        assignment
                          .due_date
                      )}

                    </span>

                  </div>

                )
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

                  {overallProgress}%

                </strong>

                <span>

                  COMPLETED

                </span>

              </div>

            </div>


            <p className="weekly-message">

              {dashboardStats
                .total_assignments ===
              0

                ? "No assignments are available yet."

                : overallProgress ===
                  100

                  ? "All assignments submitted. Great work! 🎉"

                  : overallProgress >=
                    75

                    ? "You're making great progress. Keep going! 🎉"

                    : overallProgress >=
                      40

                      ? "Nice progress. Keep it up!"

                      : "Keep working through your assignments."}

            </p>


            <button
              className="dashboard-text-button"
              onClick={() =>
                navigate(
                  "/progress"
                )
              }
            >

              View progress

              <ArrowRight
                size={14}
              />

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

            <Sparkles
              size={25}
            />

          </div>


          <div>

            <h3>

              Need help with your
              studies?

            </h3>

            <p>

              Ask your AI Study Tutor
              questions, explain
              difficult concepts, or
              get help preparing for
              your next class.

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

          <ArrowRight
            size={15}
          />

        </button>

      </section>

    </div>

  );

}


export default Dashboard;