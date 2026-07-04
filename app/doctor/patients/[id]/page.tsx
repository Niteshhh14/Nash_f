'use client';

import React from 'react';
import { usePatientByIdQuery } from '../../../../hooks/use-patients';
import { VitalsMonitor } from '../../../../features/patient/VitalsMonitor';
import { VitalsTrend } from '../../../../components/charts/VitalsTrend';
import { PillScheduler } from '../../../../features/medication/PillScheduler';
import { UnifiedTimeline } from '../../../../features/timeline/UnifiedTimeline';
import { ClinicalActionCenter } from '../../../../features/doctor/ClinicalActionCenter';
import { DigitalTwin3D } from '../../../../components/visualizers/DigitalTwin3D';
import { ExplainableAIPanel } from '../../../../features/doctor/ExplainableAIPanel';
import { PredictionSimulator } from '../../../../features/doctor/PredictionSimulator';
import { getRiskColor, getEmergencyBadgeColor } from '../../../../lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../../components/ui/card';
import { ArrowLeft, Cpu, Activity, Heart, Wind, Thermometer, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface PatientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PatientDetailPage({ params }: PatientDetailPageProps) {
  const resolvedParams = React.use(params);
  const patientId = resolvedParams.id;

  const { data: patient, isLoading } = usePatientByIdQuery(patientId);

  const [activeChartType, setActiveChartType] = React.useState<'heartRate' | 'bp' | 'oxygenSat' | 'respiratoryRate' | 'temperature'>('heartRate');

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-[#FAF8F5] text-[#4E3629]">
        <div className="h-8 w-24 bg-[#4E3629]/5 animate-pulse rounded-lg" />
        <div className="h-32 bg-[#4E3629]/5 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-[#4E3629]/5 animate-pulse rounded-2xl md:col-span-2" />
          <div className="h-64 bg-[#4E3629]/5 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-6 text-center bg-[#FAF8F5] text-[#4E3629]">
        <p className="text-sm font-bold text-[#4E3629]/70">Patient record not found.</p>
        <Link href="/doctor" className="text-[#C7A37E] font-semibold hover:underline mt-2 inline-block">
          Return to directory
        </Link>
      </div>
    );
  }

  const riskClass = getRiskColor(patient.riskCategory);
  const emergencyClass = getEmergencyBadgeColor(patient.emergencyStatus);

  const chartCategories: { label: string; value: typeof activeChartType; color: string; icon: any }[] = [
    { label: 'Heart Rate', value: 'heartRate', color: '#ef4444', icon: Heart },
    { label: 'Blood Pres', value: 'bp', color: '#C7A37E', icon: Activity },
    { label: 'Oxygen Sat', value: 'oxygenSat', color: '#3b82f6', icon: Wind },
    { label: 'Resp Rate', value: 'respiratoryRate', color: '#f59e0b', icon: Activity },
    { label: 'Body Temp', value: 'temperature', color: '#10b981', icon: Thermometer }
  ];

  const currentChart = chartCategories.find(c => c.value === activeChartType);

  const headerStyle = {
    fontFamily: "'Clash Display', Inter, sans-serif",
    fontWeight: 700
  };

  return (
    <div className="p-6 space-y-6 text-[#4E3629] bg-[#FAF8F5]">
      {/* Back button & title */}
      <div className="flex items-center space-x-4">
        <Link 
          href="/doctor" 
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#4E3629]/15 bg-white/70 text-[#4E3629] hover:bg-white transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="text-left">
          <h1 className="text-xl font-bold tracking-tight text-[#4E3629]" style={headerStyle}>{patient.name}</h1>
          <p className="text-xs text-[#4E3629]/70 font-semibold">Electronic Health Record: {patient.id} • Room {patient.roomNumber || 'Home'}</p>
        </div>
      </div>

      {/* Patient Header Card */}
      <Card>
        <CardContent className="p-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-[#C7A37E] to-[#9BA88D] p-[1.5px] shadow-[0_4px_15px_rgba(199,163,126,0.15)] shrink-0">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#FAF8F5] text-base font-black text-[#4E3629]">
                {patient.avatar}
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold text-[#4E3629]">{patient.name}</span>
                <span className="text-xs text-[#4E3629]/60 font-bold">{patient.age} years / {patient.gender}</span>
              </div>
              <p className="text-xs text-[#4E3629]/70 mt-1 font-semibold">Condition Profile: <span className="font-bold text-[#4E3629]">{patient.condition}</span></p>
              <p className="text-[10px] text-[#4E3629]/55 font-bold uppercase tracking-wider mt-0.5">Admitted: {patient.admissionDate || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border ${riskClass}`}>
              {patient.riskCategory} Risk
            </span>
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border ${emergencyClass}`}>
              {patient.emergencyStatus} Status
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Vitals snapshot monitors */}
      <VitalsMonitor patient={patient} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Chart, Simulator, 3D Twin, and Meds */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recharts chart trend */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#4E3629]/10 pb-4 gap-4">
              <div className="text-left">
                <CardTitle className="text-base font-semibold">Diagnostic Telemetry Timeline</CardTitle>
                <CardDescription>Select parameter to chart longitudinal trend.</CardDescription>
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto max-w-[280px] md:max-w-none no-scrollbar">
                {chartCategories.map((cat) => {
                  const CatIcon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setActiveChartType(cat.value)}
                      className={`p-1.5 rounded-lg border text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-all duration-200 shrink-0 ${
                        activeChartType === cat.value
                          ? 'bg-[#4E3629] text-[#FAF8F5] border-[#4E3629] shadow-sm'
                          : 'bg-white/50 border-[#4E3629]/10 text-[#4E3629]/70 hover:bg-white hover:text-[#4E3629]'
                      }`}
                    >
                      <CatIcon className="h-3 w-3 shrink-0" />
                      <span className="hidden sm:inline">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <VitalsTrend 
                data={patient.history} 
                type={activeChartType} 
                color={currentChart?.color}
              />
            </CardContent>
          </Card>

          {/* Interactive Prognosis Simulator factors toggles */}
          <PredictionSimulator />

          {/* 3D Digital Twin Visualizer */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#4E3629]/10 pb-4">
              <div className="text-left">
                <CardTitle className="text-base font-semibold flex items-center space-x-2">
                  <Cpu className="h-4.5 w-4.5 text-[#C7A37E]" />
                  <span>3D Digital Twin Visualizer Workspace</span>
                </CardTitle>
                <CardDescription>WebGL particle network synchronizing vital signals.</CardDescription>
              </div>
              <Link 
                href="/patient/digital-twin"
                className="text-[10px] font-bold text-[#C7A37E] hover:underline flex items-center space-x-1"
              >
                <span>Fullscreen Studio</span>
              </Link>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-96 relative rounded-[20px] overflow-hidden border border-[#4E3629]/10">
                <DigitalTwin3D 
                  heartRate={patient.heartRate} 
                  riskCategory={patient.riskCategory} 
                  interactiveMode={true}
                />
              </div>
            </CardContent>
          </Card>

          {/* Medication Compliance Grid */}
          <PillScheduler patient={patient} />
        </div>

        {/* Right Column: AI diagnostics, timeline, notes intake */}
        <div className="space-y-6">
          
          {/* Explainable AI Diagnostic Panel */}
          <ExplainableAIPanel patientId={patient.id} />

          {/* Clinical Command notes taker */}
          <ClinicalActionCenter patient={patient} />

          {/* Timeline Feed */}
          <UnifiedTimeline events={patient.timeline} />
        </div>
      </div>
    </div>
  );
}
