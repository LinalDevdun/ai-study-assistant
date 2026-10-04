import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  BookOpen,
  Search,
  GraduationCap,
  Layers3,
  ArrowRight,
  LibraryBig,
  CalendarDays,
  UserRound,
  FileText,
} from "lucide-react";

import "../styles/myCourses.css";


function MyCourses() {

  const navigate =
    useNavigate();


  /* ========================================
     STATE
  ======================================== */

  const [
    courses,
    setCourses,
  ] = useState([]);


  const [
    student,
    setStudent,
  ] = useState({
    name: "",
    degree: "",
    batch: "",
  });


  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");


  const [
    selectedDegree,
    setSelectedDegree,
  ] = useState("All");


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  /* ========================================
     FETCH REAL STUDENT COURSES
  ======================================== */

  useEffect(() => {

    const fetchCourses =
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
              "http://localhost:5000/student/dashboard",
              {
                headers: {

                  Authorization:
                    `Bearer ${token}`,

                },
              }
            );


          setStudent(
            response.data.student || {}
          );


          setCourses(
            response.data.courses || []
          );


        } catch (error) {

          console.error(
            "Error fetching student courses:",
            error
          );


          /* =================================
             LOGIN / TOKEN ERROR
          ================================= */

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

            localStorage.removeItem(
              "user"
            );

            navigate("/login");

            return;

          }


          /* =================================
             MAINTENANCE MODE
          ================================= */

          if (
            error.response?.status ===
            503
          ) {

            setError(
              error.response?.data
                ?.error ||
              "CampusLearn is currently under maintenance."
            );

            return;

          }


          setError(
            error.response?.data
              ?.error ||
            "Failed to load your courses."
          );


        } finally {

          setLoading(false);

        }

      };


    fetchCourses();

  }, [navigate]);


  /* ========================================
     AVAILABLE DEGREE FILTERS
  ======================================== */

  const degreeOptions =
    useMemo(() => {

      const degrees =
        courses
          .map(
            (course) =>
              course.degree
          )
          .filter(Boolean);


      return [
        "All",
        ...new Set(degrees),
      ];

    }, [courses]);


  /* ========================================
     SEARCH + FILTER
  ======================================== */

  const filteredCourses =
    useMemo(() => {

      const searchValue =
        searchTerm
          .trim()
          .toLowerCase();


      return courses.filter(
        (course) => {

          const matchesSearch =
            !searchValue ||

            course.title
              ?.toLowerCase()
              .includes(
                searchValue
              ) ||

            course.degree
              ?.toLowerCase()
              .includes(
                searchValue
              ) ||

            course.lecturer_name
              ?.toLowerCase()
              .includes(
                searchValue
              );


          const matchesDegree =
            selectedDegree ===
              "All" ||

            course.degree ===
              selectedDegree;


          return (
            matchesSearch &&
            matchesDegree
          );

        }
      );

    }, [
      courses,
      searchTerm,
      selectedDegree,
    ]);


  /* ========================================
     REAL LEARNING RESOURCE COUNT
  ======================================== */

  const learningResources =
    useMemo(() => {

      return courses.reduce(
        (
          total,
          course
        ) => {

          const mainMaterial =
            course.has_material
              ? 1
              : 0;


          const lessons =
            Number(
              course.lesson_count
            ) || 0;


          return (
            total +
            mainMaterial +
            lessons
          );

        },
        0
      );

    }, [courses]);


  /* ========================================
     CARD THEMES
  ======================================== */

  const courseThemes = [

    "course-theme-1",

    "course-theme-2",

    "course-theme-3",

    "course-theme-4",

    "course-theme-5",

    "course-theme-6",

  ];


  return (

    <div className="my-courses-page">


      {/* ====================================
          HEADER
      ==================================== */}

      <section className="my-courses-header">

        <div>

          <h1>
            My Courses
          </h1>


          <p>
            Access your enrolled modules,
            learning materials and course
            content.
          </p>

        </div>


        <div className="courses-count-badge">

          <BookOpen size={16} />

          {courses.length}{" "}

          {courses.length === 1
            ? "Course"
            : "Courses"}

        </div>

      </section>



      {/* ====================================
          SUMMARY
      ==================================== */}

      <section className="courses-summary">


        {/* ENROLLED COURSES */}

        <div className="course-summary-card summary-purple">

          <div className="course-summary-icon">

            <LibraryBig
              size={22}
            />

          </div>


          <div>

            <strong>
              {courses.length}
            </strong>

            <span>
              Enrolled Courses
            </span>

          </div>

        </div>



        {/* LEARNING RESOURCES */}

        <div className="course-summary-card summary-blue">

          <div className="course-summary-icon">

            <FileText
              size={22}
            />

          </div>


          <div>

            <strong>
              {learningResources}
            </strong>

            <span>
              Learning Resources
            </span>

          </div>

        </div>



        {/* BATCH */}

        <div className="course-summary-card summary-green">

          <div className="course-summary-icon">

            <Layers3
              size={22}
            />

          </div>


          <div>

            <strong>

              {student.batch ||
                "—"}

            </strong>

            <span>
              Current Batch
            </span>

          </div>

        </div>

      </section>



      {/* ====================================
          STUDENT PROGRAM INFO
      ==================================== */}

      {student.degree && (

        <section
          className="courses-toolbar"
          style={{
            marginBottom: "18px",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >

            <GraduationCap
              size={18}
            />


            <div>

              <strong>
                {student.degree}
              </strong>


              {student.batch && (

                <span
                  style={{
                    marginLeft:
                      "8px",
                  }}
                >

                  • Batch{" "}
                  {student.batch}

                </span>

              )}

            </div>

          </div>

        </section>

      )}



      {/* ====================================
          SEARCH + FILTER
      ==================================== */}

      <section className="courses-toolbar">


        <div className="course-search">

          <Search
            size={17}
          />


          <input
            type="text"

            placeholder="Search your courses..."

            value={
              searchTerm
            }

            onChange={
              (event) =>
                setSearchTerm(
                  event.target.value
                )
            }
          />

        </div>



        <select
          className="course-filter"

          value={
            selectedDegree
          }

          onChange={
            (event) =>
              setSelectedDegree(
                event.target.value
              )
          }
        >

          {degreeOptions.map(
            (degree) => (

              <option
                value={degree}
                key={degree}
              >

                {degree === "All"
                  ? "All Programs"
                  : degree}

              </option>

            )
          )}

        </select>

      </section>



      {/* ====================================
          COURSE GRID
      ==================================== */}

      <section className="my-courses-grid">


        {/* LOADING */}

        {loading ? (

          <div className="courses-empty-state">

            <div className="courses-empty-icon">

              <BookOpen
                size={26}
              />

            </div>


            <h3>
              Loading your courses...
            </h3>


            <p>
              Please wait a moment.
            </p>

          </div>


        ) : error ? (


          /* ERROR */

          <div className="courses-empty-state">

            <div className="courses-empty-icon">

              <BookOpen
                size={26}
              />

            </div>


            <h3>
              Unable to load courses
            </h3>


            <p>
              {error}
            </p>

          </div>


        ) : filteredCourses.length ===
          0 ? (


          /* EMPTY */

          <div className="courses-empty-state">

            <div className="courses-empty-icon">

              <BookOpen
                size={26}
              />

            </div>


            <h3>
              No courses found
            </h3>


            <p>

              {searchTerm ||
              selectedDegree !==
                "All"

                ? "Try changing your search or filter options."

                : student.degree ||
                  student.batch

                  ? `No courses are currently assigned to ${
                      student.degree ||
                      "your program"
                    }${
                      student.batch
                        ? `, Batch ${student.batch}`
                        : ""
                    }.`

                  : "Your degree and batch have not been assigned yet."}

            </p>

          </div>


        ) : (


          /* REAL COURSES */

          filteredCourses.map(
            (
              course,
              index
            ) => {

              const theme =
                courseThemes[
                  index %
                    courseThemes.length
                ];


              const lessonCount =
                Number(
                  course.lesson_count
                ) || 0;


              return (

                <article
                  className="my-course-card"
                  key={
                    course.id
                  }
                >


                  {/* ==========================
                      COVER
                  ========================== */}

                  <div
                    className={
                      `my-course-cover ${theme}`
                    }
                  >

                    <div className="my-course-icon">

                      <GraduationCap
                        size={27}
                        strokeWidth={
                          1.8
                        }
                      />

                    </div>

                  </div>



                  {/* ==========================
                      BODY
                  ========================== */}

                  <div className="my-course-body">


                    {/* META */}

                    <div className="my-course-meta">

                      {course.degree && (

                        <span className="course-meta-badge">

                          <GraduationCap
                            size={11}
                          />

                          {
                            course.degree
                          }

                        </span>

                      )}


                      {course.batch && (

                        <span className="course-meta-badge">

                          <CalendarDays
                            size={11}
                          />

                          Batch{" "}
                          {
                            course.batch
                          }

                        </span>

                      )}

                    </div>



                    {/* TITLE */}

                    <h3>

                      {course.title}

                    </h3>



                    {/* REAL COURSE INFO */}

                    <p className="my-course-description">

                      <UserRound
                        size={13}
                        style={{
                          marginRight:
                            "5px",
                          verticalAlign:
                            "middle",
                        }}
                      />

                      Lecturer:{" "}

                      {course
                        .lecturer_name ||
                        "Not assigned"}

                      <br />

                      <BookOpen
                        size={13}
                        style={{
                          marginRight:
                            "5px",
                          verticalAlign:
                            "middle",
                        }}
                      />

                      {lessonCount}{" "}

                      {lessonCount === 1
                        ? "lesson"
                        : "lessons"}

                    </p>



                    {/* FOOTER */}

                    <div className="my-course-footer">


                      <div className="course-status">

                        <span className="course-status-dot" />


                        {course.has_material
                          ? "Material available"
                          : "No main material"}

                      </div>



                      <button
                        className="open-course-button"

                        onClick={() =>
                          navigate(
                            `/course/${course.id}`
                          )
                        }
                      >

                        Open Course

                        <ArrowRight
                          size={14}
                        />

                      </button>

                    </div>

                  </div>

                </article>

              );

            }
          )

        )}

      </section>

    </div>

  );

}


export default MyCourses;