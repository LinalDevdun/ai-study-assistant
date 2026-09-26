import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LockKeyhole,
  LogOut,
} from "lucide-react";


function StudentTopbar() {

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] =
    useState(false);


  const [student, setStudent] =
    useState({
      name: "Student User",
      email: "",
      role: "STUDENT",
      degree: "",
      batch: "",
    });


  /* ========================================
     GET LOGGED-IN STUDENT
  ======================================== */

  useEffect(() => {

    const fetchStudent = async () => {

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


        setStudent(response.data);

      } catch (error) {

        console.error(
          "Failed to load student profile:",
          error
        );


        /*
          If token is invalid or expired,
          remove login information.
        */

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

          navigate("/login");

        }

      }

    };


    fetchStudent();

  }, [navigate]);


  /* ========================================
     CREATE INITIALS
  ======================================== */

  const getInitials = (name) => {

    if (!name) {
      return "ST";
    }


    return name
      .split(" ")
      .filter(Boolean)
      .map(
        (word) =>
          word.charAt(0)
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();

  };


  const initials =
    getInitials(student.name);


  /* ========================================
     LOGOUT
  ======================================== */

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    navigate("/login");

  };


  return (
    <header className="student-topbar">


      {/* ====================================
          SEARCH
      ==================================== */}

      <div className="topbar-search">

        <Search
          size={18}
          className="topbar-search-icon"
        />

        <input
          type="text"
          placeholder="Search courses, assignments..."
        />

      </div>



      {/* ====================================
          RIGHT SIDE
      ==================================== */}

      <div className="topbar-actions">


        {/* NOTIFICATION */}

        <button
          className="topbar-icon-button"
          onClick={() =>
            navigate("/notifications")
          }
        >

          <Bell size={20} />

          <span className="notification-dot">
            3
          </span>

        </button>



        {/* ==================================
            PROFILE
        ================================== */}

        <div className="topbar-profile-wrapper">


          <button
            className="topbar-profile"
            onClick={() =>
              setProfileOpen(
                !profileOpen
              )
            }
          >


            {/* AVATAR */}

            <div className="topbar-avatar">

              {initials}

            </div>



            {/* NAME */}

            <div className="topbar-profile-text">

              <strong>

                {student.name}

              </strong>

              <span>
                Student
              </span>

            </div>



            <ChevronDown
              size={17}
              className={
                profileOpen
                  ? "profile-arrow profile-arrow-open"
                  : "profile-arrow"
              }
            />

          </button>



          {/* ==================================
              DROPDOWN
          ================================== */}

          {profileOpen && (

            <div className="profile-dropdown">


              {/* PROFILE HEADER */}

              <div className="profile-dropdown-header">


                <div className="dropdown-avatar">

                  {initials}

                </div>


                <div>

                  <strong>

                    {student.name}

                  </strong>

                  <span>

                    {student.email}

                  </span>

                </div>

              </div>



              {/* PROFILE MENU */}

              <div className="profile-dropdown-menu">


                <button>

                  <User size={17} />

                  My Profile

                </button>


                <button>

                  <Settings size={17} />

                  Settings

                </button>


                <button>

                  <LockKeyhole
                    size={17}
                  />

                  Change Password

                </button>

              </div>



              {/* LOGOUT */}

              <div className="profile-dropdown-footer">

                <button
                  className="dropdown-logout"
                  onClick={
                    handleLogout
                  }
                >

                  <LogOut size={17} />

                  Log out

                </button>

              </div>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}


export default StudentTopbar;