import {
  Bell,
  Search,
  ChevronDown,
  Plus,
} from "lucide-react";


function LecturerTopbar() {
  return (
    <header className="lecturer-topbar">

      {/* SEARCH */}
      <div className="lecturer-search">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search courses, students, submissions..."
        />

      </div>


      {/* RIGHT */}
      <div className="lecturer-topbar-actions">

        <button className="lecturer-create-button">

          <Plus size={16} />

          Create

        </button>


        <button className="lecturer-notification-button">

          <Bell size={19} />

          <span>
            4
          </span>

        </button>


        <button className="lecturer-profile">

          <div className="lecturer-top-avatar">
            LE
          </div>


          <div className="lecturer-profile-details">

            <strong>
              Lecturer User
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