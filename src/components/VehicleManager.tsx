import React, { useState } from 'react';
import { Vehicle, Driver } from '../types';
import { 
  Truck, Zap, Fuel, ShieldAlert, CheckCircle, Flame, Plus,
  Wrench, Users, Shield, Compass, Calendar, Search, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTranslation } from '../utils/translations';

interface VehicleManagerProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  onUpdateVehicle: (vehicle: Vehicle) => void;
  onAddVehicle: (vehicle: Vehicle) => void;
  selectedLanguage: string;
}

export default function VehicleManager({ vehicles, drivers, onUpdateVehicle, onAddVehicle, selectedLanguage }: VehicleManagerProps) {
  const t = (key: string) => getTranslation(key, selectedLanguage);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterService, setFilterService] = useState<'All' | 'Good' | 'Due Soon' | 'In Service'>('All');
  
  // Modal State for adding new Vehicle
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNum, setNewNum] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newFuelType, setNewFuelType] = useState<'Electric' | 'Hybrid' | 'Diesel' | 'Petrol'>('Electric');
  
  // Local active edit state
  const [editingNumber, setEditingNumber] = useState<string | null>(null);
  const [editDriver, setEditDriver] = useState('');
  const [editStatus, setEditStatus] = useState<'Good' | 'Due Soon' | 'In Service'>('Good');

  // Filter vehicles
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.driverAssigned.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesService = filterService === 'All' || v.serviceStatus === filterService;
    return matchesSearch && matchesService;
  });

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNum || !newModel) return;

    onAddVehicle({
      vehicleNumber: newNum,
      model: newModel,
      fuelType: newFuelType,
      driverAssigned: 'None (Standby)',
      insuranceStatus: 'Valid',
      serviceStatus: 'Good',
      capacity: 5,
      healthIndicator: 100,
      batteryFuelLevel: 100,
      lastLocation: 'Main Depot Hub'
    });

    setNewNum('');
    setNewModel('');
    setNewFuelType('Electric');
    setShowAddModal(false);
  };

  const handleSaveEdit = (vNum: string) => {
    const original = vehicles.find(v => v.vehicleNumber === vNum);
    if (original) {
      onUpdateVehicle({
        ...original,
        driverAssigned: editDriver,
        serviceStatus: editStatus,
        healthIndicator: editStatus === 'Good' ? 98 : editStatus === 'In Service' ? 70 : 84
      });
    }
    setEditingNumber(null);
  };

  return (
    <div className="space-y-6">
      {/* Page header and add action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-sans font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="h-8 w-8 text-indigo-500" /> {t("Fleet")}
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400 mt-1">
            {t("Manage fleet orders, live monitoring tracking system.")}
          </p>
        </div>

        <button 
          id="add-vehicle-modal-btn"
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-750 text-white text-sm font-semibold flex items-center gap-1.5 self-start md:self-auto transition-transform active:scale-95 shadow-md shadow-indigo-500/20 cursor-pointer h-[44px]"
        >
          <Plus className="h-4.5 w-4.5" /> {t("Select Fleet Plate")}
        </button>
      </div>

      {/* Roster Controls Toolbar */}
      <div className="rounded-3xl bento-glass border border-white/20 dark:border-white/10 p-5 backdrop-blur-xl bg-white/20 dark:bg-slate-900/40 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
          <input 
            id="fleet-search-input"
            type="text" 
            placeholder={`${t("Search")}...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white/40 dark:bg-slate-950/45 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Wrench className="text-slate-400 h-4.5 w-4.5 shrink-0" />
          <select
            id="fleet-service-filter"
            value={filterService}
            onChange={e => setFilterService(e.target.value as any)}
            className="w-full px-3 py-2 rounded-2xl bg-white/40 dark:bg-slate-950/45 border border-slate-200 dark:border-white/10 text-sm focus:outline-none text-slate-700 dark:text-slate-350"
          >
            <option value="All" className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">{t("All STATUS")}</option>
            <option value="Good" className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">{t("Approved")}</option>
            <option value="Due Soon" className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">{t("Delayed")}</option>
            <option value="In Service" className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">{t("In Progress")}</option>
          </select>
        </div>
      </div>

      {/* Grid displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredVehicles.map((vehicle) => {
            const isEditing = editingNumber === vehicle.vehicleNumber;

            // Service status badges
            const serviceColors = {
              'Good': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
              'Due Soon': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
              'In Service': 'text-sky-500 bg-sky-500/10 border-sky-500/20',
            };

            const insuranceColors = {
              'Valid': 'text-emerald-400',
              'Expiring Soon': 'text-amber-400',
              'Expired': 'text-rose-400'
            };

            return (
              <motion.div
                id={`fleet-card-${vehicle.vehicleNumber}`}
                key={vehicle.vehicleNumber}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="rounded-[30px] overflow-hidden bento-glass border border-white/20 dark:border-white/10 p-5 md:p-6 backdrop-blur-xl shadow-lg bg-white/25 dark:bg-slate-900/40 space-y-4"
              >
                {/* Header detail */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold">
                      {vehicle.vehicleNumber}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                      {vehicle.model}
                    </h3>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${serviceColors[vehicle.serviceStatus]}`}>
                    {vehicle.serviceStatus}
                  </span>
                </div>

                {/* Sub row parameters */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  {/* Energy Battery Fuel bar layout */}
                  <div className="p-3 bg-white/20 dark:bg-white/5 rounded-2xl border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold uppercase tracking-wider font-mono">ENERGY SUPPLY</span>
                      {vehicle.fuelType === 'Electric' ? <Zap className="h-3 w-3 text-emerald-400 animate-pulse" /> : <Fuel className="h-3 w-3 text-amber-400" />}
                    </div>
                    <div className="flex items-baseline gap-1 pt-1">
                      <span className="text-2xl font-black text-slate-800 dark:text-white">{vehicle.batteryFuelLevel}%</span>
                      <span className="text-[10px] text-slate-400 font-mono">[{vehicle.fuelType}]</span>
                    </div>
                  </div>

                  {/* Operational Health bar layout */}
                  <div className="p-3 bg-white/20 dark:bg-white/5 rounded-2xl border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold uppercase tracking-wider font-mono">SYSTEM HEALTH</span>
                      <Wrench className="h-3 w-3 text-indigo-400" />
                    </div>
                    <div className="flex items-baseline gap-1 pt-1">
                      <span className="text-2xl font-black text-slate-800 dark:text-white">{vehicle.healthIndicator}%</span>
                      <span className="text-[10px] text-slate-400 font-mono">Status</span>
                    </div>
                  </div>
                </div>

                {/* Location row */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-white/10 dark:bg-white/5 p-2 rounded-xl">
                  <Compass className="h-4 w-4 text-indigo-400" />
                  <span className="truncate">{vehicle.lastLocation}</span>
                </div>

                {/* Pilot details block */}
                <div className="pt-2 border-t border-slate-200/40 dark:border-white/5 space-y-3.5">
                  {!isEditing ? (
                    <div className="flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold tracking-wider uppercase font-mono text-slate-400">Assigned Pilot</p>
                        <p className="font-bold text-slate-700 dark:text-slate-205">{vehicle.driverAssigned}</p>
                      </div>
                      <button 
                        id={`edit-vehicle-btn-${vehicle.vehicleNumber}`}
                        onClick={() => {
                          setEditingNumber(vehicle.vehicleNumber);
                          setEditDriver(vehicle.driverAssigned);
                          setEditStatus(vehicle.serviceStatus);
                        }}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-white/10 text-[11px] font-bold text-slate-650 dark:text-slate-300"
                      >
                        Adjust Roster
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs bg-slate-100/50 dark:bg-slate-950/20 p-3.5 rounded-2xl border border-indigo-500/20">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-400 font-mono">Assign Fleet Pilot</label>
                        <select
                          id={`edit-pilot-select-${vehicle.vehicleNumber}`}
                          value={editDriver}
                          onChange={e => setEditDriver(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm font-semibold select-none text-zinc-900 dark:text-zinc-105"
                        >
                          <option value="None (Standby)" className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">None (Standby Reserves)</option>
                          {drivers.map(d => (
                            <option key={d.id} value={d.name} className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-400 font-mono">Service Status</label>
                        <select
                          id={`edit-servicestatus-select-${vehicle.vehicleNumber}`}
                          value={editStatus}
                          onChange={e => setEditStatus(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm font-semibold select-none text-zinc-900 dark:text-zinc-105"
                        >
                          <option value="Good" className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">Good Status</option>
                          <option value="Due Soon" className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">Due Soon / Service Alert</option>
                          <option value="In Service" className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">Active Fleet Service Depot</option>
                        </select>
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          id={`cancel-edit-${vehicle.vehicleNumber}`}
                          onClick={() => setEditingNumber(null)}
                          className="px-3 py-1 bg-transparent hover:bg-white/10 text-slate-400 text-xs font-semibold rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          id={`save-edit-${vehicle.vehicleNumber}`}
                          onClick={() => handleSaveEdit(vehicle.vehicleNumber)}
                          className="px-3 py-1 bg-indigo-600 dark:bg-indigo-505 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Insurance review row */}
                  <div className="flex justify-between items-center text-[10px] font-mono font-medium text-slate-400 border-t border-slate-150 dark:border-white/5 pt-3">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Digital Indemnity</span>
                    <span className={`font-semibold ${insuranceColors[vehicle.insuranceStatus]}`}>{vehicle.insuranceStatus}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Provision new Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-[32px] border border-white/20 bg-white/95 dark:bg-slate-900/95 p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="h-5 w-5 text-indigo-500" /> Provision Roster vehicle
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Fill in plate registries and models to connect new fleet units.</p>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-450 dark:text-slate-300">REGISTRATION GRID PLATE</label>
                <input 
                  id="provision-num-input"
                  type="text" 
                  value={newNum}
                  onChange={e => setNewNum(e.target.value)}
                  placeholder="e.g. VP-EV-608"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white bg-transparent"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-450 dark:text-slate-300">VEHICLE BRAND MODEL</label>
                <input 
                  id="provision-model-input"
                  type="text" 
                  value={newModel}
                  onChange={e => setNewModel(e.target.value)}
                  placeholder="e.g. Porsche Taycan 4S"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white bg-transparent"
                  required
                />
              </div>

              <div className="space-y-1 text-slate-900 dark:text-white">
                <label className="text-xs font-semibold text-slate-400 dark:text-slate-300">ENGINE CLASSIFICATION</label>
                <select 
                  id="provision-fuel-type"
                  value={newFuelType} 
                  onChange={e => setNewFuelType(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-zinc-900 dark:text-zinc-105 select-none text-sm font-semibold"
                >
                  <option value="Electric" className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">Zero-Emission Electric (EV)</option>
                  <option value="Hybrid" className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">High-Performance Hybrid</option>
                  <option value="Diesel" className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">Clean Diesel (Cargo)</option>
                  <option value="Petrol" className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">Premium Petrol (SUV)</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  id="provision-cancel-btn"
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-white/10 text-xs font-bold rounded-xl hover:bg-slate-100 text-slate-500"
                >
                  Close Panel
                </button>
                <button 
                  id="provision-submit-btn"
                  type="submit" 
                  className="px-4 py-2 bg-indigo-650 dark:bg-indigo-500 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
                >
                  Connect Active Unit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
