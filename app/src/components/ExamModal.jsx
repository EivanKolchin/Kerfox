import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store.js';

function pad(n) { return String(n).padStart(2, '0'); }
function fmt(s) {
  const abs = Math.abs(s);
  return (s < 0 ? '-' : '') + pad(Math.floor(abs / 60)) + ':' + pad(abs % 60);
}

function TimerCircle({ seconds, totalSeconds }) {
  const r = 22, circ = 2 * Math.PI * r;
  const pct = Math.max(0, seconds / totalSeconds);
  const offset = circ * (1 - pct);
  const color = seconds <= 0 ? '#ef4444' : seconds <= 300 ? '#f59e0b' : '#c9940c';

  return (
    <svg className="exam-timer-svg" width="60" height="60" viewBox="0 0 56 56">
      <circle className="timer-track" cx="28" cy="28" r={r} strokeWidth="4" />
      <circle
        className="timer-fill"
        cx="28" cy="28" r={r} strokeWidth="4"
        stroke={color}
        strokeDasharray={`${circ} ${circ}`}
        strokeDashoffset={offset}
      />
      <text className="timer-text-time" x="28" y="26" dy="0.35em">{fmt(seconds)}</text>
      <text className="timer-text-label" x="28" y="38">remaining</text>
    </svg>
  );
}

export default function ExamModal() {
  const examOpen    = useStore(s => s.examOpen);
  const examSession = useStore(s => s.examSession);
  const closeExam   = useStore(s => s.closeExam);
  const submitExam  = useStore(s => s.submitExam);

  const [seconds, setSeconds] = useState(0);
  const [expired, setExpired] = useState(false);
  const [openAns, setOpenAns] = useState({});
  const timerRef = useRef(null);

  useEffect(() => {
    if (!examOpen || !examSession) return;
    setSeconds(examSession.startSecs);
    setExpired(false);
    setOpenAns({});

    timerRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { setExpired(true); clearInterval(timerRef.current); return 0; }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [examOpen, examSession]);

  if (!examOpen || !examSession) return null;

  const { questions, totalMarks, startSecs } = examSession;

  function handleAbandon() {
    clearInterval(timerRef.current);
    closeExam();
  }

  function handleSubmit() {
    clearInterval(timerRef.current);
    submitExam();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && handleAbandon()}>
      <div className="exam-box">
        {/* Header */}
        <div className="exam-header">
          <h2>Mock Exam</h2>
          <div className="exam-header-right">
            <span className="exam-meta-chip">{questions.length} questions</span>
            <span className="exam-meta-chip">{totalMarks} marks</span>
            <TimerCircle seconds={seconds} totalSeconds={startSecs} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="exam-progress-bar">
          <div
            className="exam-progress-fill"
            style={{ width: `${Math.round(seconds / startSecs * 100)}%` }}
          />
        </div>

        {/* Questions */}
        <div className="exam-body">
          {questions.map((q, i) => (
            <div key={q.qid} className="exam-q">
              <div className="exam-q-header">
                <span className="exam-q-num">{i + 1}. {q.num}</span>
                <span className="exam-q-marks">{q.marks}m</span>
              </div>
              <div
                className="exam-q-text"
                dangerouslySetInnerHTML={{ __html: q.textHtml }}
              />
              <div
                className={`exam-ans-wrap${openAns[q.qid] ? ' open' : ''}`}
                dangerouslySetInnerHTML={{ __html: q.answerHtml }}
              />
              <button
                className="exam-show-btn"
                onClick={() => setOpenAns(prev => ({ ...prev, [q.qid]: !prev[q.qid] }))}
              >
                {openAns[q.qid] ? 'Hide Answer' : 'Show Answer'}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="exam-footer">
          {expired && <span className="exam-timer-expired">⏰ Time's up!</span>}
          <button className="btn btn-ghost" onClick={handleAbandon}>Abandon</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Submit & Mark →</button>
        </div>
      </div>
    </div>
  );
}
