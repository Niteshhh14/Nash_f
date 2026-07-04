'use client';

import React from 'react';
import { usePatientByIdQuery } from '../../../hooks/use-patients';
import { PillScheduler } from '../../../features/medication/PillScheduler';

export default function PatientMedicationsPage() {
  const { data: patient, isLoading } = usePatientByIdQuery('PAT-001');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white/95">Pharmacotherapy Log</h1>
        <p className="text-xs text-neutral-400">Track and manage daily medication compliance schedules.</p>
      </div>

      {isLoading ? (
        <div className="h-64 bg-white/5 animate-pulse rounded-2xl" />
      ) : patient ? (
        <PillScheduler patient={patient} allowEdit={true} />
      ) : (
        <div className="text-sm text-neutral-500">Log credentials missing.</div>
      )}
    </div>
  );
}
