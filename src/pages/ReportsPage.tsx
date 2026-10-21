import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  PlusCircle,
  MapPin,
} from 'lucide-react';
import { useReports } from '../context/ReportContext';
import { ReportFilters } from '../components/reports/ReportFilters';
import { ReportTable } from '../components/reports/ReportTable';
import { ReportDrawer } from '../components/reports/ReportDrawer';
import { Button } from '../components/common/Button';
import type { FilterOptions, PotholeReport } from '../types/report';
import { exportReportsAsJSON, exportReportsAsGeoJSON } from '../utils/export';

export const ReportsPage: React.FC = () => {
  const { reports } = useReports();
  const [selectedReport, setSelectedReport] = useState<PotholeReport | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: 'all',
    priority: 'all',
    zone: 'all',
    sortBy: 'newest',
  });

  const filteredReports = useMemo(() => {
    return reports
      .filter((report) => {
        // Search filter
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchesId = report.id.toLowerCase().includes(q);
          const matchesRoad = report.roadName.toLowerCase().includes(q);
          const matchesDesc = report.description.toLowerCase().includes(q);
          const matchesReporter = report.reporterName.toLowerCase().includes(q);
          if (!matchesId && !matchesRoad && !matchesDesc && !matchesReporter) {
            return false;
          }
        }

        // Status filter
        if (filters.status !== 'all' && report.status !== filters.status) {
          return false;
        }

        // Priority filter
        if (filters.priority !== 'all' && report.priority !== filters.priority) {
          return false;
        }

        // Zone filter
        if (filters.zone !== 'all' && report.zone !== filters.zone) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filters.sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (filters.sortBy === 'priority') {
          const priorityWeights = { critical: 4, high: 3, medium: 2, low: 1 };
          return priorityWeights[b.priority] - priorityWeights[a.priority];
        }
        if (filters.sortBy === 'severity') {
          return (
            b.simulatedAiDetection.estimatedDepthCm -
            a.simulatedAiDetection.estimatedDepthCm
          );
        }
        return 0;
      });
  }, [reports, filters]);

  return (
    <div className="space-y-5">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Civic Registry
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Pothole Reports & Grievance Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Searchable log of citizen-submitted road defects, simulated AI triage scores, and repair status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportReportsAsGeoJSON(filteredReports)}
            leftIcon={<MapPin className="h-3.5 w-3.5 text-slate-500" />}
            className="text-xs"
            title="Download GeoJSON for QGIS / Mapbox"
          >
            Export GeoJSON
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => exportReportsAsJSON(filteredReports)}
            leftIcon={<Download className="h-3.5 w-3.5 text-slate-500" />}
            className="text-xs"
            title="Download JSON record dump"
          >
            Export JSON
          </Button>

          <Link to="/report">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle className="h-4 w-4 text-amber-400" />}
              className="text-xs font-bold"
            >
              Report Pothole
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <ReportFilters
        filters={filters}
        onChange={setFilters}
        totalFiltered={filteredReports.length}
        totalAvailable={reports.length}
      />

      {/* Reports Table with Pagination */}
      <ReportTable
        reports={filteredReports}
        onSelectReport={(report) => setSelectedReport(report)}
        onResetFilters={() =>
          setFilters({
            search: '',
            status: 'all',
            priority: 'all',
            zone: 'all',
            sortBy: 'newest',
          })
        }
        pageSize={8}
      />

      {/* Detailed Slide-out Drawer */}
      <ReportDrawer
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
};
