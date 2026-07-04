'use client';

import React from 'react';
import { NotificationsLog } from '../../features/notifications/NotificationsLog';

export default function NotificationsPage() {
  const headerStyle = {
    fontFamily: "'Clash Display', Inter, sans-serif",
    fontWeight: 700
  };

  return (
    <div className="p-6 space-y-6 text-[#4E3629] bg-[#FAF8F5]">
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight text-[#4E3629]" style={headerStyle}>Physiological Alerts Portal</h1>
        <p className="text-xs text-[#4E3629]/70 font-semibold">Live clinical logs, triggers, and active response records.</p>
      </div>

      <NotificationsLog />
    </div>
  );
}
