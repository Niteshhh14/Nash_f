'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Cpu, Database, Key } from 'lucide-react';

export default function SettingsPage() {
  const [alertOpen, setAlertOpen] = useState(false);
  const headerStyle = {
    fontFamily: "'Clash Display', Inter, sans-serif",
    fontWeight: 700
  };

  return (
    <div className="p-6 space-y-6 text-[#4E3629] bg-[#FAF8F5]">
      {/* Title */}
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight text-[#4E3629]" style={headerStyle}>Developer Integrations Panel</h1>
        <p className="text-xs text-[#4E3629]/70 font-semibold">Map and check status of backend REST and AI endpoints.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Services mapping cards */}
        <Card>
          <CardHeader className="text-left">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2 text-[#4E3629]">
              <Database className="h-4.5 w-4.5 text-[#C7A37E]" />
              <span>Core REST Endpoints abstraction layer (/services/api)</span>
            </CardTitle>
            <CardDescription>
              Maps static schemas to clinical relational entities.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-mono">
            <div className="p-3 border border-[#4E3629]/10 bg-white/50 rounded-xl space-y-2 text-left">
              <div className="flex items-center justify-between border-b border-[#4E3629]/10 pb-1.5">
                <span className="text-[#C7A37E] font-bold">getProfile()</span>
                <span className="text-[#4E3629]/60 font-semibold">GET /api/v1/auth/me</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#4E3629]/10 pb-1.5">
                <span className="text-[#C7A37E] font-bold">fetchPatients()</span>
                <span className="text-[#4E3629]/60 font-semibold">GET /api/v1/patients</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#4E3629]/10 pb-1.5">
                <span className="text-[#C7A37E] font-bold">fetchPatientById()</span>
                <span className="text-[#4E3629]/60 font-semibold">GET /api/v1/patients/{"{id}"}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#4E3629]/10 pb-1.5">
                <span className="text-[#C7A37E] font-bold">fetchAlerts()</span>
                <span className="text-[#4E3629]/60 font-semibold">GET /api/v1/alerts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#C7A37E] font-bold">fetchPredictiveReports()</span>
                <span className="text-[#4E3629]/60 font-semibold">GET /api/v1/reports</span>
              </div>
            </div>
            <p className="text-[10px] text-[#4E3629]/70 font-sans text-left">
              To swap to FastAPI or Node REST endpoints, replace functions in <span className="font-mono text-[#C7A37E]">/services/api</span> with standard <span className="font-mono">fetch()</span> mappings.
            </p>
          </CardContent>
        </Card>

        {/* AI endpoints card */}
        <Card>
          <CardHeader className="text-left">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2 text-[#4E3629]">
              <Cpu className="h-4.5 w-4.5 text-[#C7A37E]" />
              <span>AI Engine Abstractions (/services/ai)</span>
            </CardTitle>
            <CardDescription>
              Configured AI inference hooks (Codex, GPT, or Custom Models).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-mono">
            <div className="p-3 border border-[#4E3629]/10 bg-white/50 rounded-xl space-y-2 text-left">
              <div className="flex items-center justify-between border-b border-[#4E3629]/10 pb-1.5">
                <span className="text-[#C7A37E] font-bold">generateRiskScore()</span>
                <span className="text-[#4E3629]/60 font-semibold">POST /ai/predict/risk</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#4E3629]/10 pb-1.5">
                <span className="text-[#C7A37E] font-bold">predictReadmission()</span>
                <span className="text-[#4E3629]/60 font-semibold">POST /ai/predict/readmission</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#4E3629]/10 pb-1.5">
                <span className="text-[#C7A37E] font-bold">getCareRecommendations()</span>
                <span className="text-[#4E3629]/60 font-semibold">POST /ai/recommendations</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#4E3629]/10 pb-1.5">
                <span className="text-[#C7A37E] font-bold">getClinicalSummary()</span>
                <span className="text-[#4E3629]/60 font-semibold">POST /ai/summary</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#C7A37E] font-bold">getDigitalTwinTelemetry()</span>
                <span className="text-[#4E3629]/60 font-semibold">POST /ai/twin/telemetry</span>
              </div>
            </div>
            <p className="text-[10px] text-[#4E3629]/70 font-sans text-left">
              AI service calls are configured with async delays to simulate computation times. Swapping them with real API endpoints will automatically trigger the custom Skeleton loaders seamlessly in the UI.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Key Credentials */}
      <Card>
        <CardHeader className="text-left">
          <CardTitle className="text-sm font-semibold flex items-center space-x-2 text-[#4E3629]">
            <Key className="h-4.5 w-4.5 text-[#C7A37E]" />
            <span>Developer Credentials & Tokens</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#4E3629]/60 block">
              Nash AI Secret Token
            </label>
            <div className="flex space-x-2">
              <input
                type="password"
                disabled
                value="ae_secret_key_placeholder_for_future_codex_endpoints"
                className="w-full bg-[#4E3629]/5 border border-[#4E3629]/15 text-xs text-[#4E3629]/70 rounded-lg p-2.5 outline-none font-mono"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setAlertOpen(true)}
                className="text-[#4E3629] font-bold border-[#4E3629]/15 hover:bg-[#4E3629]/5 cursor-pointer shrink-0"
              >
                Verify Connection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title="Configuration Lock"
      >
        <div className="space-y-4 text-[#4E3629] text-left">
          <p className="text-xs font-semibold leading-relaxed text-[#4E3629]/80">
            Nash OS Secret Tokens and connection configurations are locked in Sandbox mode. Swapping to production mode will automatically register and link these credentials to your server layer.
          </p>
          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setAlertOpen(false)}
              className="text-xs font-bold px-4 py-2 cursor-pointer"
            >
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
