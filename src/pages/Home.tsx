import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Home: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      // Mengambil data profil dengan ID 1 dari Supabase
      const { data } = await supabase.from('profiles').select('*').eq('id', 1).single();
      if (data) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  // Tampilan saat data sedang dimuat
  if (loading) {
    return (
      <div className="min-h-screen bg-rachma-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-rachma-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rachma-bg flex items-center justify-center py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Bagian Teks (Kiri) */}
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rachma-soft/50 text-rachma-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Selamat Datang di Portofolio
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-rachma-text leading-tight">
            Halo, Saya <br/>
            <span className="text-rachma-primary">{profile?.full_name || 'Fikriya Rachma'}</span>
          </h1>
          <p className="text-lg font-bold text-rachma-muted">{profile?.role}</p>
          <p className="text-sm md:text-base text-rachma-muted leading-relaxed max-w-lg mx-auto md:mx-0">
            {profile?.hero_desc}
          </p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
            <Link to="/ppg-corner" className="px-6 py-3 bg-rachma-primary hover:bg-rachma-secondary text-white text-sm font-bold rounded-full shadow-md transition-all flex items-center gap-2">
              Lihat PPG Corner <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/about" className="px-6 py-3 bg-white border border-rachma-soft text-rachma-primary hover:bg-rachma-soft/30 text-sm font-bold rounded-full shadow-sm transition-all">
              Tentang Saya
            </Link>
          </div>
        </div>

        {/* Bagian Foto (Kanan) */}
        <div className="relative mx-auto w-64 h-64 md:w-96 md:h-96">
          <div className="absolute inset-0 bg-rachma-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="relative w-full h-full rounded-full border-8 border-white shadow-xl overflow-hidden bg-white">
            <img 
              src={profile?.photo_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"} 
              alt={profile?.full_name} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

      </div>
    </div>
  );
};