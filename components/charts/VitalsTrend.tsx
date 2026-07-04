import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

interface HistoryData {
  timestamp: string;
  heartRate: number;
  systolic: number;
  diastolic: number;
  oxygenSat: number;
  respiratoryRate: number;
  temperature: number;
}

interface VitalsTrendProps {
  data: HistoryData[];
  type: 'heartRate' | 'bp' | 'oxygenSat' | 'respiratoryRate' | 'temperature';
  color?: string;
}

export const VitalsTrend: React.FC<VitalsTrendProps> = ({
  data,
  type,
  color = '#22d3ee' // Cyan-400 default
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-48 w-full animate-pulse bg-white/5 rounded-xl border border-white/5" />;
  }

  // Format data for chart display
  const chartData = data.map((d) => {
    let value = 0;
    if (type === 'heartRate') value = d.heartRate;
    else if (type === 'bp') value = d.systolic; // Show systolic primarily
    else if (type === 'oxygenSat') value = d.oxygenSat;
    else if (type === 'respiratoryRate') value = d.respiratoryRate;
    else if (type === 'temperature') value = d.temperature;

    return {
      time: d.timestamp,
      value
    };
  });

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id={`color-${type}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
          <XAxis
            dataKey="time"
            stroke="rgba(255,255,255,0.3)"
            fontSize={10}
            tickLine={false}
          />
          <YAxis
            stroke="rgba(255,255,255,0.3)"
            fontSize={10}
            tickLine={false}
            domain={type === 'oxygenSat' ? [80, 100] : ['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(10, 10, 10, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              fontSize: '11px',
              color: '#fff'
            }}
            labelStyle={{ color: '#888' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#color-${type})`}
            isAnimationActive={true}
            animationDuration={400}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
