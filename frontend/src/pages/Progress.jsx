import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  TrendingUp,
  BookOpen,
  Clock3,
  Award,
  Target,
  BrainCircuit,
  Database,
  Code2,
  Globe2,
  Trophy,
} from "lucide-react";

import "../styles/progress.css";


function Progress() {

  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* ========================================
     LOAD REAL STUDENT DATA
  ======================================== */

  useEffect(() => {

    const loadProgressData = async () => {

      try {

        setLoading(true);
        setError("");


        const token =
          localStorage.getItem("token");


        if (!token) {

          setError(
            "Please log in again."
          );

          return;

        }


        const config = {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        };


        const [
          coursesResponse,
          assignmentsResponse,
        ] =
          await Promise.all([

            axios.get(
              "http://localhost:5000/courses",
              config
            ),

            axios.get(
              "http://localhost:5000/assignments",
              config
            ),

          ]);


        const realCourses =
          Array.isArray(
            coursesResponse.data
          )
            ? coursesResponse.data
            : [];


        const realAssignments =
          Array.isArray(
            assignmentsResponse.data
          )
            ? assignmentsResponse.data
            : [];


        /*
          Load each course's real lesson count.

          There is currently no student
          lesson-completion table, so we show
          real lesson availability without
          inventing fake completion percentages.
        */

        const coursesWithLessons =
          await Promise.all(

            realCourses.map(
              async (course) => {

                try {

                  const response =
                    await axios.get(
                      `http://localhost:5000/courses/${course.id}/lessons`,
                      config
                    );


                  const lessons =
                    Array.isArray(
                      response.data
                    )
                      ? response.data
                      : [];


                  return {
                    ...course,
                    lessonCount:
                      lessons.length,
                  };


                } catch (lessonError) {

                  console.error(
                    `Error loading lessons for course ${course.id}:`,
                    lessonError
                  );


                  return {
                    ...course,
                    lessonCount: 0,
                  };

                }

              }
            )

          );


        setCourses(
          coursesWithLessons
        );

        setAssignments(
          realAssignments
        );


      } catch (loadError) {

        console.error(
          "Error loading progress data:",
          loadError
        );


        setError(
          loadError.response?.data?.error ||
          "Failed to load learning progress."
        );


      } finally {

        setLoading(false);

      }

    };


    loadProgressData();

  }, []);


  /* ========================================
     REAL PROGRESS VALUES
  ======================================== */

  const completedTasks =
    useMemo(
      () =>
        assignments.filter(
          (assignment) =>
            assignment.is_submitted ||
            assignment.is_graded
        ).length,
      [assignments]
    );


  const overallProgress =
    useMemo(
      () =>
        assignments.length > 0
          ? Math.round(
              (
                completedTasks /
                assignments.length
              ) * 100
            )
          : 0,
      [
        assignments.length,
        completedTasks,
      ]
    );


  const activeCourses =
    courses.length;


  /* ========================================
     COURSE ICON
  ======================================== */

  const getCourseIcon = (title = "") => {

    const name =
      title.toLowerCase();


    if (
      name.includes("ai") ||
      name.includes("artificial") ||
      name.includes("machine")
    ) {
      return BrainCircuit;
    }


    if (
      name.includes("database")
    ) {
      return Database;
    }


    if (
      name.includes("software") ||
      name.includes("programming")
    ) {
      return Code2;
    }


    if (
      name.includes("web") ||
      name.includes("internet") ||
      name.includes("iot")
    ) {
      return Globe2;
    }


    return BookOpen;

  };


  /* ========================================
     MESSAGE
  ======================================== */

  const progressMessage =
    overallProgress === 100
      ? "Excellent! You've submitted all currently assigned coursework."
      : overallProgress >= 70
        ? "Great work! You're making strong progress with your coursework."
        : overallProgress >= 40
          ? "You're making steady progress. Keep completing your coursework."
          : assignments.length === 0
            ? "No assignments are available yet. Your progress will update when coursework is published."
            : "Keep going! Complete your pending coursework to increase your progress.";


  const progressBadge =
    overallProgress >= 70
      ? "On Track"
      : overallProgress >= 40
        ? "In Progress"
        : "Getting Started";


  return (
    <div className="progress-page">

      {/* ====================================
          HEADER
      ==================================== */}

      <section className="progress-header">

        <div>

          <h1>
            Learning Progress
          </h1>

          <p>
            Track your real coursework
            completion and enrolled courses.
          </p>

        </div>


        <div className="progress-header-badge">

          <TrendingUp size={16} />

          {progressBadge}

        </div>

      </section>


      {/* ERROR */}

      {error && (
        <div
          style={{
            marginBottom: "18px",
            padding: "12px 16px",
            borderRadius: "12px",
            background: "#fff1f2",
            color: "#be123c",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}


      {/* ====================================
          SUMMARY CARDS
      ==================================== */}

      <section className="progress-summary-grid">

        <div className="progress-summary-card progress-purple">

          <div className="progress-summary-icon">
            <Target size={21} />
          </div>

          <div>

            <strong>
              {loading
                ? "..."
                : `${overallProgress}%`}
            </strong>

            <span>
              Overall Progress
            </span>

          </div>

        </div>


        <div className="progress-summary-card progress-blue">

          <div className="progress-summary-icon">
            <BookOpen size={21} />
          </div>

          <div>

            <strong>
              {loading
                ? "..."
                : activeCourses}
            </strong>

            <span>
              Active Courses
            </span>

          </div>

        </div>


        <div className="progress-summary-card progress-green">

          <div className="progress-summary-icon">
            <Clock3 size={21} />
          </div>

          <div>

            <strong>
              —
            </strong>

            <span>
              Study Time Not Tracked
            </span>

          </div>

        </div>


        <div className="progress-summary-card progress-orange">

          <div className="progress-summary-icon">
            <Award size={21} />
          </div>

          <div>

            <strong>
              {loading
                ? "..."
                : completedTasks}
            </strong>

            <span>
              Tasks Completed
            </span>

          </div>

        </div>

      </section>


      {/* ====================================
          OVERALL + ACTIVITY
      ==================================== */}

      <section className="progress-main-grid">


        {/* OVERALL */}

        <div className="progress-panel">

          <div className="progress-panel-header">

            <h2>
              Overall Learning Progress
            </h2>

            <p>
              Based on your real assignment
              submission status.
            </p>

          </div>


          <div className="progress-overall">

            <div
              className="progress-circle"
              style={{
                background: `conic-gradient(
                  var(--primary)
                  0deg
                  ${
                    overallProgress *
                    3.6
                  }deg,
                  #eeeeF6
                  ${
                    overallProgress *
                    3.6
                  }deg
                  360deg
                )`,
              }}
            >

              <div className="progress-circle-inner">

                <strong>
                  {loading
                    ? "..."
                    : `${overallProgress}%`}
                </strong>

                <span>
                  COMPLETED
                </span>

              </div>

            </div>


            <p className="progress-overall-message">
              {loading
                ? "Loading your progress..."
                : progressMessage}
            </p>

          </div>

        </div>


        {/* STUDY ACTIVITY */}

        <div className="progress-panel">

          <div className="progress-panel-header">

            <h2>
              Weekly Study Activity
            </h2>

            <p>
              Study-time tracking is not
              available yet.
            </p>

          </div>


          <div
            className="weekly-chart"
            style={{
              minHeight: "230px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >

            <div
              style={{
                maxWidth: "280px",
                color: "#7b8195",
                lineHeight: 1.6,
              }}
            >

              <Clock3
                size={30}
                strokeWidth={1.7}
                style={{
                  marginBottom: "10px",
                }}
              />

              <p
                style={{
                  margin: 0,
                }}
              >
                CampusLearn does not yet
                record study-session time.
                This section will update
                once study activity tracking
                is added.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ====================================
          COURSE PROGRESS
      ==================================== */}

      <section className="course-progress-section">

        <div className="course-progress-heading">

          <h2>
            Course Progress
          </h2>

        </div>


        <div className="course-progress-list">

          {loading ? (

            <div
              style={{
                padding: "24px",
                color: "#7b8195",
              }}
            >
              Loading courses...
            </div>

          ) : courses.length === 0 ? (

            <div
              style={{
                padding: "24px",
                color: "#7b8195",
              }}
            >
              No courses are currently
              assigned to your degree and
              batch.
            </div>

          ) : (

            courses.map((course) => {

              const Icon =
                getCourseIcon(
                  course.title
                );


              return (
                <article
                  className="course-progress-card"
                  key={course.id}
                >

                  <div className="course-progress-top">

                    <div className="course-progress-icon">

                      <Icon
                        size={20}
                      />

                    </div>


                    <div className="course-progress-info">

                      <h3>
                        {course.title}
                      </h3>

                      <p>
                        {course.lessonCount}{" "}
                        {course.lessonCount === 1
                          ? "lesson"
                          : "lessons"}{" "}
                        available
                      </p>

                    </div>


                    <span className="course-progress-percentage">

                      Not tracked

                    </span>

                  </div>


                  <div className="course-progress-track-large">

                    <div
                      className="course-progress-fill-large"
                      style={{
                        width: "0%",
                      }}
                    />

                  </div>


                  <div className="course-progress-bottom">

                    <span>
                      Batch{" "}
                      {course.batch ||
                        "Not assigned"}
                    </span>

                    <span>
                      Lesson completion
                      tracking not enabled
                    </span>

                  </div>

                </article>
              );

            })

          )}

        </div>

      </section>


      {/* ====================================
          MOTIVATION
      ==================================== */}

      <section className="progress-achievement">

        <div className="progress-achievement-content">

          <div className="progress-achievement-icon">

            <Trophy size={24} />

          </div>


          <div>

            <h3>
              {overallProgress === 100
                ? "All caught up!"
                : "Keep progressing!"}
            </h3>

            <p>
              {assignments.length === 0
                ? "Your learning progress will update when assignments are published."
                : `You've completed ${completedTasks} of ${assignments.length} current coursework tasks (${overallProgress}%).`}
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}


export default Progress;