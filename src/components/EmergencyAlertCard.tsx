import React from 'react';
import { AlertTriangle, PlusCircle, ArrowRight, ShieldCheck, MapPin, Clock, Flame, Waves, Mountain } from 'lucide-react';
import { EmergencyAlert } from '../types';

interface EmergencyAlertCardProps {
  alert: EmergencyAlert;
  onViewAlert: () => void;
  onReportNow: () => void;
}

export const EmergencyAlertCard: React.FC<EmergencyAlertCardProps> = ({
  alert,
  onViewAlert,
  onReportNow,
}) => {
  const isCritical = alert.severity === 'critical';

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Alert Warning Header and Details */}
        <div className="flex items-start gap-3.5">
          {/* Visual Warning Indicator Icon */}
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isCritical
                ? 'bg-red-100 text-red-600 ring-4 ring-red-50 animate-pulse'
                : 'bg-orange-100 text-orange-600 ring-4 ring-orange-50'
            }`}
          >
            <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  isCritical ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'
                }`}
              >
                {alert.severity.toUpperCase()} ALERT
              </span>

              <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                {alert.disasterType === 'Flood' && '🌊'}
                {alert.disasterType === 'Landslide' && '⛰️'}
                {alert.disasterType === 'Wildfire' && '🔥'}
                {alert.disasterType === 'Storm' && '⛈️'}
                {alert.disasterType}
              </span>

              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {alert.timestamp}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 leading-snug">
              {alert.title}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-800">{alert.location}</span>
            </div>

            <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2 max-w-2xl">
              {alert.description}
            </p>
          </div>
        </div>

        {/* Right Side: Dual Action Buttons - View Alert & Report Now */}
        <div className="flex items-center gap-2.5 shrink-0 self-stretch sm:self-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
          <button
            onClick={onViewAlert}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <span>View Alert</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Large prominent "Report Now" button */}
          <button
            onClick={onReportNow}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/25 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
