import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { generateRiskScore, predictReadmission } from '../../services/ai';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { RiskRadial } from '../../components/charts/RiskRadial';
import { BrainCircuit, ShieldAlert, Cpu, Award } from 'lucide-react';
import { getRiskColor } from '../../lib/utils';
import { motion } from 'framer-motion';

interface ExplainableAIPanelProps {
  patientId: string;
}

export const ExplainableAIPanel: React.FC<ExplainableAIPanelProps> = ({ patientId }) => {
  const { data: riskData, isLoading: riskLoading } = useQuery({
    queryKey: ['ai-risk', patientId],
    queryFn: () => generateRiskScore(patientId)
  });

  const { data: predictionData, isLoading: predLoading } = useQuery({
    queryKey: ['ai-prediction', patientId],
    queryFn: () => predictReadmission(patientId)
  });

  const isLoading = riskLoading || predLoading;

  if (isLoading) {
    return <div className="h-64 bg-[#4E3629]/5 animate-pulse rounded-2xl border border-[#4E3629]/10" />;
  }

  const score = riskData?.score || 0;
  const factors = riskData?.factors || [];
  const trend = riskData?.trend || 'stable';

  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return 'text-rose-700 bg-rose-500/10 border-rose-500/20';
      case 'medium': return 'text-amber-700 bg-amber-500/10 border-amber-500/20';
      case 'low':
      default:
        return 'text-emerald-700 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#C7A37E]/5 rounded-full blur-2xl pointer-events-none" />

      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center space-x-2 text-[#4E3629]">
          <BrainCircuit className="h-4.5 w-4.5 text-[#C7A37E]" />
          <span>Explainable AI Diagnostic Analytics</span>
        </CardTitle>
        <CardDescription>
          EHR biometric telemetry breakdown & hospitalization risk weights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Radial index and stats split */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-4 border-b border-[#4E3629]/10">
          <RiskRadial score={score} />
          
          <div className="flex-1 space-y-3 w-full text-xs">
            {/* Confidence */}
            <div className="flex justify-between items-center bg-white/50 border border-[#4E3629]/10 rounded-xl px-4 py-2.5">
              <span className="text-[#4E3629]/70 font-semibold flex items-center">
                <Award className="h-3.5 w-3.5 mr-1 text-[#C7A37E]" />
                Confidence
              </span>
              <span className="font-extrabold text-[#4E3629]">94.2%</span>
            </div>
            
            {/* Prediction Probability */}
            <div className="flex justify-between items-center bg-white/50 border border-[#4E3629]/10 rounded-xl px-4 py-2.5">
              <span className="text-[#4E3629]/70 font-semibold flex items-center">
                <ShieldAlert className="h-3.5 w-3.5 mr-1 text-rose-600" />
                Readmission Risk
              </span>
              <span className="font-extrabold text-rose-600">{predictionData?.probability || 0}%</span>
            </div>
          </div>
        </div>

        {/* Contributing Factors */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#4E3629]/55 block text-left">
            Top Risk Contributors
          </span>
          <div className="space-y-2">
            {factors.map((factor, idx) => (
              <motion.div
                key={factor.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 border border-[#4E3629]/10 bg-white/50 rounded-xl"
              >
                <div className="space-y-0.5 text-left">
                  <span className="text-xs font-bold text-[#4E3629]">{factor.name}</span>
                  <span className="text-[10px] text-[#4E3629]/60 block font-semibold">Telemetry value: {factor.value}</span>
                </div>
                <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${
                  getImpactColor(factor.impact)
                }`}>
                  {factor.impact} impact
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommended Directives */}
        {predictionData?.recommendedInterventions && predictionData.recommendedInterventions.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-[#4E3629]/10 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4E3629]/55 block">
              Suggested Mitigating Interventions
            </span>
            <ul className="space-y-1.5 pl-3 list-disc text-[11px] text-[#4E3629]/80 leading-normal">
              {predictionData.recommendedInterventions.map((rec, idx) => (
                <li key={idx} className="marker:text-[#C7A37E] font-medium">{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
