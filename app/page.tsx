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

export default function MarketingLandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      const sections = ['problem', 'workflow', 'features', 'twin-showcase'];

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the section occupies the viewport line at 250px from top
          if (rect.top <= 250 && rect.bottom > 250) {
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
          {/* Logo - completely removed */}
          <div className="hidden md:block w-8 h-8" />

          {/* Links - iPhone-like segmented indicator directly on navbar glass */}
          <nav className="hidden md:flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider">
            {['problem', 'workflow', 'features', 'twin-showcase'].map((sec) => {
              const label = sec === 'twin-showcase' ? 'Digital Twin' : sec === 'workflow' ? 'How It Works' : sec;
              const isActive = activeSection === sec;
              return (
                <a
                  key={sec}
                  href={`#${sec}`}
                  onClick={(e) => handleScrollTo(e, sec)}
                  className={`relative px-4 py-1.5 rounded-full transition-all duration-300 ${
                    isActive ? 'text-[#4E3629]' : 'text-[#4E3629]/65 hover:text-[#C7A37E]'
                  }`}
                >
                  <span className="relative z-10">{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-white/80 rounded-full shadow-[0_2px_10px_rgba(100,71,54,0.08)] border border-white/60"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* CTAs */}
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <button className="px-4 py-2 text-xs font-bold text-[#4E3629] hover:bg-[#4E3629]/5 rounded-full transition-colors duration-200 cursor-pointer">
                Login
              </button>
            </Link>
            <Link href="/login">
              <button className="px-4 py-2 bg-[#C7A37E] hover:bg-[#C7A37E]/95 hover:translate-y-[-1px] text-[#4E3629] text-xs font-bold rounded-full shadow-[0_2px_10px_rgba(199,163,126,0.15)] transition-all duration-200 cursor-pointer">
                Get Started
              </button>
            </Link>
          </div>
        </header>
      </div>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto w-full px-6 pt-28 pb-12 md:py-16 md:pt-36 flex flex-col lg:flex-row items-center gap-10 flex-1 z-10 relative">
        {/* Left Panel (60%) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-3/5 space-y-6 text-left flex flex-col items-start"
        >
          {/* Elegant Glow Brand Logo */}
          <motion.div
            variants={itemVariants}
            className="relative inline-block"
          >
            <span 
              className="text-4xl md:text-5xl font-black tracking-widest text-[#4E3629] uppercase drop-shadow-[0_0_15px_rgba(199,163,126,0.5)]" 
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Nash OS
            </span>
          </motion.div>

          {/* Heading with TextRotate */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6.5xl font-extrabold tracking-tight text-[#4E3629] leading-[1.08] flex flex-col items-start min-h-[140px] sm:min-h-[160px] mt-2"
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

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-[#4E3629]/80 leading-relaxed max-w-xl font-medium"
          >
            Nash OS continuously monitors patient health, predicts deterioration, explains risks using AI, and enables timely intervention before hospitalization becomes necessary.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={itemVariants} className="flex items-center space-x-4">
            <Link href="/login">
              <button className="px-5 py-2.5 bg-[#C7A37E] hover:bg-[#C7A37E]/95 hover:translate-y-[-1px] text-[#4E3629] text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_4px_12px_rgba(199,163,126,0.15)] transition-all duration-200 cursor-pointer">
                Explore Platform
              </button>
            </Link>
            <Link href="/login">
              <button className="px-5 py-2.5 border border-[#4E3629]/15 bg-white/45 hover:bg-white/70 hover:translate-y-[-1px] text-[#4E3629] text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer">
                Watch Demo
              </button>
            </Link>
          </motion.div>

          {/* Trust Checklists */}
          <motion.div
            variants={itemVariants}
            className="pt-4 border-t border-[#4E3629]/10 flex items-center space-x-6 text-[10px] uppercase font-bold tracking-wider text-[#4E3629]/60"
          >
            <span className="flex items-center"><ShieldCheck className="h-4 w-4 mr-1 text-[#C7A37E]" /> AI Assisted</span>
            <span className="flex items-center"><ShieldCheck className="h-4 w-4 mr-1 text-[#C7A37E]" /> Explainable</span>
            <span className="flex items-center"><ShieldCheck className="h-4 w-4 mr-1 text-[#C7A37E]" /> Home Healthcare</span>
          </motion.div>
        </motion.div>

        {/* Right Panel (40%) - Floating Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-2/5 relative"
        >
          <div className="bg-white/45 border border-white/35 rounded-[24px] p-5 shadow-[0_12px_40px_rgba(100,71,54,0.02)] backdrop-blur-[24px] space-y-4">
            {/* Health Score Circular Chart */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#4E3629]/6">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-wider text-[#4E3629]/60">Clinical Status</span>
                <h3 className="text-xs font-extrabold mt-0.5">Today's Summary</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-7 w-7 rounded-full bg-[#C7A37E]/15 flex items-center justify-center text-xs font-bold text-[#C7A37E]">92</span>
                <span className="text-xs font-bold text-[#C7A37E]">Excellent</span>
              </div>
            </div>

            {/* ECG Line visual display */}
            <AnimatedECG />

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3 border border-white/40 bg-white/20 rounded-2xl">
                <span className="text-[9px] uppercase font-bold tracking-wider text-[#4E3629]/50">Heart Rate</span>
                <p className="text-xs font-extrabold text-[#4E3629] mt-0.5">72 <span className="text-[9px] text-[#4E3629]/60">bpm</span></p>
              </div>
              <div className="p-3 border border-white/40 bg-white/20 rounded-2xl">
                <span className="text-[9px] uppercase font-bold tracking-wider text-[#4E3629]/50">Oxygen Sat</span>
                <p className="text-xs font-extrabold text-[#4E3629] mt-0.5">98%</p>
              </div>
            </div>

            {/* Twin Outline mockup */}
            <div className="h-28 border border-white/40 bg-white/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <svg className="w-12 h-20 text-[#4E3629]/15" viewBox="0 0 100 200" fill="none">
                <path
                  d="M50 15c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zm0 10c-15 0-22 8-22 25v30c0 4 3 7 7 7h3v60c0 8 6 15 12 15s12-7 12-15V87h3c4 0 7-3 7-7V50c0-17-7-25-22-25z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                  strokeDasharray="4 4"
                />
                <circle cx="50" cy="52" r="8" fill="#C7A37E" fillOpacity="0.1" />
                <circle cx="50" cy="52" r="3.5" fill="#C7A37E" className="animate-pulse" />
              </svg>
              <div className="absolute bottom-2 right-2.5 flex items-center space-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C7A37E] animate-ping" />
                <span className="text-[8px] uppercase tracking-wider text-[#4E3629]/55 font-bold">Biometrics Active</span>
              </div>
            </div>

            {/* Meds checklist indicator */}
            <div className="p-3 border border-white/40 bg-white/20 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-600">Prescribed Diuretics</span>
              <span className="px-2 py-0.5 text-[8px] uppercase font-bold tracking-wider text-[#C7A37E] bg-[#C7A37E]/15 border border-[#C7A37E]/20 rounded">
                Completed
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* PROBLEM SECTION */}
      <section id="problem" className="max-w-7xl mx-auto w-full px-6 py-12 border-t border-[#4E3629]/10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-center gap-10"
        >
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
        </motion.div>
      </section>      {/* HOW IT WORKS SECTION (Apple Process Diagram) */}
      <section id="workflow" className="max-w-7xl mx-auto w-full px-6 py-12 border-t border-[#4E3629]/10 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
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
        </motion.div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="max-w-7xl mx-auto w-full px-6 py-12 border-t border-[#4E3629]/10 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
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
        </motion.div>
      </section>

      {/* SHOWCASE SECTION 1: DIGITAL TWIN */}
      <section id="twin-showcase" className="max-w-7xl mx-auto w-full px-6 py-12 border-t border-[#4E3629]/10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-center gap-10"
        >
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
        </motion.div>
      </section>

      {/* SHOWCASE SECTION 2: DOCTOR CONTROL */}
      <section className="max-w-7xl mx-auto w-full px-6 py-12 border-t border-[#4E3629]/10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row-reverse items-center gap-10"
        >
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
        </motion.div>
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
