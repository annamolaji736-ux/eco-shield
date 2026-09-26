import React, { useState } from 'react';
import { X, Droplets, Waves, Mountain, Camera, MapPin, Send, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { HazardType, HazardReport } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: Omit<HazardReport, 'id' | 'reportsCount' | 'verified' | 'coordinates'>) => void;
  defaultType?: HazardType;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
  defaultType = 'Flood',
}) => {
  const [hazardType, setHazardType] = useState<HazardType>(defaultType);
  const [severity, setSeverity] = useState<'low' | 'moderate' | 'high' | 'critical'>('high');
  const [waterDepth, setWaterDepth] = useState<number>(60);
  const [locationName, setLocationName] = useState<string>('Riverside Ave cor. 4th Street');
  const [description, setDescription] = useState<string>('');
  const [hasPhoto, setHasPhoto] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport({
      type: hazardType,
      title: `${hazardType} reported at ${locationName}`,
      locationName,
      distanceKm: 0.4,
      timestamp: 'Just now',
      severity,
      waterDepthCm: hazardType === 'Flood' ? waterDepth : undefined,
      description: description || `Urgent ${hazardType.toLowerCase()} warning reported by verified resident. Please avoid area.`,
      reportedBy: 'User (You)',
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-6 duration-200">
        
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto my-3" />

        {/* Header */}
        <div className="px-5 pb-3 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Report Hazard Incident</h3>
              <p className="text-[11px] text-slate-500">Transmits directly to local disaster response</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Report Dispatched!</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Your hazard report has been pinned to the local disaster map and broadcasted to emergency responders.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* 1. Hazard Type Picker */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Select Hazard Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setHazardType('Flood')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    hazardType === 'Flood'
                      ? 'border-blue-500 bg-blue-50/50 text-blue-700 font-bold shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Droplets className="w-5 h-5 text-blue-600" />
                  <span className="text-xs">Flood</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHazardType('Storm Surge')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    hazardType === 'Storm Surge' || (hazardType as string) === 'Stormsurge'
                      ? 'border-cyan-500 bg-cyan-50/50 text-cyan-700 font-bold shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Waves className="w-5 h-5 text-cyan-600" />
                  <span className="text-xs">Storm Surge</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHazardType('Landslide')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    hazardType === 'Landslide'
                      ? 'border-amber-500 bg-amber-50/50 text-amber-800 font-bold shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Mountain className="w-5 h-5 text-amber-700" />
                  <span className="text-xs">Landslide</span>
                </button>
              </div>
            </div>

            {/* 2. Water Depth Slider (if flood) */}
            {hazardType === 'Flood' && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Estimated Water Depth</span>
                  <span className="font-bold text-blue-600 tabular-nums">
                    {waterDepth} cm ({waterDepth < 30 ? 'Ankle' : waterDepth < 60 ? 'Knee' : waterDepth < 100 ? 'Waist' : 'Chest/Roof'})
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
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Severity Level
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {(['low', 'moderate', 'high', 'critical'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeverity(lvl)}
                    className={`py-1.5 px-2 rounded-lg font-semibold uppercase text-[10px] transition-all cursor-pointer border ${
                      severity === lvl
                        ? lvl === 'critical'
                          ? 'bg-red-500 text-white border-red-500'
                          : lvl === 'high'
                          ? 'bg-orange-500 text-white border-orange-500'
                          : lvl === 'moderate'
                          ? 'bg-amber-400 text-slate-900 border-amber-400'
                          : 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Location Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Pinpoint Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Street, Landmark, or Barangay"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-800"
                  required
                />
              </div>
            </div>

            {/* 5. Additional Description */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Details & Hazards (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Trapped residents on 2nd floor, live electric cable dangling, road impassable..."
                rows={2}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-800"
              />
            </div>

            {/* 6. Photo Attach Mockup */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Camera className="w-4 h-4 text-slate-500" />
                <span>Geo-tagged Photo Proof</span>
              </div>
              <button
                type="button"
                onClick={() => setHasPhoto(!hasPhoto)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  hasPhoto ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {hasPhoto ? 'Attached ✓' : 'Add Photo'}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-bold py-3 rounded-xl shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Hazard Alert</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
