import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/use-auth-store';
import { useAppStore } from '../../store/use-app-store';
import { cn } from '../../lib/utils';
import {
  Activity,
  Users,
  FileText,
  AlertTriangle,
  Pill,
  User,
  CheckSquare,
  Settings,
  Bell,
  Cpu,
  ShieldAlert,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, setRole, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useAppStore();

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as 'doctor' | 'patient' | 'caregiver';
    await setRole(newRole);
    router.push(`/${newRole}`);
  };

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const getNavItems = () => {
    if (role === 'doctor') {
      return [
        { name: 'Mission Control', href: '/doctor', icon: Activity },
        { name: 'Patient Directory', href: '/doctor/patients', icon: Users },
        { name: 'Predictive Reports', href: '/doctor/reports', icon: FileText },
        { name: 'Emergency Grid', href: '/doctor/emergency', icon: ShieldAlert }
      ];
    }
    if (role === 'patient') {
      return [
        { name: 'Patient Hub', href: '/patient', icon: Activity },
        { name: 'Digital Twin AI', href: '/patient/digital-twin', icon: Cpu },
        { name: 'Medication Adherence', href: '/patient/medications', icon: Pill },
        { name: 'My Profile', href: '/patient/profile', icon: User }
      ];
    }
    if (role === 'caregiver') {
      return [
        { name: 'Telemetry Board', href: '/caregiver', icon: Activity },
        { name: 'Care Checklist', href: '/caregiver/tasks', icon: CheckSquare }
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const headerStyle = {
    fontFamily: "'Clash Display', Inter, sans-serif",
    fontWeight: 700
  };

  return (
    <aside
      className={cn(
        // Mobile Drawer Layout (fixed positioning overlay)
        "fixed inset-y-0 left-0 z-40 w-64 border-r border-[#4E3629]/10 bg-white/55 backdrop-blur-[28px] shadow-2xl transition-transform duration-300 ease-in-out text-[#4E3629] flex flex-col md:shadow-none md:transition-all md:duration-300 md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        sidebarOpen ? "md:w-64" : "md:w-20"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-[#4E3629]/10">
        <Link href="/" className="flex items-center space-x-2.5" onClick={handleNavClick}>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#4E3629]/15 bg-white/80 text-[#C7A37E]">
            <Activity className="h-4 w-4" />
          </div>
          {sidebarOpen && (
            <span className="text-sm tracking-tight text-[#4E3629] animate-fade-in" style={headerStyle}>
              Nash <span className="font-semibold text-[#C7A37E]">OS</span>
            </span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="hidden md:flex h-6 w-6 items-center justify-center rounded-md border border-[#4E3629]/10 hover:bg-[#4E3629]/5 text-[#4E3629]/60 hover:text-[#4E3629] cursor-pointer"
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                "group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border",
                isActive
                  ? "bg-[#C7A37E]/10 text-[#4E3629] border-[#C7A37E]/20"
                  : "text-[#4E3629]/70 hover:text-[#4E3629] hover:bg-[#4E3629]/5 border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                  sidebarOpen ? "mr-3" : "mx-auto",
                  isActive ? "text-[#C7A37E]" : "text-[#4E3629]/60 group-hover:text-[#4E3629]"
                )}
                strokeWidth={1.5}
              />
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          );
        })}

        {/* Global Notifications Page Link */}
        {role && (
          <Link
            href="/notifications"
            onClick={handleNavClick}
            className={cn(
              "group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border",
              pathname === '/notifications'
                ? "bg-[#C7A37E]/10 text-[#4E3629] border-[#C7A37E]/20"
                : "text-[#4E3629]/70 hover:text-[#4E3629] hover:bg-[#4E3629]/5 border-transparent"
            )}
          >
            <Bell
              className={cn(
                "h-5 w-5 shrink-0",
                sidebarOpen ? "mr-3" : "mx-auto",
                pathname === '/notifications' ? "text-[#C7A37E]" : "text-[#4E3629]/60"
              )}
              strokeWidth={1.5}
            />
            {sidebarOpen && <span>Notifications</span>}
          </Link>
        )}

        {/* Settings Page Link */}
        {role && (
          <Link
            href="/settings"
            onClick={handleNavClick}
            className={cn(
              "group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border",
              pathname === '/settings'
                ? "bg-[#C7A37E]/10 text-[#4E3629] border-[#C7A37E]/20"
                : "text-[#4E3629]/70 hover:text-[#4E3629] hover:bg-[#4E3629]/5 border-transparent"
            )}
          >
            <Settings
              className={cn(
                "h-5 w-5 shrink-0",
                sidebarOpen ? "mr-3" : "mx-auto",
                pathname === '/settings' ? "text-[#C7A37E]" : "text-[#4E3629]/60"
              )}
              strokeWidth={1.5}
            />
            {sidebarOpen && <span>Developer Panel</span>}
          </Link>
        )}
      </nav>

      {/* Role Switcher & Profile Section */}
      {user && (
        <div className="border-t border-[#4E3629]/10 p-4 bg-[#4E3629]/3">
          {sidebarOpen && (
            <div className="mb-3">
              <label className="text-[9px] uppercase font-bold tracking-wider text-[#4E3629]/55 block mb-1">
                Active Sandbox Role
              </label>
              <select
                value={role || 'patient'}
                onChange={handleRoleChange}
                className="w-full bg-white/40 border border-[#4E3629]/10 text-xs text-[#4E3629]/90 rounded-lg p-2 outline-none cursor-pointer hover:border-[#4E3629]/20 transition-all duration-200"
              >
                <option value="doctor">Doctor Mode</option>
                <option value="patient">Patient Mode</option>
                <option value="caregiver">Caregiver Mode</option>
              </select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4E3629]/10 border border-[#4E3629]/15 text-xs font-semibold text-[#4E3629]/90">
                {user.avatar}
              </div>
              {sidebarOpen && (
                <div className="overflow-hidden">
                  <p className="truncate text-xs font-semibold text-[#4E3629]/90 leading-tight">
                    {user.name}
                  </p>
                  <p className="truncate text-[10px] text-[#4E3629]/50 font-medium">
                    {user.email}
                  </p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 text-[#4E3629]/60 hover:text-rose-400 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
