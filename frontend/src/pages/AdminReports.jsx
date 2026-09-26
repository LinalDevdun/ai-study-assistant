import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Download,
  BarChart3,
  Activity,
  CircleCheckBig,
} from "lucide-react";

import "../styles/adminReports.css";


function AdminReports() {

  const navigate =
    useNavigate();


  /* ========================================
     REPORT DATA
  ======================================== */

  const [
    reportData,
    setReportData,
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
     LOAD REPORT DATA
  ======================================== */

  useEffect(() => {

    const loadReports =
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
              "http://localhost:5000/admin/reports/overview",
              {
                headers: {

                  Authorization:
                    `Bearer ${token}`,

                },
              }
            );


          setReportData(
            response.data
          );


        } catch (error) {

          console.error(
            "Admin Reports Error:",
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
            "Failed to load report data."
          );


        } finally {

          setLoading(false);

        }

      };


    loadReports();

  }, [navigate]);


  /* ========================================
     DEFAULT SAFE VALUES
  ======================================== */

  const summary =
    reportData?.summary || {

      total_users: 0,

      students: 0,

      lecturers: 0,

      administrators: 0,

      active_accounts: 0,

      active_courses: 0,

      average_score: 0,

    };


  const userDistribution =
    reportData
      ?.user_distribution || {

      students: 0,

      lecturers: 0,

      administrators: 0,

      active_accounts: 0,

    };


  const academicPerformance =
    reportData
      ?.academic_performance || {

      average_score: 0,

      assignment_completion: 0,

      full_assignment_completion: 0,

    };


  const courseData =
    reportData
      ?.course_enrollment || [];


  const recentActivity =
    reportData
      ?.recent_activity || [];


  /* ========================================
     FORMAT PERCENT
  ======================================== */

  const formatPercent =
    (value) => {

      const number =
        Number(value) || 0;


      if (
        Number.isInteger(number)
      ) {

        return `${number}%`;

      }


      return `${number.toFixed(1)}%`;

    };


  /* ========================================
     FORMAT ACTIVITY TIME
  ======================================== */

  const formatActivityTime =
    (dateValue) => {

      if (!dateValue) {

        return "Unknown time";

      }


      const date =
        new Date(
          dateValue
        );


      const now =
        new Date();


      const difference =
        now.getTime() -
        date.getTime();


      const minutes =
        Math.floor(
          difference /
          (1000 * 60)
        );


      const hours =
        Math.floor(
          difference /
          (
            1000 *
            60 *
            60
          )
        );


      const days =
        Math.floor(
          difference /
          (
            1000 *
            60 *
            60 *
            24
          )
        );


      if (minutes < 1) {

        return "Just now";

      }


      if (minutes < 60) {

        return `${minutes} ${
          minutes === 1
            ? "minute"
            : "minutes"
        } ago`;

      }


      if (hours < 24) {

        return `${hours} ${
          hours === 1
            ? "hour"
            : "hours"
        } ago`;

      }


      if (days === 1) {

        return "Yesterday";

      }


      if (days < 7) {

        return `${days} days ago`;

      }


      return date.toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      );

    };


  /* ========================================
     EXPORT
     Step 31G
  ======================================== */

const handleExportReport = () => {

  if (!reportData) {

    alert(
      "Report data is not available yet."
    );

    return;
  }


  /* ========================================
     CSV HELPER
  ======================================== */

  const escapeCSV = (value) => {

    if (
      value === null ||
      value === undefined
    ) {

      return "";

    }


    const text =
      String(value);


    return `"${text.replace(
      /"/g,
      '""'
    )}"`;

  };


  /* ========================================
     BUILD REPORT
  ======================================== */

  const rows = [];


  rows.push([
    "CampusLearn Reports & Analytics"
  ]);


  rows.push([
    "Generated",
    new Date().toLocaleString()
  ]);


  rows.push([]);



  /* ========================================
     SUMMARY
  ======================================== */

  rows.push([
    "SUMMARY"
  ]);


  rows.push([
    "Metric",
    "Value"
  ]);


  rows.push([
    "Total Users",
    summary.total_users
  ]);


  rows.push([
    "Students",
    summary.students
  ]);


  rows.push([
    "Lecturers",
    summary.lecturers
  ]);


  rows.push([
    "Administrators",
    summary.administrators
  ]);


  rows.push([
    "Active Accounts",
    summary.active_accounts
  ]);


  rows.push([
    "Active Courses",
    summary.active_courses
  ]);


  rows.push([
    "Average Score",
    `${summary.average_score}%`
  ]);


  rows.push([]);



  /* ========================================
     ACADEMIC PERFORMANCE
  ======================================== */

  rows.push([
    "ACADEMIC PERFORMANCE"
  ]);


  rows.push([
    "Metric",
    "Percentage"
  ]);


  rows.push([
    "Average Student Score",
    `${academicPerformance.average_score}%`
  ]);


  rows.push([
    "Assignment Completion",
    `${academicPerformance.assignment_completion}%`
  ]);


  rows.push([
    "Full Assignment Completion",
    `${academicPerformance.full_assignment_completion}%`
  ]);


  rows.push([]);



  /* ========================================
     COURSE ENROLLMENT
  ======================================== */

  rows.push([
    "COURSE ENROLLMENT"
  ]);


  rows.push([
    "Course",
    "Program",
    "Batch",
    "Students",
    "Relative Enrollment %"
  ]);


  courseData.forEach(
    (course) => {

      rows.push([
        course.name,
        course.degree || "",
        course.batch || "",
        course.students,
        `${course.percentage}%`
      ]);

    }
  );


  rows.push([]);



  /* ========================================
     USER DISTRIBUTION
  ======================================== */

  rows.push([
    "USER DISTRIBUTION"
  ]);


  rows.push([
    "Role",
    "Count"
  ]);


  rows.push([
    "Students",
    userDistribution.students
  ]);


  rows.push([
    "Lecturers",
    userDistribution.lecturers
  ]);


  rows.push([
    "Administrators",
    userDistribution.administrators
  ]);


  rows.push([
    "Active Accounts",
    userDistribution.active_accounts
  ]);


  rows.push([]);



  /* ========================================
     RECENT ACTIVITY
  ======================================== */

  rows.push([
    "RECENT ACTIVITY"
  ]);


  rows.push([
    "Type",
    "Title",
    "Description",
    "Date / Time"
  ]);


  recentActivity.forEach(
    (activity) => {

      rows.push([
        activity.event_type,
        activity.title,
        activity.description,
        activity.event_time
          ? new Date(
              activity.event_time
            ).toLocaleString()
          : ""
      ]);

    }
  );


  /* ========================================
     CONVERT TO CSV
  ======================================== */

  const csvContent =
    rows
      .map(
        (row) =>
          row
            .map(
              escapeCSV
            )
            .join(",")
      )
      .join("\n");


  /* ========================================
     CREATE FILE
  ======================================== */

  const blob =
    new Blob(
      [
        "\uFEFF",
        csvContent
      ],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  const date =
    new Date()
      .toISOString()
      .split("T")[0];


  link.href =
    url;


  link.download =
    `CampusLearn_Report_${date}.csv`;


  document.body.appendChild(
    link
  );


  link.click();


  document.body.removeChild(
    link
  );


  URL.revokeObjectURL(
    url
  );

};


  return (

    <div className="admin-reports-page">


      {/* ====================================
          HEADER
      ==================================== */}

      <section className="ar-header">

        <div>

          <h1>
            Reports & Analytics
          </h1>

          <p>
            Monitor platform activity,
            academic performance and
            system statistics.
          </p>

        </div>


        <button
          className="ar-export-button"
          onClick={
            handleExportReport
          }
        >

          <Download size={16} />

          Export Report

        </button>

      </section>



      {/* ====================================
          LOADING
      ==================================== */}

      {loading && (

        <div
          style={{
            padding: "30px",
            background: "#ffffff",
            borderRadius: "16px",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >

          <BarChart3
            size={28}
          />

          <h3>
            Loading reports...
          </h3>

          <p>
            Getting real analytics
            from PostgreSQL.
          </p>

        </div>

      )}



      {/* ====================================
          ERROR
      ==================================== */}

      {!loading &&
        error && (

        <div
          style={{
            padding: "30px",
            background: "#ffffff",
            borderRadius: "16px",
            textAlign: "center",
            marginBottom: "24px",
            color: "#dc2626",
          }}
        >

          <h3>
            Unable to load reports
          </h3>

          <p>
            {error}
          </p>

        </div>

      )}



      {/* ====================================
          REPORT CONTENT
      ==================================== */}

      {!loading &&
        !error && (

        <>


          {/* ====================================
              SUMMARY
          ==================================== */}

          <section className="ar-summary">


            {/* TOTAL USERS */}

            <div className="ar-summary-card ar-teal">

              <div className="ar-summary-icon">

                <Users size={21} />

              </div>


              <div>

                <strong>
                  {
                    summary.total_users
                  }
                </strong>

                <span>
                  Total Users
                </span>

              </div>

            </div>



            {/* STUDENTS */}

            <div className="ar-summary-card ar-purple">

              <div className="ar-summary-icon">

                <GraduationCap
                  size={21}
                />

              </div>


              <div>

                <strong>
                  {
                    summary.students
                  }
                </strong>

                <span>
                  Students
                </span>

              </div>

            </div>



            {/* COURSES */}

            <div className="ar-summary-card ar-blue">

              <div className="ar-summary-icon">

                <BookOpen size={21} />

              </div>


              <div>

                <strong>
                  {
                    summary.active_courses
                  }
                </strong>

                <span>
                  Active Courses
                </span>

              </div>

            </div>



            {/* AVERAGE SCORE */}

            <div className="ar-summary-card ar-orange">

              <div className="ar-summary-icon">

                <TrendingUp
                  size={21}
                />

              </div>


              <div>

                <strong>

                  {formatPercent(
                    summary.average_score
                  )}

                </strong>

                <span>
                  Average Score
                </span>

              </div>

            </div>

          </section>



          {/* ====================================
              MAIN GRID
          ==================================== */}

          <section className="ar-main-grid">


            {/* ==================================
                COURSE ENROLLMENT
            ================================== */}

            <div className="ar-panel">

              <div className="ar-panel-header">

                <div>

                  <h2>
                    Course Enrollment
                  </h2>

                  <p>
                    Current student
                    distribution across
                    courses.
                  </p>

                </div>


                <BarChart3
                  size={19}
                />

              </div>



              <div className="ar-course-chart">


                {courseData.length ===
                  0 && (

                  <div
                    style={{
                      padding:
                        "22px 0",
                      textAlign:
                        "center",
                    }}
                  >

                    <p>
                      No course enrollment
                      data available yet.
                    </p>

                  </div>

                )}



                {courseData.map(
                  (course) => (

                    <div
                      className="ar-course-row"
                      key={course.id}
                    >

                      <div className="ar-course-info">

                        <span>
                          {course.name}
                        </span>


                        <strong>

                          {course.students}
                          {" "}

                          {course.students ===
                          1
                            ? "student"
                            : "students"}

                        </strong>

                      </div>


                      <div className="ar-progress-track">

                        <div
                          className="ar-progress-fill"

                          style={{
                            width:
                              `${course.percentage}%`,
                          }}
                        />

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>



            {/* ==================================
                USER DISTRIBUTION
            ================================== */}

            <div className="ar-panel">

              <div className="ar-panel-header">

                <div>

                  <h2>
                    User Distribution
                  </h2>

                  <p>
                    Registered users by
                    account type.
                  </p>

                </div>

              </div>



              <div className="ar-user-distribution">


                {/* STUDENTS */}

                <div className="ar-user-item">

                  <div
                    className="
                      ar-user-dot
                      ar-user-student
                    "
                  />


                  <div>

                    <span>
                      Students
                    </span>

                    <strong>
                      {
                        userDistribution
                          .students
                      }
                    </strong>

                  </div>

                </div>



                {/* LECTURERS */}

                <div className="ar-user-item">

                  <div
                    className="
                      ar-user-dot
                      ar-user-lecturer
                    "
                  />


                  <div>

                    <span>
                      Lecturers
                    </span>

                    <strong>
                      {
                        userDistribution
                          .lecturers
                      }
                    </strong>

                  </div>

                </div>



                {/* ADMINS */}

                <div className="ar-user-item">

                  <div
                    className="
                      ar-user-dot
                      ar-user-admin
                    "
                  />


                  <div>

                    <span>
                      Administrators
                    </span>

                    <strong>
                      {
                        userDistribution
                          .administrators
                      }
                    </strong>

                  </div>

                </div>

              </div>



              {/* ACTIVE ACCOUNTS */}

              <div className="ar-total-users">

                <Users size={22} />


                <div>

                  <span>
                    Total Registered
                  </span>


                  <strong>

                    {
                      userDistribution
                        .active_accounts
                    }

                    {" "}Active Accounts

                  </strong>

                </div>

              </div>

            </div>

          </section>



          {/* ====================================
              SECOND GRID
          ==================================== */}

          <section className="ar-second-grid">


            {/* ==================================
                PERFORMANCE
            ================================== */}

            <div className="ar-panel">

              <div className="ar-panel-header">

                <div>

                  <h2>
                    Academic Performance
                  </h2>

                  <p>
                    Current platform-wide
                    performance indicators.
                  </p>

                </div>

              </div>



              <div className="ar-performance-list">


                {/* AVERAGE SCORE */}

                <div>

                  <div className="ar-performance-icon">

                    <TrendingUp
                      size={18}
                    />

                  </div>


                  <span>
                    Average Student Score
                  </span>


                  <strong>

                    {formatPercent(
                      academicPerformance
                        .average_score
                    )}

                  </strong>

                </div>



                {/* ASSIGNMENT COMPLETION */}

                <div>

                  <div className="ar-performance-icon">

                    <CircleCheckBig
                      size={18}
                    />

                  </div>


                  <span>
                    Assignment Completion
                  </span>


                  <strong>

                    {formatPercent(
                      academicPerformance
                        .assignment_completion
                    )}

                  </strong>

                </div>



                {/* FULL COMPLETION */}

                <div>

                  <div className="ar-performance-icon">

                    <BookOpen
                      size={18}
                    />

                  </div>


                  <span>
                    Full Assignment Completion
                  </span>


                  <strong>

                    {formatPercent(
                      academicPerformance
                        .full_assignment_completion
                    )}

                  </strong>

                </div>

              </div>

            </div>



            {/* ==================================
                RECENT ACTIVITY
            ================================== */}

            <div className="ar-panel">

              <div className="ar-panel-header">

                <div>

                  <h2>
                    Recent Activity
                  </h2>

                  <p>
                    Latest platform events.
                  </p>

                </div>


                <Activity size={19} />

              </div>



              <div className="ar-activity-list">


                {recentActivity.length ===
                  0 && (

                  <div
                    style={{
                      padding:
                        "20px 0",
                    }}
                  >

                    <p>
                      No recent activity
                      available yet.
                    </p>

                  </div>

                )}



                {recentActivity.map(
                  (
                    activity,
                    index
                  ) => (

                    <div
                      className="ar-activity-item"

                      key={
                        `${activity.event_type}-${activity.event_time}-${index}`
                      }
                    >

                      <div className="ar-activity-dot" />


                      <div>

                        <strong>
                          {
                            activity.title
                          }
                        </strong>


                        <p>
                          {
                            activity.description
                          }
                        </p>


                        <span>

                          {formatActivityTime(
                            activity.event_time
                          )}

                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          </section>

        </>

      )}

    </div>

  );

}


export default AdminReports;