import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Award, ArrowRight, Sparkles, Clock, Heart } from 'lucide-react';

export const Home: React.FC = () => {
  // Ganti URL ini dengan link foto profil Fikriya Rachma asli
  const profilePhoto = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-rachma-bg text-rachma-text pb-16 pt-6 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Banner Hero dengan Foto Profil */}
        <section className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-rachma-soft/60 flex flex-col md:flex-row items-center gap-8 justify-between">
          
          {/* Teks Sapaan */}
          <div className="space-y-4 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rachma-soft/50 text-rachma-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Welcome to Portfolio
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-rachma-text leading-tight">
              Halo, Saya <br className="hidden md:inline" />
              <span className="text-rachma-primary">Fikriya Rachma</span> 👋
            </h1>
            <p className="text-rachma-muted text-sm md:text-base leading-relaxed">
              Calon Guru Profesional | PPG Prajabatan Gelombang 1 2024. Dedikasi untuk menciptakan pembelajaran yang inklusif, kreatif, dan menginspirasi.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <Link 
                to="/ppg-corner" 
                className="px-6 py-2.5 rounded-full bg-rachma-primary hover:bg-rachma-secondary text-white text-xs font-bold shadow-md transition-all duration-200 hover:shadow-lg inline-flex items-center gap-2"
              >
                Lihat PPG Corner <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/about" 
                className="px-6 py-2.5 rounded-full bg-rachma-soft/40 hover:bg-rachma-soft/70 text-rachma-primary text-xs font-bold transition-all"
              >
                Tentang Saya
              </Link>
            </div>
          </div>

          {/* Frame Foto Profil */}
          <div className="relative shrink-0">
            {/* Hiasan Ring Crimson */}
            <div className="w-48 h-48 md:w-60 md:h-60 rounded-3xl overflow-hidden border-4 border-rachma-primary/20 p-1 bg-white shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <img 
                src={profilePhoto} 
                alt="Fikriya Rachma" 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            {/* Badge Floating */}
            <div className="absolute -bottom-3 -left-3 bg-white px-3.5 py-1.5 rounded-full shadow-md border border-rachma-soft/60 flex items-center gap-2 text-xs font-bold text-rachma-primary">
              <Heart className="w-3.5 h-3.5 fill-rachma-primary" /> Calon Guru
            </div>
          </div>

        </section>

        {/* Welcome Highlight Card */}
        <div className="bg-gradient-to-r from-rachma-primary to-rachma-secondary rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold">Selamat Datang di Portofolio Digital</h2>
            <p className="text-white/90 text-sm md:text-base leading-relaxed">
              Wadah dokumentasi perjalanan, refleksi pengalaman belajar, dan rekam jejak artefak pembelajaran selama menempuh Pendidikan Profesi Guru (PPG).
            </p>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-rachma-soft/40 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-rachma-bg rounded-2xl text-rachma-primary"><Award className="w-8 h-8" /></div>
            <div>
              <p className="text-2xl font-bold text-rachma-text">12+</p>
              <p className="text-xs text-rachma-muted font-medium">Artefak Pembelajaran</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-rachma-soft/40 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-rachma-bg rounded-2xl text-rachma-primary"><FileText className="w-8 h-8" /></div>
            <div>
              <p className="text-2xl font-bold text-rachma-text">8 Matkul</p>
              <p className="text-xs text-rachma-muted font-medium">Refleksi Jurnal 4C</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-rachma-soft/40 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-rachma-bg rounded-2xl text-rachma-primary"><Clock className="w-8 h-8" /></div>
            <div>
              <p className="text-2xl font-bold text-rachma-text">360+ Jam</p>
              <p className="text-xs text-rachma-muted font-medium">Praktik Lapangan (PPL)</p>
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-rachma-soft/40 flex flex-col justify-between space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rachma-soft/40 text-rachma-primary flex items-center justify-center mb-4"><BookOpen className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-rachma-text mb-2">PPG Corner</h3>
              <p className="text-rachma-muted text-sm leading-relaxed">Jelajahi kumpulan mata kuliah, modul ajar, asesmen, dan artefak pembelajaran yang telah dispesifikasikan selama masa studi PPG Prajabatan.</p>
            </div>
            <Link to="/ppg-corner" className="inline-flex items-center gap-2 text-rachma-primary font-bold text-sm hover:gap-3 transition-all">Jelajahi Mata Kuliah <ArrowRight className="w-4 h-4" /></Link>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-rachma-soft/40 flex flex-col justify-between space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rachma-soft/40 text-rachma-primary flex items-center justify-center mb-4"><FileText className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-rachma-text mb-2">Jurnal Refleksi</h3>
              <p className="text-rachma-muted text-sm leading-relaxed">Ulasan kritis berbasis kerangka 4C (Connection, Challenge, Concept, Change).</p>
            </div>
            <Link to="/about" className="inline-flex items-center gap-2 text-rachma-primary font-bold text-sm hover:gap-3 transition-all">Lihat Profil <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>

      </div>
    </div>
  );
};