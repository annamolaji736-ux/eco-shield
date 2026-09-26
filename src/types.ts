export type SafetyStatusLevel = 'SAFE' | 'CAUTION' | 'HIGH_RISK' | 'CRITICAL';

export type HazardType =
  | 'Flood'
  | 'Storm'
  | 'Storm Surge'
  | 'Stormsurge'
  | 'Landslide'
  | 'Wildfire'
  | 'Road Block'
  | 'Road Blockage'
  | 'Power Outage'
  | 'Fallen Trees'
  | 'Medical Emergency'
  | 'Other';

export interface HazardReport {
  id: string;
  type: HazardType;
  title: string;
  locationName: string;
  distanceKm: number;
  timestamp: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  waterDepthCm?: number;
  description: string;
  reportsCount: number;
  verified: boolean;
  coordinates: { lat: number; lng: number };
  reportedBy: string;
  hasAttachment?: boolean;
}

export interface EvacuationCenter {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  totalCapacity: number;
  currentOccupancy: number;
  status: 'OPEN' | 'NEAR CAPACITY' | 'FULL';
  facilities?: string[];
  contactNumber: string;
  coordinates: { lat: number; lng: number };
  hasMedicalAid?: boolean;
  isPetFriendly?: boolean;
  hasGenerator?: boolean;
  hasPotableWater?: boolean;
}

export interface EmergencyAlert {
  id: string;
  disasterType: HazardType;
  title: string;
  location: string;
  severity: 'critical' | 'high' | 'moderate' | 'info';
  timestamp: string;
  description: string;
  recommendedAction: string;
  source: string;
  coordinates: { lat: number; lng: number };
}

export interface EmergencyIncident {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  timestamp: string;
  location: { lat: number; lng: number; address: string };
  status: 'PENDING_ACKNOWLEDGMENT' | 'ACKNOWLEDGED' | 'ESCALATED' | 'RESCUE_DISPATCHED' | 'RESOLVED';
  assignedTeam: {
    id: string;
    name: string;
    contact: string;
    etaMinutes: number;
    leader: string;
  };
  escalatedTo?: {
    entity: string;
    timestamp: string;
    reason: string;
    supervisorName: string;
  };
  history: {
    time: string;
    stage: string;
    note: string;
    level: 'info' | 'warn' | 'critical' | 'success' | 'alert';
  }[];
  countdownSeconds: number;
}

export interface EnvironmentalSensors {
  waterLevelMeters: number;
  waterLevelThreshold: number;
  soilMoisturePercent: number;
  airQualityIndex: number;
  airQualityStatus: string;
  temperatureC: number;
  humidityPercent: number;
  windSpeedKmh: number;
  rainfallMmPerHour: number;
  sensorNodeCount: number;
  lastSyncTime: string;
}

export interface AIRiskPrediction {
  floodRisk: number;
  landslideRisk: number;
  wildfireRisk: number;
  predictedSeverity: 'HIGH' | 'MODERATE' | 'LOW';
  mainContributingFactors: string[];
  lastUpdate: string;
}

export interface RescueTeam {
  id: string;
  name: string;
  status: 'Available' | 'En Route' | 'On Scene' | 'Standby';
  contact: string;
  responseStatus: string;
  membersCount: number;
  vehicleType: string;
  coordinates: { lat: number; lng: number };
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  contact: string;
  emergencyBedsAvailable: number;
  traumaCenterLevel: string;
  coordinates: { lat: number; lng: number };
}

export interface BlockedRoad {
  id: string;
  roadName: string;
  reason: string;
  clearingStatus: string;
  detourAdvice: string;
  coordinates: { lat: number; lng: number };
}

export interface EmergencyNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  level?: 'info' | 'warning' | 'high_risk' | 'critical';
  type?: 'alert' | 'advisory' | 'info';
  read: boolean;
  actionType?: 'view_map' | 'safety_instructions' | 'evacuation';
}

export interface UserProfile {
  name: string;
  phone: string;
  location: string;
  bloodType: string;
  allergies: string;
  medicalConditions: string;
  iceContacts: { name: string; relation: string; phone: string }[];
  notifications: {
    push: boolean;
    sms: boolean;
    inApp: boolean;
    criticalSound: boolean;
  };
  locationPermission: boolean;
  language: string;
}

export interface WeatherInfo {
  temperatureC: number;
  condition: string;
  rainProbability: number;
  precipitationMm: number;
  windSpeedKmh: number;
  stormSignal: number;
  advisoryText: string;
  forecast: { time: string; temp: number; icon: string }[];
}

export interface CommunityPost {
  id: string;
  author: string;
  badge?: string;
  isOfficial: boolean;
  timeAgo: string;
  content: string;
  hazardType?: HazardType;
  location: string;
  upvotes: number;
  commentsCount: number;
  imageUrl?: string;
}

export interface GoBagItem {
  id: string;
  name: string;
  category: 'Water & Food' | 'Medical' | 'Tools & Light' | 'Documents';
  checked: boolean;
  essential: boolean;
}
