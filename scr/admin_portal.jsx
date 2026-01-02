import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ShieldCheck, LogOut, PlusCircle, LayoutDashboard, Image, Map, DollarSign, Phone, Send } from 'lucide-react';

// --- CONFIGURACIÓN ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'rumbo-casa-portal';

export default function AdminPortal() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    tipo: 'Venta', precio: '', municipio: '', provincia: '', habitaciones: '', 
    banos: '', tamano: '', descripcion: '', agenteNombre: '', agenteContacto: '', fotos: ''
  });

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
    } catch (err) {
      setError('Credenciales no autorizadas.');
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'listings'), {
        ...formData,
        precio: Number(formData.precio),
        habitaciones: Number(formData.habitaciones),
        banos: Number(formData.banos),
        tamano: Number(formData.tamano),
        createdAt: serverTimestamp(),
        userId: user.uid
      });
      alert("¡Publicación exitosa!");
      setFormData({ tipo: 'Venta', precio: '', municipio: '', provincia: '', habitaciones: '', banos: '', tamano: '', descripcion: '', agenteNombre: '', agenteContacto: '', fotos: '' });
    } catch (err) {
      setError('Error al guardar en la base de datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-black italic">VERIFICANDO CREDENCIALES...</div>;

  if (!user || user.isAnonymous) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
          <ShieldCheck className="text-blue-600 mb-6 mx-auto" size={48} />
          <h2 className="text-2xl font-black text-center mb-8 uppercase tracking-tighter">Acceso de Agente</h2>
          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl">{error}</div>}
          <div className="space-y-4">
            <input type="email" placeholder="Email profesional" className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 outline-none font-bold" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} required />
            <input type="password" placeholder="Contraseña" className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 outline-none font-bold" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} required />
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-lg">Entrar al Panel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-8 hidden md:flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <LayoutDashboard className="text-blue-500" />
            <span className="font-black uppercase tracking-tighter text-lg italic">RumboCasa Admin</span>
          </div>
          <nav className="space-y-4">
            <div className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">Menú Principal</div>
            <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-blue-600 font-bold text-sm"><PlusCircle size={18}/> Nuevo Anuncio</button>
          </nav>
        </div>
        <button onClick={() => signOut(auth)} className="flex items-center gap-3 text-slate-400 hover:text-white transition-all font-black text-xs uppercase tracking-widest">
          <LogOut size={18}/> Salir
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-black tracking-tight italic">Publicar Nuevo Inmueble</h1>
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-[10px] font-black uppercase">{user.email}</div>
          </div>

          <form onSubmit={handlePost} className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Descripción del Anuncio</label>
              <textarea className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-blue-600 outline-none font-medium" rows="3" placeholder="Ej: Penthouse con vista al mar..." value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} required />
            </div>
            
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Precio (USD)</label>
              <div className="relative"><DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/><input type="number" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-blue-600 outline-none font-bold" value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} required /></div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Provincia</label>
              <div className="relative"><Map size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/><input type="text" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-blue-600 outline-none font-bold" value={formData.provincia} onChange={e => setFormData({...formData, provincia: e.target.value})} required /></div>
            </div>

            <div className="grid grid-cols-3 gap-4 md:col-span-2">
              <input type="number" placeholder="Habitaciones" className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none font-bold text-center" value={formData.habitaciones} onChange={e => setFormData({...formData, habitaciones: e.target.value})} required />
              <input type="number" placeholder="Baños" className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none font-bold text-center" value={formData.banos} onChange={e => setFormData({...formData, banos: e.target.value})} required />
              <input type="number" placeholder="m² Totales" className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none font-bold text-center" value={formData.tamano} onChange={e => setFormData({...formData, tamano: e.target.value})} required />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">URL de Imagen Principal</label>
              <div className="relative"><Image size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/><input type="url" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none font-bold" value={formData.fotos} onChange={e => setFormData({...formData, fotos: e.target.value})} required /></div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
              <input type="text" placeholder="Tu Nombre de Agente" className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none font-bold" value={formData.agenteNombre} onChange={e => setFormData({...formData, agenteNombre: e.target.value})} required />
              <div className="relative"><Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/><input type="text" placeholder="WhatsApp / Teléfono" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none font-bold" value={formData.agenteContacto} onChange={e => setFormData({...formData, agenteContacto: e.target.value})} required /></div>
            </div>

            <button type="submit" disabled={isSubmitting} className="md:col-span-2 bg-blue-600 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
              {isSubmitting ? "Sincronizando..." : <><Send size={18}/> Publicar en RumboCasa</>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}