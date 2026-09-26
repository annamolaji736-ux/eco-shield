import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

declare global {
  interface Window {
    google?: any;
  }
}
import {
  MapPin,
  Navigation,
  Crosshair,
  Layers,
  Search,
  School,
  HeartPulse,
  AlertTriangle,
  Flame,
  Waves,
  Mountain,
  ShieldAlert,
  Radio,
  CheckCircle2,
  X,
  Compass,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  USER_CURRENT_LOCATION,
  initialReportsNearYou,
  evacuationCentersList,
  rescueTeamsList,
  hospitalsList,
  blockedRoadsList,
} from '../data/ecoShieldData';
import { HazardReport, EvacuationCenter, RescueTeam, Hospital, BlockedRoad, EmergencyIncident } from '../types';

interface GoogleLiveMapProps {
  activeSOSIncident: EmergencyIncident | null;
  onNavigateToCenter?: (center: EvacuationCenter) => void;
  onNavigateToHospital?: (hospital: Hospital) => void;
  focusItemId?: string | null;
}

export const GoogleLiveMap: React.FC<GoogleLiveMapProps> = ({
  activeSOSIncident,
  onNavigateToCenter,
  onNavigateToHospital,
  focusItemId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapError, setMapError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [activeRoute, setActiveRoute] = useState<'NONE' | 'SHELTER' | 'HOSPITAL'>('NONE');
  const [routeInfo, setRouteInfo] = useState<{ destination: string; distance: string; eta: string; safetyNote: string } | null>(null);
  const [selectedPin, setSelectedPin] = useState<{
    type: 'SOS' | 'REPORT' | 'SHELTER' | 'RESCUE' | 'HOSPITAL' | 'ROAD';
    data: any;
  } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(14);

  const markersRef = useRef<any[]>([]);
  const circlesRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);

  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || 'AIzaSyCCIVPVWSrRH3ea-Q9Rv3yiN42SULWL8WY';

  // Initialize Google Maps
  useEffect(() => {
    let isMounted = true;
    const loaderInstance = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry'],
    });

    (loaderInstance as any)
      .load()
      .then((g: any) => {
        if (!isMounted || !mapContainerRef.current) return;

        const googleObj = g || window.google;
        if (!googleObj || !googleObj.maps) return;

        const map = new googleObj.maps.Map(mapContainerRef.current, {
          center: { lat: USER_CURRENT_LOCATION.lat, lng: USER_CURRENT_LOCATION.lng },
          zoom: 14,
          mapTypeId: 'terrain',
          disableDefaultUI: true,
          zoomControl: false,
          gestureHandling: 'greedy',
          styles: [
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#a2daf2' }],
            },
            {
              featureType: 'landscape.man_made',
              elementType: 'geometry',
              stylers: [{ color: '#f7f1df' }],
            },
            {
              featureType: 'landscape.natural',
              elementType: 'geometry',
              stylers: [{ color: '#d0e3b4' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.fill',
              stylers: [{ color: '#ffe159' }],
            },
          ],
        });

        setMapInstance(map);
        setMapLoaded(true);
      })
      .catch((err: any) => {
        console.warn('Google Maps could not be initialized from network, switching to interactive vector engine:', err);
        setMapError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [apiKey]);

  // Update Google Maps markers & risk zones when filter or data changes
  useEffect(() => {
    if (!mapInstance || !window.google) return;

    // Clear existing markers & shapes
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    circlesRef.current.forEach((c) => c.setMap(null));
    circlesRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();

    // 1. User Location Marker
    const userMarker = new window.google.maps.Marker({
      position: { lat: USER_CURRENT_LOCATION.lat, lng: USER_CURRENT_LOCATION.lng },
      map: mapInstance,
      title: 'Your Current Location (Safe Zone)',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: '#2563EB',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 3,
      },
    });
    userMarker.addListener('click', () => {
      setSelectedPin({
        type: 'REPORT',
        data: {
          title: 'You (Current Location)',
          locationName: USER_CURRENT_LOCATION.address,
          distanceKm: 0,
          description: 'High-accuracy GPS fix. Eco-Shield telemetry connected to disaster monitoring network.',
          timestamp: 'Live GPS',
          severity: 'low',
        },
      });
    });
    markersRef.current.push(userMarker);
    bounds.extend(userMarker.getPosition()!);

    // 2. Active SOS Beacon if active
    if (activeSOSIncident) {
      const sosMarker = new window.google.maps.Marker({
        position: { lat: activeSOSIncident.location.lat, lng: activeSOSIncident.location.lng },
        map: mapInstance,
        title: `CRITICAL SOS: ${activeSOSIncident.id}`,
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 7,
          fillColor: '#DC2626',
          fillOpacity: 1,
          strokeColor: '#FEF2F2',
          strokeWeight: 2,
        },
        animation: window.google.maps.Animation.BOUNCE,
      });
      sosMarker.addListener('click', () => {
        setSelectedPin({ type: 'SOS', data: activeSOSIncident });
      });
      markersRef.current.push(sosMarker);
      bounds.extend(sosMarker.getPosition()!);
    }

    // 3. Flood-risk zone circle & reports
    if (activeFilter === 'ALL' || activeFilter === 'Flood') {
      const floodCircle = new window.google.maps.Circle({
        strokeColor: '#2563EB',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#3B82F6',
        fillOpacity: 0.25,
        map: mapInstance,
        center: { lat: 9.8790, lng: 76.5820 },
        radius: 650,
      });
      circlesRef.current.push(floodCircle);

      const floodRep = initialReportsNearYou[0];
      const floodMarker = new window.google.maps.Marker({
        position: { lat: floodRep.coordinates.lat, lng: floodRep.coordinates.lng },
        map: mapInstance,
        title: floodRep.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#1D4ED8',
          fillOpacity: 0.95,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      });
      floodMarker.addListener('click', () => {
        setSelectedPin({ type: 'REPORT', data: floodRep });
      });
      markersRef.current.push(floodMarker);
    }

    // 4. Landslide-risk zone circle & reports
    if (activeFilter === 'ALL' || activeFilter === 'Landslide') {
      const landslideCircle = new window.google.maps.Circle({
        strokeColor: '#D97706',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#F59E0B',
        fillOpacity: 0.22,
        map: mapInstance,
        center: { lat: 9.8860, lng: 76.5910 },
        radius: 500,
      });
      circlesRef.current.push(landslideCircle);

      const landslideRep = initialReportsNearYou[2];
      const landMarker = new window.google.maps.Marker({
        position: { lat: landslideRep.coordinates.lat, lng: landslideRep.coordinates.lng },
        map: mapInstance,
        title: landslideRep.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#D97706',
          fillOpacity: 0.95,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      });
      landMarker.addListener('click', () => {
        setSelectedPin({ type: 'REPORT', data: landslideRep });
      });
      markersRef.current.push(landMarker);
    }

    // 5. Wildfire zone circle & reports
    if (activeFilter === 'ALL' || activeFilter === 'Wildfire') {
      const fireCircle = new window.google.maps.Circle({
        strokeColor: '#DC2626',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#EF4444',
        fillOpacity: 0.2,
        map: mapInstance,
        center: { lat: 9.8950, lng: 76.5650 },
        radius: 400,
      });
      circlesRef.current.push(fireCircle);
    }

    // 6. Evacuation Centers
    if (activeFilter === 'ALL' || activeFilter === 'SHELTERS') {
      evacuationCentersList.forEach((ec) => {
        const ecMarker = new window.google.maps.Marker({
          position: { lat: ec.coordinates.lat, lng: ec.coordinates.lng },
          map: mapInstance,
          title: ec.name,
          icon: {
            path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 7,
            fillColor: '#059669',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
        });
        ecMarker.addListener('click', () => {
          setSelectedPin({ type: 'SHELTER', data: ec });
        });
        markersRef.current.push(ecMarker);
      });
    }

    // 7. Rescue Teams
    if (activeFilter === 'ALL' || activeFilter === 'RESCUE') {
      rescueTeamsList.forEach((rt) => {
        const rtMarker = new window.google.maps.Marker({
          position: { lat: rt.coordinates.lat, lng: rt.coordinates.lng },
          map: mapInstance,
          title: rt.name,
          icon: {
            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: '#EA580C',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 1.5,
          },
        });
        rtMarker.addListener('click', () => {
          setSelectedPin({ type: 'RESCUE', data: rt });
        });
        markersRef.current.push(rtMarker);
      });
    }

    // 8. Hospitals
    if (activeFilter === 'ALL' || activeFilter === 'HOSPITALS') {
      hospitalsList.forEach((hosp) => {
        const hospMarker = new window.google.maps.Marker({
          position: { lat: hosp.coordinates.lat, lng: hosp.coordinates.lng },
          map: mapInstance,
          title: hosp.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#DC2626',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
        });
        hospMarker.addListener('click', () => {
          setSelectedPin({ type: 'HOSPITAL', data: hosp });
        });
        markersRef.current.push(hospMarker);
      });
    }

    // 9. Blocked Roads
    if (activeFilter === 'ALL' || activeFilter === 'ROADS') {
      blockedRoadsList.forEach((br) => {
        const brMarker = new window.google.maps.Marker({
          position: { lat: br.coordinates.lat, lng: br.coordinates.lng },
          map: mapInstance,
          title: br.roadName,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: '#6B7280',
            fillOpacity: 1,
            strokeColor: '#FBBF24',
            strokeWeight: 2,
          },
        });
        brMarker.addListener('click', () => {
          setSelectedPin({ type: 'ROAD', data: br });
        });
        markersRef.current.push(brMarker);
      });
    }
  }, [mapInstance, activeFilter, activeSOSIncident]);

  // Route drawing function
  const handleTriggerRoute = (type: 'SHELTER' | 'HOSPITAL') => {
    setActiveRoute(type);

    if (type === 'SHELTER') {
      const nearest = evacuationCentersList[0];
      setRouteInfo({
        destination: nearest.name,
        distance: `${nearest.distanceKm} km`,
        eta: '7 mins (Safe detour bypassing flooded levee)',
        safetyNote: 'Avoid Market Road intersection. High ground path selected via St. Thomas Church lane.',
      });

      if (mapInstance && window.google) {
        if (polylineRef.current) polylineRef.current.setMap(null);
        // Draw green safe path
        const pathCoords = [
          { lat: USER_CURRENT_LOCATION.lat, lng: USER_CURRENT_LOCATION.lng },
          { lat: 9.8745, lng: 76.5775 },
          { lat: 9.8755, lng: 76.5790 },
          { lat: nearest.coordinates.lat, lng: nearest.coordinates.lng },
        ];
        const poly = new window.google.maps.Polyline({
          path: pathCoords,
          geodesic: true,
          strokeColor: '#059669',
          strokeOpacity: 1.0,
          strokeWeight: 5,
        });
        poly.setMap(mapInstance);
        polylineRef.current = poly;
        mapInstance.panTo(nearest.coordinates);
      }
    } else {
      const hospital = hospitalsList[0];
      setRouteInfo({
        destination: hospital.name,
        distance: `${hospital.distanceKm} km`,
        eta: '4 mins via North Bypass',
        safetyNote: 'Direct clearance. Priority ambulance corridor operational.',
      });

      if (mapInstance && window.google) {
        if (polylineRef.current) polylineRef.current.setMap(null);
        const pathCoords = [
          { lat: USER_CURRENT_LOCATION.lat, lng: USER_CURRENT_LOCATION.lng },
          { lat: 9.8725, lng: 76.5770 },
          { lat: hospital.coordinates.lat, lng: hospital.coordinates.lng },
        ];
        const poly = new window.google.maps.Polyline({
          path: pathCoords,
          geodesic: true,
          strokeColor: '#DC2626',
          strokeOpacity: 1.0,
          strokeWeight: 5,
        });
        poly.setMap(mapInstance);
        polylineRef.current = poly;
        mapInstance.panTo(hospital.coordinates);
      }
    }
  };

  const clearRoute = () => {
    setActiveRoute('NONE');
    setRouteInfo(null);
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
  };

  const handleCenterOnUser = () => {
    if (mapInstance && window.google) {
      mapInstance.panTo({ lat: USER_CURRENT_LOCATION.lat, lng: USER_CURRENT_LOCATION.lng });
      mapInstance.setZoom(15);
    }
  };

  const handleZoom = (delta: number) => {
    if (mapInstance) {
      const current = mapInstance.getZoom() || 14;
      mapInstance.setZoom(current + delta);
      setZoomLevel(current + delta);
    }
  };

  return (
    <div className="relative w-full h-[650px] lg:h-[720px] rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg bg-slate-100 flex flex-col">
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-md border border-slate-200 pointer-events-auto">
          {/* Search Location Bar */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search evacuation zone, hospital, road..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-800"
            />
          </div>

          {/* Quick Route Actions */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleTriggerRoute('SHELTER')}
              className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm ${
                activeRoute === 'SHELTER'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>Route to Shelter</span>
            </button>

            <button
              onClick={() => handleTriggerRoute('HOSPITAL')}
              className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm ${
                activeRoute === 'HOSPITAL'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Route to Hospital</span>
            </button>

            {activeRoute !== 'NONE' && (
              <button
                onClick={clearRoute}
                className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1.5 rounded-xl font-semibold cursor-pointer"
              >
                Clear Route
              </button>
            )}
          </div>
        </div>

        {/* Disaster-Type Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 pointer-events-auto">
          {[
            { id: 'ALL', label: 'All Hazards' },
            { id: 'Flood', label: '🌊 Flood Zones' },
            { id: 'Landslide', label: '⛰️ Landslide Zones' },
            { id: 'Wildfire', label: '🔥 Wildfire Watch' },
            { id: 'SHELTERS', label: '🏠 Evacuation Centers' },
            { id: 'HOSPITALS', label: '🏥 Hospitals' },
            { id: 'RESCUE', label: '🚑 Rescue Teams' },
            { id: 'ROADS', label: '🚧 Blocked Roads' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm cursor-pointer ${
                activeFilter === chip.id
                  ? 'bg-slate-900 text-white font-bold ring-2 ring-amber-400'
                  : 'bg-white/95 text-slate-700 hover:bg-white border border-slate-200'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Map Controls on right: Re-center, Zoom In, Zoom Out */}
      <div className="absolute right-3 bottom-24 lg:bottom-12 z-20 flex flex-col gap-2">
        <button
          onClick={handleCenterOnUser}
          title="Center on My Location"
          className="w-10 h-10 rounded-xl bg-white hover:bg-slate-50 text-slate-800 shadow-md border border-slate-200 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        >
          <Crosshair className="w-5 h-5 text-blue-600" />
        </button>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 flex flex-col overflow-hidden">
          <button
            onClick={() => handleZoom(1)}
            title="Zoom In"
            className="w-10 h-9 flex items-center justify-center text-slate-800 hover:bg-slate-50 font-bold text-base border-b border-slate-100 cursor-pointer"
          >
            +
          </button>
          <button
            onClick={() => handleZoom(-1)}
            title="Zoom Out"
            className="w-10 h-9 flex items-center justify-center text-slate-800 hover:bg-slate-50 font-bold text-base cursor-pointer"
          >
            -
          </button>
        </div>
      </div>

      {/* Floating Map Legend (Bottom-Left) */}
      <div className="absolute left-3 bottom-24 lg:bottom-12 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-md border border-slate-200 text-[11px] text-slate-700 max-w-[210px] hidden sm:block">
        <div className="font-extrabold text-slate-900 mb-1.5 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-amber-500" /> Map Legend
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 border border-white" />
            <span>You (Safe GPS Zone)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-blue-400/40 border border-blue-600" />
            <span>Flood Risk Zone (Levee)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-400/40 border border-amber-600" />
            <span>Landslide Hazard Slope</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600" />
            <span>Evacuation Center (Open)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600" />
            <span>Hospital / Trauma ICU</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-600" />
            <span>Rescue Team / Patrol</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-600 border border-yellow-400" />
            <span>Impassable Roadway</span>
          </div>
        </div>
      </div>

      {/* Active Route Instruction Banner */}
      {routeInfo && (
        <div className="absolute top-28 left-3 right-3 z-20 bg-emerald-900 text-white p-3.5 rounded-2xl shadow-xl border border-emerald-700 flex items-start justify-between gap-3 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-white">Safe Route to: {routeInfo.destination}</span>
                <span className="text-[10px] font-extrabold bg-emerald-500/40 text-emerald-100 px-2 py-0.5 rounded-full">
                  {routeInfo.distance} • {routeInfo.eta}
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/90 mt-0.5 leading-snug">
                ⚠️ {routeInfo.safetyNote}
              </p>
            </div>
          </div>
          <button
            onClick={clearRoute}
            className="text-emerald-200 hover:text-white text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* The Map Canvas / Container */}
      <div ref={mapContainerRef} className="w-full h-full relative" />

      {/* High-Fidelity Interactive Vector Map Fallback if Google Maps is loading or offline */}
      {(!mapLoaded || mapError) && (
        <div className="absolute inset-0 z-10 bg-[#E2E8F0] overflow-hidden flex flex-col">
          {/* Vector Map Canvas */}
          <svg viewBox="0 0 800 600" className="w-full h-full object-cover">
            {/* Terrain Background */}
            <rect width="800" height="600" fill="#E2E8F0" />

            {/* River Network */}
            <path
              d="M0 280 C200 270, 320 340, 480 320 C640 300, 720 380, 800 360"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="28"
              strokeLinecap="round"
            />
            {/* Flood Inundation Buffer */}
            {(activeFilter === 'ALL' || activeFilter === 'Flood') && (
              <path
                d="M0 280 C200 270, 320 340, 480 320 C640 300, 720 380, 800 360"
                fill="none"
                stroke="#93C5FD"
                strokeWidth="70"
                strokeOpacity="0.45"
                strokeLinecap="round"
              />
            )}

            {/* Hillside Landslide Contour (Top Right) */}
            {(activeFilter === 'ALL' || activeFilter === 'Landslide') && (
              <g opacity="0.6">
                <path d="M520 0 C580 120, 680 180, 800 190 L800 0 Z" fill="#FBBF24" opacity="0.3" />
                <path d="M570 0 C620 90, 710 130, 800 140 L800 0 Z" fill="#D97706" opacity="0.4" />
              </g>
            )}

            {/* Main Highways and Local Arterials */}
            <g stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" opacity="0.95">
              <path d="M120 100 L700 100" />
              <path d="M100 480 L750 480" />
              <path d="M380 60 L380 540" />
              <path d="M560 120 L560 520" />
              <path d="M220 140 L220 490" />
            </g>

            {/* Secondary roads */}
            <g stroke="#CBD5E1" strokeWidth="3" opacity="0.8">
              <path d="M150 180 L650 180" />
              <path d="M180 390 L680 390" />
              <path d="M290 80 L290 520" />
              <path d="M470 120 L470 500" />
            </g>

            {/* Simulated Navigation Route Polyline */}
            {activeRoute === 'SHELTER' && (
              <path
                d="M320 300 L380 300 L380 200 L440 200"
                fill="none"
                stroke="#059669"
                strokeWidth="6"
                strokeDasharray="8,6"
              />
            )}
            {activeRoute === 'HOSPITAL' && (
              <path
                d="M320 300 L260 300 L260 220"
                fill="none"
                stroke="#DC2626"
                strokeWidth="6"
                strokeDasharray="8,6"
              />
            )}

            {/* Markers placed on vector map */}
            {/* User */}
            <g
              transform="translate(320, 300)"
              className="cursor-pointer"
              onClick={() =>
                setSelectedPin({
                  type: 'REPORT',
                  data: {
                    title: 'Your Location (Safe)',
                    locationName: USER_CURRENT_LOCATION.address,
                    distanceKm: 0,
                    description: 'Accurate GPS location. Telemetry synchronized with emergency command.',
                    timestamp: 'Now',
                    severity: 'low',
                  },
                })
              }
            >
              <circle r="18" fill="#2563EB" opacity="0.25" className="animate-ping" />
              <circle r="9" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />
            </g>

            {/* St. Mary's Shelter */}
            {(activeFilter === 'ALL' || activeFilter === 'SHELTERS') && (
              <g
                transform="translate(440, 200)"
                className="cursor-pointer group"
                onClick={() => setSelectedPin({ type: 'SHELTER', data: evacuationCentersList[0] })}
              >
                <circle r="14" fill="#059669" stroke="#FFFFFF" strokeWidth="2.5" />
                <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                  🏠
                </text>
              </g>
            )}

            {/* Hospital */}
            {(activeFilter === 'ALL' || activeFilter === 'HOSPITALS') && (
              <g
                transform="translate(260, 220)"
                className="cursor-pointer"
                onClick={() => setSelectedPin({ type: 'HOSPITAL', data: hospitalsList[0] })}
              >
                <circle r="14" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2.5" />
                <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                  🏥
                </text>
              </g>
            )}

            {/* Flood Incident */}
            {(activeFilter === 'ALL' || activeFilter === 'Flood') && (
              <g
                transform="translate(480, 320)"
                className="cursor-pointer"
                onClick={() => setSelectedPin({ type: 'REPORT', data: initialReportsNearYou[0] })}
              >
                <circle r="14" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2.5" />
                <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                  🌊
                </text>
              </g>
            )}

            {/* Landslide Incident */}
            {(activeFilter === 'ALL' || activeFilter === 'Landslide') && (
              <g
                transform="translate(620, 140)"
                className="cursor-pointer"
                onClick={() => setSelectedPin({ type: 'REPORT', data: initialReportsNearYou[2] })}
              >
                <circle r="14" fill="#D97706" stroke="#FFFFFF" strokeWidth="2.5" />
                <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                  ⛰️
                </text>
              </g>
            )}

            {/* Rescue Team */}
            {(activeFilter === 'ALL' || activeFilter === 'RESCUE') && (
              <g
                transform="translate(370, 360)"
                className="cursor-pointer"
                onClick={() => setSelectedPin({ type: 'RESCUE', data: rescueTeamsList[0] })}
              >
                <circle r="14" fill="#EA580C" stroke="#FFFFFF" strokeWidth="2.5" />
                <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                  🚑
                </text>
              </g>
            )}
          </svg>

          {/* Banner explaining live vector renderer */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[11px] px-3 py-1 rounded-full shadow border border-slate-700 pointer-events-none flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Eco-Shield GIS Live Vector Engine (Google Maps API Ready)</span>
          </div>
        </div>
      )}

      {/* Selected Marker Detail Card Drawer */}
      {selectedPin && (
        <div className="absolute bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:w-96 z-30 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedPin.type === 'SHELTER'
                    ? 'bg-emerald-100 text-emerald-700'
                    : selectedPin.type === 'HOSPITAL'
                    ? 'bg-red-100 text-red-700'
                    : selectedPin.type === 'RESCUE'
                    ? 'bg-orange-100 text-orange-700'
                    : selectedPin.type === 'SOS'
                    ? 'bg-red-600 text-white'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {selectedPin.type === 'SHELTER' && <School className="w-5 h-5" />}
                {selectedPin.type === 'HOSPITAL' && <HeartPulse className="w-5 h-5" />}
                {selectedPin.type === 'RESCUE' && <ShieldAlert className="w-5 h-5" />}
                {selectedPin.type === 'SOS' && <Radio className="w-5 h-5 animate-pulse" />}
                {selectedPin.type === 'REPORT' && <AlertTriangle className="w-5 h-5" />}
                {selectedPin.type === 'ROAD' && <AlertTriangle className="w-5 h-5" />}
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  {selectedPin.type}
                </span>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {selectedPin.data.name || selectedPin.data.title || selectedPin.data.roadName || selectedPin.data.id}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedPin.data.address || selectedPin.data.locationName || selectedPin.data.reason}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedPin(null)}
              className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Extra Info */}
          {selectedPin.data.totalCapacity && (
            <div className="mt-2 text-xs bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-600">Capacity Available:</span>
              <span className="font-bold text-emerald-700">
                {selectedPin.data.totalCapacity - selectedPin.data.currentOccupancy} of {selectedPin.data.totalCapacity} open
              </span>
            </div>
          )}

          {selectedPin.data.emergencyBedsAvailable && (
            <div className="mt-2 text-xs bg-red-50 p-2 rounded-xl border border-red-100 flex items-center justify-between">
              <span className="text-red-700 font-medium">Emergency Beds Available:</span>
              <span className="font-extrabold text-red-900">
                {selectedPin.data.emergencyBedsAvailable} beds open
              </span>
            </div>
          )}

          {selectedPin.data.description && (
            <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-xl">
              {selectedPin.data.description}
            </p>
          )}

          {/* Action Row */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
            {selectedPin.type === 'SHELTER' && (
              <button
                onClick={() => handleTriggerRoute('SHELTER')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate to Shelter</span>
              </button>
            )}

            {selectedPin.type === 'HOSPITAL' && (
              <button
                onClick={() => handleTriggerRoute('HOSPITAL')}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate to Hospital</span>
              </button>
            )}

            {selectedPin.data.contact && (
              <a
                href={`tel:${selectedPin.data.contact}`}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-3 rounded-xl cursor-pointer"
              >
                Call Hotline
              </a>
            )}

            <button
              onClick={() => setSelectedPin(null)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-3 rounded-xl cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
