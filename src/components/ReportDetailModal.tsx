import React from 'react';
import { X, Droplets, Waves, Mountain, MapPin, Clock, CheckCircle2, Navigation, AlertTriangle, Users } from 'lucide-react';
import { HazardReport } from '../types';

interface ReportDetailModalProps {
  report: HazardReport | null;
  onClose: () => void;
  onNavigateMap: (report: HazardReport) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onNavigateMap,
}) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 p-5 animate-in slide-in-from-bottom-6 duration-200">
        {/* Grab bar */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3" />

        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                report.type === 'Flood'
                  ? 'bg-blue-100 text-blue-600'
                  : report.type === 'Storm Surge' || report.type === 'Stormsurge' || report.type === 'Storm'
                  ? 'bg-cyan-100 text-cyan-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {report.type === 'Flood' ? (
                <Droplets className="w-6 h-6" />
              ) : report.type === 'Storm Surge' || report.type === 'Stormsurge' || report.type === 'Storm' ? (
                <Waves className="w-6 h-6" />
              ) : (
                <Mountain className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {report.type} HAZARD
                </span>
                {report.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified by Responders
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                {report.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Metadata stats */}
        <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">Location</div>
              <div className="font-bold text-slate-800 truncate max-w-[130px]">{report.locationName}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">Reported</div>
              <div className="font-bold text-slate-800">{report.timestamp}</div>
            </div>
          </div>
        </div>

        {/* Specific measurements if flood */}
        {report.waterDepthCm && (
          <div className="mt-3 p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-blue-900">Current Flood Level:</span>
            <span className="font-extrabold text-blue-700 tabular-nums">
              {report.waterDepthCm} cm depth (Impassable for cars)
            </span>
          </div>
        )}

        {/* Detailed Description */}
        <div className="mt-3">
          <h4 className="text-xs font-bold text-slate-700 mb-1">Incident Report:</h4>
          <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
            {report.description}
          </p>
        </div>

        {/* Reporter info */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            {report.reportsCount} Community Confirmations
          </span>
          <span className="font-medium">Source: {report.reportedBy}</span>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => onNavigateMap(report)}
            className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-amber-400" />
            <span>View on Radar Map</span>
          </button>

          <button
            onClick={onClose}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
