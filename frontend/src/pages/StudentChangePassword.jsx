import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  Save,
} from "lucide-react";


function StudentChangePassword() {

  const navigate =
    useNavigate();


  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");


  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);


  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  /* ========================================
     CHANGE PASSWORD
  ======================================== */

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");


      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {

        setError(
          "Please complete all password fields."
        );

        return;

      }


      if (
        newPassword.length < 6
      ) {

        setError(
          "New password must contain at least 6 characters."
        );

        return;

      }


      if (
        newPassword !==
        confirmPassword
      ) {

        setError(
          "New password and confirmation do not match."
        );

        return;

      }


      if (
        currentPassword ===
        newPassword
      ) {

        setError(
          "New password must be different from your current password."
        );

        return;

      }


      try {

        setSaving(true);


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
            "http://localhost:5000/change-password",

            {
              currentPassword,
              newPassword,
            },

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        alert(
          response.data?.message ||
          "Password changed successfully!"
        );


        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");


      } catch (error) {

        console.error(
          "Change password error:",
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
          error.response
            ?.data?.error ||
          "Failed to change password."
        );


      } finally {

        setSaving(false);

      }

    };


  return (

    <div style={styles.page}>


      {/* ====================================
          PAGE HEADER
      ==================================== */}

      <div style={styles.pageHeader}>

        <h1 style={styles.title}>
          Change Password
        </h1>

        <p style={styles.subtitle}>
          Update your student account
          password securely.
        </p>

      </div>


      {/* ====================================
          PASSWORD CARD
      ==================================== */}

      <form
        onSubmit={
          handleSubmit
        }
        style={styles.card}
      >


        {/* CARD HEADER */}

        <div style={styles.cardHeader}>


          <div style={styles.headerIcon}>

            <LockKeyhole
              size={21}
            />

          </div>


          <div>

            <h2 style={styles.cardTitle}>
              Update Password
            </h2>

            <p style={styles.cardSubtitle}>
              Enter your current password
              before creating a new one.
            </p>

          </div>


        </div>


        <div style={styles.divider} />


        {/* ERROR */}

        {error && (

          <div style={styles.errorBox}>

            {error}

          </div>

        )}


        {/* CURRENT PASSWORD */}

        <PasswordField
          label="Current Password"
          placeholder="Enter your current password"
          value={
            currentPassword
          }
          onChange={
            setCurrentPassword
          }
          show={
            showCurrent
          }
          onToggle={() =>
            setShowCurrent(
              (previous) =>
                !previous
            )
          }
        />


        {/* NEW PASSWORD */}

        <PasswordField
          label="New Password"
          placeholder="Enter your new password"
          value={
            newPassword
          }
          onChange={
            setNewPassword
          }
          show={
            showNew
          }
          onToggle={() =>
            setShowNew(
              (previous) =>
                !previous
            )
          }
        />


        {/* CONFIRM PASSWORD */}

        <PasswordField
          label="Confirm New Password"
          placeholder="Re-enter your new password"
          value={
            confirmPassword
          }
          onChange={
            setConfirmPassword
          }
          show={
            showConfirm
          }
          onToggle={() =>
            setShowConfirm(
              (previous) =>
                !previous
            )
          }
        />


        {/* ====================================
            SECURITY INFO
        ==================================== */}

        <div style={styles.securityBox}>


          <div style={styles.securityIcon}>

            <ShieldCheck
              size={18}
            />

          </div>


          <div>

            <strong style={styles.securityTitle}>
              Password security
            </strong>

            <span style={styles.securityText}>
              Use at least 6 characters
              and choose a password you
              don't use elsewhere.
            </span>

          </div>


        </div>


        {/* ====================================
            SAVE BUTTON
        ==================================== */}

        <div style={styles.saveArea}>

          <button
            type="submit"
            disabled={
              saving
            }
            style={{
              ...styles.saveButton,

              cursor:
                saving
                  ? "not-allowed"
                  : "pointer",

              opacity:
                saving
                  ? 0.7
                  : 1,
            }}
          >

            <Save size={16} />

            {saving
              ? "Updating..."
              : "Update Password"}

          </button>

        </div>


      </form>

    </div>

  );

}


/* ========================================
   PASSWORD FIELD
======================================== */

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  show,
  onToggle,
}) {

  return (

    <div style={styles.field}>


      <label style={styles.label}>

        {label}

      </label>


      <div style={styles.inputWrapper}>


        <input
          type={
            show
              ? "text"
              : "password"
          }
          placeholder={
            placeholder
          }
          value={
            value
          }
          onChange={
            (event) =>
              onChange(
                event.target.value
              )
          }
          style={styles.input}
        />


        <button
          type="button"
          onClick={
            onToggle
          }
          aria-label={
            show
              ? `Hide ${label}`
              : `Show ${label}`
          }
          style={styles.eyeButton}
        >

          {show ? (

            <EyeOff
              size={17}
            />

          ) : (

            <Eye
              size={17}
            />

          )}

        </button>


      </div>


    </div>

  );

}


/* ========================================
   STYLES
======================================== */

const styles = {

  /* PAGE */

  page: {
    padding: "48px 48px",
    maxWidth: "1000px",
  },


  pageHeader: {
    marginBottom: "28px",
  },


  title: {
    margin: 0,

    fontSize: "30px",

    lineHeight: "1.15",

    fontWeight: "800",

    color: "#101828",
  },


  subtitle: {
    margin: "8px 0 0",

    fontSize: "14px",

    lineHeight: "1.6",

    color: "#667085",
  },


  /* ========================================
     MAIN CARD
  ======================================== */

  card: {
    maxWidth: "860px",

    padding: "30px 34px",

    background: "#ffffff",

    borderRadius: "20px",

    boxShadow:
      "0 10px 35px rgba(20, 30, 70, 0.06)",
  },


  cardHeader: {
    display: "flex",

    alignItems: "center",

    gap: "16px",
  },


  headerIcon: {
    width: "48px",
    height: "48px",

    flexShrink: 0,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background: "#eef1ff",

    color: "#5367f4",

    borderRadius: "12px",
  },


  cardTitle: {
    margin: 0,

    color: "#101828",

    fontSize: "19px",

    fontWeight: "750",
  },


  cardSubtitle: {
    margin: "5px 0 0",

    color: "#98a2b3",

    fontSize: "12px",

    lineHeight: "1.5",
  },


  divider: {
    height: "1px",

    margin: "24px 0 26px",

    background: "#edf0f5",
  },


  /* ========================================
     ERROR
  ======================================== */

  errorBox: {
    marginBottom: "20px",

    padding: "12px 14px",

    background: "#fff1f2",

    color: "#dc2626",

    borderRadius: "10px",

    fontSize: "12px",
  },


  /* ========================================
     FORM
  ======================================== */

  field: {
    marginBottom: "20px",
  },


  label: {
    display: "block",

    marginBottom: "8px",

    color: "#101828",

    fontSize: "13px",

    fontWeight: "700",
  },


  inputWrapper: {
    position: "relative",
  },


  input: {
    width: "100%",

    boxSizing: "border-box",

    minHeight: "50px",

    padding:
      "0 46px 0 16px",

    border:
      "1px solid #e3e8f1",

    borderRadius: "12px",

    outline: "none",

    background: "#fbfcff",

    color: "#101828",

    fontSize: "13px",
  },


  eyeButton: {
    position: "absolute",

    right: "16px",

    top: "50%",

    transform:
      "translateY(-50%)",

    padding: 0,

    border: "none",

    background: "transparent",

    color: "#8d99ad",

    cursor: "pointer",
  },


  /* ========================================
     SECURITY BOX
  ======================================== */

  securityBox: {
    marginTop: "8px",

    padding: "16px 18px",

    display: "flex",

    alignItems: "center",

    gap: "14px",

    background: "#f6f8ff",

    border:
      "1px solid #dfe5ff",

    borderRadius: "12px",
  },


  securityIcon: {
    width: "34px",
    height: "34px",

    flexShrink: 0,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    color: "#5367f4",
  },


  securityTitle: {
    display: "block",

    marginBottom: "4px",

    color: "#101828",

    fontSize: "12px",

    fontWeight: "700",
  },


  securityText: {
    display: "block",

    color: "#667085",

    fontSize: "11px",

    lineHeight: "1.45",
  },


  /* ========================================
     SAVE
  ======================================== */

  saveArea: {
    display: "flex",

    justifyContent: "flex-end",

    marginTop: "24px",
  },


  saveButton: {
    minHeight: "42px",

    padding: "0 18px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "8px",

    border: "none",

    borderRadius: "10px",

    background:
      "linear-gradient(135deg, #5364ee, #6555ea)",

    color: "#ffffff",

    fontSize: "12px",

    fontWeight: "700",

    boxShadow:
      "0 7px 18px rgba(83, 100, 238, 0.2)",
  },

};


export default StudentChangePassword;