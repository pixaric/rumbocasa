import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  serverTimestamp,
  doc,
  addDoc,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  limit
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { 
  getAuth, 
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { 
  Home, PlusCircle, Phone, User, Maximize, BedDouble, Bath, MapPin, X, Search, 
  Lock, Globe, Briefcase, LogOut, Mail, KeyRound, AlertCircle, ShieldCheck, 
  Settings, UserPlus, Trash2, CheckCircle2, Camera, Loader2
} from 'lucide-react';

// --- CONFIGURACIÓN DE FIREBASE ---
// Asegúrate de usar tus credenciales reales aquí para producción
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "rumbocasa-7187f.firebaseapp.com",
  projectId: "rumbocasa-7187f",
  storageBucket: "rumbocasa-7187f.firebasestorage.app",
  messagingSenderId: "614700920624",
  appId: "1:614700920624:web:31f82a7a8721665efb22f5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const appId = 'rumbo-casa-portal';

const ADMIN_EMAIL = "cardosoreinier@gmail.com"; 

const ubicacionesCuba = {
  "La Habana": ["Plaza de la Revolución", "Playa", "Centro Habana", "Habana Vieja", "Regla", "Habana del Este", "Guanabacoa", "San Miguel del Padrón", "Diez de Octubre", "Cerro", "Marianao", "La Lisa", "Boyeros", "Arroyo Naranjo", "Cotorro"],
  "Matanzas": ["Matanzas", "Cárdenas", "Varadero", "Colón"],
  "Artemisa": ["Artemisa", "Mariel", "Bauta"],
  "Pinar del Río": ["Pinar del Río", "Viñales"],
  "Mayabeque": ["San José de las Lajas", "Güines"],
  "Villa Clara": ["Santa Clara", "Sagua la Grande"],
  "Cienfuegos": ["Cienfuegos", "Cruces"],
  "Sancti Spíritus": ["Sancti Spíritus", "Trinidad"],
  "Ciego de Ávila": ["Ciego de Ávila", "Morón"],
  "Camagüey": ["Camagüey", "Nuevitas"],
  "Las Tunas": ["Las Tunas", "Puerto Padre"],
  "Holguín": ["Holguín", "Gibara"],
  "Granma": ["Bayamo", "Manzanillo"],
  "Santiago de Cuba": ["Santiago de Cuba", "Palma Soriano"],
  "Guantánamo": ["Guantánamo", "Baracoa"],
  "Isla de la Juventud": ["Nueva Gerona"]
};

export default function App() {
  const [user, setUser] = useState(null);
  const [agentProfile, setAgentProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [viewMode, setViewMode] = useState('public'); 
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [formData, setFormData] = useState({
    tipo: 'Casa', tamano: '', habitaciones: '', banos: '', descripcion: '', 
    precio: '', fotos: '', provincia: 'La Habana', municipio: 'Playa'
  });

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setViewMode('public');
        setAgentProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const profileDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
        const snap = await getDoc(profileDoc);
        if (snap.exists()) setAgentProfile(snap.data());
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, [user]);

  // Escucha con limite para escalabilidad inicial
  useEffect(() => {
    const listingsCol = collection(db, 'artifacts', appId, 'public', 'data', 'listings');
    const q = query(listingsCol, limit(100)); // Limitar a los últimos 100 para no saturar
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListings(docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    });
    return () => unsubscribe();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    
    setUploading(true);
    try {
      const storageRef = ref(storage, `listings/${user.uid}/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, fotos: url }));
    } catch (err) {
      console.error("Error subiendo imagen:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowAuthModal(false);
    } catch (err) {
      setAuthError('Credenciales incorrectas.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!user || !agentProfile) return;
    try {
      const listingsCol = collection(db, 'artifacts', appId, 'public', 'data', 'listings');
      await addDoc(listingsCol, {
        ...formData,
        precio: Number(formData.precio),
        habitaciones: Number(formData.habitaciones),
        banos: Number(formData.banos),
        tamano: Number(formData.tamano),
        agentId: user.uid,
        agenteNombre: agentProfile.name,
        agenteContacto: agentProfile.phone,
        createdAt: serverTimestamp()
      });
      setShowPostModal(false);
      setFormData({
        tipo: 'Casa', tamano: '', habitaciones: '', banos: '', descripcion: '', 
        precio: '', fotos: '', provincia: 'La Habana', municipio: 'Playa'
      });
    } catch (err) { console.error(err); }
  };

  const displayListings = listings.filter(item => {
    const search = filter.toLowerCase();
    const matches = item.provincia?.toLowerCase().includes(search) || 
                    item.municipio?.toLowerCase().includes(search) ||
                    item.descripcion?.toLowerCase().includes(search);
    return viewMode === 'private' ? (matches && item.agentId === user?.uid) : matches;
  });

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar con diseño premium */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setViewMode('public')}>
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200"><Home size={24}/></div>
          <span className="text-2xl font-black tracking-tighter">Rumbo<span className="text-blue-600">Casa</span></span>
        </div>

        <div className="hidden md:flex bg-slate-100 p-1 rounded-2xl">
          <button onClick={() => setViewMode('public')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'public' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500'}`}>Explorar</button>
          {user && <button onClick={() => setViewMode('private')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'private' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500'}`}>Mis Ventas</button>}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <button onClick={() => setShowPostModal(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-black flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all">
                <PlusCircle size={18}/> <span className="hidden sm:inline">Publicar</span>
              </button>
              <button onClick={() => signOut(auth)} className="p-2 text-slate-400 hover:text-red-500"><LogOut size={22}/></button>
            </div>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-black flex items-center gap-2 shadow-lg">
              <Lock size={16}/> Acceso Agentes
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter italic">Tu próximo rumbo comienza aquí.</h1>
          <div className="relative max-w-2xl mx-auto group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={24}/>
            <input 
              type="text" 
              placeholder="Busca por provincia, municipio o descripción..." 
              className="w-full pl-16 pr-8 py-5 rounded-[2.5rem] border-2 border-slate-100 outline-none focus:border-blue-600 shadow-sm text-lg font-medium transition-all"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayListings.map(item => (
            <div key={item.id} className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col">
              <div className="h-72 bg-slate-200 relative overflow-hidden">
                <img 
                  src={item.fotos || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase text-blue-600 tracking-widest">{item.tipo}</div>
                <div className="absolute bottom-6 right-6 bg-blue-600 text-white px-6 py-2 rounded-2xl font-black text-2xl shadow-xl border border-blue-400">
                  ${item.precio?.toLocaleString()}
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-black uppercase tracking-widest mb-4">
                  <MapPin size={16} className="text-blue-500"/> {item.municipio}, {item.provincia}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-6 line-clamp-2 leading-snug italic">"{item.descripcion}"</h3>
                <div className="flex justify-between p-4 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
                  <div className="flex flex-col items-center gap-1">
                    <BedDouble size={20} className="text-blue-600"/>
                    <span className="text-[10px] font-black text-slate-500">{item.habitaciones} Hab</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Bath size={20} className="text-blue-600"/>
                    <span className="text-[10px] font-black text-slate-500">{item.banos} Baños</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Maximize size={20} className="text-blue-600"/>
                    <span className="text-[10px] font-black text-slate-500">{item.tamano} m²</span>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between border-t pt-6 border-slate-50">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs">{item.agenteNombre?.charAt(0)}</div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase">Agente</span>
                        <span className="text-xs font-bold text-slate-700">{item.agenteNombre}</span>
                      </div>
                   </div>
                   <a href={`tel:${item.agenteContacto}`} className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg hover:scale-110 transition-transform"><Phone size={18}/></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODALES */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-200">
             <button onClick={() => setShowAuthModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors"><X size={24}/></button>
             <div className="text-center mb-10">
               <div className="bg-blue-600 w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white shadow-xl shadow-blue-200"><ShieldCheck size={32}/></div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Acceso Autorizado</h2>
               <p className="text-slate-400 text-sm font-medium">Solo agentes RumboCasa oficiales.</p>
             </div>
             {authError && <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-bold flex gap-2"><AlertCircle size={18}/> {authError}</div>}
             <form onSubmit={handleLogin} className="space-y-4">
                <input type="email" placeholder="Email corporativo" required className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold focus:border-blue-600 outline-none transition-all" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Contraseña" required className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold focus:border-blue-600 outline-none transition-all" value={password} onChange={e => setPassword(e.target.value)} />
                <button className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-sm hover:bg-blue-600 transition-all shadow-xl">Entrar al Portal</button>
             </form>
          </div>
        </div>
      )}

      {showPostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] relative">
             <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
               <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Nueva Publicación</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Agente: {agentProfile?.name}</p>
               </div>
               <button onClick={() => setShowPostModal(false)} className="p-3 bg-white rounded-2xl text-slate-400 hover:text-red-500 shadow-sm"><X size={24}/></button>
             </div>

             <form onSubmit={handleSubmitPost} className="p-10 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Ubicación</label>
                    <div className="grid grid-cols-2 gap-3">
                      <select className="p-4 rounded-2xl border-2 border-slate-100 font-bold" value={formData.provincia} onChange={e => setFormData({...formData, provincia: e.target.value, municipio: ubicacionesCuba[e.target.value][0]})}>
                        {Object.keys(ubicacionesCuba).map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <select className="p-4 rounded-2xl border-2 border-slate-100 font-bold" value={formData.municipio} onChange={e => setFormData({...formData, municipio: e.target.value})}>
                        {ubicacionesCuba[formData.provincia].map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Tipo y Detalles</label>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                       <select className="p-4 rounded-2xl border-2 border-slate-100 font-bold col-span-2" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                        <option>Casa</option><option>Apartamento</option><option>Habitación</option><option>Penthouse</option>
                       </select>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <input type="number" placeholder="Hab" className="p-4 rounded-2xl border-2 border-slate-100 font-bold" value={formData.habitaciones} onChange={e => setFormData({...formData, habitaciones: e.target.value})}/>
                      <input type="number" placeholder="Baños" className="p-4 rounded-2xl border-2 border-slate-100 font-bold" value={formData.banos} onChange={e => setFormData({...formData, banos: e.target.value})}/>
                      <input type="number" placeholder="m²" className="p-4 rounded-2xl border-2 border-slate-100 font-bold" value={formData.tamano} onChange={e => setFormData({...formData, tamano: e.target.value})}/>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Precio USD</label>
                    <input type="number" placeholder="0.00" className="w-full p-5 rounded-2xl border-2 border-slate-100 font-black text-3xl focus:border-blue-600 transition-all outline-none" value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Imagen de la propiedad</label>
                    <label className="w-full h-32 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all relative overflow-hidden group">
                      {uploading ? <Loader2 className="animate-spin text-blue-600"/> : (
                        formData.fotos ? <img src={formData.fotos} className="w-full h-full object-cover"/> : <>
                          <Camera className="text-slate-300 group-hover:text-blue-600 transition-colors" size={32}/>
                          <span className="text-[9px] font-black text-slate-400 uppercase mt-2">Subir Foto Real</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading}/>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <textarea placeholder="Descripción atractiva de la propiedad..." className="w-full p-6 rounded-3xl border-2 border-slate-100 font-medium h-32 resize-none focus:border-blue-600 outline-none transition-all" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
                  <button type="submit" className="w-full mt-8 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase tracking-widest">Lanzar Anuncio al Mundo</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}