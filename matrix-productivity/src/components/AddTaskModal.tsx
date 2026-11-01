import { useState } from 'react';
import type { Task } from '../types';
import { X, Plus } from 'lucide-react';

interface AddTaskModalProps {
  onClose: () => void;
  onAddTask: (task: Task) => void;
}

const CATEGORIES: Array<Task['category']> = ['Focus', 'Fitness', 'Code', 'Mind', 'Habit', 'Custom'];
const SHADES = ['#ffffff', '#e4e4e7', '#a1a1aa', '#71717a', '#52525b', '#3f3f46'];

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onAddTask }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Task['category']>('Focus');
  const [colorTag, setColorTag] = useState('#ffffff');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddTask({
      id: 'task-' + Date.now(),
      name: name.trim(),
      category,
      colorTag,
      createdAt: new Date().toISOString(),
      history: {},
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md page-enter">
      <div 
        className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 relative space-y-5 bg-[var(--bg-app)] text-[var(--text-main)] border border-current/[0.1] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl opacity-50 hover:opacity-100 hover:bg-current/[0.05] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <h3 className="text-xl font-bold font-serif-app text-current">New Ritual</h3>
          <p className="text-[11px] font-mono opacity-50 mt-0.5">Add a task to your monthly productivity matrix</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase tracking-[0.1em] opacity-60">
              Task Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Read 20 Pages, Cold Shower, Deep Work..."
              className="w-full bg-current/[0.03] border border-current/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-current placeholder-current/35 focus:outline-none focus:border-current/30 transition-all font-sans-app"
              autoFocus
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase tracking-[0.1em] opacity-60">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-mono text-center transition-all cursor-pointer btn-press ${
                    category === cat
                      ? 'btn-solid-invert font-semibold shadow-sm'
                      : 'bg-current/[0.03] opacity-60 hover:opacity-100 border border-current/[0.08]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase tracking-[0.1em] opacity-60">
              Accent Color
            </label>
            <div className="flex items-center gap-2.5">
              {SHADES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColorTag(c)}
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                    colorTag === c ? 'scale-110 ring-2 ring-current ring-offset-2 ring-offset-[var(--bg-app)]' : 'border-current/20 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-2xl btn-solid-invert font-semibold text-xs font-mono transition-all btn-press shadow-md flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Ritual</span>
          </button>
        </form>
      </div>
    </div>
  );
};
