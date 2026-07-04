'use client';

import React from 'react';
import { usePatientsQuery } from '../../../hooks/use-patients';
import { PatientGrid } from '../../../features/doctor/PatientGrid';

export default function DoctorPatientsPage() {
  const { data: patients = [], isLoading } = usePatientsQuery();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white/95">Clinical Patient Directory</h1>
        <p className="text-xs text-neutral-400">Search and filter active patient profiles mapped to electronic health records.</p>
      </div>

      <PatientGrid patients={patients} isLoading={isLoading} />
    </div>
  );
}
