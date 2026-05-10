import { useStore } from '../store.js';
import { topics, allQuestions } from '../data/questions.js';

export default function Toolbar() {
  const searchQuery  = useStore(s => s.searchQuery);
  const setSearch    = useStore(s => s.setSearch);
  const hideEasy     = useStore(s => s.hideEasy);
  const toggleHideEasy = useStore(s => s.toggleHideEasy);
  const toggleFormula  = useStore(s => s.toggleFormula);
  const formulaOpen    = useStore(s => s.formulaOpen);
  const startExam      = useStore(s => s.startExam);
  const difficulties   = useStore(s => s.difficulties);

  function handleShuffle() {
    // Imperatively shuffle cards inside each section
    document.querySelectorAll('.topic-section').forEach(sec => {
      const cards = Array.from(sec.querySelectorAll('.q-card'));
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        if (i !== j) sec.insertBefore(cards[j], cards[i]);
      }
    });
  }

  function handleStartExam() {
    // Gather visible questions
    const visible = Array.from(document.querySelectorAll('.q-card:not([style*="display: none"])'))
      .map(el => el.dataset.qid)
      .filter(Boolean);

    if (visible.length < 5) {
      alert('Need at least 5 visible questions. Remove filters and try again.');
      return;
    }

    const count = Math.min(10, Math.max(5, Math.floor(visible.length * 0.12)));
    const pool  = [...visible].sort(() => Math.random() - 0.5).slice(0, count);
    const qs    = pool.map(qid => allQuestions.find(q => q.qid === qid)).filter(Boolean);
    const totalMarks = qs.reduce((s, q) => s + (q.marks || 4), 0);
    startExam(qs, totalMarks);
  }

  return (
    <div className="toolbar">
      {/* Search */}
      <div className="toolbar-search">
        <span className="toolbar-search-icon">🔍</span>
        <input
          type="search"
          className="toolbar-search-input"
          placeholder="Search questions, keywords…"
          value={searchQuery}
          onChange={e => setSearch(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="toolbar-divider" />

      {/* Shuffle */}
      <button className="toolbar-btn" onClick={handleShuffle} title="Randomise card order">
        ⇄ Shuffle
      </button>

      {/* Hide Easy */}
      <button
        className={`toolbar-btn${hideEasy ? ' active' : ''}`}
        onClick={toggleHideEasy}
        title={hideEasy ? 'Show easy questions' : 'Hide easy questions'}
      >
        {hideEasy ? '👁 Show Easy' : '🙈 Hide Easy'}
      </button>

      <div className="toolbar-divider" />

      {/* Formula Sheet */}
      <button
        className={`toolbar-btn${formulaOpen ? ' active' : ''}`}
        onClick={toggleFormula}
        title="Toggle formula cheat sheet"
      >
        ƒ Formulas
      </button>

      {/* Mock Exam */}
      <button
        className="toolbar-btn toolbar-btn-exam"
        onClick={handleStartExam}
        title="Start mock exam"
      >
        ⏱ Mock Exam
      </button>
    </div>
  );
}
