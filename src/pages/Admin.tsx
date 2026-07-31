import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen, Plus, Trash2, Loader2, Sparkles, Layers, Paperclip, Link as LinkIcon, Lock, KeyRound, LogOut } from 'lucide-react';

export const Admin: React.FC = () => {
  // === STATE KEAMANAN (LOGIN) ===
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // === STATE ADMIN ===
  const [activeTab, setActiveTab] = useState<'matkul' | 'topik' | 'artefak'>('matkul');
  const [loading, setLoading] = useState<boolean>(false);
  
  const [courses, setCourses] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [artifacts, setArtifacts] = useState<any[]>([]);

  // State Form Matkul
  const [code, setCode] = useState(''); 
  const [title, setTitle] = useState('');
  const [semester, setSemester] = useState('Semester 1');
  const [description, setDescription] = useState('');

  // State Form Topik
  const [selectedCourse, setSelectedCourse] = useState('');
  const [topicTitle, setTopicTitle] = useState('');
  const [conn, setConn] = useState('');
  const [chall, setChall] = useState('');
  const [conc, setConc] = useState('');
  const [chan, setChan] = useState('');

  // State Form Artefak
  const [selectedTopic, setSelectedTopic] = useState('');
  const [artifactTitle, setArtifactTitle] = useState('');
  const [artifactUrl, setArtifactUrl] = useState('');

  // Cek apakah sudah pernah login sebelumnya di perangkat ini
  useEffect(() => {
    const isLogged = localStorage.getItem('rachma_admin_auth');
    if (isLogged === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCourses();
      fetchTopics();
      if (activeTab === 'artefak') fetchArtifacts();
    }
  }, [activeTab, isAuthenticated]);

  // === FUNGSI LOGIN & LOGOUT ===
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Ganti 'fikriya2024' dengan password yang diinginkan
    if (passwordInput === 'fikriya86') {
      setIsAuthenticated(true);
      setLoginError(false);
      localStorage.setItem('rachma_admin_auth', 'true');
    } else {
      setLoginError(true);
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('rachma_admin_auth');
  };

  // === FUNGSI CRUD SUPABASE ===
  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (data) setCourses(data);
  };

  const fetchTopics = async () => {
    const { data } = await supabase.from('topics').select('*, courses(title)').order('created_at', { ascending: false });
    if (data) setTopics(data);
  };

  const fetchArtifacts = async () => {
    const { data } = await supabase.from('artifacts').select('*, topics(title, courses(title))').order('created_at', { ascending: false });
    if (data) setArtifacts(data);
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return alert("Kode (angka) dan Judul wajib diisi!");
    const finalCode = `PPG-${code}`;
    setLoading(true);
    await supabase.from('courses').insert([{ code: finalCode, title, semester, description }]);
    setCode(''); setTitle(''); setSemester('Semester 1'); setDescription('');
    fetchCourses(); setLoading(false); alert("Matkul berhasil ditambahkan!");
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !topicTitle) return alert("Pilih Matkul dan isi Judul Topik!");
    const reflectionData = JSON.stringify({ connection: conn, challenge: chall, concept: conc, change: chan });
    setLoading(true);
    await supabase.from('topics').insert([{ course_id: selectedCourse, title: topicTitle, reflection_4c: reflectionData }]);
    setTopicTitle(''); setConn(''); setChall(''); setConc(''); setChan('');
    fetchTopics(); setLoading(false); alert("Topik & 4C berhasil ditambahkan!");
  };

  const handleAddArtifact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic || !artifactTitle || !artifactUrl) return alert("Pilih Topik, isi Judul, dan URL File!");
    setLoading(true);
    await supabase.from('artifacts').insert([{ topic_id: selectedTopic, title: artifactTitle, file_url: artifactUrl }]);
    setArtifactTitle(''); setArtifactUrl('');
    fetchArtifacts(); setLoading(false); alert("Artefak berhasil ditambahkan!");
  };

  const handleDelete = async (table: string, id: string, refreshFn: () => void) => {
    if (!window.confirm(`Yakin ingin menghapus data ini dari ${table}?`)) return;
    await supabase.from(table).delete().eq('id', id);
    refreshFn();
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, ''); 
    setCode(numericValue);
  };

  // === TAMPILAN LOGIN (JIKA BELUM AUTENTIKASI) ===
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-rachma-bg flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-rachma-soft/60 max-w-sm w-full text-center space-y-6">
          <div className="w-16 h-16 bg-rachma-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-rachma-primary">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-rachma-text">Admin Area</h1>
            <p className="text-xs text-rachma-muted mt-1">Masukkan kata sandi untuk mengelola data portofolio Fikriya.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <KeyRound className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-rachma-muted" />
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Kata Sandi" 
                className="w-full text-sm pl-11 pr-4 py-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary transition-colors"
                autoFocus
              />
            </div>
            {loginError && <p className="text-xs text-red-500 font-medium text-left">Kata sandi salah, silakan coba lagi.</p>}
            <button type="submit" className="w-full py-3 bg-rachma-primary hover:bg-rachma-secondary text-white text-sm font-bold rounded-xl shadow-md transition-all">
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  // === TAMPILAN ADMIN (JIKA SUDAH LOGIN) ===
  return (
    <div className="min-h-screen bg-rachma-bg py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header dengan Tombol Logout */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rachma-primary/10 text-rachma-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Panel Admin Terverifikasi
            </div>
            <h1 className="text-3xl font-extrabold text-rachma-text">Kelola <span className="text-rachma-primary">Data</span></h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-rachma-soft text-rachma-primary hover:bg-rachma-soft/30 rounded-full text-sm font-bold shadow-sm transition-all w-fit"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-3 border-b border-rachma-soft/60 pb-4">
          <button onClick={() => setActiveTab('matkul')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'matkul' ? 'bg-rachma-primary text-white shadow-md' : 'bg-white text-rachma-text hover:bg-rachma-soft/50 border border-rachma-soft'}`}>
            <BookOpen className="w-4 h-4" /> Mata Kuliah
          </button>
          <button onClick={() => setActiveTab('topik')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'topik' ? 'bg-rachma-primary text-white shadow-md' : 'bg-white text-rachma-text hover:bg-rachma-soft/50 border border-rachma-soft'}`}>
            <Layers className="w-4 h-4" /> Topik & Refleksi
          </button>
          <button onClick={() => setActiveTab('artefak')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'artefak' ? 'bg-rachma-primary text-white shadow-md' : 'bg-white text-rachma-text hover:bg-rachma-soft/50 border border-rachma-soft'}`}>
            <Paperclip className="w-4 h-4" /> Artefak Pembelajaran
          </button>
        </div>

        {/* =============== TAB MATKUL =============== */}
        {activeTab === 'matkul' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-rachma-soft/60 h-fit">
              <h2 className="text-lg font-bold text-rachma-text flex items-center gap-2 mb-4"><Plus className="w-5 h-5 text-rachma-primary" /> Tambah Matkul</h2>
              <form onSubmit={handleAddCourse} className="space-y-4">
                
                <div className="flex items-center border border-rachma-soft rounded-xl bg-rachma-bg/30 focus-within:border-rachma-primary overflow-hidden transition-colors">
                  <span className="px-4 py-3 bg-rachma-primary/10 text-rachma-primary font-bold text-sm border-r border-rachma-soft/50 select-none">
                    PPG-
                  </span>
                  <input 
                    type="text" 
                    value={code} 
                    onChange={handleCodeChange} 
                    placeholder="Contoh: 01, 100, 2024"
                    className="w-full text-sm p-3 bg-transparent outline-none" 
                  />
                </div>

                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul Matkul" className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary" />
                <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary">
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                </select>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi Singkat" rows={3} className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary resize-none" />
                <button type="submit" disabled={loading} className="w-full py-3 bg-rachma-primary hover:bg-rachma-secondary text-white text-sm font-bold rounded-xl shadow-md">{loading ? 'Menyimpan...' : 'Simpan'}</button>
              </form>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-rachma-soft/60">
              <h2 className="text-lg font-bold text-rachma-text flex items-center gap-2 mb-4"><BookOpen className="w-5 h-5 text-rachma-primary" /> Daftar Mata Kuliah</h2>
              <div className="space-y-3">
                {courses.map(c => (
                  <div key={c.id} className="flex justify-between items-center p-4 bg-rachma-bg/40 border border-rachma-soft/50 rounded-2xl hover:border-rachma-primary/50 transition-colors">
                    <div>
                      <span className="text-[10px] bg-rachma-primary text-white px-2 py-0.5 rounded-full mr-2">{c.code}</span>
                      <h3 className="font-bold text-sm inline-block">{c.title}</h3>
                    </div>
                    <button onClick={() => handleDelete('courses', c.id, fetchCourses)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =============== TAB TOPIK =============== */}
        {activeTab === 'topik' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-rachma-soft/60 h-fit">
              <h2 className="text-lg font-bold text-rachma-text flex items-center gap-2 mb-4"><Plus className="w-5 h-5 text-rachma-primary" /> Tambah Topik & 4C</h2>
              <form onSubmit={handleAddTopic} className="space-y-4">
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary">
                  <option value="">-- Pilih Matkul --</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <input type="text" value={topicTitle} onChange={(e) => setTopicTitle(e.target.value)} placeholder="Judul (Cth: Topik 1)" className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary" />
                
                <div className="pt-2 border-t border-rachma-soft/50 space-y-2">
                  <span className="text-xs font-bold text-rachma-primary">Jurnal Refleksi 4C</span>
                  <textarea value={conn} onChange={(e) => setConn(e.target.value)} placeholder="1. Connection..." rows={2} className="w-full text-xs p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30" />
                  <textarea value={chall} onChange={(e) => setChall(e.target.value)} placeholder="2. Challenge..." rows={2} className="w-full text-xs p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30" />
                  <textarea value={conc} onChange={(e) => setConc(e.target.value)} placeholder="3. Concept..." rows={2} className="w-full text-xs p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30" />
                  <textarea value={chan} onChange={(e) => setChan(e.target.value)} placeholder="4. Change..." rows={2} className="w-full text-xs p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-rachma-primary hover:bg-rachma-secondary text-white text-sm font-bold rounded-xl shadow-md">{loading ? 'Menyimpan...' : 'Simpan'}</button>
              </form>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-rachma-soft/60">
              <h2 className="text-lg font-bold text-rachma-text flex items-center gap-2 mb-4"><Layers className="w-5 h-5 text-rachma-primary" /> Daftar Topik</h2>
              <div className="space-y-3">
                {topics.map(t => (
                  <div key={t.id} className="flex justify-between items-center p-4 bg-rachma-bg/40 border border-rachma-soft/50 rounded-2xl hover:border-rachma-primary/50 transition-colors">
                    <div>
                      <p className="text-[10px] text-rachma-primary font-bold">{t.courses?.title}</p>
                      <h3 className="font-bold text-sm">{t.title}</h3>
                    </div>
                    <button onClick={() => handleDelete('topics', t.id, fetchTopics)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =============== TAB ARTEFAK =============== */}
        {activeTab === 'artefak' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-rachma-soft/60 h-fit">
              <h2 className="text-lg font-bold text-rachma-text flex items-center gap-2 mb-4"><Paperclip className="w-5 h-5 text-rachma-primary" /> Tambah Artefak</h2>
              <form onSubmit={handleAddArtifact} className="space-y-4">
                <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary">
                  <option value="">-- Pilih Topik --</option>
                  {topics.map(t => <option key={t.id} value={t.id}>{t.courses?.title} - {t.title}</option>)}
                </select>
                <input type="text" value={artifactTitle} onChange={(e) => setArtifactTitle(e.target.value)} placeholder="Judul Dokumen (Cth: Modul Ajar)" className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary" />
                <input type="url" value={artifactUrl} onChange={(e) => setArtifactUrl(e.target.value)} placeholder="URL Link (Cth: Link G-Drive)" className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary" />
                <button type="submit" disabled={loading} className="w-full py-3 bg-rachma-primary hover:bg-rachma-secondary text-white text-sm font-bold rounded-xl shadow-md">{loading ? 'Menyimpan...' : 'Simpan'}</button>
              </form>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-rachma-soft/60">
              <h2 className="text-lg font-bold text-rachma-text flex items-center gap-2 mb-4"><LinkIcon className="w-5 h-5 text-rachma-primary" /> Daftar Lampiran Artefak</h2>
              <div className="space-y-3">
                {artifacts.map(a => (
                  <div key={a.id} className="flex justify-between items-center p-4 bg-rachma-bg/40 border border-rachma-soft/50 rounded-2xl hover:border-rachma-primary/50 transition-colors">
                    <div>
                      <p className="text-[10px] text-rachma-primary font-bold">{a.topics?.courses?.title} • {a.topics?.title}</p>
                      <h3 className="font-bold text-sm text-rachma-text flex items-center gap-2"><Paperclip className="w-3.5 h-3.5"/> {a.title}</h3>
                      <a href={a.file_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline mt-1 truncate block max-w-[200px] md:max-w-xs">{a.file_url}</a>
                    </div>
                    <button onClick={() => handleDelete('artifacts', a.id, fetchArtifacts)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};