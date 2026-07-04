import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/use-auth-store';
import { useAppStore } from '../../store/use-app-store';
import { useAlertsQuery } from '../../hooks/use-alerts';
import { Bell, Command, Volume2, VolumeX, ShieldAlert, Cpu } from 'lucide-react';
import Link from 'next/link';

export const Header: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { toggleCommandPalette, soundNotifications, toggleSoundNotifications } = useAppStore();
  const { data: alerts = [] } = useAlertsQuery('active');

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#4E3629]/10 bg-white/35 px-6 backdrop-blur-[24px] relative z-20 text-[#4E3629]">
      {/* Search Trigger (Command Palette Shortcut representation) */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleCommandPalette}
          className="flex items-center space-x-2 rounded-xl border border-[#4E3629]/10 bg-white/40 px-3 py-1.5 text-xs text-[#4E3629]/80 hover:border-[#4E3629]/20 hover:bg-white/60 transition-all duration-200 cursor-pointer"
        >
          <Command className="h-3.5 w-3.5 text-[#C7A37E]" />
          <span className="font-medium">Clinical Search</span>
          <span className="rounded bg-[#4E3629]/5 px-1.5 py-0.5 text-[9px] font-bold text-[#4E3629]/60 border border-[#4E3629]/10">
            Ctrl K
          </span>
        </button>

      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-4">
        {/* Audio Alerts Toggle */}
        <button
          onClick={toggleSoundNotifications}
          title={soundNotifications ? 'Mute Clinical Sounds' : 'Unmute Clinical Sounds'}
          className="h-9 w-9 flex items-center justify-center rounded-xl border border-[#4E3629]/10 hover:border-[#4E3629]/20 bg-white/40 hover:bg-white/60 text-[#4E3629]/70 hover:text-[#4E3629] transition-all duration-200 cursor-pointer"
        >
          {soundNotifications ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-rose-400" />}
        </button>

        {/* Alert Bell */}
        <Link
          href="/notifications"
          className="relative h-9 w-9 flex items-center justify-center rounded-xl border border-[#4E3629]/10 hover:border-[#4E3629]/20 bg-white/40 hover:bg-white/60 text-[#4E3629]/70 hover:text-[#4E3629] transition-all duration-200"
        >
          <Bell className="h-4 w-4" />
          {activeAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C7A37E] text-[9px] font-bold text-white shadow-sm">
              {activeAlertsCount}
            </span>
          )}
        </Link>

        {/* Profile Summary */}
        {user && (
          <div className="flex items-center space-x-3 pl-2 border-l border-[#4E3629]/10">
            <span className="hidden sm:inline text-xs font-bold text-[#4E3629]/80">
              {user.name}
            </span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#C7A37E] to-[#4E3629] p-[1.5px]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#4E3629]">
                {user.avatar}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
