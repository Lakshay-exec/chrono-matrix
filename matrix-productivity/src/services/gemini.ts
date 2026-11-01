/**
 * AI Accountability Warden (Powered by Google Gemini + Offline Contextual Engine)
 */

const OFFLINE_PENALTIES: Record<string, string[]> = {
  Fitness: [
    "Drop and complete 50 crisp pushups right now, followed by a 2-minute wall-sit.",
    "No elevator or escalator for 48 hours: every staircase must be conquered by foot.",
    "Perform 100 jumping jacks and a 3-minute plank before touching any entertainment app."
  ],
  Code: [
    "Refactor your ugliest function or explain your project architecture out loud to a rubber duck for 15 minutes.",
    "Lock down social media and YouTube tabs: spend 45 uninterrupted minutes reading official documentation.",
    "Commit a well-documented bug fix or clean README writeup before going to bed tonight."
  ],
  Focus: [
    "Place your smartphone in another room inside a drawer for 3 consecutive hours of deep work.",
    "Write a concise one-page handwritten post-mortem explaining what broke your discipline.",
    "Zero music with lyrics and zero second screens during your next two work sessions."
  ],
  Mind: [
    "15 minutes of completely silent, unguided meditation with eyes closed in an upright chair.",
    "Turn off all notifications across phone and laptop until tomorrow morning.",
    "Write 3 hard truths about your current habits and how you will overcome them."
  ],
  Habit: [
    "Drink 1 full liter of water immediately and finish tomorrow's hardest chore before 9:00 AM.",
    "Take a 2-minute cold shower without hesitation to shock your system back into alertness.",
    "Wake up 45 minutes earlier tomorrow and tackle this task before breakfast."
  ],
  General: [
    "Execute 40 burpees or take an ice-cold shower to reset your discipline.",
    "No social media or entertainment streaming until you complete tomorrow's target.",
    "Pay a \$10 discipline tax to savings or do 60 bodyweight squats immediately."
  ]
};

export async function generateAIPunishment(params: {
  taskName: string;
  category: string;
  missedDates: string[];
}): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const prompt = `You are a stoic, razor-sharp, and witty discipline warden in a luxury productivity journal.
The user has failed to complete their task "${params.taskName}" (Category: ${params.category}) for ${params.missedDates.length} consecutive days (missed dates: ${params.missedDates.join(', ')}).
Generate a strict, creative, actionable disciplinary penalty/punishment that forces immediate accountability.
Examples: 
- Physical penalty (e.g. 50 pushups or 3-min plank before phone access)
- Digital detox (e.g. phone in another room for 3 hours)
- Uncomfortable mental reset (e.g. cold shower or hand-written reflection)
Keep it punchy, direct, and under 2 sentences. No preambles, no quotes, deliver the verdict directly.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }]
              }
            ],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 120
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate && candidate.trim()) {
          return candidate.trim();
        }
      }
    } catch (err) {
      console.warn('Gemini live API unavailable or network offline, falling back to local warden engine.', err);
    }
  }

  // Resilient offline fallback generator
  const pool = OFFLINE_PENALTIES[params.category] || OFFLINE_PENALTIES.General;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return `[Accountability Verdict] ${pool[randomIndex]} for missing "${params.taskName}" 2 days in a row.`;
}
