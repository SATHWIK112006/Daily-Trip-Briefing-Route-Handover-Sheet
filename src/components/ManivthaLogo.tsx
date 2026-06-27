import React from 'react';

interface ManivthaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  pulse?: boolean;
}

export default function ManivthaLogo({ className = '', size = 'md', pulse = false }: ManivthaLogoProps) {
  // Ultra-precise size mappings to maintain absolute elite design dominance in any section
  const sizeClasses = {
    sm: 'h-14 w-14 md:h-16 md:w-16',
    md: 'h-24 w-24 md:h-28 md:w-28',
    lg: 'h-36 w-36 md:h-40 md:w-40',
    xl: 'h-48 w-48 md:h-56 md:w-56',
  };

  return (
    <div className={`relative flex items-center justify-center group ${sizeClasses[size]} ${className}`}>
      
      {/* 1. Behind-The-Glass Ambient Liquid Aura Glow */}
      <div 
        className={`absolute inset-0 rounded-[35%] bg-gradient-to-tr from-emerald-500/30 via-teal-500/20 to-indigo-500/25 blur-2xl transition-all duration-1000 group-hover:duration-500 group-hover:scale-130 group-hover:opacity-100 ${
          pulse ? 'animate-pulse scale-110 opacity-90' : 'opacity-70'
        }`} 
      />

      {/* 2. Frosted Translucent Rounded Glass Container (A physical rounded-squircle 3D cartridge) */}
      <div 
        className="absolute inset-0 rounded-[30%] border border-white/25 dark:border-white/10 [background:linear-gradient(135deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.03)_100%)] dark:[background:linear-gradient(135deg,rgba(15,23,42,0.3)_0%,rgba(15,23,42,0.1)_100%)] backdrop-blur-[20px] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12),_inset_0_2px_4px_rgba(255,255,255,0.25),_inset_0_-2px_6px_rgba(0,0,0,0.15)] transition-all duration-500 group-hover:scale-[1.04] group-hover:border-white/35 dark:group-hover:border-white/20 group-hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.28)]" 
      />

      {/* 3. Outer Glass Chamfer Highlight Rim */}
      <div className="absolute inset-[1px] rounded-[30%] border border-white/10 dark:border-white/5 bg-transparent pointer-events-none" />

      {/* 4. High-Definition 3D Vector Monogram Master SVG */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 transition-transform duration-500 group-hover:scale-[1.05]"
      >
        <defs>
          {/* Glass Specular highlights */}
          <linearGradient id="glassReflectionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.5)" />
            <stop offset="25%" stopColor="rgba(255, 255, 255, 0.12)" />
            <stop offset="75%" stopColor="rgba(0, 0, 0, 0.04)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.08)" />
          </linearGradient>

          {/* Symmetrical Left Wing Metallic Chrome (Indigo-Teal-Emerald) */}
          <linearGradient id="leftWingChrome" x1="15%" y1="20%" x2="50%" y2="85%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          {/* Symmetrical Right Wing Metallic Chrome (Teal-Indigo-Emerald) */}
          <linearGradient id="rightWingChrome" x1="85%" y1="20%" x2="50%" y2="85%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>

          {/* Golden Dawn Horizon Sunrise Arc */}
          <linearGradient id="horizonSunrise" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
            <stop offset="30%" stopColor="#84cc16" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="70%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.15" />
          </linearGradient>

          {/* Beveled Compass Needle Light Facet (Emerald Sparkle) */}
          <linearGradient id="needleLt" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Beveled Compass Needle Shadow Facet (Ocean Dusk) */}
          <linearGradient id="needleDk" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>

          {/* Vector 3D Drop Shadow */}
          <filter id="logoShad" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4.5" stdDeviation="3.0" floodColor="#020617" floodOpacity="0.32" />
          </filter>

          {/* Liquid Light Bloom filter */}
          <filter id="neonReflect" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ==========================================
           A. Stylized 3D Globoid Wireframe Grid
           ========================================== */}
        <g opacity="0.48" className="transition-opacity duration-500 group-hover:opacity-75">
          {/* Tilted Orbit Coordinate System (Rotated to emphasize travel dynamics) */}
          <g transform="rotate(-12 50 50)">
            {/* Elegant Outer Equatorial Ring */}
            <circle 
              cx="50" 
              cy="50" 
              r="34" 
              stroke="currentColor" 
              strokeWidth="0.85" 
              strokeDasharray="4 2" 
              className="text-slate-400 dark:text-slate-500"
            />
            {/* Concentric high-tech travel corridor */}
            <circle 
              cx="50" 
              cy="50" 
              r="26" 
              stroke="currentColor" 
              strokeWidth="0.5" 
              strokeDasharray="1 3" 
              className="text-slate-400 dark:text-slate-500 opacity-60"
            />

            {/* Meridians (Longitudes) */}
            <ellipse 
              cx="50" 
              cy="50" 
              rx="13" 
              ry="34" 
              stroke="currentColor" 
              strokeWidth="0.75" 
              className="text-slate-350 dark:text-slate-500"
            />
            <ellipse 
              cx="50" 
              cy="50" 
              rx="25" 
              ry="34" 
              stroke="currentColor" 
              strokeWidth="0.75" 
              className="text-slate-350 dark:text-slate-500 opacity-70"
            />

            {/* Latitudes (Parallels of Travel flight paths) */}
            <ellipse 
              cx="50" 
              cy="50" 
              rx="34" 
              ry="11" 
              stroke="currentColor" 
              strokeWidth="0.75" 
              className="text-slate-350 dark:text-slate-500"
            />
            <ellipse 
              cx="50" 
              cy="50" 
              rx="34" 
              ry="22" 
              stroke="currentColor" 
              strokeWidth="0.75" 
              className="text-slate-350 dark:text-slate-500 opacity-60"
            />
          </g>
        </g>

        {/* ==========================================
           B. Golden Sunrise Rising Horizon Arc
           ========================================== */}
        <g filter="url(#neonReflect)">
          <path 
            d="M 16,62 C 28,71 72,71 84,62" 
            stroke="url(#horizonSunrise)" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
          />
        </g>

        {/* ==========================================
           C. Dynamic, Fluid 'M' + Compass System
           ========================================== */}
        <g filter="url(#logoShad)" className="transition-transform duration-500 group-hover:translate-y-[-1px]">
          
          {/* Fluid 'M' Left Wing Curve: flows elegantly up and drops into center base */}
          <path 
            d="M 23,60 C 19,40 33,31 43,35 C 47,37 48,43 49,48 C 49.3,50 49.6,52 50,53.5" 
            stroke="url(#leftWingChrome)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Fluid 'M' Right Wing Curve: symmetrical fluid feather */}
          <path 
            d="M 77,60 C 81,40 67,31 57,35 C 53,37 52,43 51,48 C 50.7,50 50.4,52 50,53.5" 
            stroke="url(#rightWingChrome)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Central Compass Needle & Horizon Rising Spear (The Heart of 'M') 
              3D Faceted with Light and Shadow halves for realistic pop */}
          <g filter="url(#neonReflect)">
            {/* Compass Left Prong - Light Face */}
            <path 
              d="M 50,17 L 50,52.5 L 45.8,47 L 45.8,43 Z" 
              fill="url(#needleLt)" 
            />
            {/* Compass Right Prong - Shadow Face */}
            <path 
              d="M 50,17 L 55,43 L 54.2,47 L 50,52.5 Z" 
              fill="url(#needleDk)" 
            />
          </g>

          {/* Connecting fluid bridge loops representing stable aviation curves */}
          <path
            d="M 43,35 C 45,35 47.5,41.5 50,47 C 52.5,41.5 55,35 57,35"
            stroke="url(#horizonSunrise)"
            strokeWidth="3.4"
            strokeLinecap="round"
            opacity="0.9"
          />
        </g>

        {/* ==========================================
           D. Navigation GPS Anchor Pin Points & Waypoints
           ========================================== */}
        {/* Glow point on the North Star tip representing ultimate traveler direction */}
        <circle 
          cx="50" 
          cy="16.5" 
          r="4.5" 
          stroke="url(#horizonSunrise)" 
          strokeWidth="1.25"
          filter="url(#neonReflect)"
          className="animate-pulse"
        />
        <circle cx="50" cy="16.5" r="1.8" fill="#ffffff" />

        {/* Lateral Travel Beacon waypoint dots */}
        <circle cx="28" cy="46" r="1.6" fill="#10b981" filter="url(#neonReflect)" />
        <circle cx="72" cy="46" r="1.6" fill="#06b6d4" filter="url(#neonReflect)" />

        {/* ==========================================
           E. Realistic Pro Glass Specular Highlights
           ========================================== */}
        {/* Top crescent highlight for realistic glossy glass bubble depth */}
        <path 
          d="M 12,24 C 12,13 27,9 50,9 C 73,9 88,13 88,24 C 78,14.5 52,12.5 12,24 Z" 
          fill="url(#glassReflectionGrad)" 
          className="opacity-95 pointer-events-none transition-transform duration-500 group-hover:translate-y-[0.5px]"
        />

        {/* Bottom soft prism lighting rim overlay */}
        <path 
          d="M 14,75 C 26,85 74,85 86,75 C 77,81 50,83 14,75 Z" 
          fill="rgba(255, 255, 255, 0.2)" 
          className="opacity-70 pointer-events-none"
        />
      </svg>

      {/* 5. Fluid Glare Beam transition sweep across the glass face */}
      <span className="absolute inset-0 rounded-[30%] bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-20" />
    </div>
  );
}
