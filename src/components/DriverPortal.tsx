import React, { useState, useEffect } from 'react';
import { Trip, Driver, TripStatus } from '../types';
import { 
  Compass, MapPin, ClipboardList, Shield, CheckCircle, Navigation, 
  Map, Star, Phone, Check, AlertOctagon, HelpCircle, ChevronRight, RefreshCw, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTranslation } from '../utils/translations';

interface DriverPortalProps {
  trips: Trip[];
  drivers: Driver[];
  onUpdateTrip: (trip: Trip) => void;
  authenticatedDriverId?: string | null;
  selectedLanguage: string;
}

export default function DriverPortal({ trips, drivers, onUpdateTrip, authenticatedDriverId, selectedLanguage }: DriverPortalProps) {
  const t = (key: string) => getTranslation(key, selectedLanguage);

  // Let the user simulate being a specific driver, default to the authenticated one if provided
  const [activeDriverId, setActiveDriverId] = useState(authenticatedDriverId || drivers[0]?.id || 'DR-01');

  useEffect(() => {
    if (authenticatedDriverId) {
      setActiveDriverId(authenticatedDriverId);
    }
  }, [authenticatedDriverId]);

  const activeDriver = drivers.find(d => d.id === activeDriverId) || drivers[0];

  // Filter trips for this active driver which are not cancelled or archived
  const driverTrips = trips.filter(t => t.driverId === activeDriverId && t.status !== TripStatus.CANCELLED);
  
  // Pick active ongoing trip if any, otherwise scheduled
  const activeTrip = driverTrips.find(t => t.status === TripStatus.IN_PROGRESS || t.status === TripStatus.DELAYED) ||
                     driverTrips.find(t => t.status === TripStatus.ASSIGNED || t.status === TripStatus.SCHEDULED) ||
                     driverTrips[0];

  const handleUpdateCheckpoint = (nextStatus: TripStatus) => {
    if (!activeTrip) return;

    // Build checkpoints array with timestamp of completion
    const updatedCheckpoints = activeTrip.checkpoints.map(cp => {
      if (cp.status === nextStatus) {
        return { ...cp, completed: true, timestamp: new Date().toISOString() };
      }
      return cp;
    });

    onUpdateTrip({
      ...activeTrip,
      status: nextStatus,
      checkpoints: updatedCheckpoints,
      lastUpdated: new Date().toISOString()
    });
  };

  const getCheckpointIndex = (status: TripStatus) => {
    switch (status) {
      case TripStatus.SCHEDULED: return 0;
      case TripStatus.ASSIGNED: return 1;
      case TripStatus.IN_PROGRESS: return 2;
      case TripStatus.COMPLETED: return 3;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Simulation Banner - Selecting current Driver */}
      {!authenticatedDriverId ? (
        <div className="p-4 rounded-3xl bento-glass border border-indigo-500/30 bg-indigo-500/10 dark:bg-indigo-950/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-indigo-500 shrink-0" />
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">{t("Fleet")}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("Manage fleet orders, live monitoring tracking system.")}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {drivers.map(d => (
              <button
                id={`simulate-driver-btn-${d.id}`}
                key={d.id}
                onClick={() => setActiveDriverId(d.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer h-[40px] flex items-center ${
                  activeDriverId === d.id 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                    : 'bg-white/20 hover:bg-white/30 border-white/10 text-slate-700 dark:text-slate-355'
                }`}
              >
                {d.name.split(' ')[0]} ({t("Select Assigned Pilot")})
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-left">
              <h4 className="text-[10px] font-bold text-slate-800 dark:text-emerald-400 uppercase tracking-widest font-mono">{t("Safety Checklist")}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Successfully connected to TripPilot telemetry systems as <strong className="font-semibold text-slate-850 dark:text-indigo-300">{activeDriver.name}</strong>.</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-550/15 border border-emerald-500/20 px-2.5 py-1 rounded-xl text-emerald-500 font-mono font-bold">ONLINE</span>
        </div>
      )}

      {/* Driver Identity */}
      <div className="rounded-[32px] border border-white/20 dark:border-white/10 p-6 backdrop-blur-xl bg-white/20 dark:bg-slate-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={activeDriver.avatar} 
              alt={activeDriver.name} 
              className="h-14 w-14 rounded-2xl object-cover border-2 border-indigo-500/20"
            />
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                {activeDriver.name} <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full font-mono text-indigo-500 font-bold">DR-LIC</span>
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-0.5 font-sans">
                <span className="flex items-center gap-0.5"><Star className="h-3.5 w-3.5 fill-amber-500 stroke-none" /> {activeDriver.performanceRating} rating</span>
                <span>•</span>
                <span>{activeDriver.tripsCompleted} missions completed</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100/50 dark:bg-slate-950/20 p-2.5 rounded-2xl border border-white/10">
            <p className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400">Assigned Fleet Cover</p>
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 font-mono tracking-tight font-bold">
              {activeDriver.currentVehicle}
            </span>
          </div>
        </div>
      </div>

      {activeTrip ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Active Navigation and Dispatch Checkpoints */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-[32px] border border-white/20 dark:border-white/10 p-6 md:p-8 backdrop-blur-xl bg-white/20 dark:bg-slate-900/40 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-indigo-500 animate-pulse" />
                  <span className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight">Active Transports: {activeTrip.id}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                  activeTrip.status === TripStatus.DELAYED 
                    ? 'border-rose-400 text-rose-500 bg-rose-50' 
                    : 'border-emerald-400 text-emerald-500 bg-emerald-50'
                }`}>
                  {activeTrip.status}
                </span>
              </div>

              {/* Waypoint details */}
              <div className="space-y-4">
                <div className="relative pl-6 border-l-2 border-dashed border-indigo-500/30">
                  {/* Pickup */}
                  <div className="absolute top-0 -left-1.5 h-3.5 w-3.5 rounded-full bg-indigo-600 border border-white dark:border-slate-850" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 font-bold">Point A: Pickup Coordinates</p>
                  <p className="text-base font-bold text-slate-800 dark:text-white">{activeTrip.pickupLocation}</p>
                </div>

                <div className="relative pl-6">
                  {/* Drop */}
                  <div className="absolute top-0 -left-1.5 h-3.5 w-3.5 rounded-full bg-rose-500 border border-white dark:border-slate-850" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500 font-bold">Point B: Target Destination</p>
                  <p className="text-base font-bold text-slate-800 dark:text-white">{activeTrip.dropLocation}</p>
                </div>
              </div>

              {/* Waypoints Map graphics inside Liquid Glass card */}
              <div className="h-44 rounded-3xl overflow-hidden relative border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-950/20 flex flex-col justify-between p-4 font-mono select-none">
                <div className="absolute inset-0 opacity-15 dark:opacity-5 pointer-events-none bg-cover bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=640&auto=format&fit=crop')]" />
                <div className="flex justify-between items-start z-10">
                  <span className="text-[10px] px-2 py-1 bg-white/45 dark:bg-black/30 rounded-xl">Live GPS Grid Vector: 40.7128° N, 74.0060° W</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-500 flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /> Connection Stable</span>
                </div>
                {/* SVG Mock Road Routing line */}
                <div className="py-2 z-10 w-full flex justify-center">
                  <svg width="240" height="60" viewBox="0 0 240 60" className="opacity-90">
                    <path d="M 10,40 Q 60,10 120,45 T 230,15" fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="10" cy="40" r="6" fill="#10b981" />
                    <circle cx="230" cy="15" r="6" fill="#f43f5e" />
                  </svg>
                </div>
                <div className="z-10 flex text-[10px] justify-between text-slate-500">
                  <span>Est Trip Time: {activeTrip.durationMinutes} minutes</span>
                  <span>Dist: 18.3 miles</span>
                </div>
              </div>

              {/* Waypoint instructions block */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400">Waypoints Instructions</h4>
                <div className="p-4 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/10 text-sm font-sans text-slate-705 dark:text-slate-305">
                  {activeTrip.routeInstructions}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Status advancement checklist */}
          <div className="space-y-6">
            <div className="rounded-[32px] border border-white/20 dark:border-white/10 p-6 backdrop-blur-xl bg-white/20 dark:bg-slate-900/40 space-y-6">
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-indigo-500" /> {t("Fulfill Dispatch Checklist")}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t("A regulatory security checklist is mandatory before approving dispatches.")}
                </p>
              </div>

              {/* Handover notification warn if handover not approved by Admin */}
              {!activeTrip.handoverApproved && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
                  <AlertOctagon className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <p>{t("Check compliance check list or emergency contacts.")}</p>
                </div>
              )}

              {/* Buttons checklist to update statuses */}
              <div className="space-y-3 pt-2">
                {[
                  { status: TripStatus.IN_PROGRESS, label: t("In Progress"), desc: "Start fuel efficiency logs & route mapping." },
                  { status: TripStatus.DELAYED, label: t("Delayed"), desc: "Siren alerts dispatcher of local hazards." },
                  { status: TripStatus.COMPLETED, label: t("Approved"), desc: "Unlock vehicle doors & drop final billing briefing." }
                ].map((item, idx) => {
                  const isActive = activeTrip.status === item.status;
                  const isDone = activeTrip.status === TripStatus.COMPLETED && item.status !== TripStatus.DELAYED;
                  
                  return (
                    <button
                      id={`driver-milestone-btn-${idx}`}
                      key={item.status}
                      disabled={!activeTrip.handoverApproved && item.status !== TripStatus.DELAYED}
                      onClick={() => handleUpdateCheckpoint(item.status)}
                      className={`w-full p-4 border rounded-2xl flex items-start gap-3 text-left transition-all cursor-pointer ${
                        isActive 
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-650 dark:text-indigo-400' 
                          : 'border-slate-200 dark:border-white/5 hover:bg-white/10 bg-transparent'
                      }`}
                    >
                      <div className={`mt-0.5 h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                        isActive 
                          ? 'bg-indigo-600 border-indigo-600 text-white' 
                          : isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-white/20'
                      }`}>
                        {isActive && <Check className="h-3 w-3 stroke-[3px]" />}
                        {isDone && <Check className="h-3 w-3 stroke-[3px] text-white" />}
                      </div>
                      <div className="space-y-0.5 pointer-events-none">
                        <p className={`text-xs font-bold leading-none ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-750 dark:text-slate-350 bg-gradient-to-tr'}`}>
                          {item.label}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Customer Contact drawer */}
              <div className="pt-2 border-t border-slate-200/40 dark:border-white/5 space-y-3 font-sans">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Customer Support:</span>
                  <a href={`tel:${activeTrip.customerPhone}`} className="text-indigo-400 font-bold hover:underline flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {activeTrip.customerPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-12 rounded-[32px] border border-dashed border-slate-300 dark:border-white/10 bento-glass bg-white/20 dark:bg-black/20">
          <ClipboardList className="h-10 w-10 text-indigo-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t("No active dispatches available")}</h3>
          <p className="text-sm text-slate-550 dark:text-slate-400 mt-1">
            You are fully caught up, pilot! No outstanding dispatches are routed to your credentials.
          </p>
        </div>
      )}
    </div>
  );
}
