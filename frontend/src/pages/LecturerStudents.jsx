import {
  useMemo,
  useState,
} from "react";

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

  /*
    Temporary frontend data.

    Later this will be replaced with
    real PostgreSQL student data.
  */

  const [students] = useState([
    {
      id: 1,
      name: "Movinya Perera",
      studentId: "STU001",
      initials: "MP",
      email: "movinya@example.com",
      degree: "BSc Software Engineering",
      batch: "25.1",
      course: "Software Engineering",
      progress: 82,
      submissions: 8,
      graded: 6,
      average: 84,
      status: "Active",
    },

    {
      id: 2,
      name: "Amaya Silva",
      studentId: "STU002",
      initials: "AS",
      email: "amaya@example.com",
      degree: "BSc Information Technology",
      batch: "25.1",
      course: "Database Systems",
      progress: 75,
      submissions: 7,
      graded: 5,
      average: 78,
      status: "Active",
    },

    {
      id: 3,
      name: "Dinuka Fernando",
      studentId: "STU003",
      initials: "DF",
      email: "dinuka@example.com",
      degree: "BSc Software Engineering",
      batch: "25.2",
      course: "Web Development",
      progress: 91,
      submissions: 9,
      graded: 8,
      average: 88,
      status: "Active",
    },

    {
      id: 4,
      name: "Nethmi Jayasinghe",
      studentId: "STU004",
      initials: "NJ",
      email: "nethmi@example.com",
      degree: "BSc Data Science",
      batch: "25.2",
      course: "Artificial Intelligence",
      progress: 68,
      submissions: 6,
      graded: 5,
      average: 74,
      status: "Active",
    },

    {
      id: 5,
      name: "Kavindu Perera",
      studentId: "STU005",
      initials: "KP",
      email: "kavindu@example.com",
      degree: "BSc Software Engineering",
      batch: "25.1",
      course: "Software Engineering",
      progress: 63,
      submissions: 5,
      graded: 4,
      average: 69,
      status: "Active",
    },
  ]);


  const [searchTerm, setSearchTerm] =
    useState("");

  const [batchFilter, setBatchFilter] =
    useState("All");

  const [selectedStudent, setSelectedStudent] =
    useState(null);


  /* ========================================
     FILTER STUDENTS
  ======================================== */

  const filteredStudents =
    useMemo(() => {

      return students.filter(
        (student) => {

          const search =
            searchTerm.toLowerCase();


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


  const averageProgress =
    Math.round(
      students.reduce(
        (total, student) =>
          total +
          student.progress,
        0
      ) /
        students.length
    );


  const averagePerformance =
    Math.round(
      students.reduce(
        (total, student) =>
          total +
          student.average,
        0
      ) /
        students.length
    );


  const activeStudents =
    students.filter(
      (student) =>
        student.status === "Active"
    ).length;


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

          {totalStudents}
          {" "}
          Students

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
              {totalStudents}
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
              {activeStudents}
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
              {averageProgress}%
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
              {averagePerformance}%
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

          <option value="25.1">
            Batch 25.1
          </option>

          <option value="25.2">
            Batch 25.2
          </option>

          <option value="26.1">
            Batch 26.1
          </option>

          <option value="26.2">
            Batch 26.2
          </option>

        </select>

      </section>



      {/* ====================================
          STUDENT GRID
      ==================================== */}

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
                    Batch{" "}
                    {student.batch}
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
                    {student.average}%
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



      {/* ====================================
          EMPTY STATE
      ==================================== */}

      {filteredStudents.length === 0 && (

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
                    Course
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
                    course progress.
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
                  {
                    selectedStudent.average
                  }%
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