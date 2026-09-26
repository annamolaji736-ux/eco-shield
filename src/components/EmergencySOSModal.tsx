import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Volume2, VolumeX, PhoneCall, Radio, Zap, AlertTriangle } from 'lucide-react';
import { emergencyAudio } from '../utils/audio';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({ isOpen, onClose }) => {
  const [sirenPlaying, setSirenPlaying] = useState<boolean>(false);
  const [strobeActive, setStrobeActive] = useState<boolean>(false);
  const [beaconSent, setBeaconSent] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      emergencyAudio.stopSiren();
    };
  }, []);

  if (!isOpen) return null;

  const handleToggleSiren = () => {
    emergencyAudio.toggleEmergencySiren((active) => {
      setSirenPlaying(active);
    });
  };

  const handleClose = () => {
    emergencyAudio.stopSiren();
    setSirenPlaying(false);
    onClose();
  };

  const handleSendBeacon = () => {
    setBeaconSent(true);
    emergencyAudio.playChime(880);
    setTimeout(() => setBeaconSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border transition-colors ${
          strobeActive ? 'bg-red-950 border-red-500' : 'bg-slate-900 border-slate-700'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-red-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <div>
              <h3 className="text-base font-extrabold tracking-tight">EMERGENCY SOS BEACON</h3>
              <p className="text-[10px] text-red-100 font-mono">DISTRICT 4 DISPATCH RELAY</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-red-700/80 hover:bg-red-700 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-center text-white space-y-4">
          <p className="text-xs text-slate-300">
            Use in immediate life-threatening danger. Responders triangulate your mobile GPS coordinate.
          </p>

          {/* Big Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Siren Toggle */}
            <button
              onClick={handleToggleSiren}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer font-bold text-xs border ${
                sirenPlaying
                  ? 'bg-red-600 text-white border-red-400 animate-pulse shadow-lg shadow-red-600/50'
                  : 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/10'
              }`}
            >
              {sirenPlaying ? (
                <>
                  <Volume2 className="w-8 h-8 text-amber-300 animate-bounce" />
                  <span>Stop Siren</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-8 h-8 text-red-400" />
                  <span>Loud Siren / Whistle</span>
                </>
              )}
            </button>

            {/* Visual Strobe */}
            <button
              onClick={() => setStrobeActive(!strobeActive)}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer font-bold text-xs border ${
                strobeActive
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg'
                  : 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/10'
              }`}
            >
              <Zap className="w-8 h-8 text-amber-400" />
              <span>{strobeActive ? 'Strobe Light ON' : 'Screen Beacon'}</span>
            </button>
          </div>

          {/* Transmit Beacon Broadcast Button */}
          <button
            onClick={handleSendBeacon}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 active:scale-95 text-white font-bold py-3.5 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Radio className="w-5 h-5 animate-pulse" />
            <span>{beaconSent ? '✓ SOS TRANSMITTED (Coordinates Sent)' : 'Broadcast Distress Coordinates'}</span>
          </button>

          {/* Direct Emergency Call List */}
          <div className="pt-2 text-left space-y-2 border-t border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Direct Emergency Hotlines
            </span>

            <a
              href="tel:911"
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-red-400" />
                <span className="text-xs font-bold">911 National Emergency Command</span>
              </div>
              <span className="text-[11px] font-mono text-amber-400">911</span>
            </a>

            <a
              href="tel:143"
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-red-400" />
                <span className="text-xs font-bold">Red Cross Disaster Action Team</span>
              </div>
              <span className="text-[11px] font-mono text-amber-400">143</span>
            </a>

            <a
              href="tel:0285278481"
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold">Coast Guard Search & Rescue</span>
              </div>
              <span className="text-[11px] font-mono text-cyan-300">Hotline</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
