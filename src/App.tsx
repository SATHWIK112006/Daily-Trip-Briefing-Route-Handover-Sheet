import React, { useState, useEffect } from 'react';
import { Trip, Vehicle, Driver, SystemNotification, UserRole, TripStatus, TripPriority } from './types';
import Dashboard from './components/Dashboard';
import BriefingGenerator from './components/BriefingGenerator';
import HandoverCenter from './components/HandoverCenter';
import TripManagement from './components/TripManagement';
import DriverPortal from './components/DriverPortal';
import VehicleManager from './components/VehicleManager';
import Analytics from './components/Analytics';
import NotificationsCenter from './components/NotificationsCenter';
import AIAssistant from './components/AIAssistant';
import SignIn from './components/SignIn';
import ManivthaLogo from './components/ManivthaLogo';
import { getTranslation } from './utils/translations';

import { 
  Compass, BookOpen, FileCheck, ClipboardList, Truck, BarChart3, 
  Bell, Sparkles, Sun, Moon, ShieldAlert, X, Printer, Download, Share2, 
  MapPin, Clock, Smartphone, Users, ChevronRight, UserCheck, RefreshCw, LogOut, Palette, Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', locale: 'en-US' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు (Telugu)', locale: 'te-IN' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी (Hindi)', locale: 'hi-IN' },
  { code: 'ur', name: 'Urdu', native: 'اردو (Urdu)', locale: 'ur-PK' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ் (Tamil)', locale: 'ta-IN' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം (Malayalam)', locale: 'ml-IN' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ (Kannada)', locale: 'kn-IN' }
];

const THEME_PRESETS = [
  {
    id: 'emerald',
    name: 'Emerald Cyber',
    desc: 'High-Precision Aviation Green',
    indicator: 'bg-[#10b981]',
    colors: {
      '--color-indigo-50': '#f0fdf4',
      '--color-indigo-100': '#dcfce7',
      '--color-indigo-200': '#bbf7d0',
      '--color-indigo-300': '#86efac',
      '--color-indigo-400': '#4ade80',
      '--color-indigo-500': '#10b981',
      '--color-indigo-505': '#10b981',
      '--color-indigo-550': '#059669',
      '--color-indigo-555': '#059669',
      '--color-indigo-600': '#059669',
      '--color-indigo-650': '#047857',
      '--color-indigo-700': '#047857',
      '--color-indigo-750': '#065f46',
      '--color-indigo-800': '#065f46',
      '--color-indigo-900': '#064e3b',
      '--color-indigo-950': '#022c22'
    }
  },
  {
    id: 'slate',
    name: 'Oceanic Slate',
    desc: 'Professional Airline Telemetry Blue',
    indicator: 'bg-[#0ea5e9]',
    colors: {
      '--color-indigo-50': '#f0f9ff',
      '--color-indigo-100': '#e0f2fe',
      '--color-indigo-200': '#bae6fd',
      '--color-indigo-300': '#7dd3fc',
      '--color-indigo-400': '#38bdf8',
      '--color-indigo-500': '#0ea5e9',
      '--color-indigo-555': '#0284c7',
      '--color-indigo-505': '#0ea5e9',
      '--color-indigo-550': '#0284c7',
      '--color-indigo-600': '#0284c7',
      '--color-indigo-650': '#0369a1',
      '--color-indigo-700': '#0369a1',
      '--color-indigo-750': '#075985',
      '--color-indigo-800': '#075985',
      '--color-indigo-900': '#0c4a6e',
      '--color-indigo-950': '#072a40'
    }
  },
  {
    id: 'amber',
    name: 'Desert HUD',
    desc: 'High-Contrast Nav Desert Amber',
    indicator: 'bg-[#f59e0b]',
    colors: {
      '--color-indigo-50': '#fffbeb',
      '--color-indigo-100': '#fef3c7',
      '--color-indigo-200': '#fde68a',
      '--color-indigo-300': '#fcd34d',
      '--color-indigo-400': '#fbbf24',
      '--color-indigo-500': '#f59e0b',
      '--color-indigo-555': '#f59e0b',
      '--color-indigo-505': '#f59e0b',
      '--color-indigo-550': '#d97706',
      '--color-indigo-600': '#d97706',
      '--color-indigo-650': '#b45309',
      '--color-indigo-700': '#b45309',
      '--color-indigo-750': '#92400e',
      '--color-indigo-800': '#92400e',
      '--color-indigo-900': '#78350f',
      '--color-indigo-950': '#451a03'
    }
  },
  {
    id: 'violet',
    name: 'Quantum Violet',
    desc: 'Nebula Stratosphere Space Purple',
    indicator: 'bg-[#a855f7]',
    colors: {
      '--color-indigo-50': '#faf5ff',
      '--color-indigo-100': '#f3e8ff',
      '--color-indigo-200': '#e9d5ff',
      '--color-indigo-300': '#d8b4fe',
      '--color-indigo-400': '#c084fc',
      '--color-indigo-500': '#a855f7',
      '--color-indigo-555': '#9333ea',
      '--color-indigo-505': '#a855f7',
      '--color-indigo-550': '#9333ea',
      '--color-indigo-600': '#9333ea',
      '--color-indigo-650': '#7c3aed',
      '--color-indigo-700': '#7c3aed',
      '--color-indigo-750': '#6b21a8',
      '--color-indigo-800': '#6b21a8',
      '--color-indigo-900': '#581c87',
      '--color-indigo-950': '#3b0764'
    }
  },
  {
    id: 'cosmic',
    name: 'Cosmic Aurora',
    desc: 'Dynamic Celestial Cyan & Emerald Horizon',
    indicator: 'bg-gradient-to-r from-cyan-400 to-emerald-500',
    colors: {
      '--color-indigo-50': '#ecfeff',
      '--color-indigo-100': '#cffafe',
      '--color-indigo-200': '#a5f3fc',
      '--color-indigo-300': '#67e8f9',
      '--color-indigo-400': '#22d3ee',
      '--color-indigo-500': '#06b6d4',
      '--color-indigo-555': '#0891b2',
      '--color-indigo-550': '#0891b2',
      '--color-indigo-505': '#06b6d4',
      '--color-indigo-600': '#0891b2',
      '--color-indigo-650': '#0369a1',
      '--color-indigo-700': '#0369a1',
      '--color-indigo-750': '#0f172a',
      '--color-indigo-800': '#1e1b4b',
      '--color-indigo-900': '#2e1049',
      '--color-indigo-950': '#090514'
    }
  },
  {
    id: 'nebula',
    name: 'Deep Nebula',
    desc: 'Mystic Starborn Violet & Fuschia Cosmic Nova',
    indicator: 'bg-gradient-to-r from-fuchsia-500 to-indigo-500',
    colors: {
      '--color-indigo-50': '#fdf2f8',
      '--color-indigo-100': '#fce7f3',
      '--color-indigo-200': '#fbcfe8',
      '--color-indigo-300': '#f472b6',
      '--color-indigo-400': '#ec4899',
      '--color-indigo-500': '#d946ef',
      '--color-indigo-555': '#c084fc',
      '--color-indigo-550': '#c084fc',
      '--color-indigo-505': '#d946ef',
      '--color-indigo-600': '#9333ea',
      '--color-indigo-650': '#9333ea',
      '--color-indigo-700': '#a21caf',
      '--color-indigo-750': '#86198f',
      '--color-indigo-800': '#701a75',
      '--color-indigo-900': '#500750',
      '--color-indigo-950': '#2e022e'
    }
  },
  {
    id: 'supernova',
    name: 'Supernova Gold',
    desc: 'Radiant Stellar Gold with Solar Rose Trails',
    indicator: 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500',
    colors: {
      '--color-indigo-50': '#fff7ed',
      '--color-indigo-100': '#ffedd5',
      '--color-indigo-200': '#fed7aa',
      '--color-indigo-300': '#fdbb74',
      '--color-indigo-400': '#fb923c',
      '--color-indigo-500': '#f97316',
      '--color-indigo-555': '#ea580c',
      '--color-indigo-550': '#ea580c',
      '--color-indigo-505': '#f97316',
      '--color-indigo-600': '#ea580c',
      '--color-indigo-650': '#c2410c',
      '--color-indigo-700': '#c2410c',
      '--color-indigo-750': '#9a3412',
      '--color-indigo-800': '#9a3412',
      '--color-indigo-900': '#7c2d12',
      '--color-indigo-950': '#360f08'
    }
  },
  {
    id: 'titanium',
    name: 'Tactical Titanium',
    desc: 'Matte Carbon Stealth Aviation Charcoal',
    indicator: 'bg-gradient-to-r from-slate-400 to-slate-600',
    colors: {
      '--color-indigo-50': '#f8fafc',
      '--color-indigo-100': '#f1f5f9',
      '--color-indigo-200': '#e2e8f0',
      '--color-indigo-300': '#cbd5e1',
      '--color-indigo-400': '#94a3b8',
      '--color-indigo-500': '#64748b',
      '--color-indigo-505': '#64748b',
      '--color-indigo-555': '#475569',
      '--color-indigo-550': '#475569',
      '--color-indigo-600': '#475569',
      '--color-indigo-650': '#334155',
      '--color-indigo-700': '#334155',
      '--color-indigo-750': '#1e293b',
      '--color-indigo-800': '#1e293b',
      '--color-indigo-900': '#0f172a',
      '--color-indigo-950': '#020617'
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    desc: 'Vivid Neon Pink, Purple & Cyber Blue Pulse',
    indicator: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400',
    colors: {
      '--color-indigo-50': '#fdf2f8',
      '--color-indigo-100': '#fce7f3',
      '--color-indigo-200': '#fbcfe8',
      '--color-indigo-300': '#f472b6',
      '--color-indigo-400': '#ec4899',
      '--color-indigo-500': '#ec4899',
      '--color-indigo-505': '#ec4899',
      '--color-indigo-550': '#db2777',
      '--color-indigo-555': '#db2777',
      '--color-indigo-600': '#db2777',
      '--color-indigo-650': '#be185d',
      '--color-indigo-700': '#be185d',
      '--color-indigo-750': '#9d174d',
      '--color-indigo-800': '#9d174d',
      '--color-indigo-900': '#4c0519',
      '--color-indigo-950': '#140005'
    }
  }
];

const PALETTE_BG_CONFIG = {
  emerald: {
    light: {
      start: '#020604',
      via: '#041409',
      end: '#010402',
      accent: '#10b981',
      accentLight: 'rgba(16, 185, 129, 0.15)',
      cardBg: 'rgba(16, 185, 129, 0.05)',
      cardBackground: 'rgba(5, 27, 14, 0.75)',
      cardAccentBackground: 'rgba(2, 16, 8, 0.9)',
      mainText: '#fcfcff',
      mutedText: '#a3a5a8',
      slate950: '#fcfcff',
      slate900: '#f9f9fb',
      slate800: '#f1f2f5',
      slate700: '#e5e7eb',
      slate600: '#cacbcd',
      slate500: '#9fa1a5',
    },
    dark: {
      start: '#f5faf6',
      via: '#daf4e5',
      end: '#f0faf4',
      accent: '#059669',
      accentLight: 'rgba(5, 150, 105, 0.15)',
      cardBg: 'rgba(5, 150, 105, 0.05)',
      cardBackground: 'rgba(215, 246, 229, 0.85)',
      cardAccentBackground: 'rgba(195, 236, 212, 0.9)',
      mainText: '#010a05',
      mutedText: '#555555',
      slate50: '#020604',
      slate100: '#04160a',
      slate200: '#122416',
      slate300: '#1c3022',
      slate400: '#334a3a',
      slate550: '#445d4c',
      slate600: '#55705e',
    }
  },
  slate: {
    light: {
      start: '#010508',
      via: '#03111b',
      end: '#010305',
      accent: '#0ea5e9',
      accentLight: 'rgba(14, 165, 233, 0.15)',
      cardBg: 'rgba(14, 165, 233, 0.05)',
      cardBackground: 'rgba(3, 23, 38, 0.75)',
      cardAccentBackground: 'rgba(1, 10, 18, 0.9)',
      mainText: '#fcfcff',
      mutedText: '#a3a5a8',
      slate950: '#fcfcff',
      slate900: '#f9f9fb',
      slate800: '#f1f2f5',
      slate700: '#e5e7eb',
      slate600: '#cacbcd',
      slate500: '#9fa1a5',
    },
    dark: {
      start: '#f3f8fc',
      via: '#d4ebfc',
      end: '#edf5fe',
      accent: '#0284c7',
      accentLight: 'rgba(2, 132, 199, 0.15)',
      cardBg: 'rgba(2, 132, 199, 0.05)',
      cardBackground: 'rgba(224, 242, 254, 0.85)',
      cardAccentBackground: 'rgba(195, 222, 245, 0.9)',
      mainText: '#01070c',
      mutedText: '#555555',
      slate50: '#010508',
      slate100: '#03111b',
      slate200: '#102230',
      slate300: '#1c3142',
      slate400: '#344c60',
      slate550: '#466072',
      slate600: '#567184',
    }
  },
  amber: {
    light: {
      start: '#050300',
      via: '#120901',
      end: '#030200',
      accent: '#f59e0b',
      accentLight: 'rgba(245, 158, 11, 0.15)',
      cardBg: 'rgba(245, 158, 11, 0.05)',
      cardBackground: 'rgba(26, 15, 2, 0.75)',
      cardAccentBackground: 'rgba(12, 6, 0, 0.9)',
      mainText: '#fcfcff',
      mutedText: '#a3a5a8',
      slate950: '#fcfcff',
      slate900: '#f9f9fb',
      slate800: '#f1f2f5',
      slate700: '#e5e7eb',
      slate600: '#cacbcd',
      slate500: '#9fa1a5',
    },
    dark: {
      start: '#fdfcf0',
      via: '#fbf2d3',
      end: '#fcfcf5',
      accent: '#d97706',
      accentLight: 'rgba(217, 119, 6, 0.15)',
      cardBg: 'rgba(217, 119, 6, 0.05)',
      cardBackground: 'rgba(253, 245, 219, 0.85)',
      cardAccentBackground: 'rgba(250, 235, 208, 0.9)',
      mainText: '#080400',
      mutedText: '#555555',
      slate50: '#050300',
      slate100: '#120901',
      slate200: '#261608',
      slate300: '#392211',
      slate400: '#55371c',
      slate550: '#6d4c26',
      slate600: '#80592e',
    }
  },
  violet: {
    light: {
      start: '#030106',
      via: '#0c041a',
      end: '#020104',
      accent: '#a855f7',
      accentLight: 'rgba(168, 85, 247, 0.15)',
      cardBg: 'rgba(168, 85, 247, 0.05)',
      cardBackground: 'rgba(16, 5, 33, 0.75)',
      cardAccentBackground: 'rgba(6, 1, 13, 0.9)',
      mainText: '#fcfcff',
      mutedText: '#a3a5a8',
      slate950: '#fcfcff',
      slate900: '#f9f9fb',
      slate800: '#f1f2f5',
      slate700: '#e5e7eb',
      slate600: '#cacbcd',
      slate500: '#9fa1a5',
    },
    dark: {
      start: '#faf8ff',
      via: '#f1e4fc',
      end: '#f9f4ff',
      accent: '#9333ea',
      accentLight: 'rgba(147, 51, 234, 0.15)',
      cardBg: 'rgba(147, 51, 234, 0.05)',
      cardBackground: 'rgba(244, 238, 252, 0.85)',
      cardAccentBackground: 'rgba(235, 220, 252, 0.9)',
      mainText: '#06010a',
      mutedText: '#555555',
      slate50: '#030106',
      slate100: '#0c041a',
      slate200: '#1e0c32',
      slate300: '#2f154a',
      slate400: '#48246e',
      slate550: '#5a3487',
      slate600: '#6a4099',
    }
  },
  cosmic: {
    light: {
      start: '#030206',
      via: '#090514',
      end: '#020104',
      accent: '#06b6d4',
      accentLight: 'rgba(6, 182, 212, 0.15)',
      cardBg: 'rgba(6, 182, 212, 0.05)',
      cardBackground: 'rgba(11, 7, 24, 0.75)',
      cardAccentBackground: 'rgba(5, 3, 12, 0.9)',
      mainText: '#fcfcff',
      mutedText: '#a3a5a8',
      slate950: '#fcfcff',
      slate900: '#f9f9fb',
      slate800: '#f1f2f5',
      slate700: '#e5e7eb',
      slate600: '#cacbcd',
      slate500: '#9fa1a5',
    },
    dark: {
      start: '#faf8fe',
      via: '#eef2ff',
      end: '#fafaff',
      accent: '#0891b2',
      accentLight: 'rgba(8, 145, 178, 0.15)',
      cardBg: 'rgba(8, 145, 178, 0.05)',
      cardBackground: 'rgba(238, 242, 255, 0.85)',
      cardAccentBackground: 'rgba(224, 231, 255, 0.9)',
      mainText: '#06020c',
      mutedText: '#555555',
      slate50: '#030206',
      slate100: '#090514',
      slate200: '#18102b',
      slate300: '#261a42',
      slate400: '#3e2a6a',
      slate550: '#52378c',
      slate600: '#6746ad',
    }
  },
  nebula: {
    light: {
      start: '#050106',
      via: '#120216',
      end: '#030004',
      accent: '#d946ef',
      accentLight: 'rgba(217, 70, 239, 0.15)',
      cardBg: 'rgba(217, 70, 239, 0.05)',
      cardBackground: 'rgba(20, 4, 26, 0.75)',
      cardAccentBackground: 'rgba(9, 1, 13, 0.9)',
      mainText: '#fcfcff',
      mutedText: '#a3a5a8',
      slate950: '#fcfcff',
      slate900: '#f9f9fb',
      slate800: '#f1f2f5',
      slate700: '#e5e7eb',
      slate600: '#cacbcd',
      slate500: '#9fa1a5',
    },
    dark: {
      start: '#fdfafd',
      via: '#faeafc',
      end: '#faf5f9',
      accent: '#a21caf',
      accentLight: 'rgba(162, 28, 175, 0.15)',
      cardBg: 'rgba(162, 28, 175, 0.05)',
      cardBackground: 'rgba(253, 242, 253, 0.85)',
      cardAccentBackground: 'rgba(250, 224, 250, 0.9)',
      mainText: '#09010a',
      mutedText: '#555555',
      slate50: '#050106',
      slate100: '#120216',
      slate200: '#2b0a34',
      slate300: '#41134e',
      slate400: '#5a1f6a',
      slate550: '#7a298f',
      slate600: '#9534af',
    }
  },
  supernova: {
    light: {
      start: '#150600',
      via: '#220b00',
      end: '#0b0200',
      accent: '#fb923c',
      accentLight: 'rgba(251, 146, 60, 0.15)',
      cardBg: 'rgba(251, 146, 60, 0.05)',
      cardBackground: 'rgba(35, 11, 2, 0.75)',
      cardAccentBackground: 'rgba(19, 4, 0, 0.9)',
      mainText: '#fcfcff',
      mutedText: '#a3a5a8',
      slate950: '#fcfcff',
      slate900: '#f9f9fb',
      slate800: '#f1f2f5',
      slate700: '#e5e7eb',
      slate600: '#cacbcd',
      slate500: '#9fa1a5',
    },
    dark: {
      start: '#fffbf7',
      via: '#ffeedd',
      end: '#fff9f0',
      accent: '#ea580c',
      accentLight: 'rgba(234, 88, 12, 0.15)',
      cardBg: 'rgba(234, 88, 12, 0.05)',
      cardBackground: 'rgba(254, 243, 199, 0.85)',
      cardAccentBackground: 'rgba(253, 230, 138, 0.9)',
      mainText: '#1c0700',
      mutedText: '#555555',
      slate50: '#150600',
      slate100: '#220b00',
      slate200: '#3e1707',
      slate300: '#5c220a',
      slate400: '#7a2d0e',
      slate550: '#9e3f16',
      slate600: '#be531c',
    }
  },
  titanium: {
    light: {
      start: '#0a0d14',
      via: '#111520',
      end: '#07090e',
      accent: '#64748b',
      accentLight: 'rgba(100, 116, 139, 0.15)',
      cardBg: 'rgba(100, 116, 139, 0.05)',
      cardBackground: 'rgba(22, 28, 45, 0.75)',
      cardAccentBackground: 'rgba(12, 16, 26, 0.9)',
      mainText: '#fcfcff',
      mutedText: '#94a3b8',
      slate950: '#fcfcff',
      slate900: '#f1f5f9',
      slate800: '#e2e8f0',
      slate700: '#cbd5e1',
      slate600: '#94a3b8',
      slate500: '#64748b',
    },
    dark: {
      start: '#fafcfd',
      via: '#e2ebf0',
      end: '#f4f7f9',
      accent: '#475569',
      accentLight: 'rgba(71, 85, 105, 0.15)',
      cardBg: 'rgba(71, 85, 105, 0.05)',
      cardBackground: 'rgba(226, 232, 240, 0.85)',
      cardAccentBackground: 'rgba(203, 213, 225, 0.9)',
      mainText: '#0f172a',
      mutedText: '#475569',
      slate50: '#020617',
      slate100: '#0f172a',
      slate200: '#1e293b',
      slate300: '#334155',
      slate400: '#475569',
      slate550: '#64748b',
      slate600: '#94a3b8',
    }
  },
  cyberpunk: {
    light: {
      start: '#05000a',
      via: '#110022',
      end: '#020005',
      accent: '#ec4899',
      accentLight: 'rgba(236, 72, 153, 0.15)',
      cardBg: 'rgba(236, 72, 153, 0.05)',
      cardBackground: 'rgba(28, 0, 50, 0.75)',
      cardAccentBackground: 'rgba(12, 0, 24, 0.9)',
      mainText: '#fcfcff',
      mutedText: '#f472b6',
      slate950: '#fcfcff',
      slate900: '#fbcfe8',
      slate800: '#cbd5e1',
      slate700: '#94a3b8',
      slate600: '#64748b',
      slate500: '#ec4899',
    },
    dark: {
      start: '#fdfafe',
      via: '#fceafc',
      end: '#faf5fa',
      accent: '#db2777',
      accentLight: 'rgba(219, 39, 119, 0.15)',
      cardBg: 'rgba(219, 39, 119, 0.05)',
      cardBackground: 'rgba(252, 231, 243, 0.85)',
      cardAccentBackground: 'rgba(251, 207, 232, 0.9)',
      mainText: '#4c0519',
      mutedText: '#9d174d',
      slate50: '#140005',
      slate100: '#4c0519',
      slate200: '#9d174d',
      slate300: '#be185d',
      slate400: '#db2777',
      slate550: '#ec4899',
      slate600: '#f472b6',
    }
  }
};

export default function App() {
  // Authentication & Profile states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('tp_authenticated') === 'true';
  });
  const [authenticatedDriverId, setAuthenticatedDriverId] = useState<string | null>(() => {
    return localStorage.getItem('tp_driver_id');
  });
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('tp_username') || 'Guest';
  });

  // Navigation & Role states
  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedRole = localStorage.getItem('tp_role') as UserRole;
    if (savedRole === UserRole.DRIVER) {
      return 'Driver';
    }
    return 'Dashboard';
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('tp_role') as UserRole) || UserRole.ADMIN;
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // DB States
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Overlay States
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Dynamic Visual Theme States
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    return localStorage.getItem('tp_visual_theme') || 'emerald';
  });
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState<boolean>(false);

  // Modern multi-language states supporting Telugu, Hindi, Urdu, Tamil, Malayalam, Kannada
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    return localStorage.getItem('tp_language') || 'en';
  });
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleLangChange = (e: any) => {
      setSelectedLanguage(e.detail);
    };
    window.addEventListener('tp_language_changed', handleLangChange);
    return () => {
      window.removeEventListener('tp_language_changed', handleLangChange);
    };
  }, []);

  const changeLanguage = (code: string) => {
    setSelectedLanguage(code);
    localStorage.setItem('tp_language', code);
    window.dispatchEvent(new CustomEvent('tp_language_changed', { detail: code }));
  };

  // Welcome Splash / Intro Animation Stage
  const [introDuration, setIntroDuration] = useState<number>(20);

  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(introDuration);

  // Auto-fader and dynamic countdown timer for welcome splash screen
  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = 'hidden';
      setTimeLeft(introDuration);
      
      const countdown = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const fader = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem('manivtha_intro_seen', 'true');
      }, introDuration * 1000);

      return () => {
        clearInterval(countdown);
        clearTimeout(fader);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [showIntro, introDuration]);

  const triggerIntro = (seconds: number) => {
    setIntroDuration(seconds);
    setTimeLeft(seconds);
    setShowIntro(true);
  };

  // Password-locked Role-Switching States
  const [pendingRoleSwitch, setPendingRoleSwitch] = useState<UserRole | null>(null);
  const [roleSwitchPassword, setRoleSwitchPassword] = useState<string>('');
  const [roleSwitchError, setRoleSwitchError] = useState<string | null>(null);

  const handleRoleSwitchRequest = (targetRole: UserRole) => {
    if (currentRole === targetRole) return;
    setPendingRoleSwitch(targetRole);
    setRoleSwitchPassword('');
    setRoleSwitchError(null);
  };

  const confirmRoleSwitch = () => {
    if (!pendingRoleSwitch) return;
    const password = roleSwitchPassword.trim().toLowerCase();
    
    if (pendingRoleSwitch === UserRole.ADMIN && password === 'admin') {
      setCurrentRole(UserRole.ADMIN);
      localStorage.setItem('tp_role', UserRole.ADMIN);
      setPendingRoleSwitch(null);
      setRoleSwitchError(null);
      triggerIntro(3); // Play welcome animation for 3 seconds on switching to Admin
    } else if (pendingRoleSwitch === UserRole.OPERATIONS && (password === 'ops' || password === 'admin')) {
      setCurrentRole(UserRole.OPERATIONS);
      localStorage.setItem('tp_role', UserRole.OPERATIONS);
      setPendingRoleSwitch(null);
      setRoleSwitchError(null);
      triggerIntro(3); // Play welcome animation for 3 seconds on switching to Operations controller
    } else {
      setRoleSwitchError("Invalid passcode.");
    }
  };

  // Load Database in real-time
  const loadData = async () => {
    try {
      const [tripsRes, vehiclesRes, driversRes, notifRes] = await Promise.all([
        fetch('/api/trips'),
        fetch('/api/vehicles'),
        fetch('/api/drivers'),
        fetch('/api/notifications')
      ]);

      const [tripsData, vehiclesData, driversData, notifData] = await Promise.all([
        tripsRes.json(),
        vehiclesRes.json(),
        driversRes.json(),
        notifRes.json()
      ]);

      setTrips(tripsData);
      setVehicles(vehiclesData);
      setDrivers(driversData);
      setNotifications(notifData);
    } catch (e) {
      console.error("Telemetry fetch failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll every 8 seconds for new warnings/telemetries
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  // Theme support
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Dynamic visual theme custom property injection
  useEffect(() => {
    const root = window.document.documentElement;
    const selected = THEME_PRESETS.find(t => t.id === activeThemeId) || THEME_PRESETS[0];
    
    // Inject preset base indigo variables
    Object.entries(selected.colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Inject dynamic palette background and text config
    const config = PALETTE_BG_CONFIG[activeThemeId as keyof typeof PALETTE_BG_CONFIG] || PALETTE_BG_CONFIG.emerald;
    const isDark = theme === 'dark';
    const activeConfig = (isDark ? config.dark : config.light) as any;
    
    root.style.setProperty('--bg-gradient-start', activeConfig.start);
    root.style.setProperty('--bg-gradient-via', activeConfig.via);
    root.style.setProperty('--bg-gradient-end', activeConfig.end);
    
    root.style.setProperty('--text-main-color', activeConfig.mainText);
    root.style.setProperty('--text-muted-color', activeConfig.mutedText);
    
    root.style.setProperty('--brand-primary', activeConfig.accent);
    root.style.setProperty('--brand-primary-light', activeConfig.accentLight);
    root.style.setProperty('--brand-card-bg', activeConfig.cardBg);
    root.style.setProperty('--card-background', activeConfig.cardBackground || '#702020');
    root.style.setProperty('--card-accent-background', activeConfig.cardAccentBackground || '#1c0000');

    // Apply Slate design tokens dynamically
    if (isDark) {
      root.style.setProperty('--app-slate-50', activeConfig.slate50 || '#020604');
      root.style.setProperty('--app-slate-100', activeConfig.slate100 || '#04160a');
      root.style.setProperty('--app-slate-200', activeConfig.slate200 || '#122416');
      root.style.setProperty('--app-slate-300', activeConfig.slate100 || '#050505');
      root.style.setProperty('--app-slate-400', activeConfig.slate400 || '#334a3a');
      root.style.setProperty('--app-slate-550', activeConfig.slate550 || '#445d4c');
      root.style.setProperty('--app-slate-600', activeConfig.slate600 || '#55705e');
    } else {
      root.style.setProperty('--app-slate-950', activeConfig.slate950 || '#fcfcff');
      root.style.setProperty('--app-slate-900', activeConfig.slate900 || '#f9f9fb');
      root.style.setProperty('--app-slate-800', activeConfig.slate800 || '#f1f2f5');
      root.style.setProperty('--app-slate-700', activeConfig.slate700 || '#e5e7eb');
      root.style.setProperty('--app-slate-600', activeConfig.slate600 || '#cacbcd');
      root.style.setProperty('--app-slate-500', activeConfig.slate500 || '#9fa1a5');
    }

    localStorage.setItem('tp_visual_theme', activeThemeId);
  }, [activeThemeId, theme]);

  // Operations CRUD
  const handleAddTrip = async (newTripInput: any) => {
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTripInput)
      });
      const created = await res.json();
      setTrips(prev => [created, ...prev]);
      setActiveTab('Trips'); // View the Dispatch board
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTrip = async (updatedTrip: Trip) => {
    try {
      const res = await fetch(`/api/trips/${updatedTrip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTrip)
      });
      const saved = await res.json();
      setTrips(prev => prev.map(t => t.id === saved.id ? saved : t));
      if (selectedTrip && selectedTrip.id === saved.id) {
        setSelectedTrip(saved);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTrip = (id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
    if (selectedTrip && selectedTrip.id === id) {
      setSelectedTrip(null);
    }
  };

  const handleUpdateVehicle = async (updatedVehicle: Vehicle) => {
    try {
      const res = await fetch(`/api/vehicles/${updatedVehicle.vehicleNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedVehicle)
      });
      const saved = await res.json();
      setVehicles(prev => prev.map(v => v.vehicleNumber === saved.vehicleNumber ? saved : v));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles(prev => [...prev, newVehicle]);
  };

  const handleMarkAsRead = async (id?: string) => {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (id) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      } else {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Restricting screens based on role compliance
  const menuItems = [
    { name: 'Dashboard', icon: Compass, roles: [UserRole.ADMIN, UserRole.OPERATIONS] },
    { name: 'Briefing', icon: BookOpen, roles: [UserRole.ADMIN, UserRole.OPERATIONS] },
    { name: 'Handover', icon: FileCheck, roles: [UserRole.ADMIN, UserRole.OPERATIONS] },
    { name: 'Trips', icon: ClipboardList, roles: [UserRole.ADMIN, UserRole.OPERATIONS] },
    { name: 'Fleet', icon: Truck, roles: [UserRole.ADMIN] },
    { name: 'Analytics', icon: BarChart3, roles: [UserRole.ADMIN] },
    { name: 'Driver', icon: Smartphone, roles: [UserRole.ADMIN, UserRole.DRIVER] }
  ];

  const visibleMenuItems = menuItems.filter(item => item.roles.includes(currentRole));

  // Handle successful login
  const handleSignIn = (role: UserRole, driverId: string | null, name: string) => {
    setIsAuthenticated(true);
    setCurrentRole(role);
    setAuthenticatedDriverId(driverId);
    setUserName(name);
    triggerIntro(3); // Play 3 seconds on login
    
    localStorage.setItem('tp_authenticated', 'true');
    localStorage.setItem('tp_role', role);
    if (driverId) {
      localStorage.setItem('tp_driver_id', driverId);
      setActiveTab('Driver');
    } else {
      localStorage.removeItem('tp_driver_id');
      setActiveTab('Dashboard');
    }
    localStorage.setItem('tp_username', name);
  };

  // Handle successful logout
  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentRole(UserRole.ADMIN);
    setAuthenticatedDriverId(null);
    setUserName('Guest');
    setActiveTab('Dashboard');
    triggerIntro(3); // Play 3 seconds on logout

    localStorage.removeItem('tp_authenticated');
    localStorage.removeItem('tp_role');
    localStorage.removeItem('tp_driver_id');
    localStorage.removeItem('tp_username');
  };

  // If role is changed and active tab is no longer allowed, reset to Dashboard/Driver
  useEffect(() => {
    const isAllowed = visibleMenuItems.some(item => item.name === activeTab);
    if (!isAllowed) {
      if (currentRole === UserRole.DRIVER) {
        setActiveTab('Driver');
      } else {
        setActiveTab('Dashboard');
      }
    }
  }, [currentRole]);

  // Unread badge calculation
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div 
      className="min-h-screen transition-all duration-500 font-sans grid-bg pb-24 relative overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-via), var(--bg-gradient-end))',
        color: 'var(--text-main-color)'
      }}
    >
      {!showIntro && (
        <>
          {/* Decorative ambient liquid glass morphing blobs for deep immersive parallax */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
        {/* Blob 1 - Accent dynamic glow in top-left */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[var(--brand-primary)]/20 to-cyan-500/10 blur-[80px] rounded-full animate-liquid-1 opacity-70"
          style={{ mixBlendMode: 'screen' }} 
        />
        {/* Blob 2 - Soft ambient purple glow in bottom-right */}
        <div 
          className="absolute bottom-[10%] right-[-15%] w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-transparent blur-[100px] rounded-full animate-liquid-2 opacity-60"
          style={{ mixBlendMode: 'screen' }}
        />
        {/* Blob 3 - High-tech center emerald pulse orb */}
        <div 
          className="absolute top-[40%] left-[60%] w-[450px] h-[450px] bg-gradient-to-tr from-[var(--brand-primary)]/10 to-emerald-400/5 blur-[90px] rounded-full animate-liquid-3 opacity-60"
          style={{ mixBlendMode: 'screen' }}
        />
        {/* Warm secondary flow layer for soft contrast */}
        <div 
          className="absolute top-[75%] left-[10%] w-[350px] h-[350px] bg-gradient-to-bl from-cyan-400/10 via-indigo-500/5 to-transparent blur-[80px] rounded-full animate-glass-float"
        />
      </div>

      {/* Premium Apple iOS 27 Header blur overlay */}
      <nav className="sticky top-0 z-[60] bg-slate-950/90 dark:bg-black/95 backdrop-blur-3xl border-b border-indigo-500/30 dark:border-indigo-500/50 shadow-[0_4px_30px_rgba(99,102,241,0.2)] relative overflow-visible select-none">
        {/* Background Liquid Glass Effects Container (Restricting overflow of background sheens securely without clipping our child dropdown menus!) */}
        <div className="absolute inset-0 overflow-hidden rounded-none pointer-events-none z-0 liquid-navbar-sheen">
          {/* Real-time glass grid overlay */}
          <div className="glass-grid-pulse-bg" />
          
          {/* Liquid glass light transmission sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent">
            <motion.div 
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-400/[0.06] to-transparent skew-x-12" 
            />
          </div>
        </div>

        {/* Glow lines framing the top and bottom of the navbar */}
        <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent shadow-[0_1px_12px_rgba(34,211,238,0.6)] z-10" />
        <div className="absolute inset-x-0 top-0 h-[1.2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent z-10" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex items-center justify-between relative z-10">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            title="Play Welcome Animation"
            onClick={(e) => {
              e.preventDefault();
              triggerIntro(20); // Logo click plays welcome animation for 20 seconds
            }}
          >
            <ManivthaLogo size="sm" pulse={true} className="animate-pulse" />
            <div>
              <span id="header-brand-title" className="font-sans font-black text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent leading-none block drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                MANIVTHA
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] font-mono font-black text-indigo-400 leading-none block pt-0.5 drop-shadow-[0_0_4px_rgba(99,102,241,0.4)]">
                Tour & Travels
              </span>
            </div>
          </div>

          {/* Quick Roster Selector (Admin, Staff, Driver switcher) */}
          {isAuthenticated && (currentRole === UserRole.ADMIN || currentRole === UserRole.OPERATIONS) && (
            <div className="hidden lg:flex relative bg-slate-950/85 dark:bg-black/90 backdrop-blur-3xl border border-indigo-500/30 dark:border-indigo-500/50 rounded-[18px] p-1 items-center gap-1 shadow-[0_0_20px_rgba(99,102,241,0.2)] h-[42px] overflow-visible select-none">
              {/* Ambient cyber border glow */}
              <div className="absolute -inset-px rounded-[18px] bg-gradient-to-r from-indigo-500/10 via-cyan-500/5 to-violet-500/10 blur-[1px] -z-10 pointer-events-none" />
              
              <span className="text-[10px] font-bold font-mono text-slate-400 dark:text-slate-500 pl-2 pr-1 uppercase relative z-10">ROLE:</span>
              {[UserRole.ADMIN, UserRole.OPERATIONS].map((role) => {
                const isActive = currentRole === role;
                return (
                  <button
                    id={`role-btn-${role.replace(' ', '-')}`}
                    key={role}
                    onClick={() => handleRoleSwitchRequest(role)}
                    className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer overflow-visible group ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeRoleBg"
                        className={`absolute inset-0 bg-gradient-to-r ${
                          role === UserRole.OPERATIONS 
                            ? 'from-rose-600 via-rose-500 to-red-600 shadow-[0_0_12px_rgba(244,63,94,0.4)] border-rose-450/20' 
                            : 'from-indigo-600 via-indigo-500 to-violet-600 shadow-[0_0_12px_rgba(99,102,241,0.4)] border-indigo-400/20'
                        } rounded-xl -z-10 border`}
                        transition={{ type: "spring", stiffness: 380, damping: 25 }}
                      />
                    )}
                    <span className="relative z-10">{role}</span>
                    
                    {/* Futuristic indicator under active role */}
                    {isActive ? (
                      <motion.span 
                        layoutId="activeRoleIndicator"
                        className={`absolute bottom-0.5 w-1.5 h-0.5 rounded-full ${
                          role === UserRole.OPERATIONS ? 'bg-rose-400 shadow-[0_0_6px_#f43f5e]' : 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]'
                        }`}
                        transition={{ type: "spring", stiffness: 380, damping: 25 }}
                      />
                    ) : (
                      <span className="absolute bottom-0.5 w-1 h-0.5 rounded-full bg-transparent group-hover:bg-indigo-400/40 transition-all duration-300" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Global toggles */}
          <div className="flex items-center gap-2">
            
            {/* Mobile / Tablet Role switcher */}
            {isAuthenticated && (currentRole === UserRole.ADMIN || currentRole === UserRole.OPERATIONS) && (
              <div className="lg:hidden flex border border-indigo-500/30 bg-slate-900/45 rounded-xl p-1">
                <select
                  id="role-select-mobile"
                  value={currentRole}
                  onChange={e => handleRoleSwitchRequest(e.target.value as UserRole)}
                  className="bg-transparent text-xs font-bold text-slate-300 focus:outline-none px-2 py-1 select-none font-sans"
                >
                  <option value={UserRole.ADMIN} className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-sans font-bold">Admin</option>
                  <option value={UserRole.OPERATIONS} className="bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-sans font-bold">Ops Staff</option>
                </select>
              </div>
            )}

            {/* Dynamic Cockpit Color Theme Dropdown */}
            <div className="relative">
              <button
                id="cockpit-theme-btn"
                title="Select Cockpit Theme"
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="p-2.5 rounded-xl border border-indigo-500/30 bg-slate-900/45 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all duration-300 cursor-pointer flex items-center gap-1.5 relative group overflow-hidden"
              >
                <Palette className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse hidden md:inline-block relative z-10 shadow-[0_0_8px_#22d3ee]" />
              </button>

              <AnimatePresence>
                {isThemeMenuOpen && (
                  <>
                    {/* Backdrop cover for easy tap-to-close */}
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setIsThemeMenuOpen(false)} 
                    />
                    
                    <motion.div
                      id="cockpit-theme-panel"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-72 z-50 rounded-2xl border p-2.5 overflow-hidden font-sans text-left shadow-2xl bento-glass-enhanced"
                      style={{ 
                        backgroundColor: 'var(--card-accent-background)', 
                        borderColor: 'var(--brand-primary-light)',
                        color: 'var(--text-main-color)' 
                      }}
                    >
                      <div className="px-3 py-2 border-b mb-2" style={{ borderColor: 'var(--brand-primary-light)' }}>
                        <span className="text-[10px] font-bold font-mono tracking-widest uppercase block" style={{ color: 'var(--text-muted-color)' }}>COCKPIT ENVIRONMENT LEVEL</span>
                        <h3 className="text-xs font-extrabold mt-0.5" style={{ color: 'var(--text-main-color)' }}>Select Fleet Palette</h3>
                      </div>
                      
                      <div className="space-y-1">
                        {THEME_PRESETS.map((preset) => {
                          const isSelected = activeThemeId === preset.id;
                          return (
                            <button
                              id={`theme-preset-${preset.id}`}
                              key={preset.id}
                              onClick={() => {
                                setActiveThemeId(preset.id);
                                setIsThemeMenuOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all border ${
                                isSelected 
                                  ? 'bg-white/10 dark:bg-white/15 border-white/20 font-bold' 
                                  : 'hover:bg-white/5 border-transparent'
                              }`}
                              style={{
                                color: isSelected ? 'var(--brand-primary)' : 'var(--text-main-color)'
                              }}
                            >
                              <div className={`h-4 w-4 rounded-full ${preset.indicator} flex items-center justify-center border border-white/20`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold leading-normal">{preset.name}</p>
                                <p className="text-[9px] truncate leading-none pt-0.5" style={{ color: 'var(--text-muted-color)' }}>{preset.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* iOS 27 Global Language selection tool */}
            <div className="relative">
              <button
                id="global-language-menu-btn"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-2.5 rounded-xl border border-indigo-500/30 bg-slate-900/45 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all duration-300 cursor-pointer flex items-center gap-1.5 font-sans"
                title="Select Commander Language"
              >
                <Languages className="h-4 w-4" />
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider hidden sm:inline text-slate-300 group-hover:text-cyan-300">
                  {LANGUAGES.find(l => l.code === selectedLanguage)?.code || 'en'}
                </span>
              </button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsLangMenuOpen(false)} />
                    <motion.div
                      id="global-language-dropdown"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-60 z-50 rounded-2xl border p-2.5 overflow-hidden font-sans text-left shadow-2xl bento-glass-enhanced"
                      style={{ 
                        backgroundColor: 'var(--card-accent-background)', 
                        borderColor: 'var(--brand-primary-light)',
                        color: 'var(--text-main-color)' 
                      }}
                    >
                      <div className="px-3 py-2 border-b mb-2" style={{ borderColor: 'var(--brand-primary-light)' }}>
                        <span className="text-[10px] font-bold font-mono tracking-widest uppercase block" style={{ color: 'var(--text-muted-color)' }}>COMMAND LANGUAGE</span>
                        <h3 className="text-xs font-extrabold mt-0.5" style={{ color: 'var(--text-main-color)' }}>Translate Executive Console</h3>
                      </div>

                      <div className="space-y-1">
                        {LANGUAGES.map((lang) => {
                          const isSelected = selectedLanguage === lang.code;
                          return (
                            <button
                              id={`global-lang-${lang.code}`}
                              key={lang.code}
                              onClick={() => {
                                changeLanguage(lang.code);
                                setIsLangMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all border ${
                                isSelected 
                                  ? 'bg-white/10 dark:bg-white/15 border-white/20 font-bold' 
                                  : 'hover:bg-white/5 border-transparent'
                              }`}
                              style={{
                                color: isSelected ? 'var(--brand-primary)' : 'var(--text-main-color)'
                              }}
                            >
                              <div className="flex flex-col">
                                <span className="text-xs font-bold leading-normal">{lang.native}</span>
                                <span className="text-[8px] leading-none pt-0.5" style={{ color: 'var(--text-muted-color)' }}>{lang.name} - {lang.locale}</span>
                              </div>
                              {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Dark Mode switcher */}
            <button
              id="theme-toggle-btn"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2.5 rounded-xl border border-indigo-500/30 bg-slate-900/45 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all duration-300 cursor-pointer"
            >
              {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Notifications panel toggle with badge */}
            {isAuthenticated && (
              <button
                id="notifications-toggle-btn"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2.5 rounded-xl border border-indigo-500/30 bg-slate-900/45 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all duration-300 cursor-pointer relative group"
              >
                <Bell className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 rounded-full flex items-center justify-center text-[8px] font-extrabold text-white animate-bounce shadow-[0_0_8px_#f43f5e]">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Floating Gemini AI toggle */}
            {isAuthenticated && (
              <button
                id="ai-copilot-toggle-btn"
                onClick={() => setIsAiOpen(!isAiOpen)}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white font-extrabold text-xs flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(99,102,241,0.6)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 font-sans cursor-pointer relative overflow-hidden group"
              >
                {/* Cyber scanner glow sheen */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                <Sparkles className="h-3.5 w-3.5 text-cyan-200 animate-pulse drop-shadow-[0_0_4px_#22d3ee]" />
                <span className="hidden sm:inline font-black tracking-tight uppercase text-[10px]">AI Assistant</span>
              </button>
            )}

            {/* User Profile display & Logout button */}
            {isAuthenticated && (
              <div className="flex items-center gap-3 pl-3 border-l border-indigo-500/30">
                <div className="hidden md:block text-right select-none">
                  <p className="text-xs font-black text-white leading-none truncate max-w-[120px] drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]" title={userName}>{userName}</p>
                  <p className="text-[8px] font-mono font-black text-cyan-400 uppercase tracking-widest leading-none pt-1 drop-shadow-[0_0_3px_rgba(34,211,238,0.3)]">{currentRole === UserRole.DRIVER ? "Pilot" : currentRole}</p>
                </div>
                
                <button
                  id="sign-out-btn"
                  onClick={handleSignOut}
                  title="Sign Out of Command Suite"
                  className="p-2 px-3 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-500 hover:shadow-[0_0_10px_rgba(244,63,94,0.3)] transition-all duration-300 cursor-pointer flex items-center gap-1 text-xs font-bold font-mono tracking-tight uppercase"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline text-[10px] font-black">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main stage with loading and layout structure */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <RefreshCw className="h-8 w-8 text-indigo-505 animate-spin" />
            <span className="text-sm font-semibold text-slate-400">Loading live logistics telemetries...</span>
          </div>
        ) : !isAuthenticated ? (
          <SignIn drivers={drivers} onSignIn={handleSignIn} theme={theme} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            {activeTab === 'Dashboard' && (
              <Dashboard 
                trips={trips} 
                vehicles={vehicles} 
                drivers={drivers} 
                onSelectTrip={(t) => setSelectedTrip(t)} 
                onNavigate={(t) => setActiveTab(t)}
                selectedLanguage={selectedLanguage}
              />
            )}
            
            {activeTab === 'Briefing' && (
              <BriefingGenerator 
                drivers={drivers} 
                vehicles={vehicles} 
                onAddTrip={handleAddTrip}
                selectedLanguage={selectedLanguage}
              />
            )}

            {activeTab === 'Handover' && (
              <HandoverCenter 
                trips={trips} 
                onUpdateTrip={handleUpdateTrip}
                selectedLanguage={selectedLanguage}
              />
            )}

            {activeTab === 'Trips' && (
              <TripManagement 
                trips={trips} 
                onSelectTrip={(t) => setSelectedTrip(t)} 
                onUpdateTrip={handleUpdateTrip}
                onDeleteTrip={handleDeleteTrip}
                selectedLanguage={selectedLanguage}
              />
            )}

            {activeTab === 'Fleet' && (
              <VehicleManager 
                vehicles={vehicles} 
                drivers={drivers} 
                onUpdateVehicle={handleUpdateVehicle}
                onAddVehicle={handleAddVehicle}
                selectedLanguage={selectedLanguage}
              />
            )}

            {activeTab === 'Analytics' && (
              <Analytics 
                trips={trips} 
                drivers={drivers} 
                vehicles={vehicles}
                selectedLanguage={selectedLanguage}
              />
            )}

            {activeTab === 'Driver' && (
              <DriverPortal 
                trips={trips} 
                drivers={drivers} 
                onUpdateTrip={handleUpdateTrip}
                authenticatedDriverId={authenticatedDriverId}
                selectedLanguage={selectedLanguage}
              />
            )}
          </motion.div>
        )}
      </main>

      {/* iOS 27 Liquid Glass Bottom Floating Navigation element */}
      {isAuthenticated && (
        <div className="fixed bottom-4 inset-x-0 z-35 flex justify-center px-4 pointer-events-none select-none">
          <div className="pointer-events-auto relative flex items-center gap-1 bg-slate-950/80 dark:bg-black/85 backdrop-blur-3xl border border-white/10 dark:border-white/10 rounded-[24px] p-1 shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(99,102,241,0.25)] max-w-full overflow-visible flex-nowrap liquid-navbar-sheen">
            {/* Ambient liquid glass micro glints & light sweep */}
            <div className="absolute inset-0 rounded-[24px] overflow-hidden pointer-events-none z-0">
              <motion.div 
                animate={{ x: ['-150%', '150%'] }}
                transition={{ repeat: Infinity, duration: 11, ease: "linear" }}
                className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" 
              />
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-white/20 via-white/5 to-transparent" />
            </div>

            {/* Ambient cyber border glow */}
            <div className="absolute -inset-px rounded-[24px] bg-gradient-to-r from-indigo-500/20 via-cyan-500/10 to-violet-500/20 blur-[2px] -z-10 pointer-events-none" />
            
            {/* Cyberpunk digital framing glow lines */}
            <div className="absolute top-0 inset-x-6 h-[1.2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
            <div className="absolute bottom-0 inset-x-6 h-[1.2px] bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />

            {visibleMenuItems.map((item) => {
              const isActive = activeTab === item.name;
              const Icon = item.icon;
              return (
                <button
                  id={`nav-item-${item.name}`}
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`relative px-3.5 py-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-visible group ${
                    isActive 
                      ? 'text-white' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                  title={getTranslation(item.name, selectedLanguage)}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBg"
                      className="absolute inset-0 bg-gradient-to-b from-cyan-400/25 via-indigo-500/10 to-emerald-400/20 rounded-[14px] -z-10 border border-white/20 shadow-[0_0_15px_rgba(34,211,238,0.4)] backdrop-blur-md"
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    />
                  )}
                  <Icon className={`h-4.5 w-4.5 sm:h-5 sm:w-5 relative z-10 transition-all duration-300 ${
                    isActive 
                      ? 'scale-115 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]' 
                      : 'group-hover:scale-110 group-hover:text-cyan-400'
                  }`} />
                  
                  {/* Futuristic Interactive Micro-LED Indicator under active tab */}
                  {isActive ? (
                    <motion.span 
                      layoutId="activeNavIndicator"
                      className="absolute bottom-1 w-2 h-0.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee,0_0_16px_#22d3ee]"
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    />
                  ) : (
                    <span className="absolute bottom-1 w-1 h-0.5 rounded-full bg-transparent group-hover:bg-cyan-400/50 transition-all duration-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Slide-over Notifications drawer */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsNotificationsOpen(false)} />
            <NotificationsCenter 
              notifications={notifications} 
              onMarkAsRead={handleMarkAsRead} 
              onClose={() => setIsNotificationsOpen(false)} 
              selectedLanguage={selectedLanguage}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Slide-over AI copilot drawer */}
      <AnimatePresence>
        {isAiOpen && (
          <div className="fixed inset-y-0 right-0 z-50 flex h-full">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs -z-10" onClick={() => setIsAiOpen(false)} />
            <div className="w-full sm:max-w-md h-full">
              <AIAssistant onClose={() => setIsAiOpen(false)} theme={theme} />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Frosted Detail overlay modal for standard Trip briefings */}
      <AnimatePresence>
        {selectedTrip && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-[32px] border border-white/20 bg-white/95 dark:bg-slate-900/95 p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6 flex flex-col max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between border-b border-slate-205/50 dark:border-white/5 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">{selectedTrip.id}</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Active Dispatch Report</h3>
                </div>
                <button 
                  id="close-detail-modal"
                  onClick={() => setSelectedTrip(null)}
                  className="p-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Data parameters list */}
              <div className="space-y-6 flex-1 text-sm">
                
                {/* Client profiles */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 rounded-2xl">
                    <p className="text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase">Corporate client</p>
                    <p className="font-bold text-slate-850 dark:text-white pt-1">{selectedTrip.customerName}</p>
                    <p className="text-xs text-slate-500 pt-0.5">{selectedTrip.customerPhone}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 rounded-2xl">
                    <p className="text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase">Planned Schedule</p>
                    <p className="font-bold text-slate-850 dark:text-white pt-1">
                      {new Date(selectedTrip.pickupTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                    <p className="text-xs text-indigo-505 font-semibold pt-0.5">{selectedTrip.priority} Priority Class</p>
                  </div>
                </div>

                {/* Routing targets */}
                <div className="space-y-3 pb-2 border-b border-slate-200/40 dark:border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Junction Pickup Hub:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{selectedTrip.pickupLocation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Destination drop:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{selectedTrip.dropLocation}</span>
                  </div>
                </div>

                {/* Driver Identity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <img src={selectedTrip.driverPhoto} alt={selectedTrip.driverName} className="h-10 w-10 object-cover rounded-xl" />
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Assigned Pilot</p>
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{selectedTrip.driverName}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Fleet Plate</p>
                    <p className="font-bold text-xs text-slate-850 dark:text-slate-200">{selectedTrip.vehicleId}</p>
                    <span className="text-[10px] text-slate-400 block truncate">{selectedTrip.vehicleModel}</span>
                  </div>
                </div>

                {/* Instructions waypoints */}
                <div className="space-y-2.5">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-430 uppercase tracking-widest">Waypoint Route instructions</h4>
                    <div className="p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-sans text-slate-700 dark:text-slate-350">
                      {selectedTrip.routeInstructions}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-430 uppercase tracking-widest">Client Special requirements</h4>
                    <div className="p-3.5 bg-amber-500/5 border border-amber-500/15 rounded-2xl text-xs font-sans text-slate-700 dark:text-slate-350">
                      {selectedTrip.specialRequirements}
                    </div>
                  </div>
                </div>
              </div>

              {/* PDF Print simulation elements */}
              <div className="flex gap-2.5 justify-end pt-3.5 border-t border-slate-200/40 dark:border-white/5">
                <button
                  id="print-modal-btn"
                  onClick={() => window.print()}
                  className="px-4.5 py-2 hover:bg-slate-100 border border-slate-200 dark:border-white/10 text-xs font-bold rounded-xl text-slate-500 flex items-center gap-1 transition-all"
                >
                  <Printer className="h-4 w-4" /> Print Brief Sheet
                </button>
                <button
                  id="save-pdf-modal-btn"
                  onClick={() => window.print()}
                  className="px-4.5 py-2 bg-indigo-650 dark:bg-indigo-500 hover:bg-indigo-705 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-all"
                >
                  <Download className="h-4 w-4" /> Save Dispatch PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </>
      )}

      {/* Dynamic Splash Welcome Screen */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            id="manivtha-splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 ${
              theme === 'dark' 
                ? 'bg-gradient-to-b from-[#f4f7f9] via-[#edf3f6] to-[#e4ebef]' 
                : 'bg-gradient-to-b from-[#020305] via-[#090e18] to-[#040608]'
            }`}
          >
            {/* Ambient background beams */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/15 to-purple-500/10 rounded-full blur-[120px] animate-pulse duration-[6000ms]" />
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff03_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative flex flex-col items-center justify-center text-center max-w-lg z-10 space-y-6">
              {/* Grand logo showcase with entry spring */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.2 }}
                className="relative"
              >
                {/* Glowing liquid glass orb under the logo */}
                <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl scale-125" />
                <ManivthaLogo size="xl" pulse={true} className="text-indigo-500 dark:text-indigo-400" />
              </motion.div>

              {/* Title & subtitle container */}
              <div className="space-y-3">
                <motion.h1
                  id="splash-app-brand-name"
                  initial={{ opacity: 0, letterSpacing: '0.15em', y: 15 }}
                  animate={{ opacity: 1, letterSpacing: '0.05em', y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                  className={`font-sans font-black text-4xl sm:text-5xl uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  MANIVTHA
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.8 }}
                  className="flex items-center justify-center gap-2"
                >
                  <span className={`h-px w-8 ${theme === 'dark' ? 'bg-slate-300' : 'bg-slate-700/50'}`} />
                  <p className={`text-xs uppercase tracking-[0.3em] font-mono font-black leading-none ${
                    theme === 'dark' ? 'text-indigo-600' : 'text-indigo-400'
                  }`}>
                    Tour & Travels
                  </p>
                  <span className={`h-px w-8 ${theme === 'dark' ? 'bg-slate-300' : 'bg-slate-700/50'}`} />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                  className={`text-[11px] font-mono font-medium max-w-sm tracking-wide mx-auto ${
                    theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  COCKPIT INTELLIGENT ROUTE COMMAND SYSTEM
                </motion.p>

                {/* Dynamic Sequential Stage Animation Modules (Plays different types of animations over the 20s intro) */}
                <div id="welcome-sequence-frame" className="relative w-80 h-52 flex items-center justify-center overflow-hidden mx-auto mt-6">
                  <AnimatePresence mode="popLayout">
                    {/* Stage 1: REDOS: GLOBE GEOLOCATION COORDINATES */}
                    {(introDuration - timeLeft) <= introDuration * 0.25 && (
                      <motion.div
                        id="stage-globe-geowire"
                        key="globe-grid"
                        initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 1.25, rotate: 15 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono"
                      >
                        <div className="relative w-36 h-36 flex items-center justify-center bg-slate-950/10 rounded-full border border-white/5 backdrop-blur-sm self-center">
                          {/* Inner globe longitudes */}
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                            className="absolute inset-2 rounded-full border border-dashed border-[var(--brand-primary)]/30"
                          />
                          <motion.div
                            animate={{ rotateY: 360 }}
                            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                            className="absolute inset-0 rounded-full border border-teal-500/15"
                            style={{ transformStyle: 'preserve-3d' }}
                          />
                          {/* Pulsing travel locator pinpoint */}
                          <motion.div
                            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="absolute w-4 h-4 bg-emerald-500/20 border border-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_12px_#10b981]"
                          >
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                          </motion.div>
                          <Compass className="h-8 w-8 text-cyan-400 animate-pulse" />
                        </div>
                        <p className="text-[9px] font-bold text-[var(--brand-primary)] uppercase tracking-[0.25em] mt-3 animate-pulse">DEPLOYING GLOBAL RUNTIME GLOBE</p>
                      </motion.div>
                    )}

                    {/* Stage 2: REDOS: FLUID RISE HORIZON & M-CHROME AURA */}
                    {(introDuration - timeLeft) > introDuration * 0.25 && (introDuration - timeLeft) <= introDuration * 0.55 && (
                      <motion.div
                        id="stage-rise-horizon"
                        key="rise-horizon"
                        initial={{ opacity: 0, y: 25, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -25, scale: 1.1 }}
                        transition={{ duration: 0.55, ease: "easeInOut" }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-3 font-mono"
                      >
                        <div className="relative w-44 h-24 flex items-center justify-center overflow-hidden">
                          {/* Glowing sunrise horizon arc */}
                          <svg viewBox="0 0 100 50" fill="none" className="w-full h-full text-indigo-400">
                            {/* Curved sunrise horizon path */}
                            <motion.path 
                              d="M 5,45 C 20,20 80,20 95,45" 
                              stroke="url(#welcomeHorizonGrad)"
                              strokeWidth="4" 
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                            {/* Aero wing points */}
                            <motion.circle cx="20" cy="30" r="3" fill="#10b981" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                            <motion.circle cx="80" cy="30" r="3" fill="#06b6d4" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.7 }} />
                            
                            <defs>
                              <linearGradient id="welcomeHorizonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="50%" stopColor="#eab308" />
                                <stop offset="100%" stopColor="#06b6d4" />
                              </linearGradient>
                            </defs>
                          </svg>

                          <div className="absolute inset-0 flex items-center justify-center mt-6">
                            <span className="text-[10px] font-extrabold text-amber-400 tracking-wider">ALIGNING EMBOSSED 'M' HORIZON</span>
                          </div>
                        </div>
                        <p className="text-[8px] tracking-[0.3em] text-slate-400 dark:text-slate-500 uppercase font-black">ENGAGING COMPASS NORTH ALIGNMENT</p>
                      </motion.div>
                    )}

                    {/* Stage 3: REDOS: REFRACTIVE GLASS CONTAINER CALIBRATION */}
                    {(introDuration - timeLeft) > introDuration * 0.55 && (introDuration - timeLeft) <= introDuration * 0.8 && (
                      <motion.div
                        id="stage-glass-calibration"
                        key="glass-container"
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.15 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-y-0 inset-x-2 flex flex-col items-center justify-center font-mono"
                      >
                        {/* Refractive Glass cartridge blueprint visualizer */}
                        <div className={`w-full p-4 border rounded-[28px] text-left space-y-1 text-[9px] relative overflow-hidden backdrop-blur-md shadow-2xl flex flex-col justify-center ${
                          theme === 'dark' 
                            ? 'bg-white/80 border-slate-300/60 text-slate-800' 
                            : 'bg-slate-900/40 border-white/10 text-white'
                        }`}>
                          {/* Real-time glass highlights sweep */}
                          <motion.div
                            animate={{ x: [-200, 200] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12"
                          />
                          <div className={`flex items-center justify-between font-bold border-b pb-1 ${
                            theme === 'dark' ? 'text-cyan-700 border-slate-300/40' : 'text-cyan-400 border-white/15'
                          }`}>
                            <span>GLASS REACTION: MATRIX_OK</span>
                            <div className="flex gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping" />
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                          </div>
                          <p className={`truncate text-[8px] pt-1 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>INDEXING: n = 1.52 (High-Refractive Soda-Lime Glass)</p>
                          <p className={`truncate text-[8px] ${theme === 'dark' ? 'text-indigo-650' : 'text-indigo-400'}`}>M_CURVATURE: Dual-Symmetrical Fluid Aerodynamic Feathers</p>
                          <p className={`truncate text-[8px] font-bold ${theme === 'dark' ? 'text-emerald-600' : 'text-emerald-400'}`}>3D CHROME HIGHLIGHTS: COBALT, AMBER, emerald ACTIVE</p>
                        </div>
                      </motion.div>
                    )}

                    {/* Stage 4: REDOS: MANIVTHA ENGINE COMMAND STABILIZED */}
                    {(introDuration - timeLeft) > introDuration * 0.8 && (
                      <motion.div
                        id="stage-engine-coupling"
                        key="manifest-stabilization"
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.55 }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono"
                      >
                        <motion.div 
                          animate={{ scale: [0.98, 1.02, 0.98] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          className={`relative px-6 py-4 rounded-3xl [background:linear-gradient(135deg,rgba(16,185,129,0.1)_0%,rgba(6,182,212,0.1)_100%)] border text-emerald-500 flex flex-col items-center justify-center ${
                            theme === 'dark' ? 'border-emerald-500/40' : 'border-emerald-500/30'
                          }`}
                        >
                          <div className="absolute inset-0 border border-cyan-500/20 rounded-3xl transform rotate-1 scale-105 pointer-events-none" />
                          <div className="absolute inset-0 border border-white/10 rounded-3xl transform -rotate-1 pointer-events-none" />
                          <span className={`${theme === 'dark' ? 'text-cyan-700' : 'text-cyan-300'} text-[10px] uppercase tracking-[0.25em] font-extrabold`}>MANIFEST COMPLETE</span>
                          <span className={`text-[8px] font-bold uppercase tracking-widest pt-1 ${
                            theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
                          }`}>COCKPIT DEPLOYED ON PORTS</span>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Silent custom progressive wave loader */}
              <div className="w-48 h-1 bg-slate-200/50 dark:bg-slate-800/80 rounded-full overflow-hidden relative mx-auto mt-2">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--brand-primary)] to-indigo-500"
                  animate={{ width: `${((introDuration - timeLeft) / introDuration) * 100}%` }}
                  transition={{ ease: "linear", duration: 1 }}
                />
              </div>
            </div>

            {/* iOS System Version Tag bottom center */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.8 }}
              className="absolute bottom-8 text-[9px] font-mono uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500"
            >
              iOS 27 Liquid Glass Environment
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Authorization Modal for Changing Roles */}
      <AnimatePresence>
        {pendingRoleSwitch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Glass Backdrop cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#020305]/70 backdrop-blur-xl"
              onClick={() => setPendingRoleSwitch(null)}
            />

            <motion.div
              id="role-password-verification-modal"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`relative max-w-sm w-full rounded-[32px] border border-slate-200 dark:border-white/10 ${
                theme === 'light' ? 'bg-white/95 text-slate-800' : 'bg-slate-900/90 text-white'
              } p-6 shadow-2xl backdrop-blur-2xl text-center`}
            >
              {/* Lock Header Circle icon */}
              <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 animate-bounce">
                <UserCheck className="h-6 w-6" />
              </div>

              <h3 className="font-sans font-black text-lg tracking-tight">Authorize Switch to {pendingRoleSwitch}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Enter duty officer passcode code to switch your active cockpit command role.
              </p>

              {/* Password credentials helper indicator */}
              <p className="text-[10px] text-indigo-650/80 dark:text-indigo-400/80 font-mono mt-2 uppercase bg-indigo-500/5 py-1 px-2.5 rounded-lg inline-block font-extrabold">
                {pendingRoleSwitch === UserRole.ADMIN ? "Password: 'admin'" : "Password: 'ops' or 'admin'"}
              </p>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  confirmRoleSwitch();
                }}
                className="space-y-4 mt-5"
              >
                <div>
                  <input
                    type="password"
                    id="role-switch-password-input"
                    value={roleSwitchPassword}
                    onChange={(e) => {
                      setRoleSwitchPassword(e.target.value);
                      setRoleSwitchError(null);
                    }}
                    autoFocus
                    placeholder="Enter security passcode"
                    className="w-full text-center bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 font-mono tracking-widest-lg"
                    required
                  />
                </div>

                {roleSwitchError && (
                  <p className="text-[11px] font-bold text-rose-500 leading-none">{roleSwitchError}</p>
                )}

                <div className="grid grid-cols-2 gap-3.5 pt-1">
                  <button
                    id="role-switch-cancel-btn"
                    type="button"
                    onClick={() => setPendingRoleSwitch(null)}
                    className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    id="role-switch-confirm-btn"
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-lg"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
