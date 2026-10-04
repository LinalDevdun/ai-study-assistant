import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  GraduationCap,
  Award,
  TrendingUp,
  BookOpen,
  Trophy,
  CircleCheckBig,
} from "lucide-react";

import "../styles/grades.css";


function Grades() {

  const [grades, setGrades] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* ========================================
     LOAD REAL STUDENT GRADES
  ======================================== */

  useEffect(() => {

    const loadGrades =
      async () => {

        try {

          setLoading(true);
          setError("");


          const token =
            localStorage.getItem(
              "token"
            );


          if (!token) {

            setError(
              "Please log in again."
            );

            return;

          }


          const response =
            await axios.get(
              "http://localhost:5000/my-grades",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          setGrades(
            Array.isArray(
              response.data
            )
              ? response.data
              : []
          );


        } catch (loadError) {

          console.error(
            "Grades loading error:",
            loadError
          );


          setError(
            loadError.response
              ?.data?.error ||
            "Failed to load grades."
          );


        } finally {

          setLoading(false);

        }

      };


    loadGrades();

  }, []);


  /* ========================================
     GRADE HELPERS
  ======================================== */

  const normalizeGrade = (
    grade
  ) => {

    if (
      grade === null ||
      grade === undefined
    ) {

      return "";

    }


    return String(
      grade
    ).trim();

  };


  /* ========================================
     REAL RESULT PERCENTAGE

     Uses:
     1. percentage from backend
     2. marks / max marks as fallback
  ======================================== */

  const getResultPercentage = (
    result
  ) => {

    if (
      result?.percentage !== null &&
      result?.percentage !== undefined &&
      result?.percentage !== ""
    ) {

      const percentage =
        Number(
          result.percentage
        );


      if (
        !Number.isNaN(
          percentage
        )
      ) {

        return percentage;

      }

    }


    if (
      result?.marks_awarded !== null &&
      result?.marks_awarded !== undefined &&
      result?.marks_awarded !== "" &&
      result?.max_marks !== null &&
      result?.max_marks !== undefined &&
      result?.max_marks !== ""
    ) {

      const marks =
        Number(
          result.marks_awarded
        );

      const maxMarks =
        Number(
          result.max_marks
        );


      if (
        !Number.isNaN(marks) &&
        !Number.isNaN(maxMarks) &&
        maxMarks > 0
      ) {

        return (
          Math.round(
            (
              marks /
              maxMarks
            ) *
            10000
          ) /
          100
        );

      }

    }


    return null;

  };


  /* ========================================
     SCORE DISPLAY
  ======================================== */

  const getScoreDisplay = (
    result
  ) => {

    if (
      result?.marks_awarded !== null &&
      result?.marks_awarded !== undefined &&
      result?.marks_awarded !== "" &&
      result?.max_marks !== null &&
      result?.max_marks !== undefined &&
      result?.max_marks !== ""
    ) {

      const marks =
        Number(
          result.marks_awarded
        );

      const maxMarks =
        Number(
          result.max_marks
        );


      if (
        !Number.isNaN(marks) &&
        !Number.isNaN(maxMarks)
      ) {

        return `${marks} / ${maxMarks}`;

      }

    }


    const percentage =
      getResultPercentage(
        result
      );


    if (
      percentage !== null
    ) {

      return `${percentage}%`;

    }


    return "—";

  };


  /* ========================================
     GRADE CLASS
  ======================================== */

  const getGradeClass = (
    grade
  ) => {

    const value =
      normalizeGrade(
        grade
      ).toUpperCase();


    if (
      value.startsWith("A")
    ) {

      return "grade-a";

    }


    if (
      value.startsWith("B")
    ) {

      return "grade-b";

    }


    return "grade-c";

  };


  /* ========================================
     REAL SUMMARY VALUES
  ======================================== */

  const numericGrades =
    useMemo(
      () =>
        grades
          .map(
            (item) =>
              getResultPercentage(
                item
              )
          )
          .filter(
            (score) =>
              score !== null
          ),
      [grades]
    );


  const averageScore =
    useMemo(
      () => {

        if (
          numericGrades.length === 0
        ) {

          return null;

        }


        const total =
          numericGrades.reduce(
            (
              sum,
              score
            ) =>
              sum + score,
            0
          );


        return Math.round(
          total /
          numericGrades.length
        );

      },
      [numericGrades]
    );


  const aGradeCount =
    useMemo(
      () =>
        grades.filter(
          (item) =>
            normalizeGrade(
              item.grade
            )
              .toUpperCase()
              .startsWith("A")
        ).length,
      [grades]
    );


  /* ========================================
     DATE
  ======================================== */

  const formatDate = (
    date
  ) => {

    if (!date) {

      return "—";

    }


    return new Date(
      date
    ).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );

  };


  return (

    <div className="grades-page">


      {/* ====================================
          HEADER
      ==================================== */}

      <section className="grades-header">

        <div>

          <h1>
            Grades
          </h1>

          <p>
            Review your academic
            performance, assignment
            results and lecturer feedback.
          </p>

        </div>


        <div className="grades-header-badge">

          <TrendingUp
            size={16}
          />

          {grades.length > 0
            ? "Results Available"
            : "Awaiting Results"}

        </div>

      </section>


      {/* ====================================
          ERROR
      ==================================== */}

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
          SUMMARY
      ==================================== */}

      <section className="grades-summary">


        {/* GPA */}

        <div className="grade-summary-card grade-purple">

          <div className="grade-summary-icon">

            <GraduationCap
              size={21}
            />

          </div>


          <div>

            <strong>
              —
            </strong>

            <span>
              GPA Not Calculated
            </span>

          </div>

        </div>


        {/* GRADED RESULTS */}

        <div className="grade-summary-card grade-blue">

          <div className="grade-summary-icon">

            <BookOpen
              size={21}
            />

          </div>


          <div>

            <strong>

              {loading
                ? "..."
                : grades.length}

            </strong>

            <span>
              Graded Results
            </span>

          </div>

        </div>


        {/* AVERAGE SCORE */}

        <div className="grade-summary-card grade-green">

          <div className="grade-summary-icon">

            <CircleCheckBig
              size={21}
            />

          </div>


          <div>

            <strong>

              {loading
                ? "..."
                : averageScore !== null
                  ? `${averageScore}%`
                  : "—"}

            </strong>

            <span>
              Average Score
            </span>

          </div>

        </div>


        {/* A GRADES */}

        <div className="grade-summary-card grade-orange">

          <div className="grade-summary-icon">

            <Award
              size={21}
            />

          </div>


          <div>

            <strong>

              {loading
                ? "..."
                : aGradeCount}

            </strong>

            <span>
              A Grades
            </span>

          </div>

        </div>

      </section>


      {/* ====================================
          MAIN
      ==================================== */}

      <section className="grades-main-grid">


        {/* ====================================
            GRADED PERFORMANCE
        ==================================== */}

        <div className="grades-panel">

          <div className="grades-panel-header">

            <h2>
              Graded Performance
            </h2>

            <p>
              Your completed coursework
              that has been graded.
            </p>

          </div>


          <div className="course-grades-list">

            {loading ? (

              <div
                style={{
                  padding: "22px",
                  color: "#7b8195",
                }}
              >

                Loading grades...

              </div>

            ) : grades.length === 0 ? (

              <div
                style={{
                  padding: "22px",
                  color: "#7b8195",
                }}
              >

                No graded assignments
                are available yet.

              </div>

            ) : (

              grades.map(
                (result) => {

                  const numericScore =
                    getResultPercentage(
                      result
                    );


                  return (

                    <article
                      className="course-grade-card"
                      key={
                        result.submission_id
                      }
                    >

                      <div className="course-grade-icon">

                        <GraduationCap
                          size={19}
                        />

                      </div>


                      <div className="course-grade-info">

                        <h3>
                          {
                            result.assignment_title
                          }
                        </h3>

                        <p>
                          Graded submission
                        </p>

                      </div>


                      <div className="course-grade-score">

                        {numericScore !== null
                          ? `${numericScore}%`
                          : "Result"}

                      </div>


                      <div
                        className={`course-grade-letter ${getGradeClass(
                          result.grade
                        )}`}
                      >

                        {normalizeGrade(
                          result.grade
                        ) || "—"}

                      </div>

                    </article>

                  );

                }
              )

            )}

          </div>

        </div>


        {/* ====================================
            RESULTS OVERVIEW
        ==================================== */}

        <div className="grades-panel">

          <div className="grades-panel-header">

            <h2>
              Results Overview
            </h2>

            <p>
              Current graded coursework.
            </p>

          </div>


          <div className="gpa-card">

            <div className="gpa-circle">

              <div className="gpa-circle-inner">

                <strong>

                  {loading
                    ? "..."
                    : grades.length}

                </strong>

                <span>
                  GRADED
                </span>

              </div>

            </div>


            <p className="gpa-message">

              {loading
                ? "Loading your results..."
                : grades.length === 0
                  ? "Your results will appear here after your lecturer grades your submissions."
                  : `${grades.length} graded ${
                      grades.length === 1
                        ? "submission is"
                        : "submissions are"
                    } currently available.`}

            </p>

          </div>

        </div>

      </section>


      {/* ====================================
          RECENT RESULTS
      ==================================== */}

      <section className="recent-results-section">

        <h2>
          Recent Results
        </h2>


        <div className="results-table-wrapper">

          <table className="results-table">

            <thead>

              <tr>

                <th>
                  Assignment
                </th>

                <th>
                  Submitted
                </th>

                <th>
                  Score
                </th>

                <th>
                  Grade
                </th>

                <th>
                  Feedback
                </th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="5"
                    style={{
                      textAlign:
                        "center",
                    }}
                  >

                    Loading results...

                  </td>

                </tr>

              ) : grades.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    style={{
                      textAlign:
                        "center",
                    }}
                  >

                    No graded results
                    available yet.

                  </td>

                </tr>

              ) : (

                grades.map(
                  (result) => {

                    const scoreDisplay =
                      getScoreDisplay(
                        result
                      );


                    return (

                      <tr
                        key={
                          result.submission_id
                        }
                      >

                        <td className="result-title">

                          {
                            result.assignment_title
                          }

                        </td>


                        <td>

                          {formatDate(
                            result.submitted_at
                          )}

                        </td>


                        <td>

                          {scoreDisplay}

                        </td>


                        <td>

                          <span className="result-grade-badge">

                            {normalizeGrade(
                              result.grade
                            ) || "—"}

                          </span>

                        </td>


                        <td className="result-feedback">

                          {result.feedback ||
                            "No lecturer feedback provided."}

                        </td>

                      </tr>

                    );

                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </section>


      {/* ====================================
          BANNER
      ==================================== */}

      <section className="grades-banner">

        <div className="grades-banner-icon">

          <Trophy
            size={24}
          />

        </div>


        <div className="grades-banner-content">

          <h3>

            {grades.length > 0
              ? "Keep up the good work!"
              : "Results coming soon"}

          </h3>


          <p>

            {grades.length > 0
              ? `You currently have ${grades.length} graded ${
                  grades.length === 1
                    ? "submission"
                    : "submissions"
                }. Review your lecturer feedback to keep improving.`
              : "Your grades and lecturer feedback will appear here after your submitted work has been graded."}

          </p>

        </div>

      </section>

    </div>

  );

}


export default Grades;