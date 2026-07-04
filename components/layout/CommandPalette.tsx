import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../store/use-app-store';
import { useAuthStore } from '../../store/use-auth-store';
import { usePatientsQuery } from '../../hooks/use-patients';
import { useTriggerAlertMutation } from '../../hooks/use-alerts';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Activity, User, ShieldAlert, Cpu, Heart, Pill, Bell } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen, soundNotifications, toggleSoundNotifications, setSelectedPatientId } = useAppStore();
  const { setRole } = useAuthStore();
  
  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const { data: patients = [] } = usePatientsQuery(query);
  const triggerAlertMutation = useTriggerAlertMutation();

  // Keyboard shortcut listener (Ctrl+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Command items definitions
  const commands = [
    { id: 'role-doc', title: 'Switch to Doctor Mission Control', category: 'Roles', icon: Activity, action: async () => { await setRole('doctor'); router.push('/doctor'); } },
    { id: 'role-pat', title: 'Switch to Patient Self-Hub', category: 'Roles', icon: User, action: async () => { await setRole('patient'); router.push('/patient'); } },
    { id: 'role-cg', title: 'Switch to Caregiver Telemetry', category: 'Roles', icon: User, action: async () => { await setRole('caregiver'); router.push('/caregiver'); } },
    { id: 'twin-view', title: 'Enter Dedicated Digital Twin Studio', category: 'Navigation', icon: Cpu, action: () => { router.push('/patient/digital-twin'); } },
    { id: 'toggle-sound', title: `Toggle Vitals Sound: ${soundNotifications ? 'Active' : 'Muted'}`, category: 'Preferences', icon: Heart, action: () => toggleSoundNotifications() },
    { id: 'trigger-emerg', title: 'Simulate Cardiac Decompensation Alert (Sarah Jenkins)', category: 'Testing', icon: ShieldAlert, action: () => {
      triggerAlertMutation.mutate({
        patientId: 'PAT-001',
        patientName: 'Sarah Jenkins',
        type: 'anomaly',
        severity: 'critical',
        value: 'Cardiac Arrest Simulation',
        baseline: 'Sinus Rhythm',
        notes: 'Simulated alert dispatch triggered via Developer Command Palette.'
      });
      router.push('/doctor');
    } }
  ];

  // Filter commands based on text search
  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase()) || 
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  // Grouped search results
  const patientResults = patients.slice(0, 4).map(p => ({
    id: `patient-${p.id}`,
    title: `View EHR Chart: ${p.name} (${p.condition})`,
    category: 'Patients',
    icon: User,
    action: () => {
      setSelectedPatientId(p.id);
      router.push(`/doctor/patients/${p.id}`);
    }
  }));

  const allItems = [...patientResults, ...filteredCommands];

  // Key navigation for options
  React.useEffect(() => {
    if (!commandPaletteOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % allItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + allItems.length) % allItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allItems[selectedIndex]) {
          allItems[selectedIndex].action();
          setCommandPaletteOpen(false);
          setQuery('');
        }
      } else if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, selectedIndex, allItems, setCommandPaletteOpen, router]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-55 flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Palette Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ type: 'spring', duration: 0.35 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/90 shadow-2xl backdrop-blur-2xl"
          >
            {/* Search Input */}
            <div className="flex items-center space-x-3 border-b border-white/5 px-4 py-4">
              <Search className="h-5 w-5 text-neutral-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a clinical command or patient name (e.g. Sarah)..."
                className="w-full bg-transparent text-sm text-white placeholder-neutral-500 outline-none"
              />
            </div>

            {/* Results List */}
            <div className="max-h-[350px] overflow-y-auto p-2">
              {allItems.length === 0 ? (
                <div className="py-12 text-center text-sm text-neutral-500">
                  No matching clinical clinical commands or records found.
                </div>
              ) : (
                <div className="space-y-1">
                  {allItems.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          item.action();
                          setCommandPaletteOpen(false);
                          setQuery('');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-150 cursor-pointer text-left ${
                          isSelected 
                            ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' 
                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-4.5 w-4.5 ${isSelected ? 'text-cyan-400' : 'text-neutral-400'}`} />
                          <span className="text-sm font-medium">{item.title}</span>
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-600 bg-black/45 border border-white/5 rounded px-2 py-0.5">
                          {item.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Guidance */}
            <div className="flex items-center justify-between border-t border-white/5 bg-black/40 px-4 py-2 text-[10px] text-neutral-500 font-medium">
              <div className="flex space-x-4">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>esc Close</span>
              </div>
              <div>Nash Command Palette v1.0</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
