import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Send,
  Camera,
  MapPin,
  Waves,
  Mountain,
  Flame,
  Wind,
  ShieldAlert,
  TreeDeciduous,
  HeartPulse,
  HelpCircle,
  CheckCircle2,
  Paperclip,
  Video,
} from 'lucide-react';
import { HazardType, HazardReport } from '../types';
import { USER_CURRENT_LOCATION } from '../data/ecoShieldData';

interface ReportNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: Omit<HazardReport, 'id' | 'reportsCount' | 'verified' | 'coordinates'>) => void;
  defaultType?: HazardType;
}

export const ReportNowModal: React.FC<ReportNowModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
  defaultType = 'Flood',
}) => {
  const [hazardType, setHazardType] = useState<HazardType>(defaultType);
  const [severity, setSeverity] = useState<'low' | 'moderate' | 'high' | 'critical'>('high');
  const [waterDepth, setWaterDepth] = useState<number>(60);
  const [locationName, setLocationName] = useState<string>(USER_CURRENT_LOCATION.address);
  const [description, setDescription] = useState<string>('');
  const [attachmentType, setAttachmentType] = useState<'NONE' | 'PHOTO' | 'VIDEO'>('PHOTO');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const hazardOptions: { type: HazardType; label: string; icon: React.ReactNode }[] = [
    { type: 'Flood', label: 'Flood', icon: <Waves className="w-5 h-5 text-blue-600" /> },
    { type: 'Landslide', label: 'Landslide', icon: <Mountain className="w-5 h-5 text-amber-700" /> },
    { type: 'Wildfire', label: 'Wildfire', icon: <Flame className="w-5 h-5 text-red-600" /> },
    { type: 'Storm Surge', label: 'Storm Surge', icon: <Wind className="w-5 h-5 text-cyan-600" /> },
    { type: 'Road Blockage', label: 'Road Block', icon: <ShieldAlert className="w-5 h-5 text-slate-700" /> },
    { type: 'Fallen Trees', label: 'Fallen Trees', icon: <TreeDeciduous className="w-5 h-5 text-emerald-700" /> },
    { type: 'Medical Emergency', label: 'Medical Aid', icon: <HeartPulse className="w-5 h-5 text-rose-600" /> },
    { type: 'Other', label: 'Other Hazard', icon: <HelpCircle className="w-5 h-5 text-purple-600" /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmitReport({
        type: hazardType,
        title: `${hazardType} reported at ${locationName}`,
        locationName,
        distanceKm: 0.5,
        timestamp: 'Just now',
        severity,
        waterDepthCm: hazardType === 'Flood' ? waterDepth : undefined,
        description:
          description ||
          `Active ${hazardType} emergency incident submitted by citizen on-site. Telemetry and coordinates synced with control room.`,
        reportedBy: 'Citizen (You)',
        hasAttachment: attachmentType !== 'NONE',
      });
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1300);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl border border-slate-100 flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">Report Emergency Hazard</h3>
              <p className="text-[11px] text-orange-100 font-medium">Transmits directly to Eco-Shield Command Desk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Incident Reported & Pinned!</h4>
            <p className="text-xs text-slate-600 mt-1 max-w-xs leading-relaxed">
              Your disaster report has been logged, geotagged on the live map, and relayed to nearby emergency responders and civil defense wardens.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* 1. Hazard Categories */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-2">
                1. Select Disaster / Emergency Type
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                {hazardOptions.map((opt) => (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setHazardType(opt.type)}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      hazardType === opt.type
                        ? 'border-orange-500 bg-orange-50/70 text-slate-950 font-bold shadow-sm ring-2 ring-orange-500/30'
                        : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center">
                      {opt.icon}
                    </div>
                    <span className="text-[11px] leading-tight text-center truncate w-full">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Water Depth Slider (if flood) */}
            {hazardType === 'Flood' && (
              <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-blue-950">Estimated Water Depth</span>
                  <span className="font-extrabold text-blue-700 font-mono">
                    {waterDepth} cm ({waterDepth < 30 ? 'Ankle' : waterDepth < 60 ? 'Knee' : waterDepth < 100 ? 'Waist-deep' : 'Chest/Roof'})
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="160"
                  step="5"
                  value={waterDepth}
                  onChange={(e) => setWaterDepth(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            )}

            {/* 3. Severity Level */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                2. Threat Severity
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {(['low', 'moderate', 'high', 'critical'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeverity(lvl)}
                    className={`py-2 px-2 rounded-xl font-extrabold uppercase text-[10px] transition-all cursor-pointer border ${
                      severity === lvl
                        ? lvl === 'critical'
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : lvl === 'high'
                          ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                          : lvl === 'moderate'
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-black'
                          : 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Current Location */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                3. Incident Location (GPS Geotagged)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-orange-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Street, Landmark, Ward or Town"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-slate-800 font-medium"
                  required
                />
              </div>
            </div>

            {/* 5. Description */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                4. Description & Immediate Needs
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Trapped family with elderly patient on terrace, live electrical wire snapped, bridge washed out..."
                rows={2}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-slate-800"
              />
            </div>

            {/* 6. Attach Photo/Video Proof */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                5. Attach Evidence (Photo / Video)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAttachmentType(attachmentType === 'PHOTO' ? 'NONE' : 'PHOTO')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    attachmentType === 'PHOTO'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>{attachmentType === 'PHOTO' ? '✓ Photo Attached' : 'Attach Photo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttachmentType(attachmentType === 'VIDEO' ? 'NONE' : 'VIDEO')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    attachmentType === 'VIDEO'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>{attachmentType === 'VIDEO' ? '✓ Video Attached' : 'Attach Video'}</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-98 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting to Command...' : 'Submit Emergency Incident Report'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
