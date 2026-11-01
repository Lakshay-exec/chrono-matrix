import { useState, useEffect, useMemo, useRef } from 'react';
import type { 
  Task, 
  SleepRecord, 
  PunishmentRecord, 
  QuoteItem, 
  DailyJournalEntry, 
  ThemeMode 
} from './types';
import {
  getLocalTasks, saveLocalTasks, getLocalSleep, saveLocalSleep,
  getLocalPunishments, saveLocalPunishments, getQuoteSettings, saveQuoteSettings,
  getPotatoMode, savePotatoMode, getLocalJournal, saveLocalJournal,
  getLocalTheme, saveLocalTheme, calculateStats, syncToCloud, fetchFromCloud,
} from './services/storage';
import { auth, onAuthStateChanged, logoutUser, type User } from './services/firebase';

import { LandingHero } from './components/LandingHero';
import { AuthGate } from './components/AuthGate';
import { Navbar } from './components/Navbar';
import { MouseAura } from './components/MouseAura';
import { DailyQuoteBanner } from './components/DailyQuoteBanner';
import { DailyReflectionBar } from './components/DailyReflectionBar';
import { MonthlyScheduler } from './components/MonthlyScheduler';
import { ProductivityCurve } from './components/ProductivityCurve';
import { SleepTracker } from './components/SleepTracker';
import { PunishmentsWidget } from './components/PunishmentsWidget';
import { PunishmentModal } from './components/PunishmentModal';
import { AddTaskModal } from './components/AddTaskModal';
import { DownloadPage } from './components/DownloadPage';
import { HorizontalSlide } from './components/HorizontalSlide';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ViewMode = 'landing' | 'auth' | 'app' | 'download';

const SLIDE_IDS = [
  'section-matrix',
  'section-curve',
  'section-sleep',
  'section-accountability',
];

export default function App() {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('landing');

  // Core data
  const [tasks, setTasks] = useState<Task[]>(() => getLocalTasks());
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>(() => getLocalSleep());
  const [punishments, setPunishments] = useState<PunishmentRecord[]>(() => getLocalPunishments());
  const [journal, setJournal] = useState<Record<string, DailyJournalEntry>>(() => getLocalJournal());
  const [quoteState, setQuoteState] = useState(() => getQuoteSettings());
  const [potatoMode, setPotatoMode] = useState(() => getPotatoMode());
  const [theme, setTheme] = useState<ThemeMode>(() => getLocalTheme());

  // Horizontal container reference
  const horizontalCanvasRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>('section-matrix');

  // Modals
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [punishmentModal, setPunishmentModal] = useState<{
    isOpen: boolean; initialTask: Task | null; initialMissedDates: string[];
  }>({ isOpen: false, initialTask: null, initialMissedDates: [] });

  useEffect(() => {
    saveLocalTheme(theme);
  }, [theme]);

  // Synchronize active tab based on horizontal scroll position & support arrow/number key navigation
  useEffect(() => {
    const canvas = horizontalCanvasRef.current;
    if (!canvas) return;

    let ticking = false;

    const checkActiveTab = () => {
      const canvasRect = canvas.getBoundingClientRect();
      const canvasCenter = canvasRect.left + canvasRect.width / 2;

      let closestId = SLIDE_IDS[0];
      let minDistance = Infinity;

      for (const sId of SLIDE_IDS) {
        const el = document.getElementById(sId);
        if (el) {
          const rect = el.getBoundingClientRect();
          const slideCenter = rect.left + rect.width / 2;
          const dist = Math.abs(slideCenter - canvasCenter);
          if (dist < minDistance) {
            minDistance = dist;
            closestId = sId;
          }
        }
      }

      setActiveSection((prev) => (prev !== closestId ? closestId : prev));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(checkActiveTab);
        ticking = true;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') {
        const currIdx = SLIDE_IDS.indexOf(activeSection);
        if (currIdx < SLIDE_IDS.length - 1) {
          handleScrollToSection(SLIDE_IDS[currIdx + 1]);
        }
      } else if (e.key === 'ArrowLeft') {
        const currIdx = SLIDE_IDS.indexOf(activeSection);
        if (currIdx > 0) {
          handleScrollToSection(SLIDE_IDS[currIdx - 1]);
        }
      } else if (e.key === '1') {
        handleScrollToSection('section-matrix');
      } else if (e.key === '2') {
        handleScrollToSection('section-curve');
      } else if (e.key === '3') {
        handleScrollToSection('section-sleep');
      } else if (e.key === '4') {
        handleScrollToSection('section-accountability');
      }
    };

    // Use IntersectionObserver as a secondary instant trigger
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { root: canvas, threshold: [0.5, 0.75] }
    );

    for (const sId of SLIDE_IDS) {
      const el = document.getElementById(sId);
      if (el) observer.observe(el);
    }

    canvas.addEventListener('scroll', onScroll, { passive: true });
    canvas.addEventListener('scrollend', checkActiveTab, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    // Initial check on mount
    checkActiveTab();

    return () => {
      canvas.removeEventListener('scroll', onScroll);
      canvas.removeEventListener('scrollend', checkActiveTab);
      window.removeEventListener('keydown', onKeyDown);
      observer.disconnect();
    };
  }, [activeSection]);

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el && horizontalCanvasRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setActiveSection(sectionId);
    }
  };

  const handlePrevSlide = () => {
    const idx = SLIDE_IDS.indexOf(activeSection);
    if (idx > 0) handleScrollToSection(SLIDE_IDS[idx - 1]);
  };

  const handleNextSlide = () => {
    const idx = SLIDE_IDS.indexOf(activeSection);
    if (idx < SLIDE_IDS.length - 1) handleScrollToSection(SLIDE_IDS[idx + 1]);
  };

  // Firebase auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fireUser) => {
      setUser(fireUser);
      setAuthChecked(true);

      if (fireUser) {
        setViewMode('app');
        const cloud = await fetchFromCloud(fireUser.uid);
        if (cloud) {
          if (cloud.tasks?.length) { setTasks(cloud.tasks); saveLocalTasks(cloud.tasks); }
          if (cloud.sleep?.length) { setSleepRecords(cloud.sleep); saveLocalSleep(cloud.sleep); }
          if (cloud.punishments?.length) { setPunishments(cloud.punishments); saveLocalPunishments(cloud.punishments); }
          if (cloud.journal) { setJournal(cloud.journal); saveLocalJournal(cloud.journal); }
        }
      }
    });
    return () => unsub();
  }, []);

  // Persist helper
  const persist = (
    t = tasks, 
    s = sleepRecords, 
    p = punishments, 
    j = journal
  ) => {
    saveLocalTasks(t);
    saveLocalSleep(s);
    saveLocalPunishments(p);
    saveLocalJournal(j);
    if (user) {
      syncToCloud(user.uid, { tasks: t, sleep: s, punishments: p, journal: j });
    }
  };

  // Handlers
  const handleToggleCell = (taskId: string, dayKey: string) => {
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const h = { ...t.history };
      h[dayKey] === 'done' ? delete h[dayKey] : (h[dayKey] = 'done');
      return { ...t, history: h };
    });
    setTasks(updated);
    persist(updated);
  };

  const handleAddTask = (t: Task) => {
    const updated = [...tasks, t];
    setTasks(updated);
    persist(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    persist(updated);
  };

  const handleSaveSleep = (rec: SleepRecord) => {
    const updated = [rec, ...sleepRecords.filter((r) => r.date !== rec.date)];
    setSleepRecords(updated);
    persist(tasks, updated);
  };

  const handleSaveJournalEntry = (entry: DailyJournalEntry) => {
    const updated = { ...journal, [entry.date]: entry };
    setJournal(updated);
    persist(tasks, sleepRecords, punishments, updated);
  };

  const handleDeleteJournalEntry = (date: string) => {
    const updated = { ...journal };
    delete updated[date];
    setJournal(updated);
    persist(tasks, sleepRecords, punishments, updated);
  };

  const handleTriggerPunishment = (task: Task, dates: string[]) => {
    setPunishmentModal({ isOpen: true, initialTask: task, initialMissedDates: dates });
  };

  const handleAssignPunishment = (rec: PunishmentRecord) => {
    const updated = [rec, ...punishments];
    setPunishments(updated);
    persist(tasks, sleepRecords, updated);
  };

  const handleMarkServed = (id: string) => {
    const updated = punishments.map((p) =>
      p.id === id ? { ...p, served: true, servedAt: new Date().toISOString() } : p
    );
    setPunishments(updated);
    persist(tasks, sleepRecords, updated);
  };

  const handleTogglePotatoMode = () => {
    const next = !potatoMode;
    setPotatoMode(next);
    savePotatoMode(next);
  };

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    saveLocalTheme(next);
  };

  const handleToggleQuote = () => {
    const next = !quoteState.showQuote;
    setQuoteState({ ...quoteState, showQuote: next });
    saveQuoteSettings(next, quoteState.customQuote);
  };

  const handleSaveCustomQuote = (q: QuoteItem | null) => {
    setQuoteState({ ...quoteState, customQuote: q });
    saveQuoteSettings(quoteState.showQuote, q);
  };

  const handleRefreshData = () => {
    setTasks(getLocalTasks());
    setSleepRecords(getLocalSleep());
    setPunishments(getLocalPunishments());
    setJournal(getLocalJournal());
    setQuoteState(getQuoteSettings());
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setIsGuest(false);
    setViewMode('landing');
  };

  const stats = useMemo(() => calculateStats(tasks, new Date()), [tasks]);
  const activeStrikesCount = punishments.filter((p) => !p.served).length;

  // Initial loader
  if (!authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg-app)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-current animate-pulse" />
          <span className="font-sans-app font-bold tracking-widest text-base uppercase">
            CHRONO MATRIX
          </span>
        </div>
      </div>
    );
  }

  // 1. Landing View
  if (!user && !isGuest && viewMode === 'landing') {
    return (
      <>
        <MouseAura enabled={!potatoMode} />
        <LandingHero
          isLight={theme === 'light'}
          onGetStarted={() => setViewMode('auth')}
          onExploreOffline={() => {
            setIsGuest(true);
            setViewMode('app');
          }}
        />
      </>
    );
  }

  // 2. Auth Gate View
  if (!user && !isGuest && viewMode === 'auth') {
    return (
      <>
        <MouseAura enabled={!potatoMode} />
        <AuthGate
          onAuthenticated={() => setViewMode('app')}
          onBackToLanding={() => setViewMode('landing')}
        />
      </>
    );
  }

  // 3. Standalone Download / Backup Page
  if (viewMode === 'download') {
    return (
      <>
        <MouseAura enabled={!potatoMode} />
        <DownloadPage
          onBack={() => setViewMode('app')}
          onRefreshData={handleRefreshData}
        />
      </>
    );
  }

  // 4. Horizontal Scrolling Deck Dashboard
  return (
    <div className={`h-screen w-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col font-sans-app overflow-hidden transition-colors ${potatoMode ? 'potato-mode' : ''}`}>
      {/* Interactive mouse ambient aura */}
      <MouseAura enabled={!potatoMode} />

      {/* Top Navbar with 1-click horizontal jump buttons */}
      <Navbar
        stats={stats}
        potatoMode={potatoMode}
        onTogglePotatoMode={handleTogglePotatoMode}
        showQuote={quoteState.showQuote}
        onToggleQuote={handleToggleQuote}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        activeSection={activeSection}
        onScrollToSection={handleScrollToSection}
        user={user}
        onLogout={handleLogout}
        onOpenDownload={() => setViewMode('download')}
        activeStrikesCount={activeStrikesCount}
      />

      {/* Top Floating Quote & Reflection Bar (pinned right above the horizontal deck) */}
      <div className="w-full shrink-0 z-30 px-4 sm:px-6 pt-2.5 pb-1 space-y-1.5 max-w-7xl mx-auto">
        {quoteState.showQuote && (
          <DailyQuoteBanner
            customQuote={quoteState.customQuote}
            onSaveCustomQuote={handleSaveCustomQuote}
          />
        )}
        <DailyReflectionBar
          journal={journal}
          onSaveEntry={handleSaveJournalEntry}
          onDeleteEntry={handleDeleteJournalEntry}
        />
      </div>

      {/* Main Horizontal Canvas: Scrolls left-to-right smoothly via native scroll / navigation */}
      <main
        ref={horizontalCanvasRef}
        className="horizontal-canvas flex-1 w-full overflow-x-auto overflow-y-auto flex flex-row items-start gap-6 sm:gap-10 px-4 sm:px-8 py-4 snap-x snap-mandatory"
      >
        {/* Slide 1: Monthly Matrix Scheduler */}
        <HorizontalSlide
          id="section-matrix"
          isActive={activeSection === 'section-matrix'}
          onActivate={() => handleScrollToSection('section-matrix')}
          potatoMode={potatoMode}
        >
          <MonthlyScheduler
            tasks={tasks}
            journal={journal}
            onToggleCell={handleToggleCell}
            onAddTaskClick={() => setIsAddTaskOpen(true)}
            onDeleteTask={handleDeleteTask}
            onTriggerPunishment={handleTriggerPunishment}
            potatoMode={potatoMode}
          />
        </HorizontalSlide>

        {/* Slide 2: The 1% Compounding Trajectory Curve */}
        <HorizontalSlide
          id="section-curve"
          isActive={activeSection === 'section-curve'}
          onActivate={() => handleScrollToSection('section-curve')}
          potatoMode={potatoMode}
        >
          <ProductivityCurve
            tasks={tasks}
            potatoMode={potatoMode}
          />
        </HorizontalSlide>

        {/* Slide 3: Circadian Sleep, Naps & Google Fit */}
        <HorizontalSlide
          id="section-sleep"
          isActive={activeSection === 'section-sleep'}
          onActivate={() => handleScrollToSection('section-sleep')}
          potatoMode={potatoMode}
        >
          <SleepTracker
            records={sleepRecords}
            onSaveRecord={handleSaveSleep}
          />
        </HorizontalSlide>

        {/* Slide 4: Accountability Tribunal */}
        <HorizontalSlide
          id="section-accountability"
          isActive={activeSection === 'section-accountability'}
          onActivate={() => handleScrollToSection('section-accountability')}
          potatoMode={potatoMode}
        >
          <PunishmentsWidget
            punishments={punishments}
            onMarkServed={handleMarkServed}
            onOpenTriggerModal={() =>
              setPunishmentModal({ isOpen: true, initialTask: null, initialMissedDates: [] })
            }
          />
        </HorizontalSlide>
      </main>

      {/* Minimal Bottom Floating Navigation Dock: Left / Right Arrows + Slide Counter */}
      <div className="shrink-0 w-full py-2 px-6 border-t border-current/[0.07] bg-[var(--nav-bg)] backdrop-blur-xl z-30 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevSlide}
            disabled={SLIDE_IDS.indexOf(activeSection) === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg glass-card opacity-70 hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed btn-press transition-all cursor-pointer"
            title="Previous Tab"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Minimal Dot Indicators */}
          <div className="flex items-center gap-1.5 px-1">
            {SLIDE_IDS.map((sId, i) => (
              <button
                key={sId}
                onClick={() => handleScrollToSection(sId)}
                title={`Tab ${i + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeSection === sId
                    ? 'w-5 h-1.5 bg-current opacity-90'
                    : 'w-1.5 h-1.5 bg-current/20 hover:bg-current/60'
                }`}
              />
            ))}
          </div>

          <span className="opacity-40">
            {SLIDE_IDS.indexOf(activeSection) + 1} / {SLIDE_IDS.length}
          </span>

          <button
            onClick={handleNextSlide}
            disabled={SLIDE_IDS.indexOf(activeSection) === SLIDE_IDS.length - 1}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg glass-card opacity-70 hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed btn-press transition-all cursor-pointer"
            title="Next Tab"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 opacity-60">
          <button
            onClick={() => setViewMode('landing')}
            className="hover:underline opacity-70 hover:opacity-100 cursor-pointer"
          >
            System
          </button>
          <span>•</span>
          <button
            onClick={() => setViewMode('download')}
            className="hover:underline opacity-70 hover:opacity-100 cursor-pointer"
          >
            Offline Hub
          </button>
        </div>
      </div>

      {/* Modals */}
      {isAddTaskOpen && (
        <AddTaskModal
          onClose={() => setIsAddTaskOpen(false)}
          onAddTask={handleAddTask}
        />
      )}

      {punishmentModal.isOpen && (
        <PunishmentModal
          tasks={tasks}
          initialTask={punishmentModal.initialTask}
          initialMissedDates={punishmentModal.initialMissedDates}
          onClose={() => setPunishmentModal({ isOpen: false, initialTask: null, initialMissedDates: [] })}
          onAssignPunishment={handleAssignPunishment}
        />
      )}
    </div>
  );
}
