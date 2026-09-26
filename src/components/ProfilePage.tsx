import React, { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  Heart,
  Bell,
  Globe,
  Shield,
  Lock,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Sliders,
} from 'lucide-react';
import { UserProfile } from '../types';
import { initialUserProfile } from '../data/ecoShieldData';

interface ProfilePageProps {
  profile?: UserProfile;
  onUpdateProfile?: (profile: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile = initialUserProfile,
  onUpdateProfile,
}) => {
  const [user, setUser] = useState<UserProfile>(profile);
  const [savedBanner, setSavedBanner] = useState<boolean>(false);

  const toggleNotification = (key: keyof UserProfile['notifications']) => {
    const updated = {
      ...user,
      notifications: {
        ...user.notifications,
        [key]: !user.notifications[key],
      },
    };
    setUser(updated);
    if (onUpdateProfile) onUpdateProfile(updated);
    triggerSaved();
  };

  const toggleLocationPermission = () => {
    const updated = { ...user, locationPermission: !user.locationPermission };
    setUser(updated);
    if (onUpdateProfile) onUpdateProfile(updated);
    triggerSaved();
  };

  const triggerSaved = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center border-2 border-amber-300 shadow-md">
            RN
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">{user.name}</h2>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                Verified Citizen
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.phone}</span>
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{user.location}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Emergency Registry ID</div>
          <div className="font-mono font-bold text-slate-800">ECO-KL-98741-RN</div>
        </div>
      </div>

      {savedBanner && (
        <div className="bg-emerald-600 text-white text-xs font-bold p-3 rounded-2xl flex items-center gap-2 shadow-md animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile & safety settings saved successfully.</span>
        </div>
      )}

      {/* Grid: Medical & ICE Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Medical / Emergency Information */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Medical & First-Aid Profile
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Blood Type:</span>
              <span className="font-extrabold text-red-600 text-sm">{user.bloodType}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Known Allergies:</span>
              <span className="font-bold text-slate-800">{user.allergies}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Chronic Conditions:</span>
              <span className="font-bold text-slate-800">{user.medicalConditions}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            * Medical profile is automatically encrypted and accessible to registered paramedics upon SOS activation.
          </p>
        </div>

        {/* Emergency Contacts (ICE) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Emergency Contacts (I.C.E)
              </h3>
            </div>
            <button
              onClick={() => alert('Add Contact modal opened')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
            >
              + Add
            </button>
          </div>

          <div className="space-y-2">
            {user.iceContacts.map((contact, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-800">{contact.name}</div>
                  <div className="text-[11px] text-slate-500">{contact.relation} • {contact.phone}</div>
                </div>

                <a
                  href={`tel:${contact.phone}`}
                  className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center hover:bg-emerald-200 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notification & Location Permissions */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-extrabold text-slate-900">
            Emergency Alert & Permission Channels
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Push Notifications */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">Push Notifications</span>
              <span className="text-[11px] text-slate-500">Instant flood crest & evacuation alerts</span>
            </div>
            <button
              onClick={() => toggleNotification('push')}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                user.notifications.push ? 'bg-amber-400' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  user.notifications.push ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* SMS Alerts */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">SMS Gateway Fallback</span>
              <span className="text-[11px] text-slate-500">Delivers even when cellular data is cut</span>
            </div>
            <button
              onClick={() => toggleNotification('sms')}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                user.notifications.sms ? 'bg-amber-400' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  user.notifications.sms ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Critical Sound Alarm */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">Override Silent Mode (Life Safety)</span>
              <span className="text-[11px] text-slate-500">Rings for Level-Red disaster sirens</span>
            </div>
            <button
              onClick={() => toggleNotification('criticalSound')}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                user.notifications.criticalSound ? 'bg-amber-400' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  user.notifications.criticalSound ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* High-Accuracy GPS */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">High Accuracy GPS Location</span>
              <span className="text-[11px] text-slate-500">Pins your coordinates for rescue rafts</span>
            </div>
            <button
              onClick={toggleLocationPermission}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                user.locationPermission ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  user.locationPermission ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Language, Privacy & Reset */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-slate-400" />
          <div>
            <span className="font-bold text-slate-800 block">System Language</span>
            <span className="text-slate-500">{user.language}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Encrypted offline data cleared')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
          >
            Clear Offline Cache
          </button>
          <button
            onClick={() => alert('Session simulated logout')}
            className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
