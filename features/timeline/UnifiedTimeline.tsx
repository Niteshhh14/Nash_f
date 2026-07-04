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
        return <AlertTriangle className="h-4 w-4 text-rose-500" />;
      case 'medication':
        return <Pill className="h-4 w-4 text-[#C7A37E]" />;
      case 'clinical':
        return <Activity className="h-4 w-4 text-indigo-500" />;
      case 'system':
      default:
        return <User className="h-4 w-4 text-[#4E3629]/60" />;
    }
  };

  const getEventBorderColor = (type: TimelineEvent['type'], isExpanded: boolean) => {
    const baseClass = "rounded-xl border p-4 backdrop-blur-md transition-all duration-200 text-left w-full cursor-pointer";
    if (isExpanded) {
      switch (type) {
        case 'alert': return `${baseClass} border-rose-500/30 bg-rose-500/5 shadow-sm`;
        case 'medication': return `${baseClass} border-[#C7A37E]/30 bg-[#C7A37E]/5 shadow-sm`;
        case 'clinical': return `${baseClass} border-indigo-500/30 bg-indigo-500/5 shadow-sm`;
        case 'system':
        default:
          return `${baseClass} border-[#4E3629]/20 bg-white/60`;
      }
    }
    switch (type) {
      case 'alert': return `${baseClass} border-rose-500/15 bg-rose-500/5 hover:border-rose-500/25`;
      case 'medication': return `${baseClass} border-[#C7A37E]/15 bg-[#C7A37E]/5 hover:border-[#C7A37E]/25`;
      case 'clinical': return `${baseClass} border-indigo-500/15 bg-indigo-500/5 hover:border-indigo-500/25`;
      case 'system':
      default:
        return `${baseClass} border-[#4E3629]/10 bg-white/40 hover:border-[#4E3629]/20`;
    }
  };

  const getSeverityBadge = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'alert':
        return (
          <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-rose-700 bg-rose-500/10 border border-rose-500/20 rounded">
            Critical Escalation
          </span>
        );
      case 'clinical':
        return (
          <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-500/10 border border-indigo-500/20 rounded">
            Clinician Intake
          </span>
        );
      case 'medication':
        return (
          <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#C7A37E] bg-[#C7A37E]/10 border border-[#C7A37E]/20 rounded">
            Rx Compliance
          </span>
        );
      case 'system':
      default:
        return null;
    }
  };

  return (
    <Card className="border-white/55 bg-white/45 backdrop-blur-[12px] shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-base font-semibold text-[#4E3629]">
          <Calendar className="h-4 w-4 text-[#C7A37E]" />
          <span>Longitudinal EHR Health Timeline</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="py-6 text-center text-sm text-[#4E3629]/60">
            No clinical timeline logs recorded.
          </div>
        ) : (
          <div className="relative border-l border-[#4E3629]/10 ml-3 pl-6 space-y-6 py-2">
            {events.map((event) => {
              const isExpanded = expandedEventId === event.id;
              
              return (
                <div key={event.id} className="relative">
                  {/* Connector Node */}
                  <div className="absolute -left-[35px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#4E3629]/15 shadow-sm z-10">
                    {getEventIcon(event.type)}
                  </div>

                  {/* Expandable Event Button */}
                  <button
                    onClick={() => toggleExpand(event.id)}
                    className={getEventBorderColor(event.type, isExpanded)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-bold text-[#4E3629]">
                          {event.title}
                        </h4>
                        {getSeverityBadge(event.type)}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-[10px] text-[#4E3629]/60 shrink-0">
                        <span>{formatDateTime(event.date)}</span>
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-[#4E3629]/60" /> : <ChevronDown className="h-3.5 w-3.5 text-[#4E3629]/60" />}
                      </div>
                    </div>
                    
                    <p className="text-xs text-[#4E3629]/80 leading-normal">
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
                          className="overflow-hidden border-t border-[#4E3629]/10 mt-3 pt-3 space-y-2 text-[11px] text-[#4E3629]/70"
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span>Verification status:</span>
                            <span className="font-semibold text-emerald-600">Validated by EHR node</span>
                          </div>
                          {event.provider && (
                            <div className="flex items-center justify-between text-[10px]">
                              <span>Directing provider:</span>
                              <span className="font-semibold text-[#4E3629]">{event.provider}</span>
                            </div>
                          )}
                          <div className="text-[10px] leading-relaxed bg-[#4E3629]/5 rounded-lg p-2 border border-[#4E3629]/10 text-[#4E3629]/70 font-sans">
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
