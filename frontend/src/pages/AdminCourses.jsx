import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import {
  BookOpen,
  Search,
  Plus,
  GraduationCap,
  FileText,
  Users,
  X,
  Upload,
  Pencil,
  Trash2,
} from "lucide-react";

import "../styles/adminCourses.css";


function AdminCourses() {
  const navigate = useNavigate();


  /* ========================================
     COURSES
  ======================================== */

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* ========================================
     LECTURERS
  ======================================== */

  const [lecturers, setLecturers] =
    useState([]);


  /* ========================================
     SEARCH + FILTER
  ======================================== */

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    programFilter,
    setProgramFilter,
  ] = useState("ALL");


  /* ========================================
     VIEW COURSE
  ======================================== */

  const [
    selectedCourse,
    setSelectedCourse,
  ] = useState(null);


  const [
    courseLessons,
    setCourseLessons,
  ] = useState([]);


  const [
    lessonsLoading,
    setLessonsLoading,
  ] = useState(false);


  const [
    lessonsError,
    setLessonsError,
  ] = useState("");


  /* ========================================
     CREATE / EDIT COURSE MODAL
  ======================================== */

  const [
    courseModalOpen,
    setCourseModalOpen,
  ] = useState(false);


  const [
    editingCourse,
    setEditingCourse,
  ] = useState(null);


  const [
    savingCourse,
    setSavingCourse,
  ] = useState(false);


  const [
    formError,
    setFormError,
  ] = useState("");


  const [
    courseForm,
    setCourseForm,
  ] = useState({
    courseTitle: "",
    degree: "",
    batch: "",
    lecturerId: "",
    file: null,
  });


  /* ========================================
     DELETE STATE
  ======================================== */

  const [
    deletingCourseId,
    setDeletingCourseId,
  ] = useState(null);


  /* ========================================
     AUTH ERROR HELPER
  ======================================== */

  const handleAuthError =
    useCallback(
      (error) => {

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

          return true;

        }


        return false;

      },
      [navigate]
    );


  /* ========================================
     LOAD COURSES
  ======================================== */

  const loadCourses =
    useCallback(
      async () => {

        try {

          setLoading(true);

          setError("");


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
              "http://localhost:5000/admin/courses/summary",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          const realCourses =
            response.data.map(
              (course) => ({

                id:
                  course.id,

                title:
                  course.title ||
                  "Untitled Course",

                program:
                  course.degree ||
                  "Not assigned",

                batch:
                  course.batch ||
                  "Not assigned",

                lecturerId:
                  course.lecturer_id ||
                  null,

                lecturer:
                  course.lecturer_name ||
                  "Not assigned",

                filePath:
                  course.file_path ||
                  null,

                students:
                  Number(
                    course.student_count
                  ) || 0,

                lessons:
                  Number(
                    course.lesson_count
                  ) || 0,

                materials:
                  Number(
                    course.material_count
                  ) || 0,

                status:
                  "Active",
              })
            );


          setCourses(
            realCourses
          );


        } catch (error) {

          console.error(
            "Load Courses Error:",
            error
          );


          if (
            handleAuthError(
              error
            )
          ) {
            return;
          }


          setError(
            error.response?.data
              ?.error ||
            "Failed to load courses."
          );


        } finally {

          setLoading(false);

        }

      },
      [
        navigate,
        handleAuthError,
      ]
    );


  /* ========================================
     LOAD LECTURERS
  ======================================== */

  const loadLecturers =
    useCallback(
      async () => {

        try {

          const token =
            localStorage.getItem(
              "token"
            );


          if (!token) {
            return;
          }


          const response =
            await axios.get(
              "http://localhost:5000/admin/users",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          const lecturerUsers =
            response.data.filter(
              (user) =>
                user.role ===
                  "LECTURER" &&
                user.is_active !==
                  false
            );


          setLecturers(
            lecturerUsers
          );


        } catch (error) {

          console.error(
            "Load Lecturers Error:",
            error
          );


          handleAuthError(
            error
          );

        }

      },
      [handleAuthError]
    );


  /* ========================================
     INITIAL LOAD
  ======================================== */

  useEffect(() => {

    loadCourses();

    loadLecturers();

  }, [
    loadCourses,
    loadLecturers,
  ]);


  /* ========================================
     CREATE COURSE MODAL
  ======================================== */

  const openCreateModal = () => {

    setEditingCourse(null);

    setFormError("");

    setCourseForm({
      courseTitle: "",
      degree: "",
      batch: "",
      lecturerId: "",
      file: null,
    });

    setCourseModalOpen(true);

  };


  /* ========================================
     EDIT COURSE MODAL
  ======================================== */

  const openEditModal =
    (course) => {

      setEditingCourse(
        course
      );

      setFormError("");

      setCourseForm({

        courseTitle:
          course.title,

        degree:
          course.program ===
          "Not assigned"
            ? ""
            : course.program,

        batch:
          course.batch ===
          "Not assigned"
            ? ""
            : course.batch,

        lecturerId:
          course.lecturerId
            ? String(
                course.lecturerId
              )
            : "",

        file:
          null,
      });


      setCourseModalOpen(
        true
      );

    };


  /* ========================================
     CLOSE COURSE FORM
  ======================================== */

  const closeCourseModal = () => {

    if (savingCourse) {
      return;
    }


    setCourseModalOpen(false);

    setEditingCourse(null);

    setFormError("");

    setCourseForm({
      courseTitle: "",
      degree: "",
      batch: "",
      lecturerId: "",
      file: null,
    });

  };


  /* ========================================
     CREATE / UPDATE COURSE
  ======================================== */

  const handleSaveCourse =
    async (event) => {

      event.preventDefault();


      if (
        !courseForm.courseTitle.trim()
      ) {

        setFormError(
          "Please enter a course title."
        );

        return;

      }


      if (
        !courseForm.degree.trim()
      ) {

        setFormError(
          "Please enter a program / degree."
        );

        return;

      }


      if (
        !courseForm.batch.trim()
      ) {

        setFormError(
          "Please enter a batch."
        );

        return;

      }


      try {

        setSavingCourse(true);

        setFormError("");


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
          courseForm.courseTitle.trim()
        );


        formData.append(
          "degree",
          courseForm.degree.trim()
        );


        formData.append(
          "batch",
          courseForm.batch.trim()
        );


        formData.append(
          "lecturerId",
          courseForm.lecturerId
        );


        if (
          courseForm.file
        ) {

          formData.append(
            "file",
            courseForm.file
          );

        }


        /* ==============================
           EDIT
        ============================== */

        if (editingCourse) {

          await axios.put(
            `http://localhost:5000/admin/courses/${editingCourse.id}`,
            formData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


          alert(
            "Course updated successfully!"
          );

        }


        /* ==============================
           CREATE
        ============================== */

        else {

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

        }


        setCourseModalOpen(
          false
        );

        setEditingCourse(
          null
        );


        setCourseForm({
          courseTitle: "",
          degree: "",
          batch: "",
          lecturerId: "",
          file: null,
        });


        await loadCourses();


      } catch (error) {

        console.error(
          "Save Course Error:",
          error
        );


        if (
          handleAuthError(
            error
          )
        ) {
          return;
        }


        setFormError(
          error.response?.data
            ?.error ||
          "Failed to save course."
        );


      } finally {

        setSavingCourse(false);

      }

    };


  /* ========================================
     DELETE COURSE
  ======================================== */

  const deleteCourse =
    async (course) => {

      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${course.title}"?\n\nThis action cannot be undone.`
        );


      if (!confirmed) {

        return;

      }


      try {

        setDeletingCourseId(
          course.id
        );


        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {

          navigate("/login");

          return;

        }


        await axios.delete(
          `http://localhost:5000/admin/courses/${course.id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        alert(
          "Course deleted successfully!"
        );


        await loadCourses();


      } catch (error) {

        console.error(
          "Delete Course Error:",
          error
        );


        if (
          handleAuthError(
            error
          )
        ) {
          return;
        }


        alert(
          error.response?.data
            ?.error ||
          "Failed to delete course."
        );


      } finally {

        setDeletingCourseId(
          null
        );

      }

    };


  /* ========================================
     OPEN VIEW COURSE
  ======================================== */

  const openCourseDetails =
    async (course) => {

      setSelectedCourse(
        course
      );

      setCourseLessons([]);

      setLessonsError("");

      setLessonsLoading(true);


      try {

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
            `http://localhost:5000/courses/${course.id}/lessons`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        setCourseLessons(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );


      } catch (error) {

        console.error(
          "Load Lessons Error:",
          error
        );


        if (
          handleAuthError(
            error
          )
        ) {
          return;
        }


        setLessonsError(
          error.response?.data
            ?.error ||
          "Failed to load lessons."
        );


      } finally {

        setLessonsLoading(false);

      }

    };


  /* ========================================
     CLOSE VIEW COURSE
  ======================================== */

  const closeCourseDetails = () => {

    setSelectedCourse(null);

    setCourseLessons([]);

    setLessonsError("");

    setLessonsLoading(false);

  };


  /* ========================================
     ESC KEY
  ======================================== */

  useEffect(() => {

    const handleEscape =
      (event) => {

        if (
          event.key !==
          "Escape"
        ) {
          return;
        }


        if (selectedCourse) {

          closeCourseDetails();

        }


        if (
          courseModalOpen &&
          !savingCourse
        ) {

          setCourseModalOpen(
            false
          );

          setEditingCourse(
            null
          );

          setFormError("");

        }

      };


    window.addEventListener(
      "keydown",
      handleEscape
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleEscape
      );

    };

  }, [
    selectedCourse,
    courseModalOpen,
    savingCourse,
  ]);


  /* ========================================
     PROGRAM OPTIONS
  ======================================== */

  const programOptions =
    useMemo(() => {

      const programs =
        courses
          .map(
            (course) =>
              course.program
          )
          .filter(
            (program) =>
              program &&
              program !==
                "Not assigned"
          );


      return [
        ...new Set(programs),
      ].sort();

    }, [courses]);


  /* ========================================
     FILTER COURSES
  ======================================== */

  const filteredCourses =
    useMemo(() => {

      const search =
        searchTerm
          .toLowerCase()
          .trim();


      return courses.filter(
        (course) => {

          const matchesSearch =

            course.title
              .toLowerCase()
              .includes(search) ||

            course.program
              .toLowerCase()
              .includes(search) ||

            course.batch
              .toLowerCase()
              .includes(search) ||

            course.lecturer
              .toLowerCase()
              .includes(search);


          const matchesProgram =

            programFilter ===
              "ALL" ||

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
     SUMMARY
  ======================================== */

  const totalCourses =
    courses.length;


  const studyPrograms =
    new Set(
      courses
        .map(
          (course) =>
            course.program
        )
        .filter(
          (program) =>
            program &&
            program !==
              "Not assigned"
        )
    ).size;


  const batches =
    new Set(
      courses
        .map(
          (course) =>
            course.batch
        )
        .filter(
          (batch) =>
            batch &&
            batch !==
              "Not assigned"
        )
    ).size;


  const uploadedMaterials =
    courses.reduce(
      (total, course) =>
        total +
        course.materials,
      0
    );


  return (

    <div className="admin-courses-page">


      {/* ====================================
          HEADER
      ==================================== */}

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
          onClick={
            openCreateModal
          }
        >

          <Plus size={16} />

          Create Course

        </button>

      </section>



      {/* ====================================
          SUMMARY
      ==================================== */}

      <section className="ac-summary">


        <div className="ac-summary-card ac-teal">

          <div className="ac-summary-icon">

            <BookOpen size={21} />

          </div>

          <div>

            <strong>
              {totalCourses}
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
              {studyPrograms}
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
              {batches}
            </strong>

            <span>
              Course Batches
            </span>

          </div>

        </div>



        <div className="ac-summary-card ac-orange">

          <div className="ac-summary-icon">

            <FileText size={21} />

          </div>

          <div>

            <strong>
              {uploadedMaterials}
            </strong>

            <span>
              Learning Materials
            </span>

          </div>

        </div>

      </section>



      {/* ====================================
          SEARCH + FILTER
      ==================================== */}

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


          {programOptions.map(
            (program) => (

              <option
                key={program}
                value={program}
              >

                {program}

              </option>

            )
          )}

        </select>

      </section>



      {/* ====================================
          LOADING
      ==================================== */}

      {loading && (

        <div className="ac-empty">

          <BookOpen size={28} />

          <h3>
            Loading courses...
          </h3>

          <p>
            Getting course information
            from PostgreSQL.
          </p>

        </div>

      )}



      {/* ====================================
          ERROR
      ==================================== */}

      {!loading && error && (

        <div className="ac-empty">

          <BookOpen size={28} />

          <h3>
            Unable to load courses
          </h3>

          <p>
            {error}
          </p>

        </div>

      )}



      {/* ====================================
          COURSE GRID
      ==================================== */}

      {!loading &&
        !error && (

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

                  COURSE #{course.id}

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

                      {course.students}{" "}

                      {course.students ===
                      1
                        ? "Student"
                        : "Students"}

                    </span>

                  </div>



                  <div>

                    <FileText
                      size={13}
                    />

                    <span>

                      {course.materials}{" "}

                      {course.materials ===
                      1
                        ? "Material"
                        : "Materials"}

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

                  {course.batch ===
                  "Not assigned"
                    ? "Batch not assigned"
                    : `Batch ${course.batch}`}

                </div>



                {/* =================================
                    ACTIONS
                ================================= */}

                <div
                  className="ac-actions"

                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr auto auto",
                    gap: "8px",
                  }}
                >


                  {/* VIEW */}

                  <button
                    className="ac-edit-button"
                    onClick={() =>
                      openCourseDetails(
                        course
                      )
                    }
                  >

                    View Course

                  </button>



                  {/* EDIT */}

                  <button
                    type="button"
                    onClick={() =>
                      openEditModal(
                        course
                      )
                    }

                    title="Edit Course"

                    style={{
                      width: "42px",
                      height: "42px",
                      border:
                        "1px solid #dbeafe",
                      borderRadius:
                        "10px",
                      background:
                        "#eff6ff",
                      color:
                        "#2563eb",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      cursor:
                        "pointer",
                    }}
                  >

                    <Pencil
                      size={17}
                    />

                  </button>



                  {/* DELETE */}

                  <button
                    type="button"

                    onClick={() =>
                      deleteCourse(
                        course
                      )
                    }

                    disabled={
                      deletingCourseId ===
                      course.id
                    }

                    title="Delete Course"

                    style={{
                      width: "42px",
                      height: "42px",
                      border:
                        "1px solid #fee2e2",
                      borderRadius:
                        "10px",
                      background:
                        "#fef2f2",
                      color:
                        "#ef4444",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      cursor:
                        deletingCourseId ===
                        course.id
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        deletingCourseId ===
                        course.id
                          ? 0.6
                          : 1,
                    }}
                  >

                    <Trash2
                      size={17}
                    />

                  </button>

                </div>

              </article>

            )
          )}

        </section>

      )}



      {/* ====================================
          EMPTY RESULT
      ==================================== */}

      {!loading &&
        !error &&
        filteredCourses.length ===
          0 && (

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



      {/* ====================================
          CREATE / EDIT MODAL
      ==================================== */}

      {courseModalOpen && (

        <div
          className="ac-modal-overlay"

          onClick={
            closeCourseModal
          }

          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            alignItems:
              "flex-start",
            justifyContent:
              "center",
            overflowY: "auto",
            padding:
              "24px 16px",
            boxSizing:
              "border-box",
          }}
        >

          <div
            className="ac-modal"

            onClick={(event) =>
              event.stopPropagation()
            }

            style={{
              width: "100%",
              maxWidth: "680px",
              maxHeight:
                "calc(100vh - 48px)",
              overflowY: "auto",
              position:
                "relative",
            }}
          >


            {/* HEADER */}

            <div
              className="ac-modal-header"

              style={{
                position: "sticky",
                top: 0,
                zIndex: 20,
                background:
                  "#ffffff",
                paddingBottom:
                  "16px",
              }}
            >

              <div>

                <h2>

                  {editingCourse
                    ? "Edit Course"
                    : "Create Course"}

                </h2>

                <p>

                  {editingCourse
                    ? "Update course information."
                    : "Add a new course to CampusLearn."}

                </p>

              </div>


              <button
                type="button"
                onClick={
                  closeCourseModal
                }
                disabled={
                  savingCourse
                }
              >

                <X size={20} />

              </button>

            </div>



            <form
              className="ac-form"
              onSubmit={
                handleSaveCourse
              }
            >


              {/* ERROR */}

              {formError && (

                <div
                  style={{
                    padding:
                      "12px 14px",
                    borderRadius:
                      "10px",
                    background:
                      "#fef2f2",
                    color:
                      "#dc2626",
                    fontSize:
                      "13px",
                  }}
                >

                  {formError}

                </div>

              )}



              {/* TITLE */}

              <div className="ac-form-group">

                <label>
                  Course Title
                </label>

                <input
                  type="text"
                  placeholder="e.g. Cloud Computing"

                  value={
                    courseForm.courseTitle
                  }

                  onChange={(event) =>
                    setCourseForm({
                      ...courseForm,

                      courseTitle:
                        event.target.value,
                    })
                  }

                  required
                />

              </div>



              {/* PROGRAM */}

              <div className="ac-form-group">

                <label>
                  Program / Degree
                </label>

                <input
                  type="text"

                  placeholder="e.g. BSc Computer Science"

                  value={
                    courseForm.degree
                  }

                  onChange={(event) =>
                    setCourseForm({
                      ...courseForm,

                      degree:
                        event.target.value,
                    })
                  }

                  required
                />

              </div>



              {/* BATCH */}

              <div className="ac-form-group">

                <label>
                  Batch
                </label>

                <input
                  type="text"

                  placeholder="e.g. 26.1"

                  value={
                    courseForm.batch
                  }

                  onChange={(event) =>
                    setCourseForm({
                      ...courseForm,

                      batch:
                        event.target.value,
                    })
                  }

                  required
                />

              </div>



              {/* LECTURER */}

              <div className="ac-form-group">

                <label>
                  Lecturer
                </label>

                <select
                  value={
                    courseForm.lecturerId
                  }

                  onChange={(event) =>
                    setCourseForm({
                      ...courseForm,

                      lecturerId:
                        event.target.value,
                    })
                  }
                >

                  <option value="">
                    Not assigned
                  </option>


                  {lecturers.map(
                    (lecturer) => (

                      <option
                        key={
                          lecturer.id
                        }

                        value={
                          lecturer.id
                        }
                      >

                        {lecturer.name}
                        {" - "}
                        {lecturer.email}

                      </option>

                    )
                  )}

                </select>

              </div>



              {/* FILE */}

              <div className="ac-form-group">

                <label>

                  {editingCourse
                    ? "Replace Learning Material (Optional)"
                    : "Learning Material (Optional)"}

                </label>


                {editingCourse &&
                  editingCourse.filePath && (

                  <div
                    style={{
                      padding:
                        "10px 12px",
                      marginBottom:
                        "10px",
                      borderRadius:
                        "8px",
                      background:
                        "#ecfdf5",
                      color:
                        "#047857",
                      fontSize:
                        "12px",
                    }}
                  >

                    Current course material
                    is uploaded.

                    If you do not choose
                    another file, the
                    existing material will
                    remain unchanged.

                  </div>

                )}


                <div
                  style={{
                    border:
                      "1px dashed #cbd5e1",
                    borderRadius:
                      "12px",
                    padding:
                      "16px",
                    background:
                      "#f8fafc",
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "10px",
                      marginBottom:
                        "10px",
                    }}
                  >

                    <Upload
                      size={19}
                    />

                    <span
                      style={{
                        fontSize:
                          "13px",
                      }}
                    >

                      {editingCourse
                        ? "Choose a new file only if you want to replace it"
                        : "Upload course material"}

                    </span>

                  </div>


                  <input
                    type="file"

                    onChange={(event) =>
                      setCourseForm({
                        ...courseForm,

                        file:
                          event.target
                            .files?.[0] ||
                          null,
                      })
                    }
                  />

                </div>

              </div>



              {/* BUTTONS */}

              <div className="ac-modal-actions">

                <button
                  type="button"
                  className="ac-cancel-button"

                  onClick={
                    closeCourseModal
                  }

                  disabled={
                    savingCourse
                  }
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="ac-save-button"

                  disabled={
                    savingCourse
                  }
                >

                  {savingCourse
                    ? editingCourse
                      ? "Saving..."
                      : "Creating..."
                    : editingCourse
                      ? "Save Changes"
                      : "Create Course"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}



      {/* ====================================
          VIEW COURSE MODAL
      ==================================== */}

      {selectedCourse && (

        <div
          className="ac-modal-overlay"

          onClick={
            closeCourseDetails
          }

          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems:
              "flex-start",
            justifyContent:
              "center",
            overflowY: "auto",
            padding:
              "24px 16px",
            boxSizing:
              "border-box",
          }}
        >

          <div
            className="ac-modal"

            onClick={(event) =>
              event.stopPropagation()
            }

            style={{
              width: "100%",
              maxWidth: "720px",
              maxHeight:
                "calc(100vh - 48px)",
              overflowY: "auto",
              position:
                "relative",
            }}
          >


            <div
              className="ac-modal-header"

              style={{
                position: "sticky",
                top: 0,
                zIndex: 20,
                background:
                  "#ffffff",
                paddingBottom:
                  "16px",
              }}
            >

              <div>

                <h2>
                  Course Details
                </h2>

                <p>
                  Course, lecturer and
                  lesson information.
                </p>

              </div>


              <button
                type="button"

                onClick={
                  closeCourseDetails
                }
              >

                <X size={20} />

              </button>

            </div>



            <div className="ac-form">


              <div className="ac-form-group">

                <label>
                  Course Title
                </label>

                <input
                  value={
                    selectedCourse.title
                  }
                  readOnly
                />

              </div>



              <div className="ac-form-row">


                <div className="ac-form-group">

                  <label>
                    Database Course ID
                  </label>

                  <input
                    value={
                      selectedCourse.id
                    }
                    readOnly
                  />

                </div>


                <div className="ac-form-group">

                  <label>
                    Batch
                  </label>

                  <input
                    value={
                      selectedCourse.batch
                    }
                    readOnly
                  />

                </div>

              </div>



              <div className="ac-form-group">

                <label>
                  Program
                </label>

                <input
                  value={
                    selectedCourse.program
                  }
                  readOnly
                />

              </div>



              <div className="ac-form-group">

                <label>
                  Lecturer
                </label>

                <input
                  value={
                    selectedCourse.lecturer
                  }
                  readOnly
                />

              </div>



              <div className="ac-form-row">


                <div className="ac-form-group">

                  <label>
                    Students
                  </label>

                  <input
                    value={
                      selectedCourse.students
                    }
                    readOnly
                  />

                </div>


                <div className="ac-form-group">

                  <label>
                    Learning Materials
                  </label>

                  <input
                    value={
                      selectedCourse.materials
                    }
                    readOnly
                  />

                </div>

              </div>



              <div className="ac-form-group">

                <label>
                  Lessons
                </label>

                <input
                  value={
                    selectedCourse.lessons
                  }
                  readOnly
                />

              </div>



              <div className="ac-form-group">

                <label>
                  Main Course Material
                </label>

                <input
                  value={
                    selectedCourse.filePath
                      ? "Uploaded"
                      : "Not uploaded"
                  }
                  readOnly
                />

              </div>



              {/* =================================
                  LESSONS
              ================================= */}

              <div className="ac-form-group">

                <label>
                  Course Lessons
                </label>


                {lessonsLoading && (

                  <div
                    style={{
                      padding:
                        "20px",
                      textAlign:
                        "center",
                      border:
                        "1px solid #e2e8f0",
                      borderRadius:
                        "12px",
                    }}
                  >

                    Loading lessons...

                  </div>

                )}



                {!lessonsLoading &&
                  lessonsError && (

                  <div
                    style={{
                      padding:
                        "15px",
                      color:
                        "#dc2626",
                    }}
                  >

                    {lessonsError}

                  </div>

                )}



                {!lessonsLoading &&
                  !lessonsError &&
                  courseLessons.length ===
                    0 && (

                  <div
                    style={{
                      padding:
                        "20px",
                      textAlign:
                        "center",
                      border:
                        "1px solid #e2e8f0",
                      borderRadius:
                        "12px",
                      background:
                        "#f8fafc",
                    }}
                  >

                    <BookOpen
                      size={22}
                    />

                    <p>
                      No lessons have been
                      added to this course
                      yet.
                    </p>

                  </div>

                )}



                {!lessonsLoading &&
                  !lessonsError &&
                  courseLessons.length >
                    0 && (

                  <div
                    style={{
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      gap: "10px",
                    }}
                  >

                    {courseLessons.map(
                      (
                        lesson,
                        index
                      ) => (

                        <div
                          key={
                            lesson.id ||
                            index
                          }

                          style={{
                            padding:
                              "14px",
                            border:
                              "1px solid #e2e8f0",
                            borderRadius:
                              "12px",
                            background:
                              "#f8fafc",
                          }}
                        >

                          <strong>

                            Lesson{" "}

                            {lesson.order_number ||
                              index + 1}

                            :{" "}

                            {lesson.title ||
                              `Lesson ${
                                index + 1
                              }`}

                          </strong>


                          {lesson.description && (

                            <p
                              style={{
                                marginBottom:
                                  0,
                              }}
                            >

                              {
                                lesson.description
                              }

                            </p>

                          )}

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>



              <div className="ac-modal-actions">

                <button
                  type="button"
                  className="ac-cancel-button"

                  onClick={
                    closeCourseDetails
                  }
                >

                  Close

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}


export default AdminCourses;