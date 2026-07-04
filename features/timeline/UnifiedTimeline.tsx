import React, { useState } from 'react';
import { TimelineEvent } from '../../types';
import { cn, formatDateTime } from '../../lib/utils';
import { Calendar, AlertTriangle, Pill, Activity, User, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface UnifiedTimelineProps {
  events: TimelineEvent[];
}

export const UnifiedTimeline: React.FC<UnifiedTimelineProps> = ({ events }) => {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-rose-400" />;
      case 'medication':
        return <Pill className="h-4 w-4 text-cyan-400" />;
      case 'clinical':
        return <Activity className="h-4 w-4 text-indigo-400" />;
      case 'system':
      default:
        return <User className="h-4 w-4 text-neutral-400" />;
    }
  };

  const getEventBorderColor = (type: TimelineEvent['type'], isExpanded: boolean) => {
    const baseClass = "rounded-xl border p-4 backdrop-blur-md transition-all duration-200 text-left w-full";
    if (isExpanded) {
      switch (type) {
        case 'alert': return `${baseClass} border-rose-500/40 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.08)]`;
        case 'medication': return `${baseClass} border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.08)]`;
        case 'clinical': return `${baseClass} border-indigo-500/40 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.08)]`;
        case 'system':
        default:
          return `${baseClass} border-white/20 bg-white/10`;
      }
    }
    switch (type) {
      case 'alert': return `${baseClass} border-rose-500/15 bg-rose-500/5 hover:border-rose-500/25`;
      case 'medication': return `${baseClass} border-cyan-500/15 bg-cyan-500/5 hover:border-cyan-500/25`;
      case 'clinical': return `${baseClass} border-indigo-500/15 bg-indigo-500/5 hover:border-indigo-500/25`;
      case 'system':
      default:
        return `${baseClass} border-white/5 bg-white/5 hover:border-white/10`;
    }
  };

  const getSeverityBadge = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'alert':
        return (
          <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded">
            Critical Escalation
          </span>
        );
      case 'clinical':
        return (
          <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded">
            Clinician Intake
          </span>
        );
      case 'medication':
        return (
          <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded">
            Rx Compliance
          </span>
        );
      case 'system':
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-base font-semibold">
          <Calendar className="h-4 w-4 text-cyan-400" />
          <span>Longitudinal EHR Health Timeline</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="py-6 text-center text-sm text-neutral-500">
            No clinical timeline logs recorded.
          </div>
        ) : (
          <div className="relative border-l border-white/5 ml-3 pl-6 space-y-6 py-2">
            {events.map((event) => {
              const isExpanded = expandedEventId === event.id;
              
              return (
                <div key={event.id} className="relative">
                  {/* Connector Node */}
                  <div className="absolute -left-[35px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 border border-white/10 shadow-sm z-10">
                    {getEventIcon(event.type)}
                  </div>

                  {/* Expandable Event Button */}
                  <button
                    onClick={() => toggleExpand(event.id)}
                    className={getEventBorderColor(event.type, isExpanded)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-bold text-white/95">
                          {event.title}
                        </h4>
                        {getSeverityBadge(event.type)}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-[10px] text-neutral-500 shrink-0">
                        <span>{formatDateTime(event.date)}</span>
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                    
                    <p className="text-xs text-neutral-400 leading-normal">
                      {event.description}
                    </p>

                    {/* Expandable Details Container */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden border-t border-white/5 mt-3 pt-3 space-y-2 text-[11px] text-neutral-400"
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span>Verification status:</span>
                            <span className="font-semibold text-emerald-400">Validated by EHR node</span>
                          </div>
                          {event.provider && (
                            <div className="flex items-center justify-between text-[10px]">
                              <span>Directing provider:</span>
                              <span className="font-semibold text-white/90">{event.provider}</span>
                            </div>
                          )}
                          <div className="text-[10px] leading-relaxed bg-black/35 rounded-lg p-2 border border-white/5 text-neutral-400 font-sans">
                            Telemetry log verifies physiological sensors were mapped and fully synchronized with Nash OS clinical nodes at the registered stamp.
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
