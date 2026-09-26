import React, { useState } from 'react';
import { User, ShieldCheck, Heart, Phone, CheckSquare, Square, Battery, Wifi, Download, AlertOctagon, Share2 } from 'lucide-react';
import { initialGoBagItems } from '../data/mockData';
import { GoBagItem } from '../types';

export const ProfileView: React.FC = () => {
  const [isSafe, setIsSafe] = useState<boolean>(true);
  const [goBag, setGoBag] = useState<GoBagItem[]>(initialGoBagItems);
  const [broadcasted, setBroadcasted] = useState<boolean>(false);

  const toggleCheck = (id: string) => {
    setGoBag((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const checkedCount = goBag.filter((i) => i.checked).length;
  const progressPercent = Math.round((checkedCount / goBag.length) * 100);

  const handleBroadcastSafety = () => {
    setIsSafe(true);
    setBroadcasted(true);
    setTimeout(() => setBroadcasted(false), 3000);
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-xl border-2 border-amber-300 shadow-sm">
            JD
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Juan Dela Cruz</h3>
            <p className="text-xs text-slate-500">Citizen Responder • District 4</p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-700">Blood: O+</span>
              <span>•</span>
              <span className="text-emerald-600 font-bold">Vaccinated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Status Broadcast Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Family & Responders Sync
            </span>
            <h4 className="text-base font-bold mt-1">
              {isSafe ? 'Status: Marked as SAFE' : 'Status: Needs Assistance'}
            </h4>
            <p className="text-xs text-emerald-100 mt-0.5 max-w-[240px]">
              Last synced 4 minutes ago via SMS Emergency Relay.
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2">
          <button
            onClick={handleBroadcastSafety}
            className="flex-1 bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 text-xs font-bold py-2 rounded-xl transition-all cursor-pointer text-center"
          >
            {broadcasted ? '✓ Broadcast Sent!' : 'Broadcast "I am Safe"'}
          </button>
          <button
            onClick={() => setIsSafe(!isSafe)}
            className="bg-black/20 hover:bg-black/30 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer"
          >
            Toggle
          </button>
        </div>
      </div>

      {/* Emergency Contacts (ICE) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Emergency Contacts (I.C.E)
            </h4>
          </div>
          <button
            onClick={() => alert('Add ICE contact feature opened')}
            className="text-xs font-bold text-amber-600 hover:text-amber-700"
          >
            + Add
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <div>
              <div className="text-xs font-bold text-slate-800">Maria Dela Cruz (Spouse)</div>
              <div className="text-[11px] text-slate-500">+63 917 555 0192</div>
            </div>
            <a
              href="tel:+639175550192"
              className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center hover:bg-emerald-200 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <div>
              <div className="text-xs font-bold text-slate-800">Barangay Captain Office</div>
              <div className="text-[11px] text-slate-500">(02) 8911-3420</div>
            </div>
            <a
              href="tel:0289113420"
              className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center hover:bg-emerald-200 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Emergency Go-Bag Checklist */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              72-Hour Survival Go-Bag
            </h4>
            <p className="text-[11px] text-slate-500">Essential items for rapid evacuation</p>
          </div>
          <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg tabular-nums">
            {checkedCount}/{goBag.length} ({progressPercent}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Items List */}
        <div className="space-y-1.5 max-h-56 overflow-y-auto no-scrollbar">
          {goBag.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {item.checked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-300 shrink-0" />
                )}
                <span
                  className={`text-xs ${
                    item.checked ? 'text-slate-400 line-through' : 'text-slate-800 font-medium'
                  }`}
                >
                  {item.name}
                </span>
              </div>
              {item.essential && (
                <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded shrink-0">
                  Critical
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Offline Guides Download */}
      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-amber-600" />
          <div>
            <span className="font-bold text-slate-800 block">Offline Survival Manual</span>
            <span className="text-[10px] text-slate-500">Cached on device (14.2 MB)</span>
          </div>
        </div>
        <button
          onClick={() => alert('Offline manuals verified and updated!')}
          className="bg-slate-900 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg hover:bg-slate-800"
        >
          Check Cache
        </button>
      </div>
    </div>
  );
};
