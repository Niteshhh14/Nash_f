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
    <Card className="border-white/55 bg-white/45 backdrop-blur-[12px] shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-base font-semibold text-[#4E3629]">
          <Pill className="h-4.5 w-4.5 text-[#C7A37E]" />
          <span>Active Pharmacotherapy Adherence</span>
        </CardTitle>
        <CardDescription className="text-[#4E3629]/75">
          {allowEdit 
            ? 'Interactive check-in. Click days to toggle compliance.' 
            : 'Clinical monitoring log of active prescriptions.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {patient.medications.length === 0 ? (
          <div className="py-6 text-center text-sm text-[#4E3629]/60">
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
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-[#4E3629]/10 bg-white/60 space-y-4 md:space-y-0"
                >
                  {/* Pill Specs */}
                  <div className="flex items-start space-x-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C7A37E]/10 border border-[#C7A37E]/20 text-[#C7A37E]">
                      <Pill className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-semibold text-[#4E3629]">{med.name}</h4>
                      <p className="text-xs text-[#4E3629]/75 mt-0.5">{med.dosage} • {med.frequency}</p>
                      <div className="flex items-center mt-1 text-[10px] text-[#4E3629]/60">
                        <Clock className="h-3 w-3 mr-1 text-[#C7A37E]" />
                        <span>Scheduled: {med.timing}</span>
                      </div>
                    </div>
                  </div>

                  {/* 7-Day Matrix */}
                  <div className="flex items-center space-x-6">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-[#4E3629]/60 uppercase tracking-wider font-bold mb-1.5">
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
                                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700'
                                  : 'bg-rose-500/10 border-rose-500/25 text-rose-700'
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
                    <div className="text-right flex flex-col justify-center min-w-[70px]">
                      <span className="text-xs text-[#4E3629]/60 font-semibold uppercase tracking-wider">
                        Compliance
                      </span>
                      <span className={`text-lg font-bold ${
                        complianceRate >= 80 ? 'text-emerald-700' : 'text-amber-700'
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
