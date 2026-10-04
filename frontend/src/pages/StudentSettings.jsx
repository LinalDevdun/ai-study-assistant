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


function StudentSettings() {

  const navigate =
    useNavigate();


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

  const [error, setError] =
    useState("");


  /* ========================================
     LOAD SETTINGS
  ======================================== */

  useEffect(() => {

    const loadSettings =
      async () => {

        try {

          setLoading(true);
          setError("");


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
                ?.email_notifications ??
              true,

            submission_alerts:
              response.data
                ?.submission_alerts ??
              true,

            academic_reminders:
              response.data
                ?.academic_reminders ??
              true,
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
            "Failed to load settings."
          );


        } finally {

          setLoading(false);

        }

      };


    loadSettings();

  }, [navigate]);


  /* ========================================
     TOGGLE SETTING
  ======================================== */

  const toggleSetting = (
    settingName
  ) => {

    setSettings(
      (previous) => ({
        ...previous,

        [settingName]:
          !previous[
            settingName
          ],
      })
    );

  };


  /* ========================================
     SAVE SETTINGS
  ======================================== */

  const saveSettings =
    async () => {

      try {

        setSaving(true);
        setError("");


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
          "Failed to save settings."
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
          Settings
        </h1>

        <p style={styles.subtitle}>
          Manage your student account
          preferences and notifications.
        </p>

      </div>


      {/* ERROR */}

      {error && (

        <div style={styles.errorBox}>

          {error}

        </div>

      )}


      {/* ====================================
          SETTINGS CARD
      ==================================== */}

      <div style={styles.card}>


        {/* CARD HEADER */}

        <div style={styles.cardHeader}>


          <div style={styles.headerIcon}>

            <Settings size={21} />

          </div>


          <div>

            <h2 style={styles.cardTitle}>
              Notification Preferences
            </h2>

            <p style={styles.cardSubtitle}>
              Choose which academic updates
              you would like to receive.
            </p>

          </div>


        </div>


        <div style={styles.divider} />


        {loading ? (

          <div style={styles.loading}>
            Loading settings...
          </div>

        ) : (

          <>


            <SettingRow
              icon={
                <Mail size={19} />
              }
              title="Email Notifications"
              description="Receive important account and academic updates."
              enabled={
                settings
                  .email_notifications
              }
              onToggle={() =>
                toggleSetting(
                  "email_notifications"
                )
              }
            />


            <SettingRow
              icon={
                <BellRing size={19} />
              }
              title="Assignment Updates"
              description="Receive updates related to assignments and submissions."
              enabled={
                settings
                  .submission_alerts
              }
              onToggle={() =>
                toggleSetting(
                  "submission_alerts"
                )
              }
            />


            <SettingRow
              icon={
                <CalendarClock
                  size={19}
                />
              }
              title="Academic Reminders"
              description="Receive reminders about deadlines and academic tasks."
              enabled={
                settings
                  .academic_reminders
              }
              onToggle={() =>
                toggleSetting(
                  "academic_reminders"
                )
              }
              last
            />


            {/* SAVE */}

            <div style={styles.saveArea}>

              <button
                type="button"
                onClick={
                  saveSettings
                }
                disabled={
                  saving
                }
                style={{
                  ...styles.saveButton,

                  opacity:
                    saving
                      ? 0.7
                      : 1,

                  cursor:
                    saving
                      ? "not-allowed"
                      : "pointer",
                }}
              >

                <Save size={16} />

                {saving
                  ? "Saving..."
                  : "Save Settings"}

              </button>

            </div>


          </>

        )}


      </div>

    </div>

  );

}


/* ========================================
   SETTING ROW
======================================== */

function SettingRow({
  icon,
  title,
  description,
  enabled,
  onToggle,
  last = false,
}) {

  return (

    <div
      style={{
        ...styles.settingRow,

        borderBottom:
          last
            ? "none"
            : "1px solid #edf0f5",
      }}
    >


      <div style={styles.settingLeft}>


        <div style={styles.settingIcon}>

          {icon}

        </div>


        <div>

          <strong style={styles.settingTitle}>

            {title}

          </strong>


          <span style={styles.settingDescription}>

            {description}

          </span>

        </div>


      </div>


      {/* TOGGLE */}

      <button
        type="button"
        onClick={onToggle}
        aria-label={
          `Toggle ${title}`
        }
        style={{
          ...styles.toggle,

          background:
            enabled
              ? "#5865f2"
              : "#d9dfeb",
        }}
      >

        <span
          style={{
            ...styles.toggleCircle,

            transform:
              enabled
                ? "translateX(22px)"
                : "translateX(0)",
          }}
        />

      </button>


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
    maxWidth: "1080px",
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


  /* ERROR */

  errorBox: {
    marginBottom: "18px",

    padding: "12px 15px",

    borderRadius: "10px",

    background: "#fff1f2",

    color: "#dc2626",

    fontSize: "13px",
  },


  /* ========================================
     MAIN CARD
  ======================================== */

  card: {
    maxWidth: "980px",

    padding: "30px 34px 22px",

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

    margin: "24px 0 0",

    background: "#edf0f5",
  },


  /* ========================================
     SETTING ROW
  ======================================== */

  settingRow: {
    minHeight: "88px",

    display: "flex",

    alignItems: "center",

    justifyContent:
      "space-between",

    gap: "22px",
  },


  settingLeft: {
    display: "flex",

    alignItems: "center",

    gap: "15px",
  },


  settingIcon: {
    width: "44px",
    height: "44px",

    flexShrink: 0,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background: "#f1f3ff",

    color: "#5367f4",

    borderRadius: "11px",
  },


  settingTitle: {
    display: "block",

    color: "#101828",

    fontSize: "14px",

    lineHeight: "1.4",

    fontWeight: "700",
  },


  settingDescription: {
    display: "block",

    marginTop: "5px",

    color: "#98a2b3",

    fontSize: "11px",

    lineHeight: "1.45",
  },


  /* ========================================
     TOGGLE
  ======================================== */

  toggle: {
    width: "50px",
    height: "28px",

    flexShrink: 0,

    padding: "3px",

    border: "none",

    borderRadius: "20px",

    cursor: "pointer",

    transition:
      "background 0.2s ease",
  },


  toggleCircle: {
    display: "block",

    width: "22px",
    height: "22px",

    background: "#ffffff",

    borderRadius: "50%",

    boxShadow:
      "0 1px 4px rgba(0,0,0,0.15)",

    transition:
      "transform 0.2s ease",
  },


  /* ========================================
     SAVE BUTTON
  ======================================== */

  saveArea: {
    display: "flex",

    justifyContent: "flex-end",

    paddingTop: "22px",

    borderTop:
      "1px solid #edf0f5",
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


  loading: {
    padding: "28px 0",

    color: "#667085",

    fontSize: "13px",
  },

};


export default StudentSettings;