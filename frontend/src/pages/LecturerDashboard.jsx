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

  /*
    Temporary UI data.

    We will connect this to your
    backend/database later.
  */

  const stats = [
    {
      label: "Active Courses",
      value: "6",
      icon: BookOpen,
      className: "lecturer-stat-blue",
    },
    {
      label: "Total Students",
      value: "148",
      icon: Users,
      className: "lecturer-stat-purple",
    },
    {
      label: "Submissions",
      value: "23",
      icon: FileCheck2,
      className: "lecturer-stat-green",
    },
    {
      label: "To Grade",
      value: "12",
      icon: ClipboardList,
      className: "lecturer-stat-orange",
    },
  ];


  const courses = [
    {
      title: "Software Engineering",
      students: 42,
      batch: "25.1",
    },
    {
      title: "Database Systems",
      students: 36,
      batch: "25.1",
    },
    {
      title: "Web Development",
      students: 38,
      batch: "25.2",
    },
    {
      title: "Artificial Intelligence",
      students: 32,
      batch: "25.2",
    },
  ];


  const activity = [
    { day: "Mon", value: 18, height: 46 },
    { day: "Tue", value: 27, height: 69 },
    { day: "Wed", value: 21, height: 54 },
    { day: "Thu", value: 33, height: 86 },
    { day: "Fri", value: 29, height: 75 },
    { day: "Sat", value: 14, height: 36 },
    { day: "Sun", value: 20, height: 52 },
  ];


  const submissions = [
    {
      student: "Movinya Perera",
      assignment: "Database Design Report",
      course: "Database Systems",
      status: "pending",
    },
    {
      student: "Amaya Silva",
      assignment: "React Interface",
      course: "Web Development",
      status: "submitted",
    },
    {
      student: "Dinuka Fernando",
      assignment: "Software Design Report",
      course: "Software Engineering",
      status: "graded",
    },
    {
      student: "Nethmi Jayasinghe",
      assignment: "AI Model Evaluation",
      course: "Artificial Intelligence",
      status: "pending",
    },
  ];


  const students = [
    {
      name: "Movinya Perera",
      initials: "MP",
      course: "Database Systems",
      progress: 82,
    },
    {
      name: "Amaya Silva",
      initials: "AS",
      course: "Web Development",
      progress: 75,
    },
    {
      name: "Dinuka Fernando",
      initials: "DF",
      course: "Software Engineering",
      progress: 91,
    },
    {
      name: "Nethmi Jayasinghe",
      initials: "NJ",
      course: "Artificial Intelligence",
      progress: 68,
    },
  ];


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
    <div className="lecturer-dashboard-page">

      {/* ====================================
          HEADER
      ==================================== */}

      <section className="lecturer-dashboard-header">

        <div>

          <h1>
            Welcome back, Lecturer 👋
          </h1>

          <p>
            Here's an overview of your
            teaching activity and student
            submissions.
          </p>

        </div>


        <div className="lecturer-dashboard-date">

          <CalendarDays size={15} />

          {currentDate}

        </div>

      </section>


      {/* ====================================
          STATS
      ==================================== */}

      <section className="lecturer-stats">

        {stats.map((stat) => {

          const Icon = stat.icon;

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
                  {stat.value}
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
          TEACHING OVERVIEW
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
              Courses you're currently teaching.
            </p>

          </div>


          <div className="lecturer-course-list">

            {courses.map((course, index) => (

              <div
                className="lecturer-course-item"
                key={index}
              >

                <div className="lecturer-course-icon">

                  <BookOpen size={19} />

                </div>


                <div className="lecturer-course-info">

                  <h3>
                    {course.title}
                  </h3>

                  <p>
                    Batch {course.batch}
                  </p>

                </div>


                <div className="lecturer-course-students">

                  <Users size={13} />

                  {course.students} students

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* SUBMISSION ACTIVITY */}

        <div className="lecturer-panel">

          <div className="lecturer-panel-title">

            <h2>
              Submission Activity
            </h2>

            <p>
              Student submissions this week.
            </p>

          </div>


          <div className="lecturer-activity-chart">

            {activity.map((item) => (

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
                      height: `${item.height}%`,
                    }}
                  />

                </div>


                <span>
                  {item.day}
                </span>

              </div>

            ))}

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


          <button className="lecturer-action-card action-blue">

            <div className="lecturer-action-icon">

              <Plus size={20} />

            </div>

            <div>

              <h3>
                Create Course
              </h3>

              <p>
                Add a new module for your students.
              </p>

            </div>

          </button>


          <button className="lecturer-action-card action-purple">

            <div className="lecturer-action-icon">

              <ClipboardList size={20} />

            </div>

            <div>

              <h3>
                Create Assignment
              </h3>

              <p>
                Publish new coursework and deadlines.
              </p>

            </div>

          </button>


          <button className="lecturer-action-card action-green">

            <div className="lecturer-action-icon">

              <UploadCloud size={20} />

            </div>

            <div>

              <h3>
                Upload Material
              </h3>

              <p>
                Share PDFs and learning resources.
              </p>

            </div>

          </button>


          <button className="lecturer-action-card action-orange">

            <div className="lecturer-action-icon">

              <GraduationCap size={20} />

            </div>

            <div>

              <h3>
                Grade Submissions
              </h3>

              <p>
                Review student work and add feedback.
              </p>

            </div>

          </button>

        </div>

      </section>


      {/* ====================================
          SUBMISSIONS
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
              Latest coursework submitted by students.
            </p>

          </div>


          <button className="lecturer-section-button">

            View All

            <ArrowRight size={14} />

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
                  Course
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

              {submissions.map(
                (submission, index) => (

                  <tr key={index}>

                    <td className="lecturer-table-primary">

                      {submission.student}

                    </td>


                    <td>

                      {submission.assignment}

                    </td>


                    <td>

                      {submission.course}

                    </td>


                    <td>

                      <span
                        className={`lecturer-status-badge lecturer-status-${submission.status}`}
                      >

                        {submission.status === "pending" && (
                          <Clock3 size={11} />
                        )}

                        {submission.status === "submitted" && (
                          <FileCheck2 size={11} />
                        )}

                        {submission.status === "graded" && (
                          <UserCheck size={11} />
                        )}

                        {submission.status === "pending"
                          ? "To Grade"
                          : submission.status === "submitted"
                            ? "Submitted"
                            : "Graded"}

                      </span>

                    </td>


                    <td>

                      <button className="lecturer-table-action">

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
          GRADING
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
              Monitor grading workload and completed reviews.
            </p>

          </div>

        </div>


        <div className="lecturer-stats">

          <div className="lecturer-stat-card lecturer-stat-orange">

            <div className="lecturer-stat-icon">

              <ClipboardList size={21} />

            </div>

            <div>

              <strong>
                12
              </strong>

              <span>
                Waiting to Grade
              </span>

            </div>

          </div>


          <div className="lecturer-stat-card lecturer-stat-green">

            <div className="lecturer-stat-icon">

              <FileCheck2 size={21} />

            </div>

            <div>

              <strong>
                31
              </strong>

              <span>
                Graded This Week
              </span>

            </div>

          </div>


          <div className="lecturer-stat-card lecturer-stat-blue">

            <div className="lecturer-stat-icon">

              <Users size={21} />

            </div>

            <div>

              <strong>
                148
              </strong>

              <span>
                Student Records
              </span>

            </div>

          </div>


          <div className="lecturer-stat-card lecturer-stat-purple">

            <div className="lecturer-stat-icon">

              <GraduationCap size={21} />

            </div>

            <div>

              <strong>
                81%
              </strong>

              <span>
                Average Performance
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* ====================================
          STUDENTS
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
              Quick overview of student learning progress.
            </p>

          </div>

        </div>


        <div className="lecturer-student-grid">

          {students.map(
            (student, index) => (

              <article
                className="lecturer-student-card"
                key={index}
              >

                <div className="lecturer-student-avatar">

                  {student.initials}

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
                      {student.progress}%
                    </strong>

                  </div>


                  <div className="lecturer-student-progress-track">

                    <div
                      className="lecturer-student-progress-fill"
                      style={{
                        width: `${student.progress}%`,
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