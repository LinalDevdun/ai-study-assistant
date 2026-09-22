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

  /*
    Temporary frontend values.

    Later we will replace these with
    real backend/database values.
  */

  const overallProgress = 77;


  const weeklyActivity = [
    {
      day: "Mon",
      hours: 2.5,
      height: 55,
    },
    {
      day: "Tue",
      hours: 3.2,
      height: 72,
    },
    {
      day: "Wed",
      hours: 1.8,
      height: 41,
    },
    {
      day: "Thu",
      hours: 4.0,
      height: 88,
    },
    {
      day: "Fri",
      hours: 3.4,
      height: 76,
    },
    {
      day: "Sat",
      hours: 2.2,
      height: 49,
    },
    {
      day: "Sun",
      hours: 3.7,
      height: 82,
    },
  ];


  const courses = [
    {
      id: 1,
      title:
        "Artificial Intelligence & Machine Learning",
      completed: 18,
      total: 25,
      progress: 72,
      icon: BrainCircuit,
    },
    {
      id: 2,
      title: "Database Systems",
      completed: 17,
      total: 20,
      progress: 85,
      icon: Database,
    },
    {
      id: 3,
      title: "Software Engineering",
      completed: 11,
      total: 18,
      progress: 61,
      icon: Code2,
    },
    {
      id: 4,
      title:
        "Web Development Fundamentals",
      completed: 9,
      total: 20,
      progress: 45,
      icon: Globe2,
    },
  ];


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
            Track your learning activity,
            course completion and study
            performance.
          </p>

        </div>


        <div className="progress-header-badge">

          <TrendingUp size={16} />

          On Track

        </div>

      </section>


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
              {overallProgress}%
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
              6
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
              20.8h
            </strong>

            <span>
              Study Time This Week
            </span>

          </div>

        </div>


        <div className="progress-summary-card progress-orange">

          <div className="progress-summary-icon">
            <Award size={21} />
          </div>

          <div>

            <strong>
              14
            </strong>

            <span>
              Tasks Completed
            </span>

          </div>

        </div>

      </section>


      {/* ====================================
          OVERALL + WEEKLY
      ==================================== */}

      <section className="progress-main-grid">


        {/* OVERALL */}
        <div className="progress-panel">

          <div className="progress-panel-header">

            <h2>
              Overall Learning Progress
            </h2>

            <p>
              Your progress across all
              enrolled courses.
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
                  {overallProgress}%
                </strong>

                <span>
                  COMPLETED
                </span>

              </div>

            </div>


            <p className="progress-overall-message">
              Great work! You're making
              consistent progress across
              your modules. Keep your
              learning streak going.
            </p>

          </div>

        </div>


        {/* WEEKLY ACTIVITY */}
        <div className="progress-panel">

          <div className="progress-panel-header">

            <h2>
              Weekly Study Activity
            </h2>

            <p>
              Hours spent studying this
              week.
            </p>

          </div>


          <div className="weekly-chart">

            {weeklyActivity.map(
              (item) => (

                <div
                  className="weekly-column"
                  key={item.day}
                >

                  <strong>
                    {item.hours}h
                  </strong>


                  <div className="weekly-bar-track">

                    <div
                      className="weekly-bar-fill"
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
          COURSE PROGRESS
      ==================================== */}

      <section className="course-progress-section">

        <div className="course-progress-heading">

          <h2>
            Course Progress
          </h2>

        </div>


        <div className="course-progress-list">

          {courses.map((course) => {

            const Icon =
              course.icon;


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
                      {course.completed} of{" "}
                      {course.total} lessons
                      completed
                    </p>

                  </div>


                  <span className="course-progress-percentage">

                    {course.progress}%

                  </span>

                </div>


                <div className="course-progress-track-large">

                  <div
                    className="course-progress-fill-large"
                    style={{
                      width:
                        `${course.progress}%`,
                    }}
                  />

                </div>


                <div className="course-progress-bottom">

                  <span>
                    {course.completed} completed
                  </span>

                  <span>
                    {course.total -
                      course.completed}{" "}
                    remaining
                  </span>

                </div>

              </article>
            );

          })}

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
              You're doing great!
            </h3>

            <p>
              You've completed 77% of your
              learning activities. Keep
              studying consistently to reach
              your semester goals.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}


export default Progress;