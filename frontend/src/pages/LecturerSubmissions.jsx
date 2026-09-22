import { useMemo, useState } from "react";

import {
  FileCheck2,
  Search,
  Users,
  Clock3,
  CircleCheckBig,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Eye,
  Download,
  X,
  FileText,
  Award,
  UserRound,
} from "lucide-react";

import "../styles/lecturerSubmissions.css";


function LecturerSubmissions() {

  /*
    Temporary frontend data.

    Later we will replace this with
    real PostgreSQL submission data.
  */

  const [submissions] = useState([
    {
      id: 1,
      student: "Movinya Perera",
      studentId: "STU001",
      initials: "MP",
      assignment: "Software Design Report",
      course: "Software Engineering",
      submittedAt: "2026-09-22T10:30:00",
      fileName: "software_design_report.pdf",
      status: "To Grade",
      marks: null,
      maxMarks: 100,
    },

    {
      id: 2,
      student: "Amaya Silva",
      studentId: "STU002",
      initials: "AS",
      assignment: "Database Normalization Exercise",
      course: "Database Systems",
      submittedAt: "2026-09-22T08:15:00",
      fileName: "normalization_assignment.pdf",
      status: "To Grade",
      marks: null,
      maxMarks: 50,
    },

    {
      id: 3,
      student: "Dinuka Fernando",
      studentId: "STU003",
      initials: "DF",
      assignment: "Responsive React Interface",
      course: "Web Development",
      submittedAt: "2026-09-21T17:20:00",
      fileName: "react_project.zip",
      status: "Graded",
      marks: 84,
      maxMarks: 100,
    },

    {
      id: 4,
      student: "Nethmi Jayasinghe",
      studentId: "STU004",
      initials: "NJ",
      assignment: "Machine Learning Model Evaluation",
      course: "Artificial Intelligence",
      submittedAt: "2026-09-21T14:05:00",
      fileName: "ml_evaluation.pdf",
      status: "Graded",
      marks: 88,
      maxMarks: 100,
    },

    {
      id: 5,
      student: "Kavindu Perera",
      studentId: "STU005",
      initials: "KP",
      assignment: "Software Design Report",
      course: "Software Engineering",
      submittedAt: "2026-09-20T20:40:00",
      fileName: "design_report.pdf",
      status: "To Grade",
      marks: null,
      maxMarks: 100,
    },
  ]);


  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedSubmission, setSelectedSubmission] =
    useState(null);


  /* ========================================
     COUNTS
  ======================================== */

  const totalSubmissions =
    submissions.length;


  const toGradeCount =
    submissions.filter(
      (submission) =>
        submission.status === "To Grade"
    ).length;


  const gradedCount =
    submissions.filter(
      (submission) =>
        submission.status === "Graded"
    ).length;


  const uniqueStudents =
    new Set(
      submissions.map(
        (submission) =>
          submission.studentId
      )
    ).size;


  /* ========================================
     FILTER
  ======================================== */

  const filteredSubmissions =
    useMemo(() => {

      return submissions.filter(
        (submission) => {

          const search =
            searchTerm.toLowerCase();


          const matchesSearch =
            submission.student
              .toLowerCase()
              .includes(search) ||

            submission.assignment
              .toLowerCase()
              .includes(search) ||

            submission.course
              .toLowerCase()
              .includes(search);


          const matchesStatus =
            statusFilter === "All" ||
            submission.status ===
              statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      submissions,
      searchTerm,
      statusFilter,
    ]);


  /* ========================================
     DATE FORMAT
  ======================================== */

  const formatDate = (date) => {

    return new Date(
      date
    ).toLocaleString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  };


  return (
    <div className="lecturer-submissions-page">


      {/* ====================================
          HEADER
      ==================================== */}

      <section className="ls-header">

        <div>

          <h1>
            Submissions
          </h1>

          <p>
            Review student coursework,
            submitted files and grading
            status.
          </p>

        </div>


        <div className="ls-header-badge">

          <FileCheck2 size={16} />

          {toGradeCount} Awaiting Review

        </div>

      </section>



      {/* ====================================
          SUMMARY
      ==================================== */}

      <section className="ls-summary">


        <div className="ls-summary-card ls-blue">

          <div className="ls-summary-icon">

            <FileCheck2 size={21} />

          </div>

          <div>

            <strong>
              {totalSubmissions}
            </strong>

            <span>
              Total Submissions
            </span>

          </div>

        </div>


        <div className="ls-summary-card ls-orange">

          <div className="ls-summary-icon">

            <Clock3 size={21} />

          </div>

          <div>

            <strong>
              {toGradeCount}
            </strong>

            <span>
              To Grade
            </span>

          </div>

        </div>


        <div className="ls-summary-card ls-green">

          <div className="ls-summary-icon">

            <CircleCheckBig size={21} />

          </div>

          <div>

            <strong>
              {gradedCount}
            </strong>

            <span>
              Graded
            </span>

          </div>

        </div>


        <div className="ls-summary-card ls-purple">

          <div className="ls-summary-icon">

            <Users size={21} />

          </div>

          <div>

            <strong>
              {uniqueStudents}
            </strong>

            <span>
              Students
            </span>

          </div>

        </div>

      </section>



      {/* ====================================
          TOOLBAR
      ==================================== */}

      <section className="ls-toolbar">

        <div className="ls-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search student, assignment or course..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>


        <select
          className="ls-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >

          <option value="All">
            All Submissions
          </option>

          <option value="To Grade">
            To Grade
          </option>

          <option value="Graded">
            Graded
          </option>

        </select>

      </section>



      {/* ====================================
          TABLE
      ==================================== */}

      <section className="ls-table-container">

        <table className="ls-table">

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
                Submitted
              </th>

              <th>
                Status
              </th>

              <th>
                Marks
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {filteredSubmissions.map(
              (submission) => (

                <tr key={submission.id}>


                  {/* STUDENT */}

                  <td>

                    <div className="ls-student">

                      <div className="ls-student-avatar">

                        {submission.initials}

                      </div>


                      <div>

                        <strong>
                          {submission.student}
                        </strong>

                        <span>
                          {submission.studentId}
                        </span>

                      </div>

                    </div>

                  </td>



                  {/* ASSIGNMENT */}

                  <td className="ls-primary-text">

                    {submission.assignment}

                  </td>



                  {/* COURSE */}

                  <td>

                    <div className="ls-course">

                      <BookOpen size={12} />

                      {submission.course}

                    </div>

                  </td>



                  {/* DATE */}

                  <td>

                    <div className="ls-date">

                      <CalendarDays
                        size={12}
                      />

                      {formatDate(
                        submission.submittedAt
                      )}

                    </div>

                  </td>



                  {/* STATUS */}

                  <td>

                    <span
                      className={
                        submission.status ===
                        "Graded"
                          ? "ls-status ls-status-graded"
                          : "ls-status ls-status-pending"
                      }
                    >

                      {submission.status ===
                      "Graded" ? (

                        <CircleCheckBig
                          size={11}
                        />

                      ) : (

                        <Clock3 size={11} />

                      )}


                      {submission.status}

                    </span>

                  </td>



                  {/* MARK */}

                  <td>

                    {submission.marks !==
                    null ? (

                      <strong className="ls-mark">

                        {submission.marks}
                        /
                        {submission.maxMarks}

                      </strong>

                    ) : (

                      <span className="ls-no-mark">

                        —

                      </span>

                    )}

                  </td>



                  {/* ACTION */}

                  <td>

                    <button
                      className="ls-review-button"
                      onClick={() =>
                        setSelectedSubmission(
                          submission
                        )
                      }
                    >

                      <Eye size={14} />

                      Review

                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>


        {filteredSubmissions.length === 0 && (

          <div className="ls-empty">

            <FileCheck2 size={28} />

            <h3>
              No submissions found
            </h3>

            <p>
              Try changing your search
              or filter.
            </p>

          </div>

        )}

      </section>



      {/* ====================================
          REVIEW MODAL
      ==================================== */}

      {selectedSubmission && (

        <div className="ls-modal-overlay">

          <div className="ls-review-modal">


            {/* HEADER */}

            <div className="ls-modal-header">

              <div>

                <h2>
                  Review Submission
                </h2>

                <p>
                  View the student's
                  submission information.
                </p>

              </div>


              <button
                className="ls-modal-close"
                onClick={() =>
                  setSelectedSubmission(
                    null
                  )
                }
              >

                <X size={18} />

              </button>

            </div>



            {/* STUDENT */}

            <div className="ls-review-student">

              <div className="ls-review-avatar">

                {
                  selectedSubmission.initials
                }

              </div>


              <div>

                <h3>
                  {
                    selectedSubmission.student
                  }
                </h3>

                <p>
                  {
                    selectedSubmission.studentId
                  }
                </p>

              </div>

            </div>



            {/* INFO GRID */}

            <div className="ls-review-grid">


              <div className="ls-review-info">

                <BookOpen size={17} />

                <div>

                  <span>
                    Course
                  </span>

                  <strong>
                    {
                      selectedSubmission.course
                    }
                  </strong>

                </div>

              </div>


              <div className="ls-review-info">

                <ClipboardListIcon />

                <div>

                  <span>
                    Assignment
                  </span>

                  <strong>
                    {
                      selectedSubmission.assignment
                    }
                  </strong>

                </div>

              </div>


              <div className="ls-review-info">

                <CalendarDays size={17} />

                <div>

                  <span>
                    Submitted
                  </span>

                  <strong>
                    {formatDate(
                      selectedSubmission
                        .submittedAt
                    )}
                  </strong>

                </div>

              </div>


              <div className="ls-review-info">

                <Award size={17} />

                <div>

                  <span>
                    Maximum Marks
                  </span>

                  <strong>
                    {
                      selectedSubmission.maxMarks
                    }
                  </strong>

                </div>

              </div>

            </div>



            {/* FILE */}

            <div className="ls-file-card">

              <div className="ls-file-icon">

                <FileText size={22} />

              </div>


              <div>

                <strong>
                  {
                    selectedSubmission.fileName
                  }
                </strong>

                <span>
                  Student submission file
                </span>

              </div>


              <button>

                <Download size={15} />

                Download

              </button>

            </div>



            {/* CURRENT RESULT */}

            {selectedSubmission.status ===
              "Graded" && (

              <div className="ls-result-box">

                <CircleCheckBig
                  size={20}
                />

                <div>

                  <strong>
                    Already Graded
                  </strong>

                  <span>
                    Result:
                    {" "}
                    {
                      selectedSubmission.marks
                    }
                    /
                    {
                      selectedSubmission.maxMarks
                    }
                  </span>

                </div>

              </div>

            )}



            {/* FOOTER */}

            <div className="ls-modal-actions">

              <button
                className="ls-secondary-button"
                onClick={() =>
                  setSelectedSubmission(
                    null
                  )
                }
              >

                Close

              </button>


              <button className="lecturer-primary-button">

                <GraduationCap
                  size={15}
                />

                {selectedSubmission.status ===
                "Graded"
                  ? "View Grade"
                  : "Grade Submission"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}


/*
  Small icon component to avoid
  importing another clipboard icon.
*/

function ClipboardListIcon() {
  return (
    <FileCheck2 size={17} />
  );
}


export default LecturerSubmissions;