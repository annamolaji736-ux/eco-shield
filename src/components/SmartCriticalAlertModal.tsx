import React, { useEffect } from 'react';
import {
  AlertTriangle,
  Radio,
  MapPin,
  Waves,
  ShieldCheck,
  Compass,
  Volume2,
  X,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { emergencyAudio } from '../utils/audio';
import { USER_CURRENT_LOCATION } from '../data/ecoShieldData';

interface SmartCriticalAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNeedHelp: () => void;
  onMarkSafe: () => void;
  onViewMap: () => void;
  disasterType?: string;
  locationName?: string;
  distanceKm?: number;
}

export const SmartCriticalAlertModal: React.FC<SmartCriticalAlertModalProps> = ({
  isOpen,
  onClose,
  onNeedHelp,
  onMarkSafe,
  onViewMap,
  disasterType = 'Flood',
  locationName = 'MG Road / Periyar Basin',
  distanceKm = 1.2,
}) => {
  // Trigger sound, vibration, and push notification when opened
  useEffect(() => {
    if (isOpen) {
      emergencyAudio.playCriticalAlertTone();
      emergencyAudio.triggerVibration([400, 150, 400, 150, 600]);
      emergencyAudio.dispatchBrowserPushNotification(
        '🔴 CRITICAL ALERT: Flood Emergency Detected Near You',
        {
          body: 'Flood emergency detected near your location. Are you in danger? Tap to respond.',
          tag: 'critical-alert-flood',
          requireInteraction: true,
        }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-red-500 flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Top Emergency Strobe Banner */}
        <div className="bg-red-600 px-4 py-3 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
            </span>
            <div className="flex items-center gap-1.5 font-black text-sm tracking-wider uppercase">
              <span>🔴 CRITICAL ALERT</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-red-800/80 px-2 py-0.5 rounded-full text-red-100 font-bold border border-red-400/40">
              HIGH PRIORITY
            </span>
            <button
              onClick={onClose}
              className="text-red-200 hover:text-white p-1 rounded-lg hover:bg-red-700/50 transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Core Body */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Main Visual Warning Icon */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center border-4 border-red-500 animate-pulse">
                <Waves className="w-10 h-10 text-red-600" />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-red-600 text-white p-1 rounded-full border-2 border-white shadow">
                <AlertTriangle className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Prompt Headline & Question */}
          <div className="text-center space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              “Flood emergency detected near your location. Are you in danger?”
            </h3>
            <p className="text-xs text-slate-600 font-medium max-w-xs mx-auto leading-relaxed">
              Rapid water level surge (+18 cm/hr) logged within <strong className="text-red-600">{distanceKm} km</strong> of your coordinates near {locationName}. Immediate action required.
            </p>
          </div>

          {/* Telemetry Snapshot Pill */}
          <div className="bg-red-50/80 border border-red-200/90 rounded-2xl p-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-semibold text-slate-500 text-[11px] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" /> Your Proximity:
              </span>
              <span className="font-bold text-red-600 font-mono">{distanceKm} km (Zone A - High Risk)</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-semibold text-slate-500 text-[11px] flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-amber-500" /> Hazard Status:
              </span>
              <span className="font-bold text-red-700 uppercase">Flash Inundation Warning</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-semibold text-slate-500 text-[11px] flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-blue-500" /> Rescue Unit:
              </span>
              <span className="font-bold text-slate-800">DRRT Alpha (Standby)</span>
            </div>
          </div>

          {/* PRIMARY ACTION BUTTONS (As explicitly requested by user) */}
          <div className="space-y-2.5 pt-1">
            
            {/* 1. [ 🆘 I NEED HELP ] */}
            <button
              onClick={() => {
                emergencyAudio.stopSiren();
                onNeedHelp();
              }}
              className="w-full bg-gradient-to-r from-red-600 via-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black py-4 px-4 rounded-2xl text-base shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-98 border border-red-500"
            >
              <span className="text-xl">🆘</span>
              <span>I NEED HELP</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </button>

            {/* 2. [ 🟢 I'M SAFE ] */}
            <button
              onClick={() => {
                emergencyAudio.stopSiren();
                onMarkSafe();
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-2xl text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all border border-emerald-500 active:scale-98"
            >
              <span className="text-lg">🟢</span>
              <span>I'M SAFE</span>
            </button>

            {/* 3. [ 🗺️ VIEW MAP ] */}
            <button
              onClick={() => {
                onViewMap();
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-200"
            >
              <span className="text-base">🗺️</span>
              <span>VIEW MAP & SAFE ROUTES</span>
            </button>
          </div>

          {/* Bottom Audio Helper / Strobe note */}
          <div className="text-center pt-1">
            <span className="text-[10px] text-slate-400 font-medium">
              Vibration and emergency beacon alert active • Eco-Shield Protocol v3.8
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
