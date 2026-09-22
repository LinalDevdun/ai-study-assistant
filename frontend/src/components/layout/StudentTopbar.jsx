import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="student-topbar">

      {/* SEARCH */}
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


      {/* RIGHT SIDE */}
      <div className="topbar-actions">

        {/* NOTIFICATION */}
        <button
          className="topbar-icon-button"
          onClick={() => navigate("/notifications")}
        >
          <Bell size={20} />

          <span className="notification-dot">
            3
          </span>
        </button>


        {/* PROFILE */}
        <div className="topbar-profile-wrapper">

          <button
            className="topbar-profile"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="topbar-avatar">
              ST
            </div>

            <div className="topbar-profile-text">
              <strong>Student User</strong>
              <span>Student</span>
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


          {/* DROPDOWN */}
          {profileOpen && (
            <div className="profile-dropdown">

              <div className="profile-dropdown-header">
                <div className="dropdown-avatar">
                  ST
                </div>

                <div>
                  <strong>Student User</strong>
                  <span>student@lms.edu</span>
                </div>
              </div>


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
                  <LockKeyhole size={17} />
                  Change Password
                </button>

              </div>


              <div className="profile-dropdown-footer">

                <button
                  className="dropdown-logout"
                  onClick={handleLogout}
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