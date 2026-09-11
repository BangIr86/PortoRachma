import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ChevronRight, Loader2, Sparkles, FolderOpen } from 'lucide-react';

interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  semester: string;
}

export const PPGCorner: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rachma-bg text-rachma-text py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rachma-soft/50 text-rachma-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Ruang Belajar PPG
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-rachma-text">
            PPG <span className="text-rachma-primary">Corner</span>
          </h1>
          <p className="text-rachma-muted text-sm md:text-base max-w-2xl">
            Dokumentasi lengkap perkuliahan, jurnal refleksi 4C (LK 2), dan artefak pembelajaran selama studi PPG Prajabatan.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 text-rachma-primary animate-spin" />
            <p className="text-xs text-rachma-muted">Memuat data mata kuliah...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-rachma-soft/60 space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-rachma-bg rounded-2xl flex items-center justify-center mx-auto text-rachma-muted">
              <FolderOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-rachma-text">Belum Ada Mata Kuliah</h3>
              <p className="text-xs text-rachma-muted max-w-sm mx-auto">
                Mata kuliah akan muncul di sini setelah ditambahkan melalui Panel Admin.
              </p>
            </div>
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
              className="inline-block px-5 py-2.5 bg-rachma-primary hover:bg-rachma-secondary text-white text-xs font-bold rounded-full transition-colors shadow-sm cursor-pointer"
            >
              Ke Panel Admin →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-3xl p-6 shadow-sm border border-rachma-soft/60 hover:border-rachma-primary/50 hover:shadow-md transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider text-rachma-primary bg-rachma-soft/50 px-3 py-1 rounded-full uppercase">
                      {course.semester || 'Semester 1'}
                    </span>
                    <span className="text-xs font-semibold text-rachma-muted">
                      {course.code}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-rachma-text group-hover:text-rachma-primary transition-colors line-clamp-2">
                      {course.title}
                    </h2>
                    <p className="text-xs text-rachma-muted line-clamp-3 mt-2 leading-relaxed">
                      {course.description || 'Tidak ada deskripsi.'}
                    </p>
                  </div>
                </div>
                <div className="pt-6 border-t border-rachma-soft/30 mt-6">
                  <Link to={`/ppg-corner/${course.id}`} className="flex items-center justify-between text-xs font-bold text-rachma-primary group-hover:gap-2 transition-all">
                    <span>Lihat Refleksi & Artefak</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};