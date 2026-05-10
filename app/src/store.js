import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // ── UI state (not persisted) ──────────────────────────────
      activeModule: 'lasers',
      searchQuery: '',
      activeFolder: 'all',
      formulaOpen: false,
      examOpen: false,
      resultsOpen: false,
      expandedCards: {},   // { [qid]: true }
      examSession: null,   // { questions, totalMarks, startSecs }
      examResults: {},     // { [qid]: 'correct' | 'wrong' }  (current session)

      // ── Persistent state ─────────────────────────────────────
      hideEasy: false,
      difficulties: {},    // { [qid]: 'easy' | 'medium' | 'hard' }
      records: {},         // { [qid]: { right, wrong } }

      // ── Actions ───────────────────────────────────────────────
      setModule: (mod) => set({ activeModule: mod }),
      setSearch: (q) => set({ searchQuery: q }),
      setFolder: (f) => set({ activeFolder: f }),
      toggleHideEasy: () => set(s => ({ hideEasy: !s.hideEasy })),
      toggleFormula: () => set(s => ({ formulaOpen: !s.formulaOpen })),

      toggleCard: (qid) =>
        set(s => ({
          expandedCards: s.expandedCards[qid]
            ? Object.fromEntries(Object.entries(s.expandedCards).filter(([k]) => k !== qid))
            : { ...s.expandedCards, [qid]: true },
        })),

      expandAll: (qids) =>
        set({ expandedCards: Object.fromEntries(qids.map(id => [id, true])) }),

      setDifficulty: (qid, level) =>
        set(s => ({
          difficulties: {
            ...s.difficulties,
            [qid]: s.difficulties[qid] === level ? undefined : level,
          },
        })),

      // ── Exam ──────────────────────────────────────────────────
      startExam: (questions, totalMarks) =>
        set({
          examOpen: true,
          examSession: { questions, totalMarks, startSecs: totalMarks * 120 },
          examResults: {},
        }),

      closeExam: () => set({ examOpen: false, examSession: null }),

      submitExam: () =>
        set(s => ({ examOpen: false, resultsOpen: true })),

      markResult: (qid, correct) =>
        set(s => ({ examResults: { ...s.examResults, [qid]: correct ? 'correct' : 'wrong' } })),

      saveResults: () =>
        set(s => {
          const newRecs = { ...s.records };
          const newDiffs = { ...s.difficulties };

          Object.entries(s.examResults).forEach(([qid, verdict]) => {
            const rec = newRecs[qid] || { right: 0, wrong: 0 };
            if (verdict === 'correct') {
              rec.right++;
              // Auto-upgrade to easy if right 3+ more times than wrong
              if (rec.right >= 3 && rec.right > rec.wrong + 2 && !newDiffs[qid]) {
                newDiffs[qid] = 'easy';
              }
            } else {
              rec.wrong++;
              // Auto-flag hard if unrated and wrong
              if (!newDiffs[qid]) newDiffs[qid] = 'hard';
            }
            newRecs[qid] = rec;
          });

          return { records: newRecs, difficulties: newDiffs, resultsOpen: false, examSession: null };
        }),

      closeResults: () => set({ resultsOpen: false }),

      // ── Derived helpers ───────────────────────────────────────
      getFolder: (qid) => {
        const rec = get().records[qid] || { right: 0, wrong: 0 };
        const total = rec.right + rec.wrong;
        if (!total) return 'unrated';
        if (rec.right >= 3 && rec.right > rec.wrong * 2) return 'mastered';
        if (rec.right >= rec.wrong) return 'getting-there';
        return 'needs-practice';
      },

      getStats: () => {
        const { difficulties } = get();
        const counts = { easy: 0, medium: 0, hard: 0, unrated: 0 };
        Object.values(difficulties).forEach(d => {
          if (d) counts[d] = (counts[d] || 0) + 1;
          else counts.unrated++;
        });
        return counts;
      },
    }),
    {
      name: 'physics-exam-bank-v2',
      partialize: s => ({
        hideEasy: s.hideEasy,
        difficulties: s.difficulties,
        records: s.records,
      }),
    }
  )
);
