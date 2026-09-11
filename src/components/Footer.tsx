import React from 'react';


export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-rachma-soft/60 py-6 px-4 md:px-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <h3 className="font-bold text-rachma-text text-sm">Fikriya Rachma</h3>
          <p className="text-xs text-rachma-muted">Portofolio Digital PPG Calon Guru 2026</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-rachma-muted">
          <span>&copy; {new Date().getFullYear()} Fikriya Rachma. All rights reserved.</span>
          <button 
            onClick={() => {
              const { hostname, protocol, port } = window.location;
              const portStr = port ? `:${port}` : '';
              // Buang 'www.' jika ada
              const cleanHostname = hostname.replace(/^www\./, '');
              
              let adminUrl = '';
              if (cleanHostname === 'localhost' || cleanHostname === '127.0.0.1') {
                adminUrl = `${protocol}//admin.localhost${portStr}`;
              } else if (cleanHostname.includes('vercel.app')) {
                adminUrl = `${protocol}//admin-${cleanHostname}${portStr}`;
              } else {
                adminUrl = `${protocol}//admin.${cleanHostname}${portStr}`;
              }
              window.location.href = adminUrl;
            }}
            className="hover:text-rachma-primary transition-colors cursor-pointer"
          >
            🔒 Admin
          </button>
        </div>
      </div>
    </footer>
  );
};