import React, { useState } from 'react';
import { Wind, Droplets, Compass, ChevronRight, Eye } from 'lucide-react';
import { WeatherInfo } from '../types';

interface WeatherCardProps {
  weather: WeatherInfo;
  onOpenRadarModal?: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, onOpenRadarModal }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'forecast'>('overview');

  return (
    <div className="mx-4 mt-3">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b172b] via-[#10223e] to-[#162d52] p-5 text-white shadow-lg border border-slate-700/40">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header inside card */}
        <div className="flex items-center justify-between relative z-10 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
              Live Weather Radar
            </span>
          </div>

          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-lg p-0.5 text-[11px]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                activeTab === 'overview' ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-blue-200 hover:text-white'
              }`}
            >
              Live
            </button>
            <button
              onClick={() => setActiveTab('forecast')}
              className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                activeTab === 'forecast' ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-blue-200 hover:text-white'
              }`}
            >
              Hourly
            </button>
          </div>
        </div>

        {/* Center Illustration and 'Stay safe and dry' Text */}
        <div className="flex items-center justify-between gap-4 py-1 relative z-10">
          <div>
            <span className="text-3xl font-extrabold text-white tracking-tight tabular-nums">
              {weather.temperatureC}°C
            </span>
            <div className="text-sm font-semibold text-blue-200 mt-0.5">
              {weather.condition}
            </div>
            {/* The exact requested text */}
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-base font-bold text-amber-300 drop-shadow-sm">
                Stay safe and dry
              </span>
            </div>
          </div>

          {/* High-Fidelity Custom Vector Weather Illustration: Cloud + Lightning Bolt + Raindrops */}
          <div className="relative w-28 h-24 flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 120 100"
              className="w-full h-full overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Cloud gradient */}
                <linearGradient id="cloudGrad" x1="20" y1="20" x2="100" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60A5FA" />
                  <stop offset="0.5" stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#1D4ED8" />
                </linearGradient>

                {/* Cloud highlight */}
                <linearGradient id="cloudHighlight" x1="30" y1="15" x2="80" y2="45" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#93C5FD" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#60A5FA" stopOpacity="0.1" />
                </linearGradient>

                {/* Lightning Glow Filter */}
                <filter id="lightningGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Rain drops */}
              <g className="rain-group" opacity="0.85">
                <line x1="32" y1="72" x2="28" y2="84" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" className="rain-drop-1" />
                <line x1="50" y1="74" x2="46" y2="87" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" className="rain-drop-2" />
                <line x1="68" y1="72" x2="64" y2="85" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" className="rain-drop-3" />
                <line x1="84" y1="73" x2="80" y2="86" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" className="rain-drop-4" />
              </g>

              {/* Storm Cloud Base */}
              <path
                d="M32 64C23.1634 64 16 56.8366 16 48C16 39.8661 22.0628 33.1537 30.0135 32.122C31.5714 20.8123 41.2721 12 53 12C63.4547 12 72.3375 19.0125 75.0343 28.7188C76.9538 28.2497 78.9566 28 81 28C91.4934 28 100 36.5066 100 47C100 56.9411 91.9411 65 82 65L32 64Z"
                fill="url(#cloudGrad)"
                filter="drop-shadow(0 6px 12px rgba(0, 0, 0, 0.35))"
              />

              {/* Cloud Puff Highlights */}
              <path
                d="M32 34C31.5 34 28 35 26 38C24 41 24 45 25 47C26.5 44 29 42 32 42C36 42 38 45 38 48C38 42 43 38 49 38C55 38 60 42 61 47C62 43 66 39 71 39C76 39 79 42 80 46C82 43 85 41 89 41C94 41 97 45 97 48C97 41 90 35 81 35C78.5 35 76 35.8 74 37C71.5 24 62.5 17 53 17C43 17 34.5 24.5 32 34Z"
                fill="url(#cloudHighlight)"
              />

              {/* Glowing Lightning Bolt */}
              <g className="animate-lightning" filter="url(#lightningGlow)">
                <path
                  d="M62 40L45 61H58L49 84L76 56H61L68 40H62Z"
                  fill="#FACC15"
                  stroke="#FEF08A"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Tab content 1: Overview metrics */}
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-700/60 relative z-10 text-xs">
            <div className="flex flex-col items-center bg-white/5 rounded-xl py-2 px-1">
              <span className="text-[10px] text-blue-200 flex items-center gap-1 font-medium">
                <Droplets className="w-3 h-3 text-cyan-400" /> Rain
              </span>
              <span className="font-bold text-white mt-0.5 tabular-nums">
                {weather.precipitationMm} mm/h
              </span>
            </div>

            <div className="flex flex-col items-center bg-white/5 rounded-xl py-2 px-1">
              <span className="text-[10px] text-blue-200 flex items-center gap-1 font-medium">
                <Wind className="w-3 h-3 text-teal-300" /> Wind
              </span>
              <span className="font-bold text-white mt-0.5 tabular-nums">
                {weather.windSpeedKmh} km/h
              </span>
            </div>

            <div className="flex flex-col items-center bg-white/5 rounded-xl py-2 px-1">
              <span className="text-[10px] text-blue-200 flex items-center gap-1 font-medium">
                <Compass className="w-3 h-3 text-amber-400" /> Signal
              </span>
              <span className="font-bold text-amber-300 mt-0.5">
                Level #{weather.stormSignal}
              </span>
            </div>
          </div>
        ) : (
          /* Tab content 2: Hourly timeline */
          <div className="flex items-center justify-between gap-1 mt-4 pt-3 border-t border-slate-700/60 relative z-10 text-xs overflow-x-auto no-scrollbar">
            {weather.forecast.map((f: { time: string; temp: number; icon: string }, idx: number) => (
              <div
                key={idx}
                className="flex flex-col items-center min-w-[48px] py-1.5 px-1 rounded-xl bg-white/5 text-center"
              >
                <span className="text-[10px] text-blue-200">{f.time}</span>
                <span className="my-1 text-sm">
                  {f.icon === 'thunder' ? '⛈️' : f.icon === 'heavy-rain' ? '🌧️' : '🌦️'}
                </span>
                <span className="text-[11px] font-bold text-white tabular-nums">{f.temp}°</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer advisory strip */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-blue-200/90 bg-white/5 px-2.5 py-1.5 rounded-xl">
          <span className="truncate pr-2">Next high tide: 18:30 • Levee crest watch active</span>
          {onOpenRadarModal && (
            <button
              onClick={onOpenRadarModal}
              className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-0.5 shrink-0 cursor-pointer"
            >
              Radar <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
