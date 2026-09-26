import React from 'react';
import { Home, Map, AlertTriangle, User, ShieldAlert } from 'lucide-react';
import { DesktopNavPage } from './DesktopSidebar';

interface MobileBottomNavProps {
  activePage: DesktopNavPage;
  onPageChange: (page: DesktopNavPage) => void;
  alertsCount?: number;
  onTriggerSOS: () => void;
  activeSOS: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activePage,
  onPageChange,
  alertsCount = 4,
  onTriggerSOS,
  activeSOS,
}) => {
  const showFloatingSOS = ['home', 'map', 'alerts', 'reports', 'evacuation'].includes(activePage);

  return (
    <>
      {/* Floating Circular Red SOS Button near bottom-right on Mobile, visually separate from navbar */}
      {showFloatingSOS && (
        <div className="lg:hidden fixed bottom-20 right-4 z-40">
          <button
            onClick={onTriggerSOS}
            aria-label="Emergency SOS"
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-transform active:scale-90 cursor-pointer border-2 border-white ${
              activeSOS
                ? 'bg-red-600 animate-bounce ring-4 ring-red-400'
                : 'bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 ring-4 ring-red-500/20'
            }`}
          >
            <ShieldAlert className="w-6 h-6 text-amber-300" />
            <span className="text-[9px] font-black tracking-tighter">SOS</span>
          </button>
        </div>
      )}

      {/* Clean Mobile Bottom Navigation Bar: Home, Map, Alerts, Profile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1">
        <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16">
          {/* 1. Home */}
          <button
            onClick={() => onPageChange('home')}
            className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors relative ${
              activePage === 'home' ? 'text-amber-500 font-extrabold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className={`w-5 h-5 ${activePage === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[11px] tracking-tight mt-1">Home</span>
            {activePage === 'home' && (
              <span className="absolute bottom-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />
            )}
          </button>

          {/* 2. Map */}
          <button
            onClick={() => onPageChange('map')}
            className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors relative ${
              activePage === 'map' ? 'text-amber-500 font-extrabold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Map className={`w-5 h-5 ${activePage === 'map' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[11px] tracking-tight mt-1">Map</span>
            {activePage === 'map' && (
              <span className="absolute bottom-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />
            )}
          </button>

          {/* 3. Alerts */}
          <button
            onClick={() => onPageChange('alerts')}
            className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors relative ${
              activePage === 'alerts' ? 'text-amber-500 font-extrabold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <AlertTriangle className={`w-5 h-5 ${activePage === 'alerts' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {alertsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {alertsCount}
                </span>
              )}
            </div>
            <span className="text-[11px] tracking-tight mt-1">Alerts</span>
            {activePage === 'alerts' && (
              <span className="absolute bottom-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />
            )}
          </button>

          {/* 4. Profile */}
          <button
            onClick={() => onPageChange('profile')}
            className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors relative ${
              activePage === 'profile' ? 'text-amber-500 font-extrabold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className={`w-5 h-5 ${activePage === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[11px] tracking-tight mt-1">Profile</span>
            {activePage === 'profile' && (
              <span className="absolute bottom-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
