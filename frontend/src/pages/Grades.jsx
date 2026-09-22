import {
  GraduationCap,
  Award,
  TrendingUp,
  BookOpen,
  Trophy,
  BrainCircuit,
  Database,
  Code2,
  Globe2,
  CircleCheckBig,
} from "lucide-react";

import "../styles/grades.css";


function Grades() {

  /*
    TEMPORARY UI DATA

    Later we will replace this
    with real backend/database data.
  */

  const gpa = 3.7;


  const courseGrades = [
    {
      id: 1,
      course:
        "Artificial Intelligence & Machine Learning",
      lecturer: "Dr. Sarah Johnson",
      score: 86,
      grade: "A",
      icon: BrainCircuit,
    },
    {
      id: 2,
      course: "Database Systems",
      lecturer: "Prof. Michael Brown",
      score: 82,
      grade: "A",
      icon: Database,
    },
    {
      id: 3,
      course: "Software Engineering",
      lecturer: "Dr. Emily Davis",
      score: 74,
      grade: "B",
      icon: Code2,
    },
    {
      id: 4,
      course:
        "Web Development Fundamentals",
      lecturer: "Mr. David Wilson",
      score: 78,
      grade: "B",
      icon: Globe2,
    },
  ];


  const recentResults = [
    {
      assignment:
        "Machine Learning Model Evaluation",
      course:
        "Artificial Intelligence",
      marks: "87 / 100",
      grade: "A",
      feedback:
        "Strong analysis and clear explanation.",
    },
    {
      assignment:
        "Database Normalization Exercise",
      course: "Database Systems",
      marks: "84 / 100",
      grade: "A",
      feedback:
        "Well structured and technically accurate.",
    },
    {
      assignment:
        "Software Design Report",
      course: "Software Engineering",
      marks: "75 / 100",
      grade: "B",
      feedback:
        "Good work. Improve design justification.",
    },
    {
      assignment:
        "Responsive Web Interface",
      course: "Web Development",
      marks: "78 / 100",
      grade: "B",
      feedback:
        "Good implementation and clean interface.",
    },
  ];


  const getGradeClass = (grade) => {

    if (grade === "A") {
      return "grade-a";
    }

    if (grade === "B") {
      return "grade-b";
    }

    return "grade-c";

  };


  return (
    <div className="grades-page">

      {/* HEADER */}

      <section className="grades-header">

        <div>

          <h1>
            Grades
          </h1>

          <p>
            Review your academic performance,
            assignment results and lecturer
            feedback.
          </p>

        </div>


        <div className="grades-header-badge">

          <TrendingUp size={16} />

          Good Standing

        </div>

      </section>


      {/* SUMMARY */}

      <section className="grades-summary">

        <div className="grade-summary-card grade-purple">

          <div className="grade-summary-icon">
            <GraduationCap size={21} />
          </div>

          <div>

            <strong>
              {gpa}
            </strong>

            <span>
              Current GPA
            </span>

          </div>

        </div>


        <div className="grade-summary-card grade-blue">

          <div className="grade-summary-icon">
            <BookOpen size={21} />
          </div>

          <div>

            <strong>
              6
            </strong>

            <span>
              Graded Courses
            </span>

          </div>

        </div>


        <div className="grade-summary-card grade-green">

          <div className="grade-summary-icon">
            <CircleCheckBig size={21} />
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


        <div className="grade-summary-card grade-orange">

          <div className="grade-summary-icon">
            <Award size={21} />
          </div>

          <div>

            <strong>
              2
            </strong>

            <span>
              A Grades
            </span>

          </div>

        </div>

      </section>


      {/* MAIN */}

      <section className="grades-main-grid">

        {/* COURSE PERFORMANCE */}

        <div className="grades-panel">

          <div className="grades-panel-header">

            <h2>
              Course Performance
            </h2>

            <p>
              Your current performance
              across your modules.
            </p>

          </div>


          <div className="course-grades-list">

            {courseGrades.map(
              (course) => {

                const Icon =
                  course.icon;


                return (
                  <article
                    className="course-grade-card"
                    key={course.id}
                  >

                    <div className="course-grade-icon">

                      <Icon size={19} />

                    </div>


                    <div className="course-grade-info">

                      <h3>
                        {course.course}
                      </h3>

                      <p>
                        {course.lecturer}
                      </p>

                    </div>


                    <div className="course-grade-score">

                      {course.score}%

                    </div>


                    <div
                      className={`course-grade-letter ${getGradeClass(
                        course.grade
                      )}`}
                    >

                      {course.grade}

                    </div>

                  </article>
                );

              }
            )}

          </div>

        </div>


        {/* GPA */}

        <div className="grades-panel">

          <div className="grades-panel-header">

            <h2>
              GPA Overview
            </h2>

            <p>
              Current semester standing.
            </p>

          </div>


          <div className="gpa-card">

            <div className="gpa-circle">

              <div className="gpa-circle-inner">

                <strong>
                  {gpa}
                </strong>

                <span>
                  CURRENT GPA
                </span>

              </div>

            </div>


            <p className="gpa-message">
              Your academic performance
              is currently strong. Keep
              maintaining consistent
              results across your modules.
            </p>

          </div>

        </div>

      </section>


      {/* RECENT RESULTS */}

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
                  Course
                </th>

                <th>
                  Marks
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

              {recentResults.map(
                (result, index) => (

                  <tr key={index}>

                    <td className="result-title">

                      {result.assignment}

                    </td>


                    <td>

                      {result.course}

                    </td>


                    <td>

                      {result.marks}

                    </td>


                    <td>

                      <span className="result-grade-badge">

                        {result.grade}

                      </span>

                    </td>


                    <td className="result-feedback">

                      {result.feedback}

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </section>


      {/* BANNER */}

      <section className="grades-banner">

        <div className="grades-banner-icon">

          <Trophy size={24} />

        </div>


        <div className="grades-banner-content">

          <h3>
            Keep up the great work!
          </h3>

          <p>
            Your current GPA is 3.7 and your
            average performance is strong.
            Stay consistent with your coursework
            to maintain your results.
          </p>

        </div>

      </section>

    </div>
  );
}


export default Grades;