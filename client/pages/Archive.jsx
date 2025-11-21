// // import React, { useEffect, useState, Suspense } from 'react';
// // import { Link } from 'react-router-dom';
// // import { ArrowLeft, Trash2, Sparkles, Search } from 'lucide-react';
// // import { Button } from '@/components/ui/button';
// // import { getArchiveItems } from '../lib/archiveStore';
// // import { Canvas } from '@react-three/fiber';
// // import { Stage, OrbitControls, Center, Environment } from '@react-three/drei';

// // // --- IMPORT YOUR 3D MODELS ---
// // // @ts-ignore
// // import ChannapatnaToy from '../components/ui/AR/ChannapatnaToy';
// // // @ts-ignore
// // import BluePottery from '../components/ui/AR/BluePottery';
// // // @ts-ignore
// // import WarliArt from '../components/ui/AR/WarliArt';
// // // @ts-ignore
// // import KolamArt from '../components/ui/AR/KolamArt';
// // // @ts-ignore
// // import MadhubaniArt from '../components/ui/AR/MadhubaniArt';

// // // Helper to render the correct 3D model for known items
// // const ModelPreview = ({ type }) => {
// //   let Model = null;
// //   switch(type) {
// //     case 'channapatna': Model = <ChannapatnaToy />; break;
// //     case 'blue-pottery': Model = <BluePottery />; break;
// //     case 'warli': Model = <WarliArt />; break;
// //     case 'kolam': Model = <KolamArt />; break;
// //     case 'madhubani': Model = <MadhubaniArt />; break;
// //     default: return null;
// //   }
  
// //   return (
// //     <div className="h-full w-full bg-black/20 cursor-move">
// //       <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 45 }}>
// //          <ambientLight intensity={0.5} />
// //          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
// //          <Environment preset="city" />
// //          <Suspense fallback={null}>
// //             <Stage intensity={0.5} environment="city" adjustCamera={false}>
// //                 <Center>{Model}</Center>
// //             </Stage>
// //          </Suspense>
// //          <OrbitControls autoRotate enableZoom={false} />
// //       </Canvas>
// //     </div>
// //   );
// // };

// // const Archive = () => {
// //   const [items, setItems] = useState([]);

// //   useEffect(() => {
// //     // 1. Get User Uploads from Local Storage
// //     const userItems = getArchiveItems();
    
// //     // 2. Add Default "System" Items (The 5 Known Crafts)
// //     const systemItems = [
// //         { id: 'sys1', craftId: 'warli', title: 'Warli Art', desc: 'Tribal art using rice paste circles.', isSystem: true },
// //         { id: 'sys2', craftId: 'madhubani', title: 'Madhubani Art', desc: 'Folk art done with fingers and twigs.', isSystem: true },
// //         { id: 'sys3', craftId: 'kolam', title: 'Kolam', desc: 'Geometric floor patterns.', isSystem: true },
// //         { id: 'sys4', craftId: 'channapatna', title: 'Channapatna Toys', desc: 'Traditional ivory-wood toys.', isSystem: true },
// //         { id: 'sys5', craftId: 'blue-pottery', title: 'Blue Pottery', desc: 'Turko-Persian pottery from Jaipur.', isSystem: true },
// //     ];

// //     // Combine: User items first, then System items
// //     setItems([...userItems, ...systemItems]);
// //   }, []);

// //   const clearHistory = () => {
// //     localStorage.removeItem("culture_lens_archive");
// //     window.location.reload(); 
// //   };

// //   return (
// //     <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-500">
      
// //       <header className="flex items-center justify-between px-8 py-4 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
// //         <div className="flex items-center gap-4">
// //             <Link to="/" className="p-2 bg-muted rounded-full text-foreground hover:bg-muted/80 transition-colors">
// //                 <ArrowLeft size={20} />
// //             </Link>
// //             <h1 className="text-xl font-serif font-bold tracking-wide">Community Archive</h1>
// //         </div>
// //         <Button variant="ghost" onClick={clearHistory} className="text-muted-foreground hover:text-destructive">
// //             <Trash2 className="w-4 h-4 mr-2" /> Clear My History
// //         </Button>
// //       </header>

// //       <div className="p-8 max-w-7xl mx-auto">
// //         <div className="mb-12 text-center">
// //             <h2 className="text-4xl font-serif font-bold mb-4">Discovery Log</h2>
// //             <p className="text-muted-foreground">Your personal collection of scanned heritage.</p>
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //             {items.map((item, index) => (
// //                 <div 
// //                     key={item.id || index} 
// //                     className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
// //                 >
// //                     {/* MEDIA CONTAINER */}
// //                     <div className="h-64 w-full overflow-hidden relative bg-muted">
                        
// //                         {/* IF SYSTEM ITEM -> SHOW 3D MODEL */}
// //                         {item.isSystem ? (
// //                             <ModelPreview type={item.craftId} />
// //                         ) : (
// //                             /* IF USER UPLOAD -> SHOW IMAGE */
// //                             <img 
// //                                 src={item.imageSrc} 
// //                                 alt={item.title} 
// //                                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
// //                             />
// //                         )}
                        
// //                         {/* BADGE: New Discovery (AI) */}
// //                         {item.craftId === 'unknown' && (
// //                              <div className="absolute top-3 right-3 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse z-10">
// //                                 <Sparkles size={12} /> NEW DISCOVERY
// //                              </div>
// //                         )}
                        
// //                         {/* BADGE: Known Upload */}
// //                         {item.isUserUploaded && item.craftId !== 'unknown' && (
// //                              <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg z-10">
// //                                 <Search size={12} /> IDENTIFIED
// //                              </div>
// //                         )}
                        
// //                         {/* BADGE: 3D Model Indicator */}
// //                         {item.isSystem && (
// //                             <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm border border-white/10">
// //                                 3D Interactive
// //                             </div>
// //                         )}
// //                     </div>

// //                     {/* TEXT CONTENT */}
// //                     <div className="p-6">
// //                         <h3 className="text-xl font-bold font-serif mb-2 text-foreground">{item.title}</h3>
// //                         <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
// //                             {item.desc}
// //                         </p>
                        
// //                         <div className="flex items-center justify-between pt-4 border-t border-border/50">
// //                             <span className="text-xs text-muted-foreground font-mono">
// //                                 {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'PERMANENT COLLECTION'}
// //                             </span>
                            
// //                             {item.craftId !== 'unknown' && (
// //                                 <Link to={`/result/${item.craftId}`}>
// //                                     <Button variant="link" className="text-primary p-0 h-auto font-bold text-xs">
// //                                         VIEW DETAILS &rarr;
// //                                     </Button>
// //                                 </Link>
// //                             )}
// //                         </div>
// //                     </div>
// //                 </div>
// //             ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Archive;
// import React, { useEffect, useState, Suspense } from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowLeft, Trash2, Sparkles, Search, Pencil, Check, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { getArchiveItems, updateArchiveItem } from '../lib/archiveStore';
// import { Canvas } from '@react-three/fiber';
// import { Stage, OrbitControls, Center, Environment } from '@react-three/drei';

// // MODELS
// // @ts-ignore
// import ChannapatnaToy from '../components/ui/AR/ChannapatnaToy';
// // @ts-ignore
// import BluePottery from '../components/ui/AR/BluePottery';
// // @ts-ignore
// import WarliArt from '../components/ui/AR/WarliArt';
// // @ts-ignore
// import KolamArt from '../components/ui/AR/KolamArt';
// // @ts-ignore
// import MadhubaniArt from '../components/ui/AR/MadhubaniArt';

// const ModelPreview = ({ type }) => {
//   let Model = null;
//   switch(type) {
//     case 'channapatna': Model = <ChannapatnaToy />; break;
//     case 'blue-pottery': Model = <BluePottery />; break;
//     case 'warli': Model = <WarliArt />; break;
//     case 'kolam': Model = <KolamArt />; break;
//     case 'madhubani': Model = <MadhubaniArt />; break;
//     default: return null;
//   }
//   return (
//     <div className="h-full w-full bg-black/20 cursor-move">
//       <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 45 }}>
//          <ambientLight intensity={0.5} /><spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} /><Environment preset="city" />
//          <Suspense fallback={null}><Stage intensity={0.5} environment="city" adjustCamera={false}><Center>{Model}</Center></Stage></Suspense>
//          <OrbitControls autoRotate enableZoom={false} />
//       </Canvas>
//     </div>
//   );
// };

// const Archive = () => {
//   const [items, setItems] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({ title: '', location: '', desc: '' });

//   useEffect(() => {
//     const userItems = getArchiveItems();
//     const systemItems = [
//         { id: 'sys1', craftId: 'warli', title: 'Warli Art', desc: 'Tribal art using rice paste circles.', isSystem: true },
//         { id: 'sys2', craftId: 'madhubani', title: 'Madhubani Art', desc: 'Folk art done with fingers and twigs.', isSystem: true },
//         { id: 'sys3', craftId: 'kolam', title: 'Kolam', desc: 'Geometric floor patterns.', isSystem: true },
//         { id: 'sys4', craftId: 'channapatna', title: 'Channapatna Toys', desc: 'Traditional ivory-wood toys.', isSystem: true },
//         { id: 'sys5', craftId: 'blue-pottery', title: 'Blue Pottery', desc: 'Turko-Persian pottery from Jaipur.', isSystem: true },
//     ];
//     setItems([...userItems, ...systemItems]);
//   }, []);

//   const startEditing = (item) => {
//     setEditingId(item.id);
//     setEditForm({ title: item.title, location: item.location || "Unknown Location", desc: item.desc });
//   };

//   const saveEdit = (id) => {
//     updateArchiveItem(id, editForm);
//     setItems(items.map(i => i.id === id ? { ...i, ...editForm } : i));
//     setEditingId(null);
//   };

//   const clearHistory = () => {
//     localStorage.removeItem("culture_lens_archive");
//     window.location.reload(); 
//   };

//   return (
//     <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-500">
//       <header className="flex items-center justify-between px-8 py-4 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
//         <div className="flex items-center gap-4">
//             <Link to="/" className="p-2 bg-muted rounded-full text-foreground hover:bg-muted/80 transition-colors"><ArrowLeft size={20} /></Link>
//             <h1 className="text-xl font-serif font-bold tracking-wide">Community Archive</h1>
//         </div>
//         <Button variant="ghost" onClick={clearHistory} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Clear My History</Button>
//       </header>

//       <div className="p-8 max-w-7xl mx-auto">
//         <div className="mb-12 text-center">
//             <h2 className="text-4xl font-serif font-bold mb-4">Discovery Log</h2>
//             <p className="text-muted-foreground">Contribute your knowledge to the CultureVerse.</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {items.map((item, index) => (
//                 <div key={item.id || index} className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
//                     <div className="h-64 w-full overflow-hidden relative bg-muted">
//                         {item.isSystem ? (
//                             <Link to={`/result/${item.craftId}`} className="cursor-pointer block h-full w-full">
//                                 <ModelPreview type={item.craftId} />
//                                 <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm border border-white/10 pointer-events-none">Tap to View 3D</div>
//                             </Link>
//                         ) : (
//                             <img src={item.imageSrc} alt={item.title} className="w-full h-full object-cover" />
//                         )}
//                         {!item.isSystem && <div className="absolute top-3 right-3 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg z-10"><Sparkles size={12} /> NEW DISCOVERY</div>}
//                     </div>

//                     <div className="p-6">
//                         {editingId === item.id ? (
//                             <div className="space-y-3">
//                                 <Input value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="font-bold text-lg" />
//                                 <Input value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} placeholder="Add Location" className="text-xs" />
//                                 <Textarea value={editForm.desc} onChange={(e) => setEditForm({...editForm, desc: e.target.value})} className="text-sm min-h-[80px]" />
//                                 <div className="flex gap-2 pt-2">
//                                     <Button size="sm" onClick={() => saveEdit(item.id)} className="w-full bg-green-600 hover:bg-green-700"><Check size={14} className="mr-1"/> Save</Button>
//                                     <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="w-full"><X size={14} className="mr-1"/> Cancel</Button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <>
//                                 <div className="flex justify-between items-start mb-2">
//                                     <h3 className="text-xl font-bold font-serif text-foreground">{item.title}</h3>
//                                     {!item.isSystem && <button onClick={() => startEditing(item)} className="text-muted-foreground hover:text-primary transition-colors"><Pencil size={16} /></button>}
//                                 </div>
//                                 {item.location && !item.isSystem && <p className="text-xs text-primary font-bold uppercase tracking-wide mb-2">{item.location}</p>}
//                                 <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{item.desc}</p>
//                                 {item.isSystem && <Link to={`/result/${item.craftId}`}><Button variant="link" className="text-primary p-0 h-auto font-bold text-xs">OPEN AR VIEW &rarr;</Button></Link>}
//                             </>
//                         )}
//                     </div>
//                 </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Archive;

import React, { useEffect, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Sparkles, Search, Pencil, Check, X, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getArchiveItems, updateArchiveItem } from '../lib/archiveStore';
import { Canvas } from '@react-three/fiber';
import { Stage, OrbitControls, Center, Environment } from '@react-three/drei';

// MODELS
// @ts-ignore
import ChannapatnaToy from '../components/ui/AR/ChannapatnaToy';
// @ts-ignore
import BluePottery from '../components/ui/AR/BluePottery';
// @ts-ignore
import WarliArt from '../components/ui/AR/WarliArt';
// @ts-ignore
import KolamArt from '../components/ui/AR/KolamArt';
// @ts-ignore
import MadhubaniArt from '../components/ui/AR/MadhubaniArt';

const ModelPreview = ({ type }) => {
  let Model = null;
  switch(type) {
    case 'channapatna': Model = <ChannapatnaToy />; break;
    case 'blue-pottery': Model = <BluePottery />; break;
    case 'warli': Model = <WarliArt />; break;
    case 'kolam': Model = <KolamArt />; break;
    case 'madhubani': Model = <MadhubaniArt />; break;
    default: return null;
  }
  return (
    <div className="h-full w-full bg-black/20 cursor-move">
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 45 }}>
         <ambientLight intensity={0.5} /><spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} /><Environment preset="city" />
         <Suspense fallback={null}><Stage intensity={0.5} environment="city" adjustCamera={false}><Center>{Model}</Center></Stage></Suspense>
         <OrbitControls autoRotate enableZoom={false} />
      </Canvas>
    </div>
  );
};

const Archive = () => {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', location: '', desc: '' });
  const [oralHistories, setOralHistories] = useState([]);

  useEffect(() => {
    // 1. Load Archive Items
    const userItems = getArchiveItems();
    const systemItems = [
        { id: 'sys1', craftId: 'warli', title: 'Warli Art', desc: 'Tribal art using rice paste circles.', isSystem: true },
        { id: 'sys2', craftId: 'madhubani', title: 'Madhubani Art', desc: 'Folk art done with fingers and twigs.', isSystem: true },
        { id: 'sys3', craftId: 'kolam', title: 'Kolam', desc: 'Geometric floor patterns.', isSystem: true },
        { id: 'sys4', craftId: 'channapatna', title: 'Channapatna Toys', desc: 'Traditional ivory-wood toys.', isSystem: true },
        { id: 'sys5', craftId: 'blue-pottery', title: 'Blue Pottery', desc: 'Turko-Persian pottery from Jaipur.', isSystem: true },
    ];
    setItems([...userItems, ...systemItems]);

    // 2. Load Oral Histories
    const histories = localStorage.getItem("oral_histories");
    if (histories) {
        setOralHistories(JSON.parse(histories));
    }
  }, []);

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditForm({ title: item.title, location: item.location || "Unknown Location", desc: item.desc });
  };

  const saveEdit = (id) => {
    updateArchiveItem(id, editForm);
    setItems(items.map(i => i.id === id ? { ...i, ...editForm } : i));
    setEditingId(null);
  };

  const clearHistory = () => {
    localStorage.removeItem("culture_lens_archive");
    localStorage.removeItem("oral_histories");
    window.location.reload(); 
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-500">
      <header className="flex items-center justify-between px-8 py-4 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4"><Link to="/" className="p-2 bg-muted rounded-full text-foreground hover:bg-muted/80 transition-colors"><ArrowLeft size={20} /></Link><h1 className="text-xl font-serif font-bold tracking-wide">Community Archive</h1></div>
        <Button variant="ghost" onClick={clearHistory} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Clear All Data</Button>
      </header>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
            <h2 className="text-4xl font-serif font-bold mb-4">Discovery Log</h2>
            <p className="text-muted-foreground">Contribute your knowledge to the CultureVerse.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, index) => {
                // Check for oral histories for this specific craft
                const relatedStories = oralHistories.filter(s => s.artId === item.craftId);

                return (
                <div key={item.id || index} className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="h-64 w-full overflow-hidden relative bg-muted">
                        {item.isSystem ? (
                            <Link to={`/result/${item.craftId}`} className="cursor-pointer block h-full w-full">
                                <ModelPreview type={item.craftId} />
                                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm border border-white/10 pointer-events-none">Tap to View 3D</div>
                            </Link>
                        ) : (
                            <img src={item.imageSrc} alt={item.title} className="w-full h-full object-cover" />
                        )}
                        {!item.isSystem && <div className="absolute top-3 right-3 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg z-10"><Sparkles size={12} /> NEW DISCOVERY</div>}
                    </div>

                    <div className="p-6">
                        {editingId === item.id ? (
                            <div className="space-y-3">
                                <Input value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="font-bold text-lg" />
                                <Input value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} placeholder="Add Location" className="text-xs" />
                                <Textarea value={editForm.desc} onChange={(e) => setEditForm({...editForm, desc: e.target.value})} className="text-sm min-h-[80px]" />
                                <div className="flex gap-2 pt-2"><Button size="sm" onClick={() => saveEdit(item.id)} className="w-full bg-green-600 hover:bg-green-700"><Check size={14} className="mr-1"/> Save</Button><Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="w-full"><X size={14} className="mr-1"/> Cancel</Button></div>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold font-serif text-foreground">{item.title}</h3>
                                    {!item.isSystem && <button onClick={() => startEditing(item)} className="text-muted-foreground hover:text-primary transition-colors"><Pencil size={16} /></button>}
                                </div>
                                {item.location && !item.isSystem && <p className="text-xs text-primary font-bold uppercase tracking-wide mb-2">{item.location}</p>}
                                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{item.desc}</p>
                                
                                {/* ORAL HISTORY SECTION */}
                                {relatedStories.length > 0 && (
                                    <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1 mb-2">
                                            <Mic size={10} /> Oral Histories ({relatedStories.length})
                                        </p>
                                        <div className="space-y-2">
                                            {relatedStories.slice(0, 2).map(story => (
                                                <p key={story.id} className="text-xs italic text-foreground/80 pl-2 border-l-2 border-primary">
                                                    "{story.text}"
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground font-mono">{item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'PERMANENT'}</span>
                                    {item.isSystem && <Link to={`/result/${item.craftId}`}><Button variant="link" className="text-primary p-0 h-auto font-bold text-xs">OPEN AR VIEW &rarr;</Button></Link>}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )})}
        </div>
      </div>
    </div>
  );
};

export default Archive;