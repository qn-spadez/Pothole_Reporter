// Bengaluru Geographic Constants
export const BENGALURU_CENTER = {
  lat: 12.9716,
  lng: 77.5946,
};

export const BENGALURU_HOTSPOTS = [
  {
    name: 'Outer Ring Road (Bellandur)',
    zone: 'Mahadevapura' as const,
    wardNumber: 150,
    lat: 12.9304,
    lng: 77.6784,
  },
  {
    name: '100 Feet Road (Indiranagar)',
    zone: 'East Zone' as const,
    wardNumber: 80,
    lat: 12.9784,
    lng: 77.6408,
  },
  {
    name: 'Sony World Junction (Koramangala 4th Block)',
    zone: 'South Zone' as const,
    wardNumber: 151,
    lat: 12.9344,
    lng: 77.6258,
  },
  {
    name: 'Central Silk Board Junction',
    zone: 'Bommanahalli' as const,
    wardNumber: 174,
    lat: 12.9177,
    lng: 77.6238,
  },
  {
    name: 'ITPL Main Road (Whitefield)',
    zone: 'Mahadevapura' as const,
    wardNumber: 84,
    lat: 12.9866,
    lng: 77.7499,
  },
  {
    name: 'Bannerghatta Main Road (Arekere)',
    zone: 'Bommanahalli' as const,
    wardNumber: 193,
    lat: 12.8872,
    lng: 77.5982,
  },
  {
    name: 'Yeshwanthpur Junction (Near Metro)',
    zone: 'West Zone' as const,
    wardNumber: 37,
    lat: 13.0238,
    lng: 77.5503,
  },
];

/**
 * Computes Haversine distance in meters between two coordinates
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c * 10) / 10;
}

export function isValidBengaluruCoord(lat: number, lng: number): boolean {
  // Rough bounding box for Greater Bengaluru
  return lat >= 12.75 && lat <= 13.25 && lng >= 77.4 && lng <= 77.85;
}
