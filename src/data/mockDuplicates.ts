import type { DuplicatePair } from '../types/report';

export const INITIAL_DUPLICATE_PAIRS: DuplicatePair[] = [
  {
    id: 'DUP-PAIR-101',
    primaryReportId: 'BLR-2026-0891', // Outer Ring Road, Bellandur (Arun)
    incomingReportId: 'BLR-2026-0892', // Outer Ring Road, Bellandur (Sneha)
    distanceMeters: 14.8,
    simulatedVisualSimilarity: 92.4,
    clusterConfidence: 94.6,
    status: 'pending',
  },
  {
    id: 'DUP-PAIR-102',
    primaryReportId: 'BLR-2026-0885', // 100 Feet Road, Indiranagar (Priya)
    incomingReportId: 'BLR-2026-0886', // 100 Feet Road, Indiranagar (Naveen)
    distanceMeters: 23.5,
    simulatedVisualSimilarity: 86.8,
    clusterConfidence: 88.0,
    status: 'pending',
  },
];
