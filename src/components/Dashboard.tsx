import React, { useState } from 'react';
import { Trip, Vehicle, Driver, TripStatus, TripPriority } from '../types';
import { 
  TrendingUp, Users, Truck, Compass, CheckCircle2, AlertTriangle, 
  DollarSign, Activity, ChevronRight, MapPin, Clock, ArrowRight,
  Gauge, Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { getTranslation, formatCurrency } from '../utils/translations';

interface DashboardProps {
  trips: Trip[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onSelectTrip: (trip: Trip) => void;
  onNavigate: (screen: string) => void;
  selectedLanguage: string;
}

export default function Dashboard({ trips, vehicles, drivers, onSelectTrip, onNavigate, selectedLanguage }: DashboardProps) {
  const t = (key: string) => getTranslation(key, selectedLanguage);

  // Compute metrics
  const activeTripsCount = trips.length;
  const activeDriversCount = drivers.filter(d => d.status === 'Active').length;
  const vehiclesOnRoad = vehicles.filter(v => v.driverAssigned !== 'None (Standby)' && v.driverAssigned !== 'None').length;
  const completedTrips = trips.filter(t => t.status === TripStatus.COMPLETED);
  const delayedTrips = trips.filter(t => t.status === TripStatus.DELAYED);
  
  const totalRevenue = trips.reduce((acc, t) => acc + (t.status === TripStatus.COMPLETED ? t.revenue : 0), 0);
  const ongoingRevenuePotential = trips.reduce((acc, t) => acc + (t.status !== TripStatus.COMPLETED && t.status !== TripStatus.CANCELLED ? t.revenue : 0), 0);
  
  const averageRating = (drivers.reduce((acc, d) => acc + d.performanceRating, 0) / drivers.length).toFixed(2);

  // Status Distribution Counts
  const statusStats = {
    [TripStatus.SCHEDULED]: trips.filter(t => t.status === TripStatus.SCHEDULED).length,
    [TripStatus.ASSIGNED]: trips.filter(t => t.status === TripStatus.ASSIGNED).length,
    [TripStatus.IN_PROGRESS]: trips.filter(t => t.status === TripStatus.IN_PROGRESS).length,
    [TripStatus.DELAYED]: trips.filter(t => t.status === TripStatus.DELAYED).length,
    [TripStatus.COMPLETED]: trips.filter(t => t.status === TripStatus.COMPLETED).length,
    [TripStatus.CANCELLED]: trips.filter(t => t.status === TripStatus.CANCELLED).length,
  };

  // Recent trips for widget
  const recentTrips = [...trips].slice(0, 4);

  return (
    <div className="space-y-8 select-none">
      {/* Dynamic Operational Header with Futuristic Framing */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/10 dark:border-white/5 relative overflow-hidden">
        {/* Subtle decorative glowing corner for futuristic visual anchors */}
        <div className="absolute top-0 right-0 h-[1px] w-24 bg-gradient-to-r from-transparent to-indigo-505 shadow-[0_0_8px_#10b981]" />
        
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-slate-800 dark:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] flex items-center gap-3">
            <span className="bg-gradient-to-r from-indigo-500 to-indigo-400 bg-clip-text text-transparent">{t("MANIVTHA")}</span> 
            <span className="text-slate-800 dark:text-slate-100 font-light">{t("Premium Travels Cockpit")}</span>
          </h1>
          <p className="text-[10px] font-mono tracking-[0.25em] text-indigo-450 dark:text-indigo-400 mt-1.5 uppercase font-bold flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            {t("Aviation-Tier Logistics")}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto px-3.5 py-2 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md shadow-sm">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
          </span>
          <span className="text-xs font-black font-mono tracking-wider text-indigo-500 dark:text-indigo-400">
            {t("Fleet Activity Stream").toUpperCase()} • LIVE
          </span>
        </div>
      </div>

      {/* iOS 27 Liquid Glass Bento Stats Grid with Sci-Fi Brackets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            id: "stat-revenue",
            title: t("Revenue Log"),
            value: formatCurrency(totalRevenue, selectedLanguage),
            subtext: `+${formatCurrency(ongoingRevenuePotential, selectedLanguage)} potential`,
            icon: DollarSign,
            color: "from-indigo-500/20 to-indigo-400/10 text-indigo-500 dark:text-indigo-400",
            glow: "bg-indigo-500/20"
          },
          {
            id: "stat-trips",
            title: t("Active Trips"),
            value: activeTripsCount.toString(),
            subtext: `${completedTrips.length} ${t("Completed")}`,
            icon: Compass,
            color: "from-indigo-500/20 to-indigo-400/10 text-indigo-500 dark:text-indigo-400",
            glow: "bg-indigo-500/20"
          },
          {
            id: "stat-drivers",
            title: t("Active Drivers"),
            value: `${activeDriversCount}/${drivers.length}`,
            subtext: `${averageRating}⭐ Rating`,
            icon: Users,
            color: "from-indigo-500/20 to-indigo-400/10 text-indigo-500 dark:text-indigo-400",
            glow: "bg-indigo-500/20"
          },
          {
            id: "stat-vehicles",
            title: t("Total Vehicles"),
            value: `${vehiclesOnRoad}/${vehicles.length}`,
            subtext: `${vehicles.filter(v => v.batteryFuelLevel < 35).length} priority warning`,
            icon: Truck,
            color: "from-indigo-500/20 to-indigo-400/10 text-indigo-500 dark:text-indigo-400",
            glow: "bg-indigo-500/20"
          }
        ].map((stat) => (
          <motion.div
            key={stat.id}
            id={stat.id}
            whileHover={{ y: -5, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative overflow-hidden rounded-2xl bento-glass-enhanced liquid-glass-glow p-5 md:p-6 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.15)] transition-all duration-300"
            style={{ backgroundColor: 'var(--card-background)' }}
          >
            {/* Ambient Translucent Background Glow */}
            <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full filter blur-2xl opacity-10 dark:opacity-25 ${stat.glow}`} />
            
            {/* Cyber Corner HUD brackets */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-indigo-500/30 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-indigo-500/30 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-indigo-500/30 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-indigo-500/30 rounded-br-sm pointer-events-none" />

            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-1 md:space-y-1.5">
                <p className="text-[9px] md:text-[10px] font-bold font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                  {stat.title}
                </p>
                <h3 className="text-2xl md:text-3.5xl font-display font-black tracking-tight text-slate-800 dark:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} border border-indigo-500/10 shadow-inner`}>
                <stat.icon className="h-5 w-5 md:h-5.5 md:w-5.5" />
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-mono font-black text-slate-500 dark:text-slate-400">
                {stat.subtext}
              </span>
              <span className="text-[9px] font-bold font-mono text-indigo-500 flex items-center gap-0.5 uppercase tracking-wider">
                <TrendingUp className="h-3 w-3" /> Live
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Primary Panels - Insights and Quick Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Today's Trips Dynamic List (2 columns width on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" /> {t("Active Dispatch Master Log")}
            </h2>
            <button 
              id="view-all-trips-btn"
              onClick={() => onNavigate('Trips')}
              className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              {t("Trips")} <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {recentTrips.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-medium">
                {t("No active dispatches cataloged")}
              </div>
            ) : (
              recentTrips.map((trip) => {
                const priorityColors = {
                  [TripPriority.LOW]: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
                  [TripPriority.MEDIUM]: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
                  [TripPriority.HIGH]: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
                  [TripPriority.CRITICAL]: "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
                };

                const statusColors = {
                  [TripStatus.SCHEDULED]: "border-slate-300/60 text-slate-500 bg-slate-500/10",
                  [TripStatus.ASSIGNED]: "border-pink-300/60 text-pink-500 bg-pink-500/10",
                  [TripStatus.IN_PROGRESS]: "border-sky-300/60 text-sky-500 bg-sky-500/10",
                  [TripStatus.DELAYED]: "border-rose-300/60 text-rose-500 bg-rose-500/10",
                  [TripStatus.COMPLETED]: "border-emerald-300/60 text-emerald-500 bg-emerald-500/10",
                  [TripStatus.CANCELLED]: "border-red-300/60 text-red-500 bg-red-500/10",
                };

                return (
                  <motion.div
                    id={`dashboard-trip-card-${trip.id}`}
                    key={trip.id}
                    whileHover={{ scale: 1.005, y: -2 }}
                    onClick={() => onSelectTrip(trip)}
                    className="group relative cursor-pointer overflow-hidden rounded-3xl bento-glass-enhanced border border-white/20 dark:border-white/10 p-5 backdrop-blur-md bg-white/30 dark:bg-slate-900/30 hover:bg-white/40 dark:hover:bg-slate-900/50 transition-all shadow-sm"
                    style={{ backgroundColor: 'var(--card-background)' }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Driver Image or initial */}
                        <img 
                          src={trip.driverPhoto || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop"} 
                          alt={trip.driverName} 
                          className="h-12 w-12 rounded-2xl object-cover border border-white/40 shadow-inner"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 dark:text-slate-500 font-black">
                              {trip.id}
                            </span>
                            <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-full font-black ${priorityColors[trip.priority]}`}>
                              {t(trip.priority as string)} {t("Priority")}
                            </span>
                            <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full ${statusColors[trip.status]}`}>
                              {t(trip.status as string)}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {trip.customerName}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-indigo-400" /> {trip.pickupLocation.split(',')[0]}</span>
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            <span className="flex items-center gap-1"><ArrowRight className="h-3 w-3 text-indigo-400" /> {trip.dropLocation.split(',')[0]}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200/40 dark:border-white/5">
                        <div className="text-left md:text-right">
                          <p className="text-[10px] font-bold uppercase font-mono text-slate-400">{t("Pickup Time")}</p>
                          <p className="text-sm font-extrabold font-sans text-slate-700 dark:text-slate-300">
                            {new Date(trip.pickupTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-500 group-hover:translate-x-1 transition-transform">
                          {t("View Details")} <ChevronRight className="h-4 w-4 text-indigo-400" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Liquid Glass Fleet Status / Overview Donut Visualizer */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-400" /> {t("Airport Dispatches Indicator")}
          </h2>

          <div className="rounded-[32px] bento-glass-enhanced liquid-glass-glow border border-white/20 dark:border-white/10 p-6 backdrop-blur-xl shadow-lg bg-white/20 dark:bg-slate-900/40 space-y-6" style={{ backgroundColor: 'var(--card-accent-background)' }}>
            {/* SVG Custom Donut Chart for Trip Statuses */}
            <div className="flex justify-center py-2 relative">
              <svg width="180" height="180" viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Background circle */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="10" />
                
                {/* Dynamically segments - simple clean mock segments based on status values */}
                <circle id="scheduled-ring" cx="50" cy="50" r="40" fill="transparent" stroke="#94a3b8" strokeWidth="11" strokeDasharray="251.2" strokeDashoffset={`${251.2 - (251.2 * (statusStats[TripStatus.SCHEDULED] + 1) / (trips.length || 1))}`} className="transition-all duration-1000" />
                <circle id="assigned-ring" cx="50" cy="50" r="40" fill="transparent" stroke="#ec4899" strokeWidth="11" strokeDasharray="251.2" strokeDashoffset={`${251.2 - (251.2 * (statusStats[TripStatus.ASSIGNED] + statusStats[TripStatus.SCHEDULED]) / (trips.length || 1))}`} style={{ transform: "rotate(45deg)", transformOrigin: "center" }} />
                <circle id="inprogress-ring" cx="50" cy="50" r="40" fill="transparent" stroke="#0ea5e9" strokeWidth="11" strokeDasharray="251.2" strokeDashoffset={`${251.2 - (251.2 * (statusStats[TripStatus.IN_PROGRESS]) / (trips.length || 1))}`} />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-800 dark:text-white font-sans">{trips.length}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("Active Trips")}</span>
              </div>
            </div>

            {/* Legend with glassmorphic status rows */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { name: "Scheduled", count: statusStats[TripStatus.SCHEDULED], color: "bg-slate-400" },
                { name: "Assigned", count: statusStats[TripStatus.ASSIGNED], color: "bg-pink-500" },
                { name: "In Progress", count: statusStats[TripStatus.IN_PROGRESS], color: "bg-sky-500" },
                { name: "Delayed", count: statusStats[TripStatus.DELAYED], color: "bg-rose-500" },
                { name: "Completed", count: statusStats[TripStatus.COMPLETED], color: "bg-emerald-500" },
                { name: "Cancelled", count: statusStats[TripStatus.CANCELLED], color: "bg-red-500" }
              ].map((item, idx) => (
                <div key={idx} id={`legend-${item.name}`} className="flex items-center justify-between p-2 rounded-xl bg-white/20 dark:bg-white/5 border border-white/10">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${item.color}`} />
                    <span className="truncate text-[11px] font-medium text-slate-700 dark:text-slate-300">{t(item.name)}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-850 dark:text-slate-300">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Analytics High-Performance Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Custom drawn line graph for Daily Trip Trends */}
        <div className="rounded-[32px] bento-glass-enhanced liquid-glass-glow border border-white/20 dark:border-white/10 p-6 backdrop-blur-xl shadow-lg bg-white/20 dark:bg-slate-900/40 space-y-4" style={{ backgroundColor: 'var(--card-background)' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wider uppercase text-slate-400">{t("Trip Delivery Performance")}</h3>
            <span className="text-xs font-mono font-bold text-emerald-500">+18% Surge</span>
          </div>

          <div className="h-44 flex items-end justify-between relative pt-6 group">
            <div className="absolute inset-x-0 top-6 border-t border-slate-300/10 dark:border-white/5" />
            <div className="absolute inset-x-0 top-18 border-t border-slate-300/10 dark:border-white/5" />
            <div className="absolute inset-x-0 bottom-0 border-t border-slate-300/20 dark:border-white/10" />

            <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 5,80 Q 20,40 35,65 T 65,30 T 95,15" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
              <path d="M 5,80 Q 20,40 35,65 T 65,30 T 95,15 L 95,100 L 5,100 Z" fill="url(#lineGrad)" />
            </svg>

            {[
              { label: "Mon", val: "12", pos: "left-[5%]" },
              { label: "Tue", val: "18", pos: "left-[20%]" },
              { label: "Wed", val: "15", pos: "left-[35%]" },
              { label: "Thu", val: "24", pos: "left-[50%]" },
              { label: "Fri", val: "28", pos: "left-[65%]" },
              { label: "Sat", val: "32", pos: "left-[80%]" },
              { label: "Sun", val: "35", pos: "left-[95%]" }
            ].map((day, idx) => (
              <div key={idx} className={`absolute bottom-0 -translate-x-1/2 flex flex-col items-center ${day.pos}`}>
                <div className="relative group/pt mb-2 pointer-events-auto cursor-pointer">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-indigo-500/30 group-hover:scale-150 transition-all block" />
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-800/90 text-white font-mono text-[9px] py-1 px-1.5 rounded opacity-0 group-hover/pt:opacity-100 transition-opacity whitespace-nowrap shadow">
                    {day.val} {t("Trips").toLowerCase()}
                  </div>
                </div>
                <span className="text-[10px] font-mono font-medium text-slate-500">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Clean vehicle health utilization grid */}
        <div className="rounded-[32px] bento-glass-enhanced liquid-glass-glow border border-white/20 dark:border-white/10 p-6 backdrop-blur-xl shadow-lg bg-white/20 dark:bg-slate-900/40 space-y-4" style={{ backgroundColor: 'var(--card-background)' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wider uppercase text-slate-400">{t("Fleet System Health Matrix")}</h3>
            <button 
              id="view-all-fleet"
              onClick={() => onNavigate('Fleet')}
              className="text-xs text-indigo-400 font-bold hover:underline"
            >
              {t("Fleet")}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {vehicles.slice(0, 4).map((vehicle, idx) => (
              <div 
                id={`dashboard-vehicle-item-${idx}`}
                key={idx} 
                className="p-3 bg-white/10 dark:bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between h-20"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                    {vehicle.vehicleNumber}
                  </span>
                  <div className="flex items-center gap-1">
                    <Zap className={`h-3 w-3 ${vehicle.batteryFuelLevel > 40 ? 'text-emerald-400' : 'text-amber-500'}`} />
                    <span className="text-[10px] font-mono font-bold text-slate-550 dark:text-slate-450">
                      {vehicle.batteryFuelLevel}%
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs truncate font-bold text-slate-800 dark:text-slate-100">
                    {vehicle.model.split(" ")[0]} {vehicle.model.includes("GMC") ? "Yukon" : "Prime"}
                  </p>
                  <div className="w-full bg-slate-200/50 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${vehicle.healthIndicator > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${vehicle.healthIndicator}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

