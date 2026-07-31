import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-rachma-soft/60 py-6 px-4 md:px-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <h3 className="font-bold text-rachma-text text-sm">Fikriya Rachma</h3>
          <p className="text-xs text-rachma-muted">Portofolio Digital PPG Prajabatan 2024</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-rachma-muted">
          <span>&copy; {new Date().getFullYear()} Fikriya Rachma. All rights reserved.</span>
          <Link to="/admin" className="hover:text-rachma-primary transition-colors">
            🔒 Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};