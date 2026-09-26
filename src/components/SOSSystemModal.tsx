import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Radio,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  ArrowRight,
  Send,
  Building2,
  UserCheck,
  AlertOctagon,
  RefreshCw,
  Compass,
} from 'lucide-react';
import { EmergencyIncident } from '../types';
import { USER_CURRENT_LOCATION } from '../data/ecoShieldData';
import { emergencyAudio } from '../utils/audio';

interface SOSSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeIncident: EmergencyIncident | null;
  onInitiateSOS: () => void;
  onAcknowledgeByRescueTeam: () => void;
  onTriggerEscalation: () => void;
  onResolveIncident: () => void;
  onOpenSafeRouteMap?: () => void;
}

export const SOSSystemModal: React.FC<SOSSystemModalProps> = ({
  isOpen,
  onClose,
  activeIncident,
  onInitiateSOS,
  onAcknowledgeByRescueTeam,
  onTriggerEscalation,
  onResolveIncident,
  onOpenSafeRouteMap,
}) => {
  const [confirmStage, setConfirmStage] = useState<'PROMPT' | 'ACTIVE'>('PROMPT');
  const [sirenPlaying, setSirenPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (activeIncident) {
      setConfirmStage('ACTIVE');
    } else {
      setConfirmStage('PROMPT');
    }
  }, [activeIncident]);

  useEffect(() => {
    return () => {
      emergencyAudio.stopSiren();
    };
  }, []);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onInitiateSOS();
    setConfirmStage('ACTIVE');
    emergencyAudio.playChime(880);
  };

  const handleToggleSiren = () => {
    emergencyAudio.toggleEmergencySiren((active) => {
      setSirenPlaying(active);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-red-500/40 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="p-4 bg-gradient-to-r from-red-600 to-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">EMERGENCY SOS SYSTEM</h3>
              <p className="text-[10px] text-red-100 font-mono">ECO-SHIELD RAPID DISASTER ESCALATION</p>
            </div>
          </div>

          <button
            onClick={() => {
              emergencyAudio.stopSiren();
              setSirenPlaying(false);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
          
          {/* STEP 1: INITIAL SOS CONFIRMATION PROMPT */}
          {!activeIncident && confirmStage === 'PROMPT' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-20 h-20 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center mx-auto text-red-500 animate-pulse">
                <AlertOctagon className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-white">Emergency SOS</h4>
                <p className="text-sm font-semibold text-red-400 mt-1">
                  Are you currently in danger?
                </p>
                <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                  Confirming SOS will capture your high-precision coordinates, dispatch the nearest rescue team, alert the district control center, and start the automated response escalation timer.
                </p>
              </div>

              {/* Location to be captured */}
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-left text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Location to be Transmitted
                </span>
                <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                  <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{USER_CURRENT_LOCATION.address}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  GPS: {USER_CURRENT_LOCATION.lat}, {USER_CURRENT_LOCATION.lng}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-2xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-red-600/40 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                >
                  <Radio className="w-4 h-4 animate-ping" />
                  <span>Confirm SOS</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ACTIVE SOS INCIDENT & ESCALATION WORKFLOW */}
          {activeIncident && (
            <div className="space-y-4">
              {/* Incident Header Status Badge */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-red-950/70 via-slate-800 to-slate-900 border border-red-500/60 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping" />
                      <span className="text-base font-black text-red-400 tracking-wider">
                        SOS ACTIVE 🔴
                      </span>
                      <span className="text-[10px] font-mono bg-red-900/60 text-red-200 px-2 py-0.5 rounded-full border border-red-700">
                        {activeIncident.id}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-amber-300 mt-1 italic">
                      “Rescue team notified — awaiting response.”
                    </p>

                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Disaster Rapid Response Team Alpha notified (ETA 6m)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>Live location shared: {activeIncident.location.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <Radio className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>State Control Center & Police Command alerted</span>
                      </div>
                    </div>
                  </div>

                  {/* Audio Whistle / Siren Trigger */}
                  <button
                    onClick={handleToggleSiren}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      sirenPlaying
                        ? 'bg-red-600 text-white border-red-400 animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    {sirenPlaying ? <Volume2 className="w-5 h-5 text-amber-300" /> : <VolumeX className="w-5 h-5" />}
                    <span className="text-[9px] font-bold">{sirenPlaying ? 'Siren ON' : 'SOS Siren'}</span>
                  </button>
                </div>

                {/* Safe Route Quick Navigation Button */}
                {onOpenSafeRouteMap && (
                  <div className="mt-3 pt-3 border-t border-slate-700/80">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSafeRouteMap();
                      }}
                      className="w-full bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
                    >
                      <Compass className="w-4 h-4 text-emerald-200" />
                      <span>🗺️ Launch Safe-Route Evacuation Navigation</span>
                    </button>
                  </div>
                )}

                {/* Response Status Tracker & Escalation Indicator */}
                <div className="mt-3 pt-3 border-t border-slate-700/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Response Status:
                    </span>
                    <span
                      className={`font-black uppercase px-2.5 py-1 rounded-md text-[11px] ${
                        activeIncident.status === 'PENDING_ACKNOWLEDGMENT'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                          : activeIncident.status === 'ESCALATED'
                          ? 'bg-red-500/30 text-red-300 border border-red-500 font-black'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {activeIncident.status === 'PENDING_ACKNOWLEDGMENT' && 'Waiting for Response...'}
                      {activeIncident.status === 'ESCALATED' && '⚠️ SOS ESCALATED'}
                      {activeIncident.status === 'ACKNOWLEDGED' && '✓ Team En Route'}
                      {activeIncident.status === 'RESOLVED' && 'Incident Resolved'}
                    </span>
                  </div>

                  {/* Countdown Timer for Escalation */}
                  {activeIncident.status === 'PENDING_ACKNOWLEDGMENT' && (
                    <div className="mt-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-700 text-xs flex items-center justify-between">
                      <div className="text-slate-300">
                        <span className="font-medium">Waiting for Response...</span>
                        <div className="text-[10px] text-slate-400">Auto-escalates to Control Center Head in:</div>
                      </div>
                      <span className="text-lg font-black text-amber-400 font-mono tabular-nums">
                        {activeIncident.countdownSeconds}s
                      </span>
                    </div>
                  )}

                  {/* Escalated Notification Banner */}
                  {activeIncident.status === 'ESCALATED' && activeIncident.escalatedTo && (
                    <div className="mt-3 bg-red-950/90 border-2 border-red-500 p-3.5 rounded-xl text-xs space-y-2 animate-in slide-in-from-top-2 shadow-lg">
                      <div className="flex items-center gap-2 font-black text-red-300 text-sm">
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
                        <span>⚠️ SOS ESCALATED</span>
                      </div>
                      <p className="text-xs text-red-200 font-semibold leading-relaxed">
                        “Your emergency request has been escalated because the assigned team has not responded.”
                      </p>
                      <div className="bg-black/40 p-2.5 rounded-lg border border-red-500/40 text-[11px] text-slate-300 space-y-1">
                        <div>
                          Direct Escalation: <strong className="text-white">{activeIncident.escalatedTo.entity}</strong>
                        </div>
                        <div>
                          Commanding Authority: <span className="text-amber-300 font-bold">{activeIncident.escalatedTo.supervisorName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Status: High-priority dispatch override active • All emergency channels locked
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Hierarchy Chain Visualization */}
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Emergency Escalation Chain: User → Rescue Team → Control Center / Head Authority
                </span>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  {/* Stage 1: User */}
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mb-1" />
                    <span className="font-bold text-slate-200">You (Citizen)</span>
                    <span className="text-[9px] text-slate-400">SOS Transmitted</span>
                  </div>

                  {/* Stage 2: Rescue Team */}
                  <div
                    className={`p-2 rounded-xl border flex flex-col items-center ${
                      activeIncident.status === 'ESCALATED'
                        ? 'bg-amber-950/40 border-amber-600/60'
                        : activeIncident.status === 'ACKNOWLEDGED'
                        ? 'bg-emerald-950/40 border-emerald-600/60'
                        : 'bg-slate-900 border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mb-1 ${
                        activeIncident.status === 'ESCALATED'
                          ? 'bg-amber-500'
                          : activeIncident.status === 'ACKNOWLEDGED'
                          ? 'bg-emerald-500'
                          : 'bg-amber-400 animate-ping'
                      }`}
                    />
                    <span className="font-bold text-slate-200">Rescue Team</span>
                    <span className="text-[9px] text-slate-400">
                      {activeIncident.status === 'ACKNOWLEDGED' ? 'En Route (ETA 6m)' : activeIncident.status === 'ESCALATED' ? 'Timeout Passed' : 'Awaiting Acknowledgment'}
                    </span>
                  </div>

                  {/* Stage 3: Head Authority */}
                  <div
                    className={`p-2 rounded-xl border flex flex-col items-center ${
                      activeIncident.status === 'ESCALATED'
                        ? 'bg-red-950/60 border-red-500 text-red-200'
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mb-1 ${
                        activeIncident.status === 'ESCALATED' ? 'bg-red-500 animate-pulse' : 'bg-slate-600'
                      }`}
                    />
                    <span className="font-bold">Control Center</span>
                    <span className="text-[9px]">
                      {activeIncident.status === 'ESCALATED' ? 'Active Command' : 'Standby'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Incident Status History & Timestamps */}
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Status History & Audit Log
                </span>
                <div className="space-y-2">
                  {activeIncident.history.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="text-[10px] font-mono text-slate-400 shrink-0 mt-0.5">{item.time}</span>
                      <div className="flex-1">
                        <span className="font-bold text-slate-200">{item.stage}: </span>
                        <span className="text-slate-300">{item.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulation Controls for testing both branches */}
              <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700 text-xs space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Simulate Rescue Operations Workflow:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {activeIncident.status === 'PENDING_ACKNOWLEDGMENT' && (
                    <>
                      <button
                        onClick={onAcknowledgeByRescueTeam}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        ✓ Simulate Team Acknowledgment
                      </button>
                      <button
                        onClick={onTriggerEscalation}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        ⚠️ Force Escalation Now
                      </button>
                    </>
                  )}

                  {activeIncident.status !== 'PENDING_ACKNOWLEDGMENT' && (
                    <button
                      onClick={onResolveIncident}
                      className="col-span-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Incident Resolved (Cancel SOS)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Direct Hotline Quick Dial Bar */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="tel:112"
                  className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between text-white"
                >
                  <span className="font-bold">National SOS (112)</span>
                  <Phone className="w-3.5 h-3.5 text-red-400" />
                </a>
                <a
                  href="tel:108"
                  className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between text-white"
                >
                  <span className="font-bold">Medical Ambulance (108)</span>
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
