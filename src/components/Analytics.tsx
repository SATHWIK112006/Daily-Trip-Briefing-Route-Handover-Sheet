import React, { useState } from 'react';
import { Trip, Driver, Vehicle } from '../types';
import { 
  BarChart3, TrendingUp, Calendar, ArrowUpRight, DollarSign, 
  Download, FileSpreadsheet, FileText, Sparkles, Filter, ChevronRight, Activity, Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTranslation, formatCurrency } from '../utils/translations';

interface AnalyticsProps {
  trips: Trip[];
  drivers: Driver[];
  vehicles: Vehicle[];
  selectedLanguage: string;
}

export default function Analytics({ trips, drivers, vehicles, selectedLanguage }: AnalyticsProps) {
  const t = (key: string) => getTranslation(key, selectedLanguage);

  // Selector scopes
  const [reportRange, setReportRange] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [reportType, setReportType] = useState<'Revenue' | 'Drivers' | 'Vehicles' | 'Volume'>('Revenue');

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Math helper
  const tripCount = trips.length;
  const dispatchRevenue = trips.reduce((acc, t) => acc + t.revenue, 0);
  const avgBriefingRevenue = (dispatchRevenue / (tripCount || 1)).toFixed(0);

  const simulateDownload = (format: 'Excel' | 'CSV' | 'PDF') => {
    setDownloadSuccess(`Compiling TripPilot-Pro-${reportType}-${reportRange}-${new Date().toISOString().slice(0, 10)}.${format.toLowerCase() === 'excel' ? 'xlsx' : format.toLowerCase()}`);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header operations */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-sans font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-indigo-505" /> {t("Analytics Dashboard")}
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400 mt-1">
            {t("Manage fleet orders, live monitoring tracking system.")}
          </p>
        </div>

        {/* Range selectors */}
        <div className="flex bg-white/20 dark:bg-black/30 border border-white/10 rounded-2xl p-1 shrink-0 self-start md:self-auto h-[46px]">
          {['Daily', 'Weekly', 'Monthly'].map((range) => (
            <button
              id={`analytics-range-btn-${range}`}
              key={range}
              onClick={() => setReportRange(range as any)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                reportRange === range 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {t(range)}
            </button>
          ))}
        </div>
      </div>

      {/* Download Alert toast banner */}
      <AnimatePresence>
        {downloadSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>{downloadSuccess} completed & dispatched to browser downloads.</span>
            </div>
            <span className="text-[10px] font-mono font-black uppercase text-emerald-500">{t("Approved").toUpperCase()}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* High-level stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: t("Total Revenue"), val: formatCurrency(dispatchRevenue, selectedLanguage), change: "+14.2% from prev period", icon: DollarSign, color: "text-emerald-500" },
          { label: t("Average Customer Spend"), val: formatCurrency(Number(avgBriefingRevenue), selectedLanguage), change: "+3.8% efficiency gains", icon: TrendingUp, color: "text-indigo-400" },
          { label: t("E-Vehicles Charged"), val: `${(trips.filter(t=>t.vehicleId.includes('EC')).length * 8.4).toFixed(1)} kg`, change: "100% electric operations active", icon: Activity, color: "text-teal-400" }
        ].map((stat, idx) => (
          <div key={idx} className="rounded-3xl bento-glass-enhanced border border-white/20 dark:border-white/10 p-5 md:p-6 backdrop-blur-xl bg-white/25 dark:bg-slate-900/40 flex items-start justify-between">
            <div className="space-y-1 md:space-y-2">
              <p className="text-[11px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-widest font-mono">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stat.val}</h3>
              <p className="text-xs font-bold text-emerald-500">{stat.change}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl border border-white/5">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Primary Charts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Core SVG Revenue Trends Graphic */}
        <div className="lg:col-span-2 rounded-[32px] border border-white/20 dark:border-white/10 p-6 backdrop-blur-xl bg-white/25 dark:bg-slate-900/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-indigo-505" /> {t("Total Revenue")} ({reportRange})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-404">Corporate bookings split by premium logistics classifications.</p>
            </div>

            {/* Selector of stream */}
            <div className="flex relative bg-slate-950/85 dark:bg-black/90 backdrop-blur-3xl border border-indigo-500/30 dark:border-indigo-500/50 rounded-xl p-0.5 self-start sm:self-auto h-[38px] items-center gap-0.5 overflow-visible shadow-[0_0_15px_rgba(99,102,241,0.15)] select-none">
              {['Revenue', 'Volume', 'Drivers'].map((item) => {
                const isActive = reportType === item;
                return (
                  <button
                    id={`analytics-tab-${item}`}
                    key={item}
                    onClick={() => setReportType(item as any)}
                    className={`relative px-4 py-1 rounded-lg text-xs font-bold transition-colors duration-300 cursor-pointer overflow-visible group ${
                      isActive 
                        ? 'text-white' 
                        : 'text-slate-450 hover:text-slate-200'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeAnalyticsBg"
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg -z-10 shadow-[0_0_10px_rgba(99,102,241,0.35)] border border-indigo-450/20"
                        transition={{ type: "spring", stiffness: 380, damping: 25 }}
                      />
                    )}
                    <span className="relative z-10">{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Area Line Chart SVG Visualizer */}
          <div className="h-60 flex items-end justify-between relative pt-8 group font-mono select-none">
            {/* Gridlines */}
            <div className="absolute inset-x-0 top-8 border-t border-slate-250/20 dark:border-white/5" />
            <div className="absolute inset-x-0 top-24 border-t border-slate-250/20 dark:border-white/5" />
            <div className="absolute inset-x-0 top-40 border-t border-slate-250/20 dark:border-white/5" />
            <div className="absolute inset-x-0 bottom-0 border-t border-slate-205/30 dark:border-white/10" />

            {/* Custom SVG Path drawing Area Chart */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="areaGlowSecond" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="30%" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0%" />
                </linearGradient>
              </defs>
              {/* Primary Line */}
              <path d="M 5,80 Q 20,40 37,60 T 65,25 T 95,15" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
              <path d="M 5,80 Q 20,40 37,60 T 65,25 T 95,15 L 95,100 L 5,100 Z" fill="url(#areaGlow)" />
              {/* Secondary comparative line */}
              <path d="M 5,90 Q 25,65 40,75 T 70,45 T 95,35" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" />
              <path d="M 5,90 Q 25,65 40,75 T 70,45 T 95,35 L 95,100 L 5,100 Z" fill="url(#areaGlowSecond)" opacity="0.4" />
            </svg>

            {/* Custom interactive bars or data points mapped nicely */}
            {[
              { x: '10%', label: "Mon", val1: "$12,400", val2: "$10,100" },
              { x: '25%', label: "Tue", val1: "$18,900", val2: "$11,500" },
              { x: '40%', label: "Wed", val1: "$15,200", val2: "$9,800" },
              { x: '55%', label: "Thu", val1: "$21,100", val2: "$13,200" },
              { x: '70%', label: "Fri", val1: "$26,400", val2: "$16,500" },
              { x: '85%', label: "Sat", val1: "$29,900", val2: "$18,200" },
              { x: '95%', label: "Sun", val1: "$34,200", val2: "$21,400" }
            ].map((day, idx) => (
              <div key={idx} className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center cursor-pointer pointer-events-auto" style={{ left: day.x }}>
                <div className="relative group/val mb-2">
                  <span className="h-3 w-3 rounded-full bg-indigo-500 border border-white dark:border-slate-805 ring-4 ring-indigo-500/10 block group-hover/val:scale-150 transition-all" />
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[9px] py-1 px-1.5 rounded opacity-0 group-hover/val:opacity-100 transition-opacity whitespace-nowrap shadow-md z-20">
                    <p className="font-bold">{day.val1.replace('$', selectedLanguage !== 'en' ? '₹' : '$')}</p>
                    <p className="text-[7px] text-slate-400">Prev: {day.val2.replace('$', selectedLanguage !== 'en' ? '₹' : '$')}</p>
                  </div>
                </div>
                <span className="text-[10px] font-sans font-medium text-slate-500 mt-1">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Heat Map or Driver Efficiency Metrics */}
        <div className="rounded-[32px] border border-white/20 dark:border-white/10 p-6 backdrop-blur-xl bg-white/25 dark:bg-slate-900/40 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-805 dark:text-white flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-indigo-400" /> {t("Fulfill Dispatch Checklist")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Identify demand intensity peaks across the day grid.</p>
          </div>

          {/* iOS 27 beautiful block Grid heat map */}
          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] font-mono">
            {[
              { label: "06:00 - 09:00", opacity: "bg-indigo-500/90", text: "text-white", trips: `14 ${t("Trips").toLowerCase()}` },
              { label: "09:00 - 12:00", opacity: "bg-indigo-500/60", text: "text-indigo-950", trips: `9 ${t("Trips").toLowerCase()}` },
              { label: "12:00 - 15:00", opacity: "bg-indigo-500/35", text: "text-slate-800 dark:text-white", trips: `5 ${t("Trips").toLowerCase()}` },
              { label: "15:00 - 18:00", opacity: "bg-indigo-500/100", text: "text-white", trips: `22 ${t("Trips").toLowerCase()}` },
              { label: "18:00 - 21:00", opacity: "bg-indigo-500/75", text: "text-white", trips: `12 ${t("Trips").toLowerCase()}` },
              { label: "21:00 - 00:00", opacity: "bg-indigo-500/20", text: "text-slate-805 dark:text-white", trips: `3 ${t("Trips").toLowerCase()}` },
              { label: "00:00 - 03:00", opacity: "bg-indigo-500/5", text: "text-slate-500 dark:text-slate-400", trips: `0 ${t("Trips").toLowerCase()}` },
              { label: "03:00 - 06:00", opacity: "bg-indigo-500/10", text: "text-slate-500 dark:text-slate-400", trips: `1 ${t("Trips").toLowerCase()}` }
            ].map((period, idx) => (
              <div 
                id={`heatmap-cell-${idx}`}
                key={idx} 
                className={`p-3 rounded-2xl border border-white/5 flex flex-col justify-between h-20 ${period.opacity} ${period.text} transition-transform hover:scale-[1.03] duration-200`}
              >
                <span className="font-bold leading-tight">{period.label}</span>
                <span className="text-[9px] font-semibold opacity-80 leading-none">{period.trips}</span>
              </div>
            ))}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between font-bold pt-2 border-t border-slate-200/40">
            <span>Peak Demand Window:</span>
            <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1">15:00 - 18:00 (Rush)</span>
          </div>
        </div>
      </div>

      {/* Reports Export Panels (Actions) */}
      <div className="rounded-[32px] border border-white/20 dark:border-white/10 p-6 md:p-8 backdrop-blur-xl bg-white/25 dark:bg-slate-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="h-5 w-5 text-indigo-400 animate-bounce" /> {t("Print Brief")}
            </h3>
            <p className="text-sm text-slate-550 dark:text-slate-400">
              Compile corporate ledger reports, driver roster reviews, and vehicle health sheets instantly in standard formats.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              id="export-excel-btn"
              onClick={() => simulateDownload('Excel')}
              className="px-5 py-2.5 rounded-2xl border border-slate-2 py/50 dark:border-white/10 hover:bg-white/15 text-xs font-bold text-slate-650 dark:text-slate-300 flex items-center gap-1.5 transition-all shadow cursor-pointer"
            >
              <FileSpreadsheet className="h-4.5 w-4.5 text-emerald-500" /> Export Excel Sheet
            </button>
            
            <button
              id="export-csv-btn"
              onClick={() => simulateDownload('CSV')}
              className="px-5 py-2.5 rounded-2xl border border-slate-2 py/50 dark:border-white/10 hover:bg-white/15 text-xs font-bold text-slate-650 dark:text-slate-300 flex items-center gap-1.5 transition-all shadow cursor-pointer"
            >
              <FileText className="h-4.5 w-4.5 text-indigo-400" /> Export CSV Sheet
            </button>

            <button
              id="export-pdf-btn"
              onClick={() => simulateDownload('PDF')}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 dark:bg-indigo-505 hover:bg-indigo-750 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-500/20 cursor-pointer h-[44px]"
            >
              <FileText className="h-4.5 w-4.5 text-indigo-200" /> {t("Save PDF")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
