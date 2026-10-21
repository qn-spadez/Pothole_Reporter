import type { ReportPriority, ReportStatus } from '../types/report';

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatTimeAgo(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  } catch {
    return 'Recent';
  }
}

export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E`;
}

export function getStatusBadgeConfig(status: ReportStatus) {
  switch (status) {
    case 'submitted':
      return {
        label: 'Submitted',
        bg: 'bg-slate-100',
        text: 'text-slate-800',
        border: 'border-slate-300',
        dot: 'bg-slate-500',
      };
    case 'in_review':
      return {
        label: 'In Review',
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'verified':
      return {
        label: 'Verified Defect',
        bg: 'bg-blue-50',
        text: 'text-blue-800',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
      };
    case 'scheduled':
      return {
        label: 'Repair Scheduled',
        bg: 'bg-indigo-50',
        text: 'text-indigo-800',
        border: 'border-indigo-200',
        dot: 'bg-indigo-500',
      };
    case 'resolved':
      return {
        label: 'Resolved',
        bg: 'bg-emerald-50',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'rejected':
      return {
        label: 'Rejected / Invalid',
        bg: 'bg-rose-50',
        text: 'text-rose-800',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
      };
    default:
      return {
        label: status,
        bg: 'bg-slate-100',
        text: 'text-slate-800',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
      };
  }
}

export function getPriorityBadgeConfig(priority: ReportPriority) {
  switch (priority) {
    case 'critical':
      return {
        label: 'Critical Priority',
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        fill: 'fill-red-600 text-red-600',
      };
    case 'high':
      return {
        label: 'High Priority',
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        fill: 'fill-orange-600 text-orange-600',
      };
    case 'medium':
      return {
        label: 'Medium Priority',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        fill: 'fill-amber-500 text-amber-500',
      };
    case 'low':
      return {
        label: 'Low Priority',
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-200',
        fill: 'fill-slate-400 text-slate-400',
      };
  }
}
