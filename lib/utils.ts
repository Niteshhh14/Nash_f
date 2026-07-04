import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function formatTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function getRiskColor(category: 'low' | 'moderate' | 'high' | 'critical'): string {
  switch (category) {
    case 'critical':
      return 'text-rose-500 border-rose-500/20 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.15)]';
    case 'high':
      return 'text-orange-500 border-orange-500/20 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.15)]';
    case 'moderate':
      return 'text-amber-500 border-amber-500/20 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
    case 'low':
    default:
      return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
  }
}

export function getEmergencyBadgeColor(status?: 'stable' | 'triage' | 'critical' | 'escalated'): string {
  switch (status) {
    case 'critical':
      return 'bg-rose-500/20 border-rose-500/30 text-rose-400';
    case 'escalated':
      return 'bg-purple-500/20 border-purple-500/30 text-purple-400';
    case 'triage':
      return 'bg-amber-500/20 border-amber-500/30 text-amber-400';
    case 'stable':
    default:
      return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400';
  }
}
