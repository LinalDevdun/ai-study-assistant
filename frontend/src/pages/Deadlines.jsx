import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  CalendarDays,
  Clock3,
  Search,
  AlertTriangle,
  CalendarClock,
  CircleCheckBig,
  GraduationCap,
  ArrowRight,
  Inbox,
} from "lucide-react";

import "../styles/deadlines.css";


function Deadlines() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [filter, setFilter] = useState("all");


  /* ========================================
     FETCH ASSIGNMENTS
  ======================================== */

  useEffect(() => {

    const fetchDeadlines = async () => {

      try {

        const token =
          localStorage.getItem("token");


        if (!token) {
          navigate("/login");
          return;
        }


        const response =
          await axios.get(
            "http://localhost:5000/assignments",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        setAssignments(
          Array.isArray(response.data)
            ? response.data
            : []
        );


      } catch (error) {

        console.error(
          "Error fetching deadlines:",
          error
        );


      } finally {

        setLoading(false);

      }

    };


    fetchDeadlines();

  }, [navigate]);


  /* ========================================
     DAYS LEFT
  ======================================== */

  const getDaysLeft = (dueDate) => {

    if (!dueDate) return null;


    const today = new Date();

    const due = new Date(dueDate);


    today.setHours(0, 0, 0, 0);

    due.setHours(0, 0, 0, 0);


    const difference =
      due.getTime() - today.getTime();


    return Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );

  };


  /* ========================================
     DEADLINE STATUS
  ======================================== */

  const getDeadlineStatus = (
    dueDate
  ) => {

    const days =
      getDaysLeft(dueDate);


    if (days === null)
      return "upcoming";


    if (days <= 2)
      return "urgent";


    if (days <= 7)
      return "soon";


    return "upcoming";

  };


  /* ========================================
     COUNTS
  ======================================== */

  const validDeadlines =
    assignments.filter(
      (assignment) =>
        assignment.due_date
    );


  const urgentCount =
    validDeadlines.filter(
      (assignment) => {

        const days =
          getDaysLeft(
            assignment.due_date
          );


        return (
          days !== null &&
          days >= 0 &&
          days <= 2
        );

      }
    ).length;


  const thisWeekCount =
    validDeadlines.filter(
      (assignment) => {

        const days =
          getDaysLeft(
            assignment.due_date
          );


        return (
          days !== null &&
          days >= 0 &&
          days <= 7
        );

      }
    ).length;


  const completedCount =
    assignments.filter(
      (assignment) =>
        assignment.is_submitted ||
        assignment.is_graded
    ).length;


  /* ========================================
     SEARCH + FILTER
  ======================================== */

  const filteredDeadlines =
    useMemo(() => {

      return validDeadlines
        .filter((assignment) => {

          const search =
            searchTerm.toLowerCase();


          const matchesSearch =
            assignment.title
              ?.toLowerCase()
              .includes(search) ||

            assignment.description
              ?.toLowerCase()
              .includes(search) ||

            assignment.degree
              ?.toLowerCase()
              .includes(search);


          const days =
            getDaysLeft(
              assignment.due_date
            );


          let matchesFilter = true;


          if (filter === "urgent") {

            matchesFilter =
              days !== null &&
              days >= 0 &&
              days <= 2;

          }


          if (filter === "week") {

            matchesFilter =
              days !== null &&
              days >= 0 &&
              days <= 7;

          }


          if (filter === "future") {

            matchesFilter =
              days !== null &&
              days > 7;

          }


          return (
            matchesSearch &&
            matchesFilter
          );

        })

        .sort(
          (a, b) =>
            new Date(a.due_date) -
            new Date(b.due_date)
        );

    }, [
      assignments,
      searchTerm,
      filter,
    ]);


  /* ========================================
     DATE HELPERS
  ======================================== */

  const getDay = (date) =>
    new Date(date).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
      }
    );


  const getMonth = (date) =>
    new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
      }
    );


  const formatDate = (date) =>
    new Date(date).toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );


  return (
    <div className="deadlines-page">

      {/* HEADER */}
      <section className="deadlines-header">

        <div>

          <h1>
            Deadlines
          </h1>

          <p>
            Stay ahead of your upcoming
            coursework and submission dates.
          </p>

        </div>


        <div className="deadlines-header-badge">

          <CalendarClock size={16} />

          {validDeadlines.length}
          {" "}
          Upcoming

        </div>

      </section>


      {/* SUMMARY */}
      <section className="deadlines-summary">

        <div className="deadline-summary-card deadline-summary-purple">

          <div className="deadline-summary-icon">
            <CalendarDays size={21} />
          </div>

          <div>

            <strong>
              {validDeadlines.length}
            </strong>

            <span>
              Total Deadlines
            </span>

          </div>

        </div>


        <div className="deadline-summary-card deadline-summary-red">

          <div className="deadline-summary-icon">
            <AlertTriangle size={21} />
          </div>

          <div>

            <strong>
              {urgentCount}
            </strong>

            <span>
              Urgent
            </span>

          </div>

        </div>


        <div className="deadline-summary-card deadline-summary-orange">

          <div className="deadline-summary-icon">
            <Clock3 size={21} />
          </div>

          <div>

            <strong>
              {thisWeekCount}
            </strong>

            <span>
              Due This Week
            </span>

          </div>

        </div>


        <div className="deadline-summary-card deadline-summary-green">

          <div className="deadline-summary-icon">
            <CircleCheckBig size={21} />
          </div>

          <div>

            <strong>
              {completedCount}
            </strong>

            <span>
              Submitted
            </span>

          </div>

        </div>

      </section>


      {/* TOOLBAR */}
      <section className="deadlines-toolbar">

        <div className="deadlines-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search deadlines..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>


        <select
          className="deadlines-filter"
          value={filter}
          onChange={(event) =>
            setFilter(
              event.target.value
            )
          }
        >

          <option value="all">
            All Deadlines
          </option>

          <option value="urgent">
            Urgent
          </option>

          <option value="week">
            Due This Week
          </option>

          <option value="future">
            Later Deadlines
          </option>

        </select>

      </section>


      {/* LIST */}
      <section className="deadline-list">

        {loading ? (

          <div className="deadlines-empty">

            <div className="deadlines-empty-icon">
              <CalendarDays size={26} />
            </div>

            <h3>
              Loading deadlines...
            </h3>

            <p>
              Please wait a moment.
            </p>

          </div>

        ) : filteredDeadlines.length === 0 ? (

          <div className="deadlines-empty">

            <div className="deadlines-empty-icon">
              <Inbox size={27} />
            </div>

            <h3>
              No deadlines found
            </h3>

            <p>
              There are currently no deadlines
              matching your selected filter.
            </p>

          </div>

        ) : (

          filteredDeadlines.map(
            (assignment) => {

              const days =
                getDaysLeft(
                  assignment.due_date
                );


              const status =
                getDeadlineStatus(
                  assignment.due_date
                );


              return (
                <article
                  className="deadline-card"
                  key={assignment.id}
                >

                  {/* DATE */}
                  <div
                    className={`deadline-date-box deadline-date-${status}`}
                  >

                    <strong>
                      {getDay(
                        assignment.due_date
                      )}
                    </strong>

                    <span>
                      {getMonth(
                        assignment.due_date
                      )}
                    </span>

                  </div>


                  {/* DETAILS */}
                  <div className="deadline-details">

                    <div className="deadline-title-row">

                      <h3>
                        {assignment.title}
                      </h3>


                      <span
                        className={`deadline-status deadline-status-${status}`}
                      >

                        {status ===
                          "urgent"
                          ? "Urgent"
                          : status ===
                              "soon"
                            ? "Due Soon"
                            : "Upcoming"}

                      </span>

                    </div>


                    <p className="deadline-description">

                      {assignment.description ||
                        "Complete and submit this assignment before the due date."}

                    </p>


                    <div className="deadline-meta">

                      <span className="deadline-meta-item">

                        <CalendarDays
                          size={11}
                        />

                        {formatDate(
                          assignment.due_date
                        )}

                      </span>


                      {assignment.degree && (

                        <span className="deadline-meta-item">

                          <GraduationCap
                            size={11}
                          />

                          {assignment.degree}

                        </span>

                      )}


                      {assignment.batch && (

                        <span className="deadline-meta-item">

                          Batch{" "}
                          {assignment.batch}

                        </span>

                      )}

                    </div>

                  </div>


                  {/* ACTION */}
                  <div className="deadline-action">

                    <span className="deadline-days-left">

                      {days < 0
                        ? "Deadline passed"
                        : days === 0
                          ? "Due today"
                          : days === 1
                            ? "1 day left"
                            : `${days} days left`}

                    </span>


                    <button
                      className="deadline-open-button"
                      onClick={() =>
                        navigate(
                          "/assignments"
                        )
                      }
                    >

                      View Assignment

                      <ArrowRight
                        size={14}
                      />

                    </button>

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

export default Deadlines;