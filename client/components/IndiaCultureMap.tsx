import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Trophy, RefreshCcw } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import { getArchiveItems } from '../lib/archiveStore';

const INDIA_GEO_JSON = "https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson";

const BASE_STATE_DATA: any = {
  "Karnataka": { route: "/result/channapatna", title: "Channapatna Toys", desc: "The Land of Toys", img: "/channapatna_nobg.png" },
  "Rajasthan": { route: "/result/blue-pottery", title: "Blue Pottery", desc: "Jaipur's Turko-Persian Art", img: "/assets/blue_pottery_preview.jpg" },
  "Maharashtra": { route: "/result/warli", title: "Warli Art", desc: "Ancient Tribal Paintings", img: "/warli.jpg" },
  "Tamil Nadu": { route: "/result/kolam", title: "Kolam", desc: "Geometric Floor Art", img: "/kolam.png" },
  "Bihar": { route: "/result/madhubani", title: "Madhubani Art", desc: "Mithila Folk Art", img: "/madhubani.jpg" }
};

const IndiaCultureMap = () => {
  const navigate = useNavigate();
  const [hoveredData, setHoveredData] = useState<any>(null);
  const [visitedStates, setVisitedStates] = useState<string[]>([]);
  const [mapData, setMapData] = useState(BASE_STATE_DATA);

  useEffect(() => {
    const saved = localStorage.getItem('culture_passport_v1');
    if (saved) setVisitedStates(JSON.parse(saved));

    const userItems = getArchiveItems();
    const newData = { ...BASE_STATE_DATA };

    userItems.forEach(item => {
        if (item.location) {
            const stateName = Object.keys(BASE_STATE_DATA).find(state => 
                item.location.toLowerCase().includes(state.toLowerCase())
            ) || item.location; 

            if (!newData[stateName]) {
                newData[stateName] = {
                    route: "/archive",
                    title: item.title,
                    desc: "Community Discovery",
                    img: item.imageSrc
                };
            }
        }
    });
    setMapData(newData);
  }, []);

  const handleStateClick = (stateName: string, route: string) => {
    if (!visitedStates.includes(stateName)) {
      const updated = [...visitedStates, stateName];
      setVisitedStates(updated);
      localStorage.setItem('culture_passport_v1', JSON.stringify(updated));
    }
    navigate(route);
  };

  const resetProgress = () => { localStorage.removeItem('culture_passport_v1'); setVisitedStates([]); };
  const totalArtifacts = 5;
  const collectedArtifacts = visitedStates.length;
  const progressPercentage = Math.min(100, (collectedArtifacts / 5) * 100);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex flex-col items-center">
      <div className="w-full flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div><h2 className="text-3xl font-bold text-foreground font-serif">Cultural Passport</h2><p className="text-muted-foreground text-sm">Travel across India to unlock artifacts.</p></div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex items-center gap-4 w-full md:w-auto min-w-[300px]">
            <div className={`p-3 rounded-full ${collectedArtifacts >= 5 ? 'bg-yellow-500/20' : 'bg-muted'}`}><Trophy size={24} className={collectedArtifacts >= 5 ? 'text-yellow-500' : 'text-muted-foreground'} /></div>
            <div className="flex-1"><div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1 text-foreground"><span>Collection Progress</span><span>{collectedArtifacts} / 5</span></div><div className="w-full h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div></div></div>
            {collectedArtifacts > 0 && <button onClick={resetProgress} className="text-muted-foreground hover:text-destructive"><RefreshCcw size={16} /></button>}
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row w-full gap-8 items-center justify-center">
        <div className="w-full md:w-2/3 h-[500px] relative bg-card rounded-xl border border-border overflow-hidden shadow-2xl">
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 1000, center: [78.9629, 22.5937] }} className="w-full h-full">
            <Geographies geography={INDIA_GEO_JSON}>{({ geographies }) => geographies.map((geo) => {
                    const stateName = geo.properties.NAME_1 || geo.properties.name; 
                    const isActive = mapData[stateName];
                    const isVisited = visitedStates.includes(stateName);
                    return (<Geography key={geo.rsmKey} geography={geo} onMouseEnter={() => { if (isActive) setHoveredData({ ...isActive, state: stateName, isVisited }); }} onMouseLeave={() => { setHoveredData(null); }} onClick={() => { if (isActive) handleStateClick(stateName, isActive.route); }} style={{ default: { fill: isActive ? (isVisited ? "#10b981" : "#f59e0b") : "rgba(128,128,128,0.1)", stroke: "rgba(128,128,128,0.4)", strokeWidth: 0.5, outline: "none", transition: "all 0.3s ease" }, hover: { fill: isActive ? (isVisited ? "#34d399" : "#fbbf24") : "rgba(128,128,128,0.3)", stroke: "#fff", strokeWidth: 1.5, outline: "none", cursor: isActive ? "pointer" : "default" }, pressed: { fill: "#d97706", outline: "none" } }} data-tooltip-id="map-tooltip" data-tooltip-content={isActive ? stateName : ""} />);
                })}</Geographies></ComposableMap>
            <Tooltip id="map-tooltip" style={{ backgroundColor: "#000", fontSize: "12px" }} />
        </div>
        <div className="hidden md:block w-1/3 h-[500px] flex items-center justify-center">
            {hoveredData ? (<div className="w-full bg-card rounded-2xl p-4 shadow-2xl border border-border animate-in slide-in-from-left-4 fade-in duration-300"><div className="relative h-48 w-full rounded-xl overflow-hidden mb-4 bg-muted"><img src={hoveredData.img} alt={hoveredData.title} className={`w-full h-full object-cover`} /><div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1"><MapPin size={10} /> {hoveredData.state}</div></div><h3 className="text-xl font-bold text-foreground mb-1">{hoveredData.title}</h3><p className="text-sm text-muted-foreground mb-4 line-clamp-2">{hoveredData.desc}</p></div>) : (<div className="text-center text-muted-foreground"><p>Hover over a highlighted state.</p></div>)}
        </div>
      </div>
    </div>
  );
};

export default IndiaCultureMap;