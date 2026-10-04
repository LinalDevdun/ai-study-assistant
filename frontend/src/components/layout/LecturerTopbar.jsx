import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  Bell,
  Search,
  ChevronDown,
  Plus,
  User,
  Settings,
  LockKeyhole,
  LogOut,
  BookOpen,
  ClipboardPlus,
} from "lucide-react";


function LecturerTopbar() {

  const navigate =
    useNavigate();


  const profileRef =
    useRef(null);


  /* ========================================
     STATE
  ======================================== */

  const [lecturer, setLecturer] =
    useState({
      name: "Lecturer User",
      email: "",
      role: "LECTURER",
    });


  const [
    notificationCount,
    setNotificationCount,
  ] = useState(0);


  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);


  const [
    createOpen,
    setCreateOpen,
  ] = useState(false);


  /* ========================================
     LOAD TOPBAR DATA
  ======================================== */

  useEffect(() => {

    const loadTopbarData =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "token"
            );


          if (!token) {

            navigate(
              "/login"
            );

            return;

          }


          const headers = {

            Authorization:
              `Bearer ${token}`,

          };


          /* =================================
             PROFILE
          ================================= */

          const profileResponse =
            await axios.get(
              "http://localhost:5000/me",
              {
                headers,
              }
            );


          setLecturer(
            profileResponse.data
          );


          /* =================================
             LECTURER SETTINGS
          ================================= */

          const settingsResponse =
            await axios.get(
              "http://localhost:5000/user/settings",
              {
                headers,
              }
            );


          /*
            If Submission Alerts is OFF,
            we will hide the pending
            submission notification count.
          */

          const submissionAlertsEnabled =
            settingsResponse.data
              ?.submission_alerts !== false;


          /* =================================
             PENDING SUBMISSIONS
          ================================= */

          const submissionsResponse =
            await axios.get(
              "http://localhost:5000/lecturer/submissions",
              {
                headers,
              }
            );


          const submissions =
            Array.isArray(
              submissionsResponse
                .data?.submissions
            )
              ? submissionsResponse
                  .data.submissions
              : [];


          const pendingCount =
            submissions.filter(
              (submission) =>
                submission.grade === null ||
                submission.grade ===
                  undefined ||
                submission.grade === ""
            ).length;


          /*
            Submission Alerts ON
              -> show pending count

            Submission Alerts OFF
              -> hide count
          */

          setNotificationCount(
            submissionAlertsEnabled
              ? pendingCount
              : 0
          );


        } catch (error) {

          console.error(
            "Failed to load lecturer topbar:",
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

            navigate(
              "/login"
            );

          }

        }

      };


    loadTopbarData();


  }, [navigate]);


  /* ========================================
     CLOSE PROFILE WHEN CLICKING OUTSIDE
  ======================================== */

  useEffect(() => {

    const handleOutsideClick = (
      event
    ) => {

      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {

        setProfileOpen(
          false
        );

      }

    };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };


  }, []);


  /* ========================================
     INITIALS
  ======================================== */

  const getInitials =
    (name) => {

      if (!name) {

        return "LE";

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
      lecturer.name
    );


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

    navigate(
      "/login"
    );

  };


  /* ========================================
     UI
  ======================================== */

  return (

    <header
      className="lecturer-topbar"
    >


      {/* =================================
          SEARCH
      ================================= */}

      <div
        className="lecturer-search"
      >

        <Search
          size={18}
        />

        <input
          type="text"
          placeholder="Search courses, students, submissions..."
        />

      </div>


      {/* =================================
          RIGHT SIDE
      ================================= */}

      <div
        className="lecturer-topbar-actions"
      >


        {/* =================================
            CREATE
        ================================= */}

        <div
          className="lecturer-create-wrapper"
        >

          <button
            className="lecturer-create-button"
            type="button"
            onClick={() => {

              setCreateOpen(
                (previous) =>
                  !previous
              );

              setProfileOpen(
                false
              );

            }}
          >

            <Plus
              size={16}
            />

            Create

          </button>


          {createOpen && (

            <div
              className="lecturer-create-dropdown"
            >


              {/* CREATE COURSE */}

              <button
                type="button"
                onClick={() => {

                  setCreateOpen(
                    false
                  );

                  navigate(
                    "/lecturer/courses",
                    {
                      state: {
                        openCreateCourse:
                          true,
                      },
                    }
                  );

                }}
              >

                <div
                  className="lecturer-create-dropdown-icon"
                >

                  <BookOpen
                    size={17}
                  />

                </div>


                <div>

                  <strong>
                    Create Course
                  </strong>

                  <span>
                    Add a new teaching course
                  </span>

                </div>

              </button>


              {/* CREATE ASSIGNMENT */}

              <button
                type="button"
                onClick={() => {

                  setCreateOpen(
                    false
                  );

                  navigate(
                    "/lecturer/assignments",
                    {
                      state: {
                        openCreateAssignment:
                          true,
                      },
                    }
                  );

                }}
              >

                <div
                  className="lecturer-create-dropdown-icon"
                >

                  <ClipboardPlus
                    size={17}
                  />

                </div>


                <div>

                  <strong>
                    Create Assignment
                  </strong>

                  <span>
                    Publish new coursework
                  </span>

                </div>

              </button>

            </div>

          )}

        </div>


        {/* =================================
            NOTIFICATIONS
        ================================= */}

        <button
          className="lecturer-notification-button"
          type="button"
          onClick={() =>
            navigate(
              "/lecturer/submissions"
            )
          }
        >

          <Bell
            size={19}
          />


          {notificationCount > 0 && (

            <span>
              {notificationCount}
            </span>

          )}

        </button>


        {/* =================================
            PROFILE
        ================================= */}

        <div
          className="lecturer-profile-wrapper"
          ref={profileRef}
        >

          <button
            className="lecturer-profile"
            type="button"
            onClick={() => {

              setProfileOpen(
                (previous) =>
                  !previous
              );

              setCreateOpen(
                false
              );

            }}
          >

            <div
              className="lecturer-top-avatar"
            >

              {initials}

            </div>


            <div
              className="lecturer-profile-details"
            >

              <strong>
                {lecturer.name}
              </strong>

              <span>
                Lecturer
              </span>

            </div>


            <ChevronDown
              size={16}
              className={
                profileOpen
                  ? "lecturer-profile-arrow lecturer-profile-arrow-open"
                  : "lecturer-profile-arrow"
              }
            />

          </button>


          {/* =================================
              PROFILE DROPDOWN
          ================================= */}

          {profileOpen && (

            <div
              className="lecturer-profile-dropdown"
            >


              {/* HEADER */}

              <div
                className="lecturer-dropdown-header"
              >

                <div
                  className="lecturer-dropdown-avatar"
                >

                  {initials}

                </div>


                <div>

                  <strong>
                    {lecturer.name}
                  </strong>

                  <span>
                    {lecturer.email}
                  </span>

                </div>

              </div>


              {/* MENU */}

              <div
                className="lecturer-dropdown-menu"
              >


                {/* MY PROFILE */}

                <button
                  type="button"
                  onClick={() => {

                    setProfileOpen(
                      false
                    );

                    navigate(
                      "/lecturer/profile"
                    );

                  }}
                >

                  <User
                    size={16}
                  />

                  My Profile

                </button>


                {/* SETTINGS */}

                <button
                  type="button"
                  onClick={() => {

                    setProfileOpen(
                      false
                    );

                    navigate(
                      "/lecturer/settings"
                    );

                  }}
                >

                  <Settings
                    size={16}
                  />

                  Settings

                </button>


                {/* CHANGE PASSWORD */}

                <button
                  type="button"
                  onClick={() => {

                    setProfileOpen(
                      false
                    );

                    navigate(
                      "/lecturer/change-password"
                    );

                  }}
                >

                  <LockKeyhole
                    size={16}
                  />

                  Change Password

                </button>

              </div>


              {/* LOGOUT */}

              <div
                className="lecturer-dropdown-footer"
              >

                <button
                  type="button"
                  className="lecturer-dropdown-logout"
                  onClick={
                    handleLogout
                  }
                >

                  <LogOut
                    size={16}
                  />

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


export default LecturerTopbar;