import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import axios from "axios";

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

  const navigate =
    useNavigate();

  const location =
  useLocation();


  /* ========================================
     REAL DATABASE DATA
  ======================================== */

  const [courses, setCourses] =
    useState([]);


  const [summary, setSummary] =
    useState({
      active_courses: 0,
      total_students: 0,
      learning_materials: 0,
    });


  const [loading, setLoading] =
    useState(true);


  const [errorMessage, setErrorMessage] =
    useState("");


  /* ========================================
     SEARCH + FILTER
  ======================================== */

  const [searchTerm, setSearchTerm] =
    useState("");


  const [batchFilter, setBatchFilter] =
    useState("All");


  /* ========================================
     CREATE COURSE MODAL
  ======================================== */

  const [createOpen, setCreateOpen] =
    useState(false);


  const [creating, setCreating] =
    useState(false);


  const [newCourse, setNewCourse] =
    useState({
      title: "",
      degree: "",
      batch: "",
      file: null,
    });

    /* ========================================
    OPEN CREATE MODAL FROM TOPBAR
  ======================================== */

  useEffect(() => {

    if (
      location.state?.openCreateCourse
    ) {

      setCreateOpen(true);


      /*
        Remove the navigation state so
        refreshing the page does not
        reopen the modal again.
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
     EDIT COURSE MODAL
  ======================================== */

  const [editOpen, setEditOpen] =
    useState(false);


  const [updating, setUpdating] =
    useState(false);


  const [editingCourse, setEditingCourse] =
    useState({
      id: null,
      title: "",
      degree: "",
      batch: "",
      file: null,
    });


  /* ========================================
     COURSE THEMES
  ======================================== */

  const themes = [
    "lecturer-course-blue",
    "lecturer-course-green",
    "lecturer-course-purple",
    "lecturer-course-orange",
  ];


  /* ========================================
     LOAD COURSES
  ======================================== */

  const fetchCourses = async () => {

    try {

      setLoading(true);

      setErrorMessage("");


      const token =
        localStorage.getItem(
          "token"
        );


      if (!token) {

        navigate("/login");

        return;

      }


      const response =
        await axios.get(
          "http://localhost:5000/lecturer/courses",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const databaseCourses =
        Array.isArray(
          response.data?.courses
        )
          ? response.data.courses
          : [];


      /*
        The theme is visual only.
        It does not need to be stored
        in PostgreSQL.
      */

      const formattedCourses =
        databaseCourses.map(
          (course, index) => ({

            ...course,

            students:
              Number(
                course.student_count ||
                  0
              ),

            materials:
              Number(
                course.material_count ||
                  0
              ),

            lessons:
              Number(
                course.lesson_count ||
                  0
              ),

            status:
              "Active",

            theme:
              themes[
                index %
                  themes.length
              ],

          })
        );


      setCourses(
        formattedCourses
      );


      setSummary({

        active_courses:
          Number(
            response.data?.summary
              ?.active_courses ||
              0
          ),

        total_students:
          Number(
            response.data?.summary
              ?.total_students ||
              0
          ),

        learning_materials:
          Number(
            response.data?.summary
              ?.learning_materials ||
              0
          ),

      });


    } catch (error) {

      console.error(
        "Failed to load lecturer courses:",
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


      setErrorMessage(
        error.response?.data
          ?.error ||
          "Failed to load courses."
      );


    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchCourses();

  }, []);


  /* ========================================
     AVAILABLE BATCHES
  ======================================== */

  const availableBatches =
    useMemo(() => {

      return [
        ...new Set(
          courses
            .map(
              (course) =>
                course.batch
            )
            .filter(Boolean)
        ),
      ].sort();

    }, [courses]);


  /* ========================================
     FILTER COURSES
  ======================================== */

  const filteredCourses =
    useMemo(() => {

      return courses.filter(
        (course) => {

          const search =
            searchTerm
              .trim()
              .toLowerCase();


          const matchesSearch =
            !search ||

            course.title
              ?.toLowerCase()
              .includes(search) ||

            course.degree
              ?.toLowerCase()
              .includes(search);


          const matchesBatch =
            batchFilter === "All" ||
            course.batch ===
              batchFilter;


          return (
            matchesSearch &&
            matchesBatch
          );

        }
      );

    }, [
      courses,
      searchTerm,
      batchFilter,
    ]);


  /* ========================================
     CREATE COURSE
  ======================================== */

  const handleCreateCourse =
    async (event) => {

      event.preventDefault();


      if (
        !newCourse.title ||
        !newCourse.degree ||
        !newCourse.batch ||
        !newCourse.file
      ) {

        alert(
          "Please complete all fields and choose a course material file."
        );

        return;

      }


      try {

        setCreating(true);


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
          "courseTitle",
          newCourse.title.trim()
        );


        formData.append(
          "degree",
          newCourse.degree
        );


        formData.append(
          "batch",
          newCourse.batch
        );


        formData.append(
          "file",
          newCourse.file
        );


        await axios.post(
          "http://localhost:5000/courses",
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        alert(
          "Course created successfully!"
        );


        setNewCourse({
          title: "",
          degree: "",
          batch: "",
          file: null,
        });


        setCreateOpen(false);


        await fetchCourses();


      } catch (error) {

        console.error(
          "Create Course Error:",
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

          alert(
            "Your login session has expired. Please log in again."
          );

          navigate("/login");

          return;

        }


        alert(
          error.response?.data
            ?.error ||
            error.response?.data
              ?.message ||
            "Failed to create course."
        );


      } finally {

        setCreating(false);

      }

    };


  /* ========================================
     OPEN COURSE
  ======================================== */

  const handleOpenCourse =
    (course) => {

      navigate(
        `/lecturer/course/${course.id}`
      );

    };


  /* ========================================
     OPEN COURSE MATERIAL
  ======================================== */

  const handleOpenMaterial =
    (course) => {

      if (!course.file_path) {

        alert(
          "No main course material is available for this course."
        );

        return;

      }


      const cleanPath =
        String(
          course.file_path
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
     OPEN EDIT MODAL
  ======================================== */

  const openEditModal =
    (course) => {

      setEditingCourse({
        id: course.id,
        title: course.title || "",
        degree: course.degree || "",
        batch: course.batch || "",
        file: null,
      });


      setEditOpen(true);

    };


  /* ========================================
     CLOSE EDIT MODAL
  ======================================== */

  const closeEditModal = () => {

    if (updating) {
      return;
    }


    setEditOpen(false);


    setEditingCourse({
      id: null,
      title: "",
      degree: "",
      batch: "",
      file: null,
    });

  };


  /* ========================================
     UPDATE COURSE
  ======================================== */

  const handleUpdateCourse =
    async (event) => {

      event.preventDefault();


      if (
        !editingCourse.id ||
        !editingCourse.title ||
        !editingCourse.degree ||
        !editingCourse.batch
      ) {

        alert(
          "Please complete all required fields."
        );

        return;

      }


      try {

        setUpdating(true);


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
          "courseTitle",
          editingCourse.title.trim()
        );


        formData.append(
          "degree",
          editingCourse.degree
        );


        formData.append(
          "batch",
          editingCourse.batch
        );


        /*
          Replacing the course material
          is optional when editing.
        */

        if (editingCourse.file) {

          formData.append(
            "file",
            editingCourse.file
          );

        }


        const response =
          await axios.put(
            `http://localhost:5000/lecturer/courses/${editingCourse.id}`,
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
            "Course updated successfully!"
        );


        setEditOpen(false);


        setEditingCourse({
          id: null,
          title: "",
          degree: "",
          batch: "",
          file: null,
        });


        /*
          Reload everything from
          PostgreSQL after updating.
        */

        await fetchCourses();


      } catch (error) {

        console.error(
          "Update Course Error:",
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


          alert(
            "Your login session has expired. Please log in again."
          );


          navigate("/login");

          return;

        }


        alert(
          error.response?.data
            ?.error ||
            error.response?.data
              ?.message ||
            "Failed to update course."
        );


      } finally {

        setUpdating(false);

      }

    };


  /* ========================================
     CLOSE CREATE MODAL
  ======================================== */

  const closeCreateModal = () => {

    if (creating) {
      return;
    }


    setCreateOpen(false);


    setNewCourse({
      title: "",
      degree: "",
      batch: "",
      file: null,
    });

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
          ERROR
      ==================================== */}

      {errorMessage && (

        <div
          style={{
            marginBottom: "20px",
            padding: "14px 18px",
            background: "#fff1f2",
            color: "#dc2626",
            borderRadius: "12px",
            fontSize: "14px",
          }}
        >

          {errorMessage}

        </div>

      )}


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

              {loading
                ? "..."
                : summary.active_courses}

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

              {loading
                ? "..."
                : summary.total_students}

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

              {loading
                ? "..."
                : summary.learning_materials}

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


          {availableBatches.map(
            (batch) => (

              <option
                value={batch}
                key={batch}
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

        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
          }}
        >

          Loading courses...

        </div>

      )}


      {/* ====================================
          EMPTY RESULT
      ==================================== */}

      {!loading &&
        filteredCourses.length ===
          0 && (

          <div
            style={{
              padding: "50px 20px",
              textAlign: "center",
            }}
          >

            <BookOpen
              size={35}
            />

            <h3>
              No courses found
            </h3>

            <p>
              Try another search or
              batch filter.
            </p>

          </div>

        )}


      {/* ====================================
          COURSES
      ==================================== */}

      {!loading && (

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


                  <button
                    className="lecturer-course-more"
                    type="button"
                    title="More options"
                  >

                    <MoreVertical
                      size={18}
                    />

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

                    <GraduationCap
                      size={12}
                    />

                    {course.degree}

                  </p>


                  <div className="lecturer-management-meta">


                    <div>

                      <Users size={14} />

                      <span>

                        {course.students}{" "}

                        {course.students === 1
                          ? "Student"
                          : "Students"}

                      </span>

                    </div>


                    <div>

                      <CalendarDays
                        size={14}
                      />

                      <span>

                        Batch{" "}
                        {course.batch}

                      </span>

                    </div>


                    <div>

                      <FileText
                        size={14}
                      />

                      <span>

                        {course.materials}{" "}

                        {course.materials === 1
                          ? "Material"
                          : "Materials"}

                      </span>

                    </div>

                  </div>


                  <div className="lecturer-course-actions">


                    {/* OPEN COURSE */}

                    <button
                      className="lecturer-course-open"
                      type="button"
                      onClick={() =>
                        handleOpenCourse(
                          course
                        )
                      }
                    >

                      <Eye size={14} />

                      Open Course

                    </button>


                    {/* MATERIAL */}

                    <button
                      className="lecturer-course-secondary"
                      type="button"
                      title="Open course material"
                      onClick={() =>
                        handleOpenMaterial(
                          course
                        )
                      }
                    >

                      <UploadCloud
                        size={14}
                      />

                    </button>


                    {/* EDIT */}

                    <button
                      className="lecturer-course-secondary"
                      type="button"
                      title="Edit course"
                      onClick={() =>
                        openEditModal(
                          course
                        )
                      }
                    >

                      <Pencil
                        size={14}
                      />

                    </button>

                  </div>

                </div>

              </article>

            )
          )}

        </section>

      )}


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
                type="button"
                onClick={
                  closeCreateModal
                }
                disabled={
                  creating
                }
              >

                <X size={18} />

              </button>

            </div>


            <form
              className="lecturer-course-form"
              onSubmit={
                handleCreateCourse
              }
            >


              {/* COURSE TITLE */}

              <div className="lecturer-form-group">

                <label>
                  Course Title
                </label>

                <input
                  type="text"
                  placeholder="Example: Cloud Computing"
                  value={
                    newCourse.title
                  }
                  onChange={(event) =>
                    setNewCourse({
                      ...newCourse,

                      title:
                        event.target
                          .value,
                    })
                  }
                  required
                />

              </div>


              {/* DEGREE + BATCH */}

              <div className="lecturer-form-row">


                <div className="lecturer-form-group">

                  <label>
                    Degree
                  </label>

                  <select
                    value={
                      newCourse.degree
                    }
                    onChange={(event) =>
                      setNewCourse({
                        ...newCourse,

                        degree:
                          event.target
                            .value,
                      })
                    }
                    required
                  >

                    <option value="">
                      Select degree
                    </option>

                    <option value="BSc Software Engineering">
                      BSc Software Engineering
                    </option>

                    <option value="BSc (Hons) Computer Science">
                      BSc (Hons) Computer Science
                    </option>

                    <option value="BSc Data Science">
                      BSc Data Science
                    </option>

                    <option value="BSc (Hons) Data Science">
                      BSc (Hons) Data Science
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
                    value={
                      newCourse.batch
                    }
                    onChange={(event) =>
                      setNewCourse({
                        ...newCourse,

                        batch:
                          event.target
                            .value,
                      })
                    }
                    required
                  >

                    <option value="">
                      Select batch
                    </option>

                    <option value="24.1">
                      24.1
                    </option>

                    <option value="24.2">
                      24.2
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


              {/* MATERIAL */}

              <div className="lecturer-form-group">

                <label>
                  Course Material
                </label>

                <input
                  type="file"
                  onChange={(event) =>
                    setNewCourse({
                      ...newCourse,

                      file:
                        event.target
                          .files?.[0] ||
                        null,
                        
                    })
                  }
                  required
                />

                <small
                  style={{
                    color: "#9298ad",
                    marginTop: "6px",
                    display: "block",
                  }}
                >
                  Upload the main course
                  material, such as a PDF,
                  PowerPoint or document.
                </small>

              </div>


              {/* ACTIONS */}

              <div className="lecturer-modal-actions">

                <button
                  type="button"
                  className="lecturer-cancel-button"
                  onClick={
                    closeCreateModal
                  }
                  disabled={
                    creating
                  }
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="lecturer-primary-button"
                  disabled={
                    creating
                  }
                >

                  <Plus size={15} />

                  {creating
                    ? "Creating..."
                    : "Create Course"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ====================================
          EDIT COURSE MODAL
      ==================================== */}

      {editOpen && (

        <div className="lecturer-modal-overlay">


          <div className="lecturer-course-modal">


            {/* HEADER */}

            <div className="lecturer-modal-header">

              <div>

                <h2>
                  Edit Course
                </h2>

                <p>
                  Update your course
                  information and learning
                  material.
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


            {/* FORM */}

            <form
              className="lecturer-course-form"
              onSubmit={
                handleUpdateCourse
              }
            >


              {/* TITLE */}

              <div className="lecturer-form-group">

                <label>
                  Course Title
                </label>

                <input
                  type="text"
                  value={
                    editingCourse.title
                  }
                  onChange={(event) =>
                    setEditingCourse({
                      ...editingCourse,

                      title:
                        event.target
                          .value,
                    })
                  }
                  required
                />

              </div>


              {/* DEGREE + BATCH */}

              <div className="lecturer-form-row">


                <div className="lecturer-form-group">

                  <label>
                    Degree
                  </label>

                  <select
                    value={
                      editingCourse.degree
                    }
                    onChange={(event) =>
                      setEditingCourse({
                        ...editingCourse,

                        degree:
                          event.target
                            .value,
                      })
                    }
                    required
                  >

                    <option value="">
                      Select degree
                    </option>

                    <option value="BSc Software Engineering">
                      BSc Software Engineering
                    </option>

                    <option value="BSc (Hons) Computer Science">
                      BSc (Hons) Computer Science
                    </option>

                    <option value="BSc Data Science">
                      BSc Data Science
                    </option>

                    <option value="BSc (Hons) Data Science">
                      BSc (Hons) Data Science
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
                    value={
                      editingCourse.batch
                    }
                    onChange={(event) =>
                      setEditingCourse({
                        ...editingCourse,

                        batch:
                          event.target
                            .value,
                      })
                    }
                    required
                  >

                    <option value="">
                      Select batch
                    </option>

                    <option value="24.1">
                      24.1
                    </option>

                    <option value="24.2">
                      24.2
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


              {/* OPTIONAL MATERIAL */}

              <div className="lecturer-form-group">

                <label>
                  Replace Course Material
                </label>

                <input
                  type="file"
                  onChange={(event) =>
                    setEditingCourse({
                      ...editingCourse,

                      file:
                        event.target
                          .files?.[0] ||
                        null,
                    })
                  }
                />


                <small
                  style={{
                    color: "#9298ad",
                    marginTop: "6px",
                    display: "block",
                  }}
                >
                  Optional — leave this
                  empty if you want to
                  keep the existing course
                  material.
                </small>

              </div>


              {/* ACTIONS */}

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

    </div>

  );

}


export default LecturerCourses;