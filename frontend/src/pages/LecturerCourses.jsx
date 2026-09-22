import { useMemo, useState } from "react";
import {
  BookOpen,
  Search,
  Plus,
  Users,
  GraduationCap,
  CalendarDays,
  MoreVertical,
  FileText,
  UploadCloud,
  Pencil,
  Eye,
  X,
} from "lucide-react";

import "../styles/lecturerCourses.css";


function LecturerCourses() {

  /*
    Temporary UI data.
    Later we will fetch this from PostgreSQL.
  */

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Software Engineering",
      degree: "BSc Software Engineering",
      batch: "25.1",
      students: 42,
      materials: 8,
      status: "Active",
      theme: "lecturer-course-blue",
    },
    {
      id: 2,
      title: "Database Systems",
      degree: "BSc Information Technology",
      batch: "25.1",
      students: 36,
      materials: 11,
      status: "Active",
      theme: "lecturer-course-green",
    },
    {
      id: 3,
      title: "Web Development",
      degree: "BSc Software Engineering",
      batch: "25.2",
      students: 38,
      materials: 7,
      status: "Active",
      theme: "lecturer-course-purple",
    },
    {
      id: 4,
      title: "Artificial Intelligence",
      degree: "BSc Data Science",
      batch: "25.2",
      students: 32,
      materials: 10,
      status: "Active",
      theme: "lecturer-course-orange",
    },
  ]);


  const [searchTerm, setSearchTerm] =
    useState("");

  const [batchFilter, setBatchFilter] =
    useState("All");

  const [createOpen, setCreateOpen] =
    useState(false);


  const [newCourse, setNewCourse] =
    useState({
      title: "",
      degree: "",
      batch: "",
      description: "",
    });


  /* ========================================
     FILTER
  ======================================== */

  const filteredCourses = useMemo(() => {

    return courses.filter((course) => {

      const search =
        searchTerm.toLowerCase();


      const matchesSearch =
        course.title
          .toLowerCase()
          .includes(search) ||

        course.degree
          .toLowerCase()
          .includes(search);


      const matchesBatch =
        batchFilter === "All" ||
        course.batch === batchFilter;


      return (
        matchesSearch &&
        matchesBatch
      );

    });

  }, [
    courses,
    searchTerm,
    batchFilter,
  ]);


  /* ========================================
     TEMP CREATE COURSE
  ======================================== */

  const handleCreateCourse = (event) => {

    event.preventDefault();


    if (
      !newCourse.title ||
      !newCourse.degree ||
      !newCourse.batch
    ) {
      return;
    }


    const createdCourse = {
      id: Date.now(),
      title: newCourse.title,
      degree: newCourse.degree,
      batch: newCourse.batch,
      students: 0,
      materials: 0,
      status: "Active",
      theme: "lecturer-course-blue",
    };


    setCourses((previous) => [
      createdCourse,
      ...previous,
    ]);


    setNewCourse({
      title: "",
      degree: "",
      batch: "",
      description: "",
    });


    setCreateOpen(false);

  };


  return (
    <div className="lecturer-courses-page">

      {/* ====================================
          HEADER
      ==================================== */}

      <section className="lecturer-courses-header">

        <div>

          <h1>
            My Courses
          </h1>

          <p>
            Manage your teaching modules,
            learning resources and student
            groups.
          </p>

        </div>


        <button
          className="lecturer-primary-button"
          onClick={() =>
            setCreateOpen(true)
          }
        >

          <Plus size={16} />

          Create Course

        </button>

      </section>


      {/* ====================================
          SUMMARY
      ==================================== */}

      <section className="lecturer-courses-summary">

        <div className="lc-summary-card lc-summary-blue">

          <div className="lc-summary-icon">
            <BookOpen size={21} />
          </div>

          <div>

            <strong>
              {courses.length}
            </strong>

            <span>
              Active Courses
            </span>

          </div>

        </div>


        <div className="lc-summary-card lc-summary-purple">

          <div className="lc-summary-icon">
            <Users size={21} />
          </div>

          <div>

            <strong>
              {courses.reduce(
                (total, course) =>
                  total + course.students,
                0
              )}
            </strong>

            <span>
              Total Students
            </span>

          </div>

        </div>


        <div className="lc-summary-card lc-summary-green">

          <div className="lc-summary-icon">
            <FileText size={21} />
          </div>

          <div>

            <strong>
              {courses.reduce(
                (total, course) =>
                  total + course.materials,
                0
              )}
            </strong>

            <span>
              Learning Materials
            </span>

          </div>

        </div>

      </section>


      {/* ====================================
          TOOLBAR
      ==================================== */}

      <section className="lecturer-courses-toolbar">

        <div className="lecturer-course-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>


        <select
          className="lecturer-course-filter"
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
          COURSES
      ==================================== */}

      <section className="lecturer-course-grid">

        {filteredCourses.map(
          (course) => (

            <article
              className="lecturer-management-course"
              key={course.id}
            >

              {/* COVER */}
              <div
                className={`lecturer-management-cover ${course.theme}`}
              >

                <div className="lecturer-management-icon">

                  <BookOpen size={28} />

                </div>


                <button className="lecturer-course-more">

                  <MoreVertical size={18} />

                </button>

              </div>


              {/* BODY */}
              <div className="lecturer-management-body">

                <div className="lecturer-course-status-row">

                  <span className="lecturer-course-active">
                    {course.status}
                  </span>

                </div>


                <h3>
                  {course.title}
                </h3>


                <p className="lecturer-management-degree">

                  <GraduationCap size={12} />

                  {course.degree}

                </p>


                <div className="lecturer-management-meta">

                  <div>

                    <Users size={14} />

                    <span>
                      {course.students}
                      {" "}
                      Students
                    </span>

                  </div>


                  <div>

                    <CalendarDays size={14} />

                    <span>
                      Batch {course.batch}
                    </span>

                  </div>


                  <div>

                    <FileText size={14} />

                    <span>
                      {course.materials}
                      {" "}
                      Materials
                    </span>

                  </div>

                </div>


                <div className="lecturer-course-actions">

                  <button className="lecturer-course-open">

                    <Eye size={14} />

                    Open Course

                  </button>


                  <button className="lecturer-course-secondary">

                    <UploadCloud size={14} />

                  </button>


                  <button className="lecturer-course-secondary">

                    <Pencil size={14} />

                  </button>

                </div>

              </div>

            </article>

          )
        )}

      </section>


      {/* ====================================
          CREATE COURSE MODAL
      ==================================== */}

      {createOpen && (

        <div className="lecturer-modal-overlay">

          <div className="lecturer-course-modal">

            <div className="lecturer-modal-header">

              <div>

                <h2>
                  Create New Course
                </h2>

                <p>
                  Add a new teaching module
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
              onSubmit={handleCreateCourse}
            >

              <div className="lecturer-form-group">

                <label>
                  Course Title
                </label>

                <input
                  type="text"
                  placeholder="Example: Cloud Computing"
                  value={newCourse.title}
                  onChange={(event) =>
                    setNewCourse({
                      ...newCourse,
                      title:
                        event.target.value,
                    })
                  }
                />

              </div>


              <div className="lecturer-form-row">

                <div className="lecturer-form-group">

                  <label>
                    Degree
                  </label>

                  <select
                    value={newCourse.degree}
                    onChange={(event) =>
                      setNewCourse({
                        ...newCourse,
                        degree:
                          event.target.value,
                      })
                    }
                  >

                    <option value="">
                      Select degree
                    </option>

                    <option value="BSc Software Engineering">
                      BSc Software Engineering
                    </option>

                    <option value="BSc Data Science">
                      BSc Data Science
                    </option>

                    <option value="BSc Information Technology">
                      BSc Information Technology
                    </option>

                  </select>

                </div>


                <div className="lecturer-form-group">

                  <label>
                    Batch
                  </label>

                  <select
                    value={newCourse.batch}
                    onChange={(event) =>
                      setNewCourse({
                        ...newCourse,
                        batch:
                          event.target.value,
                      })
                    }
                  >

                    <option value="">
                      Select batch
                    </option>

                    <option value="25.1">
                      25.1
                    </option>

                    <option value="25.2">
                      25.2
                    </option>

                    <option value="26.1">
                      26.1
                    </option>

                    <option value="26.2">
                      26.2
                    </option>

                  </select>

                </div>

              </div>


              <div className="lecturer-form-group">

                <label>
                  Description
                </label>

                <textarea
                  rows="4"
                  placeholder="Briefly describe this course..."
                  value={
                    newCourse.description
                  }
                  onChange={(event) =>
                    setNewCourse({
                      ...newCourse,
                      description:
                        event.target.value,
                    })
                  }
                />

              </div>


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

                  Create Course

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


export default LecturerCourses;