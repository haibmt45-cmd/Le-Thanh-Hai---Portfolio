import React from 'react';
import { Radio, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import { DataSourceType } from '../types';

interface SourceBadgeProps {
  dataSource: DataSourceType;
  label: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ dataSource, label }) => {
  if (dataSource === 'youtube_live') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-blue-200 bg-blue-50 text-blue-700 text-xs font-medium whitespace-nowrap shrink-0">
        <Radio className="w-3.5 h-3.5 text-blue-600" />
        <span>{label}</span>
      </span>
    );
  }

  if (dataSource === 'uploaded_csv_json') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-teal-200 bg-teal-50 text-teal-700 text-xs font-medium whitespace-nowrap shrink-0">
        <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
        <span>{label}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-100 text-slate-700 text-xs font-medium whitespace-nowrap shrink-0">
      <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
      <span>{label}</span>
    </span>
  );
};
