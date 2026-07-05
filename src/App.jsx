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
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="admin" element={<RolePortal role="Admin" />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["Admin", "Manager"]} />}>
            <Route path="manager" element={<RolePortal role="Manager" />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["Admin", "Manager", "Priest"]} />}>
            <Route path="priest" element={<RolePortal role="Priest" />} />
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
