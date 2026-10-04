import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

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

  const navigate =
    useNavigate();

  const location =
    useLocation();


  const [profileOpen, setProfileOpen] =
    useState(false);


  const [unreadCount, setUnreadCount] =
    useState(0);


  const [student, setStudent] =
    useState({
      name: "Student User",
      email: "",
      role: "STUDENT",
      degree: "",
      batch: "",
    });


  /* ========================================
     HANDLE INVALID TOKEN
  ======================================== */

  const handleInvalidToken = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );

    navigate("/login");

  };


  /* ========================================
     GET LOGGED-IN STUDENT
  ======================================== */

  useEffect(() => {

    const fetchStudent =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "token"
            );


          if (!token) {

            handleInvalidToken();

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


          setStudent(
            response.data
          );


        } catch (error) {

          console.error(
            "Failed to load student profile:",
            error
          );


          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {

            handleInvalidToken();

          }

        }

      };


    fetchStudent();

  }, [navigate]);


  /* ========================================
     GET REAL UNREAD NOTIFICATION COUNT
  ======================================== */

  useEffect(() => {

    const fetchUnreadNotifications =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "token"
            );


          if (!token) {

            handleInvalidToken();

            return;

          }


          const response =
            await axios.get(
              "http://localhost:5000/notifications",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          const notifications =
            Array.isArray(
              response.data
            )
              ? response.data
              : [];


          const unread =
            notifications.filter(
              (notification) =>
                !notification.is_read
            ).length;


          setUnreadCount(
            unread
          );


        } catch (error) {

          console.error(
            "Failed to load notification count:",
            error
          );


          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {

            handleInvalidToken();

          }

        }

      };


    fetchUnreadNotifications();


    const handleWindowFocus = () => {

      fetchUnreadNotifications();

    };


    window.addEventListener(
      "focus",
      handleWindowFocus
    );


    return () => {

      window.removeEventListener(
        "focus",
        handleWindowFocus
      );

    };

  }, [
    navigate,
    location.pathname,
  ]);


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
    getInitials(
      student.name
    );


  /* ========================================
     PROFILE NAVIGATION
  ======================================== */

  const goToProfile = () => {

    setProfileOpen(false);

    navigate(
      "/student/profile"
    );

  };


  const goToSettings = () => {

    setProfileOpen(false);

    navigate(
      "/student/settings"
    );

  };


  const goToChangePassword = () => {

    setProfileOpen(false);

    navigate(
      "/student/change-password"
    );

  };


  /* ========================================
     LOGOUT
  ======================================== */

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );

    setProfileOpen(false);

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


        {/* ==================================
            NOTIFICATION
        ================================== */}

        <button
          type="button"
          className="topbar-icon-button"
          onClick={() =>
            navigate(
              "/notifications"
            )
          }
          title="Notifications"
        >

          <Bell size={20} />


          {unreadCount > 0 && (

            <span className="notification-dot">

              {unreadCount > 99
                ? "99+"
                : unreadCount}

            </span>

          )}

        </button>


        {/* ==================================
            PROFILE
        ================================== */}

        <div className="topbar-profile-wrapper">


          <button
            type="button"
            className="topbar-profile"
            onClick={() =>
              setProfileOpen(
                (previous) =>
                  !previous
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


                <button
                  type="button"
                  onClick={
                    goToProfile
                  }
                >

                  <User size={17} />

                  My Profile

                </button>


                <button
                  type="button"
                  onClick={
                    goToSettings
                  }
                >

                  <Settings size={17} />

                  Settings

                </button>


                <button
                  type="button"
                  onClick={
                    goToChangePassword
                  }
                >

                  <LockKeyhole
                    size={17}
                  />

                  Change Password

                </button>

              </div>


              {/* LOGOUT */}

              <div className="profile-dropdown-footer">

                <button
                  type="button"
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