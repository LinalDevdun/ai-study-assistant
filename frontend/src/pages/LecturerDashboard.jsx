import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  BookOpen,
  Users,
  ClipboardList,
  FileCheck2,
  Plus,
  UploadCloud,
  GraduationCap,
  UserCheck,
  CalendarDays,
  ArrowRight,
  Clock3,
} from "lucide-react";

import "../styles/lecturerDashboard.css";


function LecturerDashboard() {

  const navigate = useNavigate();


  /* ========================================
     LOGGED-IN LECTURER
  ======================================== */

  const [lecturer, setLecturer] =
    useState({
      name: "Lecturer",
      email: "",
      role: "LECTURER",
    });


  /* ========================================
     DASHBOARD DATA
  ======================================== */

  const [dashboard, setDashboard] =
    useState({
      stats: {
        active_courses: 0,
        total_students: 0,
        total_submissions: 0,
        waiting_to_grade: 0,
        total_assignments: 0,
        graded_submissions: 0,
        average_score: null,
      },

      courses: [],
      students: [],
      recent_submissions: [],
      activity: [],
      reminders: [],
    });


  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");


  /* ========================================
     LOAD LECTURER + DASHBOARD
  ======================================== */

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        setLoading(true);
        setErrorMessage("");


        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {

          navigate("/login");

          return;

        }


        const config = {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        };


        const [
          lecturerResponse,
          dashboardResponse,
        ] =
          await Promise.all([

            axios.get(
              "http://localhost:5000/me",
              config
            ),

            axios.get(
              "http://localhost:5000/lecturer/dashboard",
              config
            ),

          ]);


        setLecturer(
          lecturerResponse.data
        );


        setDashboard({
          stats:
            dashboardResponse.data
              ?.stats || {},

          courses:
            dashboardResponse.data
              ?.courses || [],

          students:
            dashboardResponse.data
              ?.students || [],

          recent_submissions:
            dashboardResponse.data
              ?.recent_submissions || [],

          activity:
            dashboardResponse.data
              ?.activity || [],

          reminders:
            dashboardResponse.data
              ?.reminders || [],
        });


      } catch (error) {

        console.error(
          "Lecturer Dashboard Error:",
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


        setErrorMessage(
          error.response?.data
            ?.error ||
            "Failed to load lecturer dashboard."
        );


      } finally {

        setLoading(false);

      }

    };


    fetchDashboard();

  }, [navigate]);


  /* ========================================
     SAFE VALUES
  ======================================== */

  const statsData =
    dashboard.stats || {};


  const activeCourses =
    Number(
      statsData.active_courses || 0
    );


  const totalStudents =
    Number(
      statsData.total_students || 0
    );


  const totalSubmissions =
    Number(
      statsData.total_submissions || 0
    );


  const waitingToGrade =
    Number(
      statsData.waiting_to_grade || 0
    );


  const gradedSubmissions =
    Number(
      statsData.graded_submissions || 0
    );


  const averageScore =
    statsData.average_score === null ||
    statsData.average_score ===
      undefined

      ? null

      : Number(
          statsData.average_score
        );


  /* ========================================
     SUMMARY CARDS
  ======================================== */

  const stats = [

    {
      label: "Active Courses",
      value: activeCourses,
      icon: BookOpen,
      className:
        "lecturer-stat-blue",
    },

    {
      label: "Total Students",
      value: totalStudents,
      icon: Users,
      className:
        "lecturer-stat-purple",
    },

    {
      label: "Submissions",
      value: totalSubmissions,
      icon: FileCheck2,
      className:
        "lecturer-stat-green",
    },

    {
      label: "To Grade",
      value: waitingToGrade,
      icon: ClipboardList,
      className:
        "lecturer-stat-orange",
    },

  ];


  /* ========================================
     WEEKLY SUBMISSION ACTIVITY
  ======================================== */

  const activity =
    useMemo(() => {

      const days = [
        {
          day: "Mon",
          dayNumber: 1,
        },
        {
          day: "Tue",
          dayNumber: 2,
        },
        {
          day: "Wed",
          dayNumber: 3,
        },
        {
          day: "Thu",
          dayNumber: 4,
        },
        {
          day: "Fri",
          dayNumber: 5,
        },
        {
          day: "Sat",
          dayNumber: 6,
        },
        {
          day: "Sun",
          dayNumber: 7,
        },
      ];


      const values =
        days.map((day) => {

          const found =
            dashboard.activity.find(
              (item) =>
                Number(
                  item.day_number
                ) ===
                day.dayNumber
            );


          return {
            ...day,

            value:
              Number(
                found?.submission_count ||
                  0
              ),
          };

        });


      const maximum =
        Math.max(
          ...values.map(
            (item) =>
              item.value
          ),
          0
        );


      return values.map(
        (item) => ({

          ...item,

          height:
            item.value === 0 ||
            maximum === 0

              ? 0

              : Math.max(
                  18,

                  Math.round(
                    (
                      item.value /
                      maximum
                    ) *
                      86
                  )
                ),

        })
      );

    }, [dashboard.activity]);


  /* ========================================
     RECENT SUBMISSIONS
  ======================================== */

  const submissions =
    useMemo(() => {

      return dashboard
        .recent_submissions
        .map(
          (submission) => {

            const hasGrade =
              submission.grade !==
                null &&
              submission.grade !==
                undefined &&
              String(
                submission.grade
              ).trim() !== "";


            return {

              ...submission,

              status:
                hasGrade
                  ? "graded"
                  : "pending",

            };

          }
        );

    }, [
      dashboard.recent_submissions,
    ]);


  /* ========================================
     STUDENT DISPLAY DATA
  ======================================== */

  const students =
    useMemo(() => {

      return dashboard.students.map(
        (student) => {

          const initials =
            student.name

              ? student.name
                  .split(" ")
                  .filter(Boolean)
                  .map(
                    (word) =>
                      word.charAt(0)
                  )
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()

              : "ST";


          return {

            ...student,

            initials,

            progress:
              Number(
                student.progress || 0
              ),

            course:
              `${
                student.degree ||
                "Program not assigned"
              }${
                student.batch
                  ? ` • Batch ${student.batch}`
                  : ""
              }`,

          };

        }
      );

    }, [dashboard.students]);


    /* ========================================
   ACADEMIC REMINDERS
======================================== */

const reminders =
  useMemo(() => {

    return (
      dashboard.reminders || []
    ).map((reminder) => {

      const days =
        Number(
          reminder.days_until_due
        );


      let message =
        "Academic task requires attention";


      if (
        reminder.reminder_type ===
        "overdue"
      ) {

        message =
          `Overdue by ${Math.abs(days)} day${
            Math.abs(days) === 1
              ? ""
              : "s"
          }`;

      } else if (
        reminder.reminder_type ===
        "due_today"
      ) {

        message =
          "Due today";

      } else if (
        reminder.reminder_type ===
        "due_soon"
      ) {

        message =
          `Due in ${days} day${
            days === 1
              ? ""
              : "s"
          }`;

      } else if (
        Number(
          reminder.waiting_to_grade
        ) > 0
      ) {

        message =
          `${reminder.waiting_to_grade} submission${
            Number(
              reminder.waiting_to_grade
            ) === 1
              ? ""
              : "s"
          } waiting to grade`;

      }


      return {

        ...reminder,

        message,

      };

    });

  }, [dashboard.reminders]);

  /* ========================================
     DATE
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


  /* ========================================
     UI
  ======================================== */

  return (

    <div className="lecturer-dashboard-page">


      {/* HEADER */}

      <section className="lecturer-dashboard-header">

        <div>

          <h1>
            Welcome back,{" "}
            {lecturer.name} 👋
          </h1>

          <p>
            Here's an overview of your
            teaching activity and student
            submissions.
          </p>

        </div>


        <div className="lecturer-dashboard-date">

          <CalendarDays
            size={15}
          />

          {currentDate}

        </div>

      </section>


      {/* ERROR */}

      {errorMessage && (

        <div
          style={{
            marginBottom: "20px",
            padding: "14px 18px",
            borderRadius: "12px",
            background: "#fff1f2",
            color: "#dc2626",
            fontSize: "14px",
          }}
        >
          {errorMessage}
        </div>

      )}


      {/* STATS */}

      <section className="lecturer-stats">

        {stats.map((stat) => {

          const Icon =
            stat.icon;


          return (

            <div
              className={`lecturer-stat-card ${stat.className}`}
              key={stat.label}
            >

              <div className="lecturer-stat-icon">

                <Icon size={22} />

              </div>


              <div>

                <strong>

                  {loading
                    ? "..."
                    : stat.value}

                </strong>

                <span>
                  {stat.label}
                </span>

              </div>

            </div>

          );

        })}

      </section>

      {/* ====================================
    ACADEMIC REMINDERS
==================================== */}

{!loading &&
  reminders.length > 0 && (

  <section className="lecturer-dashboard-section">

    <div className="lecturer-section-heading">

      <div>

        <h2>
          Academic Reminders
        </h2>

        <p>
          Upcoming deadlines and academic
          tasks that need your attention.
        </p>

      </div>

    </div>


    <div className="lecturer-panel">

      <div className="lecturer-course-list">

        {reminders.map(
          (reminder) => (

            <div
              className="lecturer-course-item"
              key={reminder.id}
            >

              <div className="lecturer-course-icon">

                <Clock3 size={19} />

              </div>


              <div className="lecturer-course-info">

                <h3>
                  {reminder.title}
                </h3>

                <p>
                  {reminder.course_title}
                </p>

              </div>


              <span
                className="lecturer-status-badge lecturer-status-pending"
              >
                {reminder.message}
              </span>

            </div>

          )
        )}

      </div>

    </div>

  </section>

)}


      {/* ====================================
          COURSES + ACTIVITY
      ==================================== */}

      <section className="lecturer-overview-grid">


        {/* COURSES */}

        <div
          className="lecturer-panel"
          id="lecturer-courses"
        >

          <div className="lecturer-panel-title">

            <h2>
              My Courses
            </h2>

            <p>
              Courses you're currently
              teaching.
            </p>

          </div>


          <div className="lecturer-course-list">

            {!loading &&
              dashboard.courses.length ===
                0 && (

                <p>
                  No courses are currently
                  assigned to you.
                </p>

              )}


            {dashboard.courses.map(
              (course) => (

                <div
                  className="lecturer-course-item"
                  key={course.id}
                >

                  <div className="lecturer-course-icon">

                    <BookOpen
                      size={19}
                    />

                  </div>


                  <div className="lecturer-course-info">

                    <h3>
                      {course.title}
                    </h3>

                    <p>

                      {course.degree}

                      {course.batch &&
                        ` • Batch ${course.batch}`}

                    </p>

                  </div>


                  <div className="lecturer-course-students">

                    <Users
                      size={13}
                    />

                    {Number(
                      course.student_count ||
                        0
                    )}{" "}
                    students

                  </div>

                </div>

              )
            )}

          </div>

        </div>


        {/* SUBMISSION ACTIVITY */}

        <div className="lecturer-panel">

          <div className="lecturer-panel-title">

            <h2>
              Submission Activity
            </h2>

            <p>
              Student submissions this
              week.
            </p>

          </div>


          <div className="lecturer-activity-chart">

            {activity.map(
              (item) => (

                <div
                  className="lecturer-chart-column"
                  key={item.day}
                >

                  <strong>
                    {item.value}
                  </strong>


                  <div className="lecturer-chart-track">

                    <div
                      className="lecturer-chart-bar"
                      style={{
                        height:
                          `${item.height}%`,
                      }}
                    />

                  </div>


                  <span>
                    {item.day}
                  </span>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* ====================================
          QUICK ACTIONS
      ==================================== */}

      <section
        className="lecturer-dashboard-section"
        id="lecturer-assignments"
      >

        <div className="lecturer-section-heading">

          <div>

            <h2>
              Quick Actions
            </h2>

            <p>
              Common teaching tasks.
            </p>

          </div>

        </div>


        <div className="lecturer-quick-actions">


          <button
            className="lecturer-action-card action-blue"
            onClick={() =>
              navigate(
                "/lecturer/courses"
              )
            }
          >

            <div className="lecturer-action-icon">

              <Plus size={20} />

            </div>


            <div>

              <h3>
                Create Course
              </h3>

              <p>
                Add a new module for your
                students.
              </p>

            </div>

          </button>


          <button
            className="lecturer-action-card action-purple"
            onClick={() =>
              navigate(
                "/lecturer/assignments"
              )
            }
          >

            <div className="lecturer-action-icon">

              <ClipboardList
                size={20}
              />

            </div>


            <div>

              <h3>
                Create Assignment
              </h3>

              <p>
                Publish new coursework and
                deadlines.
              </p>

            </div>

          </button>


          <button
            className="lecturer-action-card action-green"
            onClick={() =>
              navigate(
                "/lecturer/courses"
              )
            }
          >

            <div className="lecturer-action-icon">

              <UploadCloud
                size={20}
              />

            </div>


            <div>

              <h3>
                Upload Material
              </h3>

              <p>
                Share PDFs and learning
                resources.
              </p>

            </div>

          </button>


          <button
            className="lecturer-action-card action-orange"
            onClick={() =>
              navigate(
                "/lecturer/grading"
              )
            }
          >

            <div className="lecturer-action-icon">

              <GraduationCap
                size={20}
              />

            </div>


            <div>

              <h3>
                Grade Submissions
              </h3>

              <p>
                Review student work and add
                feedback.
              </p>

            </div>

          </button>

        </div>

      </section>


      {/* ====================================
          RECENT SUBMISSIONS
      ==================================== */}

      <section
        className="lecturer-dashboard-section"
        id="lecturer-submissions"
      >

        <div className="lecturer-section-heading">

          <div>

            <h2>
              Recent Submissions
            </h2>

            <p>
              Latest coursework submitted
              by your students.
            </p>

          </div>


          <button
            className="lecturer-section-button"
            onClick={() =>
              navigate(
                "/lecturer/submissions"
              )
            }
          >

            View All

            <ArrowRight
              size={14}
            />

          </button>

        </div>


        <div className="lecturer-table-wrapper">

          <table className="lecturer-table">

            <thead>

              <tr>

                <th>
                  Student
                </th>

                <th>
                  Assignment
                </th>

                <th>
                  Program / Batch
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {submissions.length ===
                0 &&
                !loading && (

                  <tr>

                    <td
                      colSpan="5"
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "30px",
                      }}
                    >
                      No student submissions
                      yet.
                    </td>

                  </tr>

                )}


              {submissions.map(
                (submission) => (

                  <tr
                    key={
                      submission.submission_id
                    }
                  >

                    <td className="lecturer-table-primary">

                      {
                        submission.student_name
                      }

                    </td>


                    <td>

                      {
                        submission.assignment_title
                      }

                    </td>


                    <td>

                      {
                        submission.degree
                      }

                      {submission.batch &&
                        ` • ${submission.batch}`}

                    </td>


                    <td>

                      <span
                        className={`lecturer-status-badge lecturer-status-${submission.status}`}
                      >

                        {submission.status ===
                          "pending" && (

                          <Clock3
                            size={11}
                          />

                        )}


                        {submission.status ===
                          "graded" && (

                          <UserCheck
                            size={11}
                          />

                        )}


                        {submission.status ===
                        "pending"
                          ? "To Grade"
                          : "Graded"}

                      </span>

                    </td>


                    <td>

                      <button
                        className="lecturer-table-action"
                        onClick={() =>
                          navigate(
                            "/lecturer/grading"
                          )
                        }
                      >

                        Review

                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </section>


      {/* ====================================
          GRADING OVERVIEW
      ==================================== */}

      <section
        className="lecturer-dashboard-section"
        id="lecturer-grading"
      >

        <div className="lecturer-section-heading">

          <div>

            <h2>
              Grading Overview
            </h2>

            <p>
              Monitor your real grading
              workload and completed
              reviews.
            </p>

          </div>

        </div>


        <div className="lecturer-stats">


          <div className="lecturer-stat-card lecturer-stat-orange">

            <div className="lecturer-stat-icon">

              <ClipboardList
                size={21}
              />

            </div>

            <div>

              <strong>
                {waitingToGrade}
              </strong>

              <span>
                Waiting to Grade
              </span>

            </div>

          </div>


          <div className="lecturer-stat-card lecturer-stat-green">

            <div className="lecturer-stat-icon">

              <FileCheck2
                size={21}
              />

            </div>

            <div>

              <strong>
                {gradedSubmissions}
              </strong>

              <span>
                Graded Submissions
              </span>

            </div>

          </div>


          <div className="lecturer-stat-card lecturer-stat-blue">

            <div className="lecturer-stat-icon">

              <Users size={21} />

            </div>

            <div>

              <strong>
                {totalStudents}
              </strong>

              <span>
                Student Records
              </span>

            </div>

          </div>


          <div className="lecturer-stat-card lecturer-stat-purple">

            <div className="lecturer-stat-icon">

              <GraduationCap
                size={21}
              />

            </div>

            <div>

              <strong>

                {averageScore !== null
                  ? `${averageScore}%`
                  : "—"}

              </strong>

              <span>
                Average Numeric Score
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* ====================================
          STUDENT PROGRESS
      ==================================== */}

      <section
        className="lecturer-dashboard-section"
        id="lecturer-students"
      >

        <div className="lecturer-section-heading">

          <div>

            <h2>
              Student Progress
            </h2>

            <p>
              Real assignment completion
              progress for your students.
            </p>

          </div>

        </div>


        {!loading &&
          students.length === 0 && (

            <p>
              No students are currently
              assigned to the programs and
              batches you teach.
            </p>

          )}


        <div className="lecturer-student-grid">

          {students
            .slice(0, 4)
            .map(
              (student) => (

                <article
                  className="lecturer-student-card"
                  key={student.id}
                >

                  <div className="lecturer-student-avatar">

                    {
                      student.initials
                    }

                  </div>


                  <h3>
                    {student.name}
                  </h3>


                  <p>
                    {student.course}
                  </p>


                  <div className="lecturer-student-progress">

                    <div className="lecturer-student-progress-info">

                      <span>
                        Progress
                      </span>

                      <strong>
                        {
                          student.progress
                        }%
                      </strong>

                    </div>


                    <div className="lecturer-student-progress-track">

                      <div
                        className="lecturer-student-progress-fill"
                        style={{
                          width:
                            `${student.progress}%`,
                        }}
                      />

                    </div>

                  </div>

                </article>

              )
            )}

        </div>

      </section>

    </div>

  );

}


export default LecturerDashboard;