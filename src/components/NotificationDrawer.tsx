import React from 'react';
import { X, Bell, AlertTriangle, Info, Check, ShieldAlert } from 'lucide-react';
import { EmergencyNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: EmergencyNotification[];
  onMarkAllAsRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-12 sm:pt-20">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-amber-400 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 fill-slate-950" />
            <h3 className="text-base font-bold">Emergency Alert Broadcasts</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-300/80 hover:bg-amber-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span className="font-semibold">{notifications.length} Broadcasts</span>
          <button
            onClick={onMarkAllAsRead}
            className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        </div>

        {/* Notifications list */}
        <div className="max-h-[60vh] overflow-y-auto no-scrollbar p-3 space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-2xl border transition-all ${
                notif.read ? 'bg-white border-slate-100' : 'bg-amber-50/40 border-amber-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    notif.level === 'critical' || notif.type === 'alert'
                      ? 'bg-red-100 text-red-600'
                      : notif.level === 'warning' || notif.level === 'high_risk' || notif.type === 'advisory'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {notif.level === 'critical' || notif.type === 'alert' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : notif.level === 'warning' || notif.level === 'high_risk' || notif.type === 'advisory' ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
