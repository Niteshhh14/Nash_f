'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { DoctorAvatarCanvas } from '../components/visualizers/DoctorAvatarCanvas';
import { TextRotate } from '../components/ui/text-rotate';
import { Card, CardContent } from '../components/ui/card';
import { FloatingPaths } from '../components/ui/background-paths';
import {
  Activity,
  Heart,
  Wind,
  Shield,
  Cpu,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Brain,
  Clock,
  Sparkles,
  Layers,
  Volume2,
  Users,
  AlertCircle,
  ChevronRight,
  Database,
  ArrowDown
} from 'lucide-react';

const AnimatedECG = () => {
  return (
    <div className="h-12 w-full bg-white/25 border border-white/45 rounded-xl relative overflow-hidden flex items-center justify-center shadow-[inset_0_1px_3px_rgba(100,71,54,0.02)]">
      <svg className="w-full h-full stroke-[#C7A37E] drop-shadow-[0_0_2px_rgba(199,163,126,0.3)]" viewBox="0 0 200 48" fill="none">
        <motion.path
          d="M 0 24 L 35 24 L 40 20 L 45 28 L 48 24 L 52 24 L 56 6 L 60 42 L 64 24 L 68 24 L 74 20 L 80 24 L 115 24 L 120 20 L 125 28 L 128 24 L 132 24 L 136 6 L 140 42 L 144 24 L 148 24 L 154 20 L 160 24 L 200 24"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ strokeDasharray: "200", strokeDashoffset: "200" }}
          animate={{ strokeDashoffset: [200, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </svg>
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-[#C7A37E]/3 pointer-events-none" />
    </div>
  );
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('problem');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) / 35,
        y: (e.clientY - window.innerHeight / 2) / 35,
      });
    };
    
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      const sections = ['problem', 'workflow', 'features', 'twin-showcase'];
      const scrollPosition = window.scrollY + 180;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 90 } }
  };

  const stepsList = [
    { label: 'Patient', desc: 'Outpatient biometric telemetry stream active at home.', icon: Heart },
    { label: 'Monitoring', desc: 'Realtime data syncs continuously to Nash servers.', icon: Database },
    { label: 'AI Risk Engine', desc: 'Deep networks predict risk thresholds & explain factors.', icon: Brain },
    { label: 'Doctor', desc: 'Clinicians monitor alerts & adjust therapeutics via control.', icon: Activity },
    { label: 'Caregiver', desc: 'Liaison receives medication compliance logs & directives.', icon: Users },
    { label: 'Prevention', desc: 'Timely home intervention avoids emergency readmissions.', icon: ShieldCheck }
  ];

  const headerStyle = {
    fontFamily: "'Clash Display', Inter, system-ui, -apple-system, sans-serif",
    fontWeight: 700
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#4E3629] relative flex flex-col font-sans selection:bg-[#C7A37E]/30 selection:text-[#4E3629] overflow-hidden">
      
      {/* Slow moving physiological background paths */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* FLOATING GLASS NAVBAR */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-6 pt-4 pointer-events-none">
        <header
          className={`w-full max-w-5xl rounded-full border border-white/35 bg-white/45 backdrop-blur-[24px] transition-all duration-300 pointer-events-auto flex items-center justify-between shadow-[0_8px_32px_rgba(100,71,54,0.02)] ${
            isScrolled ? 'px-6 py-2 bg-white/60 border-white/50 shadow-[0_8px_32px_rgba(100,71,54,0.05)]' : 'px-8 py-3.5'
          }`}
        >
          {/* Logo */}
          <div className="flex items-center space-x-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4E3629] text-[#FAF8F5] font-bold text-xs">
              N
            </div>
            <span className="text-sm tracking-tight" style={headerStyle}>
              Nash <span className="font-semibold text-[#C7A37E]">OS</span>
            </span>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center space-x-8 text-[11px] font-bold uppercase tracking-wider text-[#4E3629]/75">
            {['problem', 'workflow', 'features', 'twin-showcase'].map((sec) => {
              const label = sec === 'twin-showcase' ? 'Digital Twin' : sec === 'workflow' ? 'How It Works' : sec;
              return (
                <a
                  key={sec}
                  href={`#${sec}`}
                  onClick={(e) => handleScrollTo(e, sec)}
                  className={`relative py-1 hover:text-[#C7A37E] transition-colors duration-200 ${
                    activeSection === sec ? 'text-[#C7A37E]' : ''
                  }`}
                >
                  <span>{label}</span>
                  {activeSection === sec && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C7A37E] shadow-[0_0_4px_rgba(199,163,126,0.3)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* CTAs */}
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-[#4E3629] hover:bg-[#4E3629]/5 cursor-pointer">
                Login
              </Button>
            </Link>
            <Link href="/login">
              <button className="px-4 py-2 bg-[#C7A37E] hover:bg-[#C7A37E]/95 hover:translate-y-[-1px] text-[#4E3629] text-xs font-bold rounded-full shadow-[0_2px_10px_rgba(199,163,126,0.15)] transition-all duration-200 cursor-pointer">
                Get Started
              </button>
            </Link>
          </div>
        </header>
      </div>

      {/* HERO SECTION WITH FANCY FLOATING CARDS */}
      <section className="relative w-full overflow-hidden min-h-[920px] lg:min-h-[960px] flex items-center justify-center pt-28 pb-12 z-10">
        
        {/* BACKGROUND PATHS CONTAINER */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <FloatingPaths position={1} />
        </div>

        {/* FLOATING HEALTHCARE UI CARDS (Hidden on mobile/tablet to avoid overlapping text, beautifully placed on desktop) */}
        <div className="hidden xl:block absolute inset-0 pointer-events-none z-10">
          
          {/* FLOATING CARD 1: AI Health Score (Top Left) */}
          <motion.div
            style={{ x: mousePos.x * 0.7, y: mousePos.y * 0.7, rotate: -4 }}
            whileHover={{ y: -6, scale: 1.03 }}
            className="absolute top-[18%] left-[6%] w-48 rounded-[24px] bg-white/45 backdrop-blur-[12px] border border-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-[#644736] pointer-events-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#644736]/10 text-[9px] font-extrabold uppercase tracking-widest text-[#644736]/60">
              <span>AI Health Score</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="pt-2.5 flex items-center space-x-3">
              <div className="relative h-11 w-11 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="22" cy="22" r="18" stroke="rgba(100,71,54,0.06)" strokeWidth="3.5" fill="transparent" />
                  <circle cx="22" cy="22" r="18" stroke="#C7A37E" strokeWidth="3.5" fill="transparent" strokeDasharray="113" strokeDashoffset="9" strokeLinecap="round" />
                </svg>
                <span className="absolute text-xs font-black">92</span>
              </div>
              <div className="text-left">
                <p className="text-[11px] font-extrabold leading-none">Excellent</p>
                <p className="text-[9px] text-[#644736]/60 font-semibold mt-0.5">Continuous Sync</p>
              </div>
            </div>
          </motion.div>

          {/* FLOATING CARD 2: Live Heart Rate (Top Right) */}
          <motion.div
            style={{ x: mousePos.x * 1.3, y: mousePos.y * 1.3, rotate: 3 }}
            whileHover={{ y: -6, scale: 1.03 }}
            className="absolute top-[22%] right-[8%] w-48 rounded-[24px] bg-white/45 backdrop-blur-[12px] border border-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-[#644736] pointer-events-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#644736]/10 text-[9px] font-extrabold uppercase tracking-widest text-[#644736]/60">
              <span>Live Heart Rate</span>
              <Heart className="h-3 w-3 text-rose-500 animate-pulse" />
            </div>
            <div className="pt-2 text-left">
              <div className="flex items-baseline space-x-0.5">
                <span className="text-xl font-black">72</span>
                <span className="text-[9px] font-bold text-[#644736]/60">bpm</span>
              </div>
              <svg viewBox="0 0 100 20" className="w-full h-5 text-rose-500/80 mt-1.5">
                <path d="M0 10 H30 L35 2 L40 18 L45 8 L50 12 L55 10 H100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.div>

          {/* FLOATING CARD 3: Blood Pressure (Bottom Left) */}
          <motion.div
            style={{ x: mousePos.x * 0.9, y: mousePos.y * 0.9, rotate: -2 }}
            whileHover={{ y: -6, scale: 1.03 }}
            className="absolute bottom-[24%] left-[8%] w-44 rounded-[24px] bg-white/45 backdrop-blur-[12px] border border-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-[#644736] pointer-events-auto"
          >
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#644736]/60 pb-1.5 border-b border-[#644736]/10">Blood Pressure</div>
            <div className="pt-2 text-left">
              <div className="text-lg font-black leading-none">120 / 80</div>
              <div className="flex items-center mt-1.5 text-[8.5px] font-bold text-emerald-600 bg-emerald-500/10 rounded px-1.5 py-0.5 w-max">
                <span>Stable</span>
              </div>
            </div>
          </motion.div>

          {/* FLOATING CARD 4: Oxygen Saturation (Bottom Right) */}
          <motion.div
            style={{ x: mousePos.x * 1.15, y: mousePos.y * 1.15, rotate: 4 }}
            whileHover={{ y: -6, scale: 1.03 }}
            className="absolute bottom-[28%] right-[6%] w-44 rounded-[24px] bg-white/45 backdrop-blur-[12px] border border-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-[#644736] pointer-events-auto"
          >
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#644736]/60 pb-1.5 border-b border-[#644736]/10">O2 Saturation</div>
            <div className="pt-2.5 flex items-center justify-between">
              <span className="text-xl font-black">98%</span>
              <div className="h-6 w-6 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
            </div>
          </motion.div>

          {/* FLOATING CARD 5: Medication Check (Mid Left) */}
          <motion.div
            style={{ x: mousePos.x * 0.8, y: mousePos.y * 0.8, rotate: 2 }}
            whileHover={{ y: -6, scale: 1.03 }}
            className="absolute top-[48%] left-[4%] w-48 rounded-[24px] bg-white/45 backdrop-blur-[12px] border border-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-[#644736] pointer-events-auto"
          >
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#644736]/60 pb-1 border-b border-[#644736]/10">Medication</div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 text-xs font-bold">✓</div>
              <span className="text-[10px] font-extrabold text-[#644736]/80">Morning Dose Taken</span>
            </div>
          </motion.div>

          {/* FLOATING CARD 6: Doctor Alert (Top Mid Right) */}
          <motion.div
            style={{ x: mousePos.x * 1.4, y: mousePos.y * 1.4, rotate: -3 }}
            whileHover={{ y: -6, scale: 1.03 }}
            className="absolute top-[12%] right-[26%] w-48 rounded-[24px] bg-white/45 backdrop-blur-[12px] border border-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-[#644736] pointer-events-auto"
          >
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#644736]/60 pb-1.5 border-b border-[#644736]/10">Doctor Alert</div>
            <div className="mt-2 flex flex-col text-left">
              <span className="text-[11px] font-extrabold text-[#644736]">Patient Stable</span>
              <span className="text-[8px] text-[#644736]/50 font-bold mt-0.5">Last updated 2 min ago</span>
            </div>
          </motion.div>

          {/* FLOATING CARD 7: Upcoming Appointment (Bottom Mid Left) */}
          <motion.div
            style={{ x: mousePos.x * 0.65, y: mousePos.y * 0.65, rotate: 3 }}
            whileHover={{ y: -6, scale: 1.03 }}
            className="absolute bottom-[10%] left-[24%] w-48 rounded-[24px] bg-white/45 backdrop-blur-[12px] border border-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-[#644736] pointer-events-auto"
          >
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#644736]/60 pb-1.5 border-b border-[#644736]/10">Check-in</div>
            <div className="mt-2 text-left">
              <div className="text-[11px] font-extrabold">Tomorrow</div>
              <div className="text-[9.5px] text-[#C7A37E] font-extrabold mt-0.5">09:30 AM</div>
            </div>
          </motion.div>

          {/* FLOATING CARD 8: Digital Twin Preview (Bottom Mid Right) */}
          <motion.div
            style={{ x: mousePos.x * 1.35, y: mousePos.y * 1.35, rotate: -1 }}
            whileHover={{ y: -6, scale: 1.03 }}
            className="absolute bottom-[12%] right-[24%] w-44 rounded-[24px] bg-white/45 backdrop-blur-[12px] border border-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-[#644736] pointer-events-auto"
          >
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#644736]/60 pb-1.5 border-b border-[#644736]/10">Digital Twin</div>
            <div className="flex items-center space-x-3 pt-2">
              <svg viewBox="0 0 100 200" className="w-6 h-10 text-[#C7A37E]/80 animate-pulse">
                <path d="M50 15c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zm0 10c-15 0-22 8-22 25v30c0 4 3 7 7 7h3v60c0 8 6 15 12 15s12-7 12-15V87h3c4 0 7-3 7-7V50c0-17-7-25-22-25z" fill="currentColor" />
              </svg>
              <span className="text-[9.5px] font-extrabold text-[#644736]/80 leading-tight">Body model active</span>
            </div>
          </motion.div>

          {/* FLOATING CARD 9: AI Recommendation (Mid Right) */}
          <motion.div
            style={{ x: mousePos.x * 0.95, y: mousePos.y * 0.95, rotate: -2 }}
            whileHover={{ y: -6, scale: 1.03 }}
            className="absolute top-[46%] right-[3%] w-52 rounded-[24px] bg-white/45 backdrop-blur-[12px] border border-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-[#644736] pointer-events-auto"
          >
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#644736]/60 pb-1.5 border-b border-[#644736]/10">AI Directive</div>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {['Hydrate', 'Rest', 'Continue Meds'].map((rec) => (
                <span key={rec} className="text-[8px] font-bold px-2 py-0.5 bg-[#644736]/5 border border-[#644736]/10 rounded-full">{rec}</span>
              ))}
            </div>
          </motion.div>

          {/* FLOATING CARD 10: Caregiver Notification (Mid Left Near Hero) */}
          <motion.div
            style={{ x: mousePos.x * 0.75, y: mousePos.y * 0.75, rotate: 1 }}
            whileHover={{ y: -6, scale: 1.03 }}
            className="absolute top-[34%] left-[24%] w-48 rounded-[24px] bg-white/45 backdrop-blur-[12px] border border-white/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-[#644736] pointer-events-auto"
          >
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#644736]/60 pb-1 border-b border-[#644736]/10">Care Network</div>
            <div className="mt-2 flex items-center space-x-2 text-[10px] font-extrabold text-[#644736]/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Everything normal</span>
            </div>
          </motion.div>

        </div>

        {/* CENTRAL HERO TEXT LAYOUT (Centered on desktop, stacks responsively) */}
        <div className="relative z-20 max-w-4xl mx-auto text-center px-6 flex flex-col items-center space-y-6">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 rounded-full border border-[#644736]/10 bg-white/50 px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#C7A37E]"
          >
            <Sparkles className="h-3 w-3 text-[#C7A37E]" />
            <span>AI Powered Home Healthcare</span>
          </motion.div>

          {/* Headline with TextRotate */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-[#644736] leading-[1.05] flex flex-col items-center justify-center"
            style={headerStyle}
          >
            <span>Healthcare Should Be</span>
            <TextRotate 
              texts={[
                "Predictive",
                "Preventive",
                "Continuous",
                "Explainable",
                "Intelligent",
                "Accessible",
                "Connected",
                "Human-Centered"
              ]}
              className="text-[#C7A37E]"
              delay={2200}
            />
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-[#644736]/80 leading-relaxed max-w-2xl font-medium"
          >
            Nash OS continuously monitors patient health, predicts deterioration before emergencies occur, explains risks with AI, and empowers doctors and caregivers to intervene early.
          </motion.p>

          {/* Actions CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center space-x-4 pt-2"
          >
            <Link href="/login">
              <button className="px-6 py-3 bg-[#644736] hover:bg-[#4E3629] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest rounded-full shadow-[0_4px_15px_rgba(100,71,54,0.15)] hover:translate-y-[-1px] transition-all duration-200 cursor-pointer">
                Explore Platform
              </button>
            </Link>
            <Link href="/login">
              <button className="px-6 py-3 border border-[#644736]/15 bg-white/45 hover:bg-white/70 hover:translate-y-[-1px] text-[#644736] text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-200 cursor-pointer">
                Watch Live Demo
              </button>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section id="problem" className="max-w-7xl mx-auto w-full px-6 py-12 border-t border-[#4E3629]/10 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Virtual Doctor Assistant Canvas Image Sequencer (Part 1: Waving & Interaction) */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <DoctorAvatarCanvas width={360} height={360} startFrame={0} endFrame={119} className="w-full max-w-[360px]" />
          </div>
          {/* Text content */}
          <div className="w-full lg:w-1/2 space-y-5 text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#C7A37E]">The Critical Inpatient Bottleneck</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight" style={headerStyle}>
              Hospital Admissions Often Occur After Days of Unseen Signal Shifts.
            </h2>
            <p className="text-sm text-[#4E3629]/80 leading-relaxed font-medium">
              Clinicians are frequently alerted only when a patient enters acute respiratory or cardiovascular distress. By mapping minor home physiological trends—like a weight gain of 3 lbs or desaturation from 98% to 92%—Nash OS equips care networks to act hours before emergency transport is needed.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION (Apple Process Diagram) */}
      <section id="workflow" className="max-w-7xl mx-auto w-full px-6 py-12 border-t border-[#4E3629]/10 relative z-10 text-center">
        <div className="space-y-2 mb-12">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#C7A37E]">Care Pipeline</span>
          <h2 className="text-3xl font-extrabold tracking-tight" style={headerStyle}>How Nash Minimizes Admissions</h2>
          <p className="text-xs text-[#4E3629]/70 max-w-xl mx-auto font-medium">
            A cohesive surveillance network synchronizing biometrics, predictions, and actions.
          </p>
        </div>

        {/* Process nodes grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {stepsList.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={step.label}
                whileHover={{ y: -3 }}
                className="bg-white/45 border border-white/35 rounded-[24px] p-5 shadow-[0_8px_30px_rgba(100,71,54,0.02)] backdrop-blur-[24px] text-left flex flex-col justify-between h-44 relative group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-[#C7A37E] uppercase bg-[#C7A37E]/10 border border-[#C7A37E]/20 px-2 py-0.5 rounded-full">
                      Step 0{idx + 1}
                    </span>
                    <StepIcon className="h-4.5 w-4.5 text-[#C7A37E]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xs font-bold text-[#4E3629] mt-3.5 uppercase tracking-wider">{step.label}</h3>
                  <p className="text-[10.5px] text-[#4E3629]/75 mt-1.5 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>

                {/* Arrow lines indicators between columns on desktop */}
                {idx < stepsList.length - 1 && (
                  <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-[#C7A37E]/30 pointer-events-none">
                    {(idx + 1) % 3 !== 0 && <ChevronRight className="h-4.5 w-4.5 animate-pulse" />}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="max-w-7xl mx-auto w-full px-6 py-12 border-t border-[#4E3629]/10 relative z-10 text-center">
        <div className="space-y-2 mb-12">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#C7A37E]">Platform Capabilities</span>
          <h2 className="text-3xl font-extrabold tracking-tight" style={headerStyle}>Early Intervention Infrastructure</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-white/35 bg-white/45 hover:border-[#4E3629]/20 shadow-[0_8px_30px_rgba(100,71,54,0.02)] backdrop-blur-[24px] transition-all duration-300 rounded-[24px]">
            <CardContent className="p-5 space-y-3.5 text-left">
              <div className="h-9 w-9 rounded-xl bg-white/40 border border-white/60 flex items-center justify-center text-[#C7A37E]">
                <Brain className="h-4.5 w-4.5" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider">Predictive Risk Stratification</h3>
              <p className="text-xs text-[#4E3629]/75 leading-relaxed font-medium">
                Our models analyze multi-parameter telemetry logs (SpO2, HR, BP) in real time to calculate risk categories before triggers occur.
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/35 bg-white/45 hover:border-[#4E3629]/20 shadow-[0_8px_30px_rgba(100,71,54,0.02)] backdrop-blur-[24px] transition-all duration-300 rounded-[24px]">
            <CardContent className="p-5 space-y-3.5 text-left">
              <div className="h-9 w-9 rounded-xl bg-white/40 border border-white/60 flex items-center justify-center text-[#C7A37E]">
                <Activity className="h-4.5 w-4.5" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider">Explainable AI Diagnostics</h3>
              <p className="text-xs text-[#4E3629]/75 leading-relaxed font-medium">
                Provides clinical reasons for risk classifications. Highlights contributing biomarkers to ensure physician verification.
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/35 bg-white/45 hover:border-[#4E3629]/20 shadow-[0_8px_30px_rgba(100,71,54,0.02)] backdrop-blur-[24px] transition-all duration-300 rounded-[24px]">
            <CardContent className="p-5 space-y-3.5 text-left">
              <div className="h-9 w-9 rounded-xl bg-white/40 border border-white/60 flex items-center justify-center text-[#C7A37E]">
                <Users className="h-4.5 w-4.5" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider">Unified Care Network</h3>
              <p className="text-xs text-[#4E3629]/75 leading-relaxed font-medium">
                Synchronizes alerts and medication compliance checklists between hospital physicians and family caregivers at home.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SHOWCASE SECTION 1: DIGITAL TWIN */}
      <section id="twin-showcase" className="max-w-7xl mx-auto w-full px-6 py-12 border-t border-[#4E3629]/10 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Text content */}
          <div className="w-full lg:w-2/5 space-y-5 text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#C7A37E]">Interactive Biometrics</span>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight" style={headerStyle}>
              Biometric Digital Twin Studio
            </h2>
            <p className="text-sm text-[#4E3629]/85 leading-relaxed font-medium">
              We translate raw telemetry numbers into an interactive 3D silhouette. Click organ systems (Heart, Lungs, Kidneys) to display clinical metrics, load stress ratios, AI forecast summaries, and medication directives.
            </p>
            <Link href="/login">
              <button className="px-5 py-2.5 bg-[#C7A37E] hover:bg-[#C7A37E]/90 text-[#4E3629] text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer flex items-center">
                <span>Access Digital Twin</span>
                <ArrowRight className="h-3.5 w-3.5 ml-2" />
              </button>
            </Link>
          </div>
          {/* Canvas Sequencer showcasing Doctor instead of stock video (Part 2: Reports & Assessment) */}
          <div className="w-full lg:w-3/5 flex items-center justify-center">
            <DoctorAvatarCanvas width={360} height={360} startFrame={120} endFrame={239} className="w-full max-w-[360px]" />
          </div>
        </div>
      </section>

      {/* SHOWCASE SECTION 2: DOCTOR CONTROL */}
      <section className="max-w-7xl mx-auto w-full px-6 py-12 border-t border-[#4E3629]/10 relative z-10">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-10">
          {/* Text content */}
          <div className="w-full lg:w-2/5 space-y-5 text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#C7A37E]">Clinical Command Center</span>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight" style={headerStyle}>
              Doctor Mission Control Dashboard
            </h2>
            <p className="text-sm text-[#4E3629]/85 leading-relaxed font-medium">
              Surveillance dashboard centralizing wardSurveillance. Review patient risk heatmaps, triage queues, explainable factor matrices, and live incoming telemetry activity feeds.
            </p>
            <Link href="/login">
              <button className="px-5 py-2.5 bg-[#C7A37E] hover:bg-[#C7A37E]/90 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer flex items-center">
                <span>Open Command Portal</span>
                <ArrowRight className="h-3.5 w-3.5 ml-2" />
              </button>
            </Link>
          </div>
          {/* Dashboard Preview mockup */}
          <div className="w-full lg:w-3/5 bg-white/45 border border-white/35 rounded-[28px] p-5 shadow-lg h-96 relative overflow-hidden flex flex-col justify-between backdrop-blur-[24px]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#4E3629]/6 text-[10px] uppercase font-bold tracking-wider text-neutral-500">
              <span>Patient risk distribution heatmap</span>
              <span>Synced</span>
            </div>
            {/* Heatmap mockup */}
            <div className="space-y-3 my-auto">
              {[
                { name: 'Telemetry-302 (Sarah Jenkins)', status: 'Critical', score: 88, color: 'bg-rose-500' },
                { name: 'General Ward-214 (Marcus Chen)', status: 'High', score: 64, color: 'bg-orange-500' },
                { name: 'Outpatient-Home (Elena Rostova)', status: 'Moderate', score: 32, color: 'bg-amber-500' }
              ].map((row) => (
                <div key={row.name} className="flex items-center justify-between p-3.5 border border-white/40 bg-white/20 rounded-xl text-xs font-semibold">
                  <span>{row.name}</span>
                  <div className="flex items-center space-x-3.5">
                    <span className="text-[10px] text-neutral-500">{row.status}</span>
                    <div className="w-20 bg-white/40 rounded-full h-2 overflow-hidden border border-[#4E3629]/5">
                      <div className={`h-full ${row.color}`} style={{ width: `${row.score}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERIES A CTA SECTION */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16 border-t border-[#4E3629]/10 relative z-10 text-center bg-white/45 rounded-[36px] my-8 shadow-sm border border-white/40 backdrop-blur-[24px]">
        <div className="max-w-2xl mx-auto space-y-6">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#C7A37E]">Preventing Hospitalizations</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight" style={headerStyle}>
            Healthcare Should Begin Earlier.
          </h2>
          <p className="text-sm text-[#4E3629]/75 leading-relaxed font-medium">
            Join the clinical networks utilizing Nash OS to shift healthcare from reactive hospitalization crisis resolution to early, home-based prevention metrics.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/login">
              <button className="px-6 py-3 bg-[#C7A37E] hover:bg-[#C7A37E]/90 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all duration-200 cursor-pointer">
                Access Platform Portal
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-[#4E3629]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#4E3629]/50 font-bold uppercase tracking-wider z-10 relative">
        <div>© 2026 Nash OS Technologies Inc. All rights reserved.</div>
        <div className="flex space-x-6">
          <span className="hover:text-[#4E3629] cursor-pointer transition-colors duration-150">Clinical Compliance</span>
          <span className="hover:text-[#4E3629] cursor-pointer transition-colors duration-150">HIPAA Protected</span>
          <span className="hover:text-[#4E3629] cursor-pointer transition-colors duration-150">AI Safety Disclosures</span>
        </div>
      </footer>
    </div>
  );
}
