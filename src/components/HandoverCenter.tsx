import React, { useState } from 'react';
import { Trip, TripStatus, TripSafetyChecklist } from '../types';
import { 
  FileCheck, ShieldAlert, Sparkles, Printer, Download, Share2, 
  CheckCircle, Landmark, Shield, CheckCheck, Phone, Check, AlertOctagon 
} from 'lucide-react';
import { motion } from 'motion/react';
import { getTranslation } from '../utils/translations';

interface HandoverCenterProps {
  trips: Trip[];
  onUpdateTrip: (trip: Trip) => void;
  selectedLanguage: string;
}

export default function HandoverCenter({ trips, onUpdateTrip, selectedLanguage }: HandoverCenterProps) {
  const t = (key: string) => getTranslation(key, selectedLanguage);

  // Find trips waiting for handover or active
  const pendingTrips = trips.filter(t => t.status !== TripStatus.COMPLETED && t.status !== TripStatus.CANCELLED);
  const [selectedTripId, setSelectedTripId] = useState(pendingTrips[0]?.id || '');

  const trip = trips.find(t => t.id === selectedTripId) || pendingTrips[0];

  const handleChecklistChange = (field: keyof TripSafetyChecklist) => {
    if (!trip) return;
    const updatedChecklist = {
      ...trip.safetyChecklist,
      [field]: !trip.safetyChecklist[field]
    };
    onUpdateTrip({
      ...trip,
      safetyChecklist: updatedChecklist
    });
  };

  const handleApproveHandover = () => {
    if (!trip) return;
    onUpdateTrip({
      ...trip,
      handoverApproved: true,
      status: TripStatus.ASSIGNED // ensure it is Assigned/Ready
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (!trip) return;
    const text = encodeURIComponent(`*TripPilot Pro - Dispatch Handover Approved*\nTrip: ${trip.id}\nClient: ${trip.customerName}\nPickup: ${trip.pickupLocation}\nDrop: ${trip.dropLocation}\nDriver: ${trip.driverName}\nInstructions: ${trip.routeInstructions}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (!trip) {
    return (
      <div className="text-center p-12 rounded-[32px] border border-dashed border-slate-300 dark:border-white/10 bento-glass">
        <AlertOctagon className="h-10 w-10 text-indigo-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t("Handover Setup")}</h3>
        <p className="text-sm text-slate-550 dark:text-slate-400 mt-1">{t("Aviation-Tier Logistics")}</p>
      </div>
    );
  }

  // Calculate checklists done
  const checklistOk = Object.values(trip.safetyChecklist).every(val => val === true);
  const itemsDoneCount = Object.values(trip.safetyChecklist).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header element */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-sans font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="h-8 w-8 text-indigo-500" /> {t("Handover Setup")}
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400 mt-1">
            {t("Operational handovers authorize driver keys and route maps.")}
          </p>
        </div>

        {/* Dropdown to pick trip */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold font-mono text-slate-400 uppercase">{t("In Progress")}:</label>
          <select 
            id="handover-trip-select"
            value={selectedTripId}
            onChange={e => setSelectedTripId(e.target.value)}
            className="px-4 py-2 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 font-sans text-sm font-semibold text-slate-800 dark:text-white"
          >
            {pendingTrips.map(p => (
              <option key={p.id} value={p.id} className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">{p.id} - {p.customerName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Driver, Vehicle & Client Sheet */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[32px] border border-white/20 dark:border-white/10 p-6 md:p-8 backdrop-blur-xl bg-white/20 dark:bg-slate-900/40 space-y-6">
            
            {/* Handover state badge */}
            <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-white/5 pb-4">
              <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">
                {t("Approved and Safe for Dispatch")}: {trip.id}
              </span>
              <div className="flex items-center gap-2">
                {trip.handoverApproved ? (
                  <span className="px-3.5 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCheck className="h-3.5 w-3.5" /> {t("Approved")}
                  </span>
                ) : (
                  <span className="px-3.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5 animate-pulse" /> {t("Handover Setup")}
                  </span>
                )}
              </div>
            </div>

            {/* Profiles detail rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Driver Details Card */}
              <div className="p-4 rounded-3xl bg-white/30 dark:bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={trip.driverPhoto} 
                    alt={trip.driverName} 
                    className="h-16 w-16 object-cover rounded-2xl border border-white/20"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-white">{trip.driverName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t("Select Assigned Pilot")}</p>
                    <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold mt-1">ID: {trip.driverId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs border-t border-slate-200/40 dark:border-white/5">
                  <div>
                    <p className="text-[10px] uppercase font-mono text-slate-400">{t("Client Phone")}</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">{(pendingTrips.find(t=>t.driverId===trip.driverId) as any)?.customerPhone || "+91 98765 43210"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-mono text-slate-400">License Code</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">IN-AP-2026-DL</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Allocated Card */}
              <div className="p-4 rounded-3xl bg-white/30 dark:bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/20 flex flex-col items-center justify-center">
                    <Landmark className="h-8 w-8 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-white">{trip.vehicleModel}</h3>
                    <p className="text-xs text-slate-550 dark:text-slate-450">{t("Select Fleet Plate")}</p>
                    <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1">Plate: {trip.vehicleId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs border-t border-slate-200/40 dark:border-white/5">
                  <div>
                    <p className="text-[10px] uppercase font-mono text-slate-400">Engine Type</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">Battery Electric (EV)</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-mono text-slate-400">Charge Level</p>
                    <p className="font-semibold text-slate-750 dark:text-slate-350">Electric (92%)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Clients Route Sheet details */}
            <div className="space-y-4 pt-1">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t("Route Corridor")}</h4>
                <div className="p-4 rounded-2xl bg-white/20 dark:bg-white/5 border border-white/10 space-y-2 text-sm font-medium">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{t("Pickup Time")}:</span>
                    <span className="text-slate-850 dark:text-slate-100 font-sans font-bold">
                      {new Date(trip.pickupTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{t("Pickup Hub")}:</span>
                    <span className="text-slate-850 dark:text-slate-100">{trip.pickupLocation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{t("Drop Hub")}:</span>
                    <span className="text-slate-850 dark:text-slate-100">{trip.dropLocation}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t("Special Route Instructions")}</h4>
                <div className="p-4 rounded-2xl bg-indigo-50/20 dark:bg-slate-950/20 border border-slate-200/50 dark:border-white/5 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                  {trip.routeInstructions}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-bold text-amber-600 dark:text-amber-400">{t("Client Requirements")}</h4>
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 text-sm text-slate-700 dark:text-slate-300">
                  {trip.specialRequirements}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Safety checklists & Authorization drawer */}
        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/20 dark:border-white/10 p-6 backdrop-blur-xl bg-white/20 dark:bg-slate-900/40 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-500" /> {t("Fulfill Dispatch Checklist")}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("A regulatory security checklist is mandatory before approving dispatches.")} ({itemsDoneCount}/5 {t("Passed")})
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { field: 'insuranceVerified', label: t('Verify Driver ID & License Codes'), desc: t('Confirm valid commercial operator credentials.') },
                { field: 'licenseChecked', label: t('Inspect Digital Fleet Cover'), desc: t('Verify vehicle insurance is currently valid on server registry.') },
                { field: 'vehicleInspectionDone', label: t('Conduct Walkaround Scan'), desc: t('Pilot visual inspection of fluids, tires, and exterior panels.') },
                { field: 'routeReviewed', label: t('Confirm Active Route Waypoints'), desc: t('Driver confirms target pathing and exit numbers in-app.') },
                { field: 'emergencyContactsVerified', label: t('Verify Emergency Gate Contacts'), desc: t('Validate active phone linkages for incident mitigation.') }
              ].map((item, idx) => {
                const checked = trip.safetyChecklist[item.field as keyof TripSafetyChecklist];
                return (
                  <div 
                    id={`handover-checklist-item-${idx}`}
                    key={item.field} 
                    onClick={() => handleChecklistChange(item.field as keyof TripSafetyChecklist)}
                    className={`p-3.5 border rounded-2xl flex items-start gap-3 cursor-pointer transition-all ${
                      checked 
                        ? 'border-indigo-500/40 bg-indigo-50/15 dark:bg-indigo-950/20' 
                        : 'border-slate-200 dark:border-white/5 bg-transparent'
                    }`}
                  >
                    <div className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center transition-all ${
                      checked ? 'bg-indigo-600 dark:bg-indigo-500 border-indigo-600' : 'border-slate-300 dark:border-white/25'
                    }`}>
                      {checked && <Check className="h-3 w-3 text-white stroke-[3px]" />}
                    </div>
                    <div className="space-y-0.5 pointer-events-none">
                      <p className={`text-xs font-bold leading-none ${checked ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-650 dark:text-slate-300'}`}>
                        {item.label}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Handover authorize button */}
            <div className="pt-2 border-t border-slate-200/40 dark:border-white/5 space-y-3">
              <button
                id="handover-approve-btn"
                onClick={handleApproveHandover}
                disabled={!checklistOk || trip.handoverApproved}
                className="w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 text-white cursor-pointer h-[44px]"
              >
                {trip.handoverApproved ? (
                  <>
                    <CheckCheck className="h-4 w-4" /> {t("Approved")}
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" /> {t("Fulfill Dispatch Checklist")}
                  </>
                )}
              </button>
              
              {!checklistOk && !trip.handoverApproved && (
                <p className="text-[10px] text-rose-500 font-medium text-center flex items-center justify-center gap-1">
                  <AlertOctagon className="h-3 w-3" /> {t("All 5 safety items must be audited to release dispatch.")}
                </p>
              )}
            </div>
          </div>

          {/* Electronic Handover Distribution Channels (Actions) */}
          <div className="rounded-[32px] border border-white/20 dark:border-white/10 p-5 mt-4 backdrop-blur-xl bg-white/20 dark:bg-slate-900/40 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-bold">{t("Distribution Channels")}</h4>
            <div className="grid grid-cols-3 gap-2">
              <button 
                id="handover-print-btn"
                onClick={handlePrint}
                className="p-3 border border-slate-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-slate-650 dark:text-slate-300 hover:bg-white/10 transition-all text-xs font-semibold cursor-pointer"
              >
                <Printer className="h-4 w-4 text-indigo-400" /> {t("Print Brief")}
              </button>
              <button 
                id="handover-download-btn"
                onClick={handlePrint}
                className="p-3 border border-slate-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-slate-650 dark:text-slate-300 hover:bg-white/10 transition-all text-xs font-semibold cursor-pointer"
              >
                <Download className="h-4 w-4 text-indigo-400" /> {t("Save PDF")}
              </button>
              <button 
                id="handover-share-btn"
                onClick={handleShareWhatsApp}
                className="p-3 border border-slate-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-slate-650 dark:text-slate-300 hover:bg-white/10 transition-all text-xs font-semibold cursor-pointer"
              >
                <Share2 className="h-4 w-4 text-indigo-400" /> WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
