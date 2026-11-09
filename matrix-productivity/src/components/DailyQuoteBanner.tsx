import { useState } from 'react';
import type { QuoteItem } from '../types';
import { RefreshCw, Edit3, Check, X } from 'lucide-react';

interface DailyQuoteBannerProps {
  customQuote: QuoteItem | null;
  onSaveCustomQuote: (quote: QuoteItem | null) => void;
}

const CURATED_QUOTES: QuoteItem[] = [
  { id: 'q1', text: "We suffer more often in imagination than in reality.", author: "Seneca" },
  { id: 'q2', text: "Discipline equals freedom.", author: "Jocko Willink" },
  { id: 'q3', text: "No man is free who is not master of himself.", author: "Epictetus" },
  { id: 'q4', text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { id: 'q5', text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { id: 'q6', text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { id: 'q7', text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { id: 'q8', text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
];

export const DailyQuoteBanner: React.FC<DailyQuoteBannerProps> = ({
  customQuote,
  onSaveCustomQuote,
}) => {
  const [curatedIndex, setCuratedIndex] = useState(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return dayOfYear % CURATED_QUOTES.length;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText] = useState(customQuote?.text || '');
  const [inputAuthor, setInputAuthor] = useState(customQuote?.author || '');

  const activeQuote = customQuote || CURATED_QUOTES[curatedIndex];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSaveCustomQuote({
      id: 'custom-' + Date.now(),
      text: inputText.trim(),
      author: inputAuthor.trim() || 'Self',
      isCustom: true,
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full">
      <div className="glass-card rounded-2xl px-3.5 py-1.5 transition-all">
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                Custom Personal Mantra
              </span>
              <button type="button" onClick={() => setIsEditing(false)} className="opacity-50 hover:opacity-100 p-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Your personal philosophy or daily mantra..."
              className="w-full bg-current/[0.03] border border-current/[0.08] rounded-xl px-3 py-2 text-xs sm:text-sm text-current placeholder-current/35 focus:outline-none font-serif-app italic"
              required
            />
            <div className="flex items-center justify-between gap-2 pt-1">
              <input
                type="text"
                value={inputAuthor}
                onChange={(e) => setInputAuthor(e.target.value)}
                placeholder="Attribution (e.g. Marcus Aurelius, Self)"
                className="w-48 bg-current/[0.03] border border-current/[0.08] rounded-lg px-2.5 py-1 text-xs text-current placeholder-current/35 focus:outline-none"
              />
              <div className="flex gap-1.5">
                {customQuote && (
                  <button
                    type="button"
                    onClick={() => { onSaveCustomQuote(null); setIsEditing(false); }}
                    className="px-2.5 py-1 rounded-lg text-xs opacity-60 hover:opacity-100 transition-all"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg btn-solid-invert text-xs font-mono font-medium transition-all btn-press flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Pin</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-sm opacity-40 font-serif-app">“</span>
              <p className="font-serif-app italic text-xs sm:text-sm text-current truncate">
                {activeQuote.text}
              </p>
              <span className="text-sm opacity-40 font-serif-app">”</span>
              <span className="text-[11px] font-mono opacity-50 shrink-0 hidden sm:inline">
                — {activeQuote.author}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {!customQuote && (
                <button
                  onClick={() => setCuratedIndex((prev) => (prev + 1) % CURATED_QUOTES.length)}
                  className="p-1 rounded-lg opacity-40 hover:opacity-100 hover:bg-current/[0.04] transition-all"
                  title="Next philosophy quote"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => {
                  setInputText(customQuote?.text || '');
                  setInputAuthor(customQuote?.author || '');
                  setIsEditing(true);
                }}
                className="p-1 rounded-lg opacity-40 hover:opacity-100 hover:bg-current/[0.04] transition-all"
                title="Edit / Pin your personal mantra"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
