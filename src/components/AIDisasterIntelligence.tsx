import React, { useState } from 'react';
import { Sparkles, Brain, Cpu, ShieldAlert, ArrowUpRight, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { AIRiskPrediction } from '../types';

interface AIDisasterIntelligenceProps {
  prediction: AIRiskPrediction;
  onOpenMapHazard?: () => void;
}

export const AIDisasterIntelligence: React.FC<AIDisasterIntelligenceProps> = ({
  prediction,
  onOpenMapHazard,
}) => {
  const [selectedFactor, setSelectedFactor] = useState<number | null>(null);

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-indigo-800/40 shadow-xl relative overflow-hidden">
      {/* Decorative ambient aura */}
      <div className="absolute top-0 right-0 w-52 h-52 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-400/30">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight flex items-center gap-1.5 text-white">
              <span>AI Disaster Intelligence</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-[11px] text-indigo-200">
              Predictive flood, landslide & fire modeling based on ground IoT telemetry
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono bg-indigo-900/60 text-indigo-200 px-2.5 py-1 rounded-full border border-indigo-700 hidden sm:inline-block">
          Model: Eco-Hydrology v4.2
        </span>
      </div>

      {/* 3 Main AI Risk Prediction Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
        {/* 1. Flood Risk: 78% (HIGH) */}
        <div className="bg-white/5 rounded-2xl p-4 border border-blue-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-200">🌊 Flood Risk</span>
            <span className="text-[10px] font-black uppercase bg-red-600/90 text-white px-2 py-0.5 rounded">
              HIGH
            </span>
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white tabular-nums">
              {prediction.floodRisk}%
            </span>
            <span className="text-xs text-red-300 font-semibold">Critical surge curve</span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-red-500 rounded-full transition-all duration-700"
              style={{ width: `${prediction.floodRisk}%` }}
            />
          </div>
        </div>

        {/* 2. Landslide Risk: 24% (MODERATE) */}
        <div className="bg-white/5 rounded-2xl p-4 border border-amber-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-200">⛰️ Landslide Risk</span>
            <span className="text-[10px] font-black uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
              MODERATE
            </span>
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white tabular-nums">
              {prediction.landslideRisk}%
            </span>
            <span className="text-xs text-amber-300 font-semibold">Slope saturation rising</span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${prediction.landslideRisk}%` }}
            />
          </div>
        </div>

        {/* 3. Wildfire Risk: 8% (LOW) */}
        <div className="bg-white/5 rounded-2xl p-4 border border-emerald-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-200">🔥 Wildfire Risk</span>
            <span className="text-[10px] font-black uppercase bg-emerald-600 text-white px-2 py-0.5 rounded">
              LOW
            </span>
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white tabular-nums">
              {prediction.wildfireRisk}%
            </span>
            <span className="text-xs text-emerald-300 font-semibold">High precipitation buffer</span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${prediction.wildfireRisk}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Contributing Factors & Explanations */}
      <div className="mt-4 pt-4 border-t border-indigo-900/60 relative z-10">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
          Key Contributing Factors Detected by AI:
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {prediction.mainContributingFactors.map((factor, idx) => (
            <div
              key={idx}
              className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/10 text-xs text-slate-200 flex items-start gap-2 transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{factor}</span>
            </div>
          ))}
        </div>

        {/* Bottom timestamp */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-indigo-300/80">
          <span>{prediction.lastUpdate}</span>
          {onOpenMapHazard && (
            <button
              onClick={onOpenMapHazard}
              className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Explore AI Hazard Inundation Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
