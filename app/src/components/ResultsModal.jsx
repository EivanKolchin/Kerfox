import { useState } from 'react';
import { useStore } from '../store.js';

export default function ResultsModal() {
  const resultsOpen  = useStore(s => s.resultsOpen);
  const examSession  = useStore(s => s.examSession);
  const markResult   = useStore(s => s.markResult);
  const saveResults  = useStore(s => s.saveResults);
  const closeResults = useStore(s => s.closeResults);
  const examResults  = useStore(s => s.examResults);

  if (!resultsOpen || !examSession) return null;

  const { questions } = examSession;
  const marked = Object.keys(examResults).length;
  const correct = Object.values(examResults).filter(v => v === 'correct').length;

  return (
    <div className="modal-overlay">
      <div className="results-box">
        {/* Header */}
        <div className="results-header">
          <h2>Mark Your Answers</h2>
          <span className="results-score">
            {marked > 0 ? `${correct} / ${marked} marked` : 'Mark each question below'}
          </span>
        </div>

        {/* List */}
        <div className="results-body">
          {questions.map((q, i) => {
            const verdict = examResults[q.qid];
            return (
              <div key={q.qid} className="result-item">
                <div className="result-item-text">
                  <span className="result-q-num">{i + 1}. {q.num}</span>
                  <span className="result-q-short">
                    {q.textHtml.replace(/<[^>]+>/g, '').substring(0, 85)}…
                  </span>
                </div>
                <div className="result-btns">
                  <button
                    className={`result-btn correct${verdict === 'correct' ? ' selected' : ''}`}
                    onClick={() => markResult(q.qid, true)}
                  >
                    ✓ Correct
                  </button>
                  <button
                    className={`result-btn wrong${verdict === 'wrong' ? ' selected' : ''}`}
                    onClick={() => markResult(q.qid, false)}
                  >
                    �- Wrong
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="results-footer">
          <span className="results-footer-note">
            Results are saved to your exam folders automatically.
          </span>
          <button className="btn btn-primary" onClick={saveResults}>
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
