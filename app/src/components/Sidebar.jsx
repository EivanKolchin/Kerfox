import { useRef, useEffect } from 'react';
import { useStore } from '../store.js';
import { topics } from '../data/questions.js';

const MODULES = [
  { id: 'maths',  label: 'Maths Methods 1b' },
  { id: 'lasers', label: 'Lasers & Quanta 1' },
  { id: 'waves',  label: 'Waves' },
  { id: 'energy', label: 'Energy & Matter' },
];

const MODULE_HEADER = {
  lasers: { code: 'PHYS1204', name: 'Lasers & Quanta 1' },
  maths:  { code: 'PHYS1204', name: 'Mathematical Methods 1b' },
  waves:  { code: 'PHYS1204', name: 'Waves' },
  energy: { code: 'PHYS1204', name: 'Energy & Matter' },
};

const FOLDER_META = [
  { id: 'needs-practice', icon: '📚', label: 'Needs Practice', countKey: 'fc-practice' },
  { id: 'getting-there',  icon: '📈', label: 'Getting There',  countKey: 'fc-getting'  },
  { id: 'mastered',       icon: '⭐', label: 'Mastered',       countKey: 'fc-mastered' },
  { id: 'all',            icon: '📋', label: 'All Questions'                            },
];

function ProgressRing({ pct }) {
  const r = 22, circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle className="progress-ring-track" cx="28" cy="28" r={r} strokeWidth="5" />
      <circle
        className="progress-ring-fill"
        cx="28" cy="28" r={r} strokeWidth="5"
        strokeDasharray={`${circ} ${circ}`}
        strokeDashoffset={offset}
      />
      <text className="progress-ring-pct" x="28" y="25" dy="0.35em">{pct}%</text>
      <text className="progress-ring-label" x="28" y="37">done</text>
    </svg>
  );
}

export default function Sidebar() {
  const activeModule = useStore(s => s.activeModule);
  const setModule    = useStore(s => s.setModule);
  const activeFolder = useStore(s => s.activeFolder);
  const setFolder    = useStore(s => s.setFolder);
  const difficulties = useStore(s => s.difficulties);
  const records      = useStore(s => s.records);
  const getFolder    = useStore(s => s.getFolder);

  const isLasers = activeModule === 'lasers';
  const header = MODULE_HEADER[activeModule] || MODULE_HEADER.lasers;

  // Stats
  const totalQ = topics.reduce((n, t) => n + t.questions.length, 0);
  const easy   = Object.values(difficulties).filter(d => d === 'easy').length;
  const medium = Object.values(difficulties).filter(d => d === 'medium').length;
  const hard   = Object.values(difficulties).filter(d => d === 'hard').length;
  const rated  = easy + medium + hard;
  const pct    = totalQ ? Math.round(rated / totalQ * 100) : 0;

  // Folder counts
  const allQids = topics.flatMap(t => t.questions.map(q => q.qid));
  const fc = { 'needs-practice': 0, 'getting-there': 0, mastered: 0 };
  allQids.forEach(qid => {
    const f = getFolder(qid);
    if (fc[f] !== undefined) fc[f]++;
  });

  // Sidebar active link tracking
  const navRef = useRef(null);
  useEffect(() => {
    if (!navRef.current) return;
    const links = navRef.current.querySelectorAll('a');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(a => a.classList.remove('active'));
          const link = navRef.current?.querySelector(`a[href="#${e.target.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.topic-section').forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, [isLasers]);

  return (
    <aside className="sidebar">
      {/* Module Tabs */}
      <div className="module-tabs">
        {MODULES.map(m => (
          <div
            key={m.id}
            className={`module-tab${activeModule === m.id ? ' active' : ''}`}
            onClick={() => setModule(m.id)}
          >
            <span className="module-tab-dot" />
            {m.label}
          </div>
        ))}
      </div>

      <div className="sidebar-scroll">
        {/* Module Header */}
        <div className="sidebar-header">
          <div className="sidebar-header-code">{header.code}</div>
          <div className="sidebar-header-name">{header.name}</div>
        </div>

        {isLasers && (
          <>
            {/* Progress */}
            <div className="sidebar-section">
              <div className="sidebar-section-label">Progress</div>
              <div className="progress-ring-wrap">
                <ProgressRing pct={pct} />
                <div className="progress-chips">
                  <div className="progress-chip">
                    <span className="chip-dot chip-easy-dot" />
                    <span className="chip-text">Easy</span>
                    <span className="chip-val">{easy}</span>
                  </div>
                  <div className="progress-chip">
                    <span className="chip-dot chip-med-dot" />
                    <span className="chip-text">Medium</span>
                    <span className="chip-val">{medium}</span>
                  </div>
                  <div className="progress-chip">
                    <span className="chip-dot chip-hard-dot" />
                    <span className="chip-text">Hard</span>
                    <span className="chip-val">{hard}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Folders */}
            <div className="sidebar-section">
              <div className="sidebar-section-label">Exam Folders</div>
              {FOLDER_META.map(f => (
                <div
                  key={f.id}
                  className={`folder-item${activeFolder === f.id ? ' active' : ''}`}
                  onClick={() => setFolder(f.id)}
                >
                  <span className="folder-icon">{f.icon}</span>
                  <span>{f.label}</span>
                  {f.id !== 'all' && (
                    <span className="folder-count">{fc[f.id] ?? 0}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Topic nav */}
            <div className="sidebar-section" style={{ borderBottom: 'none', paddingBottom: '1rem' }}>
              <div className="sidebar-section-label">Topics</div>
              <nav ref={navRef}>
                {topics.map(t => (
                  <a key={t.id} href={`#${t.id}`} className="topic-nav-link"
                    onClick={e => {
                      e.preventDefault();
                      document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    {t.topicNum} · {t.title.length > 28 ? t.title.slice(0, 28) + '…' : t.title}
                  </a>
                ))}
              </nav>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
