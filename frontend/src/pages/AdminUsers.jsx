import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import {
  Users,
  GraduationCap,
  ShieldCheck,
  Search,
  UserPlus,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
  X,
  Mail,
} from "lucide-react";

import "../styles/adminUsers.css";


/* =========================================
   CREATE USER INITIALS
========================================= */

const getInitials = (name) => {
  if (!name) {
    return "U";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};


/* =========================================
   FORMAT LAST LOGIN
========================================= */

const formatLastLogin = (date) => {
  if (!date) {
    return "Never";
  }

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
};


function AdminUsers() {
  const navigate = useNavigate();


  /* ========================================
     REAL DATABASE USERS
  ======================================== */

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [saving, setSaving] =
    useState(false);


  /* ========================================
     SEARCH + FILTERS
  ======================================== */

  const [searchTerm, setSearchTerm] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");


  /* ========================================
     MODAL
  ======================================== */

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "STUDENT",
      degree: "",
      batch: "",
    });


  /* ========================================
     LOAD USERS FROM POSTGRESQL
  ======================================== */

  const loadUsers = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response =
          await axios.get(
            "http://localhost:5000/admin/users",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const databaseUsers =
          response.data.map(
            (user) => ({
              ...user,

              initials:
                getInitials(
                  user.name
                ),

              status:
                user.is_active
                  ? "Active"
                  : "Disabled",

              lastLogin:
                formatLastLogin(
                  user.last_login
                ),
            })
          );

        setUsers(databaseUsers);
      } catch (error) {
        console.error(
          "Failed to load users:",
          error
        );

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

          return;
        }

        setError(
          error.response?.data?.error ||
            "Failed to load users."
        );
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );


  useEffect(() => {
    loadUsers();
  }, [loadUsers]);


  /* ========================================
     USER COUNTS
  ======================================== */

  const totalUsers =
    users.length;

  const studentCount =
    users.filter(
      (user) =>
        user.role === "STUDENT"
    ).length;

  const lecturerCount =
    users.filter(
      (user) =>
        user.role === "LECTURER"
    ).length;

  const adminCount =
    users.filter(
      (user) =>
        user.role === "ADMIN"
    ).length;


  /* ========================================
     FILTER USERS
  ======================================== */

  const filteredUsers =
    useMemo(() => {
      return users.filter(
        (user) => {
          const search =
            searchTerm
              .toLowerCase()
              .trim();

          const userName =
            (
              user.name || ""
            ).toLowerCase();

          const userEmail =
            (
              user.email || ""
            ).toLowerCase();

          const matchesSearch =
            userName.includes(
              search
            ) ||
            userEmail.includes(
              search
            );

          const matchesRole =
            roleFilter === "ALL" ||
            user.role ===
              roleFilter;

          const matchesStatus =
            statusFilter === "ALL" ||
            user.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
          );
        }
      );
    }, [
      users,
      searchTerm,
      roleFilter,
      statusFilter,
    ]);


  /* ========================================
     OPEN ADD MODAL
  ======================================== */

  const openAddModal = () => {
    setEditingUser(null);

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "STUDENT",
      degree: "",
      batch: "",
    });

    setModalOpen(true);
  };


  /* ========================================
     OPEN EDIT MODAL
  ======================================== */

  const openEditModal = (user) => {
    setEditingUser(user);

    setFormData({
      name:
        user.name || "",

      email:
        user.email || "",

      password: "",

      role:
        user.role || "STUDENT",

      degree:
        user.degree || "",

      batch:
        user.batch || "",
    });

    setModalOpen(true);
  };


  /* ========================================
     CREATE USER
  ======================================== */

const handleSaveUser = async (event) => {

  event.preventDefault();


  /* ========================================
     BASIC VALIDATION
  ======================================== */

  if (
    !formData.name.trim() ||
    !formData.email.trim() ||
    !formData.role
  ) {

    alert(
      "Please enter name, email and role."
    );

    return;
  }


  /* ========================================
     STUDENT VALIDATION
  ======================================== */

  if (
    formData.role === "STUDENT" &&
    (
      !formData.degree.trim() ||
      !formData.batch.trim()
    )
  ) {

    alert(
      "Please enter the student's degree and batch."
    );

    return;
  }


  /* ========================================
     PASSWORD VALIDATION FOR NEW USER ONLY
  ======================================== */

  if (
    !editingUser &&
    (
      !formData.password ||
      formData.password.length < 6
    )
  ) {

    alert(
      "Password must contain at least 6 characters."
    );

    return;
  }


  try {

    setSaving(true);


    const token =
      localStorage.getItem("token");


    if (!token) {

      navigate("/login");

      return;

    }


    /* ========================================
       EDIT EXISTING USER
    ======================================== */

    if (editingUser) {

      await axios.put(
        `http://localhost:5000/admin/users/${editingUser.id}`,

        {
          name:
            formData.name.trim(),

          email:
            formData.email
              .trim()
              .toLowerCase(),

          role:
            formData.role,

          degree:
            formData.role === "STUDENT"
              ? formData.degree.trim()
              : null,

          batch:
            formData.role === "STUDENT"
              ? formData.batch.trim()
              : null,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      await loadUsers();


      setModalOpen(false);

      setEditingUser(null);


      alert(
        "User updated successfully!"
      );

      return;

    }


    /* ========================================
       CREATE NEW USER
    ======================================== */

    await axios.post(
      "http://localhost:5000/admin/users",

      {
        name:
          formData.name.trim(),

        email:
          formData.email
            .trim()
            .toLowerCase(),

        password:
          formData.password,

        role:
          formData.role,

        degree:
          formData.role === "STUDENT"
            ? formData.degree.trim()
            : null,

        batch:
          formData.role === "STUDENT"
            ? formData.batch.trim()
            : null,
      },

      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );


    await loadUsers();


    setModalOpen(false);


    alert(
      "User created successfully!"
    );


  } catch (error) {

    console.error(
      "Save user error:",
      error
    );


    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      navigate("/login");

      return;

    }


    alert(
      error.response?.data?.error ||
      "Failed to save user."
    );


  } finally {

    setSaving(false);

  }

};


  /* ========================================
     ENABLE / DISABLE
     STEP 28D
  ======================================== */

const toggleUserStatus =
  async (userId) => {

    try {

      const token =
        localStorage.getItem("token");


      if (!token) {

        navigate("/login");

        return;
      }


      const selectedUser =
        users.find(
          (user) =>
            user.id === userId
        );


      if (!selectedUser) {
        return;
      }


      const newStatus =
        selectedUser.status !==
        "Active";


      const actionName =
        newStatus
          ? "enable"
          : "disable";


      const confirmed =
        window.confirm(
          `Are you sure you want to ${actionName} ${selectedUser.name}?`
        );


      if (!confirmed) {
        return;
      }


      await axios.put(
        `http://localhost:5000/admin/users/${userId}/status`,

        {
          is_active:
            newStatus,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      /*
        Reload fresh data
        from PostgreSQL
      */

      await loadUsers();


      alert(
        newStatus
          ? "User enabled successfully!"
          : "User disabled successfully!"
      );


    } catch (error) {

      console.error(
        "Update user status error:",
        error
      );


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

        return;
      }


      alert(
        error.response?.data?.error ||
        "Failed to update user status."
      );

    }

  };


  /* ========================================
     DELETE USER
     STEP 28E
  ======================================== */

const deleteUser = async (userId) => {

  try {

    const token =
      localStorage.getItem("token");


    if (!token) {

      navigate("/login");

      return;
    }


    const selectedUser =
      users.find(
        (user) =>
          user.id === userId
      );


    if (!selectedUser) {
      return;
    }


    const confirmed =
      window.confirm(
        `Are you sure you want to permanently delete ${selectedUser.name}?`
      );


    if (!confirmed) {
      return;
    }


    await axios.delete(
      `http://localhost:5000/admin/users/${userId}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );


    /*
      Reload users directly
      from PostgreSQL
    */

    await loadUsers();


    alert(
      "User deleted successfully!"
    );


  } catch (error) {

    console.error(
      "Delete user error:",
      error
    );


    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      navigate("/login");

      return;
    }


    alert(
      error.response?.data?.error ||
      "Failed to delete user."
    );

  }

};


  return (
    <div className="admin-users-page">


      {/* ====================================
          HEADER
      ==================================== */}

      <section className="au-header">

        <div>

          <h1>
            User Management
          </h1>

          <p>
            Manage students,
            lecturers and
            administrator accounts.
          </p>

        </div>


        <button
          className="au-add-button"
          onClick={openAddModal}
        >

          <UserPlus size={16} />

          Add User

        </button>

      </section>



      {/* ====================================
          SUMMARY
      ==================================== */}

      <section className="au-summary">


        {/* TOTAL USERS */}

        <div className="au-summary-card au-teal">

          <div className="au-summary-icon">

            <Users size={21} />

          </div>

          <div>

            <strong>
              {totalUsers}
            </strong>

            <span>
              Total Users
            </span>

          </div>

        </div>



        {/* STUDENTS */}

        <div className="au-summary-card au-purple">

          <div className="au-summary-icon">

            <GraduationCap
              size={21}
            />

          </div>

          <div>

            <strong>
              {studentCount}
            </strong>

            <span>
              Students
            </span>

          </div>

        </div>



        {/* LECTURERS */}

        <div className="au-summary-card au-blue">

          <div className="au-summary-icon">

            <Users size={21} />

          </div>

          <div>

            <strong>
              {lecturerCount}
            </strong>

            <span>
              Lecturers
            </span>

          </div>

        </div>



        {/* ADMINISTRATORS */}

        <div className="au-summary-card au-orange">

          <div className="au-summary-icon">

            <ShieldCheck
              size={21}
            />

          </div>

          <div>

            <strong>
              {adminCount}
            </strong>

            <span>
              Administrators
            </span>

          </div>

        </div>

      </section>



      {/* ====================================
          SEARCH + FILTER
      ==================================== */}

      <section className="au-toolbar">


        {/* SEARCH */}

        <div className="au-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>



        {/* FILTERS */}

        <div className="au-filters">


          {/* ROLE FILTER */}

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(
                event.target.value
              )
            }
          >

            <option value="ALL">
              All Roles
            </option>

            <option value="STUDENT">
              Students
            </option>

            <option value="LECTURER">
              Lecturers
            </option>

            <option value="ADMIN">
              Administrators
            </option>

          </select>



          {/* STATUS FILTER */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >

            <option value="ALL">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Disabled">
              Disabled
            </option>

          </select>

        </div>

      </section>



      {/* ====================================
          USER TABLE
      ==================================== */}

      <section className="au-table-container">


        {/* LOADING */}

        {loading && (

          <div className="au-empty">

            <Users size={30} />

            <h3>
              Loading users...
            </h3>

            <p>
              Getting user information
              from PostgreSQL.
            </p>

          </div>

        )}



        {/* ERROR */}

        {!loading && error && (

          <div className="au-empty">

            <Users size={30} />

            <h3>
              Unable to load users
            </h3>

            <p>
              {error}
            </p>

          </div>

        )}



        {/* TABLE */}

        {!loading && !error && (

          <>

            <table className="au-table">

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

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredUsers.map(
                  (user) => (

                    <tr key={user.id}>


                      {/* USER */}

                      <td>

                        <div className="au-user-profile">

                          <div className="au-avatar">

                            {user.initials}

                          </div>


                          <div>

                            <strong>
                              {user.name}
                            </strong>

                            <span>

                              <Mail size={10} />

                              {user.email}

                            </span>

                          </div>

                        </div>

                      </td>



                      {/* ROLE */}

                      <td>

                        <span
                          className={`au-role au-role-${user.role.toLowerCase()}`}
                        >

                          {user.role}

                        </span>

                      </td>



                      {/* LAST LOGIN */}

                      <td>
                        {user.lastLogin}
                      </td>



                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            user.status ===
                            "Active"
                              ? "au-status au-status-active"
                              : "au-status au-status-disabled"
                          }
                        >

                          {user.status}

                        </span>

                      </td>



                      {/* ACTIONS */}

                      <td>

                        <div className="au-actions">


                          {/* EDIT */}

                          <button
                            className="au-action-button au-edit"
                            onClick={() =>
                              openEditModal(
                                user
                              )
                            }
                            title="Edit user"
                          >

                            <Pencil
                              size={14}
                            />

                          </button>



                          {/* ENABLE / DISABLE */}

                          <button
                            className="au-action-button au-toggle"
                            onClick={() =>
                              toggleUserStatus(
                                user.id
                              )
                            }
                            title={
                              user.status ===
                              "Active"
                                ? "Disable user"
                                : "Enable user"
                            }
                          >

                            {user.status ===
                            "Active" ? (

                              <UserX
                                size={14}
                              />

                            ) : (

                              <UserCheck
                                size={14}
                              />

                            )}

                          </button>



                          {/* DELETE */}

                          <button
                            className="au-action-button au-delete"
                            onClick={() =>
                              deleteUser(
                                user.id
                              )
                            }
                            title="Delete user"
                          >

                            <Trash2
                              size={14}
                            />

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>



            {/* NO RESULTS */}

            {filteredUsers.length ===
              0 && (

              <div className="au-empty">

                <Users size={30} />

                <h3>
                  No users found
                </h3>

                <p>
                  Try changing your
                  search or filters.
                </p>

              </div>

            )}

          </>

        )}

      </section>



      {/* ====================================
          ADD / EDIT USER MODAL
      ==================================== */}

      {modalOpen && (

        <div className="au-modal-overlay">

          <div className="au-modal">


            {/* MODAL HEADER */}

            <div className="au-modal-header">

              <div>

                <h2>

                  {editingUser
                    ? "Edit User"
                    : "Add New User"}

                </h2>

                <p>

                  {editingUser
                    ? "Update user account information."
                    : "Create a new CampusLearn account."}

                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setModalOpen(false)
                }
              >

                <X size={18} />

              </button>

            </div>



            {/* ==================================
                FORM
            ================================== */}

            <form
              className="au-form"
              onSubmit={
                handleSaveUser
              }
            >


              {/* FULL NAME */}

              <div className="au-form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter full name"
                  value={
                    formData.name
                  }
                  onChange={(event) =>
                    setFormData({
                      ...formData,

                      name:
                        event.target
                          .value,
                    })
                  }
                  required
                />

              </div>



              {/* EMAIL */}

              <div className="au-form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter email address"
                  value={
                    formData.email
                  }
                  onChange={(event) =>
                    setFormData({
                      ...formData,

                      email:
                        event.target
                          .value,
                    })
                  }
                  required
                />

              </div>



              {/* PASSWORD
                  Only required when creating
                  a new user.
              */}

              {!editingUser && (

                <div className="au-form-group">

                  <label>
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={
                      formData.password
                    }
                    onChange={(event) =>
                      setFormData({
                        ...formData,

                        password:
                          event.target
                            .value,
                      })
                    }
                    minLength={6}
                    required
                  />

                </div>

              )}



              {/* USER ROLE */}

              <div className="au-form-group">

                <label>
                  User Role
                </label>

                <select
                  value={
                    formData.role
                  }
                  onChange={(event) =>
                    setFormData({
                      ...formData,

                      role:
                        event.target
                          .value,
                    })
                  }
                >

                  <option value="STUDENT">
                    Student
                  </option>

                  <option value="LECTURER">
                    Lecturer
                  </option>

                  <option value="ADMIN">
                    Administrator
                  </option>

                </select>

              </div>



              {/* ==================================
                  STUDENT DETAILS
              ================================== */}

              {formData.role ===
                "STUDENT" && (

                <>

                  {/* DEGREE */}

                  <div className="au-form-group">

                    <label>
                      Degree
                    </label>

                    <input
                      type="text"
                      placeholder="Example: BSc Computer Science"
                      value={
                        formData.degree
                      }
                      onChange={(event) =>
                        setFormData({
                          ...formData,

                          degree:
                            event.target
                              .value,
                        })
                      }
                      required
                    />

                  </div>



                  {/* BATCH */}

                  <div className="au-form-group">

                    <label>
                      Batch
                    </label>

                    <input
                      type="text"
                      placeholder="Example: 25.1"
                      value={
                        formData.batch
                      }
                      onChange={(event) =>
                        setFormData({
                          ...formData,

                          batch:
                            event.target
                              .value,
                        })
                      }
                      required
                    />

                  </div>

                </>

              )}



              {/* ==================================
                  BUTTONS
              ================================== */}

              <div className="au-modal-actions">

                <button
                  type="button"
                  className="au-cancel-button"
                  onClick={() =>
                    setModalOpen(false)
                  }
                  disabled={saving}
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="au-save-button"
                  disabled={saving}
                >

                {saving
                  ? editingUser
                    ? "Saving..."
                    : "Creating..."
                  : editingUser
                    ? "Save Changes"
                    : "Create User"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


export default AdminUsers;