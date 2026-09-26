import React from 'react';
import { AlertTriangle, PlusCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface AlertBannerProps {
  onReportNow: () => void;
  onViewAdvisoryDetails?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  onReportNow,
  onViewAdvisoryDetails,
}) => {
  return (
    <div className="mx-4 mt-3">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 transition-all hover:shadow-md">
        <div className="flex items-start gap-3">
          {/* Warning Icon Badge */}
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse" />
          </div>

          {/* Alert Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                Severe Storm Warning
              </span>
              <span className="text-[11px] text-slate-400 font-medium">10m ago</span>
            </div>

            <h2 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
              Rapid water rise detected in coastal & riverbanks
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
              Typhoon Gale Force 8. If trapped or witnessing hazards, report immediate coordinates to local rescue teams.
            </p>
          </div>
        </div>

        {/* Action row with bold orange "Report now" button */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-medium text-slate-600">Local teams on standby</span>
          </div>

          {/* The required bold orange button */}
          <button
            onClick={onReportNow}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-orange-500/25 transition-all cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
