'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPredictiveReports } from '../../../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { TrendingDown, TrendingUp, HelpCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ReportsPage() {
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['predictive-reports'],
    queryFn: fetchPredictiveReports
  });

  const getTrendIcon = (trend: 'improving' | 'stable' | 'deteriorating') => {
    switch (trend) {
      case 'improving':
        return <TrendingDown className="h-4 w-4 text-emerald-700" />;
      case 'deteriorating':
        return <TrendingUp className="h-4 w-4 text-rose-700" />;
      case 'stable':
      default:
        return <HelpCircle className="h-4 w-4 text-[#4E3629]/50" />;
    }
  };

  const getTrendClass = (trend: 'improving' | 'stable' | 'deteriorating') => {
    switch (trend) {
      case 'improving': return 'text-emerald-700 border-emerald-500/20 bg-emerald-500/5';
      case 'deteriorating': return 'text-rose-700 border-rose-500/20 bg-rose-500/5';
      case 'stable':
      default:
        return 'text-[#4E3629]/70 border-[#4E3629]/10 bg-white/50';
    }
  };

  const headerStyle = {
    fontFamily: "'Clash Display', Inter, sans-serif",
    fontWeight: 700
  };

  return (
    <div className="p-6 space-y-6 text-[#4E3629] bg-[#FAF8F5]">
      {/* Title */}
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight text-[#4E3629]" style={headerStyle}>Predictive Cohort Diagnostics</h1>
        <p className="text-xs text-[#4E3629]/70 font-semibold">AI-synthesized clinical forecasts and hospital readmission models.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-48 bg-[#4E3629]/5 animate-pulse rounded-2xl" />
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 text-sm text-[#4E3629]/50">
          No predictive reports compiled.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#4E3629]/10 pb-4 gap-4">
                <div className="space-y-1 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-extrabold text-[#4E3629]">{report.title}</span>
                    <span className={`px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded border flex items-center space-x-1 ${getTrendClass(report.riskTrend)}`}>
                      {getTrendIcon(report.riskTrend)}
                      <span>{report.riskTrend}</span>
                    </span>
                  </div>
                  <p className="text-xs text-[#4E3629]/70 font-semibold">Target Group: <span className="font-bold text-[#4E3629]">{report.targetGroup}</span></p>
                </div>

                {/* Meta details */}
                <div className="flex items-center space-x-6 text-xs">
                  <div className="text-left">
                    <span className="text-[10px] text-[#4E3629]/50 font-bold uppercase tracking-wider block">Cohort Size</span>
                    <span className="text-sm font-extrabold text-[#4E3629]">{report.cohortSize} Patients</span>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-[#4E3629]/50 font-bold uppercase tracking-wider block">AI Confidence</span>
                    <span className="text-sm font-extrabold text-[#C7A37E]">{report.confidenceScore}%</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Summary cards */}
                <div className="space-y-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4E3629]/65 block text-left">
                    AI Diagnostic Metrics
                  </span>
                  {report.metrics.map((metric, idx) => (
                    <div key={idx} className="p-3 border border-[#4E3629]/10 bg-[#4E3629]/3 rounded-xl flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-[10px] text-[#4E3629]/60 font-bold block">{metric.label}</span>
                        <span className="text-sm font-black text-[#4E3629] mt-0.5">{metric.value}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        metric.isPositive ? 'text-emerald-700 bg-emerald-500/10' : 'text-rose-700 bg-rose-500/10'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Visualizer Chart representation */}
                <div className="lg:col-span-2 space-y-2 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4E3629]/65 block mb-2">
                    Predicted Weekly Alert Exceedances (Forecast vs Baseline)
                  </span>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={report.graphData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(78,54,41,0.05)" />
                        <XAxis dataKey="date" stroke="rgba(78,54,41,0.4)" fontSize={10} tickLine={false} />
                        <YAxis stroke="rgba(78,54,41,0.4)" fontSize={10} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(250, 248, 245, 0.95)',
                            border: '1px solid rgba(78, 54, 41, 0.15)',
                            borderRadius: '12px',
                            fontSize: '11px',
                            color: '#4E3629'
                          }}
                        />
                        <Bar dataKey="baseline" name="Baseline Alerts" fill="rgba(78,54,41,0.1)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="predicted" name="AI Forecast Alerts" fill="#C7A37E" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
