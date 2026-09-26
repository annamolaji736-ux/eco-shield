import React from 'react';
import { School, MapPin, Navigation, Phone, ShieldCheck, Heart, Zap, CheckCircle2, ChevronRight, Users } from 'lucide-react';
import { EvacuationCenter } from '../types';

interface EvacuationCenterCardProps {
  centers: EvacuationCenter[];
  onNavigateToCenter: (center: EvacuationCenter) => void;
  onCallCenter: (phone: string) => void;
}

export const EvacuationCenterCard: React.FC<EvacuationCenterCardProps> = ({
  centers,
  onNavigateToCenter,
  onCallCenter,
}) => {
  // St. Jude Elementary School is the primary one requested
  const primaryCenter = centers[0];
  const [showAll, setShowAll] = React.useState(false);

  const displayedCenters = showAll ? centers : [primaryCenter];

  return (
    <section className="mx-4 mt-4 mb-20">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Evacuation centers near you
          </h2>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-0.5 cursor-pointer"
        >
          {showAll ? 'Show less' : `View all (${centers.length})`}
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAll ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* List items */}
      <div className="space-y-3">
        {displayedCenters.map((center) => {
          const occupancyPercent = Math.round((center.currentOccupancy / center.totalCapacity) * 100);
          const slotsLeft = center.totalCapacity - center.currentOccupancy;

          return (
            <div
              key={center.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm transition-all hover:shadow-md"
            >
              {/* Header inside item */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                    <School className="w-6 h-6 text-amber-600" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {center.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {center.status}
                      </span>
                    </div>

                    {/* Address as requested */}
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{center.address}</span>
                      <span className="font-semibold text-slate-700">({center.distanceKm} km)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="mt-3 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> Capacity
                  </span>
                  <span className="font-bold text-slate-800 tabular-nums">
                    {occupancyPercent}% full • <span className="text-emerald-600">{slotsLeft} slots open</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      occupancyPercent > 85 ? 'bg-red-500' : occupancyPercent > 65 ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${occupancyPercent}%` }}
                  />
                </div>
              </div>

              {/* Amenities tags */}
              <div className="flex items-center gap-2 mt-2.5 text-[11px] text-slate-500 flex-wrap">
                {center.hasMedicalAid && (
                  <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 text-slate-700">
                    <Heart className="w-3 h-3 text-red-500" /> Medical Aid
                  </span>
                )}
                {center.isPetFriendly && (
                  <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 text-slate-700">
                    🐾 Pet Friendly
                  </span>
                )}
                {center.hasGenerator && (
                  <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 text-slate-700">
                    <Zap className="w-3 h-3 text-amber-500" /> Generator
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onNavigateToCenter(center)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  <span>Get Directions</span>
                </button>

                <button
                  onClick={() => onCallCenter(center.contactNumber)}
                  className="flex items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-900 text-xs font-bold py-2.5 px-3 rounded-xl border border-amber-200 transition-all cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <span>Desk</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
