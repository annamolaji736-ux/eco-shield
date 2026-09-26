import React from 'react';
import { Bell, ShieldAlert, MapPin, Radio } from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenSOS: () => void;
  unreadCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenSOS,
  unreadCount,
}) => {
  return (
    <header className="bg-amber-400 text-slate-900 px-4 pt-3 pb-4 rounded-b-3xl shadow-sm transition-colors">
      <div className="flex items-center justify-between">
        {/* User greeting and avatar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-base shadow-sm border-2 border-amber-300">
              JD
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-amber-400 rounded-full" title="Online & Connected" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-extrabold text-slate-950 tracking-tight">
                Good day, User!
              </h1>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-800/85 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span className="truncate max-w-[170px]">District 4 • Coastal Sector</span>
              <span className="inline-flex items-center gap-1 bg-amber-500/40 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-bold">
                <Radio className="w-2.5 h-2.5 animate-pulse text-red-700" />
                Signal #2
              </span>
            </div>
          </div>
        </div>

        {/* Top actions: Emergency SOS & Notification Bell */}
        <div className="flex items-center gap-2">
          {/* SOS button */}
          <button
            onClick={onOpenSOS}
            aria-label="Emergency SOS"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-full shadow-sm transition-transform cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SOS</span>
          </button>

          {/* Bell Icon */}
          <button
            onClick={onOpenNotifications}
            aria-label="View notifications"
            className="relative w-10 h-10 rounded-full bg-amber-300/80 hover:bg-amber-300 text-slate-900 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 border-2 border-amber-400 rounded-full animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 border-2 border-amber-400 rounded-full" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
