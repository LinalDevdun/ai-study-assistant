import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  CalendarDays,
  ChartNoAxesCombined,
  GraduationCap,
  Sparkles,
  Bell,
  LogOut,
} from "lucide-react";

function StudentSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const mainMenu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Courses",
      path: "/courses",
      icon: BookOpen,
    },
    {
      name: "Assignments",
      path: "/assignments",
      icon: ClipboardList,
    },
    {
      name: "Deadlines",
      path: "/deadlines",
      icon: CalendarDays,
    },
    {
      name: "Learning Progress",
      path: "/progress",
      icon: ChartNoAxesCombined,
    },
    {
      name: "Grades",
      path: "/grades",
      icon: GraduationCap,
    },
  ];

  const learningMenu = [
    {
      name: "AI Study Tutor",
      path: "/tutor",
      icon: Sparkles,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: Bell,
    },
  ];

  const renderMenuItem = (item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
        }
      >
        <Icon size={19} strokeWidth={2} />

        <span>{item.name}</span>
      </NavLink>
    );
  };

  return (
    <aside className="student-sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <GraduationCap size={25} strokeWidth={2.3} />
        </div>

        <div>
          <div className="sidebar-logo-title">
            Campus<span>Learn</span>
          </div>

          <div className="sidebar-logo-subtitle">
            Student Portal
          </div>
        </div>
      </div>


      {/* NAVIGATION */}
      <div className="sidebar-navigation">

        <p className="sidebar-section-title">
          MAIN
        </p>

        <nav className="sidebar-menu">
          {mainMenu.map(renderMenuItem)}
        </nav>


        <p className="sidebar-section-title sidebar-second-section">
          LEARNING
        </p>

        <nav className="sidebar-menu">
          {learningMenu.map(renderMenuItem)}
        </nav>

      </div>


      {/* BOTTOM */}
      <div className="sidebar-bottom">

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />

          <span>Log out</span>
        </button>


        <div className="sidebar-user">
          <div className="sidebar-avatar">
            ST
          </div>

          <div className="sidebar-user-info">
            <p>Student User</p>
            <span>Student</span>
          </div>
        </div>

      </div>

    </aside>
  );
}

export default StudentSidebar;