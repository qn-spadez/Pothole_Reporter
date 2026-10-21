import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import type { PotholeReport, ReportStatus } from '../../types/report';
import { getStatusBadgeConfig } from '../../utils/formatters';

interface StatusDistributionChartProps {
  reports: PotholeReport[];
}

export const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({
  reports,
}) => {
  const statusKeys: ReportStatus[] = [
    'submitted',
    'in_review',
    'verified',
    'scheduled',
    'resolved',
    'rejected',
  ];

  const counts: Record<ReportStatus, number> = {
    submitted: 0,
    in_review: 0,
    verified: 0,
    scheduled: 0,
    resolved: 0,
    rejected: 0,
  };

  reports.forEach((r) => {
    if (counts[r.status] !== undefined) {
      counts[r.status]++;
    }
  });

  const total = reports.length || 1;

  const barColors: Record<ReportStatus, string> = {
    submitted: 'bg-slate-400',
    in_review: 'bg-amber-400',
    verified: 'bg-blue-500',
    scheduled: 'bg-indigo-500',
    resolved: 'bg-emerald-500',
    rejected: 'bg-rose-400',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Status Lifecycle</CardTitle>
        <span className="text-xs font-semibold text-slate-500">
          {reports.length} Total Reports
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Multi-segment stacked progress bar */}
        <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
          {statusKeys.map((status) => {
            const count = counts[status];
            if (count === 0) return null;
            const pct = (count / total) * 100;
            return (
              <div
                key={status}
                style={{ width: `${pct}%` }}
                className={`${barColors[status]} transition-all duration-300 relative group`}
                title={`${getStatusBadgeConfig(status).label}: ${count} (${Math.round(pct)}%)`}
              />
            );
          })}
        </div>

        {/* Legend grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {statusKeys.map((status) => {
            const count = counts[status];
            const pct = Math.round((count / total) * 100);
            const badge = getStatusBadgeConfig(status);

            return (
              <div
                key={status}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`h-2.5 w-2.5 rounded-full ${barColors[status]} shrink-0`} />
                  <span className="text-xs font-medium text-slate-700 truncate">
                    {badge.label}
                  </span>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-xs font-bold text-slate-900">{count}</span>
                  <span className="text-[10px] text-slate-400 ml-1">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
