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
        <h1 className="text-2xl font-bold tracking-tight text-[#4E3629]">My Personal EHR Profile</h1>
        <p className="text-xs text-[#4E3629]/70">Electronic Health Record demographics and emergency mappings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile details */}
        <Card className="border-white/55 bg-white/45 backdrop-blur-[12px] shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center space-x-2 text-[#4E3629]">
              <User className="h-4.5 w-4.5 text-[#C7A37E]" />
              <span>Demographic Registry Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 border border-[#4E3629]/10 bg-[#4E3629]/5 rounded-xl">
                <span className="text-[10px] text-[#4E3629]/55 font-bold uppercase tracking-wider block">Full Name</span>
                <span className="text-sm font-bold text-[#4E3629] mt-0.5">{patient.name}</span>
              </div>
              <div className="p-3 border border-[#4E3629]/10 bg-[#4E3629]/5 rounded-xl">
                <span className="text-[10px] text-[#4E3629]/55 font-bold uppercase tracking-wider block">Patient ID</span>
                <span className="text-sm font-bold text-[#4E3629] mt-0.5">{patient.id}</span>
              </div>
              <div className="p-3 border border-[#4E3629]/10 bg-[#4E3629]/5 rounded-xl">
                <span className="text-[10px] text-[#4E3629]/55 font-bold uppercase tracking-wider block">Age / Gender</span>
                <span className="text-sm font-bold text-[#4E3629] mt-0.5">{patient.age} / {patient.gender}</span>
              </div>
              <div className="p-3 border border-[#4E3629]/10 bg-[#4E3629]/5 rounded-xl">
                <span className="text-[10px] text-[#4E3629]/55 font-bold uppercase tracking-wider block">Condition Profile</span>
                <span className="text-sm font-bold text-[#4E3629] mt-0.5 truncate">{patient.condition}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency contact */}
        {patient.emergencyContact && (
          <Card className="border-rose-500/25 bg-rose-500/5 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-rose-700 flex items-center space-x-2">
                <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />
                <span>Emergency Liaison Configuration</span>
              </CardTitle>
              <CardDescription className="text-rose-700/60">
                Primary contact authorized to authorize critical clinical actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 border border-rose-500/10 bg-white/40 rounded-xl space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-bold text-[#4E3629]/55">Authorized Liaison</span>
                <p className="text-sm font-bold text-[#4E3629]">{patient.emergencyContact.name}</p>
                <p className="text-xs text-[#4E3629]/70">Relationship: {patient.emergencyContact.relationship}</p>
                <p className="text-[#C7A37E] font-bold text-sm mt-1">{patient.emergencyContact.phone}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
