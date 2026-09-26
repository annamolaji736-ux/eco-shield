import React from 'react';
import {
  ShieldCheck,
  Home,
  Map,
  AlertTriangle,
  FileText,
  Radio,
  School,
  PhoneCall,
  User,
  ShieldAlert,
} from 'lucide-react';

export type DesktopNavPage =
  | 'home'
  | 'map'
  | 'alerts'
  | 'reports'
  | 'emergency'
  | 'evacuation'
  | 'contacts'
  | 'profile';

interface DesktopSidebarProps {
  activePage: DesktopNavPage;
  onPageChange: (page: DesktopNavPage) => void;
  onTriggerSOS: () => void;
  activeSOS: boolean;
  alertsCount?: number;
  onSimulateCriticalAlert?: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activePage,
  onPageChange,
  onTriggerSOS,
  activeSOS,
  alertsCount = 4,
  onSimulateCriticalAlert,
}) => {
  const navItems: { id: DesktopNavPage; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'map', label: 'Live Map', icon: <Map className="w-5 h-5" /> },
    { id: 'alerts', label: 'Alerts', icon: <AlertTriangle className="w-5 h-5" />, badge: alertsCount },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
    { id: 'emergency', label: 'Emergency', icon: <Radio className="w-5 h-5 text-red-500" /> },
    { id: 'evacuation', label: 'Evacuation Centers', icon: <School className="w-5 h-5" /> },
    { id: 'contacts', label: 'Emergency Contacts', icon: <PhoneCall className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white border-r border-slate-200/90 h-screen sticky top-0 z-30 p-4 justify-between">
      <div>
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 px-3 py-2 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md border-2 border-amber-300">
            ES
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black tracking-tight text-slate-950">Eco-Shield</h1>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Disaster Response & GIS
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-slate-950' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-slate-950 text-amber-300' : 'bg-red-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Persistent SOS Button & Status Footer */}
      <div className="pt-4 border-t border-slate-100 space-y-2.5">
        {/* Simulate Critical Disaster Near User */}
        {onSimulateCriticalAlert && (
          <button
            onClick={onSimulateCriticalAlert}
            className="w-full py-2.5 px-3 rounded-2xl font-black text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Test Critical Disaster Alert Detection Near User"
          >
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>Simulate Critical Alert</span>
          </button>
        )}

        {/* Desktop Persistent SOS Trigger */}
        <button
          onClick={onTriggerSOS}
          className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg active:scale-95 ${
            activeSOS
              ? 'bg-red-600 text-white animate-pulse shadow-red-500/50'
              : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-500/30'
          }`}
        >
          <ShieldAlert className="w-5 h-5 text-amber-300" />
          <span>{activeSOS ? 'SOS BROADCAST ACTIVE' : 'EMERGENCY SOS'}</span>
        </button>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Grid Sector: Ward 7</span>
          <span className="font-bold text-emerald-600">LoRaWAN Online</span>
        </div>
      </div>
    </aside>
  );
};
