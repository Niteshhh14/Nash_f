'use client';

import React from 'react';
import { EmergencyAlerts } from '../../../features/emergency/EmergencyAlerts';

export default function DoctorEmergencyPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-rose-500">Ward Triage Command</h1>
        <p className="text-xs text-neutral-400">Critical patient status monitoring and emergency telemetry logs.</p>
      </div>

      <EmergencyAlerts />
    </div>
  );
}
