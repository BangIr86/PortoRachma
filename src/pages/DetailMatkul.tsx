import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, BookOpen, FileText, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';

interface Reflection4C {
  connection?: string;
  challenge?: string;
  concept?: string;
  change?: string;
}

interface Topic {
  id: string;
  title: string;
  reflection_4c?: Reflection4C | string;
  artifacts?: {
    id: string;
    title: string;
    file_url: string;
    type?: string;
  }[];
}

interface CourseDetail {
  id: string;
  title: string;
  code: string;
  description: string;
  topics: Topic[];
}

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
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          topics (
            *,
            artifacts (*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (err) {
      console.error('Error fetching course detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const parseReflection = (ref: any): Reflection4C => {
    if (!ref) return {};
    if (typeof ref === 'string') {
      try {
        return JSON.parse(ref);
      } catch {
        return { connection: ref };
      }
    }
    return ref;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rachma-bg flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-rachma-primary animate-spin" />
        <p className="text-xs text-rachma-muted">Memuat detail mata kuliah...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-rachma-bg py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-rachma-text">Mata Kuliah Tidak Ditemukan</h2>
        <Link to="/ppg-corner" className="inline-block text-xs font-bold text-rachma-primary hover:underline">
          ← Kembali ke PPG Corner
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rachma-bg text-rachma-text py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Tombol Kembali */}
        <Link
          to="/ppg-corner"
          className="inline-flex items-center gap-2 text-xs font-bold text-rachma-muted hover:text-rachma-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke PPG Corner
        </Link>

        {/* Header Mata Kuliah */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-rachma-soft/60 space-y-3">
          <span className="text-[10px] font-bold tracking-wider text-rachma-primary bg-rachma-soft/50 px-3 py-1 rounded-full uppercase">
            {course.code || 'Mata Kuliah PPG'}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-rachma-text">
            {course.title}
          </h1>
          <p className="text-sm text-rachma-muted leading-relaxed">
            {course.description || 'Tidak ada deskripsi ringkas.'}
          </p>
        </div>

        {/* Daftar Topik & Refleksi 4C */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-rachma-text flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rachma-primary" /> Jurnal Refleksi 4C & Artefak
          </h2>

          {course.topics && course.topics.length > 0 ? (
            course.topics.map((topic, idx) => {
              const ref = parseReflection(topic.reflection_4c);

              return (
                <div key={topic.id || idx} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-rachma-soft/60 space-y-6">
                  <h3 className="text-lg font-bold text-rachma-primary pb-3 border-b border-rachma-soft/40">
                    {topic.title || `Topik ${idx + 1}`}
                  </h3>

                  {/* Kerangka 4C */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-rachma-bg/60 p-4 rounded-2xl border border-rachma-soft/30 space-y-1">
                      <span className="text-xs font-bold text-rachma-primary flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 1. Connection (Keterkaitan)
                      </span>
                      <p className="text-xs text-rachma-muted leading-relaxed whitespace-pre-line">
                        {ref.connection || 'Belum diisi.'}
                      </p>
                    </div>

                    <div className="bg-rachma-bg/60 p-4 rounded-2xl border border-rachma-soft/30 space-y-1">
                      <span className="text-xs font-bold text-rachma-primary flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 2. Challenge (Tantangan)
                      </span>
                      <p className="text-xs text-rachma-muted leading-relaxed whitespace-pre-line">
                        {ref.challenge || 'Belum diisi.'}
                      </p>
                    </div>

                    <div className="bg-rachma-bg/60 p-4 rounded-2xl border border-rachma-soft/30 space-y-1">
                      <span className="text-xs font-bold text-rachma-primary flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 3. Concept (Konsep Utama)
                      </span>
                      <p className="text-xs text-rachma-muted leading-relaxed whitespace-pre-line">
                        {ref.concept || 'Belum diisi.'}
                      </p>
                    </div>

                    <div className="bg-rachma-bg/60 p-4 rounded-2xl border border-rachma-soft/30 space-y-1">
                      <span className="text-xs font-bold text-rachma-primary flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 4. Change (Perubahan Diri)
                      </span>
                      <p className="text-xs text-rachma-muted leading-relaxed whitespace-pre-line">
                        {ref.change || 'Belum diisi.'}
                      </p>
                    </div>
                  </div>

                  {/* Lampiran Artefak Pembelajaran */}
                  {topic.artifacts && topic.artifacts.length > 0 && (
                    <div className="pt-4 space-y-3">
                      <h4 className="text-xs font-bold text-rachma-text uppercase tracking-wider">
                        Artefak Pembelajaran Terkait:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {topic.artifacts.map((art) => (
                          <a
                            key={art.id}
                            href={art.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-2xl bg-white border border-rachma-soft hover:border-rachma-primary transition-all group shadow-sm"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <FileText className="w-5 h-5 text-rachma-primary shrink-0" />
                              <span className="text-xs font-semibold text-rachma-text truncate group-hover:text-rachma-primary">
                                {art.title}
                              </span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-rachma-muted group-hover:text-rachma-primary shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center text-rachma-muted text-xs border border-rachma-soft/60">
              Belum ada topik atau jurnal refleksi yang ditambahkan pada mata kuliah ini.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};