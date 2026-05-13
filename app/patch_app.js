const fs = require('fs');

let code = fs.readFileSync('c:\\Users\\eivan\\Downloads\\Kerfox\\app\\src\\App.jsx', 'utf8');

// 1. Add GlobalSearchBar
const searchBarCode = \
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
          <span className="global-search-icon">??</span>
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

\;

if (!code.includes('GlobalSearchBar')) {
  code = code.replace('function LogoMark() {', searchBarCode + 'function LogoMark() {');
}

// 2. Add state
if (!code.includes('const [searchQuery, setSearchQuery] = useState')) {
  code = code.replace("const [page, setPage] = useState('learn');", 
    "const [page, setPage] = useState('learn');\\n  const [searchQuery, setSearchQuery] = useState('');");
}

// 3. Clear state on goHome optionally (I'll clear it on goHome so they don't get confused)
if (!code.includes("setSearchQuery('');")) {
  code = code.replace("setSelectedLevelId(null);\\n    setGuidesSection(null);", 
    "setSelectedLevelId(null);\\n    setGuidesSection(null);\\n    setSearchQuery('');");
}

// 4. Update LandingHub signature
code = code.replace("function LandingHub({ onSelectLevel, onLogin, onOpenGuides }) {", 
  "function LandingHub({ onSelectLevel, onLogin, onOpenGuides, searchQuery, onSearchQueryChange, selectedBoards, onBoardChange, onSelectCourse }) {");

const landingHubJsxOld = \      <LandingTopBar onLogin={onLogin} />

      <nav className="landing-quick-nav" aria-label="Page pointers">\;

const landingHubJsxNew = \      <LandingTopBar onLogin={onLogin} />
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
                  key={\\-\\} 
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
      <nav className="landing-quick-nav" aria-label="Page pointers">\;

if (code.includes(landingHubJsxOld)) {
  code = code.replace(landingHubJsxOld, landingHubJsxNew);
  code = code.replace("</section>\\n      </main>\\n    </div>\\n  );\\n}", "</section>\\n      </main>\\n      )}\\n    </div>\\n  );\\n}");
}

// 5. Update App calling LandingHub
code = code.replace("<LandingHub onSelectLevel={selectLevel} onLogin={openLogin} onOpenGuides={openGuides} />", 
  "<LandingHub onSelectLevel={selectLevel} onLogin={openLogin} onOpenGuides={openGuides} searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} selectedBoards={selectedBoards} onBoardChange={selectBoard} onSelectCourse={selectCourse} />");

// 6. Update CourseHub signature
code = code.replace("function CourseHub({ level, selectedBoards, onBoardChange, onSelectCourse, onBack, onBackHome }) {", 
  "function CourseHub({ level, selectedBoards, onBoardChange, onSelectCourse, onBack, onBackHome, searchQuery, onSearchQueryChange, onSelectLevel }) {");

const courseHubJsxOld = \      <LandingTopBar onBack={onBackHome} />

      <main className="landing-main">\;
const courseHubJsxNew = \      <LandingTopBar onBack={onBackHome} />
      <GlobalSearchBar levelId={level.id} onLevelChange={onSelectLevel} searchQuery={searchQuery} onSearchQueryChange={onSearchQueryChange} />

      <main className="landing-main">\;
if (code.includes(courseHubJsxOld)) {
  code = code.replace(courseHubJsxOld, courseHubJsxNew);
}

const courseHubFilterOld = "const courses = COURSE_OPTIONS[level.id] || [];";
const courseHubFilterNew = \const allCourses = COURSE_OPTIONS[level.id] || [];
  const courses = searchQuery 
    ? allCourses.filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase()) || (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase())))
    : allCourses;\;
if (code.includes(courseHubFilterOld)) {
  code = code.replace(courseHubFilterOld, courseHubFilterNew);
}

// 7. Update App calling CourseHub
const appCourseHubOld = \<CourseHub
        level={selectedLevel}
        selectedBoards={selectedBoards}
        onBoardChange={selectBoard}
        onSelectCourse={selectCourse}
        onBack={goHome}
        onBackHome={goHome}
      />\;
const appCourseHubNew = \<CourseHub
        level={selectedLevel}
        selectedBoards={selectedBoards}
        onBoardChange={selectBoard}
        onSelectCourse={selectCourse}
        onBack={goHome}
        onBackHome={goHome}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSelectLevel={selectLevel}
      />\;
if (code.includes(appCourseHubOld)) {
  code = code.replace(appCourseHubOld, appCourseHubNew);
}

// 8. Update LivePhysics
const livePhysicsTopOld = \              </header>

              <Toolbar />

              <div className="reading-box">\;
const livePhysicsTopNew = \              </header>

              <Toolbar />
              <GlobalSearchBar inCourse={true} searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />

              <div className="reading-box">\;
if (code.includes(livePhysicsTopOld)) {
  code = code.replace(livePhysicsTopOld, livePhysicsTopNew);
}

const livePhysicsMapOld = "{topics.map(t => <TopicSection key={t.id} topic={t} />)}";
const livePhysicsMapNew = "{topics.filter(t => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.questions.some(q => q.title.toLowerCase().includes(searchQuery.toLowerCase()))).map(t => <TopicSection key={t.id} topic={t} />)}";
if (code.includes(livePhysicsMapOld)) {
  code = code.replace(livePhysicsMapOld, livePhysicsMapNew);
}


fs.writeFileSync('c:\\Users\\eivan\\Downloads\\Kerfox\\app\\src\\App.jsx', code, 'utf8');
console.log('App.jsx patched explicitly!');

