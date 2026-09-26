/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { DesktopSidebar, DesktopNavPage } from './components/DesktopSidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SafetyStatusCard } from './components/SafetyStatusCard';
import { EmergencyAlertCard } from './components/EmergencyAlertCard';
import { WeatherEnvironmentCard } from './components/WeatherEnvironmentCard';
import { ReportsNearYouSection } from './components/ReportsNearYouSection';
import { EvacuationCentersSection } from './components/EvacuationCentersSection';
import { AIDisasterIntelligence } from './components/AIDisasterIntelligence';
import { WorkflowExplainer } from './components/WorkflowExplainer';
import { GoogleLiveMap } from './components/GoogleLiveMap';
import { AlertsPage } from './components/AlertsPage';
import { ProfilePage } from './components/ProfilePage';
import { ReportNowModal } from './components/ReportNowModal';
import { SOSSystemModal } from './components/SOSSystemModal';
import { SmartNotificationsDrawer } from './components/SmartNotificationsDrawer';
import { ReportDetailModal } from './components/ReportDetailModal';
import { PhoneMockup } from './components/PhoneMockup';
import { SmartCriticalAlertModal } from './components/SmartCriticalAlertModal';
import { PushNotificationToast, PushNotificationData } from './components/PushNotificationToast';
import { emergencyAudio } from './utils/audio';

import {
  SafetyStatusLevel,
  HazardReport,
  HazardType,
  EvacuationCenter,
  EmergencyAlert,
  EmergencyIncident,
  EnvironmentalSensors,
  AIRiskPrediction,
  Hospital,
  EmergencyNotification,
  UserProfile,
} from './types';

import {
  USER_CURRENT_LOCATION,
  initialSafetyStatus,
  initialReportsNearYou,
  evacuationCentersList,
  initialAlertsList,
  initialSensors,
  initialAIRiskPrediction,
  hospitalsList,
  initialNotificationsList,
  initialUserProfile,
} from './data/ecoShieldData';

export default function App() {
  // Navigation & View mode
  const [activePage, setActivePage] = useState<DesktopNavPage>('home');
  const [deviceViewMode, setDeviceViewMode] = useState<'responsive' | 'iphone_frame'>('responsive');

  // Core Data States
  const [safetyStatus, setSafetyStatus] = useState<SafetyStatusLevel>(initialSafetyStatus);
  const [reports, setReports] = useState<HazardReport[]>(initialReportsNearYou);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(initialAlertsList);
  const [evacuationCenters, setEvacuationCenters] = useState<EvacuationCenter[]>(evacuationCentersList);
  const [sensors, setSensors] = useState<EnvironmentalSensors>(initialSensors);
  const [aiPrediction, setAiPrediction] = useState<AIRiskPrediction>(initialAIRiskPrediction);
  const [notifications, setNotifications] = useState<EmergencyNotification[]>(initialNotificationsList);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);

  // SOS & Escalation System State
  const [activeSOSIncident, setActiveSOSIncident] = useState<EmergencyIncident | null>(null);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [selectedReportDetail, setSelectedReportDetail] = useState<HazardReport | null>(null);
  const [defaultReportCategory, setDefaultReportCategory] = useState<HazardType>('Flood');

  // Smart SOS Emergency Critical Alert System & Push Notifications
  const [isCriticalAlertOpen, setIsCriticalAlertOpen] = useState<boolean>(false);
  const [pushToast, setPushToast] = useState<PushNotificationData | null>(null);

  // Auto-trigger critical alert modal after 1.5s on initial session
  useEffect(() => {
    const initialAlertTimer = window.setTimeout(() => {
      setIsCriticalAlertOpen(true);
      setPushToast({
        id: `push-initial-${Date.now()}`,
        title: '🔴 CRITICAL ALERT: Flood Emergency Detected',
        message: '“Flood emergency detected near your location. Are you in danger?”',
        type: 'critical',
        actionLabel: 'Respond Now',
        onAction: () => setIsCriticalAlertOpen(true),
      });
    }, 1500);

    return () => clearTimeout(initialAlertTimer);
  }, []);

  // Unread notification count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Escalation Countdown Timer Effect
  useEffect(() => {
    let timer: number | undefined;

    if (activeSOSIncident && activeSOSIncident.status === 'PENDING_ACKNOWLEDGMENT') {
      timer = window.setInterval(() => {
        setActiveSOSIncident((prev) => {
          if (!prev || prev.status !== 'PENDING_ACKNOWLEDGMENT') return prev;

          if (prev.countdownSeconds <= 1) {
            // Trigger automatic escalation
            const escalatedIncident: EmergencyIncident = {
              ...prev,
              status: 'ESCALATED',
              countdownSeconds: 0,
              escalatedTo: {
                entity: 'Kerala State Emergency Operations Center & District Police Head Command',
                timestamp: 'Just now',
                reason: 'Rescue Team Alpha unacknowledged within standard 15-second response threshold.',
                supervisorName: 'Superintendent K. Varghese, IPS',
              },
              history: [
                ...prev.history,
                {
                  time: 'Just now',
                  stage: '⚠️ ESCALATION TRIGGERED',
                  note: 'Rescue team failed to acknowledge within response window. Incident auto-escalated to District Disaster Operations Center & Police Head.',
                  level: 'critical',
                },
              ],
            };

            // Trigger escalation audio & vibration
            emergencyAudio.playEscalationTone();
            emergencyAudio.triggerVibration([500, 200, 500, 200, 600]);

            // Set Push Notification Toast
            setPushToast({
              id: `push-esc-${Date.now()}`,
              title: '⚠️ SOS ESCALATED',
              message: '“Your emergency request has been escalated because the assigned team has not responded.”',
              type: 'escalated',
              actionLabel: 'View Status Tracker',
              onAction: () => setIsSOSModalOpen(true),
            });

            // Also add notification
            setNotifications((nPrev) => [
              {
                id: `notif-${Date.now()}`,
                title: '⚠️ SOS ESCALATED',
                message: '“Your emergency request has been escalated because the assigned team has not responded.” Reassigned to District Head Authority.',
                time: 'Just now',
                level: 'critical',
                read: false,
                actionType: 'view_map',
              },
              ...nPrev,
            ]);

            return escalatedIncident;
          }

          return {
            ...prev,
            countdownSeconds: prev.countdownSeconds - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeSOSIncident?.status]);

  // Critical Alert Actions
  const handleCriticalAlertNeedHelp = () => {
    setIsCriticalAlertOpen(false);
    handleInitiateSOS();
    setIsSOSModalOpen(true);
    emergencyAudio.triggerVibration([300, 150, 300, 150, 450]);
    emergencyAudio.playCriticalAlertTone();
    setPushToast({
      id: `push-sos-${Date.now()}`,
      title: 'SOS ACTIVE 🔴',
      message: '“Rescue team notified — awaiting response.” Live location shared.',
      type: 'sos',
      actionLabel: 'View Status Tracker',
      onAction: () => setIsSOSModalOpen(true),
    });
  };

  const handleCriticalAlertMarkSafe = () => {
    setIsCriticalAlertOpen(false);
    setSafetyStatus('SAFE');
    setPushToast({
      id: `push-safe-${Date.now()}`,
      title: '🟢 YOU ARE SAFE',
      message: 'Safe status confirmed and broadcasted to emergency rescue registry.',
      type: 'safe',
    });
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: '🟢 Status Confirmed: Safe',
        message: 'Civil Defense logged your safe status at MG Road sector.',
        time: 'Just now',
        level: 'info',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleCriticalAlertViewMap = () => {
    setIsCriticalAlertOpen(false);
    setActivePage('map');
    setPushToast({
      id: `push-map-${Date.now()}`,
      title: '🗺️ Live Disaster Threat Map',
      message: 'Safe-route navigation detour plotted avoiding flooded levee.',
      type: 'info',
      actionLabel: 'Open SOS',
      onAction: () => setIsSOSModalOpen(true),
    });
  };

  // Initiate SOS handler
  const handleInitiateSOS = () => {
    const newIncident: EmergencyIncident = {
      id: `SOS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: 'usr-98741',
      userName: userProfile.name,
      userPhone: userProfile.phone,
      timestamp: 'Just now',
      location: {
        lat: USER_CURRENT_LOCATION.lat,
        lng: USER_CURRENT_LOCATION.lng,
        address: USER_CURRENT_LOCATION.address,
      },
      status: 'PENDING_ACKNOWLEDGMENT',
      assignedTeam: {
        id: 'rt-1',
        name: 'Disaster Rapid Response Team Alpha',
        contact: '+91 9447 108 101',
        etaMinutes: 6,
        leader: 'Capt. Manoj Pillai',
      },
      countdownSeconds: 15,
      history: [
        {
          time: 'Just now',
          stage: 'SOS Activated',
          note: 'Distress coordinates captured. High-priority dispatch packet broadcasted to Response Team Alpha.',
          level: 'alert',
        },
        {
          time: 'Just now',
          stage: 'Waiting for Response',
          note: 'Rescue team dispatch terminal pinged. Auto-escalation timer initiated (15s).',
          level: 'info',
        },
      ],
    };

    setActiveSOSIncident(newIncident);
    setSafetyStatus('CRITICAL');

    // Add alert to notifications
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: '🔴 SOS TRANSMITTED & LOGGED',
        message: `Your emergency beacon ${newIncident.id} was dispatched to Disaster Rapid Response Team Alpha.`,
        time: 'Just now',
        level: 'critical',
        read: false,
        actionType: 'view_map',
      },
      ...prev,
    ]);
  };

  // Simulate Rescue Team Acknowledgment (Positive flow)
  const handleAcknowledgeByRescueTeam = () => {
    if (!activeSOSIncident) return;
    setActiveSOSIncident((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'ACKNOWLEDGED',
        history: [
          ...prev.history,
          {
            time: 'Just now',
            stage: 'Rescue Team Acknowledged',
            note: 'Response Team Alpha confirmed receipt. 4x4 rescue van and motorized inflatable boat deployed (ETA 6 mins).',
            level: 'success',
          },
        ],
      };
    });
  };

  // Force Immediate Escalation
  const handleTriggerEscalation = () => {
    if (!activeSOSIncident) return;
    setActiveSOSIncident((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'ESCALATED',
        countdownSeconds: 0,
        escalatedTo: {
          entity: 'State Disaster Management Control Room & District Magistrate',
          timestamp: 'Just now',
          reason: 'Manual escalation triggered by citizen / response supervisor override.',
          supervisorName: 'Superintendent K. Varghese, IPS',
        },
        history: [
          ...prev.history,
          {
            time: 'Just now',
            stage: '⚠️ ESCALATION TRIGGERED',
            note: 'Incident directly escalated to District Disaster Operations Center & Police Head. Direct emergency comms override.',
            level: 'critical',
          },
        ],
      };
    });
  };

  // Resolve Incident
  const handleResolveIncident = () => {
    setActiveSOSIncident(null);
    setSafetyStatus('CAUTION');
    setIsSOSModalOpen(false);
  };

  // Add new Hazard Report
  const handleAddNewReport = (newRep: Omit<HazardReport, 'id' | 'reportsCount' | 'verified' | 'coordinates'>) => {
    const reportItem: HazardReport = {
      ...newRep,
      id: `rep-${Date.now()}`,
      reportsCount: 1,
      verified: false,
      coordinates: {
        lat: USER_CURRENT_LOCATION.lat + (Math.random() - 0.5) * 0.015,
        lng: USER_CURRENT_LOCATION.lng + (Math.random() - 0.5) * 0.015,
      },
    };

    setReports((prev) => [reportItem, ...prev]);

    // Also inject an alert if critical
    if (reportItem.severity === 'critical' || reportItem.severity === 'high') {
      const newAlert: EmergencyAlert = {
        id: `alert-${Date.now()}`,
        disasterType: reportItem.type,
        title: `🔴 NEW ${reportItem.type.toUpperCase()} HAZARD LOGGED`,
        location: reportItem.locationName,
        severity: reportItem.severity,
        timestamp: 'Just now',
        description: reportItem.description,
        recommendedAction: 'Exercise extreme caution. Reroute via higher elevation bypass.',
        source: 'Citizen Telemetry Relay',
        coordinates: reportItem.coordinates,
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Hazard Reported: ${reportItem.type}`,
        message: `Your incident at "${reportItem.locationName}" has been pinned to the live disaster map.`,
        time: 'Just now',
        level: 'warning',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleNavigateToCenter = (center: EvacuationCenter) => {
    setActivePage('map');
  };

  const handleNavigateToHospital = (hospital: Hospital) => {
    setActivePage('map');
  };

  const handleCallCenter = (phone: string) => {
    alert(`Dialing Evacuation Desk: ${phone}`);
  };

  // Core Main Content View
  const mainDashboardContent = (
    <div className="space-y-6 pb-20">
      {/* 1. Large Safety Status Card: 🟢 YOU ARE SAFE / 🟡 CAUTION / 🟠 HIGH RISK / 🔴 CRITICAL */}
      <SafetyStatusCard
        status={safetyStatus}
        onStatusChange={(newStatus) => setSafetyStatus(newStatus)}
        onReportNow={() => setIsReportModalOpen(true)}
      />

      {/* 2. Prominent Emergency Alert Card with "View Alert" & large "Report Now" button */}
      <EmergencyAlertCard
        alert={alerts[0]}
        onViewAlert={() => setActivePage('alerts')}
        onReportNow={() => {
          setDefaultReportCategory('Flood');
          setIsReportModalOpen(true);
        }}
      />

      {/* 3. Dark Navy Weather & Environmental Sensor Telemetry Card with Raincloud + Lightning */}
      <WeatherEnvironmentCard
        sensors={sensors}
        onOpenLiveMap={() => setActivePage('map')}
      />

      {/* 4. "Reports Near You" Section: 🌊 Flood, 🌪️ Storm Surge, ⛰️ Landslide, 🔥 Wildfire, 🚧 Road Blockage */}
      <ReportsNearYouSection
        reports={reports}
        onViewReport={(rep) => setSelectedReportDetail(rep)}
        onViewOnMap={(rep) => setActivePage('map')}
      />

      {/* 5. 🏠 Evacuation Centers Near You Section: St. Mary's Higher Secondary School, etc. */}
      <EvacuationCentersSection
        centers={evacuationCenters}
        onNavigateToCenter={handleNavigateToCenter}
        onCallCenter={handleCallCenter}
      />

      {/* 6. 🧠 AI Disaster Intelligence (Risk predictions: Flood 78%, Landslide 24%, Wildfire 8%) */}
      <AIDisasterIntelligence
        prediction={aiPrediction}
        onOpenMapHazard={() => setActivePage('map')}
      />

      {/* 7. 🔄 Complete End-to-End Disaster Workflow Interactive Visualizer */}
      <WorkflowExplainer />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 antialiased font-sans select-none overflow-x-hidden flex">
      {/* 🖥️ DESKTOP RESPONSIVE SIDEBAR */}
      {deviceViewMode === 'responsive' && (
        <DesktopSidebar
          activePage={activePage}
          onPageChange={(page) => setActivePage(page)}
          onTriggerSOS={() => setIsSOSModalOpen(true)}
          activeSOS={Boolean(activeSOSIncident)}
          alertsCount={alerts.filter((a) => a.severity === 'critical' || a.severity === 'high').length}
          onSimulateCriticalAlert={() => setIsCriticalAlertOpen(true)}
        />
      )}

      {/* Main Content Layout Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Global Responsive Header Bar */}
        <HeaderBar
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenSOS={() => setIsSOSModalOpen(true)}
          onOpenProfile={() => setActivePage('profile')}
          unreadCount={unreadCount}
          activeSOS={Boolean(activeSOSIncident)}
          deviceViewMode={deviceViewMode}
          onToggleDeviceView={() =>
            setDeviceViewMode(deviceViewMode === 'responsive' ? 'iphone_frame' : 'responsive')
          }
          onSimulateCriticalAlert={() => setIsCriticalAlertOpen(true)}
        />

        {/* View Switcher: Responsive Web vs iPhone Frame Preview */}
        {deviceViewMode === 'iphone_frame' ? (
          <div className="py-6 bg-neutral-900 min-h-[calc(100vh-64px)] flex items-center justify-center">
            <PhoneMockup activeSignalLevel={2}>
              <div className="p-3 sm:p-4 space-y-4">
                {activePage === 'home' && mainDashboardContent}
                {activePage === 'map' && (
                  <GoogleLiveMap
                    activeSOSIncident={activeSOSIncident}
                    onNavigateToCenter={handleNavigateToCenter}
                    onNavigateToHospital={handleNavigateToHospital}
                  />
                )}
                {activePage === 'alerts' && (
                  <AlertsPage
                    alerts={alerts}
                    onViewOnMap={() => setActivePage('map')}
                    onOpenSOS={() => setIsSOSModalOpen(true)}
                  />
                )}
                {activePage === 'reports' && (
                  <div className="space-y-4">
                    <ReportsNearYouSection
                      reports={reports}
                      onViewReport={(r) => setSelectedReportDetail(r)}
                      onViewOnMap={() => setActivePage('map')}
                    />
                  </div>
                )}
                {activePage === 'emergency' && (
                  <div className="space-y-4">
                    <button
                      onClick={() => setIsSOSModalOpen(true)}
                      className="w-full bg-red-600 text-white font-extrabold py-4 rounded-2xl text-base shadow-lg"
                    >
                      Open Emergency SOS Console
                    </button>
                    <AlertsPage
                      alerts={alerts}
                      onViewOnMap={() => setActivePage('map')}
                      onOpenSOS={() => setIsSOSModalOpen(true)}
                    />
                  </div>
                )}
                {activePage === 'evacuation' && (
                  <EvacuationCentersSection
                    centers={evacuationCenters}
                    onNavigateToCenter={handleNavigateToCenter}
                    onCallCenter={handleCallCenter}
                  />
                )}
                {activePage === 'contacts' && (
                  <AlertsPage
                    alerts={alerts}
                    onViewOnMap={() => setActivePage('map')}
                    onOpenSOS={() => setIsSOSModalOpen(true)}
                  />
                )}
                {activePage === 'profile' && (
                  <ProfilePage
                    profile={userProfile}
                    onUpdateProfile={setUserProfile}
                  />
                )}
              </div>
            </PhoneMockup>
          </div>
        ) : (
          /* RESPONSIVE DESKTOP & MOBILE WORKSPACE */
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {activePage === 'home' && mainDashboardContent}

            {activePage === 'map' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Google Maps Live Disaster Interface
                    </h2>
                    <p className="text-xs text-slate-500">
                      Real-time geospatial visualization of flood zones, landslides, shelters, hospitals, and rescue teams
                    </p>
                  </div>
                </div>

                <GoogleLiveMap
                  activeSOSIncident={activeSOSIncident}
                  onNavigateToCenter={handleNavigateToCenter}
                  onNavigateToHospital={handleNavigateToHospital}
                />
              </div>
            )}

            {activePage === 'alerts' && (
              <AlertsPage
                alerts={alerts}
                onViewOnMap={() => setActivePage('map')}
                onOpenSOS={() => setIsSOSModalOpen(true)}
              />
            )}

            {activePage === 'reports' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Disaster Reports Registry
                    </h2>
                    <p className="text-xs text-slate-500">
                      Citizen-reported hazards, obstruction notices, and drone-verified aerial logs
                    </p>
                  </div>

                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md cursor-pointer"
                  >
                    + Submit New Report
                  </button>
                </div>

                <ReportsNearYouSection
                  reports={reports}
                  onViewReport={(rep) => setSelectedReportDetail(rep)}
                  onViewOnMap={() => setActivePage('map')}
                />
              </div>
            )}

            {activePage === 'emergency' && (
              <div className="space-y-6">
                <div className="bg-red-600 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black tracking-tight">Active Emergency Operations</h2>
                    <p className="text-xs text-red-100 mt-1 max-w-lg">
                      Direct coordination console for high-risk flood response, aerial search and rescue, and urgent medical evacuations.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsSOSModalOpen(true)}
                    className="bg-white text-red-700 hover:bg-red-50 text-sm font-black px-6 py-3 rounded-2xl shadow-lg cursor-pointer"
                  >
                    Launch Emergency SOS
                  </button>
                </div>

                <AlertsPage
                  alerts={alerts}
                  onViewOnMap={() => setActivePage('map')}
                  onOpenSOS={() => setIsSOSModalOpen(true)}
                />
              </div>
            )}

            {activePage === 'evacuation' && (
              <div className="space-y-6">
                <EvacuationCentersSection
                  centers={evacuationCenters}
                  onNavigateToCenter={handleNavigateToCenter}
                  onCallCenter={handleCallCenter}
                />
              </div>
            )}

            {activePage === 'contacts' && (
              <div className="space-y-6">
                <AlertsPage
                  alerts={alerts}
                  onViewOnMap={() => setActivePage('map')}
                  onOpenSOS={() => setIsSOSModalOpen(true)}
                />
              </div>
            )}

            {activePage === 'profile' && (
              <ProfilePage
                profile={userProfile}
                onUpdateProfile={setUserProfile}
              />
            )}
          </main>
        )}

        {/* 📱 MOBILE BOTTOM NAVIGATION BAR & FLOATING SOS BUTTON */}
        <MobileBottomNav
          activePage={activePage}
          onPageChange={(page) => setActivePage(page)}
          alertsCount={alerts.filter((a) => a.severity === 'critical').length}
          onTriggerSOS={() => setIsSOSModalOpen(true)}
          activeSOS={Boolean(activeSOSIncident)}
        />
      </div>

      {/* MODALS */}
      {/* 1. Smart Critical Disaster Alert High-Priority Popup */}
      <SmartCriticalAlertModal
        isOpen={isCriticalAlertOpen}
        onClose={() => setIsCriticalAlertOpen(false)}
        onNeedHelp={handleCriticalAlertNeedHelp}
        onMarkSafe={handleCriticalAlertMarkSafe}
        onViewMap={handleCriticalAlertViewMap}
        disasterType="Flood"
        locationName="MG Road / Periyar Basin"
        distanceKm={1.2}
      />

      {/* 2. In-App & Native Push Notification Banner */}
      <PushNotificationToast
        notification={pushToast}
        onDismiss={() => setPushToast(null)}
      />

      {/* 3. SOS Emergency System & Escalation Workflow Modal */}
      <SOSSystemModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        activeIncident={activeSOSIncident}
        onInitiateSOS={handleInitiateSOS}
        onAcknowledgeByRescueTeam={handleAcknowledgeByRescueTeam}
        onTriggerEscalation={handleTriggerEscalation}
        onResolveIncident={handleResolveIncident}
        onOpenSafeRouteMap={() => {
          setIsSOSModalOpen(false);
          setActivePage('map');
        }}
      />

      {/* 4. Report Emergency Hazard Modal */}
      <ReportNowModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleAddNewReport}
        defaultType={defaultReportCategory}
      />

      {/* 5. Smart Notifications Drawer */}
      <SmartNotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
        onViewMapAction={() => setActivePage('map')}
        onSafetyInstructionsAction={() => setActivePage('alerts')}
      />

      {/* 6. Report Detail Drawer */}
      <ReportDetailModal
        report={selectedReportDetail}
        onClose={() => setSelectedReportDetail(null)}
        onNavigateMap={() => {
          setSelectedReportDetail(null);
          setActivePage('map');
        }}
      />
    </div>
  );
}
