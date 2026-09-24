import {
  Bell,
  Search,
  ChevronDown,
  Plus,
} from "lucide-react";


function AdminTopbar() {

  return (
    <header className="admin-topbar">


      {/* ====================================
          SEARCH
      ==================================== */}

      <div className="admin-search">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search users, courses, reports..."
        />

      </div>



      {/* ====================================
          RIGHT SIDE
      ==================================== */}

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

            AD

          </div>


          <div className="admin-profile-details">

            <strong>
              Admin User
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