import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

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

  const [notifications, setNotifications] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* ========================================
     LOAD REAL NOTIFICATIONS
  ======================================== */

  useEffect(() => {

    const loadNotifications =
      async () => {

        try {

          setLoading(true);
          setError("");


          const token =
            localStorage.getItem(
              "token"
            );


          if (!token) {

            setError(
              "Please log in again."
            );

            return;

          }


          const response =
            await axios.get(
              "http://localhost:5000/notifications",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          const realNotifications =
            Array.isArray(
              response.data
            )
              ? response.data
              : [];


          setNotifications(
            realNotifications
          );


        } catch (loadError) {

          console.error(
            "Notification loading error:",
            loadError
          );


          setError(
            loadError.response?.data?.error ||
            "Failed to load notifications."
          );


        } finally {

          setLoading(false);

        }

      };


    loadNotifications();

  }, []);


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
     RELATIVE TIME
  ======================================== */

  const getRelativeTime = (
    createdAt
  ) => {

    if (!createdAt) {
      return "";
    }


    const created =
      new Date(
        createdAt
      );

    const now =
      new Date();


    const difference =
      now.getTime() -
      created.getTime();


    const minutes =
      Math.floor(
        difference /
        (1000 * 60)
      );


    if (minutes < 1) {
      return "Just now";
    }


    if (minutes < 60) {

      return `${minutes} ${
        minutes === 1
          ? "minute"
          : "minutes"
      } ago`;

    }


    const hours =
      Math.floor(
        minutes / 60
      );


    if (hours < 24) {

      return `${hours} ${
        hours === 1
          ? "hour"
          : "hours"
      } ago`;

    }


    const days =
      Math.floor(
        hours / 24
      );


    if (days === 1) {
      return "Yesterday";
    }


    if (days < 7) {

      return `${days} days ago`;

    }


    return created.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );

  };


  /* ========================================
     MARK ONE AS READ
  ======================================== */

  const markAsRead =
    async (id) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );


        await axios.put(
          `http://localhost:5000/notifications/${id}/read`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        setNotifications(
          (previous) =>
            previous.map(
              (notification) =>

                notification.id === id

                  ? {
                      ...notification,
                      is_read: true,
                    }

                  : notification
            )
        );


      } catch (readError) {

        console.error(
          "Mark notification error:",
          readError
        );


        setError(
          readError.response?.data?.error ||
          "Failed to mark notification as read."
        );

      }

    };


  /* ========================================
     MARK ALL AS READ
  ======================================== */

  const markAllAsRead =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );


        await axios.put(
          "http://localhost:5000/notifications/read-all",
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        setNotifications(
          (previous) =>
            previous.map(
              (notification) => ({
                ...notification,
                is_read: true,
              })
            )
        );


      } catch (readError) {

        console.error(
          "Mark all notifications error:",
          readError
        );


        setError(
          readError.response?.data?.error ||
          "Failed to mark all notifications as read."
        );

      }

    };


  /* ========================================
     COUNTS
  ======================================== */

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.is_read
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
            searchTerm
              .trim()
              .toLowerCase();


          const title =
            notification.title ||
            "";

          const message =
            notification.message ||
            "";

          const category =
            notification.category ||
            "";


          const matchesSearch =
            title
              .toLowerCase()
              .includes(search) ||

            message
              .toLowerCase()
              .includes(search) ||

            category
              .toLowerCase()
              .includes(search);


          let matchesFilter =
            true;


          if (
            filter === "unread"
          ) {

            matchesFilter =
              !notification.is_read;

          }


          if (
            filter === "read"
          ) {

            matchesFilter =
              notification.is_read;

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
              onClick={
                markAllAsRead
              }
            >

              <CheckCheck
                size={15}
              />

              Mark all as read

            </button>

          )}

        </div>

      </section>


      {/* ====================================
          ERROR
      ==================================== */}

      {error && (

        <div
          style={{
            marginBottom:
              "18px",
            padding:
              "12px 16px",
            borderRadius:
              "12px",
            background:
              "#fff1f2",
            color:
              "#be123c",
            fontSize:
              "14px",
          }}
        >

          {error}

        </div>

      )}


      {/* ====================================
          SUMMARY
      ==================================== */}

      <section className="notifications-summary">

        <div className="notification-summary-card notification-purple">

          <div className="notification-summary-icon">

            <Bell
              size={21}
            />

          </div>


          <div>

            <strong>

              {loading
                ? "..."
                : notifications.length}

            </strong>

            <span>
              All Notifications
            </span>

          </div>

        </div>


        <div className="notification-summary-card notification-blue">

          <div className="notification-summary-icon">

            <MailOpen
              size={21}
            />

          </div>


          <div>

            <strong>

              {loading
                ? "..."
                : unreadCount}

            </strong>

            <span>
              Unread
            </span>

          </div>

        </div>


        <div className="notification-summary-card notification-green">

          <div className="notification-summary-icon">

            <CircleCheck
              size={21}
            />

          </div>


          <div>

            <strong>

              {loading
                ? "..."
                : readCount}

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

          <Search
            size={17}
          />

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

        {loading ? (

          <div className="notifications-empty">

            <div className="notifications-empty-icon">

              <Bell
                size={27}
              />

            </div>


            <h3>
              Loading notifications...
            </h3>


            <p>
              Please wait while your
              notifications are loaded.
            </p>

          </div>

        ) : filteredNotifications.length === 0 ? (

          <div className="notifications-empty">

            <div className="notifications-empty-icon">

              <Bell
                size={27}
              />

            </div>


            <h3>
              No notifications found
            </h3>


            <p>

              {notifications.length === 0
                ? "You don't have any notifications yet."
                : "There are no notifications matching your current filter."}

            </p>

          </div>

        ) : (

          filteredNotifications.map(
            (notification) => {

              const Icon =
                getTypeIcon(
                  notification.type
                );


              const unread =
                !notification.is_read;


              return (

                <article
                  key={
                    notification.id
                  }
                  className={`notification-item ${
                    unread
                      ? "notification-item-unread"
                      : ""
                  }`}
                >

                  {/* ICON */}

                  <div
                    className={`notification-item-icon notification-type-${notification.type}`}
                  >

                    <Icon
                      size={20}
                    />

                  </div>


                  {/* CONTENT */}

                  <div className="notification-item-content">

                    <div className="notification-title-row">

                      <h3>

                        {notification.title}

                      </h3>


                      {unread && (

                        <span className="notification-unread-dot" />

                      )}

                    </div>


                    <p className="notification-message">

                      {notification.message}

                    </p>


                    <div className="notification-meta">

                      <span>

                        <Clock3
                          size={11}
                        />

                        {getRelativeTime(
                          notification.created_at
                        )}

                      </span>


                      <span>

                        {notification.category}

                      </span>

                    </div>

                  </div>


                  {/* ACTION */}

                  <div className="notification-item-action">

                    {unread && (

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