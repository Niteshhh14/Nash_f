import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis
} from 'recharts';

interface RiskRadialProps {
  score: number;
}

export const RiskRadial: React.FC<RiskRadialProps> = ({ score }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-32 w-32 animate-pulse bg-white/5 rounded-full" />;
  }

  // Set colors based on risk severity
  const getRiskColor = (val: number) => {
    if (val >= 80) return '#f43f5e'; // rose-500
    if (val >= 60) return '#f97316'; // orange-500
    if (val >= 30) return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
  };

  const color = getRiskColor(score);

  const data = [
    {
      name: 'Risk',
      value: score,
      fill: color
    }
  ];

  return (
    <div className="relative h-32 w-32 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="75%"
          outerRadius="100%"
          barSize={8}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            dataKey="value"
            cornerRadius={5}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      {/* Central Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-2xl font-bold tracking-tighter"
          style={{
            color,
            textShadow: `0 0 15px ${color}30`
          }}
        >
          {score}%
        </span>
        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-semibold">
          AI Risk Index
        </span>
      </div>
    </div>
  );
};
