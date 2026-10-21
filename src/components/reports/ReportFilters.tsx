import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import type { FilterOptions, ReportPriority, ReportStatus, BBMPZone } from '../../types/report';
import { Button } from '../common/Button';

interface ReportFiltersProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  totalFiltered: number;
  totalAvailable: number;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onChange,
  totalFiltered,
  totalAvailable,
}) => {
  const zones: BBMPZone[] = [
    'Mahadevapura',
    'Bommanahalli',
    'East Zone',
    'West Zone',
    'South Zone',
    'Rajarajeshwari Nagar',
    'Yelahanka',
    'Dasarahalli',
  ];

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.zone !== 'all';

  const resetFilters = () => {
    onChange({
      search: '',
      status: 'all',
      priority: 'all',
      zone: 'all',
      sortBy: 'newest',
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search road name, report ID, description..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:bg-white focus:outline-none transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div>
          <select
            value={filters.status}
            onChange={(e) =>
              onChange({
                ...filters,
                status: e.target.value as 'all' | ReportStatus,
              })
            }
            className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:bg-white focus:outline-none font-medium text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="in_review">In Review</option>
            <option value="verified">Verified Defect</option>
            <option value="scheduled">Repair Scheduled</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Priority Dropdown */}
        <div>
          <select
            value={filters.priority}
            onChange={(e) =>
              onChange({
                ...filters,
                priority: e.target.value as 'all' | ReportPriority,
              })
            }
            className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:bg-white focus:outline-none font-medium text-slate-700"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {/* Zone Dropdown */}
        <div>
          <select
            value={filters.zone}
            onChange={(e) =>
              onChange({
                ...filters,
                zone: e.target.value as 'all' | BBMPZone,
              })
            }
            className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:bg-white focus:outline-none font-medium text-slate-700"
          >
            <option value="all">All BBMP Zones</option>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Secondary Bar: Active Filters info, Sort order, Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <span>
            Showing <strong>{totalFiltered}</strong> of{' '}
            <strong>{totalAvailable}</strong> reports
          </span>
          {hasActiveFilters && (
            <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
              Filtered
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onChange({
                ...filters,
                sortBy: e.target.value as FilterOptions['sortBy'],
              })
            }
            className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 font-medium text-slate-700 focus:ring-2 focus:ring-slate-900 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority (High to Low)</option>
            <option value="severity">Depth & Surface Severity</option>
          </select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              leftIcon={<X className="h-3 w-3" />}
              className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
