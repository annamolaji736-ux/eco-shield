import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, RefreshCw } from 'lucide-react';
import { SafetyStatusLevel } from '../types';

interface SafetyStatusCardProps {
  status: SafetyStatusLevel;
  onStatusChange?: (newStatus: SafetyStatusLevel) => void;
  lastUpdatedText?: string;
  onReportNow?: () => void;
}

export const SafetyStatusCard: React.FC<SafetyStatusCardProps> = ({
  status,
  onStatusChange,
  lastUpdatedText = 'Last updated 2 minutes ago',
  onReportNow,
}) => {
  const statusConfig = {
    SAFE: {
      label: 'YOU ARE SAFE',
      subtext: 'No critical hazards detected within your immediate 3 km sector.',
      badgeColor: 'bg-emerald-500 text-white',
      cardBg: 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 border-emerald-200',
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
      dotColor: 'bg-emerald-500',
      textColor: 'text-emerald-950',
    },
    CAUTION: {
      label: 'CAUTION',
      subtext: 'Weather advisory active. Riverbanks and storm drains rising.',
      badgeColor: 'bg-amber-400 text-slate-950',
      cardBg: 'bg-gradient-to-br from-amber-50 via-white to-amber-50/40 border-amber-200',
      icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
      dotColor: 'bg-amber-500',
      textColor: 'text-amber-950',
    },
    HIGH_RISK: {
      label: 'HIGH RISK',
      subtext: 'Heavy rainfall inundating lowlands. Stay prepared for relocation.',
      badgeColor: 'bg-orange-500 text-white',
      cardBg: 'bg-gradient-to-br from-orange-50 via-white to-orange-50/50 border-orange-300',
      icon: <AlertTriangle className="w-8 h-8 text-orange-600" />,
      dotColor: 'bg-orange-500',
      textColor: 'text-orange-950',
    },
    CRITICAL: {
      label: 'CRITICAL DANGER',
      subtext: 'Flash flood cresting levee! Evacuate immediately to St. Mary\'s HSS.',
      badgeColor: 'bg-red-600 text-white animate-pulse',
      cardBg: 'bg-gradient-to-br from-red-50 via-white to-red-50/60 border-red-300 shadow-red-100',
      icon: <AlertOctagon className="w-8 h-8 text-red-600" />,
      dotColor: 'bg-red-600',
      textColor: 'text-red-950',
    },
  };

  const current = statusConfig[status];

  return (
    <div className={`rounded-3xl p-5 sm:p-6 border shadow-sm transition-all duration-300 ${current.cardBg}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Main Status Display */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
            {current.icon}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Current Safety Assessment
              </span>
              <span className="text-[10px] text-slate-400">• {lastUpdatedText}</span>
            </div>

            <div className="flex items-center gap-2.5 mt-1">
              <span className={`w-3.5 h-3.5 rounded-full ${current.dotColor} animate-ping`} />
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${current.textColor}`}>
                {current.label}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-medium">
              {current.subtext}
            </p>
          </div>
        </div>

        {/* Quick Simulation Selector (allows user & reviewer to test dynamic states) */}
        {onStatusChange && (
          <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/80 shadow-sm shrink-0 self-start sm:self-center">
            <span className="text-[10px] font-bold text-slate-400 block px-2 mb-1">
              Simulate Risk Level:
            </span>
            <div className="grid grid-cols-4 gap-1">
              {(['SAFE', 'CAUTION', 'HIGH_RISK', 'CRITICAL'] as SafetyStatusLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onStatusChange(lvl)}
                  className={`px-2 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                    status === lvl
                      ? lvl === 'SAFE'
                        ? 'bg-emerald-600 text-white'
                        : lvl === 'CAUTION'
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : lvl === 'HIGH_RISK'
                        ? 'bg-orange-500 text-white'
                        : 'bg-red-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {lvl === 'SAFE' && '🟢 Safe'}
                  {lvl === 'CAUTION' && '🟡 Caution'}
                  {lvl === 'HIGH_RISK' && '🟠 High'}
                  {lvl === 'CRITICAL' && '🔴 Critical'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
