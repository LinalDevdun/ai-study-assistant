import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  BookOpen,
  Search,
  GraduationCap,
  Layers3,
  CircleCheckBig,
  ArrowRight,
  LibraryBig,
  CalendarDays,
} from "lucide-react";

import "../styles/myCourses.css";


function MyCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("All");
  const [loading, setLoading] = useState(true);


  /* ========================================
     FETCH COURSES
  ======================================== */

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/courses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCourses(response.data);
      } catch (error) {
        console.error(
          "Error fetching courses:",
          error
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

  const degreeOptions = useMemo(() => {
    const degrees = courses
      .map((course) => course.degree)
      .filter(Boolean);

    return [
      "All",
      ...new Set(degrees),
    ];
  }, [courses]);


  /* ========================================
     SEARCH + FILTER
  ======================================== */

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const searchValue =
        searchTerm.toLowerCase();

      const matchesSearch =
        course.title
          ?.toLowerCase()
          .includes(searchValue) ||
        course.description
          ?.toLowerCase()
          .includes(searchValue) ||
        course.degree
          ?.toLowerCase()
          .includes(searchValue);

      const matchesDegree =
        selectedDegree === "All" ||
        course.degree === selectedDegree;

      return matchesSearch && matchesDegree;
    });
  }, [
    courses,
    searchTerm,
    selectedDegree,
  ]);


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
          <h1>My Courses</h1>

          <p>
            Access your enrolled modules,
            learning materials and course content.
          </p>
        </div>


        <div className="courses-count-badge">
          <BookOpen size={16} />

          {courses.length} Courses
        </div>

      </section>


      {/* ====================================
          SUMMARY
      ==================================== */}

      <section className="courses-summary">

        <div className="course-summary-card summary-purple">

          <div className="course-summary-icon">
            <LibraryBig size={22} />
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


        <div className="course-summary-card summary-blue">

          <div className="course-summary-icon">
            <Layers3 size={22} />
          </div>

          <div>
            <strong>
              {degreeOptions.length > 1
                ? degreeOptions.length - 1
                : 0}
            </strong>

            <span>
              Study Programs
            </span>
          </div>

        </div>


        <div className="course-summary-card summary-green">

          <div className="course-summary-icon">
            <CircleCheckBig size={22} />
          </div>

          <div>
            <strong>
              Active
            </strong>

            <span>
              Current Semester
            </span>
          </div>

        </div>

      </section>


      {/* ====================================
          SEARCH + FILTER
      ==================================== */}

      <section className="courses-toolbar">

        <div className="course-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search your courses..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

        </div>


        <select
          className="course-filter"
          value={selectedDegree}
          onChange={(event) =>
            setSelectedDegree(
              event.target.value
            )
          }
        >

          {degreeOptions.map((degree) => (
            <option
              value={degree}
              key={degree}
            >
              {degree === "All"
                ? "All Programs"
                : degree}
            </option>
          ))}

        </select>

      </section>


      {/* ====================================
          COURSE GRID
      ==================================== */}

      <section className="my-courses-grid">

        {loading ? (

          <div className="courses-empty-state">

            <div className="courses-empty-icon">
              <BookOpen size={26} />
            </div>

            <h3>
              Loading your courses...
            </h3>

            <p>
              Please wait a moment.
            </p>

          </div>

        ) : filteredCourses.length === 0 ? (

          <div className="courses-empty-state">

            <div className="courses-empty-icon">
              <BookOpen size={26} />
            </div>

            <h3>
              No courses found
            </h3>

            <p>
              Try changing your search or
              filter options.
            </p>

          </div>

        ) : (

          filteredCourses.map(
            (course, index) => {

              const theme =
                courseThemes[
                  index %
                    courseThemes.length
                ];

              return (
                <article
                  className="my-course-card"
                  key={course.id}
                >

                  {/* COVER */}
                  <div
                    className={`my-course-cover ${theme}`}
                  >

                    <div className="my-course-icon">
                      <GraduationCap
                        size={27}
                        strokeWidth={1.8}
                      />
                    </div>

                  </div>


                  {/* BODY */}
                  <div className="my-course-body">

                    <div className="my-course-meta">

                      {course.degree && (
                        <span className="course-meta-badge">
                          <GraduationCap
                            size={11}
                          />

                          {course.degree}
                        </span>
                      )}


                      {course.batch && (
                        <span className="course-meta-badge">
                          <CalendarDays
                            size={11}
                          />

                          Batch {course.batch}
                        </span>
                      )}

                    </div>


                    <h3>
                      {course.title}
                    </h3>


                    <p className="my-course-description">

                      {course.description ||
                        "Course materials and learning resources are available for this module."}

                    </p>


                    <div className="my-course-footer">

                      <div className="course-status">

                        <span className="course-status-dot" />

                        Active

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