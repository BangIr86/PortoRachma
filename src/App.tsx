import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { PPGCorner } from './pages/PPGCorner';
import { DetailMatkul } from './pages/DetailMatkul';
import { Admin } from './pages/Admin';

export function App() {
  // Mendapatkan URL domain yang sedang diakses pengunjung
  const hostname = window.location.hostname;

  // Cek apakah pengunjung mengakses lewat subdomain khusus admin
  // (Misal: admin.fikriyarachma.com ATAU admin-fikriya.vercel.app)
  const isAdminDomain = hostname.startsWith('admin');

  // ==========================================
  // TAMPILAN KHUSUS SUBDOMAIN ADMIN
  // ==========================================
  if (isAdminDomain) {
    return (
      <Router>
        <Routes>
          {/* Apapun path yang diketik di subdomain ini, akan selalu membuka Admin */}
          <Route path="*" element={<Admin />} />
        </Routes>
      </Router>
    );
  }

  // ==========================================
  // TAMPILAN WEBSITE PUBLIK (DOMAIN UTAMA)
  // ==========================================
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
            
            {/* Kita bisa menghapus rute /admin di sini agar orang tidak bisa 
                mengakses admin lewat domain utama lagi */}
                
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;