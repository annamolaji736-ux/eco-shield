import React, { useState } from 'react';
import { MapPin, School, Navigation, Layers, ShieldAlert, Droplets, Waves, Mountain, Crosshair, ArrowLeft } from 'lucide-react';
import { HazardReport, EvacuationCenter, HazardType } from '../types';

interface MapViewProps {
  reports: HazardReport[];
  evacuationCenters: EvacuationCenter[];
  onOpenReportModal: () => void;
  selectedCenterId?: string | null;
}

export const MapView: React.FC<MapViewProps> = ({
  reports,
  evacuationCenters,
  onOpenReportModal,
  selectedCenterId,
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | HazardType | 'SHELTERS' | 'Stormsurge'>('ALL');
  const [showRadar, setShowRadar] = useState<boolean>(true);
  const [activeItem, setActiveItem] = useState<{
    type: 'report' | 'shelter';
    data: HazardReport | EvacuationCenter;
  } | null>(
    selectedCenterId
      ? { type: 'shelter', data: evacuationCenters.find((e) => e.id === selectedCenterId) || evacuationCenters[0] }
      : null
  );

  return (
    <div className="relative h-full flex flex-col bg-[#e8ecef] select-none pb-20">
      {/* Top Map Header Controls */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-col gap-2">
        <div className="flex items-center justify-between bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-md border border-slate-200">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-900">
              Live Hazard GIS Map
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowRadar(!showRadar)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                showRadar ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Radar {showRadar ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={onOpenReportModal}
              className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg transition-all cursor-pointer"
            >
              + Report
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {(['ALL', 'Flood', 'Stormsurge', 'Landslide', 'SHELTERS'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all shadow-sm cursor-pointer ${
                activeFilter === filter
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-white/90 text-slate-700 hover:bg-white'
              }`}
            >
              {filter === 'SHELTERS' ? '🏫 Shelters' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Stylized SVG Emergency Vector Map */}
      <div className="w-full h-[620px] relative overflow-hidden bg-[#E2E8F0]">
        <svg
          viewBox="0 0 400 600"
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base terrain */}
          <rect width="400" height="600" fill="#E2E8F0" />

          {/* Ocean / Coastal surge zone on the left */}
          <path
            d="M0 0 L110 0 C90 140, 130 280, 70 420 C50 490, 80 560, 60 600 L0 600 Z"
            fill="#BAE6FD"
            opacity="0.9"
          />

          {/* Coastal storm surge surge-buffer zone */}
          <path
            d="M0 0 L125 0 C105 140, 145 280, 85 420 C65 490, 95 560, 75 600 L0 600 Z"
            fill="#38BDF8"
            opacity="0.25"
          />

          {/* Mountain / Ridge contour on the top-right (landslide zone) */}
          <path
            d="M260 0 C280 80, 320 120, 400 130 L400 0 Z"
            fill="#CBD5E1"
            opacity="0.8"
          />
          <path
            d="M290 0 C310 60, 350 90, 400 100 L400 0 Z"
            fill="#94A3B8"
            opacity="0.5"
          />

          {/* Winding River */}
          <path
            d="M400 320 C320 310, 260 360, 200 350 C140 340, 120 370, 75 390"
            fill="none"
            stroke="#60A5FA"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Flooded river overflow envelope */}
          <path
            d="M400 320 C320 310, 260 360, 200 350 C140 340, 120 370, 75 390"
            fill="none"
            stroke="#93C5FD"
            strokeWidth="28"
            strokeOpacity="0.4"
            strokeLinecap="round"
          />

          {/* Road Network Grid */}
          <g stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
            {/* Main Highways */}
            <path d="M70 200 L360 200" />
            <path d="M50 480 L350 480" />
            <path d="M220 50 L220 550" />
            <path d="M310 100 L310 520" />
            <path d="M140 120 L140 450" />
          </g>

          {/* Secondary streets */}
          <g stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" opacity="0.7">
            <path d="M100 150 L340 150" />
            <path d="M80 260 L360 260" />
            <path d="M90 410 L330 410" />
            <path d="M180 80 L180 490" />
            <path d="M270 120 L270 480" />
          </g>

          {/* Safe Route line connecting User to St. Jude School */}
          <path
            d="M170 280 L220 280 L220 200 L180 200"
            fill="none"
            stroke="#10B981"
            strokeWidth="4"
            strokeDasharray="6,4"
          />

          {/* Doppler Radar Rain Animation Overlay */}
          {showRadar && (
            <g opacity="0.55">
              <circle cx="210" cy="270" r="160" fill="url(#radarGrad)" className="animate-pulse" />
              <defs>
                <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.7" />
                  <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.5" />
                  <stop offset="70%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </radialGradient>
              </defs>
            </g>
          )}

          {/* User Location Marker */}
          <g transform="translate(170, 280)">
            <circle r="16" fill="#3B82F6" opacity="0.25" className="animate-ping" />
            <circle r="8" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2.5" />
          </g>
        </svg>

        {/* Floating Hazard & Shelter Marker Overlays on Map */}
        {/* 1. St. Jude Elementary School (Shelter) */}
        {(activeFilter === 'ALL' || activeFilter === 'SHELTERS') && (
          <div
            onClick={() => setActiveItem({ type: 'shelter', data: evacuationCenters[0] })}
            className="absolute top-[180px] left-[160px] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
          >
            <div className="relative flex flex-col items-center">
              <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-lg border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <School className="w-5 h-5" />
              </div>
              <div className="mt-1 bg-white/95 px-2 py-0.5 rounded-md shadow-sm border border-slate-200 text-[10px] font-bold text-slate-800 whitespace-nowrap">
                St. Jude School (Open)
              </div>
            </div>
          </div>
        )}

        {/* 2. Flood Incident Pin */}
        {(activeFilter === 'ALL' || activeFilter === 'Flood') && (
          <div
            onClick={() => setActiveItem({ type: 'report', data: reports[0] })}
            className="absolute top-[320px] left-[210px] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
          >
            <div className="relative flex flex-col items-center">
              <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Droplets className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  14
                </span>
              </div>
              <div className="mt-1 bg-white/95 px-1.5 py-0.5 rounded-md shadow-sm border border-slate-200 text-[9px] font-bold text-blue-700 whitespace-nowrap">
                Flood: 95cm
              </div>
            </div>
          </div>
        )}

        {/* 3. Stormsurge Pin */}
        {(activeFilter === 'ALL' || activeFilter === 'Stormsurge' || activeFilter === 'Storm Surge') && (
          <div
            onClick={() => setActiveItem({ type: 'report', data: reports[2] })}
            className="absolute top-[240px] left-[70px] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
          >
            <div className="relative flex flex-col items-center">
              <div className="bg-cyan-600 text-white p-2 rounded-xl shadow-lg border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Waves className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-cyan-900 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  6
                </span>
              </div>
              <div className="mt-1 bg-white/95 px-1.5 py-0.5 rounded-md shadow-sm border border-slate-200 text-[9px] font-bold text-cyan-800 whitespace-nowrap">
                Stormsurge Wave
              </div>
            </div>
          </div>
        )}

        {/* 4. Landslide Pin */}
        {(activeFilter === 'ALL' || activeFilter === 'Landslide') && (
          <div
            onClick={() => setActiveItem({ type: 'report', data: reports[3] })}
            className="absolute top-[80px] left-[310px] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
          >
            <div className="relative flex flex-col items-center">
              <div className="bg-amber-600 text-white p-2 rounded-xl shadow-lg border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mountain className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </div>
              <div className="mt-1 bg-white/95 px-1.5 py-0.5 rounded-md shadow-sm border border-slate-200 text-[9px] font-bold text-amber-800 whitespace-nowrap">
                Landslide
              </div>
            </div>
          </div>
        )}

        {/* Current user badge */}
        <div className="absolute top-[280px] left-[170px] translate-x-2 -translate-y-6 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-md pointer-events-none">
          You (Safe zone)
        </div>
      </div>

      {/* Selected Marker Detail Drawer Card */}
      {activeItem && (
        <div className="absolute bottom-20 left-3 right-3 z-30 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  activeItem.type === 'shelter'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {activeItem.type === 'shelter' ? <School className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {'name' in activeItem.data ? activeItem.data.name : activeItem.data.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {'address' in activeItem.data ? activeItem.data.address : activeItem.data.locationName} •{' '}
                  <span className="font-semibold text-slate-700">{activeItem.data.distanceKm} km away</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveItem(null)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => alert(`Starting GPS navigation: Avoid flooded riverbank. Route length: ${activeItem.data.distanceKm} km`)}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
              <span>Navigate Safe Route</span>
            </button>

            <button
              onClick={() => setActiveItem(null)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-3 rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
