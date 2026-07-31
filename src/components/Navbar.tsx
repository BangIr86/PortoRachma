import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-rachma-bg/80 backdrop-blur-md border-b border-rachma-soft/50 py-3 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Identitas */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-rachma-primary text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
            FR
          </div>
          <div>
            <h1 className="font-bold text-rachma-text text-base leading-tight group-hover:text-rachma-primary transition-colors">
              Fikriya Rachma
            </h1>
            <p className="text-xs text-rachma-muted font-medium">
              PPG Prajabatan GEL 1 2024
            </p>
          </div>
        </Link>

        {/* Menu Navigasi */}
        <nav className="hidden md:flex items-center gap-1 bg-white/70 px-3 py-1.5 rounded-full border border-rachma-soft/60 shadow-sm">
          <Link to="/" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${isActive('/') ? 'bg-rachma-primary text-white shadow-sm' : 'text-rachma-text hover:text-rachma-primary hover:bg-rachma-soft/30'}`}>
            Beranda
          </Link>
          <Link to="/about" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${isActive('/about') ? 'bg-rachma-primary text-white shadow-sm' : 'text-rachma-text hover:text-rachma-primary hover:bg-rachma-soft/30'}`}>
            Tentang Saya
          </Link>
          <Link to="/ppg-corner" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${isActive('/ppg-corner') || location.pathname.startsWith('/ppg-corner') ? 'bg-rachma-primary text-white shadow-sm' : 'text-rachma-text hover:text-rachma-primary hover:bg-rachma-soft/30'}`}>
            PPG Corner
          </Link>
        </nav>

        {/* Tombol Hubungi Saya */}
        <div>
          <a href="mailto:fikriya.rachma@example.com" className="px-5 py-2 rounded-full bg-rachma-primary hover:bg-rachma-secondary text-white text-sm font-semibold shadow-md transition-all duration-200 hover:shadow-lg inline-block">
            Hubungi Saya
          </a>
        </div>

      </div>
    </header>
  );
};