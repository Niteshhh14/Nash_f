'use client';

import React from 'react';
import { usePatientByIdQuery } from '../../../hooks/use-patients';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../components/ui/card';
import { User, ShieldAlert, FileText, CheckCircle } from 'lucide-react';

export default function PatientProfilePage() {
  const { data: patient, isLoading } = usePatientByIdQuery('PAT-001');

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-10 bg-white/5 animate-pulse rounded-lg" />
        <div className="h-48 bg-white/5 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-6 text-sm text-neutral-500">
        Profile data unavailable.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white/95">My Personal EHR Profile</h1>
        <p className="text-xs text-neutral-400">Electronic Health Record demographics and emergency mappings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile details */}
        <Card className="border-white/5 bg-black/30">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center space-x-2">
              <User className="h-4.5 w-4.5 text-cyan-400" />
              <span>Demographic Registry Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 border border-white/5 bg-black/20 rounded-xl">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Full Name</span>
                <span className="text-sm font-bold text-white/90 mt-0.5">{patient.name}</span>
              </div>
              <div className="p-3 border border-white/5 bg-black/20 rounded-xl">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Patient ID</span>
                <span className="text-sm font-bold text-white/90 mt-0.5">{patient.id}</span>
              </div>
              <div className="p-3 border border-white/5 bg-black/20 rounded-xl">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Age / Gender</span>
                <span className="text-sm font-bold text-white/90 mt-0.5">{patient.age} / {patient.gender}</span>
              </div>
              <div className="p-3 border border-white/5 bg-black/20 rounded-xl">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Condition Profile</span>
                <span className="text-sm font-bold text-white/90 mt-0.5 truncate">{patient.condition}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency contact */}
        {patient.emergencyContact && (
          <Card className="border-rose-500/10 bg-rose-950/5">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-rose-400 flex items-center space-x-2">
                <ShieldAlert className="h-4.5 w-4.5" />
                <span>Emergency Liaison Configuration</span>
              </CardTitle>
              <CardDescription className="text-rose-400/50">
                Primary contact authorized to authorize critical clinical actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 border border-rose-500/10 bg-black/30 rounded-xl space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-500">Authorized Liaison</span>
                <p className="text-sm font-bold text-white/90">{patient.emergencyContact.name}</p>
                <p className="text-xs text-neutral-400">Relationship: {patient.emergencyContact.relationship}</p>
                <p className="text-cyan-400 font-bold text-sm mt-1">{patient.emergencyContact.phone}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
