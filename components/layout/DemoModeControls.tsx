import React, { useEffect } from 'react';
import { useAppStore, DemoScenario } from '../../store/use-app-store';
import { clinicalStorySteps } from '../../mock/scenarios';
import { Play, Pause, SkipForward, SkipBack, Eye, Settings, Cpu, Siren } from 'lucide-react';
import { Button } from '../ui/button';

export const DemoModeControls: React.FC = () => {
  const {
    demoScenario,
    setDemoScenario,
    storyStep,
    setStoryStep,
    isStoryPlaying,
    setIsStoryPlaying,
    activeEmergency
  } = useAppStore();

  const [isCollapsed, setIsCollapsed] = React.useState(true);

  // Auto-advance Clinical Story
  useEffect(() => {
    if (!isStoryPlaying) return;

    const interval = setInterval(() => {
      setStoryStep((storyStep + 1) % clinicalStorySteps.length);
    }, 10000); // 10 seconds per step for 2 minutes overall journey

    return () => clearInterval(interval);
  }, [isStoryPlaying, storyStep, setStoryStep]);

  const activeStepDetails = clinicalStorySteps[storyStep];

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sc = e.target.value as DemoScenario;
    setIsStoryPlaying(false);
    setStoryStep(0);
    setDemoScenario(sc);
  };

  const headerStyle = {
    fontFamily: "'Clash Display', Inter, sans-serif",
    fontWeight: 700
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
      {/* Collapsible toggle tab */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center space-x-1.5 rounded-full border border-[#4E3629]/15 bg-[#4E3629] px-3.5 py-2 text-[9px] font-bold uppercase tracking-wider text-[#FAF8F5] hover:bg-[#4E3629]/90 transition-all duration-200 cursor-pointer shadow-md"
      >
        <Settings className="h-3.5 w-3.5 animate-spin-slow text-[#C7A37E]" />
        <span>{isCollapsed ? 'Show Presentation Panel' : 'Collapse Panel'}</span>
      </button>

      {!isCollapsed && (
        <div className="w-[320px] rounded-2xl border border-[#4E3629]/15 bg-white/90 p-4 shadow-xl backdrop-blur-xl space-y-4 text-[#4E3629]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#4E3629]/10 pb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C7A37E] flex items-center space-x-1" style={headerStyle}>
              <Cpu className="h-3.5 w-3.5 text-[#C7A37E]" />
              <span>Clinical Sandbox Controls</span>
            </span>
            {activeEmergency && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </div>

          {/* Scenario selector */}
          <div className="space-y-1.5">
            <label className="text-[9px] uppercase font-bold text-[#4E3629]/60 tracking-wider block">
              1. Preset Clinical Scenarios
            </label>
            <select
              value={demoScenario}
              onChange={handleScenarioChange}
              className="w-full bg-white/50 border border-[#4E3629]/15 text-xs text-[#4E3629] rounded-lg p-2 outline-none cursor-pointer hover:border-[#4E3629]/30 transition-all duration-200"
            >
              <option value="healthy">Healthy Baseline</option>
              <option value="hypertension">Hypertension Crisis</option>
              <option value="cardiac">Impending Cardiac Arrest</option>
              <option value="stroke">Ischemic Stroke Risk</option>
              <option value="diabetes">Diabetes Nephropathy</option>
              <option value="copd">COPD Hypoxia</option>
              <option value="respiratory">Respiratory Failure</option>
              <option value="recovery">Recovery Protocol</option>
            </select>
          </div>

          {/* Clinical Story controller */}
          <div className="space-y-2.5 border-t border-[#4E3629]/10 pt-3">
            <div className="flex items-center justify-between">
              <label className="text-[9px] uppercase font-bold text-[#4E3629]/60 tracking-wider">
                2. Autoplay Clinical Journey
              </label>
              <button
                onClick={() => setIsStoryPlaying(!isStoryPlaying)}
                className="text-[9px] font-bold text-[#C7A37E] hover:underline transition-colors flex items-center space-x-1"
              >
                {isStoryPlaying ? (
                  <>
                    <Pause className="h-3 w-3" />
                    <span>Pause Autoplay</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3" />
                    <span>Autoplay Journey</span>
                  </>
                )}
              </button>
            </div>

            {/* Controls panel */}
            <div className="flex items-center justify-between gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 py-1 text-[10px] text-[#4E3629] border-[#4E3629]/10 hover:bg-[#4E3629]/5"
                disabled={storyStep === 0}
                onClick={() => {
                  setIsStoryPlaying(false);
                  setStoryStep(storyStep - 1);
                }}
              >
                <SkipBack className="h-3 w-3 mr-1" />
                <span>Prev</span>
              </Button>
              <span className="text-[10px] font-bold text-[#4E3629] px-2 bg-white/40 border border-[#4E3629]/10 rounded py-1">
                Step {storyStep + 1} / {clinicalStorySteps.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 py-1 text-[10px] text-[#4E3629] border-[#4E3629]/10 hover:bg-[#4E3629]/5"
                disabled={storyStep === clinicalStorySteps.length - 1}
                onClick={() => {
                  setIsStoryPlaying(false);
                  setStoryStep(storyStep + 1);
                }}
              >
                <span>Next</span>
                <SkipForward className="h-3 w-3 ml-1" />
              </Button>
            </div>

            {/* Active Step Specs */}
            <div className="bg-[#4E3629]/3 border border-[#4E3629]/10 rounded-xl p-3 space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#4E3629]">
                  {activeStepDetails.time} - {activeStepDetails.title}
                </span>
                {isStoryPlaying && (
                  <span className="text-[8px] font-bold uppercase text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-1.5 rounded animate-pulse">
                    Live Play
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#4E3629]/75 leading-normal font-medium">
                {activeStepDetails.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
