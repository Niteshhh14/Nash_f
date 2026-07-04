'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/use-auth-store';
import { useForm } from 'react-hook-form';
import { UserRole } from '../../types';
import { motion } from 'framer-motion';
import { Dialog } from '../../components/ui/dialog';
import { 
  Plus, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ChevronRight 
} from 'lucide-react';

interface LoginInputs {
  email: string;
  role: UserRole;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTab, setSelectedTab] = useState<UserRole>('doctor');
  
  // SSO mock login states
  const [ssoModalOpen, setSsoModalOpen] = useState(false);
  const [ssoProvider, setSsoProvider] = useState<'Google' | 'Microsoft'>('Google');
  const [ssoLoading, setSsoLoading] = useState(false);

  const handleSsoClick = (provider: 'Google' | 'Microsoft') => {
    setSsoProvider(provider);
    setSsoModalOpen(true);
    setSsoLoading(false);
  };

  const handleSsoSelectAccount = async (role: UserRole) => {
    setSsoLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1400));
    try {
      const email = `${role}@nash.org`;
      await login(email, role);
      setSsoModalOpen(false);
      router.push(`/${role}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSsoLoading(false);
    }
  };

  const { register, handleSubmit, setValue } = useForm<LoginInputs>({
    defaultValues: { email: 'doctor@nash.org', role: 'doctor' }
  });

  const onSubmit = async (data: LoginInputs) => {
    try {
      await login(data.email, data.role);
      router.push(`/${data.role}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedTab(role);
    setValue('role', role);
    if (role === 'doctor') {
      setValue('email', 'doctor@nash.org');
    } else if (role === 'patient') {
      setValue('email', 'patient@nash.org');
    } else if (role === 'caregiver') {
      setValue('email', 'caregiver@nash.org');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4 py-10 sm:py-14 bg-[#FAF8F5]">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-32 -left-24 w-96 h-96 rounded-full bg-[#C7A37E]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-[#9BA88D]/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-[#C7A37E]/10 blur-2xl" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-[28px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(100,71,54,0.12)] border border-white/50">
        
        {/* LEFT: brand / narrative panel */}
        <div className="relative hidden lg:flex flex-col justify-between p-10 lg:p-12 bg-gradient-to-br from-[#4A3428] via-[#4E3629] to-[#543b2c] text-[#FAF8F5] overflow-hidden">
          
          {/* Decorative floating rings */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute bottom-10 -left-16 w-56 h-56 rounded-full border border-white/5 pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
              <Plus className="w-5 h-5 text-[#C7A37E]" />
            </div>
            <span className="text-sm font-extrabold uppercase tracking-widest text-[#C7A37E]" style={{ fontFamily: "'Clash Display', Inter, sans-serif" }}>
              Nash <span className="text-white/80">OS</span>
            </span>
          </div>

          {/* Middle Narrative (Clean of fake credentials/stats/quotes) */}
          <div className="relative z-10 my-auto py-10 space-y-6">
            <h1 className="text-3xl lg:text-[2.2rem] leading-[1.12] font-bold max-w-sm" style={{ fontFamily: "'Clash Display', Inter, sans-serif" }}>
              Where clinical precision meets home prevention.
            </h1>
            <p className="text-white/70 text-xs font-medium max-w-xs leading-relaxed">
              Access patient vitals, sync real-time medical telemetry, and deploy preventative clinical workflows — all from one unified workspace.
            </p>

            <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-5">
              <svg viewBox="0 0 340 60" className="w-full h-10 text-[#C7A37E]">
                <motion.path
                  d="M0 30 H60 L75 10 L95 50 L115 20 L130 40 L150 30 H340"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ strokeDasharray: "340", strokeDashoffset: "340" }}
                  animate={{ strokeDashoffset: [340, 0, -340] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>
            </div>
          </div>

          {/* Clean system note */}
          <div className="text-[10px] uppercase font-bold tracking-wider text-white/40 mt-auto">
            Nash OS preventive surveillance infrastructure v2.0
          </div>
        </div>

        {/* RIGHT: login form panel */}
        <div className="px-6 sm:px-10 lg:px-12 py-10 lg:py-12 flex flex-col justify-center bg-white/70 backdrop-blur-[24px]">
          
          {/* Mobile Logo View */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-full bg-[#4E3629] flex items-center justify-center text-[#FAF8F5]">
              <Plus className="w-5 h-5 text-[#C7A37E]" />
            </div>
            <span className="text-base tracking-widest text-[#4E3629] font-extrabold uppercase" style={{ fontFamily: "'Clash Display', Inter, sans-serif" }}>
              Nash <span className="text-[#C7A37E]">OS</span>
            </span>
          </div>

          <div className="max-w-sm w-full mx-auto lg:mx-0">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-[#4E3629]" style={{ fontFamily: "'Clash Display', Inter, sans-serif" }}>Welcome back</h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-extrabold text-[#C7A37E] bg-[#C7A37E]/10 border border-[#C7A37E]/20 rounded-full px-2.5 py-1 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                HIPAA Compliant
              </span>
            </div>
            <p className="text-neutral-500 text-xs mt-1.5 font-medium">Sign in to your dashboard workspace to continue.</p>

            {/* Custom Role Selector Toggle */}
            <div className="mt-6 grid grid-cols-3 gap-1.5 bg-[#4E3629]/5 rounded-xl p-1">
              <button
                type="button"
                onClick={() => handleRoleSelect('doctor')}
                className={`text-xs font-bold py-2 rounded-lg transition-all ${
                  selectedTab === 'doctor' ? 'bg-[#4E3629] text-[#FAF8F5] shadow-md' : 'text-neutral-500'
                }`}
              >
                Doctor
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('patient')}
                className={`text-xs font-bold py-2 rounded-lg transition-all ${
                  selectedTab === 'patient' ? 'bg-[#4E3629] text-[#FAF8F5] shadow-md' : 'text-neutral-500'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('caregiver')}
                className={`text-xs font-bold py-2 rounded-lg transition-all ${
                  selectedTab === 'caregiver' ? 'bg-[#4E3629] text-[#FAF8F5] shadow-md' : 'text-neutral-500'
                }`}
              >
                Caregiver
              </button>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#4E3629]/70 uppercase tracking-wide">License ID / Email</label>
                <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 focus-within:border-[#C7A37E] focus-within:ring-2 focus-within:ring-[#C7A37E]/10 transition-all duration-200">
                  <Mail className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="doctor@nash.org"
                    className="w-full bg-transparent outline-none text-xs text-neutral-800 placeholder:text-neutral-400 font-medium"
                    {...register('email')}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-[#4E3629]/70 uppercase tracking-wide">Password</label>
                  <a href="#" className="text-[10px] font-bold text-[#C7A37E] hover:underline">Forgot password?</a>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 focus-within:border-[#C7A37E] focus-within:ring-2 focus-within:ring-[#C7A37E]/10 transition-all duration-200">
                  <Lock className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••"
                    className="w-full bg-transparent outline-none text-xs text-neutral-800 placeholder:text-neutral-400 font-medium"
                    defaultValue="sandboxpass123"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-400 hover:text-[#4E3629] transition-colors flex-shrink-0"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-[10px] text-neutral-500 cursor-pointer select-none font-medium">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-neutral-300 text-[#C7A37E] focus:ring-[#C7A37E] cursor-pointer" defaultChecked />
                  Keep me signed in on this device
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#4E3629] to-[#4A3428] hover:from-[#543b2c] hover:to-[#38261c] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Syncing credentials...' : 'Sign in to workspace'}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

            </form>

             <div className="flex items-center gap-3 my-5">
              <span className="h-px flex-1 bg-neutral-200"></span>
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">or continue with hospital SSO</span>
              <span className="h-px flex-1 bg-neutral-200"></span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button" 
                onClick={() => handleSsoClick('Google')}
                className="flex items-center justify-center gap-2 border border-neutral-200 rounded-xl py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.55-.2-2.28H12v4.32h6.47a5.54 5.54 0 01-2.4 3.64v3.02h3.88c2.27-2.09 3.58-5.17 3.58-8.7z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.94-2.92l-3.88-3.02c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.1-6.71-4.93H1.28v3.1C3.26 21.3 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.29 14.28A7.19 7.19 0 014.9 12c0-.79.14-1.55.39-2.28v-3.1H1.28A11.98 11.98 0 000 12c0 1.94.46 3.77 1.28 5.38l4.01-3.1z"/><path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.3 0 3.26 2.7 1.28 6.62l4.01 3.1c.94-2.83 3.59-4.97 6.71-4.97z"/></svg>
                Google
              </button>
              <button 
                type="button" 
                onClick={() => handleSsoClick('Microsoft')}
                className="flex items-center justify-center gap-2 border border-neutral-200 rounded-xl py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#f25022" d="M1 1h10v10H1z"/><path fill="#7fba00" d="M13 1h10v10H13z"/><path fill="#00a4ef" d="M1 13h10v10H1z"/><path fill="#ffb900" d="M13 13h10v10H13z"/></svg>
                Microsoft
              </button>
            </div>

            <p className="text-center text-xs text-neutral-500 mt-6 font-medium">
              New to the platform?{' '}
              <a href="#" className="font-bold text-[#C7A37E] hover:underline">Request access</a>
            </p>

            <div className="flex items-center justify-center gap-4 mt-6 pt-5 border-t border-neutral-100">
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C7A37E]" />
                256-bit encryption
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C7A37E]" />
                SOC 2 certified
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* SSO Accounts Selector Modal */}
      <Dialog
        isOpen={ssoModalOpen}
        onClose={() => !ssoLoading && setSsoModalOpen(false)}
        title={`Sign in with ${ssoProvider}`}
      >
        <div className="space-y-4 text-left text-[#4E3629]">
          <p className="text-xs font-semibold leading-relaxed text-[#4E3629]/75">
            Choose an active Nash workspace account to authenticate automatically via {ssoProvider} SSO.
          </p>

          {ssoLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="h-8 w-8 rounded-full border-2 border-[#C7A37E] border-t-transparent animate-spin" />
              <span className="text-xs font-bold text-[#4E3629]/70">Verifying security credentials...</span>
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              {[
                { name: 'Dr. Evelyn Vance', email: 'doctor@nash.org', role: 'doctor' as const, avatar: '👩‍⚕️' },
                { name: 'Sarah Jenkins', email: 'patient@nash.org', role: 'patient' as const, avatar: '👵' },
                { name: 'Marcus Chen', email: 'caregiver@nash.org', role: 'caregiver' as const, avatar: '👨‍⚕️' }
              ].map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleSsoSelectAccount(account.role)}
                  className="w-full flex items-center justify-between p-3.5 border border-[#4E3629]/10 bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] rounded-xl cursor-pointer hover:border-[#C7A37E] transition-all duration-200"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="h-9 w-9 rounded-full bg-[#4E3629]/5 flex items-center justify-center text-sm">
                      {account.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#4E3629]">{account.name}</p>
                      <p className="text-[10px] text-[#4E3629]/50 font-bold font-mono">{account.email}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#4E3629]/40" />
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              disabled={ssoLoading}
              onClick={() => setSsoModalOpen(false)}
              className="text-xs font-bold text-[#4E3629]/60 hover:text-[#4E3629] cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>

    </div>
  );
}
