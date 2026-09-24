import {
  useMemo,
  useState,
} from "react";

import {
  BookOpen,
  Search,
  Plus,
  Users,
  GraduationCap,
  FileText,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import "../styles/adminCourses.css";


function AdminCourses() {

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Software Engineering",
      code: "SE301",
      program: "BSc Software Engineering",
      lecturer: "Hasith Witharama",
      batch: "25.1",
      students: 42,
      materials: 8,
      status: "Active",
    },

    {
      id: 2,
      title: "Database Systems",
      code: "DB205",
      program: "BSc Information Technology",
      lecturer: "Michael Brown",
      batch: "25.1",
      students: 36,
      materials: 11,
      status: "Active",
    },

    {
      id: 3,
      title: "Web Development",
      code: "WD210",
      program: "BSc Software Engineering",
      lecturer: "Emily Davis",
      batch: "25.2",
      students: 38,
      materials: 7,
      status: "Active",
    },

    {
      id: 4,
      title: "Artificial Intelligence",
      code: "AI320",
      program: "BSc Data Science",
      lecturer: "Sarah Johnson",
      batch: "25.2",
      students: 32,
      materials: 10,
      status: "Active",
    },
  ]);


  const [searchTerm, setSearchTerm] =
    useState("");

  const [programFilter, setProgramFilter] =
    useState("ALL");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingCourse, setEditingCourse] =
    useState(null);


  const [formData, setFormData] =
    useState({
      title: "",
      code: "",
      program: "",
      lecturer: "",
      batch: "",
    });


  /* ========================================
     FILTER
  ======================================== */

  const filteredCourses =
    useMemo(() => {

      const search =
        searchTerm.toLowerCase();

      return courses.filter(
        (course) => {

          const matchesSearch =
            course.title
              .toLowerCase()
              .includes(search) ||

            course.code
              .toLowerCase()
              .includes(search) ||

            course.lecturer
              .toLowerCase()
              .includes(search);


          const matchesProgram =
            programFilter === "ALL" ||
            course.program ===
              programFilter;


          return (
            matchesSearch &&
            matchesProgram
          );

        }
      );

    }, [
      courses,
      searchTerm,
      programFilter,
    ]);


  /* ========================================
     OPEN CREATE
  ======================================== */

  const openCreateModal = () => {

    setEditingCourse(null);

    setFormData({
      title: "",
      code: "",
      program: "",
      lecturer: "",
      batch: "",
    });

    setModalOpen(true);

  };


  /* ========================================
     OPEN EDIT
  ======================================== */

  const openEditModal = (course) => {

    setEditingCourse(course);

    setFormData({
      title: course.title,
      code: course.code,
      program: course.program,
      lecturer: course.lecturer,
      batch: course.batch,
    });

    setModalOpen(true);

  };


  /* ========================================
     SAVE
  ======================================== */

  const handleSaveCourse = (event) => {

    event.preventDefault();


    if (
      !formData.title ||
      !formData.code ||
      !formData.program ||
      !formData.lecturer ||
      !formData.batch
    ) {
      return;
    }


    if (editingCourse) {

      setCourses(
        (previous) =>
          previous.map(
            (course) =>
              course.id ===
              editingCourse.id
                ? {
                    ...course,
                    ...formData,
                  }
                : course
          )
      );

    } else {

      const newCourse = {
        id: Date.now(),

        ...formData,

        students: 0,

        materials: 0,

        status: "Active",
      };


      setCourses(
        (previous) => [
          newCourse,
          ...previous,
        ]
      );

    }


    setModalOpen(false);

  };


  /* ========================================
     DELETE
  ======================================== */

  const deleteCourse = (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this course?"
      );


    if (!confirmed) {
      return;
    }


    setCourses(
      (previous) =>
        previous.filter(
          (course) =>
            course.id !== id
        )
    );

  };


  const totalStudents =
    courses.reduce(
      (total, course) =>
        total + course.students,
      0
    );


  const totalMaterials =
    courses.reduce(
      (total, course) =>
        total + course.materials,
      0
    );


  return (
    <div className="admin-courses-page">


      {/* HEADER */}

      <section className="ac-header">

        <div>

          <h1>
            Courses
          </h1>

          <p>
            Manage academic modules,
            lecturers and student groups.
          </p>

        </div>


        <button
          className="ac-create-button"
          onClick={openCreateModal}
        >

          <Plus size={16} />

          Create Course

        </button>

      </section>



      {/* SUMMARY */}

      <section className="ac-summary">


        <div className="ac-summary-card ac-teal">

          <div className="ac-summary-icon">

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


        <div className="ac-summary-card ac-purple">

          <div className="ac-summary-icon">

            <GraduationCap
              size={21}
            />

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


        <div className="ac-summary-card ac-blue">

          <div className="ac-summary-icon">

            <Users size={21} />

          </div>

          <div>

            <strong>
              {totalStudents}
            </strong>

            <span>
              Enrolled Students
            </span>

          </div>

        </div>


        <div className="ac-summary-card ac-orange">

          <div className="ac-summary-icon">

            <FileText size={21} />

          </div>

          <div>

            <strong>
              {totalMaterials}
            </strong>

            <span>
              Learning Materials
            </span>

          </div>

        </div>

      </section>



      {/* FILTERS */}

      <section className="ac-toolbar">

        <div className="ac-search">

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
          value={programFilter}
          onChange={(event) =>
            setProgramFilter(
              event.target.value
            )
          }
        >

          <option value="ALL">
            All Programs
          </option>

          <option value="BSc Software Engineering">
            BSc Software Engineering
          </option>

          <option value="BSc Information Technology">
            BSc Information Technology
          </option>

          <option value="BSc Data Science">
            BSc Data Science
          </option>

        </select>

      </section>



      {/* COURSE GRID */}

      <section className="ac-grid">

        {filteredCourses.map(
          (course) => (

            <article
              className="ac-card"
              key={course.id}
            >

              <div className="ac-card-header">

                <div className="ac-course-icon">

                  <BookOpen
                    size={22}
                  />

                </div>


                <span className="ac-active-badge">

                  {course.status}

                </span>

              </div>


              <span className="ac-course-code">

                {course.code}

              </span>


              <h3>
                {course.title}
              </h3>


              <p className="ac-program">

                <GraduationCap
                  size={13}
                />

                {course.program}

              </p>


              <div className="ac-info-list">

                <div>

                  <Users size={13} />

                  <span>
                    {course.students}
                    {" "}
                    Students
                  </span>

                </div>


                <div>

                  <FileText size={13} />

                  <span>
                    {course.materials}
                    {" "}
                    Materials
                  </span>

                </div>


                <div>

                  <GraduationCap
                    size={13}
                  />

                  <span>
                    {course.lecturer}
                  </span>

                </div>

              </div>


              <div className="ac-batch">

                Batch {course.batch}

              </div>


              <div className="ac-actions">

                <button
                  className="ac-edit-button"
                  onClick={() =>
                    openEditModal(course)
                  }
                >

                  <Pencil size={14} />

                  Edit

                </button>


                <button
                  className="ac-delete-button"
                  onClick={() =>
                    deleteCourse(
                      course.id
                    )
                  }
                >

                  <Trash2 size={14} />

                </button>

              </div>

            </article>

          )
        )}

      </section>



      {/* EMPTY */}

      {filteredCourses.length === 0 && (

        <div className="ac-empty">

          <BookOpen size={28} />

          <h3>
            No courses found
          </h3>

          <p>
            Try changing your search
            or program filter.
          </p>

        </div>

      )}



      {/* MODAL */}

      {modalOpen && (

        <div className="ac-modal-overlay">

          <div className="ac-modal">


            <div className="ac-modal-header">

              <div>

                <h2>

                  {editingCourse
                    ? "Edit Course"
                    : "Create New Course"}

                </h2>

                <p>
                  Manage academic module
                  information.
                </p>

              </div>


              <button
                onClick={() =>
                  setModalOpen(false)
                }
              >

                <X size={18} />

              </button>

            </div>



            <form
              className="ac-form"
              onSubmit={
                handleSaveCourse
              }
            >


              <div className="ac-form-group">

                <label>
                  Course Title
                </label>

                <input
                  type="text"
                  placeholder="Example: Cloud Computing"
                  value={
                    formData.title
                  }
                  onChange={(event) =>
                    setFormData({
                      ...formData,

                      title:
                        event.target.value,
                    })
                  }
                />

              </div>



              <div className="ac-form-row">


                <div className="ac-form-group">

                  <label>
                    Course Code
                  </label>

                  <input
                    type="text"
                    placeholder="CC301"
                    value={
                      formData.code
                    }
                    onChange={(event) =>
                      setFormData({
                        ...formData,

                        code:
                          event.target.value,
                      })
                    }
                  />

                </div>


                <div className="ac-form-group">

                  <label>
                    Batch
                  </label>

                  <select
                    value={
                      formData.batch
                    }
                    onChange={(event) =>
                      setFormData({
                        ...formData,

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

                  </select>

                </div>

              </div>



              <div className="ac-form-group">

                <label>
                  Program
                </label>

                <select
                  value={
                    formData.program
                  }
                  onChange={(event) =>
                    setFormData({
                      ...formData,

                      program:
                        event.target.value,
                    })
                  }
                >

                  <option value="">
                    Select program
                  </option>

                  <option value="BSc Software Engineering">
                    BSc Software Engineering
                  </option>

                  <option value="BSc Information Technology">
                    BSc Information Technology
                  </option>

                  <option value="BSc Data Science">
                    BSc Data Science
                  </option>

                </select>

              </div>



              <div className="ac-form-group">

                <label>
                  Lecturer
                </label>

                <input
                  type="text"
                  placeholder="Enter lecturer name"
                  value={
                    formData.lecturer
                  }
                  onChange={(event) =>
                    setFormData({
                      ...formData,

                      lecturer:
                        event.target.value,
                    })
                  }
                />

              </div>



              <div className="ac-modal-actions">

                <button
                  type="button"
                  className="ac-cancel-button"
                  onClick={() =>
                    setModalOpen(false)
                  }
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="ac-save-button"
                >

                  {editingCourse
                    ? "Save Changes"
                    : "Create Course"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


export default AdminCourses;