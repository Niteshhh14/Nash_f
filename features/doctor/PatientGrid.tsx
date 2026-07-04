import React from 'react';
import { useRouter } from 'next/navigation';
import { Patient } from '../../types';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { getRiskColor, getEmergencyBadgeColor } from '../../lib/utils';
import { useAppStore } from '../../store/use-app-store';
import { Search, ShieldAlert, Heart, Wind, ArrowRight, Activity } from 'lucide-react';

interface PatientGridProps {
  patients: Patient[];
  isLoading: boolean;
}

export const PatientGrid: React.FC<PatientGridProps> = ({ patients, isLoading }) => {
  const router = useRouter();
  const { 
    patientSearchQuery, 
    setPatientSearchQuery, 
    patientRiskFilter, 
    setPatientRiskFilter,
    setSelectedPatientId 
  } = useAppStore();

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
      p.condition.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(patientSearchQuery.toLowerCase());

    const matchesRisk = 
      patientRiskFilter === 'all' || 
      p.riskCategory === patientRiskFilter;

    return matchesSearch && matchesRisk;
  });

  const handleCardClick = (id: string) => {
    setSelectedPatientId(id);
    router.push(`/doctor/patients/${id}`);
  };

  const riskCategories: ('all' | 'critical' | 'high' | 'moderate' | 'low')[] = [
    'all',
    'critical',
    'high',
    'moderate',
    'low'
  ];

  return (
    <div className="space-y-6">
      {/* Filtering Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4E3629]/50" />
          <Input
            placeholder="Search patient, EHR code, or condition..."
            value={patientSearchQuery}
            onChange={(e) => setPatientSearchQuery(e.target.value)}
            className="pl-10 border-[#4E3629]/15 bg-white/50 text-[#4E3629] placeholder:text-[#4E3629]/40 focus:border-[#C7A37E] focus:ring-[#C7A37E]/10 rounded-xl"
          />
        </div>

        {/* Risk Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-[#4E3629]/70 mr-1">Risk Filter:</span>
          {riskCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setPatientRiskFilter(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl capitalize transition-all duration-200 cursor-pointer border ${
                patientRiskFilter === cat
                  ? 'bg-[#4E3629] text-[#FAF8F5] border-[#4E3629] font-extrabold shadow-sm'
                  : 'bg-white/50 border-[#4E3629]/10 text-[#4E3629]/70 hover:bg-white hover:text-[#4E3629]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Container */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 rounded-2xl border border-[#4E3629]/10 bg-[#4E3629]/5 animate-pulse" />
          ))}
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-16 border border-[#4E3629]/10 rounded-[24px] bg-white/45 backdrop-blur-[24px]">
          <p className="text-xs font-bold text-[#4E3629]/60">No patients match the current diagnostic filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => {
            const riskClass = getRiskColor(patient.riskCategory);

            return (
              <Card
                key={patient.id}
                hoverGlow
                onClick={() => handleCardClick(patient.id)}
                className="cursor-pointer group flex flex-col justify-between border-[#4E3629]/10 hover:border-[#4E3629]/20 bg-white/45 shadow-sm"
              >
                <div>
                  {/* Top line Info */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-extrabold text-[#4E3629]">
                          {patient.name}
                        </span>
                        <span className="text-[10px] text-[#4E3629]/50 font-bold">{patient.age} / {patient.gender[0]}</span>
                      </div>
                      <p className="text-xs text-[#4E3629]/70 mt-1 font-semibold text-left">{patient.condition}</p>
                    </div>

                    {/* Risk Badge */}
                    <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded border ${riskClass}`}>
                      {patient.riskCategory}
                    </span>
                  </div>

                  {/* snapshot vitals */}
                  <div className="grid grid-cols-3 gap-2 my-5 pt-3.5 border-t border-[#4E3629]/10">
                    {/* HR */}
                    <div className="text-left">
                      <div className="flex items-center text-[9px] font-bold text-[#4E3629]/50 space-x-1">
                        <Heart className="h-3 w-3 text-rose-500" strokeWidth={1.5} />
                        <span>Pulse</span>
                      </div>
                      <span className="text-xs font-black text-[#4E3629]">{patient.heartRate}</span>
                      <span className="text-[9px] text-[#4E3629]/50 ml-0.5 font-bold">bpm</span>
                    </div>

                    {/* BP */}
                    <div className="text-left">
                      <div className="flex items-center text-[9px] font-bold text-[#4E3629]/50 space-x-1">
                        <Activity className="h-3 w-3 text-[#C7A37E]" strokeWidth={1.5} />
                        <span>BP</span>
                      </div>
                      <span className="text-xs font-black text-[#4E3629]">{patient.systolic}/{patient.diastolic}</span>
                    </div>

                    {/* SpO2 */}
                    <div className="text-left">
                      <div className="flex items-center text-[9px] font-bold text-[#4E3629]/50 space-x-1">
                        <Wind className="h-3 w-3 text-emerald-600" strokeWidth={1.5} />
                        <span>SpO2</span>
                      </div>
                      <span className={`text-xs font-black ${patient.oxygenSat < 92 ? 'text-rose-600' : 'text-[#4E3629]'}`}>
                        {patient.oxygenSat}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between border-t border-[#4E3629]/10 pt-3 mt-1 text-[10px] text-[#4E3629]/65 font-bold uppercase tracking-wider">
                  <span>{patient.roomNumber || 'Outpatient'}</span>
                  <div className="flex items-center space-x-1 text-[#C7A37E] group-hover:translate-x-0.5 transition-transform duration-200">
                    <span>View EHR Chart</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
