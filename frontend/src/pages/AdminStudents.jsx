import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import {
  GraduationCap,
  Users,
  Search,
  BookOpen,
  Eye,
  X,
  Mail,
  CircleCheckBig,
  UserX,
  ChartNoAxesCombined,
  Award,
  ClipboardList,
} from "lucide-react";

import "../styles/adminStudents.css";


/* =========================================
   GET INITIALS
========================================= */

const getInitials = (name) => {
  if (!name) {
    return "ST";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};


/* =========================================
   FORMAT LAST LOGIN
========================================= */

const formatLastLogin = (date) => {
  if (!date) {
    return "Never";
  }

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
};


function AdminStudents() {
  const navigate = useNavigate();


  /* ========================================
     STUDENTS
  ======================================== */

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* ========================================
     SEARCH + FILTER
  ======================================== */

  const [searchTerm, setSearchTerm] =
    useState("");

  const [batchFilter, setBatchFilter] =
    useState("ALL");


  /* ========================================
     SELECTED STUDENT
  ======================================== */

  const [
    selectedStudent,
    setSelectedStudent,
  ] = useState(null);


  /* ========================================
     LOAD REAL ACADEMIC DATA
  ======================================== */

  const loadStudents =
    useCallback(async () => {
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
            "http://localhost:5000/admin/students/academic-summary",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const realStudents =
          response.data.map(
            (student) => ({
              id: student.id,

              studentId:
                `STU${String(
                  student.id
                ).padStart(3, "0")}`,

              name:
                student.name ||
                "Unnamed Student",

              initials:
                getInitials(
                  student.name
                ),

              email:
                student.email ||
                "No email",

              degree:
                student.degree ||
                "Not assigned",

              batch:
                student.batch ||
                "Not assigned",

              courses:
                Number(
                  student.courses
                ) || 0,

              totalAssignments:
                Number(
                  student.total_assignments
                ) || 0,

              submittedAssignments:
                Number(
                  student.submitted_assignments
                ) || 0,

              gradedAssignments:
                Number(
                  student.graded_assignments
                ) || 0,

              progress:
                Number(
                  student.progress
                ) || 0,

              average:
                Number(
                  student.average_score
                ) || 0,

              status:
                student.is_active
                  ? "Active"
                  : "Disabled",

              isActive:
                student.is_active,

              lastLogin:
                formatLastLogin(
                  student.last_login
                ),
            })
          );


        setStudents(
          realStudents
        );

      } catch (error) {
        console.error(
          "Failed to load student academic data:",
          error
        );

        if (
          error.response?.status ===
            401 ||
          error.response?.status ===
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
          error.response?.data
            ?.error ||
          "Failed to load students."
        );

      } finally {
        setLoading(false);
      }
    }, [navigate]);


  useEffect(() => {
    loadStudents();
  }, [loadStudents]);


  /* ========================================
     BATCH OPTIONS
  ======================================== */

  const batchOptions =
    useMemo(() => {
      const batches =
        students
          .map(
            (student) =>
              student.batch
          )
          .filter(
            (batch) =>
              batch &&
              batch !==
                "Not assigned"
          );

      return [
        ...new Set(batches),
      ].sort();

    }, [students]);


  /* ========================================
     FILTER STUDENTS
  ======================================== */

  const filteredStudents =
    useMemo(() => {
      const search =
        searchTerm
          .toLowerCase()
          .trim();

      return students.filter(
        (student) => {
          const matchesSearch =
            student.name
              .toLowerCase()
              .includes(search) ||

            student.email
              .toLowerCase()
              .includes(search) ||

            student.studentId
              .toLowerCase()
              .includes(search) ||

            student.degree
              .toLowerCase()
              .includes(search) ||

            student.batch
              .toLowerCase()
              .includes(search);


          const matchesBatch =
            batchFilter ===
              "ALL" ||
            student.batch ===
              batchFilter;


          return (
            matchesSearch &&
            matchesBatch
          );
        }
      );

    }, [
      students,
      searchTerm,
      batchFilter,
    ]);


  /* ========================================
     SUMMARY VALUES
  ======================================== */

  const totalStudents =
    students.length;


  const studyPrograms =
    new Set(
      students
        .map(
          (student) =>
            student.degree
        )
        .filter(
          (degree) =>
            degree &&
            degree !==
              "Not assigned"
        )
    ).size;


  const averageProgress =
    totalStudents > 0
      ? Math.round(
          students.reduce(
            (
              total,
              student
            ) =>
              total +
              student.progress,
            0
          ) /
            totalStudents
        )
      : 0;


  /*
    Only students with at least one
    graded assignment are used for
    average score.
  */

  const studentsWithGrades =
    students.filter(
      (student) =>
        student.gradedAssignments >
        0
    );


  const averageScore =
    studentsWithGrades.length > 0
      ? Math.round(
          studentsWithGrades.reduce(
            (
              total,
              student
            ) =>
              total +
              student.average,
            0
          ) /
            studentsWithGrades.length
        )
      : 0;


  return (
    <div className="admin-students-page">


      {/* ====================================
          HEADER
      ==================================== */}

      <section className="ast-header">

        <div>

          <h1>
            Students
          </h1>

          <p>
            Monitor student enrollment,
            learning progress and
            academic performance.
          </p>

        </div>


        <div className="ast-header-badge">

          <GraduationCap
            size={16}
          />

          {totalStudents} Students

        </div>

      </section>



      {/* ====================================
          SUMMARY CARDS
      ==================================== */}

      <section className="ast-summary">


        {/* TOTAL STUDENTS */}

        <div className="ast-summary-card ast-teal">

          <div className="ast-summary-icon">

            <Users size={21} />

          </div>

          <div>

            <strong>
              {totalStudents}
            </strong>

            <span>
              Total Students
            </span>

          </div>

        </div>



        {/* STUDY PROGRAMS */}

        <div className="ast-summary-card ast-purple">

          <div className="ast-summary-icon">

            <BookOpen size={21} />

          </div>

          <div>

            <strong>
              {studyPrograms}
            </strong>

            <span>
              Study Programs
            </span>

          </div>

        </div>



        {/* AVERAGE PROGRESS */}

        <div className="ast-summary-card ast-blue">

          <div className="ast-summary-icon">

            <ChartNoAxesCombined
              size={21}
            />

          </div>

          <div>

            <strong>
              {averageProgress}%
            </strong>

            <span>
              Average Progress
            </span>

          </div>

        </div>



        {/* AVERAGE SCORE */}

        <div className="ast-summary-card ast-orange">

          <div className="ast-summary-icon">

            <Award size={21} />

          </div>

          <div>

            <strong>
              {averageScore}%
            </strong>

            <span>
              Average Score
            </span>

          </div>

        </div>

      </section>



      {/* ====================================
          TOOLBAR
      ==================================== */}

      <section className="ast-toolbar">


        {/* SEARCH */}

        <div className="ast-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>


        {/* BATCH FILTER */}

        <select
          value={batchFilter}
          onChange={(event) =>
            setBatchFilter(
              event.target.value
            )
          }
        >

          <option value="ALL">
            All Batches
          </option>

          {batchOptions.map(
            (batch) => (
              <option
                key={batch}
                value={batch}
              >
                Batch {batch}
              </option>
            )
          )}

        </select>

      </section>



      {/* ====================================
          STUDENT TABLE
      ==================================== */}

      <section className="ast-table-container">


        {/* LOADING */}

        {loading && (

          <div
            style={{
              padding: "45px",
              textAlign: "center",
            }}
          >

            <Users size={30} />

            <h3>
              Loading students...
            </h3>

            <p>
              Loading academic
              information from
              PostgreSQL.
            </p>

          </div>

        )}



        {/* ERROR */}

        {!loading && error && (

          <div
            style={{
              padding: "45px",
              textAlign: "center",
            }}
          >

            <UserX size={30} />

            <h3>
              Unable to load students
            </h3>

            <p>
              {error}
            </p>

          </div>

        )}



        {/* TABLE */}

        {!loading &&
          !error && (

          <>

            <table className="ast-table">

              <thead>

                <tr>

                  <th>
                    Student
                  </th>

                  <th>
                    Program
                  </th>

                  <th>
                    Batch
                  </th>

                  <th>
                    Courses
                  </th>

                  <th>
                    Progress
                  </th>

                  <th>
                    Average
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredStudents.map(
                  (student) => (

                    <tr
                      key={student.id}
                    >


                      {/* STUDENT */}

                      <td>

                        <div className="ast-profile">

                          <div className="ast-avatar">

                            {
                              student.initials
                            }

                          </div>

                          <div>

                            <strong>

                              {
                                student.name
                              }

                            </strong>

                            <span>

                              {
                                student.studentId
                              }

                            </span>

                          </div>

                        </div>

                      </td>



                      {/* PROGRAM */}

                      <td>

                        {
                          student.degree
                        }

                      </td>



                      {/* BATCH */}

                      <td>

                        {
                          student.batch
                        }

                      </td>



                      {/* COURSES */}

                      <td>

                        {
                          student.courses
                        }

                      </td>



                      {/* PROGRESS */}

                      <td>

                        <div className="ast-progress-wrapper">

                          <div className="ast-progress-text">

                            <span>

                              {
                                student.progress
                              }
                              %

                            </span>

                          </div>


                          <div className="ast-progress-track">

                            <div
                              className="ast-progress-bar"
                              style={{
                                width:
                                  `${Math.min(
                                    student.progress,
                                    100
                                  )}%`,
                              }}
                            />

                          </div>

                        </div>

                      </td>



                      {/* AVERAGE */}

                      <td>

                        <strong>

                          {
                            student
                              .gradedAssignments >
                            0
                              ? `${Math.round(
                                  student.average
                                )}%`
                              : "—"
                          }

                        </strong>

                      </td>



                      {/* STATUS */}

                      <td>

                        {student.status ===
                        "Active" ? (

                          <span className="ast-active">

                            <CircleCheckBig
                              size={10}
                            />

                            Active

                          </span>

                        ) : (

                          <span
                            className="ast-active"
                            style={{
                              color:
                                "#dc2626",

                              background:
                                "#fef2f2",
                            }}
                          >

                            <UserX
                              size={10}
                            />

                            Disabled

                          </span>

                        )}

                      </td>



                      {/* ACTION */}

                      <td>

                        <button
                          className="ast-view-button"
                          onClick={() =>
                            setSelectedStudent(
                              student
                            )
                          }
                        >

                          <Eye size={14} />

                          View

                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>



            {/* NO RESULTS */}

            {filteredStudents.length ===
              0 && (

              <div
                style={{
                  padding:
                    "45px",
                  textAlign:
                    "center",
                }}
              >

                <Users size={30} />

                <h3>
                  No students found
                </h3>

                <p>
                  Try changing your
                  search or batch
                  filter.
                </p>

              </div>

            )}

          </>

        )}

      </section>



      {/* ====================================
          STUDENT DETAILS MODAL
      ==================================== */}

      {selectedStudent && (

        <div className="ast-modal-overlay">

          <div className="ast-modal">


            {/* HEADER */}

            <div className="ast-modal-header">

              <div>

                <h2>
                  Student Details
                </h2>

                <p>
                  Academic and account
                  information.
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedStudent(
                    null
                  )
                }
              >

                <X size={18} />

              </button>

            </div>



            {/* PROFILE */}

            <div className="ast-modal-profile">

              <div className="ast-modal-avatar">

                {
                  selectedStudent.initials
                }

              </div>

              <div>

                <h3>
                  {
                    selectedStudent.name
                  }
                </h3>

                <p>
                  {
                    selectedStudent.studentId
                  }
                </p>

              </div>

            </div>



            {/* DETAILS */}

            <div className="ast-modal-grid">


              {/* EMAIL */}

              <div>

                <Mail size={17} />

                <span>
                  Email
                </span>

                <strong>
                  {
                    selectedStudent.email
                  }
                </strong>

              </div>



              {/* PROGRAM */}

              <div>

                <GraduationCap
                  size={17}
                />

                <span>
                  Program
                </span>

                <strong>
                  {
                    selectedStudent.degree
                  }
                </strong>

              </div>



              {/* BATCH */}

              <div>

                <Users size={17} />

                <span>
                  Batch
                </span>

                <strong>
                  {
                    selectedStudent.batch
                  }
                </strong>

              </div>



              {/* COURSES */}

              <div>

                <BookOpen size={17} />

                <span>
                  Courses
                </span>

                <strong>
                  {
                    selectedStudent.courses
                  }
                </strong>

              </div>

            </div>



            {/* ACADEMIC RESULTS */}

            <div className="ast-modal-results">


              {/* PROGRESS */}

              <div>

                <ChartNoAxesCombined
                  size={18}
                />

                <span>
                  Assignment Progress
                </span>

                <strong>
                  {
                    selectedStudent.progress
                  }
                  %
                </strong>

              </div>



              {/* AVERAGE */}

              <div>

                <Award size={18} />

                <span>
                  Average Score
                </span>

                <strong>

                  {
                    selectedStudent
                      .gradedAssignments >
                    0
                      ? `${Number(
                          selectedStudent.average
                        ).toFixed(
                          1
                        )}%`
                      : "No grades yet"
                  }

                </strong>

              </div>



              {/* SUBMITTED */}

              <div>

                <ClipboardList
                  size={18}
                />

                <span>
                  Submitted Assignments
                </span>

                <strong>

                  {
                    selectedStudent
                      .submittedAssignments
                  }
                  /
                  {
                    selectedStudent
                      .totalAssignments
                  }

                </strong>

              </div>



              {/* GRADED */}

              <div>

                <CircleCheckBig
                  size={18}
                />

                <span>
                  Graded Assignments
                </span>

                <strong>

                  {
                    selectedStudent
                      .gradedAssignments
                  }
                  /
                  {
                    selectedStudent
                      .submittedAssignments
                  }

                </strong>

              </div>

            </div>



            {/* FOOTER */}

            <div className="ast-modal-footer">

              <button
                onClick={() =>
                  setSelectedStudent(
                    null
                  )
                }
              >

                Close

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}


export default AdminStudents;