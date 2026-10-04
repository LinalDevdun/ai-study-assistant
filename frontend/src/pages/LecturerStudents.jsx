import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Users,
  Search,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Mail,
  Eye,
  X,
  ClipboardList,
  Award,
  CircleCheckBig,
} from "lucide-react";

import "../styles/lecturerStudents.css";


function LecturerStudents() {

  const navigate = useNavigate();


  /* ========================================
     STATE
  ======================================== */

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [batchFilter, setBatchFilter] =
    useState("All");

  const [selectedStudent, setSelectedStudent] =
    useState(null);


  /* ========================================
     LOAD REAL STUDENTS
  ======================================== */

  useEffect(() => {

    const loadStudents = async () => {

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
            "http://localhost:5000/lecturer/students",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const realStudents =
          Array.isArray(
            response.data?.students
          )
            ? response.data.students
            : [];


        const formattedStudents =
          realStudents.map(
            (student) => ({
              id:
                student.id,

              name:
                student.name ||
                "Student",

              studentId:
                `Student ID ${student.id}`,

              initials:
                getInitials(
                  student.name
                ),

              email:
                student.email ||
                "No email",

              degree:
                student.degree ||
                "No degree",

              batch:
                student.batch ||
                "No batch",

              course:
                student.courses ||
                "No courses",

              courseCount:
                Number(
                  student.course_count ||
                  0
                ),

              progress:
                Number(
                  student.progress ||
                  0
                ),

              submissions:
                Number(
                  student.submissions ||
                  0
                ),

              graded:
                Number(
                  student.graded ||
                  0
                ),

              average:
                student.average_score !== null &&
                student.average_score !== undefined
                  ? Number(
                      student.average_score
                    )
                  : null,

              status:
                student.is_active === false
                  ? "Inactive"
                  : "Active",
            })
          );


        setStudents(
          formattedStudents
        );


      } catch (loadError) {

        console.error(
          "Failed to load lecturer students:",
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
          "Failed to load students."
        );


      } finally {

        setLoading(false);

      }

    };


    loadStudents();

  }, [navigate]);


  /* ========================================
     INITIALS
  ======================================== */

  function getInitials(name) {

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

  }


  /* ========================================
     BATCH OPTIONS
  ======================================== */

  const batchOptions =
    useMemo(() => {

      return [
        ...new Set(
          students
            .map(
              (student) =>
                student.batch
            )
            .filter(
              (batch) =>
                batch &&
                batch !== "No batch"
            )
        ),
      ].sort();

    }, [students]);


  /* ========================================
     FILTER STUDENTS
  ======================================== */

  const filteredStudents =
    useMemo(() => {

      const search =
        searchTerm
          .trim()
          .toLowerCase();


      return students.filter(
        (student) => {

          const matchesSearch =

            student.name
              .toLowerCase()
              .includes(search) ||

            student.studentId
              .toLowerCase()
              .includes(search) ||

            student.course
              .toLowerCase()
              .includes(search) ||

            student.degree
              .toLowerCase()
              .includes(search) ||

            student.email
              .toLowerCase()
              .includes(search);


          const matchesBatch =

            batchFilter === "All" ||

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


  const activeStudents =
    students.filter(
      (student) =>
        student.status === "Active"
    ).length;


  const averageProgress =

    students.length > 0

      ? Math.round(
          students.reduce(
            (total, student) =>
              total +
              student.progress,
            0
          ) /
          students.length
        )

      : 0;


  const studentsWithScores =
    students.filter(
      (student) =>
        student.average !== null
    );


  const averagePerformance =

    studentsWithScores.length > 0

      ? Math.round(
          studentsWithScores.reduce(
            (total, student) =>
              total +
              student.average,
            0
          ) /
          studentsWithScores.length
        )

      : null;


  return (

    <div className="lecturer-students-page">


      {/* ====================================
          HEADER
      ==================================== */}

      <section className="lst-header">

        <div>

          <h1>
            Students
          </h1>

          <p>
            View student information,
            learning progress and academic
            performance.
          </p>

        </div>


        <div className="lst-header-badge">

          <Users size={16} />

          {totalStudents}{" "}

          {totalStudents === 1
            ? "Student"
            : "Students"}

        </div>

      </section>



      {/* ====================================
          SUMMARY
      ==================================== */}

      <section className="lst-summary">


        <div className="lst-summary-card lst-blue">

          <div className="lst-summary-icon">

            <Users size={21} />

          </div>

          <div>

            <strong>
              {loading
                ? "..."
                : totalStudents}
            </strong>

            <span>
              Total Students
            </span>

          </div>

        </div>



        <div className="lst-summary-card lst-green">

          <div className="lst-summary-icon">

            <CircleCheckBig
              size={21}
            />

          </div>

          <div>

            <strong>
              {loading
                ? "..."
                : activeStudents}
            </strong>

            <span>
              Active Students
            </span>

          </div>

        </div>



        <div className="lst-summary-card lst-purple">

          <div className="lst-summary-icon">

            <TrendingUp
              size={21}
            />

          </div>

          <div>

            <strong>

              {loading
                ? "..."
                : `${averageProgress}%`}

            </strong>

            <span>
              Average Progress
            </span>

          </div>

        </div>



        <div className="lst-summary-card lst-orange">

          <div className="lst-summary-icon">

            <Award size={21} />

          </div>

          <div>

            <strong>

              {loading
                ? "..."
                : averagePerformance !== null
                  ? `${averagePerformance}%`
                  : "—"}

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

      <section className="lst-toolbar">

        <div className="lst-search">

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


        <select
          className="lst-filter"
          value={batchFilter}
          onChange={(event) =>
            setBatchFilter(
              event.target.value
            )
          }
        >

          <option value="All">
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
          LOADING
      ==================================== */}

      {loading && (

        <div className="lst-empty">

          <Users size={28} />

          <h3>
            Loading students...
          </h3>

          <p>
            Please wait while student
            information is loaded.
          </p>

        </div>

      )}



      {/* ====================================
          ERROR
      ==================================== */}

      {!loading && error && (

        <div className="lst-empty">

          <Users size={28} />

          <h3>
            Unable to load students
          </h3>

          <p>
            {error}
          </p>

        </div>

      )}



      {/* ====================================
          STUDENT GRID
      ==================================== */}

      {!loading && !error && (

        <section className="lst-grid">

          {filteredStudents.map(
            (student) => (

              <article
                className="lst-student-card"
                key={student.id}
              >


                {/* TOP */}

                <div className="lst-student-top">

                  <div className="lst-avatar">

                    {student.initials}

                  </div>


                  <span className="lst-active-badge">

                    {student.status}

                  </span>

                </div>



                {/* DETAILS */}

                <h3>
                  {student.name}
                </h3>


                <p className="lst-student-id">

                  {student.studentId}

                </p>


                <div className="lst-student-details">


                  <div>

                    <GraduationCap
                      size={13}
                    />

                    <span>
                      {student.degree}
                    </span>

                  </div>


                  <div>

                    <BookOpen
                      size={13}
                    />

                    <span>
                      {student.course}
                    </span>

                  </div>


                  <div>

                    <Users size={13} />

                    <span>
                      Batch {student.batch}
                    </span>

                  </div>

                </div>



                {/* PROGRESS */}

                <div className="lst-progress">

                  <div className="lst-progress-info">

                    <span>
                      Learning Progress
                    </span>

                    <strong>
                      {student.progress}%
                    </strong>

                  </div>


                  <div className="lst-progress-track">

                    <div
                      className="lst-progress-fill"
                      style={{
                        width:
                          `${student.progress}%`,
                      }}
                    />

                  </div>

                </div>



                {/* PERFORMANCE */}

                <div className="lst-performance">

                  <div>

                    <strong>
                      {student.submissions}
                    </strong>

                    <span>
                      Submissions
                    </span>

                  </div>


                  <div>

                    <strong>
                      {student.graded}
                    </strong>

                    <span>
                      Graded
                    </span>

                  </div>


                  <div>

                    <strong>

                      {student.average !== null
                        ? `${student.average}%`
                        : "—"}

                    </strong>

                    <span>
                      Average
                    </span>

                  </div>

                </div>



                {/* ACTION */}

                <button
                  className="lst-view-button"
                  onClick={() =>
                    setSelectedStudent(
                      student
                    )
                  }
                >

                  <Eye size={14} />

                  View Student

                </button>

              </article>

            )
          )}

        </section>

      )}



      {/* ====================================
          EMPTY STATE
      ==================================== */}

      {!loading &&
        !error &&
        filteredStudents.length === 0 && (

        <div className="lst-empty">

          <Users size={28} />

          <h3>
            No students found
          </h3>

          <p>
            Try changing your search
            or batch filter.
          </p>

        </div>

      )}



      {/* ====================================
          STUDENT DETAILS MODAL
      ==================================== */}

      {selectedStudent && (

        <div className="lst-modal-overlay">

          <div className="lst-modal">


            {/* HEADER */}

            <div className="lst-modal-header">

              <div>

                <h2>
                  Student Details
                </h2>

                <p>
                  Academic and learning
                  progress overview.
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

            <div className="lst-modal-profile">

              <div className="lst-modal-avatar">

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


              <span>

                {
                  selectedStudent.status
                }

              </span>

            </div>



            {/* INFO */}

            <div className="lst-modal-info-grid">


              <div className="lst-info-card">

                <Mail size={17} />

                <div>

                  <span>
                    Email
                  </span>

                  <strong>

                    {
                      selectedStudent.email
                    }

                  </strong>

                </div>

              </div>


              <div className="lst-info-card">

                <GraduationCap
                  size={17}
                />

                <div>

                  <span>
                    Degree
                  </span>

                  <strong>

                    {
                      selectedStudent.degree
                    }

                  </strong>

                </div>

              </div>


              <div className="lst-info-card">

                <BookOpen
                  size={17}
                />

                <div>

                  <span>
                    Courses
                  </span>

                  <strong>

                    {
                      selectedStudent.course
                    }

                  </strong>

                </div>

              </div>


              <div className="lst-info-card">

                <Users size={17} />

                <div>

                  <span>
                    Batch
                  </span>

                  <strong>

                    {
                      selectedStudent.batch
                    }

                  </strong>

                </div>

              </div>

            </div>



            {/* PROGRESS PANEL */}

            <div className="lst-modal-progress">

              <div className="lst-modal-progress-header">

                <div>

                  <h3>
                    Learning Progress
                  </h3>

                  <p>
                    Current overall
                    assignment completion.
                  </p>

                </div>


                <strong>

                  {
                    selectedStudent.progress
                  }%

                </strong>

              </div>


              <div className="lst-modal-progress-track">

                <div
                  style={{
                    width:
                      `${selectedStudent.progress}%`,
                  }}
                />

              </div>

            </div>



            {/* ACADEMIC STATS */}

            <div className="lst-modal-stats">


              <div>

                <ClipboardList
                  size={18}
                />

                <strong>

                  {
                    selectedStudent.submissions
                  }

                </strong>

                <span>
                  Submissions
                </span>

              </div>


              <div>

                <CircleCheckBig
                  size={18}
                />

                <strong>

                  {
                    selectedStudent.graded
                  }

                </strong>

                <span>
                  Graded
                </span>

              </div>


              <div>

                <Award size={18} />

                <strong>

                  {selectedStudent.average !== null
                    ? `${selectedStudent.average}%`
                    : "—"}

                </strong>

                <span>
                  Average Score
                </span>

              </div>

            </div>



            {/* FOOTER */}

            <div className="lst-modal-footer">

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


export default LecturerStudents;