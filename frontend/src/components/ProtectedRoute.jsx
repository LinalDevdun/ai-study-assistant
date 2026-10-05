import { Navigate } from "react-router-dom";


function ProtectedRoute({
  children,
  allowedRoles,
}) {

  const token =
    localStorage.getItem("token");

  const userRole =
    localStorage.getItem("role");

  const mustChangePassword =
    localStorage.getItem(
      "must_change_password"
    ) === "true";


  /* ========================================
     1. NOT LOGGED IN
  ======================================== */

  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  /* ========================================
     2. TEMPORARY PASSWORD

     Do not allow access to dashboards,
     courses, assignments, etc. until the
     password has been changed.
  ======================================== */

  if (mustChangePassword) {

    return (
      <Navigate
        to="/set-new-password"
        replace
      />
    );

  }


  /* ========================================
     3. ROLE CHECK
  ======================================== */

  if (
    allowedRoles &&
    !allowedRoles.includes(userRole)
  ) {

    if (userRole === "ADMIN") {

      return (
        <Navigate
          to="/admin-dashboard"
          replace
        />
      );

    }


    if (userRole === "LECTURER") {

      return (
        <Navigate
          to="/lecturer-dashboard"
          replace
        />
      );

    }


    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );

  }


  /* ========================================
     4. ACCESS ALLOWED
  ======================================== */

  return children;

}


export default ProtectedRoute;