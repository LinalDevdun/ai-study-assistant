import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ClipboardList,
  Search,
  Plus,
  Clock3,
  FileCheck2,
  CalendarDays,
  BookOpen,
  Users,
  Eye,
  Pencil,
  MoreVertical,
  X,
  FileText,
  Award,
} from "lucide-react";

import "../styles/lecturerAssignments.css";


function LecturerAssignments() {

const navigate =
  useNavigate();

const location =
  useLocation();

const [assignments, setAssignments] =
  useState([]);

const [courses, setCourses] =
  useState([]);

const [loading, setLoading] =
  useState(true);

const [error, setError] =
  useState("");

const [assignmentFile, setAssignmentFile] =
  useState(null);


  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [createOpen, setCreateOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
  useState(false);

const [selectedAssignment, setSelectedAssignment] =
  useState(null);

const [editOpen, setEditOpen] =
  useState(false);

const [updating, setUpdating] =
  useState(false);

const [editFile, setEditFile] =
  useState(null);

const [openMenuId, setOpenMenuId] =
  useState(null);

const [editingAssignment, setEditingAssignment] =
  useState({
    id: null,
    title: "",
    course: "",
    dueDate: "",
    marks: "",
    description: "",
    filePath: "",
  });


  const [newAssignment, setNewAssignment] =
    useState({
      title: "",
      course: "",
      dueDate: "",
      marks: "",
      description: "",
    });

    /* ========================================
   OPEN CREATE MODAL FROM TOPBAR
======================================== */

useEffect(() => {

  if (
    location.state?.openCreateAssignment
  ) {

    setCreateOpen(true);


    /*
      Clear the navigation state so
      refreshing does not reopen
      the modal automatically.
    */

    navigate(
      location.pathname,
      {
        replace: true,
        state: null,
      }
    );

  }

}, [
  location.state,
  location.pathname,
  navigate,
]);

    /* ========================================
   LOAD REAL LECTURER DATA
======================================== */

const loadLecturerData =
  async () => {

    try {

      setLoading(true);
      setError("");


      const token =
        localStorage.getItem("token");


      if (!token) {

        setError(
          "Please log in again."
        );

        return;

      }


      const config = {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      };


      const [
        meResponse,
        coursesResponse,
        assignmentsResponse,
      ] =
        await Promise.all([

          axios.get(
            "http://localhost:5000/me",
            config
          ),

          axios.get(
            "http://localhost:5000/courses",
            config
          ),

          axios.get(
            "http://localhost:5000/assignments",
            config
          ),

        ]);


      const lecturer =
        meResponse.data;


      const lecturerCourses =
        (
          Array.isArray(
            coursesResponse.data
          )
            ? coursesResponse.data
            : []
        ).filter(
          (course) =>
            Number(
              course.lecturer_id
            ) ===
            Number(
              lecturer.id
            )
        );


      setCourses(
        lecturerCourses
      );


      const lecturerAssignments =
        (
          Array.isArray(
            assignmentsResponse.data
          )
            ? assignmentsResponse.data
            : []
        )
          .filter(
            (assignment) =>
              Number(
                assignment.lecturer_id
              ) ===
              Number(
                lecturer.id
              )
          )
          .map(
            (assignment) => {

          const matchingCourse =
            lecturerCourses.find(
              (course) =>
                Number(course.id) ===
                Number(assignment.course_id)
            );


            return {
              
              
              id:
                assignment.id,

              title:
                assignment.title,

              courseId:
               assignment.course_id,

              course:
                matchingCourse?.title ||
                `${assignment.degree} - Batch ${assignment.batch}`,

              degree:
                assignment.degree,

              batch:
                assignment.batch,

              description:
                assignment.description || "",

              dueDate:
                assignment.due_date,

              submissions:
                Number(
                  assignment.submission_count || 0
                ),

              students:
                Number(
                  assignment.student_count || 0
                ),

              marks:
                Number(
                  assignment.max_marks ||
                  assignment.marks ||
                  100
                ),

              status:
                assignment.status ||
                "Published",

              filePath:
                assignment.file_path,

            };

            }
          );


      setAssignments(
        lecturerAssignments
      );


    } catch (error) {

      console.error(
        "Lecturer assignments error:",
        error
      );


      setError(
        error.response?.data?.error ||
        "Failed to load lecturer assignments."
      );


    } finally {

      setLoading(false);

    }

  };


useEffect(() => {

  loadLecturerData();

}, []);


  /* ========================================
     FILTER
  ======================================== */

  const filteredAssignments =
    useMemo(() => {

      return assignments.filter(
        (assignment) => {

          const search =
            searchTerm.toLowerCase();


          const matchesSearch =
            assignment.title
              .toLowerCase()
              .includes(search) ||

            assignment.course
              .toLowerCase()
              .includes(search);


          const matchesStatus =
            statusFilter === "All" ||
            assignment.status ===
              statusFilter;


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
    ]);


  /* ========================================
     COUNTS
  ======================================== */

  const publishedCount =
    assignments.filter(
      (assignment) =>
        assignment.status ===
        "Published"
    ).length;


  const draftCount =
    assignments.filter(
      (assignment) =>
        assignment.status ===
        "Draft"
    ).length;


  const submissionCount =
    assignments.reduce(
      (total, assignment) =>
        total +
        assignment.submissions,
      0
    );


  /* ========================================
     CREATE TEMP ASSIGNMENT
  ======================================== */

const handleCreateAssignment =
  async (event) => {

    event.preventDefault();

    try {

      setError("");


      /* ==============================
         CHECK REQUIRED FIELDS
      ============================== */

      if (
        !newAssignment.title ||
        !newAssignment.course ||
        !newAssignment.dueDate
      ) {

        setError(
          "Please complete all required fields."
        );

        return;

      }


      /* ==============================
         CHECK ASSIGNMENT FILE
      ============================== */

      if (!assignmentFile) {

        setError(
          "Please select an assignment brief file."
        );

        return;

      }


      /* ==============================
         FIND SELECTED REAL COURSE
      ============================== */

      const selectedCourse =
        courses.find(
          (course) =>
            String(course.id) ===
            String(
              newAssignment.course
            )
        );


      if (!selectedCourse) {

        setError(
          "Please select a valid course."
        );

        return;

      }


      /* ==============================
         GET LOGIN TOKEN
      ============================== */

      const token =
        localStorage.getItem("token");


      if (!token) {

        setError(
          "Please log in again."
        );

        return;

      }


      /* ==============================
         CREATE FORM DATA
      ============================== */

      const formData =
        new FormData();


      formData.append(
        "title",
        newAssignment.title
      );

      formData.append(
        "description",
        newAssignment.description
      );

      formData.append(
        "dueDate",
        newAssignment.dueDate
      );

      formData.append(
        "degree",
        selectedCourse.degree
      );

      formData.append(
        "batch",
        selectedCourse.batch
      );

      formData.append(
        "courseId",
        selectedCourse.id
      );

      formData.append(
        "maxMarks",
        newAssignment.marks || 100
      );

      formData.append(
        "file",
        assignmentFile
      );


      /* ==============================
         SAVE TO POSTGRESQL
      ============================== */

      const response =
        await axios.post(
          "http://localhost:5000/assignments",
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      console.log(
        "Assignment created:",
        response.data
      );


      /* ==============================
         RESET FORM
      ============================== */

      setNewAssignment({
        title: "",
        course: "",
        dueDate: "",
        marks: "",
        description: "",
      });


      setAssignmentFile(null);

      setCreateOpen(false);


      /* ==============================
         RELOAD FROM DATABASE
      ============================== */

      await loadLecturerData();


      alert(
        "Assignment published successfully!"
      );


    } catch (error) {

      console.error(
        "Create assignment error:",
        error
      );


      setError(
        error.response?.data?.error ||
        "Failed to create assignment."
      );

    }

  };


  /* ========================================
     DATE FORMAT
  ======================================== */

  const formatDate = (date) => {

    return new Date(
      date
    ).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );

  };

  /* ========================================
   VIEW ASSIGNMENT
======================================== */

const openViewModal = (assignment) => {

  setSelectedAssignment(
    assignment
  );

  setViewOpen(true);

};


const closeViewModal = () => {

  setViewOpen(false);

  setSelectedAssignment(null);

};


/* ========================================
   OPEN ASSIGNMENT FILE
======================================== */

const openAssignmentFile = () => {

  if (
    !selectedAssignment?.filePath
  ) {

    alert(
      "No assignment brief is available."
    );

    return;

  }


  const cleanPath =
    String(
      selectedAssignment.filePath
    )
      .replace(/\\/g, "/")
      .replace(
        /^.*?uploads\//,
        "uploads/"
      );


  window.open(
    `http://localhost:5000/${cleanPath}`,
    "_blank"
  );

};

/* ========================================
   EDIT ASSIGNMENT
======================================== */

const openEditModal = (
  assignment
) => {

  setError("");

  setEditFile(null);

  setEditingAssignment({

    id:
      assignment.id,

    title:
      assignment.title || "",

    course:
      assignment.courseId
        ? String(
            assignment.courseId
          )
        : "",

    dueDate:
      assignment.dueDate
        ? String(
            assignment.dueDate
          ).slice(0, 10)
        : "",

    marks:
      assignment.marks || 100,

    description:
      assignment.description || "",

    filePath:
      assignment.filePath || "",

  });


  setEditOpen(true);

};


const closeEditModal = () => {

  if (updating) {
    return;
  }


  setEditOpen(false);

  setEditFile(null);

  setEditingAssignment({
    id: null,
    title: "",
    course: "",
    dueDate: "",
    marks: "",
    description: "",
    filePath: "",
  });

};


/* ========================================
   UPDATE ASSIGNMENT
======================================== */

const handleUpdateAssignment =
  async (event) => {

    event.preventDefault();


    try {

      setUpdating(true);

      setError("");


      if (
        !editingAssignment.title ||
        !editingAssignment.course ||
        !editingAssignment.dueDate ||
        !editingAssignment.marks
      ) {

        setError(
          "Please complete all required fields."
        );

        return;

      }


      const token =
        localStorage.getItem(
          "token"
        );


      if (!token) {

        navigate("/login");

        return;

      }


      const formData =
        new FormData();


      formData.append(
        "title",
        editingAssignment.title
      );

      formData.append(
        "description",
        editingAssignment.description
      );

      formData.append(
        "dueDate",
        editingAssignment.dueDate
      );

      formData.append(
        "courseId",
        editingAssignment.course
      );

      formData.append(
        "maxMarks",
        editingAssignment.marks
      );


      if (editFile) {

        formData.append(
          "file",
          editFile
        );

      }


      const response =
        await axios.put(
          `http://localhost:5000/lecturer/assignments/${editingAssignment.id}`,
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      alert(
        response.data?.message ||
        "Assignment updated successfully!"
      );


      closeEditModal();

      await loadLecturerData();


    } catch (error) {

      console.error(
        "Update assignment error:",
        error
      );


      setError(
        error.response?.data?.error ||
        "Failed to update assignment."
      );


    } finally {

      setUpdating(false);

    }

  };

  /* ========================================
   DELETE ASSIGNMENT
======================================== */

const handleDeleteAssignment =
  async (assignment) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${assignment.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response =
        await axios.delete(
          `http://localhost:5000/lecturer/assignments/${assignment.id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      alert(
        response.data?.message ||
        "Assignment deleted successfully!"
      );

      setOpenMenuId(null);

      await loadLecturerData();

    } catch (error) {

      console.error(
        "Delete assignment error:",
        error
      );

      alert(
        error.response?.data?.error ||
        "Failed to delete assignment."
      );

    }

  };

  return (
    <div className="lecturer-assignments-page">


      {/* ====================================
          HEADER
      ==================================== */}

      <section className="la-header">

        <div>

          <h1>
            Assignments
          </h1>

          <p>
            Create coursework, manage
            deadlines and monitor student
            submissions.
          </p>

        </div>


        <button
          className="lecturer-primary-button"
          onClick={() =>
            setCreateOpen(true)
          }
        >

          <Plus size={16} />

          Create Assignment

        </button>

      </section>



      {/* ====================================
          SUMMARY
      ==================================== */}

      <section className="la-summary">


        <div className="la-summary-card la-purple">

          <div className="la-summary-icon">

            <ClipboardList
              size={21}
            />

          </div>

          <div>

            <strong>
              {assignments.length}
            </strong>

            <span>
              Total Assignments
            </span>

          </div>

        </div>


        <div className="la-summary-card la-blue">

          <div className="la-summary-icon">

            <FileCheck2
              size={21}
            />

          </div>

          <div>

            <strong>
              {publishedCount}
            </strong>

            <span>
              Published
            </span>

          </div>

        </div>


        <div className="la-summary-card la-orange">

          <div className="la-summary-icon">

            <Clock3
              size={21}
            />

          </div>

          <div>

            <strong>
              {draftCount}
            </strong>

            <span>
              Drafts
            </span>

          </div>

        </div>


        <div className="la-summary-card la-green">

          <div className="la-summary-icon">

            <Users
              size={21}
            />

          </div>

          <div>

            <strong>
              {submissionCount}
            </strong>

            <span>
              Submissions
            </span>

          </div>

        </div>

      </section>



      {/* ====================================
          TOOLBAR
      ==================================== */}

      <section className="la-toolbar">

        <div className="la-search">

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
          className="la-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >

          <option value="All">
            All Assignments
          </option>

          <option value="Published">
            Published
          </option>

          <option value="Draft">
            Drafts
          </option>

        </select>

      </section>



      {/* ====================================
          ASSIGNMENT LIST
      ==================================== */}

      <section className="la-list">

        {filteredAssignments.map(
          (assignment) => (

            <article
              className="la-assignment-card"
              key={assignment.id}
            >


              {/* LEFT */}

              <div className="la-assignment-icon">

                <ClipboardList
                  size={21}
                />

              </div>


              {/* CONTENT */}

              <div className="la-assignment-content">

                <div className="la-title-row">

                  <div>

                    <h3>
                      {assignment.title}
                    </h3>


                    <p className="la-course-name">

                      <BookOpen size={12} />

                      {assignment.course}

                    </p>

                  </div>


                  <span
                    className={
                      assignment.status ===
                      "Published"
                        ? "la-status la-status-published"
                        : "la-status la-status-draft"
                    }
                  >

                    {assignment.status}

                  </span>

                </div>


                <div className="la-meta">

                  <span>

                    <CalendarDays
                      size={13}
                    />

                    Due{" "}
                    {formatDate(
                      assignment.dueDate
                    )}

                  </span>


                  <span>

                    <Award
                      size={13}
                    />

                    {assignment.marks}
                    {" "}
                    Marks

                  </span>


                  <span>

                    <Users
                      size={13}
                    />

                    {assignment.submissions}
                    /
                    {assignment.students}
                    {" "}
                    Submitted

                  </span>

                </div>


                <div className="la-submission-progress">

                  <div className="la-progress-info">

                    <span>
                      Submission progress
                    </span>

                    <strong>

                      {assignment.students > 0
                        ? Math.round(
                            (
                              assignment.submissions /
                              assignment.students
                            ) *
                              100
                          )
                        : 0}
                      %

                    </strong>

                  </div>


                  <div className="la-progress-track">

                    <div
                      className="la-progress-fill"
                      style={{
                        width:
                          `${
                            assignment.students >
                            0
                              ? Math.round(
                                  (
                                    assignment.submissions /
                                    assignment.students
                                  ) *
                                    100
                                )
                              : 0
                          }%`,
                      }}
                    />

                  </div>

                </div>

              </div>



              {/* ACTIONS */}

              <div className="la-actions">

              <button
                className="la-review-button"
                type="button"
                onClick={() =>
                  openViewModal(
                    assignment
                  )
                }
              >

                <Eye size={14} />

                View

              </button>


              <button
                className="la-icon-button"
                type="button"
                title="Edit assignment"
                onClick={() =>
                  openEditModal(
                    assignment
                  )
                }
              >

                <Pencil size={14} />

              </button>


              <div className="la-more-wrapper">

                <button
                  className="la-icon-button"
                  type="button"
                  onClick={() =>
                    setOpenMenuId(
                      openMenuId === assignment.id
                        ? null
                        : assignment.id
                    )
                  }
                >

                  <MoreVertical size={15} />

                </button>


                {openMenuId === assignment.id && (

                  <div className="la-more-menu">

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteAssignment(
                          assignment
                        )
                      }
                    >
                      Delete Assignment
                    </button>

                  </div>

                )}

              </div>

              </div>

            </article>

          )
        )}

      </section>

      {/* ====================================
    VIEW ASSIGNMENT MODAL
==================================== */}

{viewOpen &&
  selectedAssignment && (

  <div className="lecturer-modal-overlay">

    <div className="la-modal">

      <div className="lecturer-modal-header">

        <div>

          <h2>
            Assignment Details
          </h2>

          <p>
            View the published assignment
            information.
          </p>

        </div>


        <button
          className="lecturer-modal-close"
          type="button"
          onClick={
            closeViewModal
          }
        >

          <X size={18} />

        </button>

      </div>


      <div className="la-view-details">

        <div className="la-view-title">

          <div className="la-assignment-icon">

            <ClipboardList
              size={22}
            />

          </div>

          <div>

            <h3>
              {
                selectedAssignment.title
              }
            </h3>

            <span>
              {
                selectedAssignment.course
              }
            </span>

          </div>

        </div>


        <div className="la-view-grid">

          <div>

            <span>
              Due Date
            </span>

            <strong>
              {formatDate(
                selectedAssignment.dueDate
              )}
            </strong>

          </div>


          <div>

            <span>
              Maximum Marks
            </span>

            <strong>
              {
                selectedAssignment.marks
              }
            </strong>

          </div>


          <div>

            <span>
              Degree
            </span>

            <strong>
              {
                selectedAssignment.degree ||
                "Not available"
              }
            </strong>

          </div>


          <div>

            <span>
              Batch
            </span>

            <strong>
              {
                selectedAssignment.batch ||
                "Not available"
              }
            </strong>

          </div>

        </div>


        <div className="la-view-section">

          <span>
            Assignment Instructions
          </span>

          <p>
            {
              selectedAssignment.description ||
              "No additional instructions were provided."
            }
          </p>

        </div>


        <div className="la-view-section">

          <span>
            Assignment Brief
          </span>


          {selectedAssignment.filePath ? (

            <button
              type="button"
              className="la-view-file-button"
              onClick={
                openAssignmentFile
              }
            >

              <FileText
                size={16}
              />

              Open Assignment Brief

            </button>

          ) : (

            <p>
              No assignment brief available.
            </p>

          )}

        </div>


        <div className="lecturer-modal-actions">

          <button
            type="button"
            className="lecturer-cancel-button"
            onClick={
              closeViewModal
            }
          >

            Close

          </button>

        </div>

      </div>

    </div>

  </div>

)}

{/* ====================================
    EDIT ASSIGNMENT MODAL
==================================== */}

{editOpen && (

  <div className="lecturer-modal-overlay">

    <div className="la-modal">

      <div className="lecturer-modal-header">

        <div>

          <h2>
            Edit Assignment
          </h2>

          <p>
            Update the assignment details.
          </p>

        </div>


        <button
          className="lecturer-modal-close"
          type="button"
          onClick={
            closeEditModal
          }
          disabled={
            updating
          }
        >

          <X size={18} />

        </button>

      </div>


      <form
        className="lecturer-course-form"
        onSubmit={
          handleUpdateAssignment
        }
      >

        {error && (

          <div
            style={{
              padding: "12px 14px",
              marginBottom: "16px",
              background: "#fff1f2",
              color: "#dc2626",
              borderRadius: "10px",
              fontSize: "13px",
            }}
          >
            {error}
          </div>

        )}


        <div className="lecturer-form-group">

          <label>
            Assignment Title
          </label>

          <input
            type="text"
            value={
              editingAssignment.title
            }
            onChange={(event) =>
              setEditingAssignment({
                ...editingAssignment,
                title:
                  event.target.value,
              })
            }
            required
          />

        </div>


        <div className="lecturer-form-group">

          <label>
            Course
          </label>

          <select
            value={
              editingAssignment.course
            }
            onChange={(event) =>
              setEditingAssignment({
                ...editingAssignment,
                course:
                  event.target.value,
              })
            }
            required
          >

            <option value="">
              Select course
            </option>


            {courses.map(
              (course) => (

                <option
                  key={course.id}
                  value={course.id}
                >

                  {course.title}
                  {" - "}
                  {course.degree}
                  {" - Batch "}
                  {course.batch}

                </option>

              )
            )}

          </select>

        </div>


        <div className="lecturer-form-row">

          <div className="lecturer-form-group">

            <label>
              Due Date
            </label>

            <input
              type="date"
              value={
                editingAssignment.dueDate
              }
              onChange={(event) =>
                setEditingAssignment({
                  ...editingAssignment,
                  dueDate:
                    event.target.value,
                })
              }
              required
            />

          </div>


          <div className="lecturer-form-group">

            <label>
              Maximum Marks
            </label>

            <input
              type="number"
              min="1"
              value={
                editingAssignment.marks
              }
              onChange={(event) =>
                setEditingAssignment({
                  ...editingAssignment,
                  marks:
                    event.target.value,
                })
              }
              required
            />

          </div>

        </div>


        <div className="lecturer-form-group">

          <label>
            Assignment Instructions
          </label>

          <textarea
            rows="4"
            value={
              editingAssignment.description
            }
            onChange={(event) =>
              setEditingAssignment({
                ...editingAssignment,
                description:
                  event.target.value,
              })
            }
          />

        </div>


        <div className="la-upload-placeholder">

          <FileText size={20} />

          <div
            style={{
              width: "100%",
            }}
          >

            <strong>
              Replace Assignment Brief
            </strong>

            <span>
              Optional — leave empty to keep
              the current file.
            </span>


            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              onChange={(event) =>
                setEditFile(
                  event.target.files?.[0] ||
                  null
                )
              }
              style={{
                display: "block",
                marginTop: "10px",
                width: "100%",
              }}
            />

          </div>

        </div>


        <div className="lecturer-modal-actions">

          <button
            type="button"
            className="lecturer-cancel-button"
            onClick={
              closeEditModal
            }
            disabled={
              updating
            }
          >

            Cancel

          </button>


          <button
            type="submit"
            className="lecturer-primary-button"
            disabled={
              updating
            }
          >

            <Pencil size={15} />

            {updating
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>

      </form>

    </div>

  </div>

)}

      {/* ====================================
          CREATE ASSIGNMENT MODAL
      ==================================== */}

      {createOpen && (

        <div className="lecturer-modal-overlay">

          <div className="la-modal">

            <div className="lecturer-modal-header">

              <div>

                <h2>
                  Create Assignment
                </h2>

                <p>
                  Create new coursework
                  for your students.
                </p>

              </div>


              <button
                className="lecturer-modal-close"
                onClick={() =>
                  setCreateOpen(false)
                }
              >

                <X size={18} />

              </button>

            </div>


            <form
              className="lecturer-course-form"
              onSubmit={
                handleCreateAssignment
              }
            >

            {error && (

              <div
                style={{
                  padding: "12px 14px",
                  marginBottom: "16px",
                  background: "#fff1f2",
                  color: "#dc2626",
                  borderRadius: "10px",
                  fontSize: "13px",
                }}
              >

                {error}

              </div>

            )}


              {/* TITLE */}

              <div className="lecturer-form-group">

                <label>
                  Assignment Title
                </label>

                <input
                  type="text"
                  placeholder="Example: Cloud Architecture Report"
                  value={
                    newAssignment.title
                  }
                  onChange={(event) =>
                    setNewAssignment({
                      ...newAssignment,
                      title:
                        event.target.value,
                    })
                  }
                />

              </div>



              {/* COURSE */}

              <div className="lecturer-form-group">

                <label>
                  Course
                </label>

                <select
                  value={
                    newAssignment.course
                  }
                  onChange={(event) =>
                    setNewAssignment({
                      ...newAssignment,
                      course:
                        event.target.value,
                    })
                  }
                >

                  <option value="">
                    Select course
                  </option>


                {courses.map(
                  (course) => (

                    <option
                      value={course.id}
                      key={course.id}
                    >
                      {course.title}
                      {" - "}
                      {course.degree}
                      {" - Batch "}
                      {course.batch}
                    </option>

                  )
                )}

                </select>

              </div>



              {/* DATE + MARKS */}

              <div className="lecturer-form-row">


                <div className="lecturer-form-group">

                  <label>
                    Due Date
                  </label>

                  <input
                    type="date"
                    value={
                      newAssignment.dueDate
                    }
                    onChange={(event) =>
                      setNewAssignment({
                        ...newAssignment,
                        dueDate:
                          event.target.value,
                      })
                    }
                  />

                </div>


                <div className="lecturer-form-group">

                  <label>
                    Maximum Marks
                  </label>

                  <input
                    type="number"
                    min="1"
                    placeholder="100"
                    value={
                      newAssignment.marks
                    }
                    onChange={(event) =>
                      setNewAssignment({
                        ...newAssignment,
                        marks:
                          event.target.value,
                      })
                    }
                  />

                </div>

              </div>



              {/* DESCRIPTION */}

              <div className="lecturer-form-group">

                <label>
                  Assignment Instructions
                </label>

                <textarea
                  rows="4"
                  placeholder="Describe the assignment requirements..."
                  value={
                    newAssignment.description
                  }
                  onChange={(event) =>
                    setNewAssignment({
                      ...newAssignment,
                      description:
                        event.target.value,
                    })
                  }
                />

              </div>



              {/* FILE */}

              <div className="la-upload-placeholder">

                <FileText size={20} />

                <div style={{ width: "100%" }}>

                  <strong>
                    Assignment Brief
                  </strong>

                  <span>
                    Upload the assignment
                    instructions or question paper.
                  </span>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    onChange={(event) =>
                      setAssignmentFile(
                        event.target.files?.[0] ||
                        null
                      )
                    }
                    required
                    style={{
                      display: "block",
                      marginTop: "10px",
                      width: "100%",
                    }}
                  />

                </div>

              </div>



              {/* BUTTONS */}

              <div className="lecturer-modal-actions">

                <button
                  type="button"
                  className="lecturer-cancel-button"
                  onClick={() =>
                    setCreateOpen(false)
                  }
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="lecturer-primary-button"
                >

                  <Plus size={15} />

                  Publish Assignment

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


export default LecturerAssignments;