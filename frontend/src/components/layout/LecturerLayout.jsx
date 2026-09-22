import LecturerSidebar from "./LecturerSidebar";
import LecturerTopbar from "./LecturerTopbar";

function LecturerLayout({ children }) {
  return (
    <div className="lecturer-layout">

      <LecturerSidebar />

      <div className="lecturer-main">

        <LecturerTopbar />

        <main className="lecturer-content">
          {children}
        </main>

      </div>

    </div>
  );
}

export default LecturerLayout;