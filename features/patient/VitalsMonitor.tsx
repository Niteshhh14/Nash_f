import React from 'react';
import { Patient } from '../../types';
import { Card, CardContent } from '../../components/ui/card';
import { Heart, Activity, Thermometer, Wind } from 'lucide-react';
import { VITAL_THRESHOLDS } from '../../lib/constants';

interface VitalsMonitorProps {
  patient: Patient;
}

export const VitalsMonitor: React.FC<VitalsMonitorProps> = ({ patient }) => {
  const checkStatus = (val: number, type: keyof typeof VITAL_THRESHOLDS) => {
    const limits = VITAL_THRESHOLDS[type];
    if (val < limits.min || val > limits.max) return 'critical';
    return 'normal';
  };

  const getVitalCardStyle = (status: 'normal' | 'critical') => {
    if (status === 'critical') {
      return 'border-rose-500/20 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.05)]';
    }
    return 'border-[#4E3629]/10 bg-white/50 hover:bg-white/80 hover:border-[#4E3629]/20';
  };

  const hrStatus = checkStatus(patient.heartRate, 'heartRate');
  const oxyStatus = checkStatus(patient.oxygenSat, 'oxygenSat');
  const respStatus = checkStatus(patient.respiratoryRate, 'respiratoryRate');
  const tempStatus = checkStatus(patient.temperature, 'temperature');
  const bpStatus = patient.systolic > 140 || patient.systolic < 90 ? 'critical' : 'normal';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Heart Rate */}
      <Card className={getVitalCardStyle(hrStatus)}>
        <CardContent className="p-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4E3629]/70">Heart Rate</span>
            <Heart className={`h-4.5 w-4.5 ${hrStatus === 'critical' ? 'text-rose-500 animate-pulse' : 'text-[#4E3629]/40'}`} />
          </div>
          <div className="mt-2.5">
            <span className={`text-2xl font-black ${hrStatus === 'critical' ? 'text-rose-600' : 'text-[#4E3629]'}`}>
              {patient.heartRate}
            </span>
            <span className="text-xs text-[#4E3629]/50 ml-1 font-bold">bpm</span>
          </div>
          <div className="mt-1 text-[10px] text-[#4E3629]/50 font-semibold">
            Baseline: {VITAL_THRESHOLDS.heartRate.min} - {VITAL_THRESHOLDS.heartRate.max}
          </div>
        </CardContent>
      </Card>

      {/* Blood Pressure */}
      <Card className={getVitalCardStyle(bpStatus)}>
        <CardContent className="p-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4E3629]/70">Blood Pressure</span>
            <Activity className={`h-4.5 w-4.5 ${bpStatus === 'critical' ? 'text-rose-500' : 'text-[#4E3629]/40'}`} />
          </div>
          <div className="mt-2.5">
            <span className={`text-2xl font-black ${bpStatus === 'critical' ? 'text-rose-600' : 'text-[#4E3629]'}`}>
              {patient.systolic}/{patient.diastolic}
            </span>
            <span className="text-xs text-[#4E3629]/50 ml-1 font-bold">mmHg</span>
          </div>
          <div className="mt-1 text-[10px] text-[#4E3629]/50 font-semibold">
            Baseline: {VITAL_THRESHOLDS.systolic.min}/{VITAL_THRESHOLDS.diastolic.min} - {VITAL_THRESHOLDS.systolic.max}/{VITAL_THRESHOLDS.diastolic.max}
          </div>
        </CardContent>
      </Card>

      {/* Oxygen Saturation */}
      <Card className={getVitalCardStyle(oxyStatus)}>
        <CardContent className="p-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4E3629]/70">Oxygen Saturation</span>
            <Wind className={`h-4.5 w-4.5 ${oxyStatus === 'critical' ? 'text-rose-500 animate-pulse' : 'text-[#4E3629]/40'}`} />
          </div>
          <div className="mt-2.5">
            <span className={`text-2xl font-black ${oxyStatus === 'critical' ? 'text-rose-600' : 'text-[#4E3629]'}`}>
              {patient.oxygenSat}%
            </span>
          </div>
          <div className="mt-1 text-[10px] text-[#4E3629]/50 font-semibold">
            Baseline: {VITAL_THRESHOLDS.oxygenSat.min}%+
          </div>
        </CardContent>
      </Card>

      {/* Respiratory Rate */}
      <Card className={getVitalCardStyle(respStatus)}>
        <CardContent className="p-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4E3629]/70">Respiratory Rate</span>
            <Wind className={`h-4.5 w-4.5 ${respStatus === 'critical' ? 'text-rose-500' : 'text-[#4E3629]/40'}`} />
          </div>
          <div className="mt-2.5">
            <span className={`text-2xl font-black ${respStatus === 'critical' ? 'text-rose-600' : 'text-[#4E3629]'}`}>
              {patient.respiratoryRate}
            </span>
            <span className="text-xs text-[#4E3629]/50 ml-1 font-bold">/min</span>
          </div>
          <div className="mt-1 text-[10px] text-[#4E3629]/50 font-semibold">
            Baseline: {VITAL_THRESHOLDS.respiratoryRate.min} - {VITAL_THRESHOLDS.respiratoryRate.max}
          </div>
        </CardContent>
      </Card>

      {/* Temperature */}
      <Card className={getVitalCardStyle(tempStatus)}>
        <CardContent className="p-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4E3629]/70">Body Temp</span>
            <Thermometer className={`h-4.5 w-4.5 ${tempStatus === 'critical' ? 'text-rose-500' : 'text-[#4E3629]/40'}`} />
          </div>
          <div className="mt-2.5">
            <span className={`text-2xl font-black ${tempStatus === 'critical' ? 'text-rose-600' : 'text-[#4E3629]'}`}>
              {patient.temperature}
            </span>
            <span className="text-xs text-[#4E3629]/50 ml-1 font-bold">°C</span>
          </div>
          <div className="mt-1 text-[10px] text-[#4E3629]/50 font-semibold">
            Baseline: {VITAL_THRESHOLDS.temperature.min} - {VITAL_THRESHOLDS.temperature.max}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
