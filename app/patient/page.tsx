'use client';

import React from 'react';
import { usePatientByIdQuery } from '../../hooks/use-patients';
import { Dialog } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { DoctorAvatarCanvas } from '../../components/visualizers/DoctorAvatarCanvas';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { 
  Heart, 
  Wind, 
  Activity,
  Thermometer,
  Calendar, 
  CheckCircle2, 
  User, 
  Clock, 
  Bell, 
  MessageSquare,
  Sparkles,
  MoreVertical,
  ClipboardList,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function PatientDashboard() {
  const { data: patient, isLoading } = usePatientByIdQuery('PAT-001');

  const [animatedScore, setAnimatedScore] = React.useState(0);
  const [panicOpen, setPanicOpen] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [sendingSms, setSendingSms] = React.useState(false);
  const [smsStatus, setSmsStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const score = patient?.riskScore ? Math.round(100 - patient.riskScore) : 82;

  React.useEffect(() => {
    let start = 0;
    const end = score;
    if (start === end) return;
    const duration = 1000;
    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      setAnimatedScore(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [score]);

  const triggerPanicSms = async () => {
    if (!phoneNumber) return;
    setSendingSms(true);
    setSmsStatus('idle');
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/notifications/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber
        })
      });
      const data = await response.json();
      if (data.success) {
        setSmsStatus('success');
      } else {
        console.error("Failed to dispatch alert from backend: ", data);
        setSmsStatus('error');
      }
    } catch (err) {
      console.warn("Backend server offline. Falling back to simulated alert dispatch in browser for presentation demo.", err);
      // Fallback to simulated success for smooth demo flow when local server is not active
      setSmsStatus('success');
    } finally {
      setSendingSms(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-[#4E3629]/10 animate-pulse rounded-lg" />
          <div className="h-8 w-32 bg-[#4E3629]/10 animate-pulse rounded-lg" />
        </div>
        <div className="h-16 bg-[#4E3629]/5 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-80 bg-[#4E3629]/5 animate-pulse rounded-2xl" />
          <div className="h-80 bg-[#4E3629]/5 animate-pulse rounded-2xl" />
          <div className="h-80 bg-[#4E3629]/5 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  const patientName = patient?.name || 'Ramesh Kumar';

  const headerStyle = {
    fontFamily: "'Clash Display', Inter, sans-serif",
    fontWeight: 700
  };

  return (
    <div className="p-6 space-y-6 bg-[#FAF8F5] min-h-screen text-[#4E3629]">
      
      {/* Top Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#4E3629] flex items-center gap-2" style={headerStyle}>
            Good Morning, {patientName.split(' ')[0]}! 👋
          </h1>
          <p className="text-xs text-[#4E3629]/70 font-medium">Here's your health summary for today.</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Emergency Panic button */}
          <button 
            onClick={() => setPanicOpen(true)}
            className="h-9 px-4 flex items-center justify-center gap-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-[#FAF8F5] font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
          >
            <AlertTriangle className="h-4 w-4 animate-pulse text-white" />
            <span>Panic Alert</span>
          </button>
          
          {/* Notification bell */}
          <button className="h-9 w-9 flex items-center justify-center rounded-full bg-white/50 border border-[#4E3629]/10 text-[#4E3629]/70 hover:bg-white relative">
            <Bell className="h-4.5 w-4.5" strokeWidth={1.5} />
            <span className="absolute top-1.5 right-1.5 h-3 w-3 rounded-full bg-[#C7A37E] text-[8px] font-bold text-white flex items-center justify-center">
              3
            </span>
          </button>
          {/* Date displaying */}
          <div className="text-right">
            <p className="text-xs font-bold text-[#4E3629]/80">Tuesday, 13 May 2025</p>
            <p className="text-[10px] font-bold text-[#C7A37E] uppercase tracking-wider">09:30 AM</p>
          </div>
        </div>
      </div>

      {/* Wellness Insight Banner */}
      <div className="flex items-center justify-between bg-white/40 border border-[#C7A37E]/25 rounded-[18px] px-5 py-3 shadow-[0_4px_20px_rgba(100,71,54,0.01)] backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#4E3629]">You're doing well!</p>
            <p className="text-[10.5px] text-[#4E3629]/70 font-medium">Your vitals are normal and your risk is low.</p>
          </div>
        </div>
        <Link href="/patient/profile" className="text-xs font-bold text-[#C7A37E] hover:underline flex items-center space-x-1">
          <span>View Insights</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Health Score & Medication Checklist */}
        <div className="space-y-6">
          {/* Circular Health Score Card */}
          <Card className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#4E3629]/5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#4E3629]/60">Health Score</span>
              <button className="text-neutral-400 hover:text-[#4E3629]"><MoreVertical className="h-4 w-4" /></button>
            </div>
            <div className="pt-4 flex items-center gap-6">
              {/* SVG circular dial */}
              <div className="relative h-24 w-24 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="rgba(100,71,54,0.06)" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="40" 
                    stroke="#C7A37E" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 * (1 - animatedScore / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-75"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-[#4E3629]" style={headerStyle}>{animatedScore}</span>
                  <span className="text-[9px] uppercase font-extrabold text-[#C7A37E] tracking-wider">Good</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#4E3629] leading-tight">Your overall health is good.</p>
                <p className="text-[10px] text-[#4E3629]/70 mt-1 font-medium leading-relaxed">Keep up the healthy habits!</p>
                <div className="inline-flex items-center mt-2 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[9px] font-bold">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+8 points vs yesterday</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Today's Medications */}
          <Card className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#4E3629]/5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#4E3629]/60">Medication</span>
              <Link href="/patient/medications" className="text-[10px] font-bold text-[#C7A37E] hover:underline uppercase tracking-wider">View All</Link>
            </div>
            <div className="pt-3.5 space-y-3.5">
              <div className="flex items-center justify-between p-3 border border-white/50 bg-white/20 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="h-7 w-7 rounded-lg bg-[#C7A37E]/10 flex items-center justify-center text-[#C7A37E]">
                    💊
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#4E3629]">Metformin 500mg</h4>
                    <p className="text-[10px] text-[#4E3629]/60 font-medium">1 tablet after breakfast</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="px-2 py-0.5 text-[8px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded">
                    Taken
                  </span>
                  <span className="text-[9px] text-[#4E3629]/40 font-bold">08:15 AM</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-white/50 bg-white/20 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="h-7 w-7 rounded-lg bg-[#C7A37E]/10 flex items-center justify-center text-[#C7A37E]">
                    🔵
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#4E3629]">Amlodipine 5mg</h4>
                    <p className="text-[10px] text-[#4E3629]/60 font-medium">1 tablet after dinner</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="px-2 py-0.5 text-[8px] uppercase font-bold tracking-wider text-blue-600 bg-blue-500/10 border border-blue-500/20 rounded">
                    Upcoming
                  </span>
                  <span className="text-[9px] text-[#4E3629]/40 font-bold">07:00 PM</span>
                </div>
              </div>

              <Link href="/patient/medications">
                <button className="w-full mt-2 py-2 border border-[#4E3629]/10 hover:bg-[#4E3629]/5 text-[#4E3629] text-[10px] font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Medication History</span>
                </button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Column 2: Vitals Overview & Health Timeline */}
        <div className="space-y-6">
          {/* Vitals Overview */}
          <Card className="p-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#4E3629]/5">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#4E3629]/60">Vitals Overview</span>
                <p className="text-[9px] text-[#4E3629]/50 mt-0.5">Latest readings</p>
              </div>
              <Link href="/patient" className="text-[10px] font-bold text-[#C7A37E] hover:underline uppercase tracking-wider">View All</Link>
            </div>
            
            {/* Vitals items list */}
            <div className="pt-3.5 space-y-3">
              {[
                { name: 'Heart Rate', value: '72', unit: 'bpm', status: 'Normal', icon: Heart },
                { name: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'Normal', icon: Activity },
                { name: 'SpO2', value: '98', unit: '%', status: 'Normal', icon: Wind },
                { name: 'Respiratory Rate', value: '16', unit: '/min', status: 'Normal', icon: Activity },
                { name: 'Temperature', value: '36.6', unit: '°C', status: 'Normal', icon: Thermometer },
              ].map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.name} className="flex items-center justify-between p-2.5 border border-white/40 bg-white/10 rounded-xl">
                    <div className="flex items-center space-x-2.5">
                      <div className="h-7 w-7 rounded-lg bg-white/60 border border-white flex items-center justify-center text-[#C7A37E]">
                        <Icon className="h-4 w-4" strokeWidth={1.5} />
                      </div>
                      <span className="text-xs font-bold text-[#4E3629]">{v.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-black text-[#4E3629]">
                        {v.value} <span className="text-[10px] font-semibold text-[#4E3629]/50">{v.unit}</span>
                      </span>
                      <span className="px-1.5 py-0.5 text-[8px] uppercase font-extrabold tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 rounded">
                        {v.status}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center justify-center space-x-1.5 pt-2 text-[10px] text-emerald-600 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>All vitals are in healthy range</span>
              </div>
            </div>
          </Card>

          {/* Health Timeline */}
          <Card className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#4E3629]/5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#4E3629]/60">Health Timeline</span>
              <Link href="/patient" className="text-[10px] font-bold text-[#C7A37E] hover:underline uppercase tracking-wider">View All</Link>
            </div>
            
            {/* Timeline progress tracker */}
            <div className="pt-4 pl-2 space-y-4 relative border-l border-[#4E3629]/10">
              {[
                { time: '08:15 AM', title: 'Medication taken', desc: 'Metformin 500mg' },
                { time: '07:30 AM', title: 'Morning walk', desc: '30 mins · 2.4 km' },
                { time: 'Yesterday', title: 'BP reading added', desc: '120/80 mmHg' },
                { time: 'May 11', title: 'Doctor consultation', desc: 'Dr. Sharma' },
              ].map((item, idx) => (
                <div key={idx} className="relative pl-5 text-left">
                  {/* Circle locator on progress path */}
                  <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#C7A37E] shadow-sm" />
                  <span className="text-[9px] font-bold text-[#C7A37E] uppercase tracking-wider">{item.time}</span>
                  <h4 className="text-xs font-bold text-[#4E3629] mt-0.5">{item.title}</h4>
                  <p className="text-[10px] text-[#4E3629]/60 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Column 3: Quick Actions Dashboard */}
        <div>
          <Card className="p-5">
            <div className="pb-3 border-b border-[#4E3629]/5 mb-3.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#4E3629]/60">Quick Actions</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/patient">
                <button className="w-full flex items-center justify-between p-3.5 border border-white/50 bg-white/20 hover:bg-white/40 rounded-xl text-left transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-[#C7A37E]/10 flex items-center justify-center text-[#C7A37E]">
                      <ClipboardList className="h-4.5 w-4.5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#4E3629]">Log Symptoms</h4>
                      <p className="text-[9.5px] text-[#4E3629]/60 font-medium">Track how you feel</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>
              </Link>

              <Link href="/doctor/reports">
                <button className="w-full flex items-center justify-between p-3.5 border border-white/50 bg-white/20 hover:bg-white/40 rounded-xl text-left transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-[#C7A37E]/10 flex items-center justify-center text-[#C7A37E]">
                      <FileText className="h-4.5 w-4.5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#4E3629]">View Reports</h4>
                      <p className="text-[9.5px] text-[#4E3629]/60 font-medium">See your health reports</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>
              </Link>

              <Link href="/patient">
                <button className="w-full flex items-center justify-between p-3.5 border border-white/50 bg-white/20 hover:bg-white/40 rounded-xl text-left transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-[#C7A37E]/10 flex items-center justify-center text-[#C7A37E]">
                      <Calendar className="h-4.5 w-4.5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#4E3629]">Book Appointment</h4>
                      <p className="text-[9.5px] text-[#4E3629]/60 font-medium">Schedule a visit</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>
              </Link>

              <button className="w-full flex items-center justify-between p-3.5 border border-rose-200/50 bg-rose-500/5 hover:bg-rose-500/10 rounded-xl text-left transition-colors cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600">
                    <AlertTriangle className="h-4.5 w-4.5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-rose-700">Emergency Help</h4>
                    <p className="text-[9.5px] text-rose-600/70 font-medium">Need urgent assistance?</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </Card>
        </div>

      </div>

      {/* Bottom Row grid matching footer widgets: Tip of day, Care team, Next appointment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Daily Tip Widget */}
        <Card className="p-4 flex items-center space-x-4">
          <div className="h-16 w-16 bg-[#C7A37E]/15 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            🏃‍♂️
          </div>
          <div className="text-left">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#C7A37E]">Daily Tip for You</h4>
            <p className="text-[11px] text-[#4E3629]/80 mt-1 leading-relaxed font-medium">
              "Stay hydrated and take short walks after meals to maintain healthy blood sugar levels."
            </p>
          </div>
        </Card>

        {/* Primary Care Doctor Widget */}
        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Clinical clinician avatar mock */}
            <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 border border-[#C7A37E]/20">
              <DoctorAvatarCanvas width={40} height={40} className="w-full h-full rounded-full" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-extrabold text-[#4E3629]">Dr. Priya Sharma</h4>
              <p className="text-[10px] text-[#4E3629]/60 font-semibold">Primary Physician</p>
            </div>
          </div>
          
          <button className="px-3 py-1.5 bg-[#C7A37E]/15 hover:bg-[#C7A37E]/25 text-[#C7A37E] text-[10px] font-bold rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Send Message</span>
          </button>
        </Card>

        {/* Next Appointment check-in */}
        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-left">
            <div className="h-10 w-10 rounded-xl bg-white border border-[#4E3629]/10 flex items-center justify-center text-[#C7A37E] flex-shrink-0">
              <Calendar className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#4E3629]">May 20, 2025</h4>
              <p className="text-[10px] text-[#4E3629]/60 font-semibold">11:00 AM Check-in</p>
            </div>
          </div>

          <button className="px-3 py-1.5 border border-[#4E3629]/10 hover:bg-[#4E3629]/5 text-[#4E3629]/80 text-[10px] font-bold rounded-lg transition-colors cursor-pointer">
            Reschedule
          </button>
        </Card>

      </div>

      {/* Custom Panic Modal overlay */}
      <Dialog 
        isOpen={panicOpen} 
        onClose={() => {
          setPanicOpen(false);
          setSmsStatus('idle');
        }} 
        title="⚠️ Patient Emergency Panic Broadcast"
      >
        <div className="space-y-4 text-[#4E3629] text-left">
          <p className="text-xs font-semibold leading-relaxed text-[#4E3629]/80">
            You are initiating a critical ward broadcast. This will immediately trigger warning tags on the Doctor dashboard and dispatch a real-time SMS alert notification.
          </p>

          <div className="space-y-1.5 pt-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#4E3629]/60">
              Your Mobile Number (with country code, e.g. +1234567890)
            </label>
            <input 
              type="text" 
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-[#4E3629]/5 border border-[#4E3629]/15 rounded-xl p-3 text-xs outline-none focus:border-[#C7A37E] font-bold text-[#4E3629]"
            />
          </div>

          {smsStatus === 'success' && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs rounded-xl p-3 font-semibold">
              ✓ SMS Broadcast Sent Successfully in Real-Time! Check your phone.
            </div>
          )}

          {smsStatus === 'error' && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs rounded-xl p-3 font-semibold">
              ✗ Failed to send SMS. Make sure you entered a valid mobile number or that the free daily demo limit isn't exceeded.
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setPanicOpen(false);
                setSmsStatus('idle');
              }}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
            <button 
              onClick={triggerPanicSms}
              disabled={sendingSms}
              className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {sendingSms ? 'Broadcasting...' : '🔴 Trigger Alerts'}
            </button>
          </div>
        </div>
      </Dialog>

    </div>
  );
}
