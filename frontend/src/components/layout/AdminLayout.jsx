import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";


function AdminLayout({ children }) {
  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <AdminSidebar />


      {/* MAIN AREA */}
      <div className="admin-main">

        {/* TOP BAR */}
        <AdminTopbar />


        {/* PAGE CONTENT */}
        <main className="admin-content">

          {children}

        </main>

      </div>

    </div>
  );
}


export default AdminLayout;