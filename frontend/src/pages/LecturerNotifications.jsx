import {
  useMemo,
  useState,
} from "react";

import {
  Bell,
  Sparkles,
  Inbox,
  ClipboardCheck,
  GraduationCap,
  CalendarClock,
  CheckCheck,
  SlidersHorizontal,
} from "lucide-react";

import "../styles/lecturerNotifications.css";


function LecturerNotifications() {

  const [activeFilter, setActiveFilter] =
    useState("all");


  /*
    Real lecturer notifications will later
    come from the backend.

    For now we keep this empty instead of
    displaying fake notification data.
  */

  const [notifications] =
    useState([]);


  const filters = [
    {
      key: "all",
      label: "All Activity",
      icon: Inbox,
    },
    {
      key: "submission",
      label: "Submissions",
      icon: ClipboardCheck,
    },
    {
      key: "grading",
      label: "Grading",
      icon: GraduationCap,
    },
    {
      key: "academic",
      label: "Academic",
      icon: CalendarClock,
    },
  ];


  const filteredNotifications =
    useMemo(() => {

      if (activeFilter === "all") {
        return notifications;
      }

      return notifications.filter(
        (notification) =>
          notification.type ===
          activeFilter
      );

    }, [
      activeFilter,
      notifications,
    ]);


  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;


  return (

    <div className="lecturer-notifications-page">


      {/* ====================================
          HERO
      ==================================== */}

      <section className="ln-hero">


        <div className="ln-hero-content">


          <div className="ln-hero-icon">

            <Bell size={25} />

          </div>


          <div>

            <div className="ln-eyebrow">

              <Sparkles size={12} />

              LECTURER ACTIVITY CENTER

            </div>


            <h1>
              Stay in the loop.
            </h1>


            <p>
              Track student submissions,
              grading activity and important
              academic updates from one place.
            </p>


          </div>


        </div>


        <div className="ln-hero-status">


          <div className="ln-status-icon">

            <CheckCheck size={20} />

          </div>


          <div>

            <span>
              UNREAD ACTIVITY
            </span>

            <strong>
              {unreadCount}
            </strong>

            <small>
              notifications waiting
            </small>

          </div>


        </div>


      </section>


      {/* ====================================
          ACTIVITY OVERVIEW
      ==================================== */}

      <section className="ln-overview">


        <div className="ln-overview-item">


          <div className="ln-overview-icon ln-overview-blue">

            <Inbox size={19} />

          </div>


          <div>

            <span>
              TOTAL
            </span>

            <strong>
              {notifications.length}
            </strong>

            <small>
              notifications
            </small>

          </div>


        </div>


        <div className="ln-overview-divider" />


        <div className="ln-overview-item">


          <div className="ln-overview-icon ln-overview-purple">

            <ClipboardCheck size={19} />

          </div>


          <div>

            <span>
              SUBMISSIONS
            </span>

            <strong>
              {
                notifications.filter(
                  (item) =>
                    item.type ===
                    "submission"
                ).length
              }
            </strong>

            <small>
              student activity
            </small>

          </div>


        </div>


        <div className="ln-overview-divider" />


        <div className="ln-overview-item">


          <div className="ln-overview-icon ln-overview-green">

            <GraduationCap size={19} />

          </div>


          <div>

            <span>
              GRADING
            </span>

            <strong>
              {
                notifications.filter(
                  (item) =>
                    item.type ===
                    "grading"
                ).length
              }
            </strong>

            <small>
              grading updates
            </small>

          </div>


        </div>


      </section>


      {/* ====================================
          NOTIFICATION WORKSPACE
      ==================================== */}

      <section className="ln-workspace">


        {/* HEADER */}

        <div className="ln-workspace-header">


          <div>

            <span>
              ACTIVITY INBOX
            </span>

            <h2>
              Your Notifications
            </h2>

            <p>
              Review the latest activity
              related to your lecturer account.
            </p>

          </div>


          <div className="ln-workspace-badge">

            <Bell size={14} />

            Lecturer Portal

          </div>


        </div>


        {/* ==================================
            FILTER BAR
        ================================== */}

        <div className="ln-filter-bar">


          <div className="ln-filter-title">

            <SlidersHorizontal
              size={15}
            />

            Filter activity

          </div>


          <div className="ln-filter-tabs">


            {filters.map(
              (filter) => {

                const Icon =
                  filter.icon;


                return (

                  <button
                    key={filter.key}
                    type="button"
                    className={
                      activeFilter ===
                      filter.key
                        ? "ln-filter-button ln-filter-button-active"
                        : "ln-filter-button"
                    }
                    onClick={() =>
                      setActiveFilter(
                        filter.key
                      )
                    }
                  >

                    <Icon size={14} />

                    {filter.label}

                  </button>

                );

              }
            )}


          </div>


        </div>


        {/* ==================================
            NOTIFICATIONS
        ================================== */}

        <div className="ln-content">


          {filteredNotifications.length ===
          0 ? (

            <div className="ln-empty">


              <div className="ln-empty-visual">


                <div className="ln-empty-circle ln-empty-circle-one" />

                <div className="ln-empty-circle ln-empty-circle-two" />


                <div className="ln-empty-icon">

                  <Bell size={28} />

                </div>


                <div className="ln-empty-check">

                  <CheckCheck
                    size={14}
                  />

                </div>


              </div>


              <span className="ln-empty-eyebrow">

                ALL CAUGHT UP

              </span>


              <h2>
                Your notification inbox
                is clear
              </h2>


              <p>

                New student submissions,
                grading reminders and
                academic updates will appear
                here when they become
                available.

              </p>


              <div className="ln-empty-types">


                <div>

                  <ClipboardCheck
                    size={14}
                  />

                  Submission activity

                </div>


                <div>

                  <GraduationCap
                    size={14}
                  />

                  Grading updates

                </div>


                <div>

                  <CalendarClock
                    size={14}
                  />

                  Academic reminders

                </div>


              </div>


            </div>

          ) : (

            <div className="ln-notification-list">

              {/*
                Real notification cards will
                be rendered here once the
                lecturer notification backend
                is connected.
              */}

            </div>

          )}


        </div>


      </section>


    </div>

  );

}


export default LecturerNotifications;