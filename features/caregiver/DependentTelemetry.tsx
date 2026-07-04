import React from 'react';
import { useRouter } from 'next/navigation';
import { Patient } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Activity, Heart, Wind, CheckSquare, Bell, ArrowRight } from 'lucide-react';
import { getRiskColor } from '../../lib/utils';

interface DependentTelemetryProps {
  patients: Patient[];
  isLoading: boolean;
}

export const DependentTelemetry: React.FC<DependentTelemetryProps> = ({ patients, isLoading }) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((n) => (
          <div key={n} className="h-32 rounded-2xl border border-white/5 bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {patients.length === 0 ? (
        <div className="text-center py-12 border border-white/5 rounded-2xl bg-black/20 text-neutral-500">
          No dependent profiles mapped to this caregiver credentials.
        </div>
      ) : (
        <div className="space-y-4">
          {patients.map((patient) => {
            const riskClass = getRiskColor(patient.riskCategory);

            return (
              <Card 
                key={patient.id} 
                hoverGlow
                className="border-white/5 bg-black/30 flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-6"
              >
                {/* Dependent Bio */}
                <div className="space-y-1.5 max-w-sm">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-semibold text-white/90">{patient.name}</h3>
                    <span className="text-[10px] text-neutral-500 font-semibold">{patient.age} / {patient.gender[0]}</span>
                  </div>
                  <p className="text-xs text-neutral-400 font-medium">Condition: {patient.condition}</p>
                  <div className="flex items-center space-x-1.5 text-[10px] text-neutral-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span>Location: {patient.roomNumber || 'Home Outpatient'}</span>
                  </div>
                </div>

                {/* Vitals snapshot */}
                <div className="flex flex-wrap gap-6 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                  {/* HR */}
                  <div className="text-left min-w-[70px]">
                    <div className="flex items-center text-[10px] text-neutral-500 space-x-1 mb-1">
                      <Heart className="h-3.5 w-3.5 text-rose-500" />
                      <span>Pulse</span>
                    </div>
                    <span className="text-sm font-bold text-white">{patient.heartRate}</span>
                    <span className="text-[10px] text-neutral-500 ml-0.5">bpm</span>
                  </div>

                  {/* BP */}
                  <div className="text-left min-w-[90px]">
                    <div className="flex items-center text-[10px] text-neutral-500 space-x-1 mb-1">
                      <Activity className="h-3.5 w-3.5 text-cyan-500" />
                      <span>Blood Pres</span>
                    </div>
                    <span className="text-sm font-bold text-white">{patient.systolic}/{patient.diastolic}</span>
                  </div>

                  {/* SpO2 */}
                  <div className="text-left min-w-[70px]">
                    <div className="flex items-center text-[10px] text-neutral-500 space-x-1 mb-1">
                      <Wind className="h-3.5 w-3.5 text-indigo-500" />
                      <span>SpO2</span>
                    </div>
                    <span className={`text-sm font-bold ${patient.oxygenSat < 92 ? 'text-rose-400' : 'text-white'}`}>
                      {patient.oxygenSat}%
                    </span>
                  </div>
                </div>

                {/* Actions & Alerts */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0 space-y-0 md:space-y-3">
                  {/* Risk Badge */}
                  <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${riskClass}`}>
                    {patient.riskCategory} Risk
                  </span>
                  
                  {/* Redirect button */}
                  <button 
                    onClick={() => router.push(`/doctor/patients/${patient.id}`)}
                    className="flex items-center space-x-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-150 cursor-pointer"
                  >
                    <span>Inspect Medical Timeline</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
