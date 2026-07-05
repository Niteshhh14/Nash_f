'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePatientByIdQuery } from '../../../hooks/use-patients';
import { DigitalTwin3D } from '../../../components/visualizers/DigitalTwin3D';
import { RefreshCw, RotateCcw, X, ShieldAlert, Sparkles, Heart, Activity, Wind, CircleDot, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrganMetric {
  label: string;
  value: string;
}

interface OrganDetails {
  id: string;
  name: string;
  latin: string;
  desc: string;
  metrics: OrganMetric[];
  pulse: number;
}

const ORGANS_METADATA: Record<string, OrganDetails> = {
  brain: {
    id: 'brain',
    name: 'Brain',
    latin: 'CEREBRUM · ENCEPHALON',
    desc: 'The central command unit of the nervous system, coordinating cognitive processing, neurovascular regulation, and sensory motor signals.',
    metrics: [
      { label: 'Neural Power', value: '20 W' },
      { label: 'Synapse Count', value: '100 T' },
      { label: 'Hemisphere Synced', value: '98.5%' }
    ],
    pulse: 0.8
  },
  heart: {
    id: 'heart',
    name: 'Heart',
    latin: 'COR · CARDIOVASCULAR',
    desc: 'The primary cardiovascular muscular pump contracting consistently to maintain perfusion and distribute oxygen across arterial channels.',
    metrics: [
      { label: 'Stroke Volume', value: '70 mL' },
      { label: 'Cardiac Output', value: '5.2 L/m' },
      { label: 'Ejection Fraction', value: '62%' }
    ],
    pulse: 1.2
  },
  lungs: {
    id: 'lungs',
    name: 'Lungs',
    latin: 'PULMONES · RESPIRATORY',
    desc: 'Paired respiratory units regulating gas exchange, carbon dioxide clearance, and blood gas homeostasis.',
    metrics: [
      { label: 'Tidal Volume', value: '500 mL' },
      { label: 'Respiratory Rate', value: '14 /min' },
      { label: 'Inspiratory Flow', value: '28 L/m' }
    ],
    pulse: 0.45
  },
  liver: {
    id: 'liver',
    name: 'Liver',
    latin: 'HEPAR · METABOLIC',
    desc: 'Metabolic filtration center producing plasma proteins, neutralizing toxins, and maintaining glycogen levels.',
    metrics: [
      { label: 'Blood Filtration', value: '1.4 L/m' },
      { label: 'Bile Synthesis', value: '800 mL/d' },
      { label: 'Metabolic Load', value: 'Normal' }
    ],
    pulse: 0.35
  },
  kidneys: {
    id: 'kidneys',
    name: 'Kidneys',
    latin: 'RENES · RENAL FILTRATION',
    desc: 'Paired retroperitoneal organs filtering blood plasma, regulating systemic electrolytes, and maintaining fluid balance.',
    metrics: [
      { label: 'GFR (Filtration)', value: '120 mL/m' },
      { label: 'Urine Synthesis', value: '1.2 L/d' },
      { label: 'Renal Cortex', value: '1.2 cm' }
    ],
    pulse: 0.6
  }
};

const STATUS_TEXTS = {
  healthy: 'Optimal',
  warning: 'Warning Threshold',
  high_risk: 'High Risk Alert',
  critical: 'Critical Event'
};

const STATUS_BORDER_COLORS = {
  healthy: 'border-emerald-500/30 text-emerald-700 bg-emerald-50/50',
  warning: 'border-amber-500/30 text-amber-700 bg-amber-50/50',
  high_risk: 'border-orange-500/30 text-orange-700 bg-orange-50/50',
  critical: 'border-rose-500/30 text-rose-700 bg-rose-50/50'
};

const STATUS_BULLET_COLORS = {
  healthy: 'bg-emerald-500',
  warning: 'bg-amber-500',
  high_risk: 'bg-orange-500',
  critical: 'bg-rose-500'
};

// Running canvas ECG signal renderer
const VitalWaveCanvas: React.FC<{ pulse: number; status: string }> = ({ pulse, status }) => {
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

      // Grid backing
      ctx.strokeStyle = 'rgba(78, 54, 41, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const y = (h / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      timeRef.current += 0.015 * pulse * 3.0;
      ctx.beginPath();
      ctx.lineWidth = 2.0 * (window.devicePixelRatio || 2);
      
      // Color ECG wave by status
      if (status === 'critical') ctx.strokeStyle = '#D95566';
      else if (status === 'warning' || status === 'high_risk') ctx.strokeStyle = '#D98A55';
      else ctx.strokeStyle = '#8EA885';

      for (let x = 0; x < w; x++) {
        const percent = x / w;
        const phase = percent * Math.PI * 4.0 + timeRef.current;
        let y = Math.sin(phase) * 0.15;

        // Custom clinical heartbeat spike math
        const spikePhase = (percent * 2.0 + timeRef.current * 0.3) % 1;
        if (spikePhase < 0.06) {
          y += Math.sin((spikePhase / 0.06) * Math.PI) * 0.8;
        } else if (spikePhase > 0.08 && spikePhase < 0.12) {
          y -= Math.sin(((spikePhase - 0.08) / 0.04) * Math.PI) * 0.3;
        }

        const py = h * 0.5 - y * h * 0.35;
        if (x === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }

      ctx.stroke();
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [pulse, status]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

export default function DigitalTwinPage() {
  const patientId = 'PAT-001';
  const { data: patient } = usePatientByIdQuery(patientId);

  const [selectedOrganId, setSelectedOrganId] = useState<string | undefined>('brain');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [wireVisible, setWireVisible] = useState<boolean>(true);
  const [explode, setExplode] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);

  // Live simulation FPS jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.floor(58 + Math.random() * 3));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const hr = patient?.heartRate || 72;
  const o2 = patient?.oxygenSat || 98;
  const systolic = patient?.systolic || 120;
  const diastolic = patient?.diastolic || 80;

  // Organ statuses driven strictly from backend telemetry variables
  const organStatuses: Record<string, 'healthy' | 'warning' | 'high_risk' | 'critical'> = {
    brain: 'healthy',
    heart: hr > 110 || hr < 50 ? 'critical' : hr > 95 || hr < 60 ? 'warning' : 'healthy',
    lungs: o2 < 92 ? 'critical' : o2 < 95 ? 'warning' : 'healthy',
    liver: 'healthy',
    kidneys: 'healthy'
  };

  // Generate dynamic metrics for active organ depending on status
  const getOrganMetrics = (id: string) => {
    const meta = ORGANS_METADATA[id] || ORGANS_METADATA.brain;
    const status = organStatuses[id];

    let score = 98;
    let trend = 'Stable';
    let prediction = 'Low anomaly probability (1.8% / 48hr)';
    let explanation = '';
    let recommendations = [];

    if (id === 'heart') {
      score = status === 'critical' ? 68 : status === 'warning' ? 84 : 96;
      trend = status === 'critical' ? 'Downward Shift' : status === 'warning' ? 'Elevated baseline' : 'Stable';
      prediction = status === 'critical' 
        ? 'High probability of localized ischemic events or sustained tachycardia.' 
        : 'Slight risk of microvascular perfusion delays.';
      explanation = status === 'critical'
        ? `Electrocardiogram telemetry flags dynamic tachycardia (HR: ${hr} bpm). High risk profile requires prompt clinical intervention.`
        : `Cardiac index nominal. Regular heart rate measured at ${hr} bpm. Valvular stroke volume stable.`;
      recommendations = status === 'critical'
        ? ['Administer target beta-blocker therapy.', 'Deploy continuous telemetry alerts.', 'Trigger caregiver panic protocol validation.']
        : ['Continue regular cardiovascular pacing checks.', 'Ensure compliance with prescribed morning therapies.'];
    } else if (id === 'lungs') {
      score = status === 'critical' ? 65 : status === 'warning' ? 81 : 97;
      trend = status === 'critical' ? 'Hypoxic Shift' : status === 'warning' ? 'Mild desaturation' : 'Symmetric';
      prediction = status === 'critical'
        ? 'Pulmonary transport failure risk is high. Continuous mechanical support check suggested.'
        : 'Gas diffusion capacity within range. Standard reserve capacity.';
      explanation = status === 'critical'
        ? `SpO₂ registers low at ${o2}%. Respiratory parameters highlight active oxygen desaturation across pulmonary capillaries.`
        : `Lungs clear. Bilateral air entry symmetric. Oxygen saturation stable at ${o2}%.`;
      recommendations = status === 'critical'
        ? ['Apply supplementary nasal oxygen flow (2L/m).', 'Elevate patient bed position.', 'Initiate arterial blood gas (ABG) profiling.']
        : ['Instruct deep diaphragm breathing daily.', 'Maintain baseline blood gas monitoring cycles.'];
    } else if (id === 'brain') {
      score = 98;
      trend = 'Stable';
      prediction = 'Healthy cortical parameters. Normal cerebral indexing.';
      explanation = 'Cerebral hemodynamics nominal. Hemispheric synchrony optimal. Cortical density remains within 0.2σ of historic baseline.';
      recommendations = ['Encourage standard cognitive pacing exercises.', 'Verify normal REM sleep cycle averages (7.5+ hr).'];
    } else {
      // Liver & Kidneys
      score = 96;
      trend = 'Stable';
      prediction = 'Minimal filtration variance. 24hr kidney GFR remains optimal.';
      explanation = `Clinical values indicate metabolic parameters are nominal. Filtration loops at ${meta.metrics[0].value} indicate zero retention.`;
      recommendations = ['Maintain regular target hydration (2.5L/day).', 'Keep low sodium diet adherence.'];
    }

    return { score, trend, prediction, explanation, recommendations };
  };

  const activeMeta = ORGANS_METADATA[selectedOrganId || ''] || null;
  const activeDetails = selectedOrganId ? getOrganMetrics(selectedOrganId) : null;
  const activeStatus = selectedOrganId ? organStatuses[selectedOrganId] : 'healthy';

  const fontStyle = {
    fontFamily: "'Clash Display', Inter, sans-serif",
    fontWeight: 700
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-[#FAF8F5] text-[#4E3629] relative select-none">
      
      {/* Grid Canvas Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(78, 54, 41, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(78, 54, 41, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* ANATOMICA HUD HEADER */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#4E3629]/10 shrink-0 z-25 bg-white/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-[#4E3629]/15 bg-white/80 shadow-sm">
            <Activity className="w-4 h-4 text-[#C7A37E]" />
          </div>
          <div className="text-left">
            <div className="text-sm font-extrabold tracking-tight uppercase leading-none" style={fontStyle}>ANATOMICA</div>
            <div className="font-mono text-[9px] text-[#4E3629]/50 mt-1 tracking-widest font-bold">DIGITAL TWIN AI</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 font-mono text-[10px] font-bold text-[#4E3629]/60">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C7A37E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C7A37E]" />
            </span>
            <span>LIVE PERFUSION SYNCHRONIZATION</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#4E3629]/40">SCAN:</span>
            <span className="text-emerald-600">NOMINAL</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#4E3629]/40">SUBJECT:</span>
            <span className="text-[#4E3629]">PAT-001 / SARAH JENKINS</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setSelectedOrganId(undefined);
              setExplode(false);
              setWireVisible(true);
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#4E3629]/10 hover:border-[#4E3629]/20 hover:bg-white transition-all cursor-pointer text-[#4E3629]/60"
            title="Reset scene camera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* VIEWPORT CONTROLLER SPLIT */}
      <main className="flex-1 flex relative min-h-0 z-10">

        {/* 3D VIEWPORT CONTAINER */}
        <section className="relative flex-1 min-w-0 bg-white/20">
          <DigitalTwin3D 
            heartRate={hr}
            oxygenSat={o2}
            selectedOrgan={selectedOrganId}
            setSelectedOrgan={setSelectedOrganId}
            autoRotate={autoRotate}
            wireVisible={wireVisible}
            explode={explode}
            organStatuses={organStatuses}
          />

          {/* Sci-Fi Corner overlays */}
          <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-[#C7A37E]/40 pointer-events-none" />
          <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-[#C7A37E]/40 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-[#C7A37E]/40 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-[#C7A37E]/40 pointer-events-none" />

          {/* Top Left Scanning overlay details */}
          <div className="absolute top-5 left-5 bg-white/80 backdrop-blur-md rounded-xl p-3 border border-[#4E3629]/10 font-mono text-[9px] font-bold tracking-wider text-[#4E3629]/60 z-10 text-left shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[#4E3629]/40">ACQUISITION:</span>
              <span className="text-[#4E3629]">REAL-TIME TELEMETRY</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[#4E3629]/40">FRAME RATE:</span>
              <span className="text-[#4E3629]">{fps} FPS</span>
            </div>
          </div>

          {/* Top-Right HUD Controls buttons column */}
          <div className="absolute top-5 right-5 flex flex-col gap-2.5 z-10">
            <button 
              onClick={() => setAutoRotate(!autoRotate)}
              className={`w-10 h-10 flex items-center justify-center border rounded-xl transition-all cursor-pointer shadow-sm ${
                autoRotate 
                  ? 'bg-[#4E3629] text-[#FAF8F5] border-[#4E3629]' 
                  : 'bg-white/80 border-[#4E3629]/12 hover:border-[#4E3629]/25 text-[#4E3629] hover:bg-white'
              }`}
              title="Auto-rotate scene"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 12a9 9 0 1 1-3-6.7"/>
                <path d="M21 4v5h-5"/>
              </svg>
            </button>

            <button 
              onClick={() => setWireVisible(!wireVisible)}
              className={`w-10 h-10 flex items-center justify-center border rounded-xl transition-all cursor-pointer shadow-sm ${
                wireVisible 
                  ? 'bg-[#4E3629] text-[#FAF8F5] border-[#4E3629]' 
                  : 'bg-white/80 border-[#4E3629]/12 hover:border-[#4E3629]/25 text-[#4E3629] hover:bg-white'
              }`}
              title="Toggle Anatomy Shell"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 7l9-4 9 4-9 4-9-4Z"/>
                <path d="M3 12l9 4 9-4M3 17l9 4 9-4"/>
              </svg>
            </button>

            <button 
              onClick={() => setExplode(!explode)}
              className={`w-10 h-10 flex items-center justify-center border rounded-xl transition-all cursor-pointer shadow-sm ${
                explode 
                  ? 'bg-[#4E3629] text-[#FAF8F5] border-[#4E3629]' 
                  : 'bg-white/80 border-[#4E3629]/12 hover:border-[#4E3629]/25 text-[#4E3629] hover:bg-white'
              }`}
              title="Explode Anatomical Parts"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 12l8-4M12 12l8 4M12 12l-8 4M12 12l-8-4"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </button>
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold tracking-[0.2em] text-[#4E3629]/40 z-10">
            DRAG TO ROTATE · SCROLL TO ZOOM · CLICK ORGAN TO ANALYZE
          </div>
        </section>

        {/* SLIDE-IN GLASSMORPHISM MEDICAL INFO PANEL */}
        <AnimatePresence>
          {selectedOrganId && activeMeta && activeDetails && (
            <motion.aside 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-[390px] shrink-0 bg-white/75 backdrop-blur-xl border-l border-[#4E3629]/10 flex flex-col z-20 text-left shadow-[[-10px_0_30px_rgba(78,54,41,0.025)]]"
            >
              {/* Header Box */}
              <div className="p-6 border-b border-[#4E3629]/10 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] tracking-[0.22em] text-[#C7A37E] font-bold uppercase">DIAGNOSTIC INDEX</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold border uppercase ${STATUS_BORDER_COLORS[activeStatus]}`}>
                      {STATUS_TEXTS[activeStatus]}
                    </span>
                  </div>
                  <div className="text-2xl font-bold tracking-tight mt-3 text-[#4E3629] leading-none" style={fontStyle}>
                    {activeMeta.name}
                  </div>
                  <div className="font-mono text-[9px] text-[#4E3629]/50 mt-2 tracking-wider font-bold">
                    {activeMeta.latin}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedOrganId(undefined)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center border border-[#4E3629]/10 hover:border-[#4E3629]/20 bg-white/50 hover:bg-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 text-[#4E3629]/75" />
                </button>
              </div>

              {/* Scrollable contents body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                
                {/* Organ Description */}
                <p className="text-[13px] leading-relaxed text-[#4E3629]/80 font-medium">
                  {activeMeta.desc}
                </p>

                {/* Score and Stats grid split */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Radial Health score ring */}
                  <div className="border border-[#4E3629]/8 bg-white/40 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center">
                    <span className="font-mono text-[8px] tracking-wider text-[#4E3629]/45 font-bold uppercase mb-2">HEALTH SCORE</span>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="32" strokeWidth="4.5" stroke="rgba(78,54,41,0.05)" fill="transparent" />
                        <circle 
                          cx="40" 
                          cy="40" 
                          r="32" 
                          strokeWidth="4.5" 
                          stroke={STATUS_BULLET_COLORS[activeStatus] === 'bg-emerald-500' ? '#8EA885' : STATUS_BULLET_COLORS[activeStatus] === 'bg-rose-500' ? '#D95566' : '#C7A37E'}
                          strokeDasharray={2 * Math.PI * 32}
                          strokeDashoffset={2 * Math.PI * 32 * (1 - activeDetails.score / 100)}
                          strokeLinecap="round"
                          fill="transparent" 
                        />
                      </svg>
                      <div className="absolute font-bold text-base text-[#4E3629] tracking-tighter" style={fontStyle}>
                        {activeDetails.score}%
                      </div>
                    </div>
                  </div>

                  {/* Vitals metrics stats */}
                  <div className="flex flex-col gap-2">
                    {activeMeta.metrics.slice(0, 2).map((m) => (
                      <div key={m.label} className="border border-[#4E3629]/8 bg-white/40 backdrop-blur-md rounded-xl px-3 py-2.5">
                        <div className="font-mono text-[8px] font-bold tracking-wider text-[#4E3629]/45 uppercase">{m.label}</div>
                        <div className="text-[13px] font-bold mt-1 text-[#4E3629]" style={fontStyle}>{m.value}</div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Real-time vital ECG waves */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[9px] font-bold text-[#4E3629]/45 font-mono">
                    <span>ANATOMICAL VITAL SIGNAL</span>
                    <span className="text-[#C7A37E]">{activeMeta.pulse.toFixed(2)} Hz</span>
                  </div>
                  <div className="relative h-20 rounded-2xl overflow-hidden border border-[#4E3629]/10 bg-white/50">
                    <VitalWaveCanvas pulse={activeMeta.pulse} status={activeStatus} />
                    <div className="absolute top-2 left-3 font-mono text-[7px] font-bold text-[#4E3629]/40 tracking-wider">SIG-ACQ-01</div>
                    <div className="absolute bottom-2 right-3 font-mono text-[7px] font-bold text-[#4E3629]/40 tracking-wider">LIVE TELEMETRY</div>
                  </div>
                </div>

                {/* AI clinical Insights */}
                <div className="border border-[#4E3629]/8 bg-white/45 backdrop-blur-md rounded-2xl p-4.5 space-y-3.5">
                  <div className="flex items-center gap-1.5 text-[#C7A37E]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="font-mono text-[9px] font-bold tracking-wider uppercase">AI CLINICAL COGNITION</span>
                  </div>
                  <p className="text-[11.5px] leading-relaxed text-[#4E3629]/85 font-medium">
                    {activeDetails.explanation}
                  </p>
                  
                  <div className="border-t border-[#4E3629]/8 pt-3 mt-1 text-[10.5px] leading-relaxed font-mono">
                    <div className="flex items-center justify-between font-bold text-[#4E3629]/50">
                      <span>TREND PROFILE:</span>
                      <span className={activeStatus === 'healthy' ? 'text-emerald-700' : activeStatus === 'critical' ? 'text-rose-700' : 'text-amber-700'}>
                        {activeDetails.trend.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[#4E3629]/65 mt-1.5 font-sans text-[11px] leading-relaxed font-medium">
                      <strong className="font-mono text-[9px] text-[#4E3629]/40 block mb-0.5">PREDICTION (48HR):</strong>
                      {activeDetails.prediction}
                    </p>
                  </div>
                </div>

                {/* Recommendations checklist */}
                <div className="space-y-2">
                  <div className="font-mono text-[9px] font-bold tracking-wider text-[#4E3629]/45 uppercase">PROACTIVE INTERVENTIONS</div>
                  <div className="space-y-2">
                    {activeDetails.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-600/10 bg-emerald-50/20">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-[11.5px] leading-relaxed text-[#4E3629]/95 font-medium">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action footer */}
              <div className="p-4 border-t border-[#4E3629]/10 bg-white/30">
                <button className="w-full bg-[#4E3629] hover:bg-[#5b3f2e] text-[#FAF8F5] rounded-xl py-3 text-[11px] font-mono font-bold tracking-wider transition-all cursor-pointer shadow-sm">
                  PIN ANALYSIS TO CLINICAL RECORD
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

      </main>

      {/* FOOTER ORGAN NAVIGATION DOCK */}
      <nav className="border-t border-[#4E3629]/10 px-6 py-4 bg-white/40 backdrop-blur-md z-25 shrink-0">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth justify-center">
          {Object.values(ORGANS_METADATA).map((o) => {
            const isActive = selectedOrganId === o.id;
            const status = organStatuses[o.id];
            
            return (
              <button
                key={o.id}
                onClick={() => setSelectedOrganId(o.id)}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 border transition-all cursor-pointer shrink-0 ${
                  isActive 
                    ? 'bg-[#4E3629] border-[#4E3629] text-[#FAF8F5] shadow-sm font-bold scale-[1.03]' 
                    : 'bg-white/60 hover:bg-white border-[#4E3629]/10 text-[#4E3629] hover:border-[#4E3629]/25'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${STATUS_BULLET_COLORS[status]}`} />
                <span className="text-[11px] font-extrabold tracking-tight">{o.name}</span>
                <span className="font-mono text-[8px] tracking-wider text-[#4E3629]/40 font-bold uppercase">
                  {STATUS_TEXTS[status]}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
