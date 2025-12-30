<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RumboCasa - Portal Inmobiliario</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- React y ReactDOM -->
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <!-- Babel para JSX -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { 
            font-family: 'Plus Jakarta Sans', sans-serif; 
            overflow-x: hidden; 
        }
        .glass-card { 
            background: rgba(255, 255, 255, 0.8); 
            backdrop-filter: blur(12px); 
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900">
    <div id="root"></div>

    <script type="text/babel" data-type="module">
        const { useState, useEffect, useCallback, useMemo, useRef } = React;
        
        // --- FIREBASE IMPORTS ---
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
        import { getFirestore, collection, onSnapshot, query, limit, orderBy, startAfter, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
        import { getAuth, onAuthStateChanged, signInAnonymously, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

        const firebaseConfig = {
            apiKey: "AIzaSyAuwoZBV8lKsbOBeLiLc3qSHY6jaxEqnmM",
            authDomain: "rumbocasa-7187f.firebaseapp.com",
            projectId: "rumbocasa-7187f",
            storageBucket: "rumbocasa-7187f.firebasestorage.app",
            messagingSenderId: "614700920624",
            appId: "1:614700920624:web:31f82a7a8721665efb22f5"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        const APP_ID = 'rumbo-casa-portal';
        const PAGE_SIZE = 20;

        // Memoized Icon Component
        const Icon = React.memo(({ name, size = 20, className = "" }) => {
            const iconRef = useRef(null);
            useEffect(() => {
                if (window.lucide && iconRef.current) {
                    window.lucide.createIcons({
                        icons: { [name]: window.lucide.icons[name] },
                        nameAttr: 'data-lucide'
                    });
                }
            }, [name]);
            return (
                <span className={`inline-flex items-center justify-center ${className}`}>
                    <i ref={iconRef} data-lucide={name} style={{ width: size, height: size }}></i>
                </span>
            );
        });

        // Add Property Form Component
        const AddPropertyForm = ({ isOpen, onClose, user }) => {
            const [loading, setLoading] = useState(false);
            const [formData, setFormData] = useState({
                tipo: 'Venta',
                precio: '',
                municipio: '',
                provincia: '',
                habitaciones: '',
                banos: '',
                tamano: '',
                descripcion: '',
                agenteNombre: 'Agente Oficial',
                agenteContacto: '',
                fotos: ''
            });

            if (!isOpen) return null;

            const handleSubmit = async (e) => {
                e.preventDefault();
                if (!user) return;
                setLoading(true);

                try {
                    const listingsCol = collection(db, 'artifacts', APP_ID, 'public', 'data', 'listings');
                    await addDoc(listingsCol, {
                        ...formData,
                        precio: Number(formData.precio),
                        habitaciones: Number(formData.habitaciones),
                        banos: Number(formData.banos),
                        tamano: Number(formData.tamano),
                        createdAt: serverTimestamp(),
                        userId: user.uid
                    });
                    onClose();
                    setFormData({ tipo: 'Venta', precio: '', municipio: '', provincia: '', habitaciones: '', banos: '', tamano: '', descripcion: '', agenteNombre: 'Agente Oficial', agenteContacto: '', fotos: '' });
                } catch (error) {
                    console.error("Error al publicar:", error);
                } finally {
                    setLoading(false);
                }
            };

            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl relative my-auto">
                        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                            <Icon name="x" size={24} />
                        </button>
                        
                        <div className="mb-8">
                            <h3 className="text-2xl font-black tracking-tight">Publicar Anuncio</h3>
                            <p className="text-slate-500 text-sm font-medium">Completa los detalles de la propiedad</p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Descripción del Inmueble</label>
                                <textarea 
                                    required
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-medium"
                                    rows="3"
                                    placeholder="Ej: Amplio apartamento con vista al mar..."
                                    value={formData.descripcion}
                                    onChange={e => setFormData({...formData, descripcion: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Tipo</label>
                                <select 
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-medium appearance-none"
                                    value={formData.tipo}
                                    onChange={e => setFormData({...formData, tipo: e.target.value})}
                                >
                                    <option>Venta</option>
                                    <option>Renta</option>
                                    <option>Permuta</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Precio (USD)</label>
                                <input 
                                    type="number" required
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-medium"
                                    placeholder="50000"
                                    value={formData.precio}
                                    onChange={e => setFormData({...formData, precio: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Provincia</label>
                                <input 
                                    type="text" required
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-medium"
                                    placeholder="La Habana"
                                    value={formData.provincia}
                                    onChange={e => setFormData({...formData, provincia: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Municipio</label>
                                <input 
                                    type="text" required
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-medium"
                                    placeholder="Playa"
                                    value={formData.municipio}
                                    onChange={e => setFormData({...formData, municipio: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2 md:col-span-2">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Hab.</label>
                                    <input type="number" required className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-medium" value={formData.habitaciones} onChange={e => setFormData({...formData, habitaciones: e.target.value})}/>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Baños</label>
                                    <input type="number" required className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-medium" value={formData.banos} onChange={e => setFormData({...formData, banos: e.target.value})}/>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">m²</label>
                                    <input type="number" required className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-medium" value={formData.tamano} onChange={e => setFormData({...formData, tamano: e.target.value})}/>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">URL de Foto (Directa)</label>
                                <input 
                                    type="url" required
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-medium"
                                    placeholder="https://images.unsplash.com/..."
                                    value={formData.fotos}
                                    onChange={e => setFormData({...formData, fotos: e.target.value})}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Contacto del Agente (Tel/WhatsApp)</label>
                                <input 
                                    type="text" required
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-medium"
                                    placeholder="+53 5 000 0000"
                                    value={formData.agenteContacto}
                                    onChange={e => setFormData({...formData, agenteContacto: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="md:col-span-2 w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div> : 'Confirmar Publicación'}
                            </button>
                        </form>
                    </div>
                </div>
            );
        };

        const LoginModal = ({ isOpen, onClose, onLogin }) => {
            const [email, setEmail] = useState('');
            const [pass, setPass] = useState('');
            const [loading, setLoading] = useState(false);

            if (!isOpen) return null;

            const handleSubmit = async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                    await signInAnonymously(auth);
                    onLogin();
                    onClose();
                } catch (error) {
                    console.error("Error en login:", error);
                } finally {
                    setLoading(false);
                }
            };

            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
                        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                            <Icon name="x" size={24} />
                        </button>
                        <div className="text-center mb-8">
                            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                                <Icon name="lock" size={32} />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight">Acceso Agentes</h3>
                            <p className="text-slate-500 text-sm font-medium mt-2">Introduce tus credenciales autorizadas</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Corporativo</label>
                                <input type="email" required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-medium" placeholder="agente@rumbocasa.cu" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Contraseña</label>
                                <input type="password" required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-medium" placeholder="••••••••" value={pass} onChange={(e) => setPass(e.target.value)} />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                {loading ? <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div> : 'Entrar al Panel'}
                            </button>
                        </form>
                    </div>
                </div>
            );
        };

        const ListingCard = ({ item }) => {
            const getFirstPhoto = () => {
                if (!item.fotos) return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800';
                if (Array.isArray(item.fotos)) return item.fotos[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800';
                if (typeof item.fotos === 'string') return item.fotos.split(',')[0].trim();
                return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800';
            };

            const fotoPrincipal = getFirstPhoto();
            const precioFormateado = Number(item.precio || 0).toLocaleString();

            return (
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
                    <div className="h-64 bg-slate-200 relative overflow-hidden">
                        <img 
                            src={fotoPrincipal} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            alt="Propiedad"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'; }}
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-black uppercase text-blue-600 tracking-wider">
                            {item.tipo || 'Venta'}
                        </div>
                        <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-xl font-black shadow-lg text-lg tracking-tighter">
                            ${precioFormateado}
                        </div>
                    </div>
                    <div className="p-7">
                        <div className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-3 flex items-center gap-1">
                            <Icon name="map-pin" size={12} /> {item.municipio || 'S/N'}, {item.provincia || 'Cuba'}
                        </div>
                        <h3 className="text-xl font-black mb-5 line-clamp-2 text-slate-800 h-14 italic leading-tight">
                            "{item.descripcion || 'Sin descripción disponible'}"
                        </h3>
                        <div className="flex justify-between p-4 bg-slate-50 rounded-2xl text-[11px] font-black text-slate-500 mb-6">
                            <span className="flex items-center gap-2"><Icon name="bed" size={16} className="text-blue-500"/> {item.habitaciones || 0} Hab</span>
                            <span className="flex items-center gap-2"><Icon name="bath" size={16} className="text-blue-500"/> {item.banos || 0} Baños</span>
                            <span className="flex items-center gap-2"><Icon name="maximize" size={16} className="text-blue-500"/> {item.tamano || 0}m²</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Agente</span>
                                <span className="text-sm font-black text-slate-700">{item.agenteNombre || 'RumboCasa'}</span>
                            </div>
                            <a href={`tel:${item.agenteContacto}`} className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-blue-600 transition-colors">
                                <Icon name="phone" size={18} />
                            </a>
                        </div>
                    </div>
                </div>
            );
        };

        function App() {
            const [user, setUser] = useState(null);
            const [isAgent, setIsAgent] = useState(false);
            const [listings, setListings] = useState([]);
            const [lastDoc, setLastDoc] = useState(null);
            const [loading, setLoading] = useState(true);
            const [loadingMore, setLoadingMore] = useState(false);
            const [hasMore, setHasMore] = useState(true);
            const [filter, setFilter] = useState('');
            const [isLoginOpen, setIsLoginOpen] = useState(false);
            const [isAddOpen, setIsAddOpen] = useState(false);

            useEffect(() => {
                const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                    setUser(currentUser);
                    setIsAgent(!!currentUser);
                    setLoading(false);
                });
                return () => unsubscribe();
            }, []);

            useEffect(() => {
                const listingsCol = collection(db, 'artifacts', APP_ID, 'public', 'data', 'listings');
                const q = query(listingsCol, orderBy('createdAt', 'desc'), limit(PAGE_SIZE));

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setListings(docs);
                    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
                    setHasMore(snapshot.docs.length === PAGE_SIZE);
                    setLoading(false);
                }, (error) => {
                    console.error("Error cargando datos:", error);
                    setLoading(false);
                });
                return () => unsubscribe();
            }, []);

            const fetchMore = async () => {
                if (!lastDoc || loadingMore) return;
                setLoadingMore(true);
                const listingsCol = collection(db, 'artifacts', APP_ID, 'public', 'data', 'listings');
                const nextQuery = query(listingsCol, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(PAGE_SIZE));
                try {
                    const snapshot = await getDocs(nextQuery);
                    const newData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setListings(prev => [...prev, ...newData]);
                    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
                    setHasMore(snapshot.docs.length === PAGE_SIZE);
                } catch (err) {
                    console.error("Error:", err);
                } finally {
                    setLoadingMore(false);
                }
            };

            const filteredListings = listings.filter(item => 
                (item.provincia?.toLowerCase() || "").includes(filter.toLowerCase()) || 
                (item.municipio?.toLowerCase() || "").includes(filter.toLowerCase()) || 
                (item.descripcion?.toLowerCase() || "").includes(filter.toLowerCase())
            );

            if (loading) return (
                <div className="flex items-center justify-center min-h-screen bg-slate-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">RumboCasa está cargando...</p>
                    </div>
                </div>
            );

            return (
                <div className="min-h-screen flex flex-col">
                    <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={() => setIsAgent(true)}/>
                    <AddPropertyForm isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} user={user}/>

                    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg"><Icon name="home" size={20}/></div>
                            <h1 className="text-xl font-black tracking-tighter uppercase">Rumbo<span className="text-blue-600">Casa</span></h1>
                        </div>
                        {isAgent ? (
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">Agente Activo</span>
                                    <span className="text-xs font-bold text-slate-600">ID: {user?.uid.substring(0,8)}</span>
                                </div>
                                <button onClick={() => signOut(auth)} className="bg-slate-100 text-slate-600 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-2">
                                    <Icon name="log-out" size={14} /> Salir
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setIsLoginOpen(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2">
                                <Icon name="user" size={14} /> Acceso Agentes
                            </button>
                        )}
                    </nav>

                    <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
                        {isAgent && (
                            <div className="mb-12 p-8 bg-blue-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-100">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight mb-2 italic">¡Hola, Agente!</h2>
                                    <p className="text-blue-100 font-medium">Gestiona tus propiedades y publicaciones desde aquí.</p>
                                </div>
                                <button 
                                    onClick={() => setIsAddOpen(true)}
                                    className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform flex items-center gap-3"
                                >
                                    <Icon name="plus-circle" size={18} /> Publicar Nueva Propiedad
                                </button>
                            </div>
                        )}

                        <header className="text-center mb-16">
                            <h2 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter">Encuentra tu lugar.</h2>
                            <div className="relative max-w-2xl mx-auto">
                                <Icon name="search" className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={24} />
                                <input 
                                    type="text" 
                                    placeholder="Busca por municipio, provincia..." 
                                    className="w-full pl-16 pr-8 py-5 rounded-[2rem] border-2 border-slate-100 outline-none focus:border-blue-500 shadow-xl font-medium transition-all text-lg" 
                                    value={filter} 
                                    onChange={e => setFilter(e.target.value)} 
                                />
                            </div>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredListings.map(item => <ListingCard key={item.id} item={item} />)}
                        </div>

                        {hasMore && !filter && (
                            <div className="mt-20 flex justify-center">
                                <button onClick={fetchMore} disabled={loadingMore} className="group flex items-center gap-4 bg-white border-2 border-slate-200 px-10 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all shadow-xl hover:shadow-blue-50">
                                    {loadingMore ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600"></div> : <>Ver más resultados <Icon name="chevron-down" size={18}/></>}
                                </button>
                            </div>
                        )}
                    </main>

                    <footer className="bg-slate-900 text-slate-500 py-12 text-center text-[10px] font-black uppercase tracking-[0.2em]">
                        &copy; 2025 RumboCasa Cuba - Panel de Gestión Inmobiliaria Profesional
                    </footer>
                </div>
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>