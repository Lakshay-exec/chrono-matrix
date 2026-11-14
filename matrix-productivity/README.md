# Chrono Matrix ⏳

> **Minimalist monochrome habit tracking & compounding discipline architecture.**  
> Zero distractions. Zero paywalls. Mathematically compounded consistency.

[![Live Web Application](https://img.shields.io/badge/Live_App-Chrono_Matrix-08080a?style=for-the-badge&logo=vercel&logoColor=white)](https://chrono-matrix-nine.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)](https://www.framer.com/motion/)

---

## 🌐 Live Deployment
Access the production application directly:  
👉 **[https://chrono-matrix-nine.vercel.app/](https://chrono-matrix-nine.vercel.app/)**

Installable on desktop and mobile devices via Progressive Web App (PWA) standards with offline local persistence.

---

## 🏛️ Core Architectural Pillars

### 1. 📅 30-Day Ritual Matrix
* **Daily Execution Grid**: 1-tap ritual completion across an obsidian-monochrome calendar axis.
* **Streak Telemetry**: Real-time tracking of continuous daily habits and active streaks.
* **Category Tagging**: Focus, Fitness, Code, Mind, Habit, and Custom taxonomies.
* **Visual Density**: Optimized high-contrast cell states with specular micro-glows.

### 2. 📈 The 1% Compounding Trajectory
* **Mathematical Foundation**: Visualizes James Clear's atomic compounding theorem:
  $$\text{Compounded Growth} = (1.01)^{365} \approx 37.78\times$$
  $$\text{Degeneration Curve} = (0.99)^{365} \approx 0.03\times$$
* **Dynamic Vector Curve**: Compares actual habit execution trajectory against ideal exponential acceleration and deceleration thresholds.

### 3. ⚖️ Disciplinary Accountability Tribunal
* **2-Day Breach Protocol**: Missing any commitment two days consecutively locks rituals.
* **Contextual Penalties**: Intelligent disciplinary sanctions tailored to the breached habit category (e.g., cold showers, physical conditioning, digital detox).
* **Sanction Service Verification**: Requires completing and marking assigned disciplinary restitutions to unlock routines.
* **Accountability Baseline Reset**: Allows intentional fresh starts while logging accountability history.

### 4. 🌙 Circadian Sleep & Recovery Engine
* **Telemetry Logging**: Track bedtime, wake time, duration, and sleep quality (Deep, Restful, Fragmented, Restless).
* **Midday Nap Support**: Capture power naps and micro-recovery intervals.
* **Wearable Step Calibration**: Direct logging and calibration of daily steps, active minutes, and estimated caloric burn.
* **Visual Benchmarking**: 14-day chronological sleep duration graph with benchmark thresholds.

### 5. 🌌 Deep Space Celestial Atmosphere
* **Realistic Astronomical Starfield**: 150+ procedural stars categorized into astronomical spectral classes (O, A, G, M) with James Webb Space Telescope 4-ray diffraction spikes.
* **Morphing Galactic Realms**: Background shifts smoothly between distinct cosmic nebulae across tabs (Andromeda Matrix, Jade Helix, Circadian Twilight Aurora, Obsidian Quasar).
* **Dual-Spectrum Visibility**:
  * *Dark Space*: Deep obsidian void with luminous stellar cores.
  * *Light Observatory*: Midnight sapphire and charcoal star coordinates readable on light backgrounds.
* **Potato Mode**: High-efficiency toggle for low-power devices, disabling heavy physics for steady 60 FPS performance.

---

## ⌨️ Tactical Navigation Shortcuts

| Key Binding | Function |
| :--- | :--- |
| `1` | Jump to **Ritual Matrix** |
| `2` | Jump to **1% Trajectory Curve** |
| `3` | Jump to **Circadian Sleep** |
| `4` | Jump to **Discipline Tribunal** |
| `→` or `j` | Advance to Next Section |
| `←` or `k` | Return to Previous Section |
| Mouse Wheel at Edge | Fluid Section Transition |
| Mobile Boundary Swipe | Direction-Aware Slide |

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 19, TypeScript
* **Build Tooling**: Vite 8
* **Styling & Design System**: Tailwind CSS, Specular Glassmorphism
* **Motion Physics**: Framer Motion
* **Iconography**: Lucide React
* **Authentication & Cloud Sync**: Firebase Auth, Cloud Firestore
* **AI Discipline Warden**: Google Gemini API (`gemini-2.5-flash`)
* **Storage Protocol**: Local-First IndexedDB / LocalStorage with JSON backup export

---

## 🚀 Local Development Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm** or **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Lakshay-exec/chrono-matrix.git
   cd chrono-matrix/matrix-productivity
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create `.env` using `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your Firebase and Gemini credentials (or run in Offline Guest Mode without keys).

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

5. **Production Build & Verification:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🔒 Privacy & Data Sovereignty
* **Local-First**: Data lives on your device storage by default.
* **Zero Telemetry Leaks**: No trackers, advertisements, or third-party behavioral profiling.
* **Air-Gapped Guest Mode**: Full tracking functionality available without creating an account.
* **1-Click Portability**: Full JSON backup export and restore available under the Offline Hub.

---

## 👤 Author
Developed by **Lakshay** ([@Lakshay-exec](https://github.com/Lakshay-exec))  
*Built for relentless personal discipline and mathematically compounding consistency.*
