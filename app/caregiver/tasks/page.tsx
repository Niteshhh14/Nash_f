'use client';

import React from 'react';
import { Checklist } from '../../../features/caregiver/Checklist';

export default function CaregiverTasksPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#4E3629]">Daily Care Tasks Checklist</h1>
        <p className="text-xs text-[#4E3629]/70">Adherence verification checklist compiled from patient care instructions.</p>
      </div>

      <Checklist />
    </div>
  );
}
