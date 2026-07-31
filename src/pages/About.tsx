import React from 'react';
import { GraduationCap, Heart, Sparkles, User } from 'lucide-react';

export const About: React.FC = () => {
  const profilePhoto = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop";

  const educationHistory = [
    {
      year: '2024 - Sekarang',
      title: 'Pendidikan Profesi Guru (PPG) Prajabatan',
      institution: 'Universitas Negeri Surabaya (UNESA)',
      description: 'Mengikuti program sertifikasi pendidik profesional Gelombang 1 2024.'
    },
    {
      year: '2019 - 2023',
      title: 'S1 Pendidikan',
      institution: 'Universitas Negeri Surabaya (UNESA)',
      description: 'Lulus dengan predikat Sangat Memuaskan & aktif dalam kegiatan pengembangan media pembelajaran.'
    }
  ];

  return (
    <div className="min-h-screen bg-rachma-bg text-rachma-text py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rachma-soft/50 text-rachma-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Tentang Saya
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-rachma-text">
            Mengenal Lebih Dekat <span className="text-rachma-primary">Fikriya Rachma</span>
          </h1>
          <p className="text-rachma-muted text-sm md:text-base max-w-xl mx-auto">
            Calon pendidik yang berdedikasi menciptakan suasana belajar yang inklusif, interaktif, dan berorientasi pada peserta didik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-rachma-soft/60 flex flex-col items-center text-center space-y-4">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-rachma-primary/20 shadow-md p-1 bg-white">
              <img src={profilePhoto} alt="Fikriya Rachma" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-rachma-text">Fikriya Rachma</h2>
              <p className="text-xs text-rachma-primary font-bold">PPG Prajabatan GEL 1 2024</p>
              <p className="text-xs text-rachma-muted mt-1">Calon Guru Profesional</p>
            </div>
          </div>
          <div className="md:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-rachma-soft/60 space-y-4 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-rachma-text flex items-center gap-2">
              <Heart className="w-5 h-5 text-rachma-primary" /> Filosofi Mengajar
            </h3>
            <p className="text-rachma-muted text-sm leading-relaxed italic">
              "Pendidikan bukan sekadar mentransfer ilmu pengetahuan, melainkan menuntun kodrat anak agar mereka dapat mencapai keselamatan dan kebahagiaan setinggi-tingginya. Saya percaya bahwa setiap siswa unik dan memiliki potensi unggulnya masing-masing."
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-rachma-soft/60 space-y-3">
          <h3 className="text-lg font-bold text-rachma-text flex items-center gap-2">
            <User className="w-5 h-5 text-rachma-primary" /> Biografi Ringkas
          </h3>
          <p className="text-rachma-muted text-sm leading-relaxed">
            Saya adalah lulusan S1 Pendidikan yang saat ini sedang menempuh Pendidikan Profesi Guru (PPG) Prajabatan Gelombang 1 Tahun 2024. Selama studi, saya aktif mengembangkan modul ajar inovatif, instrumen asesmen diagnostik, dan media pembelajaran digital interaktif untuk menciptakan ruang belajar yang menyenangkan bagi peserta didik.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-rachma-soft/60 space-y-6">
          <h3 className="text-lg font-bold text-rachma-text flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-rachma-primary" /> Riwayat Pendidikan
          </h3>
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-rachma-soft">
            {educationHistory.map((item, index) => (
              <div key={index} className="relative pl-10 space-y-1">
                <div className="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-rachma-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">✓</div>
                <span className="text-xs font-bold text-rachma-primary bg-rachma-soft/40 px-2.5 py-0.5 rounded-full inline-block">{item.year}</span>
                <h4 className="font-bold text-base text-rachma-text">{item.title}</h4>
                <p className="text-xs font-semibold text-rachma-muted">{item.institution}</p>
                <p className="text-xs text-rachma-muted pt-1 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};