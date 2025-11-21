import React, { useEffect, useState, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Hammer } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stage, OrbitControls, Center, Environment } from '@react-three/drei';

// DATA
import { CRAFT_DATA } from '../data/crafts';

// COMPONENTS
import OralHistoryRecorder from '../components/OralHistoryRecorder';
import { TextToSpeech } from '../components/TextToSpeech'; // <--- IMPORT THIS

// MODELS (Keep existing imports)
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

// MAKERS (Keep existing imports)
// @ts-ignore
import ChannapatnaMaker from '../components/ui/AR/ChannapatnaMaker';
// @ts-ignore
import BluePotteryMaker from '../components/ui/AR/BluePotteryMaker';
// @ts-ignore
import WarliMaker from '../components/ui/AR/WarliMaker';
// @ts-ignore
import KolamMaker from '../components/ui/AR/KolamMaker';
// @ts-ignore
import MadhubaniMaker from '../components/ui/AR/MadhubaniMaker';

const Result = () => {
  const { id } = useParams();
  const [activeModel, setActiveModel] = useState<React.ReactNode>(null);
  const [activeMaker, setActiveMaker] = useState<React.ReactNode>(null);
  
  const [info, setInfo] = useState({ 
      title: "Loading...", 
      location: "", 
      desc: "" 
  });

  useEffect(() => {
    switch(id) {
        case 'channapatna': setActiveModel(<ChannapatnaToy />); setActiveMaker(<ChannapatnaMaker />); break;
        case 'blue-pottery': setActiveModel(<BluePottery />); setActiveMaker(<BluePotteryMaker />); break;
        case 'warli': setActiveModel(<WarliArt />); setActiveMaker(<WarliMaker />); break;
        case 'kolam': setActiveModel(<KolamArt />); setActiveMaker(<KolamMaker />); break;
        case 'madhubani': setActiveModel(<MadhubaniArt />); setActiveMaker(<MadhubaniMaker />); break;
        default: setActiveModel(null); setActiveMaker(null);
    }

    if (id && CRAFT_DATA[id]) {
        setInfo(CRAFT_DATA[id]);
    } else {
        setInfo({ title: "Unknown Artifact", location: "Unknown", desc: "No description available." });
    }

  }, [id]);

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden transition-colors duration-500 font-sans">
      {/* Header */}
      <div className="p-4 flex items-center gap-4 bg-background/80 border-b border-border z-20 shrink-0 backdrop-blur-sm">
        <Link to="/" className="p-2 bg-muted rounded-full text-foreground hover:bg-muted/80 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          {/* ID ADDED FOR TTS */}
          <h1 id="tts-title" className="text-foreground font-bold text-lg font-serif">{info.title}</h1>
          <p className="text-primary text-xs uppercase tracking-wider">{info.location}</p>
        </div>
        
        {/* 🔊 TTS BUTTON IN HEADER */}
        <TextToSpeech />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        
        {/* 3D ARTIFACT */}
        <div className="h-[60vh] w-full relative bg-gradient-to-b from-background to-black/90 border-b border-border">
           <Suspense fallback={
              <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground z-50">
                  <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Loading 3D Asset...</p>
              </div>
           }>
              <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 45 }}>
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                  <Environment preset="city" />
                  <Stage intensity={0.5} environment="city" adjustCamera={false}>
                      <Center>{activeModel}</Center>
                  </Stage>
                  <OrbitControls autoRotate enableZoom={true} />
              </Canvas>
           </Suspense>
           <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/70 border border-white/10 pointer-events-none">
              Interact with Model
           </div>
        </div>

        {/* INFO & RECORDER */}
        <div className="p-6 bg-background border-b border-border">
          <div className="flex justify-between items-center mb-2">
             <h3 className="text-foreground font-bold text-xl font-serif">About this Craft</h3>
          </div>
          
          {/* ID ADDED FOR TTS */}
          <p id="tts-desc" className="text-muted-foreground text-sm leading-7 font-sans mb-6 text-justify">
            {info.desc}
          </p>
          
          <OralHistoryRecorder artId={id || "general"} />
        </div>

        {/* PROCESS MAKER */}
        {activeMaker && (
          <div className="w-full">
            <div className="p-4 bg-background flex items-center gap-2 border-b border-border">
                <div className="bg-green-500/20 p-2 rounded-full">
                    <Hammer className="w-4 h-4 text-green-500" />
                </div>
                <h3 className="text-foreground font-bold font-serif">Interactive Process Simulation</h3>
            </div>
            <div className="h-[600px] w-full relative">
                {activeMaker}
            </div>
          </div>
        )}
        
        <div className="p-8 bg-background text-center">
            <Link to="/archive" className="text-muted-foreground text-xs hover:text-primary transition-colors uppercase tracking-widest">
                View All Artifacts in Archive
            </Link>
        </div>

      </div>
    </div>
  );
};

export default Result;