import React, { useState } from 'react';
import { Droplets, Wind, Compass, Activity, Gauge, CloudRain, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import { EnvironmentalSensors } from '../types';

interface WeatherEnvironmentCardProps {
  sensors: EnvironmentalSensors;
  onOpenLiveMap?: () => void;
}

export const WeatherEnvironmentCard: React.FC<WeatherEnvironmentCardProps> = ({
  sensors,
  onOpenLiveMap,
}) => {
  const [activeTab, setActiveTab] = useState<'WEATHER' | 'SENSORS'>('WEATHER');

  const waterLevelExceeded = sensors.waterLevelMeters > sensors.waterLevelThreshold;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1526] via-[#0f213d] to-[#142d54] text-white p-5 sm:p-6 shadow-xl border border-slate-700/60">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header & Tab Toggle */}
      <div className="flex items-center justify-between relative z-10 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
            IoT Weather & Environmental Telemetry
          </span>
        </div>

        <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-1 text-xs">
          <button
            onClick={() => setActiveTab('WEATHER')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'WEATHER' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-blue-200 hover:text-white'
            }`}
          >
            Atmosphere
          </button>
          <button
            onClick={() => setActiveTab('SENSORS')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'SENSORS' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-blue-200 hover:text-white'
            }`}
          >
            Ground IoT Sensors ({sensors.sensorNodeCount})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* Left Col: Temperature, Condition, and "Stay Safe & Dry" */}
        <div className="md:col-span-7 space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-white tracking-tight tabular-nums">
              {sensors.temperatureC}°C
            </span>
            <span className="text-sm sm:text-base font-semibold text-blue-200">
              Heavy Monsoon Downpour
            </span>
          </div>

          {/* Requested Prominent Text: "Stay Safe & Dry" */}
          <div className="flex items-center gap-2 pt-1">
            <h3 className="text-lg sm:text-xl font-black text-amber-300 drop-shadow-sm flex items-center gap-1.5">
              <span>Stay Safe & Dry</span>
            </h3>
            <span className="text-[11px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-400/30">
              Typhoon Red Warning
            </span>
          </div>

          <p className="text-xs text-blue-100/80 max-w-md leading-relaxed">
            Persistent moisture convergence across Western Ghats. Avoid riverbanks and stay clear of unstable slope terrain until water levels normalize.
          </p>

          {/* Environmental Sensor Warning Banner if water level exceeded */}
          {waterLevelExceeded && (
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-200 px-3 py-1.5 rounded-xl text-xs font-semibold mt-2">
              <Activity className="w-4 h-4 text-red-400 animate-pulse shrink-0" />
              <span>
                River Gauge Warning: {sensors.waterLevelMeters}m (Threshold: {sensors.waterLevelThreshold}m)
              </span>
            </div>
          )}
        </div>

        {/* Right Col: Custom High-Fidelity Rain Cloud + Lightning Illustration */}
        <div className="md:col-span-5 flex items-center justify-center">
          <div className="relative w-44 h-36 flex items-center justify-center">
            <svg
              viewBox="0 0 140 110"
              className="w-full h-full overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="cloudGradEco" x1="20" y1="20" x2="110" y2="90" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60A5FA" />
                  <stop offset="0.6" stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#1E40AF" />
                </linearGradient>

                <linearGradient id="cloudPuff" x1="40" y1="15" x2="90" y2="50" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#93C5FD" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#60A5FA" stopOpacity="0.1" />
                </linearGradient>

                <filter id="lightningGlowEco" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Rain drops */}
              <g opacity="0.85">
                <line x1="38" y1="78" x2="34" y2="94" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" className="rain-drop-1" />
                <line x1="58" y1="80" x2="54" y2="98" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" className="rain-drop-2" />
                <line x1="78" y1="78" x2="74" y2="95" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" className="rain-drop-3" />
                <line x1="98" y1="82" x2="94" y2="98" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" className="rain-drop-4" />
                <line x1="112" y1="80" x2="108" y2="94" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" className="rain-drop-2" />
              </g>

              {/* Storm Cloud Base */}
              <path
                d="M36 72C25.5 72 17 63.5 17 53C17 43.5 24 35.5 33.5 34.2C35.2 21.5 46 12 59 12C70.5 12 80.5 19.5 83.5 30.5C85.5 30 87.8 29.8 90 29.8C101.5 29.8 111 39.2 111 50.8C111 61.8 102 72 91 72L36 72Z"
                fill="url(#cloudGradEco)"
                filter="drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4))"
              />

              {/* Cloud highlight */}
              <path
                d="M36 36C35.5 36 32 37 30 40C28 43 28 47 29 49C30.5 46 33 44 36 44C40 44 42 47 42 50C42 44 47 40 53 40C59 40 64 44 65 49C66 45 70 41 75 41C80 41 83 44 84 48C86 45 89 43 93 43C98 43 101 47 101 50C101 43 94 37 85 37C82.5 37 80 37.8 78 39C75.5 26 66.5 19 57 19C47 19 38.5 26.5 36 36Z"
                fill="url(#cloudPuff)"
              />

              {/* Lightning Bolt */}
              <g className="animate-lightning" filter="url(#lightningGlowEco)">
                <path
                  d="M72 44L52 69H68L56 96L88 64H70L78 44H72Z"
                  fill="#FACC15"
                  stroke="#FEF08A"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Metrics Row: Depending on tab */}
      <div className="mt-5 pt-4 border-t border-slate-700/60 relative z-10">
        {activeTab === 'WEATHER' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/5 rounded-2xl p-3 flex flex-col">
              <span className="text-blue-200 text-[11px] flex items-center gap-1 font-semibold">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" /> Rainfall
              </span>
              <span className="text-base font-extrabold text-white mt-1 tabular-nums">
                {sensors.rainfallMmPerHour} mm/h
              </span>
              <span className="text-[10px] text-red-300 mt-0.5">Heavy precipitation</span>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 flex flex-col">
              <span className="text-blue-200 text-[11px] flex items-center gap-1 font-semibold">
                <Wind className="w-3.5 h-3.5 text-teal-300" /> Wind Speed
              </span>
              <span className="text-base font-extrabold text-white mt-1 tabular-nums">
                {sensors.windSpeedKmh} km/h
              </span>
              <span className="text-[10px] text-slate-300 mt-0.5">Gusts up to 68 km/h</span>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 flex flex-col">
              <span className="text-blue-200 text-[11px] flex items-center gap-1 font-semibold">
                <Droplets className="w-3.5 h-3.5 text-blue-400" /> Humidity
              </span>
              <span className="text-base font-extrabold text-white mt-1 tabular-nums">
                {sensors.humidityPercent}%
              </span>
              <span className="text-[10px] text-slate-300 mt-0.5">Saturated atmosphere</span>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 flex flex-col">
              <span className="text-blue-200 text-[11px] flex items-center gap-1 font-semibold">
                <Gauge className="w-3.5 h-3.5 text-amber-400" /> Air Quality
              </span>
              <span className="text-base font-extrabold text-white mt-1 tabular-nums">
                AQI {sensors.airQualityIndex}
              </span>
              <span className="text-[10px] text-emerald-400 mt-0.5">{sensors.airQualityStatus}</span>
            </div>
          </div>
        ) : (
          /* SENSORS TAB: Ground IoT Sensor Readings */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/5 rounded-2xl p-3 flex flex-col border border-red-500/30">
              <span className="text-red-300 text-[11px] flex items-center gap-1 font-semibold">
                <Activity className="w-3.5 h-3.5 text-red-400" /> River Water Level
              </span>
              <span className="text-base font-extrabold text-red-200 mt-1 tabular-nums">
                {sensors.waterLevelMeters} m
              </span>
              <span className="text-[10px] text-red-400 mt-0.5">Threshold: {sensors.waterLevelThreshold}m (+0.32m over)</span>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 flex flex-col border border-amber-500/30">
              <span className="text-amber-300 text-[11px] flex items-center gap-1 font-semibold">
                <Droplets className="w-3.5 h-3.5 text-amber-400" /> Soil Moisture
              </span>
              <span className="text-base font-extrabold text-amber-200 mt-1 tabular-nums">
                {sensors.soilMoisturePercent}%
              </span>
              <span className="text-[10px] text-amber-300 mt-0.5">High landslide saturation</span>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 flex flex-col">
              <span className="text-blue-200 text-[11px] flex items-center gap-1 font-semibold">
                <Gauge className="w-3.5 h-3.5 text-teal-400" /> Air Quality (AQI)
              </span>
              <span className="text-base font-extrabold text-white mt-1 tabular-nums">
                {sensors.airQualityIndex} (Clean)
              </span>
              <span className="text-[10px] text-emerald-400 mt-0.5">No toxic smoke detected</span>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 flex flex-col">
              <span className="text-blue-200 text-[11px] flex items-center gap-1 font-semibold">
                <Compass className="w-3.5 h-3.5 text-amber-400" /> Network Mesh
              </span>
              <span className="text-base font-extrabold text-white mt-1 tabular-nums">
                28 / 28 Online
              </span>
              <span className="text-[10px] text-slate-300 mt-0.5">Solar + LoRaWAN relay</span>
            </div>
          </div>
        )}

        {/* Bottom sync note */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-blue-200/80">
          <span>{sensors.lastSyncTime}</span>
          {onOpenLiveMap && (
            <button
              onClick={onOpenLiveMap}
              className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View GIS Sensor Heatmap</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
