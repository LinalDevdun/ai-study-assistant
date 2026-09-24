import {
  useMemo,
  useState,
} from "react";

import {
  GraduationCap,
  Users,
  Search,
  BookOpen,
  TrendingUp,
  Award,
  Eye,
  X,
  Mail,
  CircleCheckBig,
} from "lucide-react";

import "../styles/adminStudents.css";


function AdminStudents() {
  const [students] = useState([
    {
      id: 1,
      studentId: "STU001",
      name: "Movinya Perera",
      initials: "MP",
      email: "movinya@example.com",
      degree: "BSc Software Engineering",
      batch: "25.1",
      courses: 6,
      progress: 82,
      average: 84,
      status: "Active",
    },
    {
      id: 2,
      studentId: "STU002",
      name: "Amaya Silva",
      initials: "AS",
      email: "amaya@example.com",
      degree: "BSc Information Technology",
      batch: "25.1",
      courses: 5,
      progress: 75,
      average: 78,
      status: "Active",
    },
    {
      id: 3,
      studentId: "STU003",
      name: "Dinuka Fernando",
      initials: "DF",
      email: "dinuka@example.com",
      degree: "BSc Software Engineering",
      batch: "25.2",
      courses: 6,
      progress: 91,
      average: 88,
      status: "Active",
    },
    {
      id: 4,
      studentId: "STU004",
      name: "Nethmi Jayasinghe",
      initials: "NJ",
      email: "nethmi@example.com",
      degree: "BSc Data Science",
      batch: "25.2",
      courses: 5,
      progress: 68,
      average: 74,
      status: "Active",
    },
  ]);


  const [searchTerm, setSearchTerm] =
    useState("");

  const [batchFilter, setBatchFilter] =
    useState("ALL");

  const [selectedStudent, setSelectedStudent] =
    useState(null);


  const filteredStudents =
    useMemo(() => {
      const search =
        searchTerm.toLowerCase();

      return students.filter(
        (student) => {
          const matchesSearch =
            student.name
              .toLowerCase()
              .includes(search) ||
            student.studentId
              .toLowerCase()
              .includes(search) ||
            student.degree
              .toLowerCase()
              .includes(search);

          const matchesBatch =
            batchFilter === "ALL" ||
            student.batch === batchFilter;

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


  const averageProgress =
    Math.round(
      students.reduce(
        (total, student) =>
          total + student.progress,
        0
      ) / students.length
    );


  const averageScore =
    Math.round(
      students.reduce(
        (total, student) =>
          total + student.average,
        0
      ) / students.length
    );


  return (
    <div className="admin-students-page">

      {/* HEADER */}

      <section className="ast-header">

        <div>

          <h1>
            Students
          </h1>

          <p>
            Monitor student enrollment,
            learning progress and academic
            performance.
          </p>

        </div>

        <div className="ast-header-badge">

          <GraduationCap size={16} />

          {students.length} Students

        </div>

      </section>


      {/* SUMMARY */}

      <section className="ast-summary">

        <div className="ast-summary-card ast-teal">

          <div className="ast-summary-icon">
            <Users size={21} />
          </div>

          <div>
            <strong>
              {students.length}
            </strong>

            <span>
              Total Students
            </span>
          </div>

        </div>


        <div className="ast-summary-card ast-purple">

          <div className="ast-summary-icon">
            <BookOpen size={21} />
          </div>

          <div>
            <strong>
              3
            </strong>

            <span>
              Study Programs
            </span>
          </div>

        </div>


        <div className="ast-summary-card ast-blue">

          <div className="ast-summary-icon">
            <TrendingUp size={21} />
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


      {/* FILTERS */}

      <section className="ast-toolbar">

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

          <option value="25.1">
            Batch 25.1
          </option>

          <option value="25.2">
            Batch 25.2
          </option>

        </select>

      </section>


      {/* TABLE */}

      <section className="ast-table-container">

        <table className="ast-table">

          <thead>
            <tr>
              <th>Student</th>
              <th>Program</th>
              <th>Batch</th>
              <th>Courses</th>
              <th>Progress</th>
              <th>Average</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>


          <tbody>

            {filteredStudents.map(
              (student) => (

                <tr key={student.id}>

                  <td>

                    <div className="ast-profile">

                      <div className="ast-avatar">
                        {student.initials}
                      </div>

                      <div>

                        <strong>
                          {student.name}
                        </strong>

                        <span>
                          {student.studentId}
                        </span>

                      </div>

                    </div>

                  </td>


                  <td>
                    {student.degree}
                  </td>


                  <td>
                    {student.batch}
                  </td>


                  <td>
                    {student.courses}
                  </td>


                  <td>

                    <div className="ast-progress">

                      <span>
                        {student.progress}%
                      </span>

                      <div>

                        <i
                          style={{
                            width:
                              `${student.progress}%`,
                          }}
                        />

                      </div>

                    </div>

                  </td>


                  <td>
                    <strong>
                      {student.average}%
                    </strong>
                  </td>


                  <td>

                    <span className="ast-active">

                      <CircleCheckBig
                        size={10}
                      />

                      {student.status}

                    </span>

                  </td>


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

      </section>


      {/* MODAL */}

      {selectedStudent && (

        <div className="ast-modal-overlay">

          <div className="ast-modal">

            <div className="ast-modal-header">

              <div>
                <h2>
                  Student Details
                </h2>

                <p>
                  Academic profile and
                  enrollment information.
                </p>
              </div>


              <button
                onClick={() =>
                  setSelectedStudent(null)
                }
              >
                <X size={18} />
              </button>

            </div>


            <div className="ast-modal-profile">

              <div className="ast-modal-avatar">

                {selectedStudent.initials}

              </div>

              <div>

                <h3>
                  {selectedStudent.name}
                </h3>

                <p>
                  {selectedStudent.studentId}
                </p>

              </div>

            </div>


            <div className="ast-modal-grid">

              <div>
                <Mail size={17} />

                <span>Email</span>

                <strong>
                  {selectedStudent.email}
                </strong>
              </div>


              <div>
                <GraduationCap
                  size={17}
                />

                <span>Program</span>

                <strong>
                  {selectedStudent.degree}
                </strong>
              </div>


              <div>
                <Users size={17} />

                <span>Batch</span>

                <strong>
                  {selectedStudent.batch}
                </strong>
              </div>


              <div>
                <BookOpen size={17} />

                <span>Courses</span>

                <strong>
                  {selectedStudent.courses}
                </strong>
              </div>

            </div>


            <div className="ast-modal-results">

              <div>
                <span>
                  Learning Progress
                </span>

                <strong>
                  {selectedStudent.progress}%
                </strong>
              </div>


              <div>
                <span>
                  Average Score
                </span>

                <strong>
                  {selectedStudent.average}%
                </strong>
              </div>

            </div>


            <div className="ast-modal-footer">

              <button
                onClick={() =>
                  setSelectedStudent(null)
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