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
} from "lucide-react";

import "../styles/lecturerChangePassword.css";


function LecturerChangePassword() {

  const navigate = useNavigate();


  const [formData, setFormData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });


  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [saving, setSaving] =
    useState(false);


  /* ========================================
     HANDLE INPUT
  ======================================== */

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

  };


  /* ========================================
     CHANGE PASSWORD
  ======================================== */

  const handleSubmit = async (event) => {

    event.preventDefault();


    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {

      alert(
        "Please complete all password fields."
      );

      return;

    }


    if (
      formData.newPassword.length < 6
    ) {

      alert(
        "New password must contain at least 6 characters."
      );

      return;

    }


    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {

      alert(
        "New password and confirmation password do not match."
      );

      return;

    }


    if (
      formData.currentPassword ===
      formData.newPassword
    ) {

      alert(
        "New password must be different from your current password."
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


      const response =
        await axios.put(
          "http://localhost:5000/change-password",

          {
            currentPassword:
              formData.currentPassword,

            newPassword:
              formData.newPassword,
          },

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      alert(
        response.data.message ||
        "Password changed successfully!"
      );


      /*
        Log the lecturer out after
        changing the password.
      */

      localStorage.removeItem("token");

      localStorage.removeItem("role");


      navigate("/login");


    } catch (error) {

      console.error(
        "Change password error:",
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
        "Failed to change password."
      );


    } finally {

      setSaving(false);

    }

  };


  return (

    <div className="lecturer-change-password-page">


      {/* HEADER */}

      <section className="lcp-header">

        <h1>
          Change Password
        </h1>

        <p>
          Update your account password
          to keep your lecturer account secure.
        </p>

      </section>


      {/* PASSWORD CARD */}

      <section className="lcp-card">


        <div className="lcp-card-heading">

          <div className="lcp-main-icon">

            <LockKeyhole
              size={25}
            />

          </div>


          <div>

            <h2>
              Update Password
            </h2>

            <p>
              Enter your current password
              before creating a new one.
            </p>

          </div>

        </div>



        <form
          className="lcp-form"
          onSubmit={handleSubmit}
        >


          {/* CURRENT PASSWORD */}

          <div className="lcp-field">

            <label>
              Current Password
            </label>


            <div className="lcp-password-input">

              <input
                type={
                  showCurrent
                    ? "text"
                    : "password"
                }
                name="currentPassword"
                value={
                  formData.currentPassword
                }
                onChange={
                  handleChange
                }
                placeholder="Enter your current password"
                autoComplete="current-password"
              />


              <button
                type="button"
                onClick={() =>
                  setShowCurrent(
                    !showCurrent
                  )
                }
              >

                {showCurrent ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}

              </button>

            </div>

          </div>



          {/* NEW PASSWORD */}

          <div className="lcp-field">

            <label>
              New Password
            </label>


            <div className="lcp-password-input">

              <input
                type={
                  showNew
                    ? "text"
                    : "password"
                }
                name="newPassword"
                value={
                  formData.newPassword
                }
                onChange={
                  handleChange
                }
                placeholder="Enter your new password"
                autoComplete="new-password"
              />


              <button
                type="button"
                onClick={() =>
                  setShowNew(
                    !showNew
                  )
                }
              >

                {showNew ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}

              </button>

            </div>

          </div>



          {/* CONFIRM PASSWORD */}

          <div className="lcp-field">

            <label>
              Confirm New Password
            </label>


            <div className="lcp-password-input">

              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={
                  formData.confirmPassword
                }
                onChange={
                  handleChange
                }
                placeholder="Re-enter your new password"
                autoComplete="new-password"
              />


              <button
                type="button"
                onClick={() =>
                  setShowConfirm(
                    !showConfirm
                  )
                }
              >

                {showConfirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}

              </button>

            </div>

          </div>



          {/* SECURITY NOTE */}

          <div className="lcp-security-note">

            <ShieldCheck
              size={20}
            />

            <div>

              <strong>
                Password security
              </strong>

              <span>
                Use at least 6 characters
                and choose a password you
                don't use elsewhere.
              </span>

            </div>

          </div>



          {/* BUTTONS */}

          <div className="lcp-actions">

            <button
              type="button"
              className="lcp-cancel"
              onClick={() =>
                navigate(
                  "/lecturer/dashboard"
                )
              }
            >
              Cancel
            </button>


            <button
              type="submit"
              className="lcp-submit"
              disabled={saving}
            >

              <LockKeyhole
                size={17}
              />

              {saving
                ? "Changing..."
                : "Change Password"}

            </button>

          </div>

        </form>

      </section>

    </div>

  );

}


export default LecturerChangePassword;