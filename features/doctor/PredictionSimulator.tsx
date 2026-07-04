import React from 'react';
import { useAppStore, PredictionFactors } from '../../store/use-app-store';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Check, X, ShieldAlert, Cpu, Heart, Pill, Moon, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const PredictionSimulator: React.FC = () => {
  const { predictionFactors, togglePredictionFactor, resetPredictionFactors } = useAppStore();

  // Compute a mock 7-day predictive trajectory based on toggled factors
  const getPredictiveTrajectory = () => {
    let baseRisk = 15;
    
    // Add weights
    if (!predictionFactors.medicationTaken) baseRisk += 30;
    if (predictionFactors.poorSleep) baseRisk += 15;
    if (predictionFactors.stress) baseRisk += 20;
    if (predictionFactors.smoking) baseRisk += 25;
    if (!predictionFactors.exercise) baseRisk += 10;
    if (!predictionFactors.hydration) baseRisk += 8;

    baseRisk = Math.min(100, Math.max(5, baseRisk));

    return [
      { day: 'Today', risk: baseRisk },
      { day: 'Tomorrow', risk: Math.min(100, Math.max(5, baseRisk + (predictionFactors.medicationTaken ? -2 : 4))) },
      { day: '3 Days', risk: Math.min(100, Math.max(5, baseRisk + (predictionFactors.medicationTaken ? -5 : 12))) },
      { day: '7 Days', risk: Math.min(100, Math.max(5, baseRisk + (predictionFactors.medicationTaken ? -10 : 25))) }
    ];
  };

  const chartData = getPredictiveTrajectory();
  const currentRisk = chartData[0].risk;

  const factorsList: { key: keyof PredictionFactors; label: string; icon: any }[] = [
    { key: 'medicationTaken', label: 'Medications Taken', icon: Pill },
    { key: 'poorSleep', label: 'Insomnia / Poor Sleep', icon: Moon },
    { key: 'stress', label: 'Acute Mental Stress', icon: Heart },
    { key: 'exercise', label: 'Aerobic Exercise Active', icon: Sparkles },
    { key: 'hydration', label: 'Adequate Hydration', icon: Sparkles },
    { key: 'smoking', label: 'Active Smoking/Nicotine', icon: Sparkles }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center space-x-2 text-[#4E3629]">
          <Cpu className="h-4.5 w-4.5 text-[#C7A37E]" />
          <span>Interactive Prognosis Simulator</span>
        </CardTitle>
        <CardDescription>
          Toggle simulated lifestyle metrics to calculate 7-day risk trajectories.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Toggle Grid */}
        <div className="grid grid-cols-2 gap-2">
          {factorsList.map((factor) => {
            const isActive = predictionFactors[factor.key];
            const FacIcon = factor.icon;
            
            // Set styles based on status
            // Green variants for positive factors, red variants for risk factors
            const isNegativeFactor = factor.key === 'poorSleep' || factor.key === 'stress' || factor.key === 'smoking';
            const buttonColor = isNegativeFactor 
              ? (isActive ? 'bg-rose-500/10 border-rose-500/20 text-rose-700' : 'bg-white/50 border-[#4E3629]/10 text-[#4E3629]/70 hover:bg-white hover:text-[#4E3629]')
              : (isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' : 'bg-white/50 border-[#4E3629]/10 text-[#4E3629]/70 hover:bg-white hover:text-[#4E3629]');

            return (
              <button
                key={factor.key}
                onClick={() => togglePredictionFactor(factor.key)}
                className={`flex items-center space-x-2.5 p-3 rounded-xl border text-left text-[11px] font-semibold transition-all duration-200 cursor-pointer ${buttonColor}`}
              >
                <FacIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">{factor.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Forecast Chart */}
        <div className="space-y-3 pt-3 border-t border-[#4E3629]/10 text-left">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-[#4E3629]/55">
            <span>Predicted 7-Day Physiological Risk Trend</span>
            <button onClick={resetPredictionFactors} className="text-[#C7A37E] hover:text-[#644736] font-bold cursor-pointer">
              Reset Factors
            </button>
          </div>

          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSimulator" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentRisk > 60 ? '#f43f5e' : '#C7A37E'} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={currentRisk > 60 ? '#f43f5e' : '#C7A37E'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(78,54,41,0.05)" />
                <XAxis dataKey="day" stroke="rgba(78,54,41,0.4)" fontSize={10} tickLine={false} />
                <YAxis stroke="rgba(78,54,41,0.4)" fontSize={10} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(250, 248, 245, 0.95)',
                    border: '1px solid rgba(78, 54, 41, 0.15)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#4E3629'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke={currentRisk > 60 ? '#f43f5e' : '#C7A37E'}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSimulator)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
