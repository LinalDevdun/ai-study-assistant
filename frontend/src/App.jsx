import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


/* =========================================
   PUBLIC PAGES
========================================= */

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Register from "./pages/Register";


/* =========================================
   STUDENT PAGES
========================================= */

import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Tutor from "./pages/Tutor";
import Progress from "./pages/Progress";
import Deadlines from "./pages/Deadlines";
import Assignments from "./pages/Assignments";
import Notifications from "./pages/Notifications";
import Grades from "./pages/Grades";
import MyCourses from "./pages/MyCourses";


/* =========================================
   LECTURER PAGES
========================================= */

import LecturerDashboard from "./pages/LecturerDashboard";
import LecturerCourses from "./pages/LecturerCourses";
import LecturerAssignments from "./pages/LecturerAssignments";
import LecturerSubmissions from "./pages/LecturerSubmissions";
import LecturerGrading from "./pages/LecturerGrading";
import LecturerStudents from "./pages/LecturerStudents";


/* =========================================
   ADMIN PAGES
========================================= */

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";


/* =========================================
   PROTECTION + LAYOUTS
========================================= */

import ProtectedRoute from "./components/ProtectedRoute";

import StudentLayout from "./components/layout/StudentLayout";
import LecturerLayout from "./components/layout/LecturerLayout";


function App() {
  const role = localStorage.getItem("role");


  return (
    <Router>

      <Routes>


        {/* ========================================
            PUBLIC ROUTES
        ======================================== */}

        <Route
          path="/"
          element={<Splash />}
        />


        <Route
          path="/login"
          element={<Login />}
        />


        <Route
          path="/register"
          element={<Register />}
        />



        {/* ========================================
            STUDENT ROUTES
        ======================================== */}

        {/* STUDENT DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["STUDENT"]}
            >

              <StudentLayout>
                <Dashboard />
              </StudentLayout>

            </ProtectedRoute>
          }
        />


        {/* MY COURSES */}

        <Route
          path="/courses"
          element={
            <ProtectedRoute
              allowedRoles={["STUDENT"]}
            >

              <StudentLayout>
                <MyCourses />
              </StudentLayout>

            </ProtectedRoute>
          }
        />


        {/* LEARNING PROGRESS */}

        <Route
          path="/progress"
          element={
            <ProtectedRoute
              allowedRoles={["STUDENT"]}
            >

              <StudentLayout>
                <Progress />
              </StudentLayout>

            </ProtectedRoute>
          }
        />


        {/* ASSIGNMENTS */}

        <Route
          path="/assignments"
          element={
            <ProtectedRoute
              allowedRoles={["STUDENT"]}
            >

              <StudentLayout>
                <Assignments />
              </StudentLayout>

            </ProtectedRoute>
          }
        />


        {/* DEADLINES */}

        <Route
          path="/deadlines"
          element={
            <ProtectedRoute
              allowedRoles={["STUDENT"]}
            >

              <StudentLayout>
                <Deadlines />
              </StudentLayout>

            </ProtectedRoute>
          }
        />


        {/* NOTIFICATIONS */}

        <Route
          path="/notifications"
          element={
            <ProtectedRoute
              allowedRoles={["STUDENT"]}
            >

              <StudentLayout>
                <Notifications />
              </StudentLayout>

            </ProtectedRoute>
          }
        />


        {/* GRADES */}

        <Route
          path="/grades"
          element={
            <ProtectedRoute
              allowedRoles={["STUDENT"]}
            >

              <StudentLayout>
                <Grades />
              </StudentLayout>

            </ProtectedRoute>
          }
        />



        {/* ========================================
            LECTURER ROUTES
        ======================================== */}

        {/* LECTURER DASHBOARD */}

        <Route
          path="/lecturer-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["LECTURER"]}
            >

              <LecturerLayout>
                <LecturerDashboard />
              </LecturerLayout>

            </ProtectedRoute>
          }
        />


        {/* LECTURER COURSES */}

        <Route
          path="/lecturer/courses"
          element={
            <ProtectedRoute
              allowedRoles={["LECTURER"]}
            >

              <LecturerLayout>
                <LecturerCourses />
              </LecturerLayout>

            </ProtectedRoute>
          }
        />


        {/* LECTURER ASSIGNMENTS */}

        <Route
          path="/lecturer/assignments"
          element={
            <ProtectedRoute
              allowedRoles={["LECTURER"]}
            >

              <LecturerLayout>
                <LecturerAssignments />
              </LecturerLayout>

            </ProtectedRoute>
          }
        />


        {/* LECTURER SUBMISSIONS */}

        <Route
          path="/lecturer/submissions"
          element={
            <ProtectedRoute
              allowedRoles={["LECTURER"]}
            >

              <LecturerLayout>
                <LecturerSubmissions />
              </LecturerLayout>

            </ProtectedRoute>
          }
        />


        {/* LECTURER GRADING */}

        <Route
          path="/lecturer/grading"
          element={
            <ProtectedRoute
              allowedRoles={["LECTURER"]}
            >

              <LecturerLayout>
                <LecturerGrading />
              </LecturerLayout>

            </ProtectedRoute>
          }
        />


        {/* LECTURER STUDENTS */}

        <Route
          path="/lecturer/students"
          element={
            <ProtectedRoute
              allowedRoles={["LECTURER"]}
            >

              <LecturerLayout>
                <LecturerStudents />
              </LecturerLayout>

            </ProtectedRoute>
          }
        />



        {/* ========================================
            ADMIN ROUTES
        ======================================== */}

        {/* ADMIN DASHBOARD */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >

              <AdminDashboard />

            </ProtectedRoute>
          }
        />


        {/* ADMIN USERS */}

        <Route
          path="/admin-users"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >

              <AdminUsers />

            </ProtectedRoute>
          }
        />



        {/* ========================================
            SHARED ROUTES
        ======================================== */}

        {/* COURSE DETAILS */}

        <Route
          path="/course/:id"
          element={
            <ProtectedRoute
              allowedRoles={[
                "STUDENT",
                "LECTURER",
                "ADMIN",
              ]}
            >

              {role === "STUDENT" ? (

                <StudentLayout>
                  <Course />
                </StudentLayout>

              ) : (

                <Course />

              )}

            </ProtectedRoute>
          }
        />



        {/* ========================================
            AI STUDY TUTOR
        ======================================== */}

        <Route
          path="/tutor"
          element={
            <ProtectedRoute
              allowedRoles={[
                "STUDENT",
                "LECTURER",
                "ADMIN",
              ]}
            >

              {role === "STUDENT" ? (

                <StudentLayout>
                  <Tutor />
                </StudentLayout>

              ) : role === "LECTURER" ? (

                <LecturerLayout>
                  <Tutor />
                </LecturerLayout>

              ) : (

                <Tutor />

              )}

            </ProtectedRoute>
          }
        />


      </Routes>

    </Router>
  );
}


export default App;