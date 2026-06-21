import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import GuruParampare from './pages/GuruParampare';
import Institutions from './pages/Institutions';
import SevaBooking from './pages/SevaBooking';
import Publications from './pages/Publications';
import styles from './App.module.css';

function App() {
  return (
    <Router>
      <div className={styles['app-container']}>
        <Navbar />
        <main className={styles['main-content']}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/guru-parampare" element={<GuruParampare />} />
            <Route path="/institutions" element={<Institutions />} />
            <Route path="/seva-booking" element={<SevaBooking />} />
            <Route path="/publications" element={<Publications />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;