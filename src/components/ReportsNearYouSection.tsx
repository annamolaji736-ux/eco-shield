import React from 'react';
import { Waves, Wind, Mountain, Flame, ShieldAlert, ChevronRight, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { HazardReport, HazardType } from '../types';

interface ReportsNearYouSectionProps {
  reports: HazardReport[];
  onViewReport: (report: HazardReport) => void;
  onViewOnMap: (report: HazardReport) => void;
}

export const ReportsNearYouSection: React.FC<ReportsNearYouSectionProps> = ({
  reports,
  onViewReport,
  onViewOnMap,
}) => {
  // Pre-configured hazard cards matching the exact design spec
  const hazardCategoryCards: {
    type: HazardType;
    icon: string;
    iconComponent: React.ReactNode;
    reportsCount: number;
    distance: string;
    riskLevel: '🔴 High Risk' | '🔴 Critical' | '🟠 Moderate' | '🟡 Caution';
    badgeColor: string;
    bgHover: string;
    sampleReport: HazardReport | undefined;
  }[] = [
    {
      type: 'Flood',
      icon: '🌊',
      iconComponent: <Waves className="w-5 h-5 text-blue-600" />,
      reportsCount: 12,
      distance: '2.4 km away',
      riskLevel: '🔴 High Risk',
      badgeColor: 'bg-red-100 text-red-700 border-red-200',
      bgHover: 'hover:border-blue-300 hover:shadow-blue-50',
      sampleReport: reports.find((r) => r.type === 'Flood'),
    },
    {
      type: 'Storm Surge',
      icon: '🌪️',
      iconComponent: <Wind className="w-5 h-5 text-cyan-600" />,
      reportsCount: 7,
      distance: '3.8 km away',
      riskLevel: '🔴 High Risk',
      badgeColor: 'bg-orange-100 text-orange-700 border-orange-200',
      bgHover: 'hover:border-cyan-300 hover:shadow-cyan-50',
      sampleReport: reports.find((r) => r.type === 'Storm Surge'),
    },
    {
      type: 'Landslide',
      icon: '⛰️',
      iconComponent: <Mountain className="w-5 h-5 text-amber-700" />,
      reportsCount: 5,
      distance: '4.1 km away',
      riskLevel: '🔴 High Risk',
      badgeColor: 'bg-red-100 text-red-700 border-red-200',
      bgHover: 'hover:border-amber-300 hover:shadow-amber-50',
      sampleReport: reports.find((r) => r.type === 'Landslide'),
    },
    {
      type: 'Wildfire',
      icon: '🔥',
      iconComponent: <Flame className="w-5 h-5 text-red-600" />,
      reportsCount: 4,
      distance: '6.2 km away',
      riskLevel: '🟠 Moderate',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      bgHover: 'hover:border-red-300 hover:shadow-red-50',
      sampleReport: reports.find((r) => r.type === 'Wildfire'),
    },
    {
      type: 'Road Blockage',
      icon: '🚧',
      iconComponent: <ShieldAlert className="w-5 h-5 text-slate-700" />,
      reportsCount: 9,
      distance: '1.5 km away',
      riskLevel: '🟠 Moderate',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      bgHover: 'hover:border-slate-400 hover:shadow-slate-50',
      sampleReport: reports.find((r) => r.type === 'Road Blockage'),
    },
  ];

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Reports Near You</span>
            <span className="text-xs font-bold text-slate-400 font-mono">• within 5 km radius</span>
          </h3>
          <p className="text-xs text-slate-500">Crowdsourced & sensor-verified emergency incidents</p>
        </div>
      </div>

      {/* 5 Modern Responsive Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {hazardCategoryCards.map((card) => (
          <div
            key={card.type}
            onClick={() => card.sampleReport && onViewReport(card.sampleReport)}
            className={`bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm transition-all hover:shadow-md cursor-pointer flex flex-col justify-between ${card.bgHover} group`}
          >
            <div>
              {/* Top row: Emoji & Risk badge */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-2xl">{card.icon}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border ${card.badgeColor}`}>
                  {card.riskLevel}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                {card.type}
              </h4>

              {/* Report Stats */}
              <div className="mt-2 space-y-1 text-xs">
                <div className="font-extrabold text-slate-800 tabular-nums">
                  {card.reportsCount} reports
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{card.distance}</span>
                </div>
              </div>
            </div>

            {/* Footer action link */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-bold group-hover:text-amber-700">
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
