import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, BookOpen, FileText, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  reflection_4c?: any;
  artifacts?: any[];
}

interface CourseDetail {
  id: string;
  title: string;
  code: string;
  description: string;
  topics: Topic[];
}

// === FUNGSI CERDAS UNTUK AUTO-EMBED ===
const getEmbedUrl = (url: string) => {
  if (!url) return '';
  const lowerUrl = url.toLowerCase();
  
  // 1. Format YouTube
  if (lowerUrl.includes('youtube.com/watch?v=')) {
    return url.replace('watch?v=', 'embed/');
  }
  if (lowerUrl.includes('youtu.be/')) {
    return url.replace('youtu.be/', 'youtube.com/embed/');
  }
  
  // 2. Format Google Drive
  if (lowerUrl.includes('drive.google.com') && lowerUrl.includes('/view')) {
    return url.replace('/view', '/preview');
  }

  // 3. Format Word/PowerPoint (Meminjam Google Docs Viewer)
  if (lowerUrl.endsWith('.docx') || lowerUrl.endsWith('.doc') || lowerUrl.endsWith('.pptx') || lowerUrl.endsWith('.ppt') || lowerUrl.endsWith('.xlsx')) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  }

  // 4. Default (PDF/Gambar dari Supabase akan langsung terbaca oleh iframe browser)
  return url;
};

export const DetailMatkul: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) fetchCourseDetail();
  }, [id]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      // Mengambil data Matkul, Topik, dan Artefak sekaligus
      const { data, error } = await supabase
        .from('courses')
        .select(`*, topics (*, artifacts (*))`)
        .eq('id', id)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (err) {
      console.error('Error fetching detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const parseReflection = (ref: any) => {
    if (!ref) return {};
    if (typeof ref === 'string') {
      try { return JSON.parse(ref); } catch { return { connection: ref }; }
    }
    return ref;
  };

  if (loading) return (
    <div className="min-h-screen bg-rachma-bg flex flex-col items-center justify-center space-y-3">
      <Loader2 className="w-8 h-8 text-rachma-primary animate-spin" />
      <p className="text-xs text-rachma-muted">Memuat detail mata kuliah...</p>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen bg-rachma-bg py-16 text-center space-y-4">
      <h2 className="text-xl font-bold text-rachma-text">Mata Kuliah Tidak Ditemukan</h2>
      <Link to="/ppg-corner" className="text-xs font-bold text-rachma-primary hover:underline">← Kembali</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-rachma-bg text-rachma-text py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <Link to="/ppg-corner" className="inline-flex items-center gap-2 text-xs font-bold text-rachma-muted hover:text-rachma-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke PPG Corner
        </Link>

        {/* HEADER MATKUL */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-rachma-soft/60 space-y-3">
          <span className="text-[10px] font-bold tracking-wider text-rachma-primary bg-rachma-soft/50 px-3 py-1 rounded-full uppercase">
            {course.code || 'Mata Kuliah'}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-rachma-text">{course.title}</h1>
          <p className="text-sm text-rachma-muted leading-relaxed">{course.description}</p>
        </div>

        <div className="space-y-8">
          <h2 className="text-xl font-bold text-rachma-text flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rachma-primary" /> Jurnal Refleksi 4C & Artefak
          </h2>

          {course.topics && course.topics.length > 0 ? (
            course.topics.map((topic, idx) => {
              const ref = parseReflection(topic.reflection_4c);
              return (
                <div key={topic.id || idx} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-rachma-soft/60 space-y-8">
                  
                  {/* Judul Topik */}
                  <h3 className="text-lg font-bold text-rachma-primary pb-3 border-b border-rachma-soft/40">
                    {topic.title}
                  </h3>

                  {/* Refleksi 4C */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-rachma-bg/60 p-4 rounded-2xl border border-rachma-soft/30 space-y-1">
                      <span className="text-xs font-bold text-rachma-primary flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> 1. Connection</span>
                      <p className="text-xs text-rachma-muted whitespace-pre-line leading-relaxed">{ref.connection || '-'}</p>
                    </div>
                    <div className="bg-rachma-bg/60 p-4 rounded-2xl border border-rachma-soft/30 space-y-1">
                      <span className="text-xs font-bold text-rachma-primary flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> 2. Challenge</span>
                      <p className="text-xs text-rachma-muted whitespace-pre-line leading-relaxed">{ref.challenge || '-'}</p>
                    </div>
                    <div className="bg-rachma-bg/60 p-4 rounded-2xl border border-rachma-soft/30 space-y-1">
                      <span className="text-xs font-bold text-rachma-primary flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> 3. Concept</span>
                      <p className="text-xs text-rachma-muted whitespace-pre-line leading-relaxed">{ref.concept || '-'}</p>
                    </div>
                    <div className="bg-rachma-bg/60 p-4 rounded-2xl border border-rachma-soft/30 space-y-1">
                      <span className="text-xs font-bold text-rachma-primary flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> 4. Change</span>
                      <p className="text-xs text-rachma-muted whitespace-pre-line leading-relaxed">{ref.change || '-'}</p>
                    </div>
                  </div>

                  {/* Tampilan EMBED Artefak */}
                  {topic.artifacts && topic.artifacts.length > 0 && (
                    <div className="pt-2 space-y-4">
                      <h4 className="text-sm font-bold text-rachma-text flex items-center gap-2">
                        <FileText className="w-4 h-4 text-rachma-primary" /> Dokumen Artefak Terlampir
                      </h4>
                      
                      <div className="grid grid-cols-1 gap-6">
                        {topic.artifacts.map((art: any) => (
                          <div key={art.id} className="border border-rachma-soft rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col">
                            
                            {/* Header Kotak Embed */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-rachma-bg/40 border-b border-rachma-soft gap-3">
                              <span className="text-sm font-bold text-rachma-text line-clamp-1">{art.title}</span>
                              <a href={art.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rachma-soft text-rachma-primary hover:bg-rachma-soft/30 rounded-lg text-xs font-bold transition-colors w-fit">
                                Buka di Tab Baru <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>

                            {/* Kotak Embed (Iframe) */}
                            <div className="w-full h-[400px] md:h-[600px] bg-gray-50 relative">
                              <iframe
                                src={getEmbedUrl(art.file_url)}
                                title={art.title}
                                className="w-full h-full border-0 absolute top-0 left-0"
                                allowFullScreen
                                loading="lazy"
                              ></iframe>
                            </div>

                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center space-y-2 border border-rachma-soft/60">
              <p className="text-sm font-bold text-rachma-text">Belum Ada Topik</p>
              <p className="text-xs text-rachma-muted">Belum ada topik atau refleksi yang ditambahkan pada mata kuliah ini.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};