import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  User,
  Mail,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

import "../styles/lecturerProfile.css";


function LecturerProfile() {

  const navigate = useNavigate();

  const [lecturer, setLecturer] =
    useState({
      name: "",
      email: "",
      role: "LECTURER",
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadProfile = async () => {

      try {

        const token =
          localStorage.getItem("token");


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


        setLecturer(
          response.data
        );


      } catch (loadError) {

        console.error(
          "Failed to load lecturer profile:",
          loadError
        );


        if (
          loadError.response?.status === 401 ||
          loadError.response?.status === 403
        ) {

          localStorage.removeItem("token");
          localStorage.removeItem("role");

          navigate("/login");

          return;

        }


        setError(
          "Failed to load lecturer profile."
        );


      } finally {

        setLoading(false);

      }

    };


    loadProfile();

  }, [navigate]);


  const getInitials = (name) => {

    if (!name) {
      return "LE";
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
      <div className="lecturer-profile-page">

        <div className="lp-loading">
          Loading profile...
        </div>

      </div>
    );

  }


  if (error) {

    return (
      <div className="lecturer-profile-page">

        <div className="lp-loading">
          {error}
        </div>

      </div>
    );

  }


  return (

    <div className="lecturer-profile-page">


      <section className="lp-page-header">

        <div>

          <h1>
            My Profile
          </h1>

          <p>
            View your lecturer account
            information.
          </p>

        </div>

      </section>


      <section className="lp-profile-card">


        <div className="lp-profile-banner">


          <div className="lp-avatar">

            {getInitials(
              lecturer.name
            )}

          </div>


          <div>

            <h2>
              {lecturer.name}
            </h2>

            <p>
              Lecturer
            </p>

          </div>

        </div>


        <div className="lp-details">


          <div className="lp-detail-card">

            <div className="lp-detail-icon">

              <User size={20} />

            </div>


            <div>

              <span>
                Full Name
              </span>

              <strong>
                {lecturer.name}
              </strong>

            </div>

          </div>


          <div className="lp-detail-card">

            <div className="lp-detail-icon">

              <Mail size={20} />

            </div>


            <div>

              <span>
                Email Address
              </span>

              <strong>
                {lecturer.email}
              </strong>

            </div>

          </div>


          <div className="lp-detail-card">

            <div className="lp-detail-icon">

              <ShieldCheck
                size={20}
              />

            </div>


            <div>

              <span>
                Account Role
              </span>

              <strong>
                Lecturer
              </strong>

            </div>

          </div>


          <div className="lp-detail-card">

            <div className="lp-detail-icon">

              <GraduationCap
                size={20}
              />

            </div>


            <div>

              <span>
                Portal
              </span>

              <strong>
                Lecturer Portal
              </strong>

            </div>

          </div>

        </div>

      </section>

    </div>

  );

}


export default LecturerProfile;