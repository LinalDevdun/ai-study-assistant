import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  GraduationCap,
  Search,
  Clock3,
  CircleCheckBig,
  FileText,
  BookOpen,
  Award,
  MessageSquareText,
  Send,
  CheckCircle2,
  Eye,
} from "lucide-react";

import "../styles/lecturerGrading.css";


function LecturerGrading() {

  const navigate =
    useNavigate();

  const location =
    useLocation();


  /* ========================================
     STATE
  ======================================== */

  const [submissions, setSubmissions] =
    useState([]);

  const [selectedId, setSelectedId] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [publishing, setPublishing] =
    useState(false);


  /* ========================================
     INITIALS
  ======================================== */

  const getInitials = (name) => {

    if (!name) {
      return "ST";
    }


    return name
      .split(" ")
      .filter(Boolean)
      .map(
        (word) =>
          word.charAt(0)
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();

  };


  /* ========================================
     FILE NAME
  ======================================== */

  const getFileName = (
    filePath
  ) => {

    if (!filePath) {
      return "Submission file";
    }


    return String(filePath)
      .replace(/\\/g, "/")
      .split("/")
      .pop();

  };


  /* ========================================
     FORMAT SUBMISSION
  ======================================== */

  const formatSubmission = (
    submission
  ) => {

    const draftKey =
      `lecturerGradingDraft_${submission.submission_id}`;


    let savedDraft = null;


    try {

      const draft =
        localStorage.getItem(
          draftKey
        );


      if (draft) {

        savedDraft =
          JSON.parse(draft);

      }

    } catch {

      savedDraft = null;

    }


    const isGraded =
      submission.grade !== null &&
      submission.grade !== undefined &&
      submission.grade !== "";


    return {

      id:
        submission.submission_id,

      student:
        submission.student_name ||
        "Student",

      studentId:
        submission.student_id,

      studentEmail:
        submission.student_email ||
        "",

      initials:
        getInitials(
          submission.student_name
        ),

      assignment:
        submission.assignment_title ||
        "Assignment",

      program:
        submission.degree ||
        "No degree",

      batch:
        submission.batch ||
        "No batch",

      fileName:
        getFileName(
          submission.file_path
        ),

      filePath:
        submission.file_path,

      maxMarks:
        Number(
          submission.max_marks ||
          100
        ),

      status:
        isGraded
          ? "Graded"
          : "To Grade",

      marks:
        isGraded
          ? (
              submission
                .marks_awarded ??
              ""
            )
          : (
              savedDraft?.marks ??
              submission
                .marks_awarded ??
              ""
            ),

      feedback:
        isGraded
          ? (
              submission.feedback ||
              ""
            )
          : (
              savedDraft?.feedback ??
              submission.feedback ??
              ""
            ),

      grade:
        submission.grade ||
        "",

      submittedAt:
        submission.submitted_at,

    };

  };


  /* ========================================
     LOAD REAL SUBMISSIONS
  ======================================== */

  const loadSubmissions =
    async (
      preferredSubmissionId = null
    ) => {

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
            "http://localhost:5000/lecturer/submissions",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const realData =
          Array.isArray(
            response.data?.submissions
          )
            ? response.data.submissions
            : [];


        const formatted =
          realData.map(
            formatSubmission
          );


        setSubmissions(
          formatted
        );


        /* ==================================
           SELECT CORRECT SUBMISSION
        ================================== */

        const requestedId =
          Number(
            preferredSubmissionId
          );


        const requestedExists =
          formatted.some(
            (submission) =>
              submission.id ===
              requestedId
          );


        if (
          requestedId &&
          requestedExists
        ) {

          setSelectedId(
            requestedId
          );

        } else {

          const firstPending =
            formatted.find(
              (submission) =>
                submission.status ===
                "To Grade"
            );


          setSelectedId(
            firstPending?.id ||
            formatted[0]?.id ||
            null
          );

        }


      } catch (loadError) {

        console.error(
          "Failed to load grading data:",
          loadError
        );


        if (
          loadError.response?.status ===
            401 ||
          loadError.response?.status ===
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
          loadError.response?.data
            ?.error ||
          "Failed to load grading submissions."
        );


      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    loadSubmissions(
      location.state
        ?.submissionId ||
        null
    );

  }, []);


  /* ========================================
     CURRENT SUBMISSION
  ======================================== */

  const selectedSubmission =
    submissions.find(
      (submission) =>
        submission.id ===
        selectedId
    );


  /* ========================================
     FILTER QUEUE
  ======================================== */

  const filteredSubmissions =
    useMemo(() => {

      const search =
        searchTerm
          .trim()
          .toLowerCase();


      return submissions.filter(
        (submission) => {

          const combined =
            `
            ${submission.student}
            ${submission.assignment}
            ${submission.program}
            ${submission.batch}
            `
              .toLowerCase();


          return combined.includes(
            search
          );

        }
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
      selectedSubmission
        .maxMarks === 0
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

    if (
      percentageValue >= 80
    ) {
      return "A";
    }


    if (
      percentageValue >= 70
    ) {
      return "B";
    }


    if (
      percentageValue >= 60
    ) {
      return "C";
    }


    if (
      percentageValue >= 50
    ) {
      return "D";
    }


    return "F";

  };


  const grade =
    selectedSubmission?.marks === ""
      ? "—"
      : getGrade(
          percentage
        );


  /* ========================================
     FILE URL
  ======================================== */

  const getFileUrl = (
    filePath
  ) => {

    if (!filePath) {
      return "";
    }


    const normalized =
      String(filePath)
        .replace(/\\/g, "/");


    const uploadsIndex =
      normalized
        .toLowerCase()
        .lastIndexOf(
          "/uploads/"
        );


    let relativePath;


    if (
      uploadsIndex !== -1
    ) {

      relativePath =
        normalized.slice(
          uploadsIndex + 1
        );

    } else if (
      normalized
        .toLowerCase()
        .startsWith(
          "uploads/"
        )
    ) {

      relativePath =
        normalized;

    } else {

      const fileName =
        normalized
          .split("/")
          .pop();


      relativePath =
        `uploads/${fileName}`;

    }


    return (
      `http://localhost:5000/${relativePath}`
    );

  };


  /* ========================================
     OPEN SUBMISSION FILE
  ======================================== */

  const handleOpenFile = () => {

    if (
      !selectedSubmission
        ?.filePath
    ) {

      alert(
        "No submission file is available."
      );

      return;

    }


    const fileUrl =
      getFileUrl(
        selectedSubmission
          .filePath
      );


    window.open(
      fileUrl,
      "_blank",
      "noopener,noreferrer"
    );

  };


  /* ========================================
     SAVE DRAFT LOCALLY
  ======================================== */

  const handleSaveDraft = () => {

    if (!selectedSubmission) {
      return;
    }


    const draftKey =
      `lecturerGradingDraft_${selectedSubmission.id}`;


    localStorage.setItem(
      draftKey,
      JSON.stringify({
        marks:
          selectedSubmission.marks,

        feedback:
          selectedSubmission.feedback,
      })
    );


    alert(
      "Draft saved on this device."
    );

  };


  /* ========================================
     PUBLISH GRADE
  ======================================== */

  const handlePublishGrade =
    async () => {

      if (!selectedSubmission) {
        return;
      }


      const marks =
        Number(
          selectedSubmission.marks
        );


      if (
        selectedSubmission.marks ===
          "" ||
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
          selectedSubmission
            .maxMarks
      ) {

        alert(
          `Marks must be between 0 and ${selectedSubmission.maxMarks}.`
        );

        return;

      }


      try {

        setPublishing(true);


        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {

          navigate("/login");

          return;

        }


        const response =
          await axios.put(
            `http://localhost:5000/submissions/${selectedSubmission.id}/grade`,
            {
              marks_awarded:
                marks,

              feedback:
                selectedSubmission
                  .feedback
                  .trim(),
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        localStorage.removeItem(
          `lecturerGradingDraft_${selectedSubmission.id}`
        );


        alert(
          response.data?.message ||
          "Grade published successfully! 🎓"
        );


        /*
          Reload from PostgreSQL so
          the UI reflects database truth.
        */

        await loadSubmissions(
          selectedSubmission.id
        );


      } catch (publishError) {

        console.error(
          "Publish grade error:",
          publishError
        );


        if (
          publishError.response
            ?.status === 401 ||
          publishError.response
            ?.status === 403
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


        alert(
          publishError.response
            ?.data?.error ||
          "Failed to publish grade."
        );


      } finally {

        setPublishing(false);

      }

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

          {toGradeCount}{" "}
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
              {loading
                ? "..."
                : toGradeCount}
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
              {loading
                ? "..."
                : gradedCount}
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
              {loading
                ? "..."
                : submissions.length}
            </strong>

            <span>
              Total Submissions
            </span>

          </div>

        </div>

      </section>


      {/* ====================================
          ERROR
      ==================================== */}

      {error && (

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

          {error}

        </div>

      )}


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


            {loading && (

              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  fontSize: "13px",
                }}
              >

                Loading submissions...

              </div>

            )}


            {!loading &&
              filteredSubmissions.map(
                (submission) => (

                  <button
                    key={
                      submission.id
                    }
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
                        submission
                          .initials
                      }

                    </div>


                    <div className="lg-queue-info">

                      <strong>

                        {
                          submission
                            .student
                        }

                      </strong>

                      <span>

                        {
                          submission
                            .assignment
                        }

                      </span>

                      <small>

                        {
                          submission
                            .program
                        }

                        {" • "}

                        Batch{" "}
                        {
                          submission
                            .batch
                        }

                      </small>

                    </div>


                    <div
                      className={
                        submission
                          .status ===
                        "Graded"
                          ? "lg-small-status lg-small-status-graded"
                          : "lg-small-status lg-small-status-pending"
                      }
                    >

                      {submission
                        .status ===
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


            {!loading &&
              filteredSubmissions.length ===
                0 && (

              <div
                style={{
                  padding: "24px 16px",
                  textAlign: "center",
                  fontSize: "13px",
                }}
              >

                No submissions found.

              </div>

            )}

          </div>

        </aside>


        {/* ==================================
            RIGHT GRADING AREA
        ================================== */}

        {selectedSubmission ? (

          <div className="lg-grading-panel">


            {/* STUDENT HEADER */}

            <div className="lg-student-header">

              <div className="lg-student-profile">

                <div className="lg-large-avatar">

                  {
                    selectedSubmission
                      .initials
                  }

                </div>


                <div>

                  <h2>

                    {
                      selectedSubmission
                        .student
                    }

                  </h2>

                  <p>

                    Student ID{" "}

                    {
                      selectedSubmission
                        .studentId
                    }

                  </p>

                </div>

              </div>


              <span
                className={
                  selectedSubmission
                    .status ===
                  "Graded"
                    ? "lg-status lg-status-graded"
                    : "lg-status lg-status-pending"
                }
              >

                {
                  selectedSubmission
                    .status
                }

              </span>

            </div>


            {/* INFORMATION */}

            <div className="lg-info-grid">


              <div className="lg-info-card">

                <BookOpen
                  size={18}
                />

                <div>

                  <span>
                    Program / Batch
                  </span>

                  <strong>

                    {
                      selectedSubmission
                        .program
                    }

                    {" • "}

                    Batch{" "}

                    {
                      selectedSubmission
                        .batch
                    }

                  </strong>

                </div>

              </div>


              <div className="lg-info-card">

                <FileText
                  size={18}
                />

                <div>

                  <span>
                    Assignment
                  </span>

                  <strong>

                    {
                      selectedSubmission
                        .assignment
                    }

                  </strong>

                </div>

              </div>


              <div className="lg-info-card">

                <Award
                  size={18}
                />

                <div>

                  <span>
                    Maximum Marks
                  </span>

                  <strong>

                    {
                      selectedSubmission
                        .maxMarks
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
                    selectedSubmission
                      .fileName
                  }

                </strong>

                <span>
                  Student submission
                </span>

              </div>


              <button
                type="button"
                onClick={
                  handleOpenFile
                }
              >

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
                        selectedSubmission
                          .maxMarks
                      }
                      value={
                        selectedSubmission
                          .marks
                      }
                      onChange={(event) =>
                        updateSelectedSubmission(
                          "marks",
                          event.target
                            .value
                        )
                      }
                    />

                    <span>

                      /{" "}

                      {
                        selectedSubmission
                          .maxMarks
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
                    selectedSubmission
                      .feedback
                  }
                  onChange={(event) =>
                    updateSelectedSubmission(
                      "feedback",
                      event.target
                        .value
                    )
                  }
                />

              </div>


              {/* ACTIONS */}

              <div className="lg-form-actions">

                <button
                  type="button"
                  className="lg-save-draft"
                  onClick={
                    handleSaveDraft
                  }
                  disabled={
                    publishing
                  }
                >

                  Save Draft

                </button>


                <button
                  type="button"
                  className="lg-publish-button"
                  onClick={
                    handlePublishGrade
                  }
                  disabled={
                    publishing
                  }
                >

                  {publishing ? (

                    <>
                      Publishing...
                    </>

                  ) : selectedSubmission
                      .status ===
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

        ) : (

          <div
            className="lg-grading-panel"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "420px",
              textAlign: "center",
            }}
          >

            <div>

              <GraduationCap
                size={34}
              />

              <h3>
                No submission selected
              </h3>

              <p>
                Select a submission from
                the grading queue.
              </p>

            </div>

          </div>

        )}

      </section>

    </div>

  );

}


export default LecturerGrading;