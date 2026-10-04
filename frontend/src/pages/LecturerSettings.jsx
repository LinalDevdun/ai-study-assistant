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
  Mail,
  BellRing,
  CalendarClock,
  Save,
} from "lucide-react";

import "../styles/lecturerSettings.css";


function LecturerSettings() {

  const navigate = useNavigate();


  const [settings, setSettings] =
    useState({
      email_notifications: true,
      submission_alerts: true,
      academic_reminders: true,
    });


  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  /* ========================================
     LOAD SETTINGS
  ======================================== */

  useEffect(() => {

    const loadSettings = async () => {

      try {

        const token =
          localStorage.getItem("token");


        if (!token) {

          navigate("/login");

          return;

        }


        const response =
          await axios.get(
            "http://localhost:5000/user/settings",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        setSettings({
          email_notifications:
            response.data
              ?.email_notifications ?? true,

          submission_alerts:
            response.data
              ?.submission_alerts ?? true,

          academic_reminders:
            response.data
              ?.academic_reminders ?? true,
        });


      } catch (error) {

        console.error(
          "Failed to load settings:",
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
          "Failed to load settings."
        );


      } finally {

        setLoading(false);

      }

    };


    loadSettings();

  }, [navigate]);


  /* ========================================
     TOGGLE
  ======================================== */

  const toggleSetting = (
    settingName
  ) => {

    setSettings(
      (previous) => ({
        ...previous,

        [settingName]:
          !previous[settingName],
      })
    );

  };


  /* ========================================
     SAVE
  ======================================== */

  const saveSettings = async () => {

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
          "http://localhost:5000/user/settings",

          settings,

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      alert(
        response.data?.message ||
        "Settings saved successfully!"
      );


    } catch (error) {

      console.error(
        "Failed to save settings:",
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
        "Failed to save settings."
      );


    } finally {

      setSaving(false);

    }

  };


  return (

    <div className="lecturer-settings-page">


      {/* HEADER */}

      <section className="lset-header">

        <h1>
          Settings
        </h1>

        <p>
          Manage your lecturer account
          preferences and notifications.
        </p>

      </section>



      {/* CARD */}

      <section className="lset-card">


        <div className="lset-card-heading">

          <div className="lset-heading-icon">

            <Settings size={24} />

          </div>


          <div>

            <h2>
              Notification Preferences
            </h2>

            <p>
              Choose which academic updates
              you would like to receive.
            </p>

          </div>

        </div>



        {loading ? (

          <div className="lset-loading">

            Loading settings...

          </div>

        ) : (

          <div className="lset-options">


            {/* EMAIL */}

            <div className="lset-option">

              <div className="lset-option-left">

                <div className="lset-option-icon">

                  <Mail size={20} />

                </div>


                <div>

                  <strong>
                    Email Notifications
                  </strong>

                  <span>
                    Receive important
                    CampusLearn updates by email.
                  </span>

                </div>

              </div>


              <button
                type="button"
                className={
                  settings.email_notifications
                    ? "lset-toggle lset-toggle-active"
                    : "lset-toggle"
                }
                onClick={() =>
                  toggleSetting(
                    "email_notifications"
                  )
                }
                aria-label="Toggle email notifications"
              >

                <span />

              </button>

            </div>



            {/* SUBMISSION ALERTS */}

            <div className="lset-option">

              <div className="lset-option-left">

                <div className="lset-option-icon">

                  <BellRing size={20} />

                </div>


                <div>

                  <strong>
                    Submission Alerts
                  </strong>

                  <span>
                    Receive alerts when
                    students submit coursework.
                  </span>

                </div>

              </div>


              <button
                type="button"
                className={
                  settings.submission_alerts
                    ? "lset-toggle lset-toggle-active"
                    : "lset-toggle"
                }
                onClick={() =>
                  toggleSetting(
                    "submission_alerts"
                  )
                }
                aria-label="Toggle submission alerts"
              >

                <span />

              </button>

            </div>



            {/* ACADEMIC REMINDERS */}

            <div className="lset-option">

              <div className="lset-option-left">

                <div className="lset-option-icon">

                  <CalendarClock
                    size={20}
                  />

                </div>


                <div>

                  <strong>
                    Academic Reminders
                  </strong>

                  <span>
                    Receive reminders about
                    grading and academic tasks.
                  </span>

                </div>

              </div>


              <button
                type="button"
                className={
                  settings.academic_reminders
                    ? "lset-toggle lset-toggle-active"
                    : "lset-toggle"
                }
                onClick={() =>
                  toggleSetting(
                    "academic_reminders"
                  )
                }
                aria-label="Toggle academic reminders"
              >

                <span />

              </button>

            </div>

          </div>

        )}



        {/* SAVE */}

        {!loading && (

          <div className="lset-actions">

            <button
              type="button"
              className="lset-save"
              onClick={saveSettings}
              disabled={saving}
            >

              <Save size={17} />

              {saving
                ? "Saving..."
                : "Save Settings"}

            </button>

          </div>

        )}

      </section>

    </div>

  );

}


export default LecturerSettings;