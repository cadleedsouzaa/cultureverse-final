import { useState, useRef, useEffect, ChangeEvent, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Eye, Archive, Camera, Image as ImageIcon, X, ArrowRight, Loader2, Repeat, RefreshCw } from "lucide-react"; // Added RefreshCw
import Webcam from "react-webcam";
import { Canvas } from "@react-three/fiber";
import { Stage, OrbitControls, Center, Environment, Float, ContactShadows } from "@react-three/drei"; 
import { ThemeToggle } from "../components/ThemeToggle";
import { useToast } from "@/components/ui/use-toast";
import { LanguageSwitcherNLP } from "../components/LanguageSwitcherNLP";
import * as THREE from 'three';

// SERVICES
// @ts-ignore
import { classifyImage } from "../services/aiScanner"; 
import { getDescriptionForImage } from "../services/imageCaptioner";
import { addToArchive } from "../lib/archiveStore";

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
import IndiaCultureMap from '../components/IndiaCultureMap';

// PARALLAX CAMERA (Fixes camera movement)
const ParallaxCamera = ({ mouse }) => {
  // @ts-ignore
  // eslint-disable-next-line
  return null; // Simplified for stability in this version, keeping models fixed
};

const Background = () => {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!divRef.current) return;
      const x = e.clientX;
      const y = e.clientY;
      divRef.current.style.setProperty("--mouse-x", `${x}px`);
      divRef.current.style.setProperty("--mouse-y", `${y}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  return (
    <div ref={divRef} className="fixed inset-0 -z-10 h-full w-full bg-background overflow-hidden transition-colors duration-500">
      <div className="absolute h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 lg:opacity-100" style={{ background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(245, 158, 11, 0.15), transparent 40%)` }} />
      <div className="absolute left-0 right-0 top-[-10%] m-auto h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[100px] animate-pulse dark:bg-indigo-500/10"></div>
    </div>
  );
};

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showCamera, setShowCamera] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedId, setDetectedId] = useState<string | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState("Analyzing...");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const scannerInterval = useRef<any>(null);

  // --- CAMERA LOGIC ---
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
                    // @ts-ignore
                    if (result && result !== 'unknown') {
                       setDetectedId(result);
                       if (scannerInterval.current) clearInterval(scannerInterval.current);
                    }
                };
            }
        }
    }, 500); 
  };

  // Explicitly reset everything when opening camera
  const handleOpenCamera = () => {
      setDetectedId(null); // Clear previous result
      setShowCamera(true); // Open camera
  };

  const resetScanner = () => {
    setDetectedId(null);
    startScanning();
  };

  useEffect(() => { 
      if (showCamera) startScanning(); 
      return () => { if (scannerInterval.current) clearInterval(scannerInterval.current); }; 
  }, [showCamera]);
  
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
    const file = event.target.files?.[0];
    if (file) { setSelectedImage(file); setPreviewUrl(URL.createObjectURL(file)); }
  };
  const handleUploadClick = () => { if(fileInputRef.current) { fileInputRef.current.value = ''; fileInputRef.current.click(); } };
  const clearSelection = () => { setSelectedImage(null); setPreviewUrl(null); setIsAnalyzing(false); setAnalysisStatus("Analyzing..."); };

  const handleIdentifyUpload = async () => {
    if (selectedImage && previewUrl) {
        setIsAnalyzing(true);
        setAnalysisStatus("Scanning Patterns...");

        const img = document.createElement('img');
        img.src = previewUrl;
        img.onload = async () => {
            try {
                let craftId = await classifyImage(img);
                // @ts-ignore
                if (craftId && craftId !== 'unknown') {
                    navigate(`/result/${craftId}`);
                } else {
                    setAnalysisStatus("Generating Description...");
                    const realDescription = await getDescriptionForImage(previewUrl);
                    await addToArchive('unknown', selectedImage, realDescription, "Unknown Location");

                    toast({ title: "New Artifact Discovered", description: "Added to Archive for curation." });
                    setTimeout(() => navigate('/archive'), 1500);
                }
            } catch (e) {
                toast({ variant: "destructive", title: "Error", description: "Analysis failed." });
            } finally {
                setIsAnalyzing(false);
            }
        };
    }
  };

  return (
    <div className="h-screen text-foreground flex flex-col overflow-hidden transition-colors duration-500 font-sans">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&display=swap'); .font-traditional { font-family: 'Playfair Display', serif; }`}</style>
      <Background /> 
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" style={{ display: 'none' }} />

      <header className="flex items-center justify-between px-8 py-4 border-b border-border/40 flex-shrink-0 bg-background/50 backdrop-blur-md z-50 relative">
        <div className="text-xl font-traditional font-bold tracking-wide flex items-center gap-2 text-foreground">CultureVerse Lens</div>
        <nav className="flex items-center gap-6 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors font-medium uppercase tracking-wider">Demo</Link>
          <Link to="/archive" className="hover:text-primary transition-colors font-medium uppercase tracking-wider">Archive</Link>
          <LanguageSwitcherNLP />
          <ThemeToggle />
        </nav>
      </header>

      <div className={`flex-1 flex flex-col items-center ${showCamera ? 'justify-start p-0 overflow-hidden relative' : 'justify-start px-6 py-8 overflow-y-auto'}`}>
        {showCamera ? (
            <div className="relative w-full h-full bg-black overflow-hidden">
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: "environment" }} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }} />
                
                {!detectedId && <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"><div className="mt-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2"><Loader2 className="w-4 h-4 text-amber-500 animate-spin" /><span className="text-white text-xs font-medium">Scanning...</span></div></div>}
                
                {detectedId && (
                    <div className="absolute inset-0 z-20">
                        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 50 }} gl={{ alpha: true }} className="w-full h-full">
                            <ambientLight intensity={0.8} />
                            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                            <Environment preset="city" />
                            <Suspense fallback={null}>
                                <Center>
                                    {/* Keep Scale 1.0 so it fits */}
                                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                                        <group scale={1.0} rotation={[0.2, 0, 0]}>
                                            {renderARModel()}
                                        </group>
                                    </Float>
                                </Center>
                                <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={1.5} far={4.5} />
                            </Suspense>
                        </Canvas>
                        
                        {/* --- NEW: TWO BUTTONS (View Details + Scan Again) --- */}
                        <div className="absolute bottom-12 w-full flex flex-col items-center gap-3 pointer-events-auto">
                            <div className="flex gap-4">
                                {/* RESET BUTTON */}
                                <Button 
                                    onClick={resetScanner} 
                                    variant="secondary"
                                    className="bg-white/80 text-black backdrop-blur hover:bg-white shadow-xl rounded-full px-6 py-6 text-md font-bold flex items-center gap-2"
                                >
                                    <RefreshCw className="w-5 h-5" /> Scan Again
                                </Button>

                                {/* VIEW DETAILS BUTTON */}
                                <Button 
                                    onClick={() => navigate(`/result/${detectedId}`)} 
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl rounded-full px-8 py-6 text-lg font-bold flex items-center gap-2"
                                >
                                    View Full Details <ArrowRight className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                
                <button onClick={() => setShowCamera(false)} className="absolute top-4 right-4 z-50 bg-black/50 p-3 rounded-full text-white hover:bg-black/80"><X size={24} /></button>
            </div>
        ) : (
            <>
                <div className="text-center max-w-4xl flex-shrink-0 mb-12 mt-8 animate-in slide-in-from-top-10 fade-in duration-700">
                    <h1 className="text-6xl md:text-8xl font-traditional font-bold mb-6 tracking-tight text-foreground">CultureVerse Lens</h1>
                    <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide max-w-2xl mx-auto">Discover <span className="text-primary font-medium font-traditional italic text-2xl">India's Heritage</span> through the lens of AI.</p>
                </div>

                <div className="w-full max-w-3xl flex-shrink-0 mb-16 relative z-10">
                    <div className="w-full p-1">
                        {!previewUrl && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                {/* ... Upload Button (Same as before) ... */}
                                <div onClick={handleUploadClick} className="relative overflow-hidden border border-border/50 rounded-2xl p-8 h-72 bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-300 ease-out hover:scale-[1.02] hover:border-primary/50 hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)] cursor-pointer group">
                                    <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"><ImageIcon className="w-10 h-10 text-primary" /></div>
                                    <p className="text-2xl font-traditional text-foreground group-hover:text-primary transition-colors">Upload Image</p>
                                    <p className="text-sm text-muted-foreground mt-2">Supports JPG, PNG</p>
                                </div>
                                
                                {/* CAMERA BUTTON - NOW CALLS handleOpenCamera */}
                                <div 
                                    onClick={handleOpenCamera} // <--- UPDATED HERE
                                    className="relative overflow-hidden border border-border/50 rounded-2xl p-8 h-72 bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-300 ease-out hover:scale-[1.02] hover:border-primary/50 hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)] cursor-pointer group"
                                >
                                    <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"><Camera className="w-10 h-10 text-primary" /></div>
                                    <p className="text-2xl font-traditional text-foreground group-hover:text-primary transition-colors">Use Camera</p>
                                    <p className="text-sm text-muted-foreground mt-2">Real-time AR Scan</p>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                </div>
                            </div>
                        )}

                        {previewUrl && (
                            <div className="w-full bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 animate-in zoom-in-95 duration-300">
                                <div className="flex flex-col items-center">
                                    <div className="mb-6 relative rounded-xl overflow-hidden border-2 border-border bg-muted h-64 w-full flex items-center justify-center group shadow-inner">
                                        <img src={previewUrl} alt="Selected" className="w-full h-full object-contain" />
                                        <Button size="sm" variant="destructive" className="absolute bottom-2 shadow-lg" onClick={clearSelection} disabled={isAnalyzing}><X className="w-4 h-4 mr-1" /> Remove</Button>
                                    </div>
                                    <div className="space-y-3 w-full max-w-sm">
                                        <Button className="w-full font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all font-traditional" size="lg" disabled={isAnalyzing} onClick={handleIdentifyUpload}>
                                            {isAnalyzing ? (<div className="flex items-center gap-2"><Sparkles className="w-5 h-5 animate-spin" /><span>{analysisStatus}</span></div>) : "Identify Craft"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {!previewUrl && <div className="w-full flex-shrink-0 mb-16 relative z-0"><IndiaCultureMap /></div>}
            </>
        )}
      </div>
    </div>
  );
}