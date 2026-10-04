import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  User,
  Mail,
  GraduationCap,
  CalendarDays,
} from "lucide-react";


function StudentProfile() {

  const navigate =
    useNavigate();


  const [student, setStudent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* ========================================
     LOAD STUDENT PROFILE
  ======================================== */

  useEffect(() => {

    const loadProfile =
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
              "http://localhost:5000/me",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          setStudent(
            response.data
          );


        } catch (error) {

          console.error(
            "Failed to load student profile:",
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
            "Failed to load profile."
          );


        } finally {

          setLoading(false);

        }

      };


    loadProfile();

  }, [navigate]);


  /* ========================================
     INITIALS
  ======================================== */

  const getInitials = (name) => {

    if (!name) {
      return "ST";
    }


    return name
      .split(" ")
      .filter(Boolean)
      .map(
        (word) =>
          word.charAt(0)
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();

  };


  if (loading) {

    return (

      <div style={styles.message}>
        Loading profile...
      </div>

    );

  }


  if (error) {

    return (

      <div
        style={{
          ...styles.message,
          color: "#dc2626",
        }}
      >
        {error}
      </div>

    );

  }


  return (

    <div style={styles.page}>


      {/* ====================================
          PAGE HEADER
      ==================================== */}

      <div style={styles.pageHeader}>

        <h1 style={styles.title}>
          My Profile
        </h1>

        <p style={styles.subtitle}>
          View your student account
          information.
        </p>

      </div>


      {/* ====================================
          PROFILE CARD
      ==================================== */}

      <div style={styles.profileCard}>


        {/* PROFILE BANNER */}

        <div style={styles.profileBanner}>


          <div style={styles.avatar}>

            {getInitials(
              student?.name
            )}

          </div>


          <div>

            <h2 style={styles.name}>

              {student?.name ||
                "Student"}

            </h2>


            <p style={styles.role}>
              Student
            </p>

          </div>


        </div>


        {/* ====================================
            PROFILE DETAILS
        ==================================== */}

        <div style={styles.detailsArea}>


          <ProfileItem
            icon={
              <User size={19} />
            }
            label="Full Name"
            value={
              student?.name || "—"
            }
          />


          <ProfileItem
            icon={
              <Mail size={19} />
            }
            label="Email Address"
            value={
              student?.email || "—"
            }
          />


          <ProfileItem
            icon={
              <GraduationCap
                size={19}
              />
            }
            label="Degree"
            value={
              student?.degree || "—"
            }
          />


          <ProfileItem
            icon={
              <CalendarDays
                size={19}
              />
            }
            label="Batch"
            value={
              student?.batch || "—"
            }
          />


        </div>


      </div>

    </div>

  );

}


/* ========================================
   PROFILE DETAIL CARD
======================================== */

function ProfileItem({
  icon,
  label,
  value,
}) {

  return (

    <div style={styles.detailCard}>


      <div style={styles.detailIcon}>

        {icon}

      </div>


      <div>

        <span style={styles.detailLabel}>

          {label}

        </span>


        <strong style={styles.detailValue}>

          {value}

        </strong>

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
    maxWidth: "1180px",
  },


  pageHeader: {
    marginBottom: "28px",
  },


  /* PAGE TITLE */

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
     MAIN PROFILE CARD
  ======================================== */

  profileCard: {
    maxWidth: "1080px",

    overflow: "hidden",

    background: "#ffffff",

    borderRadius: "20px",

    boxShadow:
      "0 10px 35px rgba(20, 30, 70, 0.06)",
  },


  /* ========================================
     PURPLE HEADER
  ======================================== */

  profileBanner: {
    minHeight: "150px",

    padding: "32px 36px",

    display: "flex",

    alignItems: "center",

    gap: "20px",

    background:
      "linear-gradient(110deg, #5545ed 0%, #6678e8 100%)",
  },


  avatar: {
    width: "72px",
    height: "72px",

    flexShrink: 0,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background:
      "rgba(255,255,255,0.14)",

    border:
      "1px solid rgba(255,255,255,0.28)",

    borderRadius: "17px",

    color: "#ffffff",

    fontSize: "20px",

    fontWeight: "700",
  },


  name: {
    margin: 0,

    color: "#ffffff",

    fontSize: "23px",

    lineHeight: "1.25",

    fontWeight: "800",
  },


  role: {
    margin: "7px 0 0",

    color:
      "rgba(255,255,255,0.86)",

    fontSize: "13px",

    lineHeight: "1.5",
  },


  /* ========================================
     PROFILE DETAILS
  ======================================== */

  detailsArea: {
    padding: "30px",

    display: "grid",

    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",

    gap: "16px",
  },


  detailCard: {
    minHeight: "100px",

    boxSizing: "border-box",

    padding: "20px",

    display: "flex",

    alignItems: "center",

    gap: "16px",

    background: "#fafbff",

    border:
      "1px solid #edf0f7",

    borderRadius: "14px",
  },


  detailIcon: {
    width: "46px",
    height: "46px",

    flexShrink: 0,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background: "#eef1ff",

    color: "#5266f2",

    borderRadius: "12px",
  },


  detailLabel: {
    display: "block",

    marginBottom: "5px",

    color: "#98a2b3",

    fontSize: "11px",

    lineHeight: "1.4",
  },


  detailValue: {
    display: "block",

    color: "#111827",

    fontSize: "14px",

    lineHeight: "1.45",

    fontWeight: "700",

    wordBreak: "break-word",
  },


  /* LOADING / ERROR */

  message: {
    padding: "48px",

    color: "#667085",

    fontSize: "14px",
  },

};


export default StudentProfile;