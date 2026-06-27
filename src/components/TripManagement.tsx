import React, { useState } from 'react';
import { Trip, TripStatus, TripPriority } from '../types';
import { 
  Search, ArrowUpDown, Filter, ChevronLeft, ChevronRight, Eye, Trash2, 
  CheckCircle, Ban, AlertCircle, RefreshCw, MoreVertical, Layers, CheckCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTranslation } from '../utils/translations';

interface TripManagementProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onUpdateTrip: (trip: Trip) => void;
  onDeleteTrip: (id: string) => void;
  selectedLanguage: string;
}

export default function TripManagement({ trips, onSelectTrip, onUpdateTrip, onDeleteTrip, selectedLanguage }: TripManagementProps) {
  const t = (key: string) => getTranslation(key, selectedLanguage);

  // Filters, sorting, search, pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('pickupTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Sorting handlers
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Toggle Bulk Select All
  const handleToggleAll = () => {
    if (selectedIds.length === filteredTrips.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTrips.map(t => t.id));
    }
  };

  // Toggle Single Row Selection
  const handleToggleRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Filter trips
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.dropLocation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || trip.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || trip.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort trips
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    let rawA = a[sortBy as keyof Trip];
    let rawB = b[sortBy as keyof Trip];

    if (sortBy === 'pickupTime') {
      rawA = new Date(a.pickupTime).getTime();
      rawB = new Date(b.pickupTime).getTime();
    }

    if (typeof rawA === 'string' && typeof rawB === 'string') {
      return sortOrder === 'asc' 
        ? rawA.localeCompare(rawB) 
        : rawB.localeCompare(rawA);
    }

    if (typeof rawA === 'number' && typeof rawB === 'number') {
      return sortOrder === 'asc' ? rawA - rawB : rawB - rawA;
    }

    return 0;
  });

  // Paginated List
  const totalPages = Math.ceil(sortedTrips.length / itemsPerPage) || 1;
  const paginatedTrips = sortedTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Bulk Complete action
  const handleBulkComplete = () => {
    selectedIds.forEach(id => {
      const match = trips.find(t => t.id === id);
      if (match) {
        onUpdateTrip({ ...match, status: TripStatus.COMPLETED });
      }
    });
    setSelectedIds([]);
  };

  // Bulk Cancel action
  const handleBulkCancel = () => {
    selectedIds.forEach(id => {
      const match = trips.find(t => t.id === id);
      if (match) {
        onUpdateTrip({ ...match, status: TripStatus.CANCELLED });
      }
    });
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Header and counter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-sans font-semibold tracking-tight text-slate-900 dark:text-white">
            {t("Trips")}
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400 mt-1">
            {t("Manage fleet orders, live monitoring tracking system.")}
          </p>
        </div>
      </div>

      {/* Interactive Toolbar Filter */}
      <div className="rounded-3xl bento-glass border border-white/20 dark:border-white/10 p-5 backdrop-blur-xl bg-white/20 dark:bg-slate-900/40 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search box input */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
            <input 
              id="trip-search-input"
              type="text" 
              placeholder={`${t("Search")}...`}
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white/40 dark:bg-slate-950/45 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
            />
          </div>

          {/* Status filtering dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="text-slate-400 h-4 w-4 shrink-0" />
            <select
              id="trip-status-filter"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 rounded-2xl bg-white/40 dark:bg-slate-950/45 border border-slate-200 dark:border-white/10 text-sm focus:outline-none text-slate-700 dark:text-slate-350"
            >
              <option value="All" className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">{t("All STATUS")}</option>
              {Object.values(TripStatus).map(s => (
                <option key={s} value={s} className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">{s}</option>
              ))}
            </select>
          </div>

          {/* Priority filtering dropdown */}
          <div className="flex items-center gap-2">
            <Layers className="text-slate-400 h-4 w-4 shrink-0" />
            <select
              id="trip-priority-filter"
              value={priorityFilter}
              onChange={e => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 rounded-2xl bg-white/40 dark:bg-slate-950/45 border border-slate-200 dark:border-white/10 text-sm focus:outline-none text-slate-700 dark:text-slate-350"
            >
              <option value="All" className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">{t("All Priority")}</option>
              {Object.values(TripPriority).map(p => (
                <option key={p} value={p} className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Bulk Actions Drawer */}
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 dark:bg-indigo-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <CheckCheck className="h-4.5 w-4.5" />
              <span>{selectedIds.length} {t("Selected")}</span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button 
                id="bulk-complete-btn"
                onClick={handleBulkComplete}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-all"
              >
                <CheckCircle className="h-3.5 w-3.5" /> {t("Mark Completed")}
              </button>
              <button 
                id="bulk-cancel-btn"
                onClick={handleBulkCancel}
                className="px-3 py-1.5 rounded-xl bg-rose-600 dark:bg-rose-500 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Ban className="h-3.5 w-3.5" /> {t("Cancel Selected")}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Advanced Liquid Glass Datatable */}
      <div className="rounded-[32px] border border-white/20 dark:border-white/10 overflow-hidden backdrop-blur-xl bg-white/20 dark:bg-slate-900/40 shadow-xl">
        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/50 dark:border-white/5 bg-slate-100/50 dark:bg-slate-950/25 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider select-none">
                <th className="py-4 px-5 w-12 text-center">
                  <input 
                    id="checkbox-all"
                    type="checkbox" 
                    checked={selectedIds.length === filteredTrips.length && filteredTrips.length > 0} 
                    onChange={handleToggleAll}
                    className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-650 cursor-pointer h-4 w-4"
                  />
                </th>
                <th onClick={() => handleSort('id')} className="py-4 px-4 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-950/30">
                  <span className="flex items-center gap-1.5">{t("Trip ID")} <ArrowUpDown className="h-3.5 w-3.5 opacity-60" /></span>
                </th>
                <th onClick={() => handleSort('customerName')} className="py-4 px-4 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-950/30">
                  <span className="flex items-center gap-1.5">{t("Corporate Client")} <ArrowUpDown className="h-3.5 w-3.5 opacity-60" /></span>
                </th>
                <th onClick={() => handleSort('driverName')} className="py-4 px-4 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-950/30">
                  <span className="flex items-center gap-1.5">{t("Select Assigned Pilot")} <ArrowUpDown className="h-3.5 w-3.5 opacity-60" /></span>
                </th>
                <th className="py-4 px-4">{t("Select Fleet Plate")}</th>
                <th className="py-4 px-4">{t("Route Corridor")}</th>
                <th onClick={() => handleSort('status')} className="py-4 px-4 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-950/30">
                  <span className="flex items-center gap-1.5">{t("Status")} <ArrowUpDown className="h-3.5 w-3.5 opacity-60" /></span>
                </th>
                <th onClick={() => handleSort('priority')} className="py-4 px-4 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-950/30 text-center">
                  <span className="flex items-center justify-center gap-1.5">{t("Priority")} <ArrowUpDown className="h-3.5 w-3.5 opacity-60" /></span>
                </th>
                <th className="py-4 px-5 text-right">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/30 dark:divide-white/5">
              <AnimatePresence>
                {paginatedTrips.map((trip) => {
                  const isChecked = selectedIds.includes(trip.id);
                  
                  // Priority Styling Mapping
                  const priorityColors = {
                    [TripPriority.LOW]: "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-350",
                    [TripPriority.MEDIUM]: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
                    [TripPriority.HIGH]: "bg-amber-50 dark:bg-amber-955/30 text-amber-600 dark:text-amber-400",
                    [TripPriority.CRITICAL]: "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400",
                  };

                  // Status badge colors
                  const statusColors = {
                    [TripStatus.SCHEDULED]: "border-slate-300/50 text-slate-500 bg-slate-500/5",
                    [TripStatus.ASSIGNED]: "border-pink-300/50 text-pink-500 bg-pink-500/5",
                    [TripStatus.IN_PROGRESS]: "border-sky-300/50 text-sky-500 bg-sky-500/5",
                    [TripStatus.DELAYED]: "border-rose-300/50 text-rose-500 bg-rose-500/5",
                    [TripStatus.COMPLETED]: "border-emerald-300/50 text-emerald-500 bg-emerald-500/5",
                    [TripStatus.CANCELLED]: "border-red-300/50 text-red-500 bg-red-400/5",
                  };

                  return (
                    <motion.tr
                      id={`datatable-row-${trip.id}`}
                      key={trip.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`hover:bg-white/30 dark:hover:bg-white/5 transition-all outline-none font-sans ${
                        isChecked ? 'bg-indigo-50/15 dark:bg-indigo-950/10' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4.5 px-5 text-center">
                        <input 
                          id={`checkbox-trip-${trip.id}`}
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={() => handleToggleRow(trip.id)}
                          className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-650 cursor-pointer h-4 w-4"
                        />
                      </td>

                      {/* ID */}
                      <td className="py-4.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-100 text-xs">
                        {trip.id}
                      </td>

                      {/* Client */}
                      <td className="py-4.5 px-4">
                        <div className="font-semibold text-sm text-slate-900 dark:text-white truncate max-w-44">
                          {trip.customerName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {trip.customerPhone}
                        </div>
                      </td>

                      {/* Pilot */}
                      <td className="py-4.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={trip.driverPhoto} 
                            alt={trip.driverName} 
                            className="h-7 w-7 rounded-lg object-cover" 
                          />
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{trip.driverName}</span>
                        </div>
                      </td>

                      {/* Vehicle */}
                      <td className="py-4.5 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {trip.vehicleId}
                        <span className="text-[10px] uppercase text-slate-400 block font-sans truncate max-w-28">{trip.vehicleModel}</span>
                      </td>

                      {/* Waypoint Locations */}
                      <td className="py-4.5 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <div className="truncate max-w-44 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                          {trip.pickupLocation.split(",")[0]}
                        </div>
                        <div className="truncate max-w-44 flex items-center gap-1 mt-1 font-normal text-slate-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                          {trip.dropLocation.split(",")[0]}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4.5 px-4 text-xs">
                        <span className={`px-2.5 py-1 text-[10px] font-bold border rounded-full uppercase tracking-wider border-solid ${statusColors[trip.status]}`}>
                          {trip.status}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-4.5 px-4 text-center">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase font-mono tracking-wider ${priorityColors[trip.priority]}`}>
                          {trip.priority}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4.5 px-5 text-right flex items-center justify-end gap-1.5 pt-6">
                        <button
                          id={`action-view-${trip.id}`}
                          onClick={() => onSelectTrip(trip)}
                          className="p-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-indigo-500/10 hover:text-indigo-600 text-slate-500 dark:text-slate-400 transition-all cursor-pointer"
                          title={t("Print Brief")}
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </button>
                        <button
                          id={`action-delete-${trip.id}`}
                          onClick={() => onDeleteTrip(trip.id)}
                          className="p-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-rose-500/15 hover:text-rose-550 text-slate-500 dark:text-slate-400 transition-all cursor-pointer"
                          title={t("Cancel Selected")}
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              
              {filteredTrips.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-sm font-medium">
                    {t("No active dispatches available")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Bar */}
        <div className="p-4 bg-slate-100/50 dark:bg-slate-950/25 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between font-sans">
          <span className="text-xs text-slate-500 font-semibold">
            {t("In Progress")} - {currentPage} / {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              id="pagination-prev"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 text-slate-650 dark:text-slate-300 disabled:opacity-30 border border-slate-200 dark:border-white/10 rounded-xl"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  id={`pagination-page-${i}`}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-7 w-7 text-xs font-bold rounded-lg ${
                    currentPage === i + 1 
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white' 
                      : 'text-slate-400 hover:text-indigo-400'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              id="pagination-next"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 text-slate-650 dark:text-slate-300 disabled:opacity-30 border border-slate-200 dark:border-white/10 rounded-xl"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
