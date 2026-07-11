import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./auth/AuthProvider";
import { USER_ROLES } from "./auth/access";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import GuruParampare from "./pages/GuruParampare";
import Institutions from "./pages/Institutions";
import SevaBooking from "./pages/SevaBooking";
import Publications from "./pages/Publications";
import SadguruVamshaVruksha from "./pages/SadguruVamshaVruksha/SadguruVamshaVruksha";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RolePortal from "./pages/RolePortal";
import Unauthorized from "./pages/Unauthorized";
import styles from "./App.module.css";

function AppLayout() {
  return (
    <div className={styles["app-wrapper"]}>
      <Navbar />
      <main className={styles["main-content"]}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="events" element={<Events />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="guru-parampare" element={<GuruParampare />} />
          <Route path="sadguru-vamsha-vruksha" element={<SadguruVamshaVruksha />} />
          <Route path="institutions" element={<Institutions />} />
          <Route path="seva-booking" element={<SevaBooking />} />
          <Route path="publications" element={<Publications />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute allowedRoles={USER_ROLES} />}>
            <Route path="dashboard" element={<Dashboard section="overview" />} />
            <Route path="dashboard/profile" element={<Dashboard section="profile" />} />
            <Route path="dashboard/book-seva" element={<Dashboard section="book-seva" />} />
            <Route path="dashboard/bookings" element={<Dashboard section="bookings" />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="admin" element={<RolePortal role="admin" section="overview" />} />
            <Route path="admin/staff" element={<RolePortal role="admin" section="staff" />} />
            <Route path="admin/seva-editor" element={<RolePortal role="admin" section="seva-editor" />} />
            <Route path="admin/seva-editor/:sevaId" element={<RolePortal role="admin" section="seva-editor" />} />
            <Route path="admin/sevas" element={<RolePortal role="admin" section="sevas" />} />
            <Route path="admin/bookings" element={<RolePortal role="admin" section="bookings" />} />
            <Route path="admin/calendar" element={<RolePortal role="admin" section="calendar" />} />
            <Route path="admin/calendar/:bookingDate" element={<RolePortal role="admin" section="calendar-detail" />} />
            <Route path="admin/users" element={<RolePortal role="admin" section="users" />} />
            <Route path="admin/lookups" element={<RolePortal role="admin" section="lookups" />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin", "manager"]} />}>
            <Route path="manager" element={<RolePortal role="manager" section="overview" />} />
            <Route path="manager/sevas" element={<RolePortal role="manager" section="sevas" />} />
            <Route path="manager/bookings" element={<RolePortal role="manager" section="bookings" />} />
            <Route path="manager/calendar" element={<RolePortal role="manager" section="calendar" />} />
            <Route path="manager/calendar/:bookingDate" element={<RolePortal role="manager" section="calendar-detail" />} />
            <Route path="manager/users" element={<RolePortal role="manager" section="users" />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin", "manager", "priest"]} />}>
            <Route path="priest" element={<RolePortal role="priest" section="overview" />} />
            <Route path="priest/sevas" element={<RolePortal role="priest" section="sevas" />} />
            <Route path="priest/bookings" element={<RolePortal role="priest" section="bookings" />} />
            <Route path="priest/calendar" element={<RolePortal role="priest" section="calendar" />} />
            <Route path="priest/calendar/:bookingDate" element={<RolePortal role="priest" section="calendar-detail" />} />
          </Route>

          <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/en" replace />} />
          <Route path="/:lang/*" element={<AppLayout />} />
          <Route path="*" element={<Navigate to="/en" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
