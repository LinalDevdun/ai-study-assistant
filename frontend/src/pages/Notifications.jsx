import { useMemo, useState } from "react";

import {
  Bell,
  Search,
  ClipboardList,
  GraduationCap,
  BookOpen,
  CalendarClock,
  Info,
  CircleCheck,
  Clock3,
  CheckCheck,
  MailOpen,
} from "lucide-react";

import "../styles/notifications.css";


function Notifications() {

  /*
    Temporary frontend notifications.

    Later these will come from the
    backend/database.
  */

  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        type: "assignment",
        title: "New Assignment Available",
        message:
          "A new assignment has been added for Artificial Intelligence & Machine Learning.",
        time: "10 minutes ago",
        category: "Assignment",
        unread: true,
      },
      {
        id: 2,
        type: "grade",
        title: "Assignment Graded",
        message:
          "Your Database Normalization Exercise has been graded. Visit the Grades page to view your result.",
        time: "1 hour ago",
        category: "Grade",
        unread: true,
      },
      {
        id: 3,
        type: "deadline",
        title: "Deadline Reminder",
        message:
          "Your Software Engineering report is due soon. Make sure your final submission is uploaded before the deadline.",
        time: "3 hours ago",
        category: "Deadline",
        unread: true,
      },
      {
        id: 4,
        type: "course",
        title: "New Course Material",
        message:
          "New learning material has been uploaded to Web Development Fundamentals.",
        time: "Yesterday",
        category: "Course",
        unread: false,
      },
      {
        id: 5,
        type: "system",
        title: "CampusLearn Update",
        message:
          "Your student learning portal has been updated with new progress and notification features.",
        time: "2 days ago",
        category: "System",
        unread: false,
      },
    ]);


  const [searchTerm, setSearchTerm] =
    useState("");

  const [filter, setFilter] =
    useState("all");


  /* ========================================
     TYPE ICON
  ======================================== */

  const getTypeIcon = (type) => {

    switch (type) {

      case "assignment":
        return ClipboardList;

      case "grade":
        return GraduationCap;

      case "course":
        return BookOpen;

      case "deadline":
        return CalendarClock;

      default:
        return Info;
    }

  };


  /* ========================================
     MARK ONE AS READ
  ======================================== */

  const markAsRead = (id) => {

    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              unread: false,
            }
          : notification
      )
    );

  };


  /* ========================================
     MARK ALL AS READ
  ======================================== */

  const markAllAsRead = () => {

    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );

  };


  /* ========================================
     COUNTS
  ======================================== */

  const unreadCount =
    notifications.filter(
      (notification) =>
        notification.unread
    ).length;


  const readCount =
    notifications.length -
    unreadCount;


  /* ========================================
     SEARCH + FILTER
  ======================================== */

  const filteredNotifications =
    useMemo(() => {

      return notifications.filter(
        (notification) => {

          const search =
            searchTerm.toLowerCase();


          const matchesSearch =
            notification.title
              .toLowerCase()
              .includes(search) ||

            notification.message
              .toLowerCase()
              .includes(search) ||

            notification.category
              .toLowerCase()
              .includes(search);


          let matchesFilter = true;


          if (filter === "unread") {
            matchesFilter =
              notification.unread;
          }


          if (filter === "read") {
            matchesFilter =
              !notification.unread;
          }


          return (
            matchesSearch &&
            matchesFilter
          );

        }
      );

    }, [
      notifications,
      searchTerm,
      filter,
    ]);


  return (
    <div className="notifications-page">

      {/* ====================================
          HEADER
      ==================================== */}

      <section className="notifications-header">

        <div>

          <h1>
            Notifications
          </h1>

          <p>
            Stay updated with assignments,
            grades, course materials and
            important academic reminders.
          </p>

        </div>


        <div className="notifications-header-actions">

          <div className="notification-count-badge">

            <Bell size={16} />

            {unreadCount} Unread

          </div>


          {unreadCount > 0 && (

            <button
              className="mark-all-button"
              onClick={markAllAsRead}
            >

              <CheckCheck size={15} />

              Mark all as read

            </button>

          )}

        </div>

      </section>


      {/* ====================================
          SUMMARY
      ==================================== */}

      <section className="notifications-summary">

        <div className="notification-summary-card notification-purple">

          <div className="notification-summary-icon">

            <Bell size={21} />

          </div>


          <div>

            <strong>
              {notifications.length}
            </strong>

            <span>
              All Notifications
            </span>

          </div>

        </div>


        <div className="notification-summary-card notification-blue">

          <div className="notification-summary-icon">

            <MailOpen size={21} />

          </div>


          <div>

            <strong>
              {unreadCount}
            </strong>

            <span>
              Unread
            </span>

          </div>

        </div>


        <div className="notification-summary-card notification-green">

          <div className="notification-summary-icon">

            <CircleCheck size={21} />

          </div>


          <div>

            <strong>
              {readCount}
            </strong>

            <span>
              Read
            </span>

          </div>

        </div>

      </section>


      {/* ====================================
          TOOLBAR
      ==================================== */}

      <section className="notifications-toolbar">

        <div className="notification-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>


        <select
          className="notification-filter"
          value={filter}
          onChange={(event) =>
            setFilter(
              event.target.value
            )
          }
        >

          <option value="all">
            All Notifications
          </option>

          <option value="unread">
            Unread
          </option>

          <option value="read">
            Read
          </option>

        </select>

      </section>


      {/* ====================================
          LIST
      ==================================== */}

      <section className="notifications-list">

        {filteredNotifications.length === 0 ? (

          <div className="notifications-empty">

            <div className="notifications-empty-icon">

              <Bell size={27} />

            </div>


            <h3>
              No notifications found
            </h3>


            <p>
              There are no notifications
              matching your current filter.
            </p>

          </div>

        ) : (

          filteredNotifications.map(
            (notification) => {

              const Icon =
                getTypeIcon(
                  notification.type
                );


              return (
                <article
                  key={notification.id}
                  className={`notification-item ${
                    notification.unread
                      ? "notification-item-unread"
                      : ""
                  }`}
                >

                  {/* ICON */}
                  <div
                    className={`notification-item-icon notification-type-${notification.type}`}
                  >

                    <Icon size={20} />

                  </div>


                  {/* CONTENT */}
                  <div className="notification-item-content">

                    <div className="notification-title-row">

                      <h3>
                        {notification.title}
                      </h3>


                      {notification.unread && (

                        <span className="notification-unread-dot" />

                      )}

                    </div>


                    <p className="notification-message">

                      {notification.message}

                    </p>


                    <div className="notification-meta">

                      <span>

                        <Clock3 size={11} />

                        {notification.time}

                      </span>


                      <span>

                        {notification.category}

                      </span>

                    </div>

                  </div>


                  {/* ACTION */}
                  <div className="notification-item-action">

                    {notification.unread && (

                      <button
                        className="notification-read-button"
                        title="Mark as read"
                        onClick={() =>
                          markAsRead(
                            notification.id
                          )
                        }
                      >

                        <CircleCheck
                          size={17}
                        />

                      </button>

                    )}

                  </div>

                </article>
              );

            }
          )

        )}

      </section>

    </div>
  );
}


export default Notifications;