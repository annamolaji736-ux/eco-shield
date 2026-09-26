import React, { useState } from 'react';
import { School, MapPin, Navigation, Phone, Heart, Zap, CheckCircle2, ChevronRight, Users, ShieldCheck } from 'lucide-react';
import { EvacuationCenter } from '../types';

interface EvacuationCentersSectionProps {
  centers: EvacuationCenter[];
  onNavigateToCenter: (center: EvacuationCenter) => void;
  onCallCenter: (phone: string) => void;
}

export const EvacuationCentersSection: React.FC<EvacuationCentersSectionProps> = ({
  centers,
  onNavigateToCenter,
  onCallCenter,
}) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const displayedCenters = showAll ? centers : centers.slice(0, 2);

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Evacuation Centers Near You</span>
            <span className="text-xs font-bold text-slate-400 font-mono">• Designated Relief Shelters</span>
          </h3>
          <p className="text-xs text-slate-500">Government & community high-ground safety hubs</p>
        </div>

        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
        >
          <span>{showAll ? 'Show fewer' : `View all (${centers.length})`}</span>
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAll ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {displayedCenters.map((center) => {
          const occupancyPercent = Math.round((center.currentOccupancy / center.totalCapacity) * 100);
          const slotsLeft = center.totalCapacity - center.currentOccupancy;
          const isOpen = center.status === 'OPEN';

          return (
            <div
              key={center.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                      <School className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                          {center.name}
                        </h4>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black ${
                            isOpen
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isOpen ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
                            }`}
                          />
                          {center.status}
                        </span>
                      </div>

                      {/* Address & Distance matching spec: "Koothattukulam, Kerala • 📍 1.8 km away" */}
                      <div className="flex items-center gap-1 text-xs text-slate-600 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{center.address}</span>
                        <span className="font-bold text-slate-800 ml-1">📍 {center.distanceKm} km away</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mt-4 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Capacity: {center.totalCapacity}</span>
                    </span>
                    <span className="font-extrabold text-slate-800 tabular-nums">
                      {slotsLeft} slots remaining ({occupancyPercent}% full)
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        occupancyPercent > 85
                          ? 'bg-red-500'
                          : occupancyPercent > 60
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>

                {/* Facilities Badges */}
                <div className="flex items-center gap-1.5 mt-3 flex-wrap text-[11px] text-slate-600">
                  {(center.facilities || []).map((fac, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-lg text-slate-700 font-medium"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Navigate button & Call reception */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onNavigateToCenter(center)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  <span>Navigate</span>
                </button>

                <button
                  onClick={() => onCallCenter(center.contactNumber)}
                  className="flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-800 text-xs font-bold py-2.5 px-3 rounded-xl border border-emerald-200 transition-all cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Call Desk</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
