import { useState, useRef, useEffect, useCallback, ChangeEvent, Suspense } from "react";
import { useNavigate } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { Upload, Sparkles, Eye, Archive, Camera, Image as ImageIcon, X, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import Webcam from "react-webcam";
import { Canvas } from "@react-three/fiber";
import { Stage, OrbitControls, Center, Environment } from "@react-three/drei"; // ADDED Environment

// --- IMPORTS ---
// @ts-ignore
import { classifyImage } from "../services/aiScanner"; 
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

export default function Index() {
  const navigate = useNavigate();

  // UI States
  const [showCamera, setShowCamera] = useState(false);
  const [detectedId, setDetectedId] = useState<string | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const scannerInterval = useRef<NodeJS.Timeout | null>(null);

  // --- SCANNER LOGIC ---
  const startScanning = () => {
    if (scannerInterval.current) clearInterval(scannerInterval.current);

    scannerInterval.current = setInterval(async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                const img = document.createElement('img');
                img.src = imageSrc;
                img.onload = async () => {
                    const result = await classifyImage(img);
                    
                    if (result) {
                       setDetectedId(result);
                       // KILL THE SCANNER ONCE FOUND
                       if (scannerInterval.current) {
                           clearInterval(scannerInterval.current);
                           scannerInterval.current = null;
                       }
                    }
                };
            }
        }
    }, 500); 
  };

  const stopAndReset = () => {
    if (scannerInterval.current) clearInterval(scannerInterval.current);
    setDetectedId(null);
    setShowCamera(false);
  };

  const resetScanner = () => {
    setDetectedId(null);
    startScanning();
  };

  useEffect(() => {
    if (showCamera) startScanning();
    else stopAndReset();
    
    return () => {
        if (scannerInterval.current) clearInterval(scannerInterval.current);
    };
  }, [showCamera]);


  // --- RENDER MODEL ---
  const renderARModel = () => {
    switch(detectedId) {
        case 'channapatna': return <ChannapatnaToy />;
        case 'blue-pottery': return <BluePottery />;
        case 'warli': return <WarliArt />;
        case 'kolam': return <KolamArt />;
        case 'madhubani': return <MadhubaniArt />;
        default: return null;
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    // File logic here if needed
  };

  return (
    <div className="h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex flex-col overflow-hidden">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

      <header className="flex items-center justify-between px-8 py-3 border-b border-border/30 flex-shrink-0 bg-white/50 backdrop-blur-md z-20 relative">
        <div className="text-lg font-semibold tracking-wide text-foreground font-serif">CultureVerse Lens</div>
        <nav className="flex items-center gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground">Demo</a>
          <a href="#" className="hover:text-foreground">Archive</a>
        </nav>
      </header>

      <div className={`flex-1 flex flex-col items-center ${showCamera ? 'justify-start p-0 overflow-hidden relative' : 'justify-between px-6 py-8 overflow-auto'}`}>
        
        {showCamera ? (
            <div className="relative w-full h-full bg-black overflow-hidden">
                
                {/* A. WEBCAM */}
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "environment" }}
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }}
                />

                {/* B. SCANNING OVERLAY */}
                {!detectedId && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                        <div className="w-64 h-64 border-2 border-white/50 rounded-xl relative animate-pulse">
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-amber-500 -mt-1 -ml-1"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-amber-500 -mt-1 -mr-1"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-amber-500 -mb-1 -ml-1"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-amber-500 -mb-1 -mr-1"></div>
                        </div>
                        <div className="mt-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
                            <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                            <span className="text-white text-xs font-medium">Scanning Environment...</span>
                        </div>
                    </div>
                )}

                {/* C. AR OVERLAY */}
                {detectedId && (
                    <div className="absolute inset-0 z-20">
                        <Canvas 
                            shadows 
                            dpr={[1, 2]} 
                            camera={{ position: [0, 0, 5], fov: 50 }} 
                            gl={{ alpha: true }} 
                            className="w-full h-full"
                        >
                            <ambientLight intensity={0.8} />
                            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                            
                            {/* KEY FIX: ADD ENVIRONMENT FOR REFLECTIONS */}
                            <Environment preset="city" />

                            <Suspense fallback={null}>
                                <Center>
                                    <group scale={2.5} rotation={[0.2, 0, 0]}>
                                        {renderARModel()}
                                    </group>
                                </Center>
                            </Suspense>
                            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                        </Canvas>

                        {/* UI Elements */}
                        <div className="absolute top-8 left-0 w-full flex justify-center pointer-events-none">
                            <div className="bg-green-500/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-top-10">
                                <Sparkles className="w-5 h-5 text-yellow-200" />
                                <span className="font-bold uppercase tracking-wide text-sm">{detectedId.replace('-', ' ')}</span>
                            </div>
                        </div>

                        <div className="absolute bottom-12 w-full flex flex-col items-center gap-3 pointer-events-auto">
                            <Button 
                                onClick={() => navigate(`/result/${detectedId}`)}
                                className="bg-white text-black hover:bg-gray-100 shadow-xl rounded-full px-8 py-6 text-lg font-bold flex items-center gap-2"
                            >
                                View History <ArrowRight className="w-5 h-5" />
                            </Button>
                            
                            <Button variant="ghost" size="sm" onClick={resetScanner} className="text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm">
                                <RefreshCw className="w-4 h-4 mr-2" /> Scan Something Else
                            </Button>
                        </div>
                    </div>
                )}

                <button onClick={() => setShowCamera(false)} className="absolute top-4 right-4 z-50 bg-black/50 p-3 rounded-full text-white hover:bg-black/80">
                    <X size={24} />
                </button>
            </div>

        ) : (
            // --- HOME VIEW ---
            <>
                <div className="text-center max-w-4xl flex-shrink-0 mb-8">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 tracking-wide">CultureVerse Lens</h1>
                    <p className="text-base md:text-lg text-muted-foreground font-light tracking-wide">AI + AR platform that brings local crafts and traditions to life.</p>
                </div>

                <div className="w-full max-w-xl flex-shrink-0 mb-auto">
                    <div className="glass soft-shadow w-full rounded-2xl p-8 backdrop-blur-lg bg-white/40 border border-white/60 shadow-xl">
                        <h2 className="text-2xl font-serif font-semibold text-foreground mb-6 text-center">Upload or Scan</h2>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-muted rounded-xl p-4 bg-secondary/30 flex flex-col items-center justify-center h-48 transition-all hover:bg-secondary/50 hover:border-amber-400/50 cursor-pointer group">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110"><ImageIcon className="w-6 h-6 text-amber-600" /></div>
                                <p className="text-sm text-foreground font-medium">Upload Image</p>
                            </div>
                            <div onClick={() => setShowCamera(true)} className="border-2 border-dashed border-muted rounded-xl p-4 bg-secondary/30 flex flex-col items-center justify-center h-48 transition-all hover:bg-secondary/50 hover:border-amber-400/50 cursor-pointer group">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110"><Camera className="w-6 h-6 text-amber-600" /></div>
                                <p className="text-sm text-foreground font-medium">Use Camera</p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-4 font-light tracking-tight">AI-powered cultural recognition • No signup required</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8 w-full max-w-3xl flex-shrink-0 mt-8 pb-8">
                    <div className="flex flex-col items-center text-center"><div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3"><Sparkles className="w-6 h-6 text-amber-600" /></div><p className="text-sm font-medium text-foreground">AI Recognition</p></div>
                    <div className="flex flex-col items-center text-center"><div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3"><Eye className="w-6 h-6 text-amber-600" /></div><p className="text-sm font-medium text-foreground">AR Story Overlay</p></div>
                    <div className="flex flex-col items-center text-center"><div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3"><Archive className="w-6 h-6 text-amber-600" /></div><p className="text-sm font-medium text-foreground">Community Archive</p></div>
                </div>
            </>
        )}
      </div>
    </div>
  );
}