import { 
  Download, 
  HardDrive, 
  Monitor, 
  Smartphone, 
  Shield, 
  WifiOff, 
  ArrowLeft, 
  Upload, 
  Check,
  Globe
} from 'lucide-react';
import { useState } from 'react';
import { exportDataAsJSON, importDataFromJSON } from '../services/storage';

interface DownloadPageProps {
  onBack: () => void;
  onRefreshData: () => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ onBack, onRefreshData }) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const json = exportDataAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chrono-matrix-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importDataFromJSON(ev.target?.result as string);
      setImportStatus(ok ? 'Backup restored successfully.' : 'Failed to parse backup.');
      if (ok) onRefreshData();
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] page-enter transition-colors">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Ambient bg */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] rounded-full bg-current/[0.01] blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-current/[0.008] blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-14">
          {/* Back */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs opacity-60 hover:opacity-100 transition-colors mb-10 btn-press cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-mono uppercase tracking-wider">Back to Dashboard</span>
          </button>

          {/* Title */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-2xl glass-card">
                <HardDrive className="w-4 h-4 text-current" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60 px-3 py-1 rounded-full glass-card">
                Standalone Edition
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-current mb-3 leading-[1.1] font-serif-app">
              Take your discipline
              <br />
              <span className="italic opacity-80">completely offline.</span>
            </h1>

            <p className="text-sm sm:text-base opacity-70 leading-relaxed font-serif-app max-w-lg">
              Install Chrono Matrix as a native app on any device. Zero latency, full privacy, 
              air-gapped data persistence. Your productivity data never leaves your machine.
            </p>
          </div>
        </div>
      </div>

      {/* Installation Cards */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {/* Desktop Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4 glass-card-hover transition-all duration-300 group border border-current/[0.08]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-current/[0.04]">
                  <Monitor className="w-5 h-5 text-current" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-current font-serif-app">Desktop App</h3>
                  <p className="text-[11px] opacity-50 font-mono">Windows · macOS · Linux</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-current/[0.04] opacity-70 border border-current/[0.08]">
                PWA
              </span>
            </div>

            <p className="text-xs sm:text-sm opacity-70 leading-relaxed">
              Install as a Progressive Web App for a frameless, native-like desktop experience 
              with full offline caching and instant launch.
            </p>

            <div className="space-y-2 pt-1">
              <div className="flex items-start gap-2.5 text-xs opacity-75">
                <div className="w-1 h-1 rounded-full bg-current mt-1.5 shrink-0" />
                <span>Open <strong>Chrome</strong> or <strong>Edge</strong>, click the install icon in the address bar</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs opacity-75">
                <div className="w-1 h-1 rounded-full bg-current mt-1.5 shrink-0" />
                <span>Or press <kbd className="px-1.5 py-0.5 rounded bg-current/[0.06] border border-current/[0.1] text-[10px] font-mono">Ctrl+Shift+A</kbd> to install</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs opacity-75">
                <div className="w-1 h-1 rounded-full bg-current mt-1.5 shrink-0" />
                <span>Runs independently with its own window and taskbar entry</span>
              </div>
            </div>
          </div>

          {/* Mobile Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4 glass-card-hover transition-all duration-300 group border border-current/[0.08]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-current/[0.04]">
                  <Smartphone className="w-5 h-5 text-current" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-current font-serif-app">Mobile App</h3>
                  <p className="text-[11px] opacity-50 font-mono">iOS · Android</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-current/[0.04] opacity-70 border border-current/[0.08]">
                PWA
              </span>
            </div>

            <p className="text-xs sm:text-sm opacity-70 leading-relaxed">
              Add to your home screen for a full-screen native mobile experience. 
              Works entirely offline after first load.
            </p>

            <div className="space-y-2 pt-1">
              <div className="flex items-start gap-2.5 text-xs opacity-75">
                <div className="w-1 h-1 rounded-full bg-current mt-1.5 shrink-0" />
                <span><strong>iOS:</strong> Safari → Share → "Add to Home Screen"</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs opacity-75">
                <div className="w-1 h-1 rounded-full bg-current mt-1.5 shrink-0" />
                <span><strong>Android:</strong> Chrome → Menu → "Add to Home Screen"</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs opacity-75">
                <div className="w-1 h-1 rounded-full bg-current mt-1.5 shrink-0" />
                <span>Full offline cache with background sync when reconnected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-12">
          {[
            { icon: WifiOff, label: 'Air-Gapped', desc: 'No internet required after first load' },
            { icon: Shield, label: 'Zero Telemetry', desc: 'No trackers, no analytics, no third-party scripts' },
            { icon: Globe, label: 'Cross-Platform', desc: 'Same experience on every device and OS' },
          ].map((item, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 flex items-start gap-3 border border-current/[0.08]">
              <div className="p-2 rounded-xl bg-current/[0.03]">
                <item.icon className="w-4 h-4 opacity-70" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-current mb-0.5">{item.label}</h4>
                <p className="text-xs opacity-50">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Data Management */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-5 border border-current/[0.08]">
          <div>
            <h3 className="text-xl font-bold text-current mb-1 font-serif-app">Data Portability</h3>
            <p className="text-xs opacity-50 font-mono">
              Export or restore your complete productivity matrix as a portable JSON archive
            </p>
          </div>

          {importStatus && (
            <div className="flex items-center gap-2 p-3 rounded-xl glass-card text-xs font-mono">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>{importStatus}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl btn-solid-invert font-semibold text-sm transition-all btn-press shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Backup</span>
            </button>

            <label className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl glass-card text-sm font-medium opacity-80 hover:opacity-100 cursor-pointer glass-card-hover transition-all btn-press border border-current/[0.08]">
              <Upload className="w-4 h-4" />
              <span>Restore from Backup</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
