import {
  useMemo,
  useState,
} from "react";

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


function AdminUsers() {

  /*
    Temporary frontend data.

    Later this will be replaced by
    real PostgreSQL user data.
  */

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Movinya Perera",
      email: "movinya@example.com",
      role: "STUDENT",
      status: "Active",
      initials: "MP",
      joined: "Sep 23, 2026",
    },
    {
      id: 2,
      name: "Amaya Silva",
      email: "amaya@example.com",
      role: "STUDENT",
      status: "Active",
      initials: "AS",
      joined: "Sep 22, 2026",
    },
    {
      id: 3,
      name: "Hasith Witharama",
      email: "hasith@example.com",
      role: "LECTURER",
      status: "Active",
      initials: "HW",
      joined: "Sep 20, 2026",
    },
    {
      id: 4,
      name: "Dinuka Fernando",
      email: "dinuka@example.com",
      role: "STUDENT",
      status: "Disabled",
      initials: "DF",
      joined: "Sep 18, 2026",
    },
    {
      id: 5,
      name: "System Administrator",
      email: "admin@campuslearn.lk",
      role: "ADMIN",
      status: "Active",
      initials: "AD",
      joined: "Sep 15, 2026",
    },
  ]);


  const [searchTerm, setSearchTerm] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState(null);


  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      role: "STUDENT",
    });


  /* ========================================
     COUNTS
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
            searchTerm.toLowerCase();


          const matchesSearch =
            user.name
              .toLowerCase()
              .includes(search) ||

            user.email
              .toLowerCase()
              .includes(search);


          const matchesRole =
            roleFilter === "ALL" ||
            user.role === roleFilter;


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
      role: "STUDENT",
    });

    setModalOpen(true);

  };


  /* ========================================
     OPEN EDIT MODAL
  ======================================== */

  const openEditModal = (user) => {

    setEditingUser(user);

    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    setModalOpen(true);

  };


  /* ========================================
     SAVE USER
  ======================================== */

  const handleSaveUser = (event) => {

    event.preventDefault();


    if (
      !formData.name ||
      !formData.email
    ) {
      return;
    }


    if (editingUser) {

      setUsers(
        (previous) =>
          previous.map(
            (user) =>
              user.id ===
              editingUser.id
                ? {
                    ...user,
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                  }
                : user
          )
      );

    } else {

      const initials =
        formData.name
          .split(" ")
          .map(
            (word) =>
              word.charAt(0)
          )
          .join("")
          .slice(0, 2)
          .toUpperCase();


      const newUser = {
        id: Date.now(),

        name: formData.name,

        email: formData.email,

        role: formData.role,

        status: "Active",

        initials,

        joined:
          new Date()
            .toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            ),
      };


      setUsers(
        (previous) => [
          newUser,
          ...previous,
        ]
      );

    }


    setModalOpen(false);

  };


  /* ========================================
     ENABLE / DISABLE
  ======================================== */

  const toggleUserStatus = (id) => {

    setUsers(
      (previous) =>
        previous.map(
          (user) =>
            user.id === id
              ? {
                  ...user,

                  status:
                    user.status ===
                    "Active"
                      ? "Disabled"
                      : "Active",
                }
              : user
        )
    );

  };


  /* ========================================
     DELETE USER
  ======================================== */

  const deleteUser = (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this user?"
      );


    if (!confirmed) {
      return;
    }


    setUsers(
      (previous) =>
        previous.filter(
          (user) =>
            user.id !== id
        )
    );

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
            Manage students, lecturers
            and administrator accounts.
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
          FILTER BAR
      ==================================== */}

      <section className="au-toolbar">


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


        <div className="au-filters">


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
                Joined
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



                  {/* JOIN DATE */}

                  <td>

                    {user.joined}

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


        {filteredUsers.length === 0 && (

          <div className="au-empty">

            <Users size={30} />

            <h3>
              No users found
            </h3>

            <p>
              Try changing your search
              or filters.
            </p>

          </div>

        )}

      </section>



      {/* ====================================
          ADD / EDIT USER MODAL
      ==================================== */}

      {modalOpen && (

        <div className="au-modal-overlay">

          <div className="au-modal">


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
                onClick={() =>
                  setModalOpen(false)
                }
              >

                <X size={18} />

              </button>

            </div>



            <form
              className="au-form"
              onSubmit={
                handleSaveUser
              }
            >


              <div className="au-form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({
                      ...formData,

                      name:
                        event.target.value,
                    })
                  }
                />

              </div>



              <div className="au-form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({
                      ...formData,

                      email:
                        event.target.value,
                    })
                  }
                />

              </div>



              <div className="au-form-group">

                <label>
                  User Role
                </label>

                <select
                  value={formData.role}
                  onChange={(event) =>
                    setFormData({
                      ...formData,

                      role:
                        event.target.value,
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



              <div className="au-modal-actions">

                <button
                  type="button"
                  className="au-cancel-button"
                  onClick={() =>
                    setModalOpen(false)
                  }
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="au-save-button"
                >

                  {editingUser
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