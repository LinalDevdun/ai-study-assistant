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

  const courseData = [
    {
      name: "Software Engineering",
      students: 42,
      percentage: 84,
    },
    {
      name: "Database Systems",
      students: 36,
      percentage: 72,
    },
    {
      name: "Web Development",
      students: 38,
      percentage: 76,
    },
    {
      name: "Artificial Intelligence",
      students: 32,
      percentage: 64,
    },
  ];


  const recentActivity = [
    {
      title: "New student account created",
      description:
        "Amaya Silva was added to CampusLearn.",
      time: "10 minutes ago",
    },
    {
      title: "Course created",
      description:
        "Cloud Computing was added to the system.",
      time: "1 hour ago",
    },
    {
      title: "Assignment graded",
      description:
        "Software Design Report grading was completed.",
      time: "3 hours ago",
    },
    {
      title: "Lecturer account updated",
      description:
        "Lecturer profile information was modified.",
      time: "Yesterday",
    },
  ];


  return (
    <div className="admin-reports-page">


      {/* HEADER */}

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


        <button className="ar-export-button">

          <Download size={16} />

          Export Report

        </button>

      </section>



      {/* SUMMARY */}

      <section className="ar-summary">


        <div className="ar-summary-card ar-teal">

          <div className="ar-summary-icon">

            <Users size={21} />

          </div>

          <div>

            <strong>
              326
            </strong>

            <span>
              Total Users
            </span>

          </div>

        </div>


        <div className="ar-summary-card ar-purple">

          <div className="ar-summary-icon">

            <GraduationCap
              size={21}
            />

          </div>

          <div>

            <strong>
              248
            </strong>

            <span>
              Students
            </span>

          </div>

        </div>


        <div className="ar-summary-card ar-blue">

          <div className="ar-summary-icon">

            <BookOpen size={21} />

          </div>

          <div>

            <strong>
              18
            </strong>

            <span>
              Active Courses
            </span>

          </div>

        </div>


        <div className="ar-summary-card ar-orange">

          <div className="ar-summary-icon">

            <TrendingUp
              size={21}
            />

          </div>

          <div>

            <strong>
              81%
            </strong>

            <span>
              Average Score
            </span>

          </div>

        </div>

      </section>



      {/* MAIN GRID */}

      <section className="ar-main-grid">


        {/* COURSE ENROLLMENT */}

        <div className="ar-panel">

          <div className="ar-panel-header">

            <div>

              <h2>
                Course Enrollment
              </h2>

              <p>
                Current student distribution
                across major courses.
              </p>

            </div>


            <BarChart3
              size={19}
            />

          </div>


          <div className="ar-course-chart">

            {courseData.map(
              (course) => (

                <div
                  className="ar-course-row"
                  key={course.name}
                >

                  <div className="ar-course-info">

                    <span>
                      {course.name}
                    </span>

                    <strong>
                      {course.students}
                      {" "}
                      students
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



        {/* USER DISTRIBUTION */}

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
                  248
                </strong>

              </div>

            </div>


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
                  32
                </strong>

              </div>

            </div>


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
                  4
                </strong>

              </div>

            </div>

          </div>


          <div className="ar-total-users">

            <Users size={22} />

            <div>

              <span>
                Total Registered
              </span>

              <strong>
                284 Active Accounts
              </strong>

            </div>

          </div>

        </div>

      </section>



      {/* SECOND GRID */}

      <section className="ar-second-grid">


        {/* PERFORMANCE */}

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
                81%
              </strong>

            </div>


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
                87%
              </strong>

            </div>


            <div>

              <div className="ar-performance-icon">

                <BookOpen
                  size={18}
                />

              </div>

              <span>
                Course Completion
              </span>

              <strong>
                76%
              </strong>

            </div>

          </div>

        </div>



        {/* RECENT ACTIVITY */}

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

            {recentActivity.map(
              (activity, index) => (

                <div
                  className="ar-activity-item"
                  key={index}
                >

                  <div className="ar-activity-dot" />


                  <div>

                    <strong>
                      {activity.title}
                    </strong>

                    <p>
                      {
                        activity.description
                      }
                    </p>

                    <span>
                      {activity.time}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </section>

    </div>
  );
}


export default AdminReports;