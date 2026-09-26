import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Bell,
  Search,
  ChevronDown,
  Plus,
} from "lucide-react";


function LecturerTopbar() {

  const navigate = useNavigate();


  /* ========================================
     LECTURER DATA
  ======================================== */

  const [lecturer, setLecturer] =
    useState({
      name: "Lecturer User",
      email: "",
      role: "LECTURER",
    });


  /* ========================================
     GET LOGGED-IN LECTURER
  ======================================== */

  useEffect(() => {

    const fetchLecturer = async () => {

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


        setLecturer(response.data);

      } catch (error) {

        console.error(
          "Failed to load lecturer profile:",
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

        }

      }

    };


    fetchLecturer();

  }, [navigate]);


  /* ========================================
     INITIALS
  ======================================== */

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


  const initials =
    getInitials(lecturer.name);


  return (
    <header className="lecturer-topbar">


      {/* ====================================
          SEARCH
      ==================================== */}

      <div className="lecturer-search">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search courses, students, submissions..."
        />

      </div>



      {/* ====================================
          RIGHT SIDE
      ==================================== */}

      <div className="lecturer-topbar-actions">


        {/* CREATE */}

        <button className="lecturer-create-button">

          <Plus size={16} />

          Create

        </button>



        {/* NOTIFICATIONS */}

        <button className="lecturer-notification-button">

          <Bell size={19} />

          <span>
            4
          </span>

        </button>



        {/* PROFILE */}

        <button className="lecturer-profile">


          <div className="lecturer-top-avatar">

            {initials}

          </div>


          <div className="lecturer-profile-details">

            <strong>

              {lecturer.name}

            </strong>

            <span>
              Lecturer
            </span>

          </div>


          <ChevronDown
            size={16}
          />

        </button>

      </div>

    </header>
  );
}


export default LecturerTopbar;