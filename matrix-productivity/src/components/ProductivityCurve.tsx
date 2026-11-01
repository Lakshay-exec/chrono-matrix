import { useState, useMemo } from 'react';
import type { Task, ProductivityPoint } from '../types';
import { calculateCompoundingTrajectory } from '../services/storage';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProductivityCurveProps {
  tasks: Task[];
  potatoMode: boolean;
}

export const ProductivityCurve: React.FC<ProductivityCurveProps> = ({
  tasks,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ProductivityPoint | null>(null);

  const data = useMemo(() => {
    return calculateCompoundingTrajectory(tasks, 30);
  }, [tasks]);

  const latestScore = data[data.length - 1]?.score || 100.0;
  const initialScore = data[0]?.score || 100.0;
  const netDelta = Number((latestScore - initialScore).toFixed(1));
  const isPositive = netDelta >= 0;

  const minScore = Math.min(...data.map((d) => d.score), 90);
  const maxScore = Math.max(...data.map((d) => d.score), 115);
  const range = maxScore - minScore || 1;

  const width = 800;
  const height = 260;
  const paddingX = 35;
  const paddingY = 30;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((d.score - minScore) / range) * (height - 2 * paddingY);
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = points[idx - 1];
    const cpx1 = prev.x + (curr.x - prev.x) / 2;
    const cpy1 = prev.y;
    const cpx2 = prev.x + (curr.x - prev.x) / 2;
    const cpy2 = curr.y;
    return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
  const baselineY = height - paddingY - ((100.0 - minScore) / range) * (height - 2 * paddingY);

  return (
    <div className="w-full space-y-4 page-enter">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-serif-app tracking-tight text-current">
          1% Compounding Trajectory
        </h2>
      </div>

      {/* Minimal Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono opacity-50">
            <span>Multiplier</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-current">
              {(latestScore / 100).toFixed(2)}×
            </span>
            <span className="text-xs font-mono">
              {isPositive ? (
                <span className="text-emerald-500 font-semibold inline-flex items-center">
                  <ArrowUpRight className="w-3 h-3" />+{netDelta}%
                </span>
              ) : (
                <span className="text-rose-500 font-semibold inline-flex items-center">
                  <ArrowDownRight className="w-3 h-3" />{netDelta}%
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono opacity-50">
            <span>Peak</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="pt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-current">
              {maxScore.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono opacity-50">
            <span>Consistency</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="pt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-current">
              {Math.round(
                (data.reduce((acc, d) => acc + (d.totalTasks > 0 ? d.tasksCompleted / d.totalTasks : 0), 0) / (data.length || 1)) * 100
              )}%
            </span>
          </div>
        </div>
      </div>

      {/* Minimal SVG Chart Container */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-current/[0.08]">
        <div className="flex items-center justify-end mb-2 text-xs font-mono opacity-50">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-current inline-block" /> Momentum
            </span>
            <span className="flex items-center gap-1.5 opacity-40">
              <span className="w-2.5 h-px border-t border-dashed border-current inline-block" /> Baseline
            </span>
          </div>
        </div>

        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-48 sm:h-64 overflow-visible"
          >
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Baseline 100 dashed guide */}
            <line
              x1={paddingX}
              y1={baselineY}
              x2={width - paddingX}
              y2={baselineY}
              stroke="currentColor"
              strokeDasharray="4 4"
              strokeOpacity="0.18"
              strokeWidth="1"
            />

            {/* Area Fill */}
            <path d={areaD} fill="url(#curveGradient)" />

            {/* Main Path Stroke */}
            <path
              d={pathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Hover Points */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={hoveredPoint?.date === p.data.date ? 5 : 2.5}
                className="cursor-pointer transition-all fill-current"
                opacity={hoveredPoint?.date === p.data.date ? 1 : 0.4}
                onMouseEnter={() => setHoveredPoint(p.data)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </svg>

          {/* Point Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-2 right-4 p-2.5 rounded-xl glass-card text-xs font-mono shadow-md border border-current/15 pointer-events-none">
              <div className="opacity-60">{hoveredPoint.date}</div>
              <div className="font-bold text-current mt-0.5">
                Score: {hoveredPoint.score} pts
              </div>
              <div className="text-[10px] opacity-50 mt-0.5">
                Completed: {hoveredPoint.tasksCompleted} / {hoveredPoint.totalTasks} ({hoveredPoint.totalTasks > 0 ? Math.round((hoveredPoint.tasksCompleted / hoveredPoint.totalTasks) * 100) : 0}%)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
