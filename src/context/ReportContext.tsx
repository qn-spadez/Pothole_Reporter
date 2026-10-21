import React, { createContext, useState, useEffect } from 'react';
import type {
  PotholeReport,
  DuplicatePair,
  ReportStatus,
  ReportPriority,
} from '../types/report';

import { INITIAL_REPORTS } from '../data/mockReports';
import { INITIAL_DUPLICATE_PAIRS } from '../data/mockDuplicates';
import { calculateDistanceMeters } from '../utils/geo';

interface ToastState {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface ReportContextType {
  reports: PotholeReport[];
  duplicates: DuplicatePair[];
  toasts: ToastState[];
  showToast: (type: ToastState['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;
  addReport: (
    reportData: Omit<
      PotholeReport,
      'id' | 'createdAt' | 'updatedAt' | 'duplicateCount'
    >
  ) => PotholeReport;
  updateReportStatus: (id: string, status: ReportStatus) => void;
  updateReportPriority: (id: string, priority: ReportPriority) => void;
  confirmDuplicate: (pairId: string, notes?: string) => void;
  rejectDuplicate: (pairId: string, notes?: string) => void;
  resetToDefaults: () => void;
  loadStressTestData: () => void;
  getReportById: (id: string) => PotholeReport | undefined;
}

export const ReportContext = createContext<ReportContextType | undefined>(undefined);

const STORAGE_REPORTS_KEY = 'blr_pothole_reports_v1';
const STORAGE_DUPLICATES_KEY = 'blr_pothole_duplicates_v1';

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reports, setReports] = useState<PotholeReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_REPORTS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_REPORTS;
  });

  const [duplicates, setDuplicates] = useState<DuplicatePair[]>(() => {
    const saved = localStorage.getItem(STORAGE_DUPLICATES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_DUPLICATE_PAIRS;
  });

  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_DUPLICATES_KEY, JSON.stringify(duplicates));
  }, [duplicates]);

  const showToast = (
    type: ToastState['type'],
    title: string,
    message?: string
  ) => {
    const id = `${Date.now()}-${title.slice(0, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getReportById = (id: string) => reports.find((r) => r.id === id);

  const addReport = (
    reportData: Omit<
      PotholeReport,
      'id' | 'createdAt' | 'updatedAt' | 'duplicateCount'
    >
  ): PotholeReport => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `BLR-2026-${randomSuffix}`;
    const nowIso = new Date().toISOString();

    const createdReport: PotholeReport = {
      ...reportData,
      id: newId,
      createdAt: nowIso,
      updatedAt: nowIso,
      duplicateCount: 0,
    };

    // Duplicate detection simulation: check proximity against existing reports
    const nearbyReport = reports.find((r) => {
      const dist = calculateDistanceMeters(
        reportData.latitude,
        reportData.longitude,
        r.latitude,
        r.longitude
      );
      return dist <= 50; // Within 50 meters
    });

    if (nearbyReport) {
      const distance = calculateDistanceMeters(
        reportData.latitude,
        reportData.longitude,
        nearbyReport.latitude,
        nearbyReport.longitude
      );
      const simulatedSimilarity = Math.min(
        98,
        Math.max(72, Math.round(100 - distance * 0.5))
      );

      const newPair: DuplicatePair = {
        id: `DUP-PAIR-${Math.floor(100 + Math.random() * 900)}`,
        primaryReportId: nearbyReport.id,
        incomingReportId: newId,
        distanceMeters: distance,
        simulatedVisualSimilarity: simulatedSimilarity,
        clusterConfidence: Math.round(
          (simulatedSimilarity + (100 - distance)) / 2
        ),
        status: 'pending',
      };

      setDuplicates((prev) => [newPair, ...prev]);
      showToast(
        'warning',
        'Potential Duplicate Detected',
        `New report is within ${distance}m of existing report ${nearbyReport.id}. Added to Duplicate Review queue.`
      );
    } else {
      showToast(
        'success',
        'Pothole Reported Successfully',
        `Registered as ${newId}. Simulated AI triage assigned priority: ${reportData.priority.toUpperCase()}`
      );
    }

    setReports((prev) => [createdReport, ...prev]);
    return createdReport;
  };

  const updateReportStatus = (id: string, status: ReportStatus) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status, updatedAt: new Date().toISOString() }
          : r
      )
    );
    showToast('info', 'Status Updated', `Report ${id} changed to ${status.replace('_', ' ')}.`);
  };

  const updateReportPriority = (id: string, priority: ReportPriority) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, priority, updatedAt: new Date().toISOString() }
          : r
      )
    );
    showToast('info', 'Priority Updated', `Report ${id} priority set to ${priority}.`);
  };

  const confirmDuplicate = (pairId: string, notes?: string) => {
    const pair = duplicates.find((d) => d.id === pairId);
    if (!pair) return;

    setDuplicates((prev) =>
      prev.map((d) =>
        d.id === pairId
          ? {
              ...d,
              status: 'confirmed',
              reviewedAt: new Date().toISOString(),
              reviewNotes: notes || 'Verified as duplicate road defect cluster.',
            }
          : d
      )
    );

    // Increment duplicate count on primary, link incoming
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === pair.primaryReportId) {
          return {
            ...r,
            duplicateCount: (r.duplicateCount || 0) + 1,
            updatedAt: new Date().toISOString(),
          };
        }
        if (r.id === pair.incomingReportId) {
          return {
            ...r,
            duplicateOfId: pair.primaryReportId,
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );

    showToast(
      'success',
      'Duplicate Confirmed & Linked',
      `Merged ${pair.incomingReportId} into primary complaint ${pair.primaryReportId}.`
    );
  };

  const rejectDuplicate = (pairId: string, notes?: string) => {
    const pair = duplicates.find((d) => d.id === pairId);
    if (!pair) return;

    setDuplicates((prev) =>
      prev.map((d) =>
        d.id === pairId
          ? {
              ...d,
              status: 'rejected',
              reviewedAt: new Date().toISOString(),
              reviewNotes: notes || 'Confirmed as separate defect.',
            }
          : d
      )
    );

    showToast(
      'info',
      'Match Rejected',
      `Reports ${pair.primaryReportId} and ${pair.incomingReportId} remain distinct independent cases.`
    );
  };

  const resetToDefaults = () => {
    setReports(INITIAL_REPORTS);
    setDuplicates(INITIAL_DUPLICATE_PAIRS);
    localStorage.removeItem(STORAGE_REPORTS_KEY);
    localStorage.removeItem(STORAGE_DUPLICATES_KEY);
    showToast('info', 'Demo Reset', 'Reset all reports and duplicate records to default demo state.');
  };

  const loadStressTestData = () => {
    const extraReports: PotholeReport[] = [
      {
        id: 'BLR-2026-0901',
        roadName: 'Sarjapur Main Road, Near Kaikondrahalli Lake',
        zone: 'Mahadevapura',
        wardNumber: 150,
        description: 'Cavity along the road edge causing bike slowdowns.',
        status: 'submitted',
        priority: 'high',
        latitude: 12.9123,
        longitude: 77.6834,
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=800&q=80',
        reporterName: 'Vikram Seth',
        reporterContact: '+91 98800 *****',
        createdAt: '2026-10-21T06:00:00Z',
        updatedAt: '2026-10-21T06:00:00Z',
        simulatedAiDetection: {
          potholeDetected: true,
          confidenceScore: 91.5,
          estimatedSeverity: 'high',
          estimatedDepthCm: 10.4,
          estimatedSurfaceAreaSqM: 0.65,
          detectedFeatures: ['Edge cavitation'],
        },
      },
      {
        id: 'BLR-2026-0902',
        roadName: 'Old Airport Road, Near Domlur Flyover Ramp',
        zone: 'East Zone',
        wardNumber: 72,
        description: 'Pothole in the rapid bus lane.',
        status: 'in_review',
        priority: 'critical',
        latitude: 12.9612,
        longitude: 77.6387,
        imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        reporterName: 'Sunil Rao',
        reporterContact: '+91 97411 *****',
        createdAt: '2026-10-20T19:30:00Z',
        updatedAt: '2026-10-21T08:00:00Z',
        simulatedAiDetection: {
          potholeDetected: true,
          confidenceScore: 97.2,
          estimatedSeverity: 'critical',
          estimatedDepthCm: 15.2,
          estimatedSurfaceAreaSqM: 0.92,
          detectedFeatures: ['Severe crater', 'Rapid traffic corridor'],
        },
      },
      {
        id: 'BLR-2026-0903',
        roadName: 'Kanakapura Main Road, Near Konanakunte Cross',
        zone: 'South Zone',
        wardNumber: 184,
        description: 'Settled utility trench opening up into small potholes.',
        status: 'verified',
        priority: 'medium',
        latitude: 12.8895,
        longitude: 77.5684,
        imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
        reporterName: 'Meera Nambiar',
        reporterContact: '+91 98451 *****',
        createdAt: '2026-10-19T14:10:00Z',
        updatedAt: '2026-10-20T11:00:00Z',
        simulatedAiDetection: {
          potholeDetected: true,
          confidenceScore: 86.4,
          estimatedSeverity: 'medium',
          estimatedDepthCm: 7.8,
          estimatedSurfaceAreaSqM: 0.44,
          detectedFeatures: ['Utility cut settlement'],
        },
      },
      {
        id: 'BLR-2026-0904',
        roadName: 'Magadi Main Road, Near Tollgate Junction',
        zone: 'West Zone',
        wardNumber: 124,
        description: 'Torn top layer with crumbling bitumen chips.',
        status: 'scheduled',
        priority: 'medium',
        latitude: 12.9734,
        longitude: 77.5342,
        imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80',
        reporterName: 'Girish Patil',
        reporterContact: '+91 94492 *****',
        createdAt: '2026-10-18T10:00:00Z',
        updatedAt: '2026-10-19T17:00:00Z',
        simulatedAiDetection: {
          potholeDetected: true,
          confidenceScore: 82.0,
          estimatedSeverity: 'medium',
          estimatedDepthCm: 6.0,
          estimatedSurfaceAreaSqM: 0.35,
          detectedFeatures: ['Bitumen disintegration'],
        },
      },
    ];

    setReports((prev) => [...extraReports, ...prev]);
    showToast('success', 'Extended Data Loaded', `Added 4 additional ward inspection records.`);
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        duplicates,
        toasts,
        showToast,
        removeToast,
        addReport,
        updateReportStatus,
        updateReportPriority,
        confirmDuplicate,
        rejectDuplicate,
        resetToDefaults,
        loadStressTestData,
        getReportById,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export { useReports } from '../hooks/useReports';

