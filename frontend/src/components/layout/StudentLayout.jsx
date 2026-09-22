import StudentSidebar from "./StudentSidebar";
import StudentTopbar from "./StudentTopbar";

function StudentLayout({ children }) {
  return (
    <div className="student-layout">

      <StudentSidebar />

      <div className="student-main">

        <StudentTopbar />

        <main className="student-content">
          {children}
        </main>

      </div>

    </div>
  );
}

export default StudentLayout;