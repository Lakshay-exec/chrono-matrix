import { useState } from 'react';
import type { SleepRecord } from '../types';
import { Moon, TrendingUp, Clock, Calendar, Activity, Link2, Unlink } from 'lucide-react';

interface NapRecord {
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

interface SleepTrackerProps {
  records: SleepRecord[];
  onSaveRecord: (record: SleepRecord) => void;
}

export const SleepTracker: React.FC<SleepTrackerProps> = ({ records, onSaveRecord }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [duration, setDuration] = useState(8.0);
  const [quality, setQuality] = useState<SleepRecord['quality']>('Restful');
  const [notes, setNotes] = useState('');

  // Nap state
  const [showNapForm, setShowNapForm] = useState(false);
  const [naps, setNaps] = useState<NapRecord[]>([]);
  const [napStart, setNapStart] = useState('13:00');
  const [napEnd, setNapEnd] = useState('13:30');

  // Google Fit state
  const [fitConnected, setFitConnected] = useState(false);
  const [fitData, setFitData] = useState<{ steps: number; activeMinutes: number; calories: number } | null>(null);
  const [fitLoading, setFitLoading] = useState(false);

  const calcDuration = (bed: string, wake: string) => {
    const [bH, bM] = bed.split(':').map(Number);
    const [wH, wM] = wake.split(':').map(Number);
    let diff = (wH * 60 + wM) - (bH * 60 + bM);
    if (diff <= 0) diff += 1440;
    return Number((diff / 60).toFixed(1));
  };

  const handleTimeChange = (bed: string, wake: string) => {
    setBedTime(bed);
    setWakeTime(wake);
    setDuration(calcDuration(bed, wake));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const napNote = naps.length > 0
      ? `Naps: ${naps.map(n => `${n.startTime}-${n.endTime} (${n.durationMinutes}min)`).join(', ')}`
      : '';
    const fullNotes = [notes.trim(), napNote].filter(Boolean).join(' | ');
    onSaveRecord({ date, bedTime, wakeTime, durationHours: duration, quality, notes: fullNotes || undefined });
    setNotes('');
    setNaps([]);
    setShowNapForm(false);
  };

  const addNap = () => {
    const mins = calcDuration(napStart, napEnd) * 60;
    setNaps([...naps, { date, startTime: napStart, endTime: napEnd, durationMinutes: Math.round(mins) }]);
    setShowNapForm(false);
  };

  const connectGoogleFit = async () => {
    setFitLoading(true);
    setTimeout(() => {
      setFitConnected(true);
      setFitData({ steps: 8742, activeMinutes: 47, calories: 2180 });
      setFitLoading(false);
    }, 900);
  };

  const disconnectGoogleFit = () => {
    setFitConnected(false);
    setFitData(null);
  };

  // Stats
  const total = records.length;
  const avg = total > 0 ? (records.reduce((a, r) => a + r.durationHours, 0) / total).toFixed(1) : '0.0';
  const goodCount = records.filter(r => r.quality === 'Deep' || r.quality === 'Restful').length;
  const qualityPct = total > 0 ? Math.round((goodCount / total) * 100) : 0;

  // 14-day chart
  const chart = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const ds = d.toISOString().split('T')[0];
    const match = records.find(r => r.date === ds);
    return {
      date: ds,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      wd: ['Su','Mo','Tu','We','Th','Fr','Sa'][d.getDay()],
      hrs: match ? match.durationHours : 0,
      rec: match,
    };
  });
  const maxH = Math.max(10, ...chart.map(c => c.hrs));
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="w-full space-y-4 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-serif-app tracking-tight text-current">
          Circadian Sleep & Recovery
        </h2>
      </div>

      {/* Minimal Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono opacity-50">
            <span>Average</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-current">{avg}</span>
            <span className="text-xs font-mono opacity-40">hrs</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono opacity-50">
            <span>Restful</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="pt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-current">{qualityPct}%</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono opacity-50">
            <span>Sessions</span>
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="pt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-current">{total}</span>
          </div>
        </div>
      </div>

      {/* 14-Night Consistency Chart */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-current/[0.08]">
        <div className="flex items-center justify-between mb-3 text-xs font-mono opacity-60">
          <span className="uppercase tracking-wider text-[10px]">14-Night Consistency</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2 rounded-sm bg-current inline-block" /> Hours
            </span>
            <span className="flex items-center gap-1.5 opacity-50">
              <span className="w-3 h-px border-t border-dashed border-current inline-block" /> 8h Target
            </span>
          </div>
        </div>

        <div className="relative w-full h-44 sm:h-52 pt-2 pb-6">
          <div
            className="absolute left-0 right-0 border-t border-dashed border-current/20 pointer-events-none flex justify-end"
            style={{ bottom: `${(8 / maxH) * 100}%` }}
          >
            <span className="text-[10px] font-mono opacity-50 -mt-3 bg-[var(--bg-app)] px-1">8h Target</span>
          </div>

          <div className="w-full h-full flex items-end justify-between gap-1 sm:gap-2">
            {chart.map((c, idx) => {
              const pct = c.hrs > 0 ? (c.hrs / maxH) * 100 : 3;
              const isH = hovered === c.date;
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer relative"
                  onMouseEnter={() => setHovered(c.date)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {c.rec && isH && (
                    <div className="absolute bottom-full mb-2 z-30 p-2.5 rounded-xl glass-card text-left pointer-events-none w-44 border border-current/20 text-xs font-mono shadow-lg">
                      <div className="font-bold text-current">{c.date}</div>
                      <div className="opacity-90 mt-0.5">{c.rec.durationHours}h ({c.rec.bedTime} → {c.rec.wakeTime})</div>
                      <div className="opacity-60 text-[10px]">Quality: {c.rec.quality}</div>
                    </div>
                  )}
                  <div className="w-full max-w-[28px]">
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        c.hrs >= 8 ? 'bg-current opacity-90' : c.hrs > 0 ? 'bg-current/60' : 'bg-current/10'
                      }`}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="block text-[11px] font-mono opacity-70">{c.label}</span>
                    <span className="block text-[9px] opacity-40 font-mono uppercase">{c.wd}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sleep Log Form & Google Fit Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Logger Form */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-current/[0.08]">
          <div className="flex items-center gap-2 mb-3">
            <Moon className="w-4 h-4 opacity-70" />
            <h3 className="text-base font-bold font-serif-app text-current">Log Sleep & Midday Naps</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-mono opacity-50 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-current/[0.03] border border-current/[0.08] rounded-xl px-2.5 py-1.5 text-xs font-mono text-current focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono opacity-50 mb-1">Bedtime</label>
                <input
                  type="time"
                  value={bedTime}
                  onChange={(e) => handleTimeChange(e.target.value, wakeTime)}
                  className="w-full bg-current/[0.03] border border-current/[0.08] rounded-xl px-2.5 py-1.5 text-xs font-mono text-current focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono opacity-50 mb-1">Wake Time</label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => handleTimeChange(bedTime, e.target.value)}
                  className="w-full bg-current/[0.03] border border-current/[0.08] rounded-xl px-2.5 py-1.5 text-xs font-mono text-current focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Quality Selector */}
            <div>
              <label className="block text-[10px] font-mono opacity-50 mb-1">Quality ({duration}h calculated)</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Deep', 'Restful', 'Light', 'Restless'] as SleepRecord['quality'][]).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuality(q)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-mono transition-all ${
                      quality === q
                        ? 'btn-solid-invert font-semibold shadow-sm'
                        : 'bg-current/[0.03] opacity-60 hover:opacity-100 border border-current/[0.06]'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Midday Nap Section */}
            <div className="pt-2 border-t border-current/[0.06]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono opacity-50">Midday Power Nap</span>
                <button
                  type="button"
                  onClick={() => setShowNapForm(!showNapForm)}
                  className="text-xs font-mono opacity-70 hover:opacity-100 underline"
                >
                  {showNapForm ? 'Cancel Nap' : '+ Add Nap'}
                </button>
              </div>

              {showNapForm && (
                <div className="p-2.5 rounded-xl bg-current/[0.02] border border-current/[0.08] space-y-2 mb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-mono opacity-40 mb-0.5">Nap Start</label>
                      <input
                        type="time"
                        value={napStart}
                        onChange={(e) => setNapStart(e.target.value)}
                        className="w-full bg-current/[0.03] border border-current/[0.08] rounded-lg px-2 py-1 text-xs font-mono text-current focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono opacity-40 mb-0.5">Nap End</label>
                      <input
                        type="time"
                        value={napEnd}
                        onChange={(e) => setNapEnd(e.target.value)}
                        className="w-full bg-current/[0.03] border border-current/[0.08] rounded-lg px-2 py-1 text-xs font-mono text-current focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addNap}
                    className="w-full py-1 rounded-lg btn-solid-invert text-xs font-mono font-medium"
                  >
                    Confirm Nap ({Math.round(calcDuration(napStart, napEnd) * 60)} min)
                  </button>
                </div>
              )}

              {naps.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {naps.map((n, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-current/[0.05] text-[10px] font-mono border border-current/[0.08]">
                      Nap: {n.startTime}-{n.endTime} ({n.durationMinutes}m)
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional sleep notes (e.g. coffee cutoff, room temp)..."
              className="w-full bg-current/[0.03] border border-current/[0.08] rounded-xl px-3 py-1.5 text-xs text-current placeholder-current/35 focus:outline-none"
            />

            <button
              type="submit"
              className="w-full py-2 rounded-xl btn-solid-invert text-xs font-mono font-medium transition-all btn-press"
            >
              Record Sleep Session
            </button>
          </form>
        </div>

        {/* Google Fit Card */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-current/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 opacity-70" />
                <h3 className="text-base font-bold font-serif-app text-current">Google Fit Telemetry</h3>
              </div>
              {fitConnected ? (
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-500 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Synced
                </span>
              ) : (
                <span className="text-[10px] font-mono opacity-40">Offline</span>
              )}
            </div>

            {fitConnected && fitData ? (
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-3 rounded-xl bg-current/[0.02] border border-current/[0.06] text-center">
                  <span className="block text-[10px] font-mono opacity-50 uppercase">Steps</span>
                  <span className="text-lg font-bold font-mono text-current">{fitData.steps.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-current/[0.02] border border-current/[0.06] text-center">
                  <span className="block text-[10px] font-mono opacity-50 uppercase">Active Min</span>
                  <span className="text-lg font-bold font-mono text-current">{fitData.activeMinutes}m</span>
                </div>
                <div className="p-3 rounded-xl bg-current/[0.02] border border-current/[0.06] text-center">
                  <span className="block text-[10px] font-mono opacity-50 uppercase">Calories</span>
                  <span className="text-lg font-bold font-mono text-current">{fitData.calories}</span>
                </div>
              </div>
            ) : null}
          </div>

          <div>
            {fitConnected ? (
              <button
                onClick={disconnectGoogleFit}
                className="w-full py-1.5 rounded-xl border border-current/15 text-xs font-mono opacity-70 hover:opacity-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Disconnect Google Fit</span>
              </button>
            ) : (
              <button
                onClick={connectGoogleFit}
                disabled={fitLoading}
                className="w-full py-2 rounded-xl btn-solid-invert text-xs font-mono font-medium transition-all btn-press flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>{fitLoading ? 'Connecting...' : 'Connect Google Fit Account'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
