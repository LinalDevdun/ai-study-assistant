import {
  useMemo,
  useState,
} from "react";

import {
  GraduationCap,
  Search,
  Clock3,
  CircleCheckBig,
  FileText,
  BookOpen,
  UserRound,
  Award,
  MessageSquareText,
  Send,
  CheckCircle2,
  Eye,
} from "lucide-react";

import "../styles/lecturerGrading.css";


function LecturerGrading() {

  /*
    Temporary frontend data.

    Later we will replace this with
    real submission + grading data
    from PostgreSQL.
  */

  const [submissions, setSubmissions] =
    useState([
      {
        id: 1,
        student: "Movinya Perera",
        studentId: "STU001",
        initials: "MP",
        assignment: "Software Design Report",
        course: "Software Engineering",
        fileName: "software_design_report.pdf",
        maxMarks: 100,
        status: "To Grade",
        marks: "",
        feedback: "",
      },
      {
        id: 2,
        student: "Amaya Silva",
        studentId: "STU002",
        initials: "AS",
        assignment: "Database Normalization Exercise",
        course: "Database Systems",
        fileName: "normalization_assignment.pdf",
        maxMarks: 50,
        status: "To Grade",
        marks: "",
        feedback: "",
      },
      {
        id: 3,
        student: "Kavindu Perera",
        studentId: "STU005",
        initials: "KP",
        assignment: "Software Design Report",
        course: "Software Engineering",
        fileName: "design_report.pdf",
        maxMarks: 100,
        status: "To Grade",
        marks: "",
        feedback: "",
      },
      {
        id: 4,
        student: "Dinuka Fernando",
        studentId: "STU003",
        initials: "DF",
        assignment: "Responsive React Interface",
        course: "Web Development",
        fileName: "react_project.zip",
        maxMarks: 100,
        status: "Graded",
        marks: 84,
        feedback:
          "Good implementation and clean component structure.",
      },
    ]);


  const [selectedId, setSelectedId] =
    useState(1);


  const [searchTerm, setSearchTerm] =
    useState("");


  /* ========================================
     CURRENT SUBMISSION
  ======================================== */

  const selectedSubmission =
    submissions.find(
      (submission) =>
        submission.id === selectedId
    );


  /* ========================================
     FILTER QUEUE
  ======================================== */

  const filteredSubmissions =
    useMemo(() => {

      const search =
        searchTerm.toLowerCase();

      return submissions.filter(
        (submission) =>
          submission.student
            .toLowerCase()
            .includes(search) ||

          submission.assignment
            .toLowerCase()
            .includes(search) ||

          submission.course
            .toLowerCase()
            .includes(search)
      );

    }, [
      submissions,
      searchTerm,
    ]);


  /* ========================================
     COUNTS
  ======================================== */

  const toGradeCount =
    submissions.filter(
      (submission) =>
        submission.status ===
        "To Grade"
    ).length;


  const gradedCount =
    submissions.filter(
      (submission) =>
        submission.status ===
        "Graded"
    ).length;


  /* ========================================
     UPDATE MARKS / FEEDBACK
  ======================================== */

  const updateSelectedSubmission = (
    field,
    value
  ) => {

    setSubmissions(
      (previous) =>
        previous.map(
          (submission) =>
            submission.id ===
            selectedId
              ? {
                  ...submission,
                  [field]: value,
                }
              : submission
        )
    );

  };


  /* ========================================
     PERCENTAGE
  ======================================== */

  const percentage = (() => {

    if (
      !selectedSubmission ||
      selectedSubmission.marks === ""
    ) {
      return 0;
    }


    const marks =
      Number(
        selectedSubmission.marks
      );


    if (
      Number.isNaN(marks) ||
      selectedSubmission.maxMarks === 0
    ) {
      return 0;
    }


    return Math.round(
      (
        marks /
        selectedSubmission.maxMarks
      ) * 100
    );

  })();


  /* ========================================
     LETTER GRADE
  ======================================== */

  const getGrade = (
    percentageValue
  ) => {

    if (percentageValue >= 80) {
      return "A";
    }

    if (percentageValue >= 70) {
      return "B";
    }

    if (percentageValue >= 60) {
      return "C";
    }

    if (percentageValue >= 50) {
      return "D";
    }

    return "F";

  };


  const grade =
    selectedSubmission?.marks === ""
      ? "—"
      : getGrade(percentage);


  /* ========================================
     PUBLISH GRADE
  ======================================== */

  const handlePublishGrade = () => {

    if (!selectedSubmission) {
      return;
    }


    const marks =
      Number(
        selectedSubmission.marks
      );


    if (
      selectedSubmission.marks === "" ||
      Number.isNaN(marks)
    ) {

      alert(
        "Please enter the student's marks."
      );

      return;
    }


    if (
      marks < 0 ||
      marks >
        selectedSubmission.maxMarks
    ) {

      alert(
        `Marks must be between 0 and ${selectedSubmission.maxMarks}.`
      );

      return;
    }


    setSubmissions(
      (previous) =>
        previous.map(
          (submission) =>
            submission.id ===
            selectedId
              ? {
                  ...submission,
                  status: "Graded",
                }
              : submission
        )
    );


    alert(
      "Grade published successfully for UI testing."
    );

  };


  return (
    <div className="lecturer-grading-page">


      {/* ====================================
          HEADER
      ==================================== */}

      <section className="lg-header">

        <div>

          <h1>
            Grading
          </h1>

          <p>
            Review student submissions,
            award marks and provide
            academic feedback.
          </p>

        </div>


        <div className="lg-header-badge">

          <GraduationCap
            size={16}
          />

          {toGradeCount}
          {" "}
          Awaiting Grading

        </div>

      </section>



      {/* ====================================
          SUMMARY
      ==================================== */}

      <section className="lg-summary">


        <div className="lg-summary-card lg-orange">

          <div className="lg-summary-icon">

            <Clock3 size={21} />

          </div>

          <div>

            <strong>
              {toGradeCount}
            </strong>

            <span>
              Waiting to Grade
            </span>

          </div>

        </div>


        <div className="lg-summary-card lg-green">

          <div className="lg-summary-icon">

            <CircleCheckBig
              size={21}
            />

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


        <div className="lg-summary-card lg-blue">

          <div className="lg-summary-icon">

            <FileText size={21} />

          </div>

          <div>

            <strong>
              {submissions.length}
            </strong>

            <span>
              Total Submissions
            </span>

          </div>

        </div>

      </section>



      {/* ====================================
          GRADING WORKSPACE
      ==================================== */}

      <section className="lg-workspace">


        {/* ==================================
            LEFT QUEUE
        ================================== */}

        <aside className="lg-queue">

          <div className="lg-queue-header">

            <div>

              <h2>
                Grading Queue
              </h2>

              <p>
                Select a submission
                to review.
              </p>

            </div>

          </div>


          <div className="lg-search">

            <Search size={16} />

            <input
              type="text"
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

          </div>


          <div className="lg-queue-list">

            {filteredSubmissions.map(
              (submission) => (

                <button
                  key={submission.id}
                  className={`lg-queue-item ${
                    selectedId ===
                    submission.id
                      ? "lg-queue-item-active"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedId(
                      submission.id
                    )
                  }
                >

                  <div className="lg-queue-avatar">

                    {
                      submission.initials
                    }

                  </div>


                  <div className="lg-queue-info">

                    <strong>
                      {
                        submission.student
                      }
                    </strong>

                    <span>
                      {
                        submission.assignment
                      }
                    </span>

                    <small>
                      {
                        submission.course
                      }
                    </small>

                  </div>


                  <div
                    className={
                      submission.status ===
                      "Graded"
                        ? "lg-small-status lg-small-status-graded"
                        : "lg-small-status lg-small-status-pending"
                    }
                  >

                    {submission.status ===
                    "Graded" ? (

                      <CircleCheckBig
                        size={11}
                      />

                    ) : (

                      <Clock3
                        size={11}
                      />

                    )}

                  </div>

                </button>

              )
            )}

          </div>

        </aside>



        {/* ==================================
            RIGHT GRADING AREA
        ================================== */}

        {selectedSubmission && (

          <div className="lg-grading-panel">


            {/* STUDENT HEADER */}

            <div className="lg-student-header">

              <div className="lg-student-profile">

                <div className="lg-large-avatar">

                  {
                    selectedSubmission.initials
                  }

                </div>


                <div>

                  <h2>
                    {
                      selectedSubmission.student
                    }
                  </h2>

                  <p>
                    {
                      selectedSubmission.studentId
                    }
                  </p>

                </div>

              </div>


              <span
                className={
                  selectedSubmission.status ===
                  "Graded"
                    ? "lg-status lg-status-graded"
                    : "lg-status lg-status-pending"
                }
              >

                {selectedSubmission.status}

              </span>

            </div>



            {/* INFORMATION */}

            <div className="lg-info-grid">


              <div className="lg-info-card">

                <BookOpen size={18} />

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


              <div className="lg-info-card">

                <FileText size={18} />

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


              <div className="lg-info-card">

                <Award size={18} />

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

            <div className="lg-submission-file">

              <div className="lg-file-icon">

                <FileText
                  size={22}
                />

              </div>


              <div>

                <strong>
                  {
                    selectedSubmission.fileName
                  }
                </strong>

                <span>
                  Student submission
                </span>

              </div>


              <button>

                <Eye size={14} />

                Open File

              </button>

            </div>



            {/* GRADING FORM */}

            <div className="lg-form-section">

              <div className="lg-section-title">

                <h3>
                  Grade Submission
                </h3>

                <p>
                  Enter marks and provide
                  feedback for the student.
                </p>

              </div>


              <div className="lg-mark-row">


                <div className="lg-form-group">

                  <label>
                    Marks Awarded
                  </label>

                  <div className="lg-mark-input">

                    <input
                      type="number"
                      min="0"
                      max={
                        selectedSubmission.maxMarks
                      }
                      value={
                        selectedSubmission.marks
                      }
                      onChange={(event) =>
                        updateSelectedSubmission(
                          "marks",
                          event.target.value
                        )
                      }
                    />

                    <span>
                      /
                      {" "}
                      {
                        selectedSubmission.maxMarks
                      }
                    </span>

                  </div>

                </div>



                <div className="lg-result-preview">

                  <div>

                    <span>
                      Percentage
                    </span>

                    <strong>
                      {percentage}%
                    </strong>

                  </div>


                  <div>

                    <span>
                      Grade
                    </span>

                    <strong className="lg-grade-letter">
                      {grade}
                    </strong>

                  </div>

                </div>

              </div>



              {/* FEEDBACK */}

              <div className="lg-form-group">

                <label>

                  <MessageSquareText
                    size={14}
                  />

                  Lecturer Feedback

                </label>


                <textarea
                  rows="6"
                  placeholder="Write constructive feedback for the student..."
                  value={
                    selectedSubmission.feedback
                  }
                  onChange={(event) =>
                    updateSelectedSubmission(
                      "feedback",
                      event.target.value
                    )
                  }
                />

              </div>



              {/* ACTIONS */}

              <div className="lg-form-actions">

                <button className="lg-save-draft">

                  Save Draft

                </button>


                <button
                  className="lg-publish-button"
                  onClick={
                    handlePublishGrade
                  }
                >

                  {selectedSubmission.status ===
                  "Graded" ? (

                    <>
                      <CheckCircle2
                        size={15}
                      />

                      Update Grade
                    </>

                  ) : (

                    <>
                      <Send
                        size={15}
                      />

                      Publish Grade
                    </>

                  )}

                </button>

              </div>

            </div>

          </div>

        )}

      </section>

    </div>
  );
}


export default LecturerGrading;