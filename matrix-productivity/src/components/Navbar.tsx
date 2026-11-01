import type { UserStats, ThemeMode } from '../types';
import type { User } from '../services/firebase';
import {
  Flame,
  Zap,
  Quote,
  Download,
  LogOut,
  Moon as MoonIcon,
  Sun,
} from 'lucide-react';

interface NavbarProps {
  stats: UserStats;
  potatoMode: boolean;
  onTogglePotatoMode: () => void;
  showQuote: boolean;
  onToggleQuote: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  activeSection: string;
  onScrollToSection: (sectionId: string) => void;
  user: User | null;
  onLogout: () => void;
  onOpenDownload: () => void;
  activeStrikesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  potatoMode,
  onTogglePotatoMode,
  showQuote,
  onToggleQuote,
  theme,
  onToggleTheme,
  onScrollToSection,
  user,
  onLogout,
  onOpenDownload,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-current/[0.07] bg-[var(--nav-bg)] backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Left: Brand Signature */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none" 
          onClick={() => onScrollToSection('section-matrix')}
        >
          <div className="w-2 h-2 rounded-full bg-current opacity-90" />
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans-app font-bold tracking-tight text-sm sm:text-base text-current">
              CHRONO MATRIX
            </span>
            <span className="font-signature text-xs opacity-40">journal</span>
          </div>
        </div>

        {/* Right: Minimalist Live Stats, Toggles, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Minimal Metric Capsule */}
          <div className="flex items-center gap-2.5 px-2.5 py-1 rounded-xl glass-card text-xs font-mono">
            <div className="flex items-center gap-1">
              <span className="opacity-40 text-[10px] uppercase">Today</span>
              <span className="font-bold text-current">{stats.dailyPercentage}%</span>
            </div>
            <div className="w-px h-3 bg-current/15" />
            <div className="flex items-center gap-1">
              <span className="opacity-40 text-[10px] uppercase">Month</span>
              <span className="font-bold text-current">{stats.monthlyPercentage}%</span>
            </div>
            <div className="w-px h-3 bg-current/15" />
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="font-bold text-current">{stats.activeStreak}d</span>
            </div>
          </div>

          {/* Minimal Action Controls */}
          <div className="flex items-center gap-0.5">
            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={onToggleTheme}
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-1.5 rounded-lg opacity-50 hover:opacity-100 hover:bg-current/[0.04] transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <MoonIcon className="w-4 h-4 text-zinc-700" />}
            </button>

            {/* Potato Mode Toggle */}
            <button
              onClick={onTogglePotatoMode}
              title={potatoMode ? "Potato Mode ON (Animations OFF)" : "Potato Mode OFF (Animations ON)"}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                potatoMode
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'opacity-50 hover:opacity-100 hover:bg-current/[0.04]'
              }`}
            >
              <Zap className="w-4 h-4" />
            </button>

            {/* Quote Toggle */}
            <button
              onClick={onToggleQuote}
              title={showQuote ? "Hide Quote Banner" : "Show Quote Banner"}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                showQuote
                  ? 'bg-current/10 opacity-100'
                  : 'opacity-50 hover:opacity-100 hover:bg-current/[0.04]'
              }`}
            >
              <Quote className="w-4 h-4" />
            </button>

            {/* Download Hub */}
            <button
              onClick={onOpenDownload}
              title="Download Offline App & Backups"
              className="p-1.5 rounded-lg opacity-50 hover:opacity-100 hover:bg-current/[0.04] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Profile Avatar / Logout */}
            {user ? (
              <div className="flex items-center gap-1 pl-1.5 border-l border-current/10">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-5 h-5 rounded-full ring-1 ring-current/20 object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-current/10 flex items-center justify-center text-[9px] font-mono font-bold">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="p-1 rounded-lg opacity-40 hover:opacity-100 hover:text-rose-400 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null}
          </div>

        </div>
      </div>
    </header>
  );
};
