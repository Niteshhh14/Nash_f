import React from 'react';
import { Patient } from '../../types';
import { useToggleMedicationMutation } from '../../hooks/use-patients';
import { Pill, Check, X, Clock, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { getRiskColor } from '../../lib/utils';

interface PillSchedulerProps {
  patient: Patient;
  allowEdit?: boolean;
}

export const PillScheduler: React.FC<PillSchedulerProps> = ({ patient, allowEdit = false }) => {
  const toggleMutation = useToggleMedicationMutation();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleToggle = (medicationId: string, dayIndex: number) => {
    if (!allowEdit) return;
    toggleMutation.mutate({
      patientId: patient.id,
      medicationId,
      dayIndex
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-base font-semibold">
          <Pill className="h-4.5 w-4.5 text-cyan-400" />
          <span>Active Pharmacotherapy Adherence</span>
        </CardTitle>
        <CardDescription>
          {allowEdit 
            ? 'Interactive check-in. Click days to toggle compliance.' 
            : 'Clinical monitoring log of active prescriptions.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {patient.medications.length === 0 ? (
          <div className="py-6 text-center text-sm text-neutral-500">
            No active medications listed.
          </div>
        ) : (
          <div className="space-y-4">
            {patient.medications.map((med) => {
              // Calculate compliance percentage
              const takenCount = med.compliance.filter(Boolean).length;
              const complianceRate = Math.round((takenCount / med.compliance.length) * 100);

              return (
                <div 
                  key={med.id} 
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5/40 backdrop-blur-sm space-y-4 md:space-y-0"
                >
                  {/* Pill Specs */}
                  <div className="flex items-start space-x-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                      <Pill className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white/90">{med.name}</h4>
                      <p className="text-xs text-neutral-400 mt-0.5">{med.dosage} • {med.frequency}</p>
                      <div className="flex items-center mt-1 text-[10px] text-neutral-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Scheduled: {med.timing}</span>
                      </div>
                    </div>
                  </div>

                  {/* 7-Day Matrix */}
                  <div className="flex items-center space-x-6">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold mb-1.5">
                        7-Day Adherence
                      </span>
                      <div className="flex items-center space-x-1">
                        {days.map((day, idx) => {
                          const isCompliant = med.compliance[idx];
                          return (
                            <button
                              key={day}
                              disabled={!allowEdit || toggleMutation.isPending}
                              onClick={() => handleToggle(med.id, idx)}
                              title={`${day}: ${isCompliant ? 'Taken' : 'Missed'} (Click to switch)`}
                              className={`flex h-7 w-7 flex-col items-center justify-center rounded-lg border text-[9px] font-bold transition-all duration-150 ${
                                allowEdit ? 'cursor-pointer hover:scale-105' : 'cursor-default'
                              } ${
                                isCompliant
                                  ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                                  : 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                              }`}
                            >
                              <span>{day[0]}</span>
                              {isCompliant 
                                ? <Check className="h-2 w-2 mt-0.5" /> 
                                : <X className="h-2 w-2 mt-0.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Score badge */}
                    <div className="text-right flex flex-col justify-center">
                      <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
                        Compliance
                      </span>
                      <span className={`text-lg font-bold ${
                        complianceRate >= 80 ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {complianceRate}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
