import { useStore } from '../store.js';

const DIFF_LABELS = { easy: 'Easy', medium: 'Med', hard: 'Hard' };

export default function QuestionCard({ question, topicId }) {
  const { qid, num, textHtml, marks, answerHtml, advanced } = question;

  const expandedCards = useStore(s => s.expandedCards);
  const toggleCard    = useStore(s => s.toggleCard);
  const difficulties  = useStore(s => s.difficulties);
  const setDifficulty = useStore(s => s.setDifficulty);
  const records       = useStore(s => s.records);
  const hideEasy      = useStore(s => s.hideEasy);
  const searchQuery   = useStore(s => s.searchQuery);
  const activeFolder  = useStore(s => s.activeFolder);
  const getFolder     = useStore(s => s.getFolder);

  const diff   = difficulties[qid];
  const rec    = records[qid] || { right: 0, wrong: 0 };
  const isOpen = !!expandedCards[qid];
  const folder = getFolder(qid);

  // Visibility filters
  if (hideEasy && diff === 'easy') return null;
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    const text = (textHtml + answerHtml).toLowerCase();
    if (!text.includes(q)) return null;
  }
  if (activeFolder !== 'all' && folder !== activeFolder) return null;

  const cardClass = [
    'q-card',
    advanced ? 'advanced' : '',
    diff ? `diff-${diff}` : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClass} data-qid={qid}>
      {/* ── Header (clickable) ── */}
      <div className="q-card-head" onClick={() => toggleCard(qid)}>
        <div className="q-num-badge">{num.replace('Q', '').replace('H', 'H')}</div>
        <div
          className="q-card-text"
          dangerouslySetInnerHTML={{ __html: textHtml }}
        />
        <div className="q-card-meta">
          <span className="q-marks-badge">{marks}m</span>
          {diff && (
            <span className={`q-diff-badge ${diff}`}>{DIFF_LABELS[diff]}</span>
          )}
          <button className="q-toggle-btn">
            {isOpen ? '▴ Hide' : '▾ Show'}
          </button>
        </div>
      </div>

      {/* ── Answer (animated accordion) ── */}
      <div className={`q-answer-grid${isOpen ? ' open' : ''}`}>
        <div className="q-answer-inner">
          <div className="q-answer-body">
            <div dangerouslySetInnerHTML={{ __html: answerHtml }} />

            {/* ── Difficulty buttons + record ── */}
            <div className="diff-row">
              <span className="diff-label">Rate:</span>
              {['easy', 'medium', 'hard'].map(level => (
                <button
                  key={level}
                  className={`diff-btn diff-btn-${level}${diff === level ? ' active' : ''}`}
                  onClick={e => { e.stopPropagation(); setDifficulty(qid, level); }}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
              {(rec.right + rec.wrong > 0) && (
                <div className="record-badge">
                  <span className="record-right">✓{rec.right}</span>
                  <span className="record-wrong">�-{rec.wrong}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
