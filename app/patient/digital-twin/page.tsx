'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePatientByIdQuery } from '../../../hooks/use-patients';
import { DigitalTwin3D } from '../../../components/visualizers/DigitalTwin3D';
import { Card, CardContent } from '../../../components/ui/card';
import { RefreshCw, Play, Pause, Maximize, RotateCcw, ChevronRight, CheckCircle2, Siren, ShieldAlert } from 'lucide-react';

interface OrganMetric {
  label: string;
  value: string;
}

interface OrganDetails {
  id: string;
  name: string;
  latin: string;
  color: string;
  desc: string;
  metrics: OrganMetric[];
  pulse: number;
  viability: number;
  perf: string;
  ox: string;
  stat: string;
  note: string;
}

const ORGANS: OrganDetails[] = [
  { 
    id: 'brain', 
    name: 'Brain', 
    latin: 'CEREBRUM · ENCEPHALON', 
    color: '#ffaec6',
    desc: 'The command center of the nervous system — orchestrating cognition, sensation, and motor control across 86 billion neurons and 100 trillion synapses.',
    metrics: [
      { label: 'Neurons', value: '86 B' },
      { label: 'Synapses', value: '100 T' },
      { label: 'Power', value: '20 W' },
      { label: 'Mass', value: '1.4 kg' }
    ],
    pulse: 0.8, 
    viability: 98.2, 
    perf: 'OPTIMAL', 
    ox: '99%', 
    stat: 'NOMINAL',
    note: 'No anomalies detected. Cortical thickness within 0.3σ of baseline. Gray matter density stable across hemispheres.' 
  },
  { 
    id: 'heart', 
    name: 'Heart', 
    latin: 'COR · CARDIAC MUSCLE', 
    color: '#ff5566',
    desc: 'A four-chambered muscular pump contracting 100,000 times daily, moving 7,000 liters of blood through 100,000 km of vessels.',
    metrics: [
      { label: 'Resting HR', value: '72 bpm' },
      { label: 'Cardiac out', value: '5 L/min' },
      { label: 'Chambers', value: '4' },
      { label: 'Mass', value: '300 g' }
    ],
    pulse: 1.2, 
    viability: 96.8, 
    perf: 'STRONG', 
    ox: '97%', 
    stat: 'NOMINAL',
    note: 'Sinus rhythm regular. Ejection fraction 62%. No valvular regurgitation observed on this scan.' 
  },
  { 
    id: 'lungs', 
    name: 'Lungs', 
    latin: 'PULMONES · RESPIRATORY', 
    color: '#ffb8c8',
    desc: 'Paired respiratory organs mediating gas exchange across 480 million alveoli — a total surface area roughly the size of a tennis court.',
    metrics: [
      { label: 'Alveoli', value: '480 M' },
      { label: 'Surface', value: '70 m²' },
      { label: 'Breaths', value: '12 /min' },
      { label: 'Tidal V', value: '500 mL' }
    ],
    pulse: 0.45, 
    viability: 97.4, 
    perf: 'OPTIMAL', 
    ox: '98%', 
    stat: 'NOMINAL',
    note: 'Bilateral ventilation symmetric. No nodules or consolidations. Diffusion capacity within normal limits.' 
  },
  { 
    id: 'liver', 
    name: 'Liver', 
    latin: 'HEPAR · METABOLIC', 
    color: '#9b4a3a',
    desc: 'The metabolic powerhouse — filtering blood, synthesizing plasma proteins, and storing glycogen across more than 500 distinct functions.',
    metrics: [
      { label: 'Functions', value: '500+' },
      { label: 'Blood flow', value: '1.5 L/min' },
      { label: 'Lobules', value: '100 k' },
      { label: 'Mass', value: '1.5 kg' }
    ],
    pulse: 0.35, 
    viability: 95.9, 
    perf: 'OPTIMAL', 
    ox: '96%', 
    stat: 'NOMINAL',
    note: 'Parenchyma homogeneous. No steatosis. Portal vein patent. Regenerative capacity 70% — unique among viscera.' 
  },
  { 
    id: 'stomach', 
    name: 'Stomach', 
    latin: 'GASTER · DIGESTIVE', 
    color: '#ffc0a0',
    desc: 'A muscular J-shaped reservoir secreting hydrochloric acid and pepsin, reducing food to chyme over a 4-hour residence.',
    metrics: [
      { label: 'pH', value: '1.5–3.5' },
      { label: 'Acid', value: '2 L/day' },
      { label: 'Emptying', value: '4 hr' },
      { label: 'Capacity', value: '1 L' }
    ],
    pulse: 0.3, 
    viability: 97.1, 
    perf: 'GOOD', 
    ox: '95%', 
    stat: 'NOMINAL',
    note: 'Mucosal lining intact. No ulceration. Peristalsis visible during real-time acquisition.' 
  },
  { 
    id: 'kidneys', 
    name: 'Kidneys', 
    latin: 'RENES · RENAL', 
    color: '#a04a4a',
    desc: 'Paired retroperitoneal filters regulating fluid balance, electrolytes, and waste — each containing one million nephrons.',
    metrics: [
      { label: 'Nephrons', value: '1 M ea' },
      { label: 'Filtrate', value: '180 L/d' },
      { label: 'Urine', value: '1.5 L/d' },
      { label: 'GFR', value: '125 mL/min' }
    ],
    pulse: 0.6, 
    viability: 96.5, 
    perf: 'OPTIMAL', 
    ox: '96%', 
    stat: 'NOMINAL',
    note: 'Cortical medullary differentiation preserved. No calculi. Renal cortex 1.2 cm — within reference range.' 
  },
  { 
    id: 'intestines', 
    name: 'Intestines', 
    latin: 'INTESTINUM · GI TRACT', 
    color: '#ffd0a8',
    desc: 'A seven-meter coiled tract absorbing nutrients and water, hosting 100 trillion symbiotic microbes — your gut microbiome.',
    metrics: [
      { label: 'Length', value: '7 m' },
      { label: 'Microbes', value: '100 T' },
      { label: 'Absorption', value: '95%' },
      { label: 'Transit', value: '24–72 hr' }
    ],
    pulse: 0.4, 
    viability: 97.7, 
    perf: 'GOOD', 
    ox: '94%', 
    stat: 'NOMINAL',
    note: 'Mucosal folds regular. No inflammatory changes. Microbiome diversity index 4.2 — above population median.' 
  }
];

// Interactive running ECG Canvas component
const VitalWaveCanvas: React.FC<{ pulse: number }> = ({ pulse }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 2);
      canvas.height = rect.height * (window.devicePixelRatio || 2);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw subtle horizontal grid lines
      ctx.strokeStyle = 'rgba(78, 54, 41, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const y = (h / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw ECG wave
      timeRef.current += 0.016 * pulse * 3.5;
      ctx.beginPath();
      ctx.lineWidth = 2.5 * (window.devicePixelRatio || 2);
      ctx.strokeStyle = '#C7A37E';
      ctx.shadowColor = 'rgba(199, 163, 126, 0.35)';
      ctx.shadowBlur = 6;

      for (let x = 0; x < w; x++) {
        const percent = x / w;
        const phase = percent * Math.PI * 4.5 + timeRef.current;
        let y = Math.sin(phase) * 0.22;

        // Simulate clinical heartbeat spike sequence
        const spikePhase = (percent * 2.2 + timeRef.current * 0.4) % 1;
        if (spikePhase < 0.05) {
          y += Math.sin((spikePhase / 0.05) * Math.PI) * 0.85;
        } else if (spikePhase > 0.07 && spikePhase < 0.11) {
          y -= Math.sin(((spikePhase - 0.07) / 0.04) * Math.PI) * 0.35;
        }

        const py = h * 0.5 - y * h * 0.38;
        if (x === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [pulse]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

export default function DigitalTwinPage() {
  const patientId = 'PAT-001';
  const { data: patient } = usePatientByIdQuery(patientId);

  // States matching the controls in the Anatomica sketch
  const [selectedOrganId, setSelectedOrganId] = useState<string>('brain');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [wireVisible, setWireVisible] = useState<boolean>(true);
  const [explode, setExplode] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);

  // Simulate continuous live FPS fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.floor(58 + Math.random() * 4));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const activeOrgan = ORGANS.find(o => o.id === selectedOrganId) || ORGANS[0];

  const headerStyle = {
    fontFamily: "'Clash Display', Inter, sans-serif",
    fontWeight: 700
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#FAF8F5] text-[#4E3629] relative select-none">
      
      {/* Subtle Grid Background matching the "Anatomica" grid layout */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(78, 54, 41, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(78, 54, 41, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* HEADER HUD BAR */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#4E3629]/10 shrink-0 z-20 bg-white/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center border border-[#4E3629]/15 bg-white/80 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#C7A37E]" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3c-3 4-3 7 0 9 3-2 3-5 0-9Z"/>
              <path d="M12 21c-3-4-3-7 0-9 3 2 3 5 0 9Z"/>
              <circle cx="12" cy="12" r="9" strokeOpacity="0.4"/>
            </svg>
          </div>
          <div className="text-left">
            <div className="text-sm font-extrabold tracking-tight uppercase leading-none" style={headerStyle}>ANATOMICA</div>
            <div className="font-mono text-[9px] text-[#4E3629]/50 mt-1 tracking-widest font-bold">DIGITAL TWIN · v2.4</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 font-mono text-[10px] font-bold text-[#4E3629]/60">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C7A37E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C7A37E]" />
            </span>
            <span>LIVE SIMULATION</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#4E3629]/40">RENDER:</span>
            <span className="text-[#4E3629]">{fps} fps</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#4E3629]/40">SUBJECT:</span>
            <span className="text-[#4E3629]">PAT-001 / 65y / ♀</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3.5 py-1.5 border border-[#4E3629]/15 hover:border-[#4E3629]/30 rounded-lg text-[10px] font-mono font-bold tracking-wider bg-white/70 hover:bg-white transition-all cursor-pointer">EXPORT</button>
        </div>
      </header>

      {/* MAIN VIEWPORT SPLIT */}
      <main className="flex-1 flex relative min-h-0">

        {/* 3D VIEWPORT SECTION */}
        <section className="relative flex-1 min-w-0 bg-white/30">
          <DigitalTwin3D 
            heartRate={patient?.heartRate || 72} 
            riskCategory={patient?.riskCategory || 'low'} 
            selectedOrgan={selectedOrganId}
            setSelectedOrgan={setSelectedOrganId}
            autoRotate={autoRotate}
            wireVisible={wireVisible}
            explode={explode}
          />

          {/* Corner brackets overlay */}
          <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-[#C7A37E]/40 pointer-events-none" />
          <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-[#C7A37E]/40 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-[#C7A37E]/40 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-[#C7A37E]/40 pointer-events-none" />

          {/* Scanline grid overlay */}
          <div className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C7A37E]/40 to-transparent top-0 animate-[bounce_6s_infinite] pointer-events-none opacity-40" />

          {/* Top-Left HUD box */}
          <div className="absolute top-5 left-5 bg-white/85 backdrop-blur-md rounded-lg px-3 py-2 border border-[#4E3629]/10 font-mono text-[9px] font-bold tracking-wider text-[#4E3629]/60 z-10 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[#4E3629]/40">VIEW</span>
              <span className="text-[#4E3629]">SAGITTAL · 3D</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[#4E3629]/40">SCAN</span>
              <span className="text-emerald-600">ACTIVE</span>
            </div>
          </div>

          {/* Top-Right HUD Controls buttons column */}
          <div className="absolute top-5 right-5 flex flex-col gap-2 z-10">
            <button 
              onClick={() => setAutoRotate(!autoRotate)}
              className={`w-10 h-10 flex items-center justify-center border rounded-xl transition-all cursor-pointer shadow-sm ${
                autoRotate 
                  ? 'bg-[#4E3629] text-[#FAF8F5] border-[#4E3629]' 
                  : 'bg-white/80 border-[#4E3629]/15 hover:border-[#4E3629]/30 text-[#4E3629] hover:bg-white'
              }`}
              title="Auto-rotate"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M21 12a9 9 0 1 1-3-6.7"/>
                <path d="M21 4v5h-5"/>
              </svg>
            </button>

            <button 
              onClick={() => {
                setSelectedOrganId('brain');
                setAutoRotate(true);
                setWireVisible(true);
                setExplode(false);
              }}
              className="w-10 h-10 flex items-center justify-center border border-[#4E3629]/15 hover:border-[#4E3629]/30 rounded-xl bg-white/80 hover:bg-white text-[#4E3629] transition-all cursor-pointer shadow-sm"
              title="Reset View"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M3 12h18M12 3v18" stroke-opacity="0.4"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>

            <button 
              onClick={() => setWireVisible(!wireVisible)}
              className={`w-10 h-10 flex items-center justify-center border rounded-xl transition-all cursor-pointer shadow-sm ${
                wireVisible 
                  ? 'bg-[#4E3629] text-[#FAF8F5] border-[#4E3629]' 
                  : 'bg-white/80 border-[#4E3629]/15 hover:border-[#4E3629]/30 text-[#4E3629] hover:bg-white'
              }`}
              title="Toggle Shell Outline"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M3 7l9-4 9 4-9 4-9-4Z"/>
                <path d="M3 12l9 4 9-4M3 17l9 4 9-4"/>
              </svg>
            </button>

            <button 
              onClick={() => setExplode(!explode)}
              className={`w-10 h-10 flex items-center justify-center border rounded-xl transition-all cursor-pointer shadow-sm ${
                explode 
                  ? 'bg-[#4E3629] text-[#FAF8F5] border-[#4E3629]' 
                  : 'bg-white/80 border-[#4E3629]/15 hover:border-[#4E3629]/30 text-[#4E3629] hover:bg-white'
              }`}
              title="Explode Organs"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 12l8-4M12 12l8 4M12 12l-8 4M12 12l-8-4"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </button>
          </div>

          {/* Bottom Hint */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold tracking-[0.2em] text-[#4E3629]/45 z-10 select-none">
            DRAG TO ORBIT · SCROLL TO ZOOM · CLICK ORGAN TO INSPECT
          </div>
        </section>

        {/* INFO INSPECTOR SIDE PANEL */}
        <aside className="w-[380px] shrink-0 bg-white/70 backdrop-blur-md border-l border-[#4E3629]/10 flex flex-col z-10 text-left">
          
          <div className="p-6 border-b border-[#4E3629]/10">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] tracking-[0.25em] text-[#C7A37E] font-bold uppercase">ORGAN INSPECTOR</span>
              <span className="font-mono text-[9px] text-[#4E3629]/45 font-bold">
                {String(ORGANS.findIndex(x => x.id === activeOrgan.id) + 1).padStart(2, '0')} / 07
              </span>
            </div>
            <div className="text-2xl font-bold tracking-tight mt-3 text-[#4E3629]" style={headerStyle}>
              {activeOrgan.name}
            </div>
            <div className="font-mono text-[10px] text-[#4E3629]/50 mt-1.5 tracking-wider font-bold">
              {activeOrgan.latin}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            <p className="text-[13px] leading-relaxed text-[#4E3629]/80 font-medium">
              {activeOrgan.desc}
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2">
              {activeOrgan.metrics.map((m) => (
                <div key={m.label} className="border border-[#4E3629]/8 bg-white/45 rounded-lg px-3 py-2.5">
                  <div className="font-mono text-[9px] font-bold tracking-[0.15em] text-[#4E3629]/45">{m.label.toUpperCase()}</div>
                  <div className="text-[14px] font-bold mt-1 text-[#4E3629]">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Vital Wave Graph */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-[#4E3629]/50">
                <span className="font-mono tracking-[0.2em] uppercase">VITAL SIGNAL</span>
                <span className="font-mono text-[#C7A37E]">{activeOrgan.pulse.toFixed(2)} Hz</span>
              </div>
              <div className="relative h-24 rounded-lg overflow-hidden border border-[#4E3629]/10 bg-white/50">
                <VitalWaveCanvas pulse={activeOrgan.pulse} />
                <div className="absolute top-2 left-2 font-mono text-[8px] font-bold text-[#4E3629]/40 tracking-wider">CH-01</div>
                <div className="absolute bottom-2 right-2 font-mono text-[8px] font-bold text-[#4E3629]/40 tracking-wider">REAL-TIME</div>
              </div>
            </div>

            {/* Tissue Viability Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-[#4E3629]/50">
                <span className="font-mono tracking-[0.2em] uppercase">TISSUE VIABILITY</span>
                <span className="font-mono text-[#C7A37E]">{activeOrgan.viability.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#4E3629]/5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#C7A37E] to-[#9BA88D]"
                  style={{ width: `${activeOrgan.viability}%` }}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-3 font-mono text-[9px] font-bold">
                <div className="border border-[#4E3629]/8 bg-white/45 rounded px-2 py-1.5">
                  <div className="text-[#4E3629]/45">PERFUSION</div>
                  <div className="text-[#4E3629] mt-0.5">{activeOrgan.perf}</div>
                </div>
                <div className="border border-[#4E3629]/8 bg-white/45 rounded px-2 py-1.5">
                  <div className="text-[#4E3629]/45">OXYGEN</div>
                  <div className="text-[#4E3629] mt-0.5">{activeOrgan.ox}</div>
                </div>
                <div className="border border-[#4E3629]/8 bg-white/45 rounded px-2 py-1.5">
                  <div className="text-[#4E3629]/45">STATUS</div>
                  <div className="text-emerald-600 mt-0.5">{activeOrgan.stat}</div>
                </div>
              </div>
            </div>

            {/* Clinical Note memo */}
            <div className="border border-[#4E3629]/8 bg-white/45 rounded-lg p-4">
              <div className="font-mono text-[9px] font-bold tracking-[0.2em] text-[#4E3629]/45 mb-2 uppercase">CLINICAL NOTE</div>
              <p className="text-[11.5px] leading-relaxed text-[#4E3629]/80 font-medium">
                {activeOrgan.note}
              </p>
            </div>

          </div>

          <div className="p-4 border-t border-[#4E3629]/10 bg-white/30">
            <button className="w-full bg-[#4E3629] hover:bg-[#644736] text-[#FAF8F5] rounded-lg py-2.5 text-[11px] font-mono font-bold tracking-wider transition-all cursor-pointer">
              PIN TO REPORT
            </button>
          </div>
        </aside>
      </main>

      {/* FOOTER ORGAN STRIP NAVIGATION */}
      <nav className="border-t border-[#4E3629]/10 px-6 py-3 bg-white/40 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {ORGANS.map((o) => {
            const isActive = selectedOrganId === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setSelectedOrganId(o.id)}
                className={`flex items-center gap-2.5 rounded-lg px-4 py-2 border transition-all cursor-pointer shrink-0 ${
                  isActive 
                    ? 'bg-[#4E3629] border-[#4E3629] text-[#FAF8F5] shadow-sm font-bold' 
                    : 'bg-white/60 hover:bg-white border-[#4E3629]/10 text-[#4E3629] hover:border-[#4E3629]/30'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: o.color }} />
                <span className="text-[11px] font-bold tracking-tight">{o.name}</span>
                <span className="font-mono text-[8px] tracking-wider text-[#4E3629]/40 group-hover:text-[#4E3629]/60">
                  {o.metrics[0].label.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
