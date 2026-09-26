import React from 'react';
import { Waves, Mountain, Shield, ChevronRight, MapPin, AlertCircle, Droplets, CheckCircle2 } from 'lucide-react';
import { HazardReport, HazardType } from '../types';

interface ReportsNearYouProps {
  reports: HazardReport[];
  selectedType: HazardType | 'ALL';
  onSelectType: (type: HazardType | 'ALL') => void;
  onViewReportDetails: (report: HazardReport) => void;
  onOpenReportModal: (defaultType?: HazardType) => void;
}

export const ReportsNearYou: React.FC<ReportsNearYouProps> = ({
  reports,
  selectedType,
  onSelectType,
  onViewReportDetails,
  onOpenReportModal,
}) => {
  // Count by hazard type
  const floodCount = reports.filter((r) => r.type === 'Flood').reduce((acc, r) => acc + r.reportsCount, 0) || 14;
  const stormsurgeCount = reports.filter((r) => r.type === 'Storm Surge' || (r.type as string) === 'Stormsurge').reduce((acc, r) => acc + r.reportsCount, 0) || 6;
  const landslideCount = reports.filter((r) => r.type === 'Landslide').reduce((acc, r) => acc + r.reportsCount, 0) || 3;

  // Filtered reports for the quick list preview below
  const activeReports = selectedType === 'ALL'
    ? reports.slice(0, 2)
    : reports.filter((r) => r.type === selectedType);

  return (
    <section className="mx-4 mt-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Reports near you
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            • within 5 km
          </span>
        </div>

        <button
          onClick={() => onSelectType(selectedType === 'ALL' ? 'Flood' : 'ALL')}
          className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-0.5 cursor-pointer"
        >
          {selectedType === 'ALL' ? 'Filter by type' : 'Show all'}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* The 3 Square Map-Pin Hazard Cards with numerical notification badges */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* 1. FLOOD */}
        <button
          onClick={() => onSelectType(selectedType === 'Flood' ? 'ALL' : 'Flood')}
          className={`relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white border transition-all text-center group cursor-pointer active:scale-95 ${
            selectedType === 'Flood'
              ? 'border-amber-400 shadow-md ring-2 ring-amber-400/20 bg-amber-50/30'
              : 'border-slate-100 shadow-sm hover:border-amber-300 hover:shadow-md'
          }`}
        >
          {/* Numerical Notification Badge */}
          <div className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1.5 rounded-full bg-blue-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-sm border-2 border-white tabular-nums">
            {floodCount}
          </div>

          {/* Square Map-Pin Icon Container */}
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform relative">
            <MapPin className="w-6 h-6 text-blue-500 fill-blue-500/20" />
            <Droplets className="w-3.5 h-3.5 text-blue-600 absolute top-3" />
          </div>

          <span className="text-xs font-bold text-slate-800">
            Flood
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5">
            14 incidents
          </span>
        </button>

        {/* 2. STORMSURGE */}
        <button
          onClick={() => onSelectType(selectedType === 'Storm Surge' ? 'ALL' : 'Storm Surge')}
          className={`relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white border transition-all text-center group cursor-pointer active:scale-95 ${
            selectedType === 'Storm Surge' || (selectedType as string) === 'Stormsurge'
              ? 'border-cyan-400 shadow-md ring-2 ring-cyan-400/20 bg-cyan-50/30'
              : 'border-slate-100 shadow-sm hover:border-cyan-300 hover:shadow-md'
          }`}
        >
          {/* Numerical Notification Badge */}
          <div className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1.5 rounded-full bg-cyan-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-sm border-2 border-white tabular-nums">
            {stormsurgeCount}
          </div>

          {/* Square Map-Pin Icon Container */}
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform relative">
            <MapPin className="w-6 h-6 text-cyan-600 fill-cyan-500/20" />
            <Waves className="w-3.5 h-3.5 text-cyan-700 absolute top-3" />
          </div>

          <span className="text-xs font-bold text-slate-800">
            Storm Surge
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5">
            6 coastal
          </span>
        </button>

        {/* 3. LANDSLIDE */}
        <button
          onClick={() => onSelectType(selectedType === 'Landslide' ? 'ALL' : 'Landslide')}
          className={`relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white border transition-all text-center group cursor-pointer active:scale-95 ${
            selectedType === 'Landslide'
              ? 'border-amber-500 shadow-md ring-2 ring-amber-500/20 bg-amber-50/40'
              : 'border-slate-100 shadow-sm hover:border-amber-400 hover:shadow-md'
          }`}
        >
          {/* Numerical Notification Badge */}
          <div className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1.5 rounded-full bg-amber-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-sm border-2 border-white tabular-nums">
            {landslideCount}
          </div>

          {/* Square Map-Pin Icon Container */}
          <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform relative">
            <MapPin className="w-6 h-6 text-amber-600 fill-amber-500/20" />
            <Mountain className="w-3.5 h-3.5 text-amber-800 absolute top-3" />
          </div>

          <span className="text-xs font-bold text-slate-800">
            Landslide
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5">
            3 blockages
          </span>
        </button>
      </div>

      {/* Quick Recent Report Item Preview */}
      <div className="mt-2.5 space-y-2">
        {activeReports.map((report) => (
          <div
            key={report.id}
            onClick={() => onViewReportDetails(report)}
            className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all flex items-start justify-between gap-2.5 cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  report.type === 'Flood'
                    ? 'bg-blue-100 text-blue-600'
                    : report.type === 'Stormsurge'
                    ? 'bg-cyan-100 text-cyan-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {report.type === 'Flood' ? (
                  <Droplets className="w-4 h-4" />
                ) : report.type === 'Stormsurge' ? (
                  <Waves className="w-4 h-4" />
                ) : (
                  <Mountain className="w-4 h-4" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {report.title}
                  </h4>
                  {report.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {report.locationName} • {report.distanceKm} km away
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  report.severity === 'critical'
                    ? 'bg-red-50 text-red-600'
                    : report.severity === 'high'
                    ? 'bg-orange-50 text-orange-600'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {report.severity.toUpperCase()}
              </span>
              <div className="text-[10px] text-slate-400 mt-1">{report.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
