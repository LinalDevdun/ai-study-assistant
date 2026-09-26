import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();


  /* ========================================
     LOGGED-IN ADMIN
  ======================================== */

  const [admin, setAdmin] = useState({
    name: "Admin",
    email: "",
    role: "ADMIN",
  });


  /* ========================================
     GET LOGGED-IN ADMIN
  ======================================== */

  useEffect(() => {

    const fetchAdmin = async () => {

      try {

        const token =
          localStorage.getItem("token");


        if (!token) {

          navigate("/login");

          return;

        }


        const response =
          await axios.get(
            "http://localhost:5000/me",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        setAdmin(response.data);

      } catch (error) {

        console.error(
          "Failed to load admin dashboard user:",
          error
        );


        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {

          localStorage.removeItem("token");
          localStorage.removeItem("role");

          navigate("/login");

        }

      }

    };


    fetchAdmin();

  }, [navigate]);


  /*
    Temporary Admin Dashboard data.

    Later we will load this from PostgreSQL.
  */

  const stats = [
    {
      label: "Total Users",
      value: "326",
      icon: Users,
      className: "ad-stat-teal",
    },
    {
      label: "Students",
      value: "248",
      icon: GraduationCap,
      className: "ad-stat-purple",
    },
    {
      label: "Lecturers",
      value: "32",
      icon: Users,
      className: "ad-stat-blue",
    },
    {
      label: "Active Courses",
      value: "18",
      icon: BookOpen,
      className: "ad-stat-orange",
    },
  ];


  const userDistribution = [
    {
      label: "Students",
      count: 248,
      description:
        "Registered student accounts",
      icon: GraduationCap,
      className: "ad-role-student",
    },
    {
      label: "Lecturers",
      count: 32,
      description:
        "Teaching staff accounts",
      icon: Users,
      className: "ad-role-lecturer",
    },
    {
      label: "Administrators",
      count: 4,
      description:
        "System administrator accounts",
      icon: ShieldCheck,
      className: "ad-role-admin",
    },
  ];


  const recentUsers = [
    {
      name: "Movinya Perera",
      initials: "MP",
      email: "movinya@example.com",
      role: "Student",
      joined: "Sep 23, 2026",
    },
    {
      name: "Hasith Witharama",
      initials: "HW",
      email: "hasith@example.com",
      role: "Lecturer",
      joined: "Sep 22, 2026",
    },
    {
      name: "Amaya Silva",
      initials: "AS",
      email: "amaya@example.com",
      role: "Student",
      joined: "Sep 21, 2026",
    },
    {
      name: "System Administrator",
      initials: "AD",
      email: "admin@campuslearn.lk",
      role: "Admin",
      joined: "Sep 20, 2026",
    },
  ];


  const currentDate =
    new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        month: "short",
        day: "numeric",
      }
    );


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

          <CalendarDays size={15} />

          {currentDate}

        </div>

      </section>



      {/* ====================================
          STATS
      ==================================== */}

      <section className="ad-stats">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (
            <div
              className={`ad-stat-card ${stat.className}`}
              key={stat.label}
            >

              <div className="ad-stat-icon">

                <Icon size={22} />

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

        })}

      </section>



      {/* ====================================
          OVERVIEW
      ==================================== */}

      <section className="ad-main-grid">


        {/* USER DISTRIBUTION */}

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
                navigate("/admin-users")
              }
            >

              Manage Users

              <ArrowRight size={13} />

            </button>

          </div>


          <div className="ad-user-distribution">

            {userDistribution.map(
              (role) => {

                const Icon = role.icon;

                return (
                  <div
                    className="ad-role-row"
                    key={role.label}
                  >

                    <div
                      className={`ad-role-icon ${role.className}`}
                    >

                      <Icon size={18} />

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



        {/* SYSTEM STATUS */}

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


            <div className="ad-system-item">

              <div className="ad-system-left">

                <div className="ad-system-icon">

                  <Database size={17} />

                </div>


                <div>

                  <strong>
                    PostgreSQL Database
                  </strong>

                  <span>
                    Primary application database
                  </span>

                </div>

              </div>


              <span className="ad-status-online">

                Online

              </span>

            </div>



            <div className="ad-system-item">

              <div className="ad-system-left">

                <div className="ad-system-icon">

                  <Server size={17} />

                </div>


                <div>

                  <strong>
                    Backend API
                  </strong>

                  <span>
                    Node.js / Express service
                  </span>

                </div>

              </div>


              <span className="ad-status-online">

                Online

              </span>

            </div>



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
                    User login and role access
                  </span>

                </div>

              </div>


              <span className="ad-status-online">

                Online

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
            Frequently used administrator tools.
          </p>

        </div>


        <div className="ad-quick-actions">


          <button
            className="ad-action-card ad-action-teal"
            onClick={() =>
              navigate("/admin-users")
            }
          >

            <div className="ad-action-icon">

              <UserPlus size={20} />

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



          <button
            className="ad-action-card ad-action-blue"
            onClick={() =>
              navigate("/admin/courses")
            }
          >

            <div className="ad-action-icon">

              <BookOpen size={20} />

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



          <button
            className="ad-action-card ad-action-purple"
            onClick={() =>
              navigate("/admin/reports")
            }
          >

            <div className="ad-action-icon">

              <BarChart3 size={20} />

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



          <button
            className="ad-action-card ad-action-orange"
            onClick={() =>
              navigate("/admin/settings")
            }
          >

            <div className="ad-action-icon">

              <Settings size={20} />

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
          RECENT USERS
      ==================================== */}

      <section className="ad-section">

        <div className="ad-section-header">

          <h2>
            Recently Added Users
          </h2>

          <p>
            Latest accounts registered
            in CampusLearn.
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
                  Joined
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {recentUsers.map(
                (user, index) => (

                  <tr key={index}>

                    <td>

                      <div className="ad-user-table-profile">

                        <div className="ad-table-avatar">

                          {user.initials}

                        </div>


                        <div>

                          <strong>
                            {user.name}
                          </strong>

                          <span>
                            {user.email}
                          </span>

                        </div>

                      </div>

                    </td>


                    <td>

                      <span
                        className={`ad-role-badge ad-role-badge-${user.role.toLowerCase()}`}
                      >

                        {user.role}

                      </span>

                    </td>


                    <td>
                      {user.joined}
                    </td>


                    <td>

                      <span className="ad-active-badge">

                        <CircleCheckBig
                          size={10}
                        />

                        Active

                      </span>

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