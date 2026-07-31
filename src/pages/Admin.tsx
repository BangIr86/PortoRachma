import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen, Plus, Trash2, Sparkles, Layers, Paperclip, Link as LinkIcon, Lock, KeyRound, LogOut, Pencil, User, UploadCloud } from 'lucide-react';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // === TABS ===
  const [activeTab, setActiveTab] = useState<'matkul' | 'topik' | 'artefak' | 'profil'>('matkul');
  const [loading, setLoading] = useState<boolean>(false);
  
  const [courses, setCourses] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [artifacts, setArtifacts] = useState<any[]>([]);

  // === STATE PROFIL ===
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [heroDesc, setHeroDesc] = useState('');
  const [aboutDesc, setAboutDesc] = useState('');
  const [philosophy, setPhilosophy] = useState('');
  const [photoUrl, setPhotoUrl] = useState(''); // URL foto saat ini
  const [photoFile, setPhotoFile] = useState<File | null>(null); // File yang baru dipilih
  const [photoPreview, setPhotoPreview] = useState<string>(''); // Pratinjau foto

  // === STATE MATKUL ===
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [code, setCode] = useState(''); 
  const [title, setTitle] = useState('');
  const [semester, setSemester] = useState('Semester 1');
  const [description, setDescription] = useState('');

  // === STATE TOPIK ===
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [topicTitle, setTopicTitle] = useState('');
  const [conn, setConn] = useState('');
  const [chall, setChall] = useState('');
  const [conc, setConc] = useState('');
  const [chan, setChan] = useState('');

  // === STATE ARTEFAK ===
  const [editingArtifactId, setEditingArtifactId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [artifactTitle, setArtifactTitle] = useState('');
  const [artifactUrl, setArtifactUrl] = useState('');

  useEffect(() => {
    const isLogged = localStorage.getItem('rachma_admin_auth');
    if (isLogged === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCourses();
      fetchTopics();
      if (activeTab === 'artefak') fetchArtifacts();
      if (activeTab === 'profil') fetchProfile();
    }
  }, [activeTab, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'fikriya86') {
      setIsAuthenticated(true); setLoginError(false);
      localStorage.setItem('rachma_admin_auth', 'true');
    } else {
      setLoginError(true); setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('rachma_admin_auth');
  };

  // === FETCH DATA ===
  const fetchProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', 1).single();
    if (data) {
      setProfile(data);
      setFullName(data.full_name); setRole(data.role); setHeroDesc(data.hero_desc);
      setAboutDesc(data.about_desc); setPhilosophy(data.philosophy); 
      setPhotoUrl(data.photo_url);
      setPhotoPreview(data.photo_url); // Set pratinjau awal dari database
    }
  };

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

  // === HANDLER PROFIL ===
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file)); // Memunculkan pratinjau langsung
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalPhotoUrl = photoUrl; // Default: gunakan URL lama

    // Jika ada file foto baru yang diupload
    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `profil-${Date.now()}.${fileExt}`;
      
      // Upload ke Supabase Storage (Bucket: 'portofolio')
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portofolio')
        .upload(fileName, photoFile);

      if (uploadError) {
        alert("Gagal mengunggah foto: " + uploadError.message);
        setLoading(false);
        return;
      }

      // Ambil URL Publik dari foto yang baru diunggah
      const { data: publicUrlData } = supabase.storage
        .from('portofolio')
        .getPublicUrl(fileName);

      finalPhotoUrl = publicUrlData.publicUrl;
    }

    // Simpan data ke database
    await supabase.from('profiles').update({
      full_name: fullName, 
      role, 
      hero_desc: heroDesc, 
      about_desc: aboutDesc, 
      philosophy, 
      photo_url: finalPhotoUrl
    }).eq('id', 1);

    setPhotoUrl(finalPhotoUrl);
    setPhotoFile(null); // Reset state file
    fetchProfile(); 
    setLoading(false); 
    alert("Profil berhasil diperbarui!");
  };

  // === HANDLER MATKUL ===
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return alert("Kode dan Judul wajib diisi!");
    const finalCode = `PPG-${code}`;
    setLoading(true);
    if (editingCourseId) {
      await supabase.from('courses').update({ code: finalCode, title, semester, description }).eq('id', editingCourseId);
      alert("Matkul diperbarui!");
    } else {
      await supabase.from('courses').insert([{ code: finalCode, title, semester, description }]);
      alert("Matkul ditambahkan!");
    }
    resetCourseForm(); fetchCourses(); setLoading(false);
  };
  const editCourse = (c: any) => {
    setEditingCourseId(c.id); setCode(c.code.replace('PPG-', '')); setTitle(c.title); setSemester(c.semester); setDescription(c.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const resetCourseForm = () => { setEditingCourseId(null); setCode(''); setTitle(''); setSemester('Semester 1'); setDescription(''); };

  // === HANDLER TOPIK ===
  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !topicTitle) return alert("Pilih Matkul dan isi Judul Topik!");
    const reflectionData = JSON.stringify({ connection: conn, challenge: chall, concept: conc, change: chan });
    setLoading(true);
    if (editingTopicId) {
      await supabase.from('topics').update({ course_id: selectedCourse, title: topicTitle, reflection_4c: reflectionData }).eq('id', editingTopicId);
      alert("Topik diperbarui!");
    } else {
      await supabase.from('topics').insert([{ course_id: selectedCourse, title: topicTitle, reflection_4c: reflectionData }]);
      alert("Topik ditambahkan!");
    }
    resetTopicForm(); fetchTopics(); setLoading(false);
  };
  const editTopic = (t: any) => {
    setEditingTopicId(t.id); setSelectedCourse(t.course_id); setTopicTitle(t.title);
    try {
      const ref = JSON.parse(t.reflection_4c || '{}');
      setConn(ref.connection || ''); setChall(ref.challenge || ''); setConc(ref.concept || ''); setChan(ref.change || '');
    } catch { setConn(''); setChall(''); setConc(''); setChan(''); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const resetTopicForm = () => { setEditingTopicId(null); setSelectedCourse(''); setTopicTitle(''); setConn(''); setChall(''); setConc(''); setChan(''); };

  // === HANDLER ARTEFAK ===
  const handleSaveArtifact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic || !artifactTitle || !artifactUrl) return alert("Pilih Topik, isi Judul, dan URL File!");
    setLoading(true);
    if (editingArtifactId) {
      await supabase.from('artifacts').update({ topic_id: selectedTopic, title: artifactTitle, file_url: artifactUrl }).eq('id', editingArtifactId);
      alert("Artefak diperbarui!");
    } else {
      await supabase.from('artifacts').insert([{ topic_id: selectedTopic, title: artifactTitle, file_url: artifactUrl }]);
      alert("Artefak ditambahkan!");
    }
    resetArtifactForm(); fetchArtifacts(); setLoading(false);
  };
  const editArtifact = (a: any) => {
    setEditingArtifactId(a.id); setSelectedTopic(a.topic_id); setArtifactTitle(a.title); setArtifactUrl(a.file_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const resetArtifactForm = () => { setEditingArtifactId(null); setSelectedTopic(''); setArtifactTitle(''); setArtifactUrl(''); };

  // Hapus Data
  const handleDelete = async (table: string, id: string, refreshFn: () => void) => {
    if (!window.confirm(`Yakin ingin menghapus data ini dari ${table}?`)) return;
    await supabase.from(table).delete().eq('id', id);
    refreshFn();
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.replace(/[^0-9]/g, '')); 
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-rachma-bg flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-rachma-soft/60 max-w-sm w-full text-center space-y-6">
          <div className="w-16 h-16 bg-rachma-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-rachma-primary"><Lock className="w-8 h-8" /></div>
          <div><h1 className="text-2xl font-extrabold text-rachma-text">Admin Area</h1><p className="text-xs text-rachma-muted mt-1">Masukkan kata sandi untuk masuk.</p></div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <KeyRound className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-rachma-muted" />
              <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Kata Sandi" className="w-full text-sm pl-11 pr-4 py-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary" autoFocus />
            </div>
            {loginError && <p className="text-xs text-red-500 font-medium text-left">Kata sandi salah!</p>}
            <button type="submit" className="w-full py-3 bg-rachma-primary hover:bg-rachma-secondary text-white text-sm font-bold rounded-xl shadow-md">Masuk</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rachma-bg py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rachma-primary/10 text-rachma-primary text-xs font-semibold"><Sparkles className="w-3.5 h-3.5" /> Panel Admin Terverifikasi</div>
            <h1 className="text-3xl font-extrabold text-rachma-text">Kelola <span className="text-rachma-primary">Data</span></h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-rachma-soft text-rachma-primary hover:bg-rachma-soft/30 rounded-full text-sm font-bold shadow-sm transition-all w-fit">
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap items-center gap-3 border-b border-rachma-soft/60 pb-4">
          <button onClick={() => { setActiveTab('profil'); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'profil' ? 'bg-rachma-primary text-white shadow-md' : 'bg-white text-rachma-text hover:bg-rachma-soft/50 border border-rachma-soft'}`}><User className="w-4 h-4" /> Profil Admin</button>
          <button onClick={() => { setActiveTab('matkul'); resetCourseForm(); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'matkul' ? 'bg-rachma-primary text-white shadow-md' : 'bg-white text-rachma-text hover:bg-rachma-soft/50 border border-rachma-soft'}`}><BookOpen className="w-4 h-4" /> Mata Kuliah</button>
          <button onClick={() => { setActiveTab('topik'); resetTopicForm(); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'topik' ? 'bg-rachma-primary text-white shadow-md' : 'bg-white text-rachma-text hover:bg-rachma-soft/50 border border-rachma-soft'}`}><Layers className="w-4 h-4" /> Topik & Refleksi</button>
          <button onClick={() => { setActiveTab('artefak'); resetArtifactForm(); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'artefak' ? 'bg-rachma-primary text-white shadow-md' : 'bg-white text-rachma-text hover:bg-rachma-soft/50 border border-rachma-soft'}`}><Paperclip className="w-4 h-4" /> Artefak</button>
        </div>

        {/* =============== TAB PROFIL (DENGAN UPLOAD FOTO) =============== */}
        {activeTab === 'profil' && (
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-rachma-soft/60 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-rachma-text flex items-center gap-2 mb-6">
              <User className="w-6 h-6 text-rachma-primary" /> Pengaturan Profil Utama
            </h2>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              {/* UPLOAD FOTO SECTION */}
              <div className="flex flex-col md:flex-row items-center gap-6 p-5 bg-rachma-bg/40 rounded-2xl border border-rachma-soft/50">
                <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-full h-full p-4 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 w-full text-center md:text-left space-y-2">
                  <label className="block text-sm font-bold text-rachma-text">Foto Profil</label>
                  <p className="text-xs text-rachma-muted">Format JPG/PNG. Maksimal ukuran yang disarankan 2MB.</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-rachma-soft text-rachma-primary hover:bg-rachma-soft/30 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm">
                    <UploadCloud className="w-4 h-4" /> Pilih Foto Baru
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-rachma-text mb-1">Nama Lengkap</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-rachma-text mb-1">Status / Gelar (Hero)</label>
                  <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-rachma-text mb-1">Deskripsi Singkat (Beranda)</label>
                <textarea value={heroDesc} onChange={(e) => setHeroDesc(e.target.value)} rows={2} className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-rachma-text mb-1">Biografi Lengkap (Tentang Saya)</label>
                <textarea value={aboutDesc} onChange={(e) => setAboutDesc(e.target.value)} rows={4} className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-rachma-text mb-1">Filosofi Mengajar</label>
                <textarea value={philosophy} onChange={(e) => setPhilosophy(e.target.value)} rows={3} className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary resize-none" />
              </div>
              
              <button type="submit" disabled={loading} className="w-full py-3.5 bg-rachma-primary hover:bg-rachma-secondary text-white text-sm font-bold rounded-xl shadow-md mt-2">
                {loading ? 'Menyimpan & Mengunggah...' : 'Simpan Profil'}
              </button>
            </form>
          </div>
        )}

        {/* =============== TAB MATKUL =============== */}
        {activeTab === 'matkul' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-rachma-soft/60 h-fit">
              <h2 className="text-lg font-bold text-rachma-text flex items-center gap-2 mb-4">
                <Plus className="w-5 h-5 text-rachma-primary" /> {editingCourseId ? 'Edit Matkul' : 'Tambah Matkul'}
              </h2>
              <form onSubmit={handleSaveCourse} className="space-y-4">
                <div className="flex items-center border border-rachma-soft rounded-xl bg-rachma-bg/30 focus-within:border-rachma-primary overflow-hidden transition-colors">
                  <span className="px-4 py-3 bg-rachma-primary/10 text-rachma-primary font-bold text-sm border-r border-rachma-soft/50 select-none">PPG-</span>
                  <input type="text" value={code} onChange={handleCodeChange} placeholder="01" className="w-full text-sm p-3 bg-transparent outline-none" />
                </div>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul Matkul" className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary" />
                <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary">
                  <option value="Semester 1">Semester 1</option><option value="Semester 2">Semester 2</option>
                </select>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi Singkat" rows={3} className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary resize-none" />
                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="flex-1 py-3 bg-rachma-primary hover:bg-rachma-secondary text-white text-sm font-bold rounded-xl shadow-md">{loading ? 'Menyimpan...' : (editingCourseId ? 'Simpan Perubahan' : 'Simpan')}</button>
                  {editingCourseId && <button type="button" onClick={resetCourseForm} className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl">Batal</button>}
                </div>
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
                    <div className="flex items-center gap-1">
                      <button onClick={() => editCourse(c)} className="text-blue-500 p-2 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4"/></button>
                      <button onClick={() => handleDelete('courses', c.id, fetchCourses)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                    </div>
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
              <h2 className="text-lg font-bold text-rachma-text flex items-center gap-2 mb-4"><Plus className="w-5 h-5 text-rachma-primary" /> {editingTopicId ? 'Edit Topik' : 'Tambah Topik'}</h2>
              <form onSubmit={handleSaveTopic} className="space-y-4">
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
                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="flex-1 py-3 bg-rachma-primary hover:bg-rachma-secondary text-white text-sm font-bold rounded-xl shadow-md">{loading ? 'Menyimpan...' : (editingTopicId ? 'Simpan Perubahan' : 'Simpan')}</button>
                  {editingTopicId && <button type="button" onClick={resetTopicForm} className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl">Batal</button>}
                </div>
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
                    <div className="flex items-center gap-1">
                      <button onClick={() => editTopic(t)} className="text-blue-500 p-2 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4"/></button>
                      <button onClick={() => handleDelete('topics', t.id, fetchTopics)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                    </div>
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
              <h2 className="text-lg font-bold text-rachma-text flex items-center gap-2 mb-4"><Paperclip className="w-5 h-5 text-rachma-primary" /> {editingArtifactId ? 'Edit Artefak' : 'Tambah Artefak'}</h2>
              <form onSubmit={handleSaveArtifact} className="space-y-4">
                <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary">
                  <option value="">-- Pilih Topik --</option>
                  {topics.map(t => <option key={t.id} value={t.id}>{t.courses?.title} - {t.title}</option>)}
                </select>
                <input type="text" value={artifactTitle} onChange={(e) => setArtifactTitle(e.target.value)} placeholder="Judul Dokumen" className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary" />
                <input type="url" value={artifactUrl} onChange={(e) => setArtifactUrl(e.target.value)} placeholder="URL Link (Cth: G-Drive)" className="w-full text-sm p-3 border border-rachma-soft rounded-xl bg-rachma-bg/30 outline-none focus:border-rachma-primary" />
                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="flex-1 py-3 bg-rachma-primary hover:bg-rachma-secondary text-white text-sm font-bold rounded-xl shadow-md">{loading ? 'Menyimpan...' : (editingArtifactId ? 'Simpan Perubahan' : 'Simpan')}</button>
                  {editingArtifactId && <button type="button" onClick={resetArtifactForm} className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl">Batal</button>}
                </div>
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
                    <div className="flex items-center gap-1">
                      <button onClick={() => editArtifact(a)} className="text-blue-500 p-2 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4"/></button>
                      <button onClick={() => handleDelete('artifacts', a.id, fetchArtifacts)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                    </div>
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