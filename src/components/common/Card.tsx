import React from 'react';

export const Card: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }
> = ({ className = '', children, ...props }) => (
  <div
    className={`bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }
> = ({ className = '', children, ...props }) => (
  <div
    className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<
  React.HTMLAttributes<HTMLHeadingElement> & { children: React.ReactNode }
> = ({ className = '', children, ...props }) => (
  <h3
    className={`font-semibold text-slate-900 tracking-tight text-base sm:text-lg ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<
  React.HTMLAttributes<HTMLParagraphElement> & { children: React.ReactNode }
> = ({ className = '', children, ...props }) => (
  <p className={`text-xs sm:text-sm text-slate-500 mt-0.5 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }
> = ({ className = '', children, ...props }) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }
> = ({ className = '', children, ...props }) => (
  <div
    className={`px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 ${className}`}
    {...props}
  >
    {children}
  </div>
);
