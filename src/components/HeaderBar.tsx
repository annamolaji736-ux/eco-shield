import React, { useState } from 'react';
import {
  Bell,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Radio,
  User,
  Smartphone,
  Monitor,
  Check,
  ChevronDown,
} from 'lucide-react';
import { USER_CURRENT_LOCATION } from '../data/ecoShieldData';
import { EmergencyNotification } from '../types';

interface HeaderBarProps {
  onOpenNotifications: () => void;
  onOpenSOS: () => void;
  onOpenProfile: () => void;
  unreadCount: number;
  activeSOS: boolean;
  deviceViewMode: 'responsive' | 'iphone_frame';
  onToggleDeviceView: () => void;
  onSimulateCriticalAlert?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onOpenNotifications,
  onOpenSOS,
  onOpenProfile,
  unreadCount,
  activeSOS,
  deviceViewMode,
  onToggleDeviceView,
  onSimulateCriticalAlert,
}) => {
  return (
    <header className="bg-amber-400 text-slate-950 px-4 sm:px-6 py-3.5 shadow-sm sticky top-0 z-20 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Brand & Greeting */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-black text-lg shadow-sm border border-amber-300 shrink-0">
            ES
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight leading-tight">
                Good day, User!
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 bg-amber-500/40 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md">
                <Radio className="w-2.5 h-2.5 text-red-700 animate-pulse" />
                Signal #2 Active
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-800 font-semibold mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-md">{USER_CURRENT_LOCATION.address}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions - Device Switcher, Notification Bell, Profile, SOS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Device Frame Preview Switcher */}
          <button
            onClick={onToggleDeviceView}
            className="hidden md:flex items-center gap-1.5 bg-amber-300/80 hover:bg-amber-300 text-slate-950 text-xs font-bold px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors"
            title="Switch between Full Responsive Layout and iPhone Mockup Preview"
          >
            {deviceViewMode === 'responsive' ? (
              <>
                <Smartphone className="w-4 h-4" />
                <span className="text-[11px]">iPhone Preview</span>
              </>
            ) : (
              <>
                <Monitor className="w-4 h-4" />
                <span className="text-[11px]">Responsive Dashboard</span>
              </>
            )}
          </button>

          {/* Critical Disaster Alert Simulation Trigger */}
          {onSimulateCriticalAlert && (
            <button
              onClick={onSimulateCriticalAlert}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-black bg-red-900/90 hover:bg-black text-amber-300 transition-all cursor-pointer shadow-sm border border-red-700 active:scale-95"
              title="Simulate Critical Flood Disaster Detection Near User"
            >
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              <span className="text-[11px] hidden sm:inline">🔴 Test Critical Alert</span>
              <span className="text-[11px] sm:hidden">🔴 Alert</span>
            </button>
          )}

          {/* Quick SOS Trigger in Header */}
          <button
            onClick={onOpenSOS}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-white transition-all cursor-pointer shadow-sm active:scale-95 ${
              activeSOS
                ? 'bg-red-700 animate-pulse'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            <span>SOS</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            aria-label="View notifications"
            className="relative w-10 h-10 rounded-2xl bg-amber-300/70 hover:bg-amber-300 text-slate-950 flex items-center justify-center transition-colors cursor-pointer active:scale-95 shrink-0"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 border-2 border-amber-400 rounded-full animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 border-2 border-amber-400 rounded-full" />
            )}
          </button>

          {/* Profile Avatar Icon */}
          <button
            onClick={onOpenProfile}
            aria-label="User Profile"
            className="w-10 h-10 rounded-2xl bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer border border-amber-300 shrink-0"
          >
            RN
          </button>
        </div>
      </div>
    </header>
  );
};
