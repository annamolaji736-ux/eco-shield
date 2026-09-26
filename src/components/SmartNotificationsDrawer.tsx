import React, { useState } from 'react';
import { X, Bell, AlertTriangle, AlertOctagon, Info, Check, ShieldAlert, Navigation, ArrowRight } from 'lucide-react';
import { EmergencyNotification } from '../types';

interface SmartNotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: EmergencyNotification[];
  onMarkAllAsRead: () => void;
  onViewMapAction: () => void;
  onSafetyInstructionsAction: () => void;
}

export const SmartNotificationsDrawer: React.FC<SmartNotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onViewMapAction,
  onSafetyInstructionsAction,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING'>('ALL');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (filter === 'CRITICAL') return n.level === 'critical';
    if (filter === 'WARNING') return n.level === 'warning' || n.level === 'high_risk';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 pt-12 sm:pt-20 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-amber-400 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 fill-slate-950" />
            <div>
              <h3 className="text-base font-extrabold tracking-tight">Smart Disaster Broadcasts</h3>
              <p className="text-[11px] text-slate-800 font-semibold">Tiered emergency warnings & civil defense dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-300/80 hover:bg-amber-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 font-semibold">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${filter === 'ALL' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('CRITICAL')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${filter === 'CRITICAL' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              🔴 Critical
            </button>
            <button
              onClick={() => setFilter('WARNING')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${filter === 'WARNING' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              🟡 Warning
            </button>
          </div>

          <button
            onClick={onMarkAllAsRead}
            className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark read</span>
          </button>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto no-scrollbar space-y-3 flex-1">
          {filtered.map((item) => {
            const isCrit = item.level === 'critical';
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCrit
                    ? 'bg-red-50/60 border-red-200 shadow-sm'
                    : item.level === 'warning' || item.level === 'high_risk'
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isCrit
                        ? 'bg-red-600 text-white'
                        : item.level === 'warning' || item.level === 'high_risk'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {isCrit ? (
                      <AlertOctagon className="w-5 h-5 animate-pulse" />
                    ) : item.level === 'warning' || item.level === 'high_risk' ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          isCrit
                            ? 'bg-red-600 text-white'
                            : item.level === 'high_risk'
                            ? 'bg-orange-500 text-white'
                            : item.level === 'warning'
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {(item.level ?? item.type ?? 'info').replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {item.message}
                    </p>

                    {/* Action buttons matching prompt example: [View Map] [Safety Instructions] */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          onViewMapAction();
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>View Map</span>
                      </button>

                      <span className="text-slate-300">•</span>

                      <button
                        onClick={() => {
                          onClose();
                          onSafetyInstructionsAction();
                        }}
                        className="text-[11px] font-bold text-amber-700 hover:text-amber-900 cursor-pointer"
                      >
                        Safety Instructions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
