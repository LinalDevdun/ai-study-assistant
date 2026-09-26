import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  Settings,
  Bell,
  ShieldCheck,
  Database,
  Save,
  Mail,
  School,
  CalendarDays,
  LockKeyhole,
  KeyRound,
} from "lucide-react";

import "../styles/adminSettings.css";


function AdminSettings() {
  const navigate =
    useNavigate();


  /* ========================================
     SYSTEM SETTINGS
  ======================================== */

  const [
    settings,
    setSettings,
  ] = useState({
    systemName: "",
    contactEmail: "",
    semester: "Semester 1",
    academicYear: "2026",
    emailNotifications: true,
    assignmentAlerts: true,
    maintenanceMode: false,
  });


  /* ========================================
     PASSWORD FORM
  ======================================== */

  const [
    passwordForm,
    setPasswordForm,
  ] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


  /* ========================================
     PAGE STATE
  ======================================== */

  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    changingPassword,
    setChangingPassword,
  ] = useState(false);


  const [
    message,
    setMessage,
  ] = useState("");


  const [
    messageType,
    setMessageType,
  ] = useState("success");


  const [
    passwordMessage,
    setPasswordMessage,
  ] = useState("");


  const [
    passwordMessageType,
    setPasswordMessageType,
  ] = useState("success");


  /* ========================================
     LOAD SETTINGS
  ======================================== */

  useEffect(() => {

    const loadSettings =
      async () => {

        try {

          setLoading(true);

          setMessage("");


          const token =
            localStorage.getItem(
              "token"
            );


          if (!token) {

            navigate("/login");

            return;

          }


          const response =
            await axios.get(
              "http://localhost:5000/admin/settings",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          const data =
            response.data;


          setSettings({

            systemName:
              data.system_name ||
              "",

            contactEmail:
              data.contact_email ||
              "",

            semester:
              data.current_semester ||
              "Semester 1",

            academicYear:
              data.academic_year ||
              "2026",

            emailNotifications:
              data.email_notifications ===
              true,

            assignmentAlerts:
              data.assignment_alerts ===
              true,

            maintenanceMode:
              data.maintenance_mode ===
              true,

          });


        } catch (error) {

          console.error(
            "Load Settings Error:",
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

            navigate("/login");

            return;

          }


          setMessageType(
            "error"
          );


          setMessage(
            error.response?.data
              ?.error ||
            "Failed to load system settings."
          );


        } finally {

          setLoading(false);

        }

      };


    loadSettings();

  }, [navigate]);


  /* ========================================
     SETTINGS INPUT CHANGE
  ======================================== */

  const handleChange =
    (event) => {

      const {
        name,
        value,
        type,
        checked,
      } = event.target;


      setSettings(
        (previousSettings) => ({
          ...previousSettings,

          [name]:
            type ===
            "checkbox"
              ? checked
              : value,
        })
      );


      setMessage("");

    };


  /* ========================================
     PASSWORD INPUT CHANGE
  ======================================== */

  const handlePasswordChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;


      setPasswordForm(
        (previousForm) => ({
          ...previousForm,
          [name]: value,
        })
      );


      setPasswordMessage("");

    };


  /* ========================================
     SAVE SYSTEM SETTINGS
  ======================================== */

  const handleSave =
    async () => {

      if (
        !settings.systemName.trim()
      ) {

        setMessageType(
          "error"
        );

        setMessage(
          "System name is required."
        );

        return;

      }


      if (
        !settings.contactEmail.trim()
      ) {

        setMessageType(
          "error"
        );

        setMessage(
          "System contact email is required."
        );

        return;

      }


      if (
        !settings.semester
      ) {

        setMessageType(
          "error"
        );

        setMessage(
          "Please select a semester."
        );

        return;

      }


      if (
        !settings.academicYear
      ) {

        setMessageType(
          "error"
        );

        setMessage(
          "Please select an academic year."
        );

        return;

      }


      try {

        setSaving(true);

        setMessage("");


        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {

          navigate("/login");

          return;

        }


        const response =
          await axios.put(
            "http://localhost:5000/admin/settings",

            {
              systemName:
                settings.systemName,

              contactEmail:
                settings.contactEmail,

              semester:
                settings.semester,

              academicYear:
                settings.academicYear,

              emailNotifications:
                settings.emailNotifications,

              assignmentAlerts:
                settings.assignmentAlerts,

              maintenanceMode:
                settings.maintenanceMode,
            },

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const saved =
          response.data.settings;


        setSettings({

          systemName:
            saved.system_name,

          contactEmail:
            saved.contact_email,

          semester:
            saved.current_semester,

          academicYear:
            saved.academic_year,

          emailNotifications:
            saved.email_notifications ===
            true,

          assignmentAlerts:
            saved.assignment_alerts ===
            true,

          maintenanceMode:
            saved.maintenance_mode ===
            true,

        });


        setMessageType(
          "success"
        );


        setMessage(
          "Settings saved successfully!"
        );


      } catch (error) {

        console.error(
          "Save Settings Error:",
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

          navigate("/login");

          return;

        }


        setMessageType(
          "error"
        );


        setMessage(
          error.response?.data
            ?.error ||
          "Failed to save system settings."
        );


      } finally {

        setSaving(false);

      }

    };


  /* ========================================
     CHANGE ADMIN PASSWORD
  ======================================== */

  const handleChangePassword =
    async (event) => {

      event.preventDefault();


      if (
        !passwordForm.currentPassword
      ) {

        setPasswordMessageType(
          "error"
        );

        setPasswordMessage(
          "Please enter your current password."
        );

        return;

      }


      if (
        !passwordForm.newPassword
      ) {

        setPasswordMessageType(
          "error"
        );

        setPasswordMessage(
          "Please enter a new password."
        );

        return;

      }


      if (
        passwordForm.newPassword
          .length < 6
      ) {

        setPasswordMessageType(
          "error"
        );

        setPasswordMessage(
          "New password must contain at least 6 characters."
        );

        return;

      }


      if (
        passwordForm.currentPassword ===
        passwordForm.newPassword
      ) {

        setPasswordMessageType(
          "error"
        );

        setPasswordMessage(
          "New password must be different from your current password."
        );

        return;

      }


      if (
        passwordForm.newPassword !==
        passwordForm.confirmPassword
      ) {

        setPasswordMessageType(
          "error"
        );

        setPasswordMessage(
          "New password and confirm password do not match."
        );

        return;

      }


      try {

        setChangingPassword(
          true
        );

        setPasswordMessage("");


        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {

          navigate("/login");

          return;

        }


        await axios.put(
          "http://localhost:5000/admin/change-password",

          {
            currentPassword:
              passwordForm.currentPassword,

            newPassword:
              passwordForm.newPassword,
          },

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });


        setPasswordMessageType(
          "success"
        );


        setPasswordMessage(
          "Password changed successfully! Redirecting to login..."
        );


        /*
          Log the Admin out after
          changing the password.
        */

        setTimeout(() => {

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "role"
          );

          localStorage.removeItem(
            "user"
          );

          navigate("/login");

        }, 1500);


      } catch (error) {

        console.error(
          "Change Password Error:",
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

          navigate("/login");

          return;

        }


        setPasswordMessageType(
          "error"
        );


        setPasswordMessage(
          error.response?.data
            ?.error ||
          "Failed to change password."
        );


      } finally {

        setChangingPassword(
          false
        );

      }

    };


  /* ========================================
     LOADING
  ======================================== */

  if (loading) {

    return (

      <div className="admin-settings-page">

        <section className="aset-card">

          <h2>
            Loading Settings...
          </h2>

          <p>
            Getting system settings
            from PostgreSQL.
          </p>

        </section>

      </div>

    );

  }


  return (

    <div className="admin-settings-page">


      {/* ====================================
          HEADER
      ==================================== */}

      <section className="aset-header">

        <div>

          <h1>
            System Settings
          </h1>

          <p>
            Configure CampusLearn system,
            academic and security preferences.
          </p>

        </div>


        <button
          className="aset-save-top"
          onClick={
            handleSave
          }
          disabled={
            saving
          }
        >

          <Save size={16} />

          {saving
            ? "Saving..."
            : "Save Changes"}

        </button>

      </section>



      {/* ====================================
          SETTINGS MESSAGE
      ==================================== */}

      {message && (

        <div
          style={{
            marginBottom:
              "22px",

            padding:
              "13px 16px",

            borderRadius:
              "10px",

            fontSize:
              "14px",

            fontWeight:
              600,

            backgroundColor:
              messageType ===
              "success"
                ? "#ecfdf5"
                : "#fef2f2",

            color:
              messageType ===
              "success"
                ? "#047857"
                : "#dc2626",

            border:
              messageType ===
              "success"
                ? "1px solid #a7f3d0"
                : "1px solid #fecaca",
          }}
        >

          {message}

        </div>

      )}



      <div className="aset-grid">


        {/* ==================================
            GENERAL SETTINGS
        ================================== */}

        <section className="aset-card">

          <div className="aset-card-header">

            <div className="aset-icon aset-teal">

              <Settings
                size={20}
              />

            </div>


            <div>

              <h2>
                General Settings
              </h2>

              <p>
                Basic CampusLearn
                system information.
              </p>

            </div>

          </div>


          <div className="aset-form-group">

            <label>
              System Name
            </label>


            <div className="aset-input">

              <School
                size={16}
              />


              <input
                type="text"

                name="systemName"

                value={
                  settings.systemName
                }

                onChange={
                  handleChange
                }

                disabled={
                  saving
                }
              />

            </div>

          </div>


          <div className="aset-form-group">

            <label>
              System Contact Email
            </label>


            <div className="aset-input">

              <Mail
                size={16}
              />


              <input
                type="email"

                name="contactEmail"

                value={
                  settings.contactEmail
                }

                onChange={
                  handleChange
                }

                disabled={
                  saving
                }
              />

            </div>

          </div>

        </section>



        {/* ==================================
            ACADEMIC SETTINGS
        ================================== */}

        <section className="aset-card">

          <div className="aset-card-header">

            <div className="aset-icon aset-purple">

              <CalendarDays
                size={20}
              />

            </div>


            <div>

              <h2>
                Academic Settings
              </h2>

              <p>
                Configure the active
                academic period.
              </p>

            </div>

          </div>


          <div className="aset-form-group">

            <label>
              Current Semester
            </label>


            <select
              name="semester"

              value={
                settings.semester
              }

              onChange={
                handleChange
              }

              disabled={
                saving
              }
            >

              <option value="Semester 1">
                Semester 1
              </option>

              <option value="Semester 2">
                Semester 2
              </option>

            </select>

          </div>


          <div className="aset-form-group">

            <label>
              Academic Year
            </label>


            <select
              name="academicYear"

              value={
                settings.academicYear
              }

              onChange={
                handleChange
              }

              disabled={
                saving
              }
            >

              <option value="2026">
                2026
              </option>

              <option value="2027">
                2027
              </option>

              <option value="2028">
                2028
              </option>

              <option value="2029">
                2029
              </option>

              <option value="2030">
                2030
              </option>

            </select>

          </div>

        </section>



        {/* ==================================
            NOTIFICATIONS
        ================================== */}

        <section className="aset-card">

          <div className="aset-card-header">

            <div className="aset-icon aset-blue">

              <Bell size={20} />

            </div>


            <div>

              <h2>
                Notifications
              </h2>

              <p>
                Control system
                notification preferences.
              </p>

            </div>

          </div>


          <div className="aset-toggle-row">

            <div>

              <strong>
                Email Notifications
              </strong>

              <span>
                Send important system
                updates by email.
              </span>

            </div>


            <label className="aset-switch">

              <input
                type="checkbox"

                name="emailNotifications"

                checked={
                  settings
                    .emailNotifications
                }

                onChange={
                  handleChange
                }

                disabled={
                  saving
                }
              />

              <span />

            </label>

          </div>


          <div className="aset-toggle-row">

            <div>

              <strong>
                Assignment Alerts
              </strong>

              <span>
                Notify users about
                assignment activity.
              </span>

            </div>


            <label className="aset-switch">

              <input
                type="checkbox"

                name="assignmentAlerts"

                checked={
                  settings
                    .assignmentAlerts
                }

                onChange={
                  handleChange
                }

                disabled={
                  saving
                }
              />

              <span />

            </label>

          </div>

        </section>



        {/* ==================================
            SECURITY
        ================================== */}

        <section className="aset-card">

          <div className="aset-card-header">

            <div className="aset-icon aset-orange">

              <ShieldCheck
                size={20}
              />

            </div>


            <div>

              <h2>
                Security
              </h2>

              <p>
                Manage system security
                and access settings.
              </p>

            </div>

          </div>


          <div className="aset-security-item">

            <LockKeyhole
              size={18}
            />


            <div>

              <strong>
                Authentication
              </strong>

              <span>
                JWT authentication
                currently enabled.
              </span>

            </div>


            <span className="aset-status">

              Active

            </span>

          </div>


          <div className="aset-security-item">

            <Database
              size={18}
            />


            <div>

              <strong>
                Database
              </strong>

              <span>
                PostgreSQL connection
                available.
              </span>

            </div>


            <span className="aset-status">

              Connected

            </span>

          </div>

        </section>

      </div>



      {/* ====================================
          CHANGE PASSWORD
      ==================================== */}

      <section
        className="aset-card"
        style={{
          marginTop: "24px",
        }}
      >

        <div className="aset-card-header">

          <div className="aset-icon aset-orange">

            <KeyRound
              size={20}
            />

          </div>


          <div>

            <h2>
              Change Password
            </h2>

            <p>
              Update the password for
              your administrator account.
            </p>

          </div>

        </div>


        {passwordMessage && (

          <div
            style={{
              marginBottom:
                "18px",

              padding:
                "12px 14px",

              borderRadius:
                "10px",

              fontSize:
                "13px",

              fontWeight:
                600,

              background:
                passwordMessageType ===
                "success"
                  ? "#ecfdf5"
                  : "#fef2f2",

              color:
                passwordMessageType ===
                "success"
                  ? "#047857"
                  : "#dc2626",

              border:
                passwordMessageType ===
                "success"
                  ? "1px solid #a7f3d0"
                  : "1px solid #fecaca",
            }}
          >

            {passwordMessage}

          </div>

        )}


        <form
          onSubmit={
            handleChangePassword
          }
        >

          <div className="aset-form-group">

            <label>
              Current Password
            </label>


            <div className="aset-input">

              <LockKeyhole
                size={16}
              />


              <input
                type="password"

                name="currentPassword"

                value={
                  passwordForm
                    .currentPassword
                }

                onChange={
                  handlePasswordChange
                }

                placeholder="Enter current password"

                autoComplete="current-password"

                disabled={
                  changingPassword
                }
              />

            </div>

          </div>



          <div className="aset-form-group">

            <label>
              New Password
            </label>


            <div className="aset-input">

              <KeyRound
                size={16}
              />


              <input
                type="password"

                name="newPassword"

                value={
                  passwordForm
                    .newPassword
                }

                onChange={
                  handlePasswordChange
                }

                placeholder="Enter new password"

                autoComplete="new-password"

                disabled={
                  changingPassword
                }
              />

            </div>

          </div>



          <div className="aset-form-group">

            <label>
              Confirm New Password
            </label>


            <div className="aset-input">

              <KeyRound
                size={16}
              />


              <input
                type="password"

                name="confirmPassword"

                value={
                  passwordForm
                    .confirmPassword
                }

                onChange={
                  handlePasswordChange
                }

                placeholder="Re-enter new password"

                autoComplete="new-password"

                disabled={
                  changingPassword
                }
              />

            </div>

          </div>



          <div
            style={{
              display: "flex",
              justifyContent:
                "flex-end",
              marginTop: "18px",
            }}
          >

            <button
              type="submit"

              className="aset-save-top"

              disabled={
                changingPassword
              }
            >

              <KeyRound
                size={16}
              />


              {changingPassword
                ? "Changing..."
                : "Change Password"}

            </button>

          </div>

        </form>

      </section>



      {/* ====================================
          MAINTENANCE MODE
      ==================================== */}

      <section className="aset-maintenance">

        <div>

          <h2>
            Maintenance Mode
          </h2>

          <p>
            Temporarily restrict normal
            users from accessing CampusLearn.
          </p>

        </div>


        <label className="aset-switch">

          <input
            type="checkbox"

            name="maintenanceMode"

            checked={
              settings
                .maintenanceMode
            }

            onChange={
              handleChange
            }

            disabled={
              saving
            }
          />

          <span />

        </label>

      </section>

    </div>

  );

}


export default AdminSettings;