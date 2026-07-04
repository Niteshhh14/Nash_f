'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../store/use-auth-store';
import { useAppStore } from '../store/use-app-store';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { CommandPalette } from '../components/layout/CommandPalette';
import { DemoModeControls } from '../components/layout/DemoModeControls';
import { usePathname } from 'next/navigation';
import { Siren, ShieldAlert } from 'lucide-react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 5000,
      },
    },
  }));

  const pathname = usePathname();
  const { activeEmergency } = useAppStore();

  const isAuthRequired = pathname !== '/' && pathname !== '/login';

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen w-screen overflow-hidden bg-[#FAF8F5] text-[#4E3629] font-sans flex-col relative">
        {/* Global Emergency Alert Banner */}
        {activeEmergency && isAuthRequired && (
          <div className="bg-rose-50/95 border-b border-rose-200 text-rose-800 text-xs font-semibold px-6 py-2.5 flex items-center justify-between z-40 backdrop-blur-md shadow-[0_4px_20px_rgba(225,29,72,0.04)] shrink-0">
            <div className="flex items-center space-x-2">
              <Siren className="h-4 w-4 text-rose-600 animate-pulse" />
              <span>CRITICAL COMPLIANCE THRESHOLD TRIGGERED: Telemetry code PAT-001 (Sarah Jenkins) registers cardiovascular/pulmonary anomalies.</span>
            </div>
            <div className="flex items-center space-x-1 text-[10px] uppercase font-bold tracking-wider text-rose-600 bg-rose-100/50 border border-rose-200 rounded px-2 py-0.5">
              <ShieldAlert className="h-3 w-3 mr-1" />
              <span>Emergency Mode Active</span>
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden relative">
          {isAuthRequired && <Sidebar />}
          <div className="flex flex-1 flex-col overflow-hidden">
            {isAuthRequired && <Header />}
            <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent relative">
              {children}
            </main>
          </div>
        </div>
        
        {/* Persistent demo controls in authenticated view */}
        {isAuthRequired && <DemoModeControls />}
        <CommandPalette />
      </div>
    </QueryClientProvider>
  );
}
