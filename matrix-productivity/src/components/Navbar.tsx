import { useState } from 'react';
import type { UserStats, ThemeMode } from '../types';
import type { User } from '../services/firebase';
import {
  Flame,
  Zap,
  Quote,
  Download,
  LogOut,
  LogIn,
  Moon as MoonIcon,
  Sun,
  MoreVertical,
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
  onOpenAuth?: () => void;
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
  onOpenAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-current/[0.07] bg-[var(--nav-bg)] backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-13 sm:h-14 flex items-center justify-between gap-2">
        
        {/* Left: Brand Signature */}
        <div 
          className="flex items-center gap-2 cursor-pointer select-none shrink-0" 
          onClick={() => onScrollToSection('section-matrix')}
        >
          <div className="w-2 h-2 rounded-full bg-current opacity-90" />
          <div className="flex items-baseline gap-1">
            <span className="font-sans-app font-bold tracking-tight text-xs sm:text-base text-current">
              CHRONO<span className="hidden xs:inline"> MATRIX</span>
            </span>
            <span className="font-signature text-[10px] sm:text-xs opacity-40 hidden sm:inline">journal</span>
          </div>
        </div>

        {/* Right: Metric Capsule + Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Responsive Metric Capsule */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-2.5 py-1 rounded-xl glass-card text-[11px] sm:text-xs font-mono">
            <div className="flex items-center gap-1">
              <span className="opacity-40 text-[9px] uppercase hidden sm:inline">Today</span>
              <span className="font-bold text-current">{stats.dailyPercentage}%</span>
            </div>
            
            <div className="hidden sm:block w-px h-3 bg-current/15" />
            <div className="hidden sm:flex items-center gap-1">
              <span className="opacity-40 text-[9px] uppercase">Month</span>
              <span className="font-bold text-current">{stats.monthlyPercentage}%</span>
            </div>

            <div className="w-px h-3 bg-current/15" />
            <div className="flex items-center gap-0.5">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="font-bold text-current">{stats.activeStreak}d</span>
            </div>
          </div>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-current/[0.04] transition-all cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" /> : <MoonIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-700" />}
          </button>

          {/* Desktop Only Action Controls */}
          <div className="hidden md:flex items-center gap-0.5">
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
          </div>

          {/* User Sign In or Avatar */}
          {user ? (
            <div className="flex items-center gap-1 pl-1 border-l border-current/10">
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
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl btn-solid-invert text-[10px] sm:text-xs font-mono font-medium transition-all btn-press cursor-pointer"
              title="Sign in to save and sync data"
            >
              <LogIn className="w-3 h-3" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Overflow Menu Button (for Potato Mode, Quote, Download) */}
          <div className="relative md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-all cursor-pointer"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {mobileMenuOpen && (
              <div 
                className="absolute right-0 top-full mt-2 w-48 p-2 rounded-2xl glass-card border border-current/15 shadow-2xl z-50 space-y-1 text-xs font-mono"
                onClick={() => setMobileMenuOpen(false)}
              >
                <button
                  onClick={onTogglePotatoMode}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-current/[0.06] transition-all text-left"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" /> Potato Mode
                  </span>
                  <span className="text-[10px] opacity-50">{potatoMode ? 'ON' : 'OFF'}</span>
                </button>
                <button
                  onClick={onToggleQuote}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-current/[0.06] transition-all text-left"
                >
                  <span className="flex items-center gap-2">
                    <Quote className="w-3.5 h-3.5" /> Quote Banner
                  </span>
                  <span className="text-[10px] opacity-50">{showQuote ? 'ON' : 'OFF'}</span>
                </button>
                <button
                  onClick={onOpenDownload}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-current/[0.06] transition-all text-left"
                >
                  <Download className="w-3.5 h-3.5" /> Offline & Backup
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
