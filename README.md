# 🚀 Daily Trip Briefing & Route Handover Sheet (TripPilot Pro)

An enterprise-grade fleet logistics cockpit and tour management system engineered for **MANIVTHA Tour & Travels**. This application incorporates high-fidelity real-time telemetry, role-based workflows (Admin, Operations, and Driver), multi-language support, and Gemini AI-powered route briefings.

---

## 🌟 Key Features

### 📊 Real-Time Operations Cockpit
*   **Live Dashboard:** Comprehensive summary metrics (active trips, vehicle utilization, active drivers, safety compliance rates).
*   **Interactive Analytics:** Visual telemetry tracking with dynamic charts illustrating trip compliance, fuel/battery trends, and revenue metrics.
*   **System Alerts & Notifications:** High-priority safety alerts, vehicle breakdown notifications, and route deviation logs.

### 🧠 Gemini AI Assistant & Briefing Generator
*   **AI Briefing Engine:** Automatically generates detailed route briefings, weather updates, and hazard warnings using Google Gemini.
*   **Interactive AI Copilot:** Natural language interface for querying fleet telemetry, generating operational reports, or modifying trip states.
*   **Multi-Language Localization:** Direct translation of safety briefings and route instructions into **English, Telugu, Hindi, Urdu, Tamil, Malayalam, and Kannada**.

### 🔐 Multi-Role Workspaces
*   **Dispatch/Admin Console:** Fleet management, driver assignments, vehicle allocation, and analytics.
*   **Operations Controller:** Real-time route tracking, check-ins, and safety compliance verification.
*   **Driver Portal:** Minimalist, mobile-friendly interface for safety check-ins, route instruction reviews, emergency contact access, and active checkpoint updates.

### 🛡️ Digital Handover & Safety compliance
*   **Handover Center:** Digital verification checklist covering vehicle inspection, route review, insurance checks, license validation, and emergency preparedness.
*   **Aviation-Tier Auditing:** Real-time compliance verification before keys and route maps are handed over to drivers.

### 🎨 Premium User Experience
*   **Liquid Glass UI/UX:** Stunning visual aesthetics powered by modern glassmorphism, responsive bento grids, and fluid visual animations.
*   **Custom Theme Engine:** 9 presets including *Emerald Cyber, Oceanic Slate, Desert HUD, Quantum Violet, Cosmic Aurora, Cyberpunk Neon, and Tactical Titanium*.
*   **Fully Responsive:** Seamlessly scales from administrative monitors down to mobile devices for drivers in the field.

---

## 🛠️ Technology Stack

*   **Frontend Framework:** React 19, TypeScript
*   **Build Tooling & Server:** Vite 6, Express (Node.js)
*   **Styling & UI Components:** Tailwind CSS (v4.0), Motion (Framer Motion), Lucide React (Icons)
*   **Generative AI Integration:** `@google/genai` (Google Gemini SDK)

---

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
*   NPM (v9.0.0 or higher)

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/SATHWIK112006/Daily-Trip-Briefing-Route-Handover-Sheet.git
    cd Daily-Trip-Briefing-Route-Handover-Sheet
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` (or `.env`) file in the root directory and add your Google Gemini API key:
    ```env
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```
    *Note: `.env.local` is ignored by Git to secure your secrets.*

4.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    This starts the Express server which serves the client assets and coordinates the local APIs. Open `http://localhost:3000` (or the console-printed URL) in your browser.

---

## 📦 Build & Production Deployment

### Local Build
Generate the optimized production bundles for the React application and bundle the Express server:
```bash
npm run build
```

### Production Start
Launch the bundled production server:
```bash
npm run start
```

---

## 📂 Project Structure

```
├── assets/                  # Public assets & icons
├── src/
│   ├── components/          # Reusable UI modules & dashboard tabs
│   │   ├── AIAssistant.tsx        # Conversational Gemini Copilot
│   │   ├── Analytics.tsx          # Real-time charts & efficiency telemetry
│   │   ├── BriefingGenerator.tsx  # Route briefings generator
│   │   ├── Dashboard.tsx          # Overview KPI gauges & active trips map
│   │   ├── DriverPortal.tsx       # Driver check-ins interface
│   │   ├── HandoverCenter.tsx     # Digital verification checklist
│   │   └── VehicleManager.tsx     # Fleet maintenance & telemetry tracking
│   ├── utils/
│   │   └── translations.ts        # Localization dictionaries (7 languages)
│   ├── App.tsx              # Main Shell and routing coordinator
│   ├── index.css            # Base Tailwind v4 configuration & animation styles
│   └── types.ts             # TypeScript definitions for fleets/trips/roles
├── server.ts                # Express backend and Gemini proxy API
├── package.json             # Build configuration and project dependencies
└── tsconfig.json            # TypeScript build parameters
```

---

## 🛡️ License

This project is private and proprietary. All rights reserved.
