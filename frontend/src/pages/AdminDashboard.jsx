import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  Users,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  UserPlus,
  BarChart3,
  Settings,
  CalendarDays,
  Database,
  Server,
  CircleCheckBig,
  ArrowRight,
} from "lucide-react";

import "../styles/adminDashboard.css";


function AdminDashboard() {

  const navigate =
    useNavigate();


  /* ========================================
     LOGGED-IN ADMIN
  ======================================== */

  const [
    admin,
    setAdmin,
  ] = useState({
    name: "Admin",
    email: "",
    role: "ADMIN",
  });


  /* ========================================
     REPORT / DASHBOARD DATA
  ======================================== */

  const [
    reportData,
    setReportData,
  ] = useState(null);


  const [
    recentUsers,
    setRecentUsers,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  /* ========================================
     AUTH ERROR
  ======================================== */

  const handleAuthError =
    useCallback(
      (error) => {

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
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

          return true;

        }


        return false;

      },
      [navigate]
    );


  /* ========================================
     INITIALS
  ======================================== */

  const getInitials =
    (name = "") => {

      const words =
        name
          .trim()
          .split(/\s+/)
          .filter(Boolean);


      if (words.length === 0) {

        return "U";

      }


      if (words.length === 1) {

        return words[0]
          .charAt(0)
          .toUpperCase();

      }


      return (
        words[0]
          .charAt(0) +
        words[
          words.length - 1
        ].charAt(0)
      ).toUpperCase();

    };


  /* ========================================
     FORMAT ROLE
  ======================================== */

  const formatRole =
    (role) => {

      if (!role) {

        return "User";

      }


      const upper =
        role.toUpperCase();


      if (upper === "ADMIN") {

        return "Admin";

      }


      if (upper === "LECTURER") {

        return "Lecturer";

      }


      if (upper === "STUDENT") {

        return "Student";

      }


      return role;

    };


  /* ========================================
     FORMAT LAST LOGIN
  ======================================== */

  const formatLastLogin =
    (value) => {

      if (!value) {

        return "Never";

      }


      const date =
        new Date(value);


      if (
        Number.isNaN(
          date.getTime()
        )
      ) {

        return "Never";

      }


      return date.toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      );

    };


  /* ========================================
     LOAD DASHBOARD DATA
  ======================================== */

  const loadDashboard =
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


          const config = {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          };


          const [
            adminResponse,
            reportsResponse,
            usersResponse,
          ] =
            await Promise.all([

              axios.get(
                "http://localhost:5000/me",
                config
              ),

              axios.get(
                "http://localhost:5000/admin/reports/overview",
                config
              ),

              axios.get(
                "http://localhost:5000/admin/users",
                config
              ),

            ]);


          /* ==============================
             ADMIN
          ============================== */

          setAdmin(
            adminResponse.data
          );


          /* ==============================
             REPORT DATA
          ============================== */

          setReportData(
            reportsResponse.data
          );


          /* ==============================
             LATEST USER ACCOUNTS

             We do not currently store
             created_at for users, so we
             use the highest IDs as the
             newest account records.
          ============================== */

          const users =
            Array.isArray(
              usersResponse.data
            )
              ? usersResponse.data
              : [];


          const latestUsers =
            [...users]
              .sort(
                (a, b) =>
                  Number(b.id) -
                  Number(a.id)
              )
              .slice(0, 5)
              .map(
                (user) => ({

                  id:
                    user.id,

                  name:
                    user.name ||
                    "Unknown User",

                  initials:
                    getInitials(
                      user.name
                    ),

                  email:
                    user.email ||
                    "No email",

                  role:
                    formatRole(
                      user.role
                    ),

                  lastLogin:
                    formatLastLogin(
                      user.last_login
                    ),

                  active:
                    user.is_active !==
                    false,

                })
              );


          setRecentUsers(
            latestUsers
          );


        } catch (error) {

          console.error(
            "Admin Dashboard Error:",
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
            "Failed to load dashboard data."
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
     INITIAL LOAD
  ======================================== */

  useEffect(() => {

    loadDashboard();

  }, [loadDashboard]);


  /* ========================================
     SAFE DATA
  ======================================== */

  const summary =
    reportData?.summary || {

      total_users: 0,

      students: 0,

      lecturers: 0,

      administrators: 0,

      active_accounts: 0,

      active_courses: 0,

      average_score: 0,

    };


  const distribution =
    reportData
      ?.user_distribution || {

      students: 0,

      lecturers: 0,

      administrators: 0,

      active_accounts: 0,

    };


  /* ========================================
     STAT CARDS
  ======================================== */

  const stats = [

    {
      label:
        "Total Users",

      value:
        summary.total_users,

      icon:
        Users,

      className:
        "ad-stat-teal",
    },

    {
      label:
        "Students",

      value:
        summary.students,

      icon:
        GraduationCap,

      className:
        "ad-stat-purple",
    },

    {
      label:
        "Lecturers",

      value:
        summary.lecturers,

      icon:
        Users,

      className:
        "ad-stat-blue",
    },

    {
      label:
        "Active Courses",

      value:
        summary.active_courses,

      icon:
        BookOpen,

      className:
        "ad-stat-orange",
    },

  ];


  /* ========================================
     USER DISTRIBUTION
  ======================================== */

  const userDistribution = [

    {
      label:
        "Students",

      count:
        distribution.students,

      description:
        "Registered student accounts",

      icon:
        GraduationCap,

      className:
        "ad-role-student",
    },

    {
      label:
        "Lecturers",

      count:
        distribution.lecturers,

      description:
        "Teaching staff accounts",

      icon:
        Users,

      className:
        "ad-role-lecturer",
    },

    {
      label:
        "Administrators",

      count:
        distribution.administrators,

      description:
        "System administrator accounts",

      icon:
        ShieldCheck,

      className:
        "ad-role-admin",
    },

  ];


  /* ========================================
     DATE
  ======================================== */

  const currentDate =
    new Date()
      .toLocaleDateString(
        "en-US",
        {
          weekday: "short",
          month: "short",
          day: "numeric",
        }
      );


  /* ========================================
     LOADING
  ======================================== */

  if (loading) {

    return (

      <div className="admin-dashboard-page">

        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >

          <h2>
            Loading Dashboard...
          </h2>

          <p>
            Getting real CampusLearn
            data from PostgreSQL.
          </p>

        </div>

      </div>

    );

  }


  return (

    <div className="admin-dashboard-page">


      {/* ====================================
          HEADER
      ==================================== */}

      <section className="ad-header">

        <div>

          <h1>
            Welcome back, {admin.name} 👋
          </h1>

          <p>
            Monitor users, courses and
            system activity across CampusLearn.
          </p>

        </div>


        <div className="ad-date">

          <CalendarDays
            size={15}
          />

          {currentDate}

        </div>

      </section>



      {/* ====================================
          ERROR
      ==================================== */}

      {error && (

        <div
          style={{
            marginBottom: "22px",
            padding: "14px 16px",
            borderRadius: "10px",
            background: "#fef2f2",
            border:
              "1px solid #fecaca",
            color: "#dc2626",
            fontWeight: 600,
          }}
        >

          {error}

        </div>

      )}



      {/* ====================================
          STATS
      ==================================== */}

      <section className="ad-stats">

        {stats.map(
          (stat) => {

            const Icon =
              stat.icon;


            return (

              <div
                className={
                  `ad-stat-card ${stat.className}`
                }
                key={
                  stat.label
                }
              >

                <div className="ad-stat-icon">

                  <Icon
                    size={22}
                  />

                </div>


                <div>

                  <strong>
                    {stat.value}
                  </strong>

                  <span>
                    {stat.label}
                  </span>

                </div>

              </div>

            );

          }
        )}

      </section>



      {/* ====================================
          OVERVIEW
      ==================================== */}

      <section className="ad-main-grid">


        {/* ==================================
            USER DISTRIBUTION
        ================================== */}

        <div className="ad-panel">

          <div className="ad-panel-header">

            <div>

              <h2>
                User Distribution
              </h2>

              <p>
                Overview of registered
                CampusLearn users.
              </p>

            </div>


            <button
              className="ad-panel-link"

              onClick={() =>
                navigate(
                  "/admin-users"
                )
              }
            >

              Manage Users

              <ArrowRight
                size={13}
              />

            </button>

          </div>



          <div className="ad-user-distribution">

            {userDistribution.map(
              (role) => {

                const Icon =
                  role.icon;


                return (

                  <div
                    className="ad-role-row"
                    key={
                      role.label
                    }
                  >

                    <div
                      className={
                        `ad-role-icon ${role.className}`
                      }
                    >

                      <Icon
                        size={18}
                      />

                    </div>


                    <div className="ad-role-info">

                      <strong>
                        {role.label}
                      </strong>

                      <span>
                        {role.description}
                      </span>

                    </div>


                    <div className="ad-role-count">

                      {role.count}

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </div>



        {/* ==================================
            SYSTEM STATUS
        ================================== */}

        <div className="ad-panel">

          <div className="ad-panel-header">

            <div>

              <h2>
                System Status
              </h2>

              <p>
                Current CampusLearn
                service availability.
              </p>

            </div>

          </div>



          <div className="ad-system-list">


            {/* DATABASE */}

            <div className="ad-system-item">

              <div className="ad-system-left">

                <div className="ad-system-icon">

                  <Database
                    size={17}
                  />

                </div>


                <div>

                  <strong>
                    PostgreSQL Database
                  </strong>

                  <span>
                    Primary application
                    database
                  </span>

                </div>

              </div>


              <span className="ad-status-online">

                Connected

              </span>

            </div>



            {/* BACKEND */}

            <div className="ad-system-item">

              <div className="ad-system-left">

                <div className="ad-system-icon">

                  <Server
                    size={17}
                  />

                </div>


                <div>

                  <strong>
                    Backend API
                  </strong>

                  <span>
                    Node.js / Express
                    service
                  </span>

                </div>

              </div>


              <span className="ad-status-online">

                Online

              </span>

            </div>



            {/* AUTH */}

            <div className="ad-system-item">

              <div className="ad-system-left">

                <div className="ad-system-icon">

                  <CircleCheckBig
                    size={17}
                  />

                </div>


                <div>

                  <strong>
                    Authentication
                  </strong>

                  <span>
                    JWT login and
                    role-based access
                  </span>

                </div>

              </div>


              <span className="ad-status-online">

                Active

              </span>

            </div>

          </div>

        </div>

      </section>



      {/* ====================================
          QUICK ACTIONS
      ==================================== */}

      <section className="ad-section">

        <div className="ad-section-header">

          <h2>
            Quick Actions
          </h2>

          <p>
            Frequently used
            administrator tools.
          </p>

        </div>



        <div className="ad-quick-actions">


          {/* ADD USER */}

          <button
            className="
              ad-action-card
              ad-action-teal
            "

            onClick={() =>
              navigate(
                "/admin-users"
              )
            }
          >

            <div className="ad-action-icon">

              <UserPlus
                size={20}
              />

            </div>


            <div>

              <h3>
                Add User
              </h3>

              <p>
                Create a new student,
                lecturer or administrator.
              </p>

            </div>

          </button>



          {/* COURSES */}

          <button
            className="
              ad-action-card
              ad-action-blue
            "

            onClick={() =>
              navigate(
                "/admin/courses"
              )
            }
          >

            <div className="ad-action-icon">

              <BookOpen
                size={20}
              />

            </div>


            <div>

              <h3>
                Manage Courses
              </h3>

              <p>
                Review courses and
                academic modules.
              </p>

            </div>

          </button>



          {/* REPORTS */}

          <button
            className="
              ad-action-card
              ad-action-purple
            "

            onClick={() =>
              navigate(
                "/admin/reports"
              )
            }
          >

            <div className="ad-action-icon">

              <BarChart3
                size={20}
              />

            </div>


            <div>

              <h3>
                View Reports
              </h3>

              <p>
                Monitor platform and
                academic statistics.
              </p>

            </div>

          </button>



          {/* SETTINGS */}

          <button
            className="
              ad-action-card
              ad-action-orange
            "

            onClick={() =>
              navigate(
                "/admin/settings"
              )
            }
          >

            <div className="ad-action-icon">

              <Settings
                size={20}
              />

            </div>


            <div>

              <h3>
                System Settings
              </h3>

              <p>
                Configure CampusLearn
                system preferences.
              </p>

            </div>

          </button>

        </div>

      </section>



      {/* ====================================
          LATEST USER ACCOUNTS
      ==================================== */}

      <section className="ad-section">

        <div className="ad-section-header">

          <h2>
            Latest User Accounts
          </h2>

          <p>
            Most recently created
            CampusLearn account records.
          </p>

        </div>



        <div className="ad-table-wrapper">

          <table className="ad-table">

            <thead>

              <tr>

                <th>
                  User
                </th>

                <th>
                  Role
                </th>

                <th>
                  Last Login
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {recentUsers.length ===
                0 && (

                <tr>

                  <td
                    colSpan="4"

                    style={{
                      textAlign:
                        "center",
                      padding:
                        "24px",
                    }}
                  >

                    No users found.

                  </td>

                </tr>

              )}


              {recentUsers.map(
                (user) => (

                  <tr
                    key={
                      user.id
                    }
                  >

                    <td>

                      <div className="ad-user-table-profile">

                        <div className="ad-table-avatar">

                          {
                            user.initials
                          }

                        </div>


                        <div>

                          <strong>
                            {
                              user.name
                            }
                          </strong>

                          <span>
                            {
                              user.email
                            }
                          </span>

                        </div>

                      </div>

                    </td>


                    <td>

                      <span
                        className={
                          `ad-role-badge ad-role-badge-${user.role.toLowerCase()}`
                        }
                      >

                        {
                          user.role
                        }

                      </span>

                    </td>


                    <td>

                      {
                        user.lastLogin
                      }

                    </td>


                    <td>

                      {user.active ? (

                        <span className="ad-active-badge">

                          <CircleCheckBig
                            size={10}
                          />

                          Active

                        </span>

                      ) : (

                        <span
                          style={{
                            color:
                              "#dc2626",
                            fontWeight:
                              600,
                            fontSize:
                              "12px",
                          }}
                        >

                          Disabled

                        </span>

                      )}

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>

  );

}


export default AdminDashboard;