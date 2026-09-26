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


function AdminTopbar() {

  const navigate = useNavigate();


  /* ========================================
     ADMIN DATA
  ======================================== */

  const [admin, setAdmin] = useState({
    name: "Admin User",
    email: "",
    role: "ADMIN",
  });


  /* ========================================
     GET LOGGED-IN ADMIN
  ======================================== */

  useEffect(() => {

    const fetchAdmin = async () => {

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


        setAdmin(response.data);

      } catch (error) {

        console.error(
          "Failed to load admin profile:",
          error
        );


        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {

          localStorage.removeItem("token");
          localStorage.removeItem("role");

          navigate("/login");

        }

      }

    };


    fetchAdmin();

  }, [navigate]);


  /* ========================================
     INITIALS
  ======================================== */

  const getInitials = (name) => {

    if (!name) {
      return "AD";
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
    getInitials(admin.name);


  return (
    <header className="admin-topbar">


      {/* SEARCH */}

      <div className="admin-search">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search users, courses, reports..."
        />

      </div>



      {/* RIGHT SIDE */}

      <div className="admin-topbar-actions">


        {/* CREATE BUTTON */}

        <button className="admin-create-button">

          <Plus size={16} />

          Add New

        </button>



        {/* NOTIFICATIONS */}

        <button className="admin-notification-button">

          <Bell size={19} />

          <span>
            5
          </span>

        </button>



        {/* PROFILE */}

        <button className="admin-profile">

          <div className="admin-top-avatar">

            {initials}

          </div>


          <div className="admin-profile-details">

            <strong>
              {admin.name}
            </strong>

            <span>
              Administrator
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


export default AdminTopbar;