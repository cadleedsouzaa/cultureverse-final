
import { useState, useRef, useEffect, ChangeEvent, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Eye, Archive, Camera, Image as ImageIcon, X, ArrowRight, Loader2, RefreshCw, Repeat, AlertCircle } from "lucide-react";
import Webcam from "react-webcam";
import { Canvas } from "@react-three/fiber";
import { Stage, OrbitControls, Center, Environment } from "@react-three/drei";
import { ThemeToggle } from "../components/ThemeToggle";
import { useToast } from "@/components/ui/use-toast"; // Import Toast for feedback

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
import IndiaCultureMap from '../components/IndiaCultureMap';

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast(); // Initialize Toast

  // UI States
  const [showCamera, setShowCamera] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedId, setDetectedId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const scannerInterval = useRef<NodeJS.Timeout | null>(null);

  // --- 1. CAMERA LOGIC ---
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

  // --- 2. UPLOAD LOGIC ---
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadClick = () => {
    if(fileInputRef.current) {
        fileInputRef.current.value = ''; 
        fileInputRef.current.click();
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setIsAnalyzing(false);
  };

  // --- UPDATED: STRICT IDENTIFICATION LOGIC ---
  const handleIdentifyUpload = async () => {
    if (selectedImage && previewUrl) {
        setIsAnalyzing(true);
        const img = document.createElement('img');
        img.src = previewUrl;
        img.onload = async () => {
            try {
                let craftId = await classifyImage(img);
                
                // STRICT CHECK:
                // If we found a VALID craft (not null, not 'unknown'), we go there.
                // Otherwise, we stay here and show an error.
                // @ts-ignore
                if (craftId && craftId !== 'unknown') {
                    navigate(`/result/${craftId}`);
                } else {
                    // STAY ON PAGE + SHOW ERROR
                    toast({
                        variant: "destructive",
                        title: "Could not identify craft",
                        description: "The image doesn't match our database. Please try a clearer photo.",
                    });
                }

            } catch (e) {
                toast({
                    variant: "destructive",
                    title: "Analysis Error",
                    description: "Something went wrong while analyzing. Please try again.",
                });
            } finally {
                setIsAnalyzing(false);
            }
        };
    }
  };

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden transition-colors duration-500">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" style={{ display: 'none' }} />

      <header className="flex items-center justify-between px-8 py-3 border-b border-border/40 flex-shrink-0 bg-background/80 backdrop-blur-md z-20 relative">
        <div className="text-lg font-semibold tracking-wide font-serif flex items-center gap-2">CultureVerse Lens</div>
        <nav className="flex items-center gap-6 text-xs text-muted-foreground">
         
          <Link to="/archive" className="hover:text-primary transition-colors font-medium">Archive</Link>
          <ThemeToggle />
        </nav>
      </header>

      <div className={`flex-1 flex flex-col items-center ${showCamera ? 'justify-start p-0 overflow-hidden relative' : 'justify-start px-6 py-8 overflow-y-auto'}`}>
        {showCamera ? (
            <div className="relative w-full h-full bg-black overflow-hidden">
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: "environment" }} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }} />
                {!detectedId && <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"><div className="mt-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2"><Loader2 className="w-4 h-4 text-amber-500 animate-spin" /><span className="text-white text-xs font-medium">Scanning Environment...</span></div></div>}
                {detectedId && <div className="absolute inset-0 z-20"><Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true }} className="w-full h-full"><ambientLight intensity={0.8} /><spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} /><Environment preset="city" /><Suspense fallback={null}><Center><group scale={2.5} rotation={[0.2, 0, 0]}>{renderARModel()}</group></Center></Suspense><OrbitControls enablePan={true} enableZoom={true} enableRotate={true} /></Canvas><div className="absolute bottom-12 w-full flex flex-col items-center gap-3 pointer-events-auto"><Button onClick={() => navigate(`/result/${detectedId}`)} className="bg-white text-black hover:bg-gray-100 shadow-xl rounded-full px-8 py-6 text-lg font-bold flex items-center gap-2">View Full Details <ArrowRight className="w-5 h-5" /></Button></div></div>}
                <button onClick={() => setShowCamera(false)} className="absolute top-4 right-4 z-50 bg-black/50 p-3 rounded-full text-white hover:bg-black/80"><X size={24} /></button>
            </div>
        ) : (
            <>
                <div className="text-center max-w-4xl flex-shrink-0 mb-8 mt-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3 tracking-wide text-foreground">CultureVerse Lens</h1>
                    <p className="text-base md:text-lg text-muted-foreground font-light tracking-wide">AI + AR platform that brings local crafts and traditions to life.</p>
                </div>

                <div className="w-full max-w-xl flex-shrink-0 mb-12 relative z-10">
                    <div className="w-full rounded-2xl p-8 backdrop-blur-lg bg-card/50 border border-border shadow-xl transition-all">
                        {!previewUrl && <h2 className="text-2xl font-serif font-semibold mb-6 text-center">Upload or Scan</h2>}

                        {previewUrl ? (
                            <div className="w-full flex flex-col items-center">
                                <div className="mb-6 relative rounded-xl overflow-hidden border-2 border-border bg-muted h-64 w-full flex items-center justify-center group">
                                    <img src={previewUrl} alt="Selected" className="w-full h-full object-contain" />
                                    <Button size="sm" variant="destructive" className="absolute bottom-2" onClick={clearSelection} disabled={isAnalyzing}><X className="w-4 h-4 mr-1" /> Remove</Button>
                                </div>
                                <div className="space-y-3 w-full">
                                    <Button className="w-full font-semibold py-3 text-base rounded-xl" size="lg" disabled={isAnalyzing} onClick={handleIdentifyUpload}>
                                        {isAnalyzing ? (<div className="flex items-center gap-2"><Sparkles className="w-4 h-4 animate-spin" /><span>Analyzing...</span></div>) : "Identify Craft"}
                                    </Button>
                                    <Button variant="ghost" onClick={clearSelection} className="w-full"><Repeat className="w-3 h-3 mr-1" /> Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div onClick={handleUploadClick} className="border-2 border-dashed border-border rounded-xl p-4 bg-muted/50 flex flex-col items-center justify-center h-48 transition-all hover:border-primary/50 cursor-pointer group hover:bg-muted">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110"><ImageIcon className="w-6 h-6 text-primary" /></div>
                                    <p className="text-sm font-medium">Upload Image</p>
                                </div>
                                <div onClick={() => setShowCamera(true)} className="border-2 border-dashed border-border rounded-xl p-4 bg-muted/50 flex flex-col items-center justify-center h-48 transition-all hover:border-primary/50 cursor-pointer group hover:bg-muted">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110"><Camera className="w-6 h-6 text-primary" /></div>
                                    <p className="text-sm font-medium">Use Camera</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {!previewUrl && (
                    <div className="w-full flex-shrink-0 mb-16 relative z-0">
                        <IndiaCultureMap />
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
}