import React, { useState } from 'react';
import {
  Cpu,
  Database,
  Cloud,
  Brain,
  MapPin,
  AlertTriangle,
  Bell,
  Users,
  Radio,
  Clock,
  CheckCircle2,
  ChevronRight,
  Info,
} from 'lucide-react';

export const WorkflowExplainer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    { title: 'IoT Sensors', desc: 'Rain gauges, river sonar, soil moisture nodes', icon: <Cpu className="w-4 h-4 text-cyan-600" /> },
    { title: 'Environmental Data', desc: 'Telemetry streaming via LoRaWAN & GSM', icon: <Database className="w-4 h-4 text-blue-600" /> },
    { title: 'Cloud Platform', desc: 'Eco-Shield central disaster cloud ingest', icon: <Cloud className="w-4 h-4 text-indigo-600" /> },
    { title: 'AI/ML Risk Analysis', desc: 'Hydrological & soil creep simulation models', icon: <Brain className="w-4 h-4 text-purple-600" /> },
    { title: 'GIS / Google Maps', desc: 'Geospatial risk contouring & safe routing', icon: <MapPin className="w-4 h-4 text-emerald-600" /> },
    { title: 'Risk Detection', desc: 'Threshold exceedance & breach detection', icon: <AlertTriangle className="w-4 h-4 text-amber-600" /> },
    { title: 'Alert Generation', desc: 'Push, SMS & sirens calibrated to ward level', icon: <Bell className="w-4 h-4 text-orange-600" /> },
    { title: 'Team Notification', desc: 'Disaster rapid rescue dispatched to GPS', icon: <Users className="w-4 h-4 text-blue-700" /> },
    { title: 'SOS / Response', desc: 'Citizen distress beacon & live tracker', icon: <Radio className="w-4 h-4 text-red-600" /> },
    { title: 'Escalation System', desc: 'Auto-reroute to Head Authority if unacknowledged', icon: <Clock className="w-4 h-4 text-rose-600" /> },
    { title: 'Resolution', desc: 'Safe evacuation verification & incident closure', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>Eco-Shield End-to-End Disaster Workflow</span>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
              Automated Lifecycle
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            From IoT river sensor ping to emergency rescue escalation and resolution
          </p>
        </div>
      </div>

      {/* Horizontal Interactive Chain */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div
              onClick={() => setActiveStep(activeStep === idx ? null : idx)}
              className={`flex-shrink-0 flex items-center gap-1.5 p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                activeStep === idx
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-white shadow-xs flex items-center justify-center shrink-0">
                {step.icon}
              </div>
              <span className="whitespace-nowrap">{step.title}</span>
            </div>

            {idx < steps.length - 1 && (
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>

      {activeStep !== null && (
        <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between animate-in fade-in duration-150">
          <div>
            <span className="font-extrabold text-slate-900">{steps[activeStep].title}: </span>
            <span className="text-slate-600">{steps[activeStep].desc}</span>
          </div>
          <button
            onClick={() => setActiveStep(null)}
            className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
