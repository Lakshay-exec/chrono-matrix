# Chrono Matrix — The Monochrome Productivity Standard

A luxury, minimalist productivity journal and habit scheduler built with an obsidian monochrome palette, editorial typography, and disciplined accountability.

---

## ✨ Features

- **Monthly Matrix Scheduler**:
  - Horizontal calendar axis (Day 1 to $N$) with unlimited customizable rituals and tasks.
  - Interactive status toggles, continuous streak counters, and celebratory confetti upon full daily completion.
  - Highlights the current day with a distinct monochrome vertical marker.

- **Accountability Tribunal (AI Disciplinary Warden)**:
  - Automatically flags any task uncompleted for 2 consecutive days.
  - Consults the **Google Gemini API** (`gemini-2.5-flash`) to generate sharp, witty, and contextual disciplinary penalties based on the specific broken habit.
  - Built-in resilient offline engine that generates penalties even when offline without an API key.

- **Sleep Analytics Engine**:
  - Log daily bedtime, wake time, duration, and subjective quality (Deep, Restful, Fragmented, Restless).
  - Dynamic 14-day SVG sleep duration graph with an optimal 8.0-hour benchmark threshold line.
  - Calculates average sleep duration, quality percentage index, and logging consistency.

- **Editorial Quote Banner**:
  - Curated stoic and focus quotes rendered in *Apple Garamond* and *Blacksword* signature script.
  - Toggle on/off or pin your own custom life mantra.

- **Live Completion Meters (Top Right)**:
  - **Today's Completion %**: Real-time ratio of tasks finished today.
  - **Monthly Completion %**: Cumulative monthly consistency score.
  - **Streak Counter**: Consecutive active discipline days.

- **⚡ Potato Mode (Eco / Low-Spec Switch)**:
  - High-performance toggle in the top bar that disables interactive mouse aura glow, particle effects, and heavy transitions for 60fps performance on low-spec hardware.

- **Authentication & Temp-Mail Shield**:
  - Google Sign-In and Email authentication backed by Firebase.
  - Real-time **Temp-Mail Intelligence Shield** that blocks and warns against disposable email services (150+ known burner domains and heuristic pattern detection).
  - Guest / Offline mode to use locally without ever creating an account.

- **Offline-First & Standalone Software Hub**:
  - All data is persisted directly inside client storage (LocalStorage / IndexedDB).
  - Dedicated download modal with 1-click **JSON Backup Export** and **Restore**.
  - Installable as an offline Desktop application (PWA).

---

## 🎨 Typography & Design

- **Signature Script**: *Blacksword*
- **Editorial Headings & Quotes**: *Apple Garamond* / *Garamond*
- **Interface & Metrics**: *Helvetica*
- **Color Scheme**: Deep obsidian black (`#070709`), subtle slate borders, and crisp high-contrast white.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your Firebase credentials and Gemini API Key are set.

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 📦 Pushing to GitHub

When you're ready to upload to GitHub:
```bash
git init
git add .
git commit -m "feat: initial commit of Chrono Matrix luxury productivity app"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```
*(Your `.env` file is protected by `.gitignore` and will never be committed).*
