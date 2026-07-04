import React from 'react';
import { useAlertsQuery, useUpdateAlertStatusMutation } from '../../hooks/use-alerts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Bell, Check, AlertTriangle, AlertOctagon } from 'lucide-react';
import { cn, formatDateTime } from '../../lib/utils';
import { useAuthStore } from '../../store/use-auth-store';

export const NotificationsLog: React.FC = () => {
  const { user } = useAuthStore();
  const { data: alerts = [], isLoading } = useAlertsQuery('all');
  const updateAlertMutation = useUpdateAlertStatusMutation();

  const handleAcknowledge = (id: string) => {
    updateAlertMutation.mutate({
      alertId: id,
      status: 'acknowledged',
      doctorId: user?.id || 'DOC-001',
      notes: 'Alert acknowledged. Patient monitoring frequency increased.'
    });
  };

  const handleResolve = (id: string) => {
    updateAlertMutation.mutate({
      alertId: id,
      status: 'resolved',
      doctorId: user?.id || 'DOC-001',
      notes: 'Telemetry restabilized. Incident documented.'
    });
  };

  const getSeverityIcon = (severity: 'moderate' | 'high' | 'critical') => {
    switch (severity) {
      case 'critical':
        return <AlertOctagon className="h-4.5 w-4.5 text-rose-600 animate-pulse shrink-0" />;
      case 'high':
        return <AlertTriangle className="h-4.5 w-4.5 text-orange-600 shrink-0" />;
      case 'moderate':
      default:
        return <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0" />;
    }
  };

  return (
    <Card>
      <CardHeader className="text-left">
        <CardTitle className="text-base font-semibold flex items-center space-x-2 text-[#4E3629]">
          <Bell className="h-4.5 w-4.5 text-[#C7A37E]" />
          <span>Universal Physiological Notifications Log</span>
        </CardTitle>
        <CardDescription>
          Unified audit trail of clinical alerts, triggers, and response states.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-20 bg-[#4E3629]/5 animate-pulse rounded-xl" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="py-6 text-center text-sm text-[#4E3629]/50">
            No telemetry alerts logged in the current session.
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={cn(
                  "flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border transition-all duration-200 gap-4 text-left",
                  alert.severity === 'critical' && alert.status !== 'resolved'
                    ? "bg-rose-500/10 animate-critical-glow"
                    : "border-[#4E3629]/10 bg-white/50 hover:bg-white/80"
                )}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(alert.severity)}
                    <span className="text-sm font-extrabold text-[#4E3629]">{alert.patientName}</span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#4E3629]/70 bg-[#4E3629]/5 border border-[#4E3629]/10 rounded px-2 py-0.5">
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#4E3629]/70 font-semibold">
                    Sensor <span className="font-bold text-[#4E3629]">{alert.type}</span> triggered: <span className="text-rose-700 font-black">{alert.value}</span> against baseline threshold: {alert.baseline}
                  </p>
                  <p className="text-[10px] text-[#4E3629]/50 font-bold">{formatDateTime(alert.timestamp)}</p>
                  {alert.notes && (
                    <div className="text-[11px] text-[#4E3629]/80 mt-2 bg-[#4E3629]/5 border border-[#4E3629]/10 p-2.5 rounded-lg">
                      <span className="font-bold text-[#4E3629] block mb-0.5">Note:</span>
                      {alert.notes}
                    </div>
                  )}
                </div>

                {/* Status action buttons */}
                <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                  {alert.status === 'active' && (
                    <Button
                      variant="glow"
                      size="sm"
                      disabled={updateAlertMutation.isPending}
                      onClick={() => handleAcknowledge(alert.id)}
                      className="text-xs font-bold py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-3 cursor-pointer"
                    >
                      Acknowledge
                    </Button>
                  )}
                  {alert.status !== 'resolved' && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updateAlertMutation.isPending}
                      onClick={() => handleResolve(alert.id)}
                      className="text-xs font-bold py-1 text-[#4E3629] hover:bg-[#4E3629]/5 border border-[#4E3629]/15 rounded-lg px-3 cursor-pointer"
                    >
                      Resolve Alert
                    </Button>
                  )}
                  {alert.status === 'resolved' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded flex items-center space-x-1">
                      <Check className="h-3.5 w-3.5" />
                      <span>Archived</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
