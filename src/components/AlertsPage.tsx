import React, { useState } from 'react';
import {
  AlertTriangle,
  MapPin,
  Clock,
  ShieldCheck,
  Navigation,
  Phone,
  Flame,
  Waves,
  Mountain,
  Wind,
  HeartPulse,
  Truck,
  Building,
  Radio,
  Search,
  ChevronRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { EmergencyAlert, HazardType, RescueTeam } from '../types';
import { initialAlertsList, rescueTeamsList } from '../data/ecoShieldData';

interface AlertsPageProps {
  alerts?: EmergencyAlert[];
  onViewOnMap: (alert: EmergencyAlert) => void;
  onOpenSOS: () => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts = initialAlertsList,
  onViewOnMap,
  onOpenSOS,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Critical', 'Flood', 'Landslide', 'Wildfire', 'Storm', 'Safety'];

  const filteredAlerts = alerts.filter((alert) => {
    // Category filter
    if (selectedCategory === 'Critical' && alert.severity !== 'critical') return false;
    if (selectedCategory === 'Flood' && alert.disasterType !== 'Flood') return false;
    if (selectedCategory === 'Landslide' && alert.disasterType !== 'Landslide') return false;
    if (selectedCategory === 'Wildfire' && alert.disasterType !== 'Wildfire') return false;
    if (selectedCategory === 'Storm' && alert.disasterType !== 'Storm' && alert.disasterType !== 'Storm Surge') return false;
    if (selectedCategory === 'Safety' && alert.severity !== 'info') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(q) ||
        alert.location.toLowerCase().includes(q) ||
        alert.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const emergencyContacts = [
    { name: 'National Ambulance', number: '108', icon: <HeartPulse className="w-5 h-5 text-red-600" />, sub: '24/7 Casualty & Triage' },
    { name: 'Fire & Rescue Services', number: '101', icon: <Truck className="w-5 h-5 text-orange-600" />, sub: 'Water rescue & evacuation tenders' },
    { name: 'Police Control Room', number: '100', icon: <Building className="w-5 h-5 text-blue-600" />, sub: 'Law, order & traffic cordons' },
    { name: 'Disaster Control Room', number: '1077', icon: <Radio className="w-5 h-5 text-amber-600" />, sub: 'District emergency operations center' },
    { name: 'Hospital Casualty Hotline', number: '+91 485 225 1100', icon: <HeartPulse className="w-5 h-5 text-emerald-600" />, sub: "St. John's Emergency Triage" },
    { name: 'Aerial SAR Taskforce', number: '112', icon: <Radio className="w-5 h-5 text-purple-600" />, sub: 'Helicopter winch rescue operations' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Disaster Alerts & Civil Bulletins</span>
            <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
              Live Feed
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time public warnings, evacuation orders, and recommended safety procedures
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts by ward, type..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-800 font-medium"
          />
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-xs ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-sm ring-2 ring-amber-400'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat === 'Critical' && '🔴 '}
            {cat === 'Flood' && '🌊 '}
            {cat === 'Landslide' && '⛰️ '}
            {cat === 'Wildfire' && '🔥 '}
            {cat === 'Storm' && '⛈️ '}
            {cat === 'Safety' && '🟢 '}
            {cat}
          </button>
        ))}
      </div>

      {/* Main Alerts Feed */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
            <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No alerts found for this filter.</p>
            <p className="text-xs text-slate-400 mt-1">Try selecting 'All' or clearing the search query.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            return (
              <div
                key={alert.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                {/* Alert Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        isCritical
                          ? 'bg-red-600 text-white animate-pulse'
                          : alert.severity === 'high'
                          ? 'bg-orange-500 text-white'
                          : alert.severity === 'moderate'
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {alert.severity}
                    </span>

                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                      {alert.disasterType}
                    </span>

                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {alert.timestamp}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-medium truncate max-w-sm">
                    Source: <strong className="text-slate-700">{alert.source}</strong>
                  </div>
                </div>

                {/* Title & Location */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {alert.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-600 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-semibold text-slate-800">{alert.location}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {alert.description}
                </p>

                {/* Recommended Action (matching prompt example) */}
                <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold mb-0.5">Recommended Safety Action:</strong>
                    <span>{alert.recommendedAction}</span>
                  </div>
                </div>

                {/* Action Footer: "View on Map" button */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">Geotag: Lat {alert.coordinates.lat}, Lng {alert.coordinates.lng}</span>
                  <button
                    onClick={() => onViewOnMap(alert)}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer shadow-sm transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 text-amber-400" />
                    <span>View on Map</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 📞 EMERGENCY CONTACTS SECTION */}
      <section className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-4">
        <div>
          <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            <span>Emergency Quick Contacts</span>
            <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
              24/7 Dispatch
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            One-tap direct contact with emergency response agencies, ambulances, and police dispatch
          </p>
        </div>

        {/* 6 Quick-contact buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {emergencyContacts.map((contact, idx) => (
            <a
              key={idx}
              href={`tel:${contact.number}`}
              className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/10 flex flex-col justify-between transition-colors group cursor-pointer"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                  {contact.icon}
                </div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                  {contact.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{contact.sub}</div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono font-bold text-amber-400">
                <span>{contact.number}</span>
                <Phone className="w-3 h-3 text-white/60" />
              </div>
            </a>
          ))}
        </div>

        {/* Emergency Rescue Team Status Card */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
                <Truck className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-white">
                    {rescueTeamsList[0].name}
                  </h4>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    {rescueTeamsList[0].status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Vehicle: {rescueTeamsList[0].vehicleType} • {rescueTeamsList[0].membersCount} certified rescuers
                </p>
                <div className="text-[11px] text-amber-300 font-medium mt-1">
                  Current Status: {rescueTeamsList[0].responseStatus}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`tel:${rescueTeamsList[0].contact}`}
                className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-md transition-all"
              >
                <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Call Taskforce</span>
              </a>

              <button
                onClick={onOpenSOS}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl cursor-pointer shadow-md transition-all"
              >
                Trigger SOS
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
