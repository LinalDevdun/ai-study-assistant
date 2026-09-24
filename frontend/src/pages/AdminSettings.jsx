import { useState } from "react";

import {
  Settings,
  Bell,
  ShieldCheck,
  Database,
  Save,
  Mail,
  School,
  CalendarDays,
  LockKeyhole,
} from "lucide-react";

import "../styles/adminSettings.css";


function AdminSettings() {
  const [settings, setSettings] = useState({
    systemName: "CampusLearn",
    email: "admin@campuslearn.lk",
    semester: "Semester 1",
    academicYear: "2026",
    emailNotifications: true,
    assignmentAlerts: true,
    maintenanceMode: false,
  });


  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setSettings({
      ...settings,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };


  const handleSave = () => {
    alert("Settings saved successfully!");
  };


  return (
    <div className="admin-settings-page">

      {/* HEADER */}

      <section className="aset-header">

        <div>

          <h1>
            System Settings
          </h1>

          <p>
            Configure CampusLearn system,
            academic and security preferences.
          </p>

        </div>


        <button
          className="aset-save-top"
          onClick={handleSave}
        >

          <Save size={16} />

          Save Changes

        </button>

      </section>



      <div className="aset-grid">


        {/* GENERAL SETTINGS */}

        <section className="aset-card">

          <div className="aset-card-header">

            <div className="aset-icon aset-teal">

              <Settings size={20} />

            </div>

            <div>

              <h2>
                General Settings
              </h2>

              <p>
                Basic CampusLearn
                system information.
              </p>

            </div>

          </div>


          <div className="aset-form-group">

            <label>
              System Name
            </label>

            <div className="aset-input">

              <School size={16} />

              <input
                type="text"
                name="systemName"
                value={
                  settings.systemName
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </div>


          <div className="aset-form-group">

            <label>
              Administrator Email
            </label>

            <div className="aset-input">

              <Mail size={16} />

              <input
                type="email"
                name="email"
                value={
                  settings.email
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </div>

        </section>



        {/* ACADEMIC SETTINGS */}

        <section className="aset-card">

          <div className="aset-card-header">

            <div className="aset-icon aset-purple">

              <CalendarDays
                size={20}
              />

            </div>

            <div>

              <h2>
                Academic Settings
              </h2>

              <p>
                Configure the active
                academic period.
              </p>

            </div>

          </div>


          <div className="aset-form-group">

            <label>
              Current Semester
            </label>

            <select
              name="semester"
              value={
                settings.semester
              }
              onChange={
                handleChange
              }
            >

              <option>
                Semester 1
              </option>

              <option>
                Semester 2
              </option>

            </select>

          </div>


          <div className="aset-form-group">

            <label>
              Academic Year
            </label>

            <select
              name="academicYear"
              value={
                settings.academicYear
              }
              onChange={
                handleChange
              }
            >

              <option value="2026">
                2026
              </option>

              <option value="2027">
                2027
              </option>

              <option value="2028">
                2028
              </option>

            </select>

          </div>

        </section>



        {/* NOTIFICATIONS */}

        <section className="aset-card">

          <div className="aset-card-header">

            <div className="aset-icon aset-blue">

              <Bell size={20} />

            </div>

            <div>

              <h2>
                Notifications
              </h2>

              <p>
                Control system
                notification preferences.
              </p>

            </div>

          </div>


          <div className="aset-toggle-row">

            <div>

              <strong>
                Email Notifications
              </strong>

              <span>
                Send important system
                updates by email.
              </span>

            </div>


            <label className="aset-switch">

              <input
                type="checkbox"
                name="emailNotifications"
                checked={
                  settings.emailNotifications
                }
                onChange={
                  handleChange
                }
              />

              <span />

            </label>

          </div>


          <div className="aset-toggle-row">

            <div>

              <strong>
                Assignment Alerts
              </strong>

              <span>
                Notify users about
                assignment activity.
              </span>

            </div>


            <label className="aset-switch">

              <input
                type="checkbox"
                name="assignmentAlerts"
                checked={
                  settings.assignmentAlerts
                }
                onChange={
                  handleChange
                }
              />

              <span />

            </label>

          </div>

        </section>



        {/* SECURITY */}

        <section className="aset-card">

          <div className="aset-card-header">

            <div className="aset-icon aset-orange">

              <ShieldCheck
                size={20}
              />

            </div>

            <div>

              <h2>
                Security
              </h2>

              <p>
                Manage system security
                and access settings.
              </p>

            </div>

          </div>


          <div className="aset-security-item">

            <LockKeyhole
              size={18}
            />

            <div>

              <strong>
                Authentication
              </strong>

              <span>
                JWT authentication
                currently enabled.
              </span>

            </div>


            <span className="aset-status">

              Active

            </span>

          </div>


          <div className="aset-security-item">

            <Database size={18} />

            <div>

              <strong>
                Database
              </strong>

              <span>
                PostgreSQL connection
                available.
              </span>

            </div>


            <span className="aset-status">

              Connected

            </span>

          </div>

        </section>

      </div>



      {/* MAINTENANCE */}

      <section className="aset-maintenance">

        <div>

          <h2>
            Maintenance Mode
          </h2>

          <p>
            Temporarily restrict normal
            users from accessing CampusLearn.
          </p>

        </div>


        <label className="aset-switch">

          <input
            type="checkbox"
            name="maintenanceMode"
            checked={
              settings.maintenanceMode
            }
            onChange={
              handleChange
            }
          />

          <span />

        </label>

      </section>

    </div>
  );
}


export default AdminSettings;