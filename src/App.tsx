import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { PPGCorner } from './pages/PPGCorner';
import { DetailMatkul } from './pages/DetailMatkul';
import { Admin } from './pages/Admin';

export function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-rachma-bg">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/ppg-corner" element={<PPGCorner />} />
            <Route path="/ppg-corner/:id" element={<DetailMatkul />} />
            <Route path="/admin" element={<Admin />} />
            
            {/* Fallback jika rute tidak ditemukan */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;