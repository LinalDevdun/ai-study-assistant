import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ClipboardList,
  Search,
  Clock3,
  UploadCloud,
  FileText,
  CalendarDays,
  GraduationCap,
  CircleCheckBig,
  Send,
  RefreshCw,
  Award,
  Inbox,
} from "lucide-react";

import "../styles/assignments.css";


function Assignments() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [submittedAssignments, setSubmittedAssignments] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);


  /* ========================================
     FETCH ASSIGNMENTS
  ======================================== */

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/assignments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAssignments(
          Array.isArray(response.data)
            ? response.data
            : []
        );

      } catch (error) {

        console.error(
          "Error fetching assignments:",
          error
        );

      } finally {

        setLoading(false);

      }
    };


    fetchAssignments();

  }, [navigate]);


  /* ========================================
     FILE SELECTION
  ======================================== */

  const handleFileChange = (
    assignmentId,
    file
  ) => {

    if (!file) return;

    setSelectedFiles((previous) => ({
      ...previous,
      [assignmentId]: file,
    }));
  };


  /* ========================================
     SUBMIT / RESUBMIT
  ======================================== */

  const handleSubmit = async (
    assignmentId
  ) => {

    const file =
      selectedFiles[assignmentId];


    if (!file) {
      alert(
        "Please select a file to upload first."
      );

      return;
    }


    const formData = new FormData();

    formData.append(
      "assignmentId",
      assignmentId
    );

    formData.append(
      "file",
      file
    );


    try {

      const token =
        localStorage.getItem("token");


      const response =
        await axios.post(
          "http://localhost:5000/submissions",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",

              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      alert(response.data.message);


      setSubmittedAssignments(
        (previous) =>
          previous.includes(
            assignmentId
          )
            ? previous
            : [
                ...previous,
                assignmentId,
              ]
      );


    } catch (error) {

      console.error(
        "Error submitting assignment:",
        error
      );


      if (
        error.response &&
        error.response.data.error
      ) {

        alert(
          error.response.data.error
        );

      } else {

        alert(
          "Failed to submit assignment."
        );

      }
    }
  };


  /* ========================================
     DATE FORMAT
  ======================================== */

  const formatDueDate = (
    dateString
  ) => {

    if (!dateString) {
      return "No due date";
    }


    return new Date(
      dateString
    ).toLocaleString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  /* ========================================
     STATUS HELPERS
  ======================================== */

  const getAssignmentStatus = (
    assignment
  ) => {

    if (assignment.is_graded) {
      return "graded";
    }


    if (
      assignment.is_submitted ||
      submittedAssignments.includes(
        assignment.id
      )
    ) {
      return "submitted";
    }


    return "pending";
  };


  /* ========================================
     COUNTS
  ======================================== */

  const totalAssignments =
    assignments.length;


  const pendingCount =
    assignments.filter(
      (assignment) =>
        getAssignmentStatus(
          assignment
        ) === "pending"
    ).length;


  const submittedCount =
    assignments.filter(
      (assignment) =>
        getAssignmentStatus(
          assignment
        ) === "submitted"
    ).length;


  const gradedCount =
    assignments.filter(
      (assignment) =>
        getAssignmentStatus(
          assignment
        ) === "graded"
    ).length;


  /* ========================================
     SEARCH + FILTER
  ======================================== */

  const filteredAssignments =
    useMemo(() => {

      return assignments.filter(
        (assignment) => {

          const search =
            searchTerm.toLowerCase();


          const matchesSearch =
            assignment.title
              ?.toLowerCase()
              .includes(search) ||

            assignment.description
              ?.toLowerCase()
              .includes(search) ||

            assignment.degree
              ?.toLowerCase()
              .includes(search);


          const status =
            getAssignmentStatus(
              assignment
            );


          const matchesStatus =
            statusFilter === "all" ||
            status === statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );

    }, [
      assignments,
      searchTerm,
      statusFilter,
      submittedAssignments,
    ]);


  return (
    <div className="assignments-page">

      {/* ====================================
          HEADER
      ==================================== */}

      <section className="assignments-header">

        <div>

          <h1>
            Assignments
          </h1>

          <p>
            Review your coursework,
            submit files and track your
            assignment status.
          </p>

        </div>


        <div className="assignments-header-badge">

          <ClipboardList size={16} />

          {totalAssignments} Assignments

        </div>

      </section>


      {/* ====================================
          SUMMARY
      ==================================== */}

      <section className="assignments-summary">

        <div className="assignment-summary-card summary-assignment-purple">

          <div className="assignment-summary-icon">
            <ClipboardList size={21} />
          </div>

          <div>
            <strong>
              {totalAssignments}
            </strong>

            <span>
              Total Assignments
            </span>
          </div>

        </div>


        <div className="assignment-summary-card summary-assignment-orange">

          <div className="assignment-summary-icon">
            <Clock3 size={21} />
          </div>

          <div>
            <strong>
              {pendingCount}
            </strong>

            <span>
              Pending
            </span>
          </div>

        </div>


        <div className="assignment-summary-card summary-assignment-blue">

          <div className="assignment-summary-icon">
            <Send size={21} />
          </div>

          <div>
            <strong>
              {submittedCount}
            </strong>

            <span>
              Submitted
            </span>
          </div>

        </div>


        <div className="assignment-summary-card summary-assignment-green">

          <div className="assignment-summary-icon">
            <Award size={21} />
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

      </section>


      {/* ====================================
          SEARCH + FILTER
      ==================================== */}

      <section className="assignments-toolbar">

        <div className="assignments-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>


        <select
          className="assignments-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >

          <option value="all">
            All Assignments
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="submitted">
            Submitted
          </option>

          <option value="graded">
            Graded
          </option>

        </select>

      </section>


      {/* ====================================
          ASSIGNMENT LIST
      ==================================== */}

      <section className="assignments-list">

        {loading ? (

          <div className="assignments-empty">

            <div className="assignments-empty-icon">
              <ClipboardList size={26} />
            </div>

            <h3>
              Loading assignments...
            </h3>

            <p>
              Please wait a moment.
            </p>

          </div>

        ) : filteredAssignments.length === 0 ? (

          <div className="assignments-empty">

            <div className="assignments-empty-icon">
              <Inbox size={27} />
            </div>

            <h3>
              No assignments found
            </h3>

            <p>
              You're all caught up or
              there are no assignments
              matching this filter.
            </p>

          </div>

        ) : (

          filteredAssignments.map(
            (assignment) => {

              const status =
                getAssignmentStatus(
                  assignment
                );


              const selectedFile =
                selectedFiles[
                  assignment.id
                ];


              const briefUrl =
                assignment.file_path
                  ? `http://localhost:5000/${assignment.file_path.replace(
                      /\\/g,
                      "/"
                    )}`
                  : null;


              return (
                <article
                  className="assignment-card"
                  key={assignment.id}
                >

                  {/* LEFT */}
                  <div className="assignment-main">

                    <div className="assignment-title-row">

                      <div className="assignment-card-icon">
                        <ClipboardList
                          size={20}
                        />
                      </div>


                      <div className="assignment-title-content">

                        <h3>
                          {assignment.title}
                        </h3>


                        <span
                          className={`assignment-status assignment-status-${status}`}
                        >

                          {status ===
                            "graded" && (
                            <CircleCheckBig
                              size={12}
                            />
                          )}

                          {status ===
                            "submitted" && (
                            <Send
                              size={12}
                            />
                          )}

                          {status ===
                            "pending" && (
                            <Clock3
                              size={12}
                            />
                          )}


                          {status ===
                            "graded"
                            ? "Graded"
                            : status ===
                                "submitted"
                              ? "Submitted"
                              : "Pending"}

                        </span>

                      </div>

                    </div>


                    <p className="assignment-description">

                      {assignment.description ||
                        "No assignment description has been added."}

                    </p>


                    <div className="assignment-meta">

                      <span className="assignment-meta-item assignment-meta-due">

                        <CalendarDays
                          size={12}
                        />

                        Due:{" "}
                        {formatDueDate(
                          assignment.due_date
                        )}

                      </span>


                      {assignment.degree && (
                        <span className="assignment-meta-item">

                          <GraduationCap
                            size={12}
                          />

                          {assignment.degree}

                        </span>
                      )}


                      {assignment.batch && (
                        <span className="assignment-meta-item">

                          Batch{" "}
                          {assignment.batch}

                        </span>
                      )}

                    </div>

                  </div>


                  {/* RIGHT */}
                  <div className="assignment-actions">

                    {briefUrl && (

                      <a
                        href={briefUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration:
                            "none",
                        }}
                      >

                        <button className="assignment-brief-button">

                          <FileText
                            size={14}
                          />

                          Open Assignment Brief

                        </button>

                      </a>

                    )}


                    {status === "graded" ? (

                      <div className="assignment-graded-box">

                        <strong>
                          Graded & Locked
                        </strong>

                        <span>
                          Check your Grades page
                          for results and feedback.
                        </span>

                      </div>

                    ) : (

                      <>

                        <div className="assignment-upload-box">

                          <label
                            className="assignment-file-label"
                            htmlFor={`assignment-file-${assignment.id}`}
                          >

                            <UploadCloud
                              size={15}
                            />

                            {selectedFile
                              ? "Change file"
                              : "Choose submission file"}

                          </label>


                          <input
                            id={`assignment-file-${assignment.id}`}
                            className="assignment-file-input"
                            type="file"
                            onChange={(
                              event
                            ) =>
                              handleFileChange(
                                assignment.id,
                                event
                                  .target
                                  .files[0]
                              )
                            }
                          />


                          {selectedFile && (

                            <p className="assignment-selected-file">

                              Selected:{" "}
                              {selectedFile.name}

                            </p>

                          )}

                        </div>


                        <button
                          className={`assignment-submit-button ${
                            status ===
                            "submitted"
                              ? "assignment-resubmit-button"
                              : ""
                          }`}
                          onClick={() =>
                            handleSubmit(
                              assignment.id
                            )
                          }
                        >

                          {status ===
                          "submitted" ? (

                            <>
                              <RefreshCw
                                size={14}
                              />

                              Resubmit Work
                            </>

                          ) : (

                            <>
                              <UploadCloud
                                size={14}
                              />

                              Upload & Submit
                            </>

                          )}

                        </button>

                      </>

                    )}

                  </div>

                </article>
              );
            }
          )

        )}

      </section>

    </div>
  );
}

export default Assignments;