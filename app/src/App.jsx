import { useEffect, useState } from 'react';
import { useStore } from './store.js';
import { topics } from './data/questions.js';
import Sidebar from './components/Sidebar.jsx';
import Toolbar from './components/Toolbar.jsx';
import QuestionCard from './components/QuestionCard.jsx';
import FormulaPanel from './components/FormulaPanel.jsx';
import ExamModal from './components/ExamModal.jsx';
import ResultsModal from './components/ResultsModal.jsx';
import LoginPage from './components/LoginPage.jsx';
import GuidesPage from './components/GuidesPage.jsx';

const LEARNING_LEVELS = [
  {
    id: 'gcse',
    title: 'GCSEs',
    subtitle: 'Build a strong foundation across core school subjects.',
    summary: 'Maths, sciences, languages and the wider school curriculum.',
    accent: 'linear-gradient(135deg, rgba(12,29,53,0.95), rgba(46,65,128,0.92))',
  },
  {
    id: 'alevels',
    title: 'A Levels',
    subtitle: 'Step up into deeper, exam-ready subject mastery.',
    summary: 'Focused subject study with more stretch, detail and problem solving.',
    accent: 'linear-gradient(135deg, rgba(115,58,18,0.96), rgba(201,148,12,0.88))',
  },
  {
    id: 'uni',
    title: 'University',
    subtitle: 'Open first-year course pathways and specialist modules.',
    summary: 'A living platform for degree-level learning, starting with physics.',
    accent: 'linear-gradient(135deg, rgba(12,47,39,0.96), rgba(22,101,52,0.88))',
  },
];

const DEFAULT_EXAM_BOARDS = ['AQA', 'Pearson Edexcel', 'OCR', 'WJEC Eduqas', 'CCEA'];

const COURSE_OPTIONS = {
  gcse: [
    { id: 'gcse-maths', label: 'GCSE Mathematics', description: 'Number, algebra, ratio, geometry and data.', icon: '∑', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-further-maths', label: 'GCSE Further Mathematics', description: 'Stretch problem solving and advanced algebra.', icon: '∞', boards: ['AQA', 'Pearson Edexcel', 'OCR', 'WJEC Eduqas'] },
    { id: 'gcse-english-language', label: 'GCSE English Language', description: 'Reading, writing and clear communication.', icon: '✎', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-english-literature', label: 'GCSE English Literature', description: 'Poetry, prose, drama and literary analysis.', icon: '📚', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-combined-science', label: 'GCSE Combined Science', description: 'Integrated biology, chemistry and physics.', icon: '🧪', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-biology', label: 'GCSE Biology', description: 'Cells, organisms, genetics and ecology.', icon: '🧬', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-chemistry', label: 'GCSE Chemistry', description: 'Atoms, bonding, reactions and the periodic table.', icon: '⚗️', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-physics', label: 'GCSE Physics', description: 'Forces, energy, waves, electricity and space.', icon: '⚛️', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-computer-science', label: 'GCSE Computer Science', description: 'Programming, logic, data and systems.', icon: '⌘', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-history', label: 'GCSE History', description: 'People, power, change and evidence.', icon: '⌛', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-geography', label: 'GCSE Geography', description: 'Places, environments and global systems.', icon: '⛰', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-religious-studies', label: 'GCSE Religious Studies', description: 'Belief systems, ethics and philosophy.', icon: '✧', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-french', label: 'GCSE French', description: 'Grammar, speaking, listening, reading and writing.', icon: 'FR', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-spanish', label: 'GCSE Spanish', description: 'Core language skills with cultural context.', icon: 'ES', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-german', label: 'GCSE German', description: 'Communication skills and language confidence.', icon: 'DE', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-business', label: 'GCSE Business', description: 'Enterprise, finance, marketing and operations.', icon: '£', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-economics', label: 'GCSE Economics', description: 'Markets, policy and economic reasoning.', icon: '📈', boards: ['AQA', 'Pearson Edexcel', 'OCR'] },
    { id: 'gcse-psychology', label: 'GCSE Psychology', description: 'Human behaviour and research methods.', icon: '◌', boards: ['AQA', 'Pearson Edexcel', 'OCR'] },
    { id: 'gcse-sociology', label: 'GCSE Sociology', description: 'Society, identity, inequality and institutions.', icon: '⛶', boards: ['AQA', 'OCR', 'WJEC Eduqas'] },
    { id: 'gcse-media-studies', label: 'GCSE Media Studies', description: 'Media language, audience and representation.', icon: '◍', boards: ['AQA', 'OCR', 'WJEC Eduqas'] },
    { id: 'gcse-art-design', label: 'GCSE Art and Design', description: 'Creative practice, techniques and portfolio work.', icon: '🖌', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-design-technology', label: 'GCSE Design and Technology', description: 'Design process, materials and practical problem solving.', icon: '⛭', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-food-nutrition', label: 'GCSE Food Preparation and Nutrition', description: 'Food science, nutrition and practical cooking.', icon: '🍽', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-drama', label: 'GCSE Drama', description: 'Performance, interpretation and theatre making.', icon: '🎭', boards: ['AQA', 'Pearson Edexcel', 'OCR', 'WJEC Eduqas'] },
    { id: 'gcse-music', label: 'GCSE Music', description: 'Performance, composition and listening.', icon: '♫', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-pe', label: 'GCSE Physical Education', description: 'Sport science, fitness and performance.', icon: '⚽', boards: DEFAULT_EXAM_BOARDS },
    { id: 'gcse-citizenship', label: 'GCSE Citizenship Studies', description: 'Law, democracy and social participation.', icon: '☰', boards: ['AQA', 'Pearson Edexcel', 'OCR'] },
    { id: 'gcse-dance', label: 'GCSE Dance', description: 'Performance, choreography and analysis.', icon: '◠', boards: ['AQA', 'Pearson Edexcel'] },
    { id: 'gcse-statistics', label: 'GCSE Statistics', description: 'Data handling, probability and statistical reasoning.', icon: '%', boards: ['AQA', 'Pearson Edexcel'] },
  ],
  alevels: [
    { id: 'alevel-maths', label: 'A Level Mathematics', description: 'Pure maths, statistics and mechanics.', icon: '∫', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-further-maths', label: 'A Level Further Mathematics', description: 'Proof, matrices, complex numbers and more.', icon: '∮', boards: ['AQA', 'Pearson Edexcel', 'OCR', 'WJEC Eduqas'] },
    { id: 'alevel-physics', label: 'A Level Physics', description: 'Fields, mechanics, thermal physics and quantum ideas.', icon: '⚛️', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-chemistry', label: 'A Level Chemistry', description: 'Structure, energetics, kinetics and synthesis.', icon: '🧪', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-biology', label: 'A Level Biology', description: 'Physiology, genetics, microbes and ecosystems.', icon: '🧫', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-computer-science', label: 'A Level Computer Science', description: 'Algorithms, architecture and programming.', icon: '💻', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-economics', label: 'A Level Economics', description: 'Markets, macroeconomics and policy.', icon: '£', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-business', label: 'A Level Business', description: 'Strategy, leadership, finance and operations.', icon: '▣', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-psychology', label: 'A Level Psychology', description: 'Memory, behaviour, cognition and research.', icon: '◌', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-sociology', label: 'A Level Sociology', description: 'Social theory, culture and social change.', icon: '⛶', boards: ['AQA', 'OCR', 'WJEC Eduqas'] },
    { id: 'alevel-history', label: 'A Level History', description: 'Interpretation, argument and historical depth.', icon: '⌛', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-geography', label: 'A Level Geography', description: 'Human and physical geography with fieldwork.', icon: '⛰', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-politics', label: 'A Level Politics', description: 'Political systems, ideologies and governance.', icon: '⌘', boards: ['AQA', 'Pearson Edexcel'] },
    { id: 'alevel-law', label: 'A Level Law', description: 'Legal principles, institutions and case analysis.', icon: '⚖', boards: ['AQA', 'OCR', 'WJEC Eduqas'] },
    { id: 'alevel-philosophy', label: 'A Level Philosophy', description: 'Epistemology, ethics and argumentation.', icon: 'Φ', boards: ['AQA', 'OCR', 'WJEC Eduqas'] },
    { id: 'alevel-religious-studies', label: 'A Level Religious Studies', description: 'Theology, ethics and philosophy of religion.', icon: '✧', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-english-literature', label: 'A Level English Literature', description: 'Texts, context, critical perspectives and writing.', icon: '📚', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-english-language', label: 'A Level English Language', description: 'Linguistics, discourse and language analysis.', icon: '✎', boards: ['AQA', 'Pearson Edexcel', 'OCR'] },
    { id: 'alevel-french', label: 'A Level French', description: 'Advanced language and cultural study.', icon: 'FR', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-spanish', label: 'A Level Spanish', description: 'High-level communication and literature options.', icon: 'ES', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-german', label: 'A Level German', description: 'Advanced grammar, analysis and cultural context.', icon: 'DE', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-art-design', label: 'A Level Art and Design', description: 'Personal investigation and studio development.', icon: '🖌', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-design-technology', label: 'A Level Design and Technology', description: 'Design engineering and iterative product development.', icon: '⛭', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-media-studies', label: 'A Level Media Studies', description: 'Media industries, audiences and representation.', icon: '◍', boards: ['AQA', 'OCR', 'WJEC Eduqas'] },
    { id: 'alevel-music', label: 'A Level Music', description: 'Composition, listening and performance.', icon: '♫', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-drama', label: 'A Level Drama and Theatre', description: 'Performance practice and textual exploration.', icon: '🎭', boards: ['AQA', 'Pearson Edexcel', 'OCR', 'WJEC Eduqas'] },
    { id: 'alevel-pe', label: 'A Level Physical Education', description: 'Biomechanics, physiology and sport psychology.', icon: '⚽', boards: DEFAULT_EXAM_BOARDS },
    { id: 'alevel-environmental-science', label: 'A Level Environmental Science', description: 'Systems thinking for sustainability and policy.', icon: '🌍', boards: ['AQA', 'Pearson Edexcel'] },
    { id: 'alevel-statistics', label: 'A Level Statistics', description: 'Advanced inference and data modelling.', icon: '%', boards: ['AQA', 'Pearson Edexcel'] },
    { id: 'alevel-epq', label: 'Extended Project Qualification (EPQ)', description: 'Independent research and project delivery.', icon: '▤', boards: ['AQA', 'Pearson Edexcel', 'OCR', 'WJEC Eduqas'] },
  ],
  uni: [
    { id: 'uni-physics', label: 'Physics', description: 'Core physical theory, mechanics, and quanta. Features live PHYS1204 module.', icon: '⚛️', implemented: true, module: 'lasers' },
    { id: 'uni-maths', label: 'Mathematics', description: 'Analysis, algebra, modelling and methods.', icon: '∫' },
    { id: 'uni-compsci', label: 'Computer Science', description: 'Algorithms, software engineering and computation.', icon: '⌘' },
    { id: 'uni-engineering', label: 'Engineering', description: 'Mechanical, civil, aeronautical and electrical foundations.', icon: '⛭' },
    { id: 'uni-medicine', label: 'Medicine', description: 'Human biology, systems and clinical foundations.', icon: '⚕' },
    { id: 'uni-biology', label: 'Biological Sciences', description: 'Molecular life sciences, genetics and organisms.', icon: '🧫' },
    { id: 'uni-chemistry', label: 'Chemistry', description: 'Molecular structure, reaction pathways and lab practice.', icon: '⚗️' },
    { id: 'uni-economics', label: 'Economics', description: 'Microeconomics, macroeconomics and quantitative tools.', icon: '📈' },
    { id: 'uni-law', label: 'Law', description: 'Public law, tort, contract and legal reasoning.', icon: '⚖' },
    { id: 'uni-philosophy', label: 'Philosophy', description: 'Logic, ethics and modern philosophical problems.', icon: 'Φ' },
    { id: 'uni-psychology', label: 'Psychology', description: 'Cognition, behaviour and research methods.', icon: '◌' },
    { id: 'uni-history', label: 'History', description: 'Primary-source analysis across historical periods.', icon: '⌛' },
    { id: 'uni-literature', label: 'Literature', description: 'Close reading, criticism and historical context.', icon: '📚' },
    { id: 'uni-politics', label: 'Politics & International Relations', description: 'Political theory, institutions and global affairs.', icon: '⌬' },
    { id: 'uni-geography', label: 'Geography & Earth Sciences', description: 'Physical and human geography methods, Earth systems.', icon: '⛰' },
    { id: 'uni-accounting', label: 'Accounting & Finance', description: 'Financial reporting, management accounting and corporate finance.', icon: '🧮' },
    { id: 'uni-sociology', label: 'Sociology & Criminology', description: 'Social behavior, institutions and criminal justice systems.', icon: '🤝' },
    { id: 'uni-nursing', label: 'Nursing & Midwifery', description: 'Clinical practice, patient care and healthcare sciences.', icon: '🩺' },
    { id: 'uni-oceanography', label: 'Oceanography & Marine Biology', description: 'Marine ecosystems, ocean dynamics and climate.', icon: '🌊' },
    { id: 'uni-music', label: 'Music', description: 'Performance, composition and musicology.', icon: '🎵' },
    { id: 'uni-education', label: 'Education', description: 'Pedagogy, learning theory and educational psychology.', icon: '🎓' },
    { id: 'uni-languages', label: 'Modern Languages & Linguistics', description: 'Language structure, translation and cultural studies.', icon: '🗣️' },
    { id: 'uni-archaeology', label: 'Archaeology & Anthropology', description: 'Human origins, ancient societies and material culture.', icon: '🏺' },
    { id: 'uni-fineart', label: 'Fine Art & Design', description: 'Visual arts, studio practice and art history.', icon: '🎨' },
  ],
};

function GlobalSearchBar({ levelId, onLevelChange, searchQuery, onSearchQueryChange, inCourse }) {
  return (
    <div className="global-search-container">
      <div className="global-search-bar">
        {!inCourse && (
          <select 
            className="global-search-level"
            value={levelId || "all"}
            onChange={e => onLevelChange(e.target.value === "all" ? null : e.target.value)}
          >
            <option value="all">Pick your level</option>
            {LEARNING_LEVELS.map(l => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        )}
        <div className="global-search-input-wrapper">
          <span className="global-search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input 
            type="search"
            className="global-search-input"
            placeholder={inCourse ? "Search course modules..." : "Search courses..."}
            value={searchQuery}
            onChange={e => onSearchQueryChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <div className="brand-mark">
      <img src="/kerfox.png" alt="Kerfox logo" />
    </div>
  );
}

function LandingTopBar({ onBack, onLogin }) {
  return (
    <div className="landing-topbar">
      <div className="landing-brand">
        <LogoMark />
        <div>
          <div className="landing-brand-kicker">Kerfox</div>
          <div className="landing-brand-subtitle">Open learning platform</div>
        </div>
      </div>
      <div className="landing-topbar-actions">
        {onBack && (
          <button className="ghost-chip" onClick={onBack}>
            ← Back to learning hub
          </button>
        )}
        {onLogin && (
          <button className="solid-chip" onClick={onLogin}>
            Log in
          </button>
        )}
      </div>
    </div>
  );
}

function LevelCard({ level, onSelect }) {
  return (
    <button className="level-card" style={{ '--level-accent': level.accent }} onClick={() => onSelect(level.id)}>
      <span className="level-card-badge">Choose path</span>
      <span className="level-card-title">{level.title}</span>
      <span className="level-card-subtitle">{level.subtitle}</span>
      <span className="level-card-summary">{level.summary}</span>
      <span className="level-card-cta">Open {level.title.toLowerCase()}</span>
    </button>
  );
}

function CourseCard({ course, levelId, selectedBoard, onBoardChange, onSelect }) {
  const isLive = !!course.implemented;
  const boardOptions = course.boards || DEFAULT_EXAM_BOARDS;
  const needsBoard = levelId === 'gcse' || levelId === 'alevels';

  function handleBoardChange(e) {
    onBoardChange(course.id, e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(course);
    }
  }

  return (
    <div
      className={`course-card${isLive ? ' live' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(course)}
      onKeyDown={handleKeyDown}
      aria-label={`Open ${course.label}`}
    >
      <div className="course-card-icon">{course.icon}</div>
      <div className="course-card-body">
        {course.provider && <div className="course-card-provider">{course.provider}</div>}
        <div className="course-card-label-row">
          <span className="course-card-label">{course.label}</span>
          <span className={`course-card-state${isLive ? ' live' : ''}`}>
            {isLive ? 'Live' : 'Coming soon'}
          </span>
        </div>
        <p className="course-card-description">{course.description}</p>
        {needsBoard && (
          <label
            className="course-board-picker"
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
          >
            <span>Exam board</span>
            <select value={selectedBoard || boardOptions[0]} onChange={handleBoardChange}>
              {boardOptions.map(board => (
                <option key={board} value={board}>{board}</option>
              ))}
            </select>
          </label>
        )}
      </div>
      <span className="course-card-arrow">→</span>
    </div>
  );
}

function LandingHub({ onSelectLevel, onLogin, onOpenGuides, searchQuery, onSearchQueryChange, selectedBoards, onBoardChange, onSelectCourse }) {
  return (
    <div className="landing-shell">
      <div className="landing-orb landing-orb-one" />
      <div className="landing-orb landing-orb-two" />
      <div className="landing-grid" />

      <LandingTopBar onLogin={onLogin} />
      <GlobalSearchBar levelId={null} onLevelChange={onSelectLevel} searchQuery={searchQuery} onSearchQueryChange={onSearchQueryChange} />

      {searchQuery ? (
        <main className="landing-main">
          <section className="course-hero">
            <h1>Search Results</h1>
            <p>Matching "{searchQuery}" across all levels</p>
          </section>
          <section className="course-grid">
            {LEARNING_LEVELS.flatMap(lvl => (COURSE_OPTIONS[lvl.id] || []).map(c => ({...c, levelId: lvl.id})))
              .filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase()) || (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase())))
              .map(course => (
                <CourseCard 
                  key={`${course.levelId}-${course.id}`} 
                  course={course} 
                  levelId={course.levelId} 
                  selectedBoard={selectedBoards[course.id]}
                  onBoardChange={onBoardChange}
                  onSelect={(c) => { onSelectLevel(course.levelId); setTimeout(() => onSelectCourse(c), 0); }}
                />
            ))}
          </section>
        </main>
      ) : (
      <>
        <nav className="landing-quick-nav" aria-label="Page pointers">
        <button className="quick-nav-btn" onClick={() => onOpenGuides('learning')}>Optimising your learning</button>
        <button className="quick-nav-btn" onClick={() => onOpenGuides('health')}>Taking care of your health</button>
        <button className="quick-nav-btn" onClick={() => onOpenGuides('exam')}>Exam preparation guides</button>
        <span className="quick-nav-sep" />
        <a href="#our-mission">Our mission</a>
        <a href="#contribute">How to contribute</a>
        <a href="#roadmap">What is next</a>
      </nav>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <span className="landing-hero-kicker">Modern open learning</span>
            <h1>Pick your level, then jump straight into the right course.</h1>
            <p>
              Start with GCSEs, A Levels or university, then choose the subject you want to study.
              The platform is built to grow with your content, beginning with university physics year one.
            </p>
          </div>
        </section>

        <section className="level-grid">
          {LEARNING_LEVELS.map(level => (
            <LevelCard key={level.id} level={level} onSelect={onSelectLevel} />
          ))}
        </section>

        <section id="our-mission" className="landing-info-grid">
          <article className="landing-info-card">
            <h2>Our mission</h2>
            <p>
              Education should be open, practical, and available to everyone. Kerfox is being built as a
              shared platform where learners can revise deeply and contributors can keep improving content.
            </p>
          </article>

          <article id="contribute" className="landing-info-card">
            <h2>How you can contribute</h2>
            <p>
              Add questions, improve solutions, refine UI, fix bugs, or propose new subjects. Small changes
              are valuable, and each contribution helps another learner move forward.
            </p>
          </article>

          <article id="roadmap" className="landing-info-card">
            <h2>What is next</h2>
            <p>
              Authentication, saved progress, collaborative authoring, and broader subject support are being
              prepared now so the platform can grow with the community.
            </p>
          </article>
        </section>
      </main>
      </>
      )}
    </div>
  );
}

function CourseHub({ level, selectedBoards, onBoardChange, onSelectCourse, onBack, onBackHome, searchQuery, onSearchQueryChange, onSelectLevel }) {
  const allCourses = COURSE_OPTIONS[level.id] || [];
  const courses = searchQuery 
    ? allCourses.filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase()) || (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase())))
    : allCourses;

  return (
    <div className="landing-shell course-shell">
      <div className="landing-orb landing-orb-one" />
      <div className="landing-orb landing-orb-two" />
      <div className="landing-grid" />

      <LandingTopBar onBack={onBackHome} />
      <GlobalSearchBar levelId={level.id} onLevelChange={onSelectLevel} searchQuery={searchQuery} onSearchQueryChange={onSearchQueryChange} />

      <main className="landing-main">
        <section className="course-hero">
          <div>
            <span className="course-hero-kicker">{level.title}</span>
            <h1>{level.title} courses</h1>
            <p>{level.subtitle}</p>
          </div>
          <div className="course-hero-meta">
            <button className="ghost-chip" onClick={onBack}>
              ← Change level
            </button>
            <div className="course-hero-note">
              Choose a subject to enter a live course or preview a coming-soon branch.
            </div>
          </div>
        </section>

        <section className="course-grid">
          {courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              levelId={level.id}
              selectedBoard={selectedBoards[course.id]}
              onBoardChange={onBoardChange}
              onSelect={onSelectCourse}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

function CoursePlaceholder({ level, course, selectedBoard, onBack, onBackHome, searchQuery, onSearchQueryChange }) {
  return (
    <div className="landing-shell course-shell">
      <div className="landing-orb landing-orb-one" />
      <div className="landing-orb landing-orb-two" />
      <div className="landing-grid" />

      <LandingTopBar onBack={onBackHome} />
      <GlobalSearchBar inCourse={true} searchQuery={searchQuery} onSearchQueryChange={onSearchQueryChange} />

      <main className="landing-main">
        <section className="placeholder-panel">
          <span className="landing-hero-kicker">{level.title}</span>
          <div className="placeholder-icon">{course.icon}</div>
          <h1>{course.label}</h1>
          <p>{course.description}</p>
          {selectedBoard && <div className="placeholder-board-chip">Exam board: {selectedBoard}</div>}
          <div className="placeholder-actions">
            <button className="ghost-chip" onClick={onBack}>
              ← Back to {level.title.toLowerCase()} courses
            </button>
            <button className="solid-chip" onClick={onBackHome}>
              Back to hub
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function TopicSection({ topic }) {
  return (
    <section className="topic-section" id={topic.id}>
      <div className="topic-header">
        <span className="topic-num-badge">{topic.topicNum}</span>
        <h2 className="topic-title">{topic.title}</h2>
      </div>
      {topic.questions.map(q => (
        <QuestionCard key={q.qid} question={q} topicId={topic.id} />
      ))}
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState('learn');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedBoards, setSelectedBoards] = useState({});
  const [guidesSection, setGuidesSection] = useState(null);
  const expandAll    = useStore(s => s.expandAll);
  const setModule    = useStore(s => s.setModule);
  const formulaOpen  = useStore(s => s.formulaOpen);
  const toggleFormula = useStore(s => s.toggleFormula);
  const closeExam    = useStore(s => s.closeExam);
  const closeResults = useStore(s => s.closeResults);
  const selectedLevel = LEARNING_LEVELS.find(level => level.id === selectedLevelId) || null;
  const selectedCourse = selectedLevel
    ? (COURSE_OPTIONS[selectedLevel.id] || []).find(course => course.id === selectedCourseId) || null
    : null;
  const isLivePhysics = selectedLevelId === 'uni' && selectedCourseId === 'uni-physics';

  function resetPhysicsUi() {
    if (formulaOpen) toggleFormula();
    closeExam();
    closeResults();
  }

  function goHome() {
    resetPhysicsUi();
    setSelectedCourseId(null);
    setSelectedLevelId(null);
    setGuidesSection(null);
    setSearchQuery('');
    setPage('learn');
  }

  function openGuides(section) {
    setGuidesSection(section || 'all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBackToCourses() {
    resetPhysicsUi();
    setSelectedCourseId(null);
  }

  function selectLevel(levelId) {
    resetPhysicsUi();
    setSelectedLevelId(levelId);
    setSelectedCourseId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function selectCourse(course) {
    resetPhysicsUi();
    setSelectedCourseId(course.id);
    if (course.implemented && course.module) {
      setModule(course.module);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function selectBoard(courseId, board) {
    setSelectedBoards(prev => ({ ...prev, [courseId]: board }));
  }

  function openLogin() {
    setPage('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Keyboard shortcut: Ctrl+E → expand all
  useEffect(() => {
    if (!isLivePhysics) return undefined;

    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        const allIds = topics.flatMap(t => t.questions.map(q => q.qid));
        expandAll(allIds);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expandAll, isLivePhysics]);

  if (guidesSection) {
    return <GuidesPage section={guidesSection} onBack={goHome} />;
  }

  if (page === 'login') {
    return <LoginPage onBack={goHome} />;
  }

  if (!selectedLevel) {
    return <LandingHub onSelectLevel={selectLevel} onLogin={openLogin} onOpenGuides={openGuides} searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} selectedBoards={selectedBoards} onBoardChange={selectBoard} onSelectCourse={selectCourse} />;
  }

  if (selectedCourse && !isLivePhysics) {
    return (
      <CoursePlaceholder
        level={selectedLevel}
        course={selectedCourse}
        selectedBoard={selectedBoards[selectedCourse.id]}
        onBack={goBackToCourses}
        onBackHome={goHome}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
    );
  }

  if (selectedCourse && isLivePhysics) {
    return (
      <div className="app-shell">
        <div className="content-shell-top">
          <div className="landing-brand">
            <LogoMark />
            <div>
              <div className="landing-brand-kicker">Kerfox</div>
              <div className="landing-brand-subtitle">University physics learning</div>
            </div>
          </div>
          <button className="ghost-chip" onClick={goHome}>
            ← Back to learning hub
          </button>
        </div>

        <div className="app-layout">
          <Sidebar />

          <div className="main-content">
            <div className="main-inner">

              <header className="page-header">
                <button className="page-header-link" onClick={goBackToCourses}>
                  ← Back to university courses
                </button>
                <div className="page-header-badge">University Physics</div>
                <h1>Lasers &amp; <em>Quanta</em></h1>
                <p className="page-header-subtitle">Comprehensive Exam Question Bank with Model Answers</p>
                <div className="page-stats">
                  <div>
                    <div className="page-stat-n">114</div>
                    <div className="page-stat-label">Exam Questions</div>
                  </div>
                  <div>
                    <div className="page-stat-n">20</div>
                    <div className="page-stat-label">Advanced Challenge</div>
                  </div>
                  <div>
                    <div className="page-stat-n">9</div>
                    <div className="page-stat-label">Topics</div>
                  </div>
                  <div>
                    <div className="page-stat-n">✓</div>
                    <div className="page-stat-label">Model Answers</div>
                  </div>
                </div>
              </header>

              <Toolbar />
              <GlobalSearchBar inCourse={true} searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />

              <div className="reading-box">
                <div className="reading-box-title">Core Reading</div>
                <div className="reading-tags">
                  {[
                    'Pedrotti et al. - Introduction to Optics (3rd ed.)',
                    'Feynman, Leighton & Sands - Lectures on Physics',
                    'Hecht - Optics (7th ed.)',
                    'Feynman - QED: The Strange Theory of Light and Matter',
                  ].map(t => <span key={t} className="reading-tag">{t}</span>)}
                </div>
              </div>

              {topics.filter(t => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.questions.some(q => q.title.toLowerCase().includes(searchQuery.toLowerCase()))).map(t => <TopicSection key={t.id} topic={t} />)}
            </div>

            <button
              className="totop"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              title="Back to top"
            >
              ↑
            </button>
          </div>

          <FormulaPanel />
          <ExamModal />
          <ResultsModal />
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <CourseHub
        level={selectedLevel}
        selectedBoards={selectedBoards}
        onBoardChange={selectBoard}
        onSelectCourse={selectCourse}
        onBack={goHome}
        onBackHome={goHome}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSelectLevel={selectLevel}
      />
    </div>
  );
}


