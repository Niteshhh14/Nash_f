import React from 'react';
import { useAlertsQuery, useUpdateAlertStatusMutation } from '../../hooks/use-alerts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { CheckCircle2, Siren } from 'lucide-react';
import { formatDateTime } from '../../lib/utils';
import { useAuthStore } from '../../store/use-auth-store';

export const EmergencyAlerts: React.FC = () => {
  const { user } = useAuthStore();
  const { data: alerts = [], isLoading } = useAlertsQuery('all');
  const updateAlertMutation = useUpdateAlertStatusMutation();

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved');

  const handleResolve = (id: string) => {
    updateAlertMutation.mutate({
      alertId: id,
      status: 'resolved',
      doctorId: user?.id || 'DOC-001',
      notes: 'Emergency resolved and vitals restabilized by clinical response team.'
    });
  };

  return (
    <Card className="border-rose-500/20 bg-rose-500/5">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-[#4E3629]/10 space-y-0 text-left">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600">
            <Siren className="h-4.5 w-4.5 animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-rose-700">Critical Ward Emergency Triage</CardTitle>
            <CardDescription className="text-[#4E3629]/70">Live active clinical decompensations requiring immediate response.</CardDescription>
          </div>
        </div>
        <div className="bg-rose-500/20 border border-rose-500/30 text-rose-700 text-[10px] font-bold uppercase tracking-wider rounded px-2.5 py-1">
          {criticalAlerts.length} Active Codes
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-20 bg-[#4E3629]/5 animate-pulse rounded-xl" />
          </div>
        ) : criticalAlerts.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#4E3629]/50 flex flex-col items-center justify-center space-y-1.5">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            <p className="font-bold text-[#4E3629]/70">All Ward Portals Stable</p>
            <p className="font-semibold text-[#4E3629]/50">No critical physiological alerts registered in the last 24 hours.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {criticalAlerts.map((alert) => (
              <div 
                key={alert.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 border rounded-xl gap-4 text-left bg-rose-500/10 animate-critical-glow"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-extrabold text-[#4E3629]">{alert.patientName}</span>
                    <span className="text-[9px] uppercase font-bold text-rose-700 bg-rose-500/15 border border-rose-500/25 rounded px-1.5 py-0.5">
                      {alert.type} critical
                    </span>
                  </div>
                  <p className="text-xs text-[#4E3629]/80 font-medium">
                    Registered <span className="font-extrabold text-rose-700">{alert.value}</span> against baseline reference of <span className="text-[#4E3629] font-semibold">{alert.baseline}</span>.
                  </p>
                  <p className="text-[10px] text-[#4E3629]/50 font-bold">{formatDateTime(alert.timestamp)}</p>
                  {alert.notes && (
                    <div className="bg-white/80 border border-[#4E3629]/10 rounded-lg p-2.5 mt-2 text-[11px] text-[#4E3629]/80">
                      <span className="font-extrabold text-[#4E3629] block mb-0.5">Telemetry Notes:</span>
                      {alert.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end md:self-auto">
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={updateAlertMutation.isPending}
                    onClick={() => handleResolve(alert.id)}
                    className="text-xs cursor-pointer bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-lg"
                  >
                    Clear Code / Resolve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
