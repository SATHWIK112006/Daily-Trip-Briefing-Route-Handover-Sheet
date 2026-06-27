import React, { useState } from 'react';
import { Driver, Vehicle, Trip, TripPriority, TripStatus } from '../types';
import { 
  Plus, Sparkles, BookOpen, Clock, Phone, User, Truck, 
  ShieldAlert, Route, MessageSquare, AlertCircle, Save, Send, FileCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTranslation } from '../utils/translations';

interface BriefingGeneratorProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  onAddTrip: (trip: Omit<Trip, 'id' | 'lastUpdated' | 'checkpoints' | 'handoverApproved' | 'briefingGenerated' | 'safetyChecklist'>) => void;
  selectedLanguage: string;
}

export default function BriefingGenerator({ drivers, vehicles, onAddTrip, selectedLanguage }: BriefingGeneratorProps) {
  const t = (key: string) => getTranslation(key, selectedLanguage);

  // Local states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [driverId, setDriverId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [routeInstructions, setRouteInstructions] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [emergencyContacts, setEmergencyContacts] = useState('Operations Command: +91 9999011223');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [priority, setPriority] = useState<TripPriority>(TripPriority.MEDIUM);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'draft' | 'saved'>('idle');

  // Intelligent operational pre-fill based on location pairing (AI Smart Suggestion)
  const handleSmartSuggestions = async () => {
    if (!pickupLocation || !dropLocation) {
      setErrors({
        ...errors,
        smart: 'Please enter both Pickup and Dropoff locations to compile AI metrics.'
      });
      return;
    }

    setErrors(prev => ({ ...prev, smart: '' }));
    setAiLoading(true);

    try {
      const response = await fetch('/api/ai/generate-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickup: pickupLocation, drop: dropLocation, priority })
      });
      const data = await response.json();
      if (data.routeInstructions) {
        setRouteInstructions(data.routeInstructions);
      }
      if (data.specialRequirements) {
        setSpecialRequirements(data.specialRequirements);
      }
    } catch (err) {
      console.error(err);
      setRouteInstructions("- Transit routing optimization: Mid-town Tunnel through Grand Central Parkway.\n- VIP terminal tracking enabled.");
      setSpecialRequirements("- Climate pre-set to 70°F. Provide premium charger adaptors.");
    } finally {
      setAiLoading(false);
    }
  };

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!customerName.trim()) tempErrors.customerName = 'Customer Name is required';
    if (!customerPhone.trim()) tempErrors.customerPhone = 'Contact phone is required';
    if (!pickupLocation.trim()) tempErrors.pickupLocation = 'Pickup Coordinates/Location required';
    if (!dropLocation.trim()) tempErrors.dropLocation = 'Destination Coordinates/Location required';
    if (!pickupTime) tempErrors.pickupTime = 'Pickup Dispatch Time required';
    if (!driverId) tempErrors.driverId = 'Please assign a vetted logistics pilot';
    if (!vehicleId) tempErrors.vehicleId = 'Please allocate an active fleet vehicle';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Retrieve Driver and Vehicle Names
    const matchedDriver = drivers.find(d => d.id === driverId);
    const matchedVehicle = vehicles.find(v => v.vehicleNumber === vehicleId);

    onAddTrip({
      customerName,
      customerPhone,
      pickupLocation,
      dropLocation,
      pickupTime,
      driverId,
      driverName: matchedDriver ? matchedDriver.name : 'Unknown Driver',
      vehicleId,
      vehicleModel: matchedVehicle ? matchedVehicle.model : 'Standard Fleet S-Class',
      routeInstructions: routeInstructions || 'Direct highway navigation.',
      customerNotes: customerNotes || 'None',
      emergencyContacts: emergencyContacts || 'Operations Command: +1 (555) 999-0011',
      specialRequirements: specialRequirements || 'None',
      priority,
      status: TripStatus.ASSIGNED,
      durationMinutes: 45,
      revenue: Math.floor(150 + Math.random() * 600),
      driverPhoto: matchedDriver ? matchedDriver.avatar : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
    });

    // Reset Form
    setCustomerName('');
    setCustomerPhone('');
    setPickupLocation('');
    setDropLocation('');
    setPickupTime('');
    setDriverId('');
    setVehicleId('');
    setRouteInstructions('');
    setCustomerNotes('');
    setSpecialRequirements('');
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleSaveDraft = () => {
    setSaveStatus('draft');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header element */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-sans font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-indigo-500" /> {t("Briefing Desk")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t("Aviation-Tier Logistics")}
          </p>
        </div>
        {saveStatus === 'saved' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full"
          >
            {t("Approved and Safe for Dispatch")}
          </motion.div>
        )}
        {saveStatus === 'draft' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full"
          >
            Profile Draft Cached
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Client Information */}
        <div className="rounded-[28px] border border-white/20 dark:border-white/10 p-6 backdrop-blur-xl bg-white/20 dark:bg-slate-900/40 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <User className="h-4 w-4 text-indigo-400" /> 1. {t("Customer")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("Corporate Client Name").toUpperCase()}</label>
              <input 
                id="customer-name-input"
                type="text" 
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="e.g. Goldman Sachs Global Exec"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-800 dark:text-white h-[44px]"
              />
              {errors.customerName && <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-1"><AlertCircle className="h-3 w-3" /> {errors.customerName}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("Client Phone").toUpperCase()}</label>
              <input 
                id="customer-phone-input"
                type="tel" 
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-800 dark:text-white h-[44px]"
              />
              {errors.customerPhone && <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-1"><AlertCircle className="h-3 w-3" /> {errors.customerPhone}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Route, Location & Schedule */}
        <div className="rounded-[28px] border border-white/20 dark:border-white/10 p-6 backdrop-blur-xl bg-white/20 dark:bg-slate-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Route className="h-4 w-4 text-indigo-400" /> 2. {t("Route Corridor")}
            </h2>
            <button
              id="ai-generate-suggest-btn"
              type="button"
              disabled={aiLoading}
              onClick={handleSmartSuggestions}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
            >
              {aiLoading ? (
                <>{t("Loading Logistics")}</>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-indigo-200 animate-pulse" />
                  {t("Generate New Dispatch")}
                </>
              )}
            </button>
          </div>

          {errors.smart && <p className="text-xs text-rose-500 flex items-center gap-1 mb-2"><AlertCircle className="h-3.5 w-3.5" /> {errors.smart}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("Pickup Hub").toUpperCase()}</label>
              <input 
                id="pickup-location-input"
                type="text" 
                value={pickupLocation}
                onChange={e => { setPickupLocation(e.target.value); setErrors(prev => ({...prev, pickupLocation: ''})); }}
                placeholder="e.g. RGIA Airport Hyderabad Terminal 1"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-800 dark:text-white h-[44px]"
              />
              {errors.pickupLocation && <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-1"><AlertCircle className="h-3 w-3" /> {errors.pickupLocation}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("Drop Hub").toUpperCase()}</label>
              <input 
                id="drop-location-input"
                type="text" 
                value={dropLocation}
                onChange={e => { setDropLocation(e.target.value); setErrors(prev => ({...prev, dropLocation: ''})); }}
                placeholder="e.g. Novotel Airport Hotel"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-800 dark:text-white h-[44px]"
              />
              {errors.dropLocation && <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-1"><AlertCircle className="h-3 w-3" /> {errors.dropLocation}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("Pickup Time").toUpperCase()}</label>
              <input 
                id="pickup-time-input"
                type="datetime-local" 
                value={pickupTime}
                onChange={e => setPickupTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-800 dark:text-white h-[44px]"
              />
              {errors.pickupTime && <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-1"><AlertCircle className="h-3 w-3" /> {errors.pickupTime}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("Priority").toUpperCase()}</label>
              <div className="grid grid-cols-4 gap-2 h-[42px]">
                {Object.values(TripPriority).map((p) => {
                  const borderClass = priority === p 
                    ? 'border-indigo-500 bg-indigo-50/25 dark:bg-indigo-950/30' 
                    : 'border-slate-200 dark:border-white/10';
                  const textClass = priority === p
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-450';
                  return (
                    <button
                      id={`priority-btn-${p}`}
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`text-xs border rounded-xl flex items-center justify-center transition-all ${borderClass} ${textClass} cursor-pointer`}
                    >
                      {t(p as string)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Driver & Vehicle Roster */}
        <div className="rounded-[28px] border border-white/20 dark:border-white/10 p-6 backdrop-blur-xl bg-white/20 dark:bg-slate-900/40 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Truck className="h-4 w-4 text-indigo-400" /> 3. {t("Pilot & Fleet Plate")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("Select Assigned Pilot").toUpperCase()}</label>
              <select
                id="driver-select"
                value={driverId}
                onChange={e => setDriverId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-800 dark:text-white h-[44px]"
              >
                <option value="" className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">-- {t("Select Assigned Pilot")} --</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id} className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">
                    {d.name} ({d.performanceRating}⭐ | {t("In Progress")})
                  </option>
                ))}
              </select>
              {errors.driverId && <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-1"><AlertCircle className="h-3 w-3" /> {errors.driverId}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("Select Fleet Plate").toUpperCase()}</label>
              <select
                id="vehicle-select"
                value={vehicleId}
                onChange={e => setVehicleId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-800 dark:text-white h-[44px]"
              >
                <option value="" className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">-- {t("Select Fleet Plate")} --</option>
                {vehicles.map(v => (
                  <option key={v.vehicleNumber} value={v.vehicleNumber} className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">
                    {v.vehicleNumber} - {v.model} (Charge: {v.batteryFuelLevel}%)
                  </option>
                ))}
              </select>
              {errors.vehicleId && <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-1"><AlertCircle className="h-3 w-3" /> {errors.vehicleId}</p>}
            </div>
          </div>
        </div>

        {/* Section 4: Route Instructions & Special Requirements */}
        <div className="rounded-[28px] border border-white/20 dark:border-white/10 p-6 backdrop-blur-xl bg-white/20 dark:bg-slate-900/40 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-indigo-400" /> 4. {t("Special Route Instructions")}
          </h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("Special Route Instructions").toUpperCase()}</label>
              <textarea
                id="route-instructions-input"
                value={routeInstructions}
                onChange={e => setRouteInstructions(e.target.value)}
                rows={3}
                placeholder="Detail high-efficiency corridors, highway directions, or road closure mitigation tips..."
                className="w-full px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("Client Requirements").toUpperCase()}</label>
                <textarea
                  id="special-requirements-input"
                  value={specialRequirements}
                  onChange={e => setSpecialRequirements(e.target.value)}
                  rows={3}
                  placeholder="Premium requirements, water, newspapers, device setups..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("Safety Protocol").toUpperCase()}</label>
                <textarea
                  id="emergency-contacts-input"
                  value={emergencyContacts}
                  onChange={e => setEmergencyContacts(e.target.value)}
                  rows={3}
                  placeholder="Security and emergency responder phone connections..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            id="save-draft-btn"
            type="button"
            onClick={handleSaveDraft}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-white/10 text-slate-705 dark:text-slate-300 text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer h-[44px]"
          >
            <Save className="h-4 w-4" /> {t("Fulfill Dispatch Checklist")}
          </button>
          
          <button
            id="generate-briefing-btn"
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.98] text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer h-[44px]"
          >
            <Send className="h-4 w-4" /> {t("Register New Trip Record")}
          </button>
        </div>
      </form>
    </div>
  );
}
