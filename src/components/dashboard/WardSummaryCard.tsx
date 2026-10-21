import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import type { PotholeReport, BBMPZone } from '../../types/report';
import { MapPin, ArrowRight } from 'lucide-react';

interface WardSummaryCardProps {
  reports: PotholeReport[];
}

export const WardSummaryCard: React.FC<WardSummaryCardProps> = ({ reports }) => {
  const zones: BBMPZone[] = [
    'Mahadevapura',
    'Bommanahalli',
    'East Zone',
    'South Zone',
    'West Zone',
  ];

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>BBMP Zonal Hotspots</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographic complaint concentration across Bengaluru
          </p>
        </div>
        <Link
          to="/map"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <span>Open Full Map</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {zones.map((zone) => {
            const zoneReports = reports.filter((r) => r.zone === zone);
            const count = zoneReports.length;
            const criticalCount = zoneReports.filter(
              (r) => r.priority === 'critical'
            ).length;

            return (
              <div
                key={zone}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{zone}</h4>
                    <p className="text-[11px] text-slate-500">
                      {zone === 'Mahadevapura'
                        ? 'Bellandur, Whitefield, Outer Ring Rd'
                        : zone === 'East Zone'
                        ? 'Indiranagar, Old Airport Rd'
                        : zone === 'South Zone'
                        ? 'Koramangala, Jayanagar'
                        : zone === 'Bommanahalli'
                        ? 'Silk Board, Bannerghatta Rd'
                        : 'Yeshwanthpur, Rajajinagar'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {criticalCount > 0 && (
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                      {criticalCount} Critical
                    </span>
                  )}
                  <span className="text-xs font-extrabold text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs">
                    {count} {count === 1 ? 'report' : 'reports'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
