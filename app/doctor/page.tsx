'use client';

import React, { useEffect, useState } from 'react';
import { usePatientsQuery } from '../../hooks/use-patients';
import { useAlertsQuery } from '../../hooks/use-alerts';
import { PatientGrid } from '../../features/doctor/PatientGrid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { getRiskColor, getEmergencyBadgeColor } from '../../lib/utils';
import { Activity, Bell, AlertTriangle, ShieldAlert, Cpu, Heart, CheckCircle2, Siren, ArrowRight, Eye, Calendar, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function DoctorDashboard() {
  const { data: patients = [], isLoading: patientsLoading } = usePatientsQuery();
  const { data: alerts = [], isLoading: alertsLoading } = useAlertsQuery('all');

  const [activityFeed, setActivityFeed] = useState<{ id: string; text: string; time: string; type: 'alert' | 'clinical' | 'system' }[]>([
    { id: '1', text: 'Telemetry sync completed for Telemetry-302.', time: 'Just now', type: 'system' },
    { id: '2', text: 'Sarah Jenkins: Oxygen desaturation alert triggered.', time: '2 mins ago', type: 'alert' },
    { id: '3', text: 'Dr. Vance adjusted medication dose for Sarah Jenkins.', time: '10 mins ago', type: 'clinical' }
  ]);

  // Feed updates animation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const logs = [
        'Priya Patel: Blood pressure snapshot synched.',
        'David Kim: Completed cardiac rehab workout log.',
        'Marcus Chen: Nebulizer compliance logged.',
        'Sarah Jenkins: Heart rate trending stable.',
        'Elena Rostova: Fasting glucose level sync stable.'
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setActivityFeed(prev => [
        { id: Date.now().toString(), text: randomLog, time: 'Just now', type: 'system' },
        ...prev.slice(0, 4)
      ]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');
  
  // Sort patients by risk score for Critical Queue
  const sortedPatientsQueue = [...patients].sort((a, b) => b.riskScore - a.riskScore);

  // Group count for Heatmap
  const criticalCount = patients.filter(p => p.riskCategory === 'critical').length;
  const highCount = patients.filter(p => p.riskCategory === 'high').length;
  const modCount = patients.filter(p => p.riskCategory === 'moderate').length;
  const lowCount = patients.filter(p => p.riskCategory === 'low').length;

  const headerStyle = {
    fontFamily: "'Clash Display', Inter, sans-serif",
    fontWeight: 700
  };

  return (
    <div className="p-6 space-y-6 text-[#4E3629] bg-[#FAF8F5]">
      {/* Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#4E3629]" style={headerStyle}>Clinical Mission Control</h1>
          <p className="text-xs text-[#4E3629]/70 font-semibold">Ward telemetry feed and anomaly avoidance console.</p>
        </div>

        {/* Dynamic status pill */}
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-3 py-1.5 rounded-xl text-xs font-bold">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>All Remote Hubs Synced</span>
        </div>
      </div>

      {/* Grid: Heatmap, stats, alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Heatmap and stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Heatmap */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                <Activity className="h-4.5 w-4.5 text-[#C7A37E]" />
                <span>Patient Risk Stratification Grid</span>
              </CardTitle>
              <CardDescription>
                Live count representation of ward triage categories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-2xl">
                  <span className="text-[10px] text-[#4E3629]/70 uppercase font-bold tracking-wider block">Critical</span>
                  <span className="text-2xl font-extrabold text-rose-600">{criticalCount}</span>
                </div>
                <div className="p-4 border border-orange-500/20 bg-orange-500/5 rounded-2xl">
                  <span className="text-[10px] text-[#4E3629]/70 uppercase font-bold tracking-wider block">High</span>
                  <span className="text-2xl font-extrabold text-orange-600">{highCount}</span>
                </div>
                <div className="p-4 border border-amber-500/20 bg-amber-500/5 rounded-2xl">
                  <span className="text-[10px] text-[#4E3629]/70 uppercase font-bold tracking-wider block">Moderate</span>
                  <span className="text-2xl font-extrabold text-amber-600">{modCount}</span>
                </div>
                <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl">
                  <span className="text-[10px] text-[#4E3629]/70 uppercase font-bold tracking-wider block">Low</span>
                  <span className="text-2xl font-extrabold text-emerald-600">{lowCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Directory */}
          <div className="space-y-4">
            <h2 className="text-xs font-extrabold text-[#4E3629]/60 uppercase tracking-wider pl-1">
              EHR Patient Telemetry Directory
            </h2>
            <PatientGrid patients={patients} isLoading={patientsLoading} />
          </div>
        </div>

        {/* Right Col: Queues, Alerts, Logs */}
        <div className="space-y-6">
          {/* Critical Patients Queue */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />
                <span>Critical Triage Queue</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[300px] overflow-y-auto">
              {patientsLoading ? (
                <div className="p-4 h-16 bg-[#4E3629]/5 animate-pulse rounded-xl" />
              ) : sortedPatientsQueue.filter(p => p.riskScore > 50).length === 0 ? (
                <div className="p-6 text-center text-xs text-[#4E3629]/60">
                  No high-risk patients registered.
                </div>
              ) : (
                <div className="divide-y divide-[#4E3629]/10">
                  {sortedPatientsQueue.filter(p => p.riskScore > 50).map((p) => {
                    const riskStyle = getRiskColor(p.riskCategory);
                    return (
                      <Link 
                        key={p.id} 
                        href={`/doctor/patients/${p.id}`}
                        className="flex items-center justify-between p-4 hover:bg-[#4E3629]/3 transition-colors duration-155"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-[#4E3629]">{p.name}</p>
                          <p className="text-[10px] text-[#4E3629]/70 font-semibold">{p.condition}</p>
                        </div>
                        <div className="flex items-center space-x-3.5">
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${riskStyle}`}>
                            {p.riskScore}%
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-[#4E3629]/40" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Alerts list */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                <Bell className="h-4.5 w-4.5 text-[#C7A37E]" />
                <span>Physiological Alerts Ticker</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {activeAlerts.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#4E3629]/60 flex flex-col items-center justify-center space-y-1">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  <p className="font-bold text-[#4E3629]/70 mt-1">Vitals Stable</p>
                </div>
              ) : (
                <div className="divide-y divide-[#4E3629]/10">
                  {activeAlerts.slice(0, 4).map((alert) => (
                    <div key={alert.id} className="p-4 flex flex-col justify-between space-y-1 text-left">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#4E3629]">{alert.patientName}</span>
                        <span className="text-[9px] uppercase font-bold text-rose-600 bg-rose-500/10 border border-rose-500/20 px-1.5 rounded">
                          {alert.type}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-[#4E3629]/70 font-semibold">Trigger: {alert.value} (ref {alert.baseline})</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                <Cpu className="h-4.5 w-4.5 text-[#C7A37E]" />
                <span>Live Telemetry Activity Log</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {activityFeed.map((feed) => (
                    <motion.div
                      key={feed.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start space-x-2.5 text-[10px] leading-relaxed border-b border-[#4E3629]/5 pb-2 text-left"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C7A37E] mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-[#4E3629]/80 font-semibold">{feed.text}</p>
                        <span className="text-[#4E3629]/40 text-[9px] font-bold">{feed.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
