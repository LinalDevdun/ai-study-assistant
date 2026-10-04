import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

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
} from "lucide-react";

import "../styles/lecturerSubmissions.css";


function LecturerSubmissions() {

  const navigate = useNavigate();


  /* ========================================
     STATE
  ======================================== */

  const [submissions, setSubmissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [
    selectedSubmission,
    setSelectedSubmission,
  ] = useState(null);


  /* ========================================
     LOAD REAL SUBMISSIONS
  ======================================== */

  useEffect(() => {

    const loadSubmissions = async () => {

      try {

        setLoading(true);
        setError("");


        const token =
          localStorage.getItem("token");


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


        const realSubmissions =
          Array.isArray(
            response.data?.submissions
          )
            ? response.data.submissions
            : [];


        setSubmissions(
          realSubmissions
        );


      } catch (loadError) {

        console.error(
          "Failed to load lecturer submissions:",
          loadError
        );


        if (
          loadError.response?.status === 401 ||
          loadError.response?.status === 403
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
          loadError.response?.data?.error ||
          "Failed to load submissions."
        );


      } finally {

        setLoading(false);

      }

    };


    loadSubmissions();

  }, [navigate]);


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
     COUNTS
  ======================================== */

  const totalSubmissions =
    submissions.length;


  const toGradeCount =
    submissions.filter(
      (submission) =>
        submission.grade === null ||
        submission.grade === undefined ||
        submission.grade === ""
    ).length;


  const gradedCount =
    submissions.filter(
      (submission) =>
        submission.grade !== null &&
        submission.grade !== undefined &&
        submission.grade !== ""
    ).length;


  const uniqueStudents =
    new Set(
      submissions.map(
        (submission) =>
          submission.student_id
      )
    ).size;


  /* ========================================
     FILTER
  ======================================== */

  const filteredSubmissions =
    useMemo(() => {

      const search =
        searchTerm
          .trim()
          .toLowerCase();


      return submissions.filter(
        (submission) => {

          const studentName =
            submission.student_name ||
            "";

          const assignmentTitle =
            submission.assignment_title ||
            "";

          const degree =
            submission.degree ||
            "";

          const batch =
            submission.batch ||
            "";

          const studentEmail =
            submission.student_email ||
            "";


          const matchesSearch =

            studentName
              .toLowerCase()
              .includes(search) ||

            assignmentTitle
              .toLowerCase()
              .includes(search) ||

            degree
              .toLowerCase()
              .includes(search) ||

            batch
              .toLowerCase()
              .includes(search) ||

            studentEmail
              .toLowerCase()
              .includes(search);


          const currentStatus =
            submission.grade !== null &&
            submission.grade !== undefined &&
            submission.grade !== ""
              ? "Graded"
              : "To Grade";


          const matchesStatus =

            statusFilter === "All" ||

            currentStatus ===
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

    if (!date) {
      return "—";
    }


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
        .startsWith("uploads/")
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
     DOWNLOAD / OPEN FILE
  ======================================== */

  const handleOpenFile = (
    submission
  ) => {

    const fileUrl =
      getFileUrl(
        submission.file_path
      );


    if (!fileUrl) {

      alert(
        "No submission file is available."
      );

      return;

    }


    window.open(
      fileUrl,
      "_blank",
      "noopener,noreferrer"
    );

  };


  /* ========================================
     GO TO GRADING PAGE
  ======================================== */

  const handleGradeSubmission =
    (submission) => {

      navigate(
        "/lecturer/grading",
        {
          state: {
            submissionId:
              submission
                .submission_id,
          },
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
            placeholder="Search student, assignment or program..."
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
          LOADING
      ==================================== */}

      {loading && (

        <section className="ls-table-container">

          <div className="ls-empty">

            <FileCheck2 size={28} />

            <h3>
              Loading submissions...
            </h3>

            <p>
              Please wait while your
              submissions are loaded.
            </p>

          </div>

        </section>

      )}



      {/* ====================================
          ERROR
      ==================================== */}

      {!loading && error && (

        <section className="ls-table-container">

          <div className="ls-empty">

            <FileCheck2 size={28} />

            <h3>
              Unable to load submissions
            </h3>

            <p>
              {error}
            </p>

          </div>

        </section>

      )}



      {/* ====================================
          TABLE
      ==================================== */}

      {!loading && !error && (

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
                  Program / Batch
                </th>

                <th>
                  Submitted
                </th>

                <th>
                  Status
                </th>

                <th>
                  Grade
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredSubmissions.map(
                (submission) => {

                  const isGraded =

                    submission.grade !==
                      null &&

                    submission.grade !==
                      undefined &&

                    submission.grade !==
                      "";


                  return (

                    <tr
                      key={
                        submission
                          .submission_id
                      }
                    >


                      {/* STUDENT */}

                      <td>

                        <div className="ls-student">

                          <div className="ls-student-avatar">

                            {getInitials(
                              submission
                                .student_name
                            )}

                          </div>


                          <div>

                            <strong>

                              {
                                submission
                                  .student_name
                              }

                            </strong>

                            <span>

                              Student ID{" "}
                              {
                                submission
                                  .student_id
                              }

                            </span>

                          </div>

                        </div>

                      </td>



                      {/* ASSIGNMENT */}

                      <td className="ls-primary-text">

                        {
                          submission
                            .assignment_title
                        }

                      </td>



                      {/* PROGRAM / BATCH */}

                      <td>

                        <div className="ls-course">

                          <BookOpen
                            size={12}
                          />

                          {
                            submission.degree ||
                            "No degree"
                          }

                          {" • "}

                          {
                            submission.batch ||
                            "No batch"
                          }

                        </div>

                      </td>



                      {/* DATE */}

                      <td>

                        <div className="ls-date">

                          <CalendarDays
                            size={12}
                          />

                          {formatDate(
                            submission
                              .submitted_at
                          )}

                        </div>

                      </td>



                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            isGraded
                              ? "ls-status ls-status-graded"
                              : "ls-status ls-status-pending"
                          }
                        >

                          {isGraded ? (

                            <CircleCheckBig
                              size={11}
                            />

                          ) : (

                            <Clock3
                              size={11}
                            />

                          )}


                          {isGraded
                            ? "Graded"
                            : "To Grade"}

                        </span>

                      </td>



                      {/* GRADE */}

                      <td>

                        {isGraded ? (

                          <strong className="ls-mark">

                            {
                              submission
                                .grade
                            }

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

                  );

                }
              )}

            </tbody>

          </table>


          {filteredSubmissions.length ===
            0 && (

            <div className="ls-empty">

              <FileCheck2
                size={28}
              />

              <h3>
                No submissions found
              </h3>

              <p>
                There are no submissions
                matching your current
                search or filter.
              </p>

            </div>

          )}

        </section>

      )}



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
                  real submission
                  information.
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

                {getInitials(
                  selectedSubmission
                    .student_name
                )}

              </div>


              <div>

                <h3>

                  {
                    selectedSubmission
                      .student_name
                  }

                </h3>

                <p>

                  {
                    selectedSubmission
                      .student_email ||
                    `Student ID ${selectedSubmission.student_id}`
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
                    Program / Batch
                  </span>

                  <strong>

                    {
                      selectedSubmission
                        .degree ||
                      "No degree"
                    }

                    {" • "}

                    {
                      selectedSubmission
                        .batch ||
                      "No batch"
                    }

                  </strong>

                </div>

              </div>



              <div className="ls-review-info">

                <FileCheck2 size={17} />

                <div>

                  <span>
                    Assignment
                  </span>

                  <strong>

                    {
                      selectedSubmission
                        .assignment_title
                    }

                  </strong>

                </div>

              </div>



              <div className="ls-review-info">

                <CalendarDays
                  size={17}
                />

                <div>

                  <span>
                    Submitted
                  </span>

                  <strong>

                    {formatDate(
                      selectedSubmission
                        .submitted_at
                    )}

                  </strong>

                </div>

              </div>



              <div className="ls-review-info">

                <Award size={17} />

                <div>

                  <span>
                    Grade
                  </span>

                  <strong>

                    {
                      selectedSubmission
                        .grade ||
                      "Not graded yet"
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

                  {getFileName(
                    selectedSubmission
                      .file_path
                  )}

                </strong>

                <span>
                  Student submission file
                </span>

              </div>


              <button
                onClick={() =>
                  handleOpenFile(
                    selectedSubmission
                  )
                }
              >

                <Download size={15} />

                Open File

              </button>

            </div>



            {/* CURRENT RESULT */}

            {selectedSubmission.grade !==
              null &&

              selectedSubmission.grade !==
                undefined &&

              selectedSubmission.grade !==
                "" && (

              <div className="ls-result-box">

                <CircleCheckBig
                  size={20}
                />

                <div>

                  <strong>
                    Already Graded
                  </strong>

                  <span>

                    Result:{" "}

                    {
                      selectedSubmission
                        .grade
                    }

                    {selectedSubmission
                      .feedback && (

                      <>
                        {" • "}
                        {
                          selectedSubmission
                            .feedback
                        }
                      </>

                    )}

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


              <button
                className="lecturer-primary-button"
                onClick={() =>
                  handleGradeSubmission(
                    selectedSubmission
                  )
                }
              >

                <GraduationCap
                  size={15}
                />

                {selectedSubmission
                  .grade !== null &&
                selectedSubmission
                  .grade !== undefined &&
                selectedSubmission
                  .grade !== ""
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


export default LecturerSubmissions;