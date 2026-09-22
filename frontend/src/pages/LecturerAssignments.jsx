import { useMemo, useState } from "react";

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

  /*
    Temporary frontend data.

    Later this will come from PostgreSQL.
  */

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "Software Design Report",
      course: "Software Engineering",
      dueDate: "2026-09-28",
      submissions: 34,
      students: 42,
      marks: 100,
      status: "Published",
    },
    {
      id: 2,
      title: "Database Normalization Exercise",
      course: "Database Systems",
      dueDate: "2026-09-30",
      submissions: 29,
      students: 36,
      marks: 50,
      status: "Published",
    },
    {
      id: 3,
      title: "Responsive React Interface",
      course: "Web Development",
      dueDate: "2026-10-04",
      submissions: 20,
      students: 38,
      marks: 100,
      status: "Published",
    },
    {
      id: 4,
      title: "Machine Learning Model Evaluation",
      course: "Artificial Intelligence",
      dueDate: "2026-10-08",
      submissions: 0,
      students: 32,
      marks: 100,
      status: "Draft",
    },
  ]);


  const courses = [
    "Software Engineering",
    "Database Systems",
    "Web Development",
    "Artificial Intelligence",
  ];


  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [createOpen, setCreateOpen] =
    useState(false);


  const [newAssignment, setNewAssignment] =
    useState({
      title: "",
      course: "",
      dueDate: "",
      marks: "",
      description: "",
    });


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

  const handleCreateAssignment = (
    event
  ) => {

    event.preventDefault();


    if (
      !newAssignment.title ||
      !newAssignment.course ||
      !newAssignment.dueDate
    ) {
      return;
    }


    const selectedCourse =
      assignments.find(
        (assignment) =>
          assignment.course ===
          newAssignment.course
      );


    const createdAssignment = {
      id: Date.now(),

      title:
        newAssignment.title,

      course:
        newAssignment.course,

      dueDate:
        newAssignment.dueDate,

      marks:
        Number(
          newAssignment.marks
        ) || 100,

      students:
        selectedCourse?.students ||
        0,

      submissions: 0,

      status: "Published",
    };


    setAssignments(
      (previous) => [
        createdAssignment,
        ...previous,
      ]
    );


    setNewAssignment({
      title: "",
      course: "",
      dueDate: "",
      marks: "",
      description: "",
    });


    setCreateOpen(false);

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

                <button className="la-review-button">

                  <Eye size={14} />

                  View

                </button>


                <button className="la-icon-button">

                  <Pencil size={14} />

                </button>


                <button className="la-icon-button">

                  <MoreVertical
                    size={15}
                  />

                </button>

              </div>

            </article>

          )
        )}

      </section>



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
                        value={course}
                        key={course}
                      >
                        {course}
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

                <div>

                  <strong>
                    Assignment Brief
                  </strong>

                  <span>
                    File upload will be
                    connected during the
                    backend phase.
                  </span>

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