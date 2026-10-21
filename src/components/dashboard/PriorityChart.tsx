import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import type { PotholeReport, ReportPriority } from '../../types/report';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface PriorityChartProps {
  reports: PotholeReport[];
}

export const PriorityChart: React.FC<PriorityChartProps> = ({ reports }) => {
  const priorities: {
    key: ReportPriority;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    barColor: string;
    textColor: string;
  }[] = [
    {
      key: 'critical',
      label: 'Critical Hazard',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      barColor: 'bg-red-600',
      textColor: 'text-red-700',
    },
    {
      key: 'high',
      label: 'High Severity',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      barColor: 'bg-orange-500',
      textColor: 'text-orange-700',
    },
    {
      key: 'medium',
      label: 'Medium Severity',
      icon: Info,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      barColor: 'bg-amber-500',
      textColor: 'text-amber-700',
    },
    {
      key: 'low',
      label: 'Low / Minor',
      icon: CheckCircle2,
      color: 'text-slate-500',
      bgColor: 'bg-slate-100',
      barColor: 'bg-slate-400',
      textColor: 'text-slate-700',
    },
  ];

  const total = reports.length || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Priority & Severity Triage</CardTitle>
        <span className="text-xs text-slate-500 font-medium">
          Automated Risk Score
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        {priorities.map((item) => {
          const count = reports.filter((r) => r.priority === item.key).length;
          const percentage = Math.round((count / total) * 100);
          const Icon = item.icon;

          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Icon className={`h-4 w-4 ${item.color}`} />
                  <span className="font-semibold text-slate-800">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{count}</span>
                  <span className="text-slate-400 font-mono">({percentage}%)</span>
                </div>
              </div>

              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full ${item.barColor} rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
