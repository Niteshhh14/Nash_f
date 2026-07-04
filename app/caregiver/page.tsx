'use client';

import React from 'react';
import { usePatientsQuery } from '../../hooks/use-patients';
import { DependentTelemetry } from '../../features/caregiver/DependentTelemetry';
import { Checklist } from '../../features/caregiver/Checklist';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

export default function CaregiverDashboard() {
  // Caregiver CG-001 monitors PAT-001 (Sarah Jenkins) and PAT-002 (Marcus Chen)
  const { data: patients = [], isLoading } = usePatientsQuery();
  
  // Filter for caregiver's active patients
  const caregiverPatients = patients.filter(p => p.id === 'PAT-001' || p.id === 'PAT-002');

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/95">Dependent Telemetry Board</h1>
          <p className="text-xs text-neutral-400">Continuous clinical monitoring interface for mapped dependents.</p>
        </div>

        {/* Sync status */}
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4" />
          <span>Dependent Nodes Mapped</span>
        </div>
      </div>

      {/* Main split: Telemetry list and task list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dependents list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-neutral-400 uppercase tracking-wider">
            Active Dependents Telemetry
          </h2>
          <DependentTelemetry patients={caregiverPatients} isLoading={isLoading} />
        </div>

        {/* Care Checklist */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-neutral-400 uppercase tracking-wider">
            Required Directives
          </h2>
          <Checklist />
        </div>
      </div>
    </div>
  );
}
