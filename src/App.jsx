import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
          <Route path="institutions" element={<Institutions />} />
          <Route path="seva-booking" element={<SevaBooking />} />
          <Route path="publications" element={<Publications />} />
          <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/en" replace />} />
        <Route path="/:lang/*" element={<AppLayout />} />
        <Route path="*" element={<Navigate to="/en" replace />} />
      </Routes>
    </Router>
  );
}