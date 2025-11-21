
import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stage, OrbitControls } from '@react-three/drei';

// --- HELPERS (Same as before) ---
const Eye = ({ position, scale = 1 }) => (<group position={position} scale={scale}><mesh scale={[1.2, 0.8, 0.5]}><sphereGeometry args={[0.08, 32, 32]} /><meshStandardMaterial color="white" /></mesh><mesh position={[0, 0, 0.035]} scale={[0.5, 0.5, 0.2]}><sphereGeometry args={[0.08, 32, 32]} /><meshStandardMaterial color="black" /></mesh></group>);
const Moustache = ({ position }) => (<group position={position}><mesh position={[-0.12, -0.02, 0]} rotation={[0, 0, 0.4]}><capsuleGeometry args={[0.03, 0.25, 4, 16]} /><meshStandardMaterial color="black" /></mesh><mesh position={[0.12, -0.02, 0]} rotation={[0, 0, -0.4]}><capsuleGeometry args={[0.03, 0.25, 4, 16]} /><meshStandardMaterial color="black" /></mesh></group>);
const Eyebrow = ({ position, rotation }) => (<mesh position={position} rotation={rotation}><torusGeometry args={[0.12, 0.015, 16, 32, 2]} /><meshStandardMaterial color="black" /></mesh>);
const Smile = ({ position }) => (<mesh position={position} rotation={[0, 0, 3.14]}><torusGeometry args={[0.15, 0.015, 16, 32, 2.2]} /><meshStandardMaterial color="#8B0000" /></mesh>);

const MalleableDoll = ({ isPainted, isPolished }) => {
  const woodColor = "#E3C099";
  const getMat = (color) => (!isPainted ? { color: woodColor, roughness: 0.9 } : { color, roughness: isPolished ? 0.1 : 0.8, metalness: isPolished ? 0.2 : 0, envMapIntensity: isPolished ? 1.5 : 0 });
  return (
    <group scale={0.9}>
       <mesh position={[0, 0.2, 0]}> <cylinderGeometry args={[0.7, 0.7, 0.4, 32]} /> <meshStandardMaterial {...getMat("#F2A900")} /> </mesh>
       <mesh position={[0, 1.2, 0]}> <cylinderGeometry args={[0.35, 0.4, 1.8, 32]} /> <meshStandardMaterial {...getMat("#FFFFFF")} /> </mesh>
       <group position={[0, 2.6, 0]}>
           <mesh> <cylinderGeometry args={[0.6, 0.5, 1.4, 32]} /> <meshStandardMaterial {...getMat("#1a1a1a")} /> </mesh>
           {isPainted && <mesh position={[0, 0, 0.51]} scale={[0.05, 1.4, 0.02]}> <boxGeometry /> <meshStandardMaterial {...getMat("#FFD700")} /> </mesh>}
       </group>
       <mesh position={[0, 2.0, 0]} rotation={[Math.PI/2, 0, 0]}> <torusGeometry args={[0.52, 0.1, 16, 32]} /> <meshStandardMaterial {...getMat("#D9381E")} /> </mesh>
       <mesh position={[0, 3.8, 0]}> <sphereGeometry args={[0.55, 32, 32]} /> <meshStandardMaterial {...getMat("#F5D0C5")} /> </mesh>
       {isPainted && <group position={[0, 3.8, 0.48]}>
           <Eye position={[-0.18, 0.1, 0]} /> <Eye position={[0.18, 0.1, 0]} />
           <Eyebrow position={[-0.18, 0.22, 0]} rotation={[0, 0, 0.2]} /> <Eyebrow position={[0.18, 0.22, 0]} rotation={[0, 0, -0.2]} />
           <Moustache position={[0, -0.15, 0]} /> <Smile position={[0, -0.12, 0]} />
       </group>}
       <group position={[0, 4.3, 0]}>
           <mesh> <cylinderGeometry args={[0.6, 0.5, 0.3, 32]} /> <meshStandardMaterial {...getMat("#FFFFFF")} /> </mesh>
           <mesh position={[0, 0.1, 0]}> <torusGeometry args={[0.6, 0.05, 16, 32]} rotation={[Math.PI/2, 0, 0]} /> <meshStandardMaterial {...getMat("#F2A900")} /> </mesh>
       </group>
    </group>
  );
};

const MakerScene = ({ step }) => {
  const groupRef = useRef();
  useFrame((state, delta) => { if (groupRef.current) groupRef.current.rotation.y += delta * (step < 3 ? 12 : 0.8); });
  
  return (
    // FIX: Position Y = -1 (Moves it DOWN into view)
    // FIX: Scale = 1.4 (Nice and big)
    <group position={[0, -1, 0]} scale={1.4}>
        <group ref={groupRef}>
          {step === 0 && <mesh position={[0, 1.5, 0]}><cylinderGeometry args={[0.6, 0.6, 4, 32]} /><meshStandardMaterial color="#E3C099" roughness={0.9} /></mesh>}
          {step === 1 && <MalleableDoll isPainted={false} isPolished={false} />}
          {step === 2 && <MalleableDoll isPainted={true} isPolished={false} />}
          {step === 3 && <MalleableDoll isPainted={true} isPolished={true} />}
        </group>
    </group>
  );
};

const ChannapatnaMaker = () => {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "1. Raw Wood", desc: "Sourced from Wrightia Tinctoria tree." },
    { label: "2. Turning", desc: "Wood is shaped on a high-speed lathe." },
    { label: "3. Lacquering", desc: "Natural vegetable dyes are applied." },
    { label: "4. Polishing", desc: "Buffed to a glossy glass-like finish." }
  ];

  return (
    <div className="flex flex-col h-full w-full bg-stone-950">
      
      {/* 3D View - 70% Height (More space for model) */}
      <div className="h-[70%] w-full bg-gradient-to-b from-stone-800 to-black relative">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 40 }}>
          <Stage intensity={0.6} environment="city" adjustCamera={true}>
             <MakerScene step={step} />
          </Stage>
          <OrbitControls enableZoom={true} />
        </Canvas>
      </div>

      {/* UI View - 30% Height (Compact & High Contrast) */}
      <div className="h-[30%] w-full bg-stone-900 border-t border-stone-700 flex flex-col items-center justify-center p-4 text-center relative z-10">
          
          <h3 className="text-white font-bold text-2xl mb-1 tracking-wide">{steps[step].label}</h3>
          <p className="text-white text-sm mb-4 max-w-lg leading-relaxed">{steps[step].desc}</p>
          
          <div className="flex gap-4 w-full max-w-md">
             {/* FIX: White Button for Restart */}
             <button 
               onClick={() => setStep(0)} 
               className="px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-200 transition-all"
             >
               Restart
             </button>

             {/* FIX: Bright Yellow Button for Next */}
             <button 
               onClick={() => step < 3 && setStep(step + 1)} 
               disabled={step === 3} 
               className={`flex-1 py-3 rounded-xl text-sm font-bold border border-white text-white shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all hover:scale-105 active:scale-95 
                 ${step === 3 ? 'bg-green-500 cursor-default text-white' : 'bg-yellow-500 hover:bg-yellow-400'}`}
             >
               {step === 3 ? "Process Complete" : "Next Step →"}
             </button>
          </div>
      </div>
    </div>
  );
};
export default ChannapatnaMaker;