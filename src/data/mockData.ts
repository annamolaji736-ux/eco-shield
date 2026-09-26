import { HazardReport, EvacuationCenter, WeatherInfo, CommunityPost, EmergencyNotification, GoBagItem } from '../types';

export const initialHazardReports: HazardReport[] = [
  // Flood reports (14 total in area)
  {
    id: 'f-1',
    type: 'Flood',
    title: 'Waist-deep water rising near Riverbank',
    locationName: 'Riverside Drive cor. 5th Ave',
    distanceKm: 0.6,
    timestamp: '12 mins ago',
    severity: 'critical',
    waterDepthCm: 95,
    description: 'River overflowed past the levee. Small vehicles cannot pass. Rescue rafts deployed.',
    reportsCount: 14,
    verified: true,
    coordinates: { lat: 14.5995, lng: 120.9842 },
    reportedBy: 'Civil Defense Drone #4 & 13 residents'
  },
  {
    id: 'f-2',
    type: 'Flood',
    title: 'Knee-level ponding along main avenue',
    locationName: 'MacArthur Highway, KM 14',
    distanceKm: 1.2,
    timestamp: '25 mins ago',
    severity: 'moderate',
    waterDepthCm: 45,
    description: 'Clogged drainage causing rapid buildup. SUVs only.',
    reportsCount: 8,
    verified: true,
    coordinates: { lat: 14.6045, lng: 120.9892 },
    reportedBy: 'Brgy. Marshall Leo'
  },
  // Stormsurge reports (6 total)
  {
    id: 's-1',
    type: 'Stormsurge',
    title: 'High tide coastal surge breach',
    locationName: 'Seaside Boulevard & Pier 3',
    distanceKm: 1.8,
    timestamp: '18 mins ago',
    severity: 'critical',
    description: 'Seawall overtopped by 2.5m storm waves. Evacuate seaward perimeter immediately.',
    reportsCount: 6,
    verified: true,
    coordinates: { lat: 14.5825, lng: 120.9752 },
    reportedBy: 'Coast Guard District Station'
  },
  // Landslide reports (3 total)
  {
    id: 'l-1',
    type: 'Landslide',
    title: 'Mud & rockfall blocking north pass',
    locationName: 'Highland Ridge Curve, Sector 7',
    distanceKm: 2.4,
    timestamp: '42 mins ago',
    severity: 'high',
    description: 'Sloped soil saturated from overnight torrential downpour. DPWH clearing crew en route.',
    reportsCount: 3,
    verified: true,
    coordinates: { lat: 14.6225, lng: 121.0052 },
    reportedBy: 'Mountain Patrol Officer Santos'
  }
];

export const evacuationCenters: EvacuationCenter[] = [
  {
    id: 'ec-1',
    name: 'St. Jude Elementary School',
    address: '142 Rizal Ave, Brgy. Central',
    distanceKm: 0.8,
    totalCapacity: 450,
    currentOccupancy: 306,
    status: 'OPEN',
    hasMedicalAid: true,
    isPetFriendly: true,
    hasGenerator: true,
    hasPotableWater: true,
    contactNumber: '+63 (02) 8888-7583',
    coordinates: { lat: 14.595, lng: 120.988 }
  },
  {
    id: 'ec-2',
    name: 'Northpoint High School Gymnasium',
    address: '88 Mabini Blvd, West District',
    distanceKm: 1.5,
    totalCapacity: 600,
    currentOccupancy: 540,
    status: 'NEAR CAPACITY',
    hasMedicalAid: true,
    isPetFriendly: false,
    hasGenerator: true,
    hasPotableWater: true,
    contactNumber: '+63 (02) 8888-2911',
    coordinates: { lat: 14.61, lng: 120.995 }
  },
  {
    id: 'ec-3',
    name: 'San Isidro Multi-Purpose Civic Center',
    address: 'San Isidro Complex, East Gate',
    distanceKm: 2.1,
    totalCapacity: 350,
    currentOccupancy: 120,
    status: 'OPEN',
    hasMedicalAid: true,
    isPetFriendly: true,
    hasGenerator: true,
    hasPotableWater: true,
    contactNumber: '+63 (02) 8888-4392',
    coordinates: { lat: 14.588, lng: 121.002 }
  }
];

export const initialWeather: WeatherInfo = {
  temperatureC: 25,
  condition: 'Heavy Thunderstorms',
  rainProbability: 95,
  precipitationMm: 52,
  windSpeedKmh: 68,
  stormSignal: 2,
  advisoryText: 'Typhoon Signal #2 active. Gale-force winds with torrential rains. Keep away from windows and low-lying coastal floodplains.',
  forecast: [
    { time: '16:00', temp: 25, icon: 'thunder' },
    { time: '17:00', temp: 24, icon: 'heavy-rain' },
    { time: '18:00', temp: 24, icon: 'heavy-rain' },
    { time: '19:00', temp: 23, icon: 'thunder' },
    { time: '20:00', temp: 23, icon: 'rain' },
    { time: '21:00', temp: 24, icon: 'cloudy' },
  ]
};

export const initialPosts: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'City Disaster Risk Reduction Council',
    badge: 'Verified Official',
    isOfficial: true,
    timeAgo: '15m ago',
    content: '🚨 ADVISORY: Gate 4 of the spillway will open slightly at 17:00. All residents within 500m of the river perimeter must proceed to St. Jude Elementary School or Northpoint Gym immediately. Hot meals and clean drinking water are available.',
    hazardType: 'Flood',
    location: 'District Command HQ',
    upvotes: 248,
    commentsCount: 39
  },
  {
    id: 'post-2',
    author: 'Elena Ramirez (Barangay Volunteer)',
    badge: 'Community Warden',
    isOfficial: false,
    timeAgo: '32m ago',
    content: 'Power line down near 4th street corner pharmacy. Rescue truck is assisting seniors across knee-deep water. Please avoid driving small sedans through the intersection.',
    hazardType: 'Flood',
    location: 'Brgy. San Antonio',
    upvotes: 84,
    commentsCount: 16
  },
  {
    id: 'post-3',
    author: 'Red Cross Quick Response Team',
    badge: 'Emergency Services',
    isOfficial: true,
    timeAgo: '1h ago',
    content: 'Medical triage station is fully operational at St. Jude Elementary School. We have tetanus vaccines, dry blankets, infant formula, and first aid supplies. Please keep phone batteries preserved.',
    location: 'St. Jude Evacuation Center',
    upvotes: 192,
    commentsCount: 22
  }
];

export const initialNotifications: EmergencyNotification[] = [
  {
    id: 'n-1',
    title: 'Flash Flood Warning Level Red',
    message: 'Torrential rains reaching 52mm/hr. Low-lying zones advised to execute preemptive evacuation.',
    time: '10m ago',
    type: 'alert',
    read: false
  },
  {
    id: 'n-2',
    title: 'Evacuation Center Open',
    message: 'St. Jude Elementary School opened additional classrooms on 2nd floor for dry sleeping areas.',
    time: '35m ago',
    type: 'info',
    read: false
  },
  {
    id: 'n-3',
    title: 'Emergency Power Rationing',
    message: 'Grid operator switching to emergency islanded power to safeguard transformer substations.',
    time: '1h ago',
    type: 'advisory',
    read: true
  }
];

export const initialGoBagItems: GoBagItem[] = [
  { id: 'gb-1', name: 'Bottled drinking water (1 gallon/person/day)', category: 'Water & Food', checked: true, essential: true },
  { id: 'gb-2', name: 'Non-perishable canned food & energy bars (3-day supply)', category: 'Water & Food', checked: true, essential: true },
  { id: 'gb-3', name: 'Manual can opener', category: 'Water & Food', checked: false, essential: false },
  { id: 'gb-4', name: 'First aid kit with antiseptics & band-aids', category: 'Medical', checked: true, essential: true },
  { id: 'gb-5', name: 'Prescription medications (7-day supply)', category: 'Medical', checked: true, essential: true },
  { id: 'gb-6', name: 'N95 masks / dust masks', category: 'Medical', checked: false, essential: false },
  { id: 'gb-7', name: 'Heavy-duty waterproof flashlight + extra batteries', category: 'Tools & Light', checked: true, essential: true },
  { id: 'gb-8', name: 'Emergency whistle (120dB)', category: 'Tools & Light', checked: true, essential: true },
  { id: 'gb-9', name: 'Power bank & charging cables (sealed in ziplock)', category: 'Tools & Light', checked: true, essential: true },
  { id: 'gb-10', name: 'Multi-tool knife or pocket knife', category: 'Tools & Light', checked: false, essential: false },
  { id: 'gb-11', name: 'Government IDs, birth certs & insurance in waterproof pouch', category: 'Documents', checked: true, essential: true },
  { id: 'gb-12', name: 'Emergency cash in small bills', category: 'Documents', checked: false, essential: true }
];
