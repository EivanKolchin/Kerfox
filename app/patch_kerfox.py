import re

with open("app/src/App.jsx", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Add GlobalSearchBar component right before LandingHub
search_bar_code = """
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

"""

if "function GlobalSearchBar" not in code:
    code = code.replace("function LandingHub", search_bar_code + "function LandingHub")

# 2. Inject state into App
if "const [searchQuery, setSearchQuery] = useState" not in code:
    code = code.replace("const [page, setPage] = useState('learn');", 
                        "const [page, setPage] = useState('learn');\n  const [searchQuery, setSearchQuery] = useState('');")

# 3. Reset search on navigation (optional, but requested: "the search bar should still be there but with that given level selected", so let's KEEP query string if they navigate, except maybe when going home? Let's just clear it on goHome or let it persist.)
# Let's clear search query on goHome and goBackToCourses maybe? Actually user wants it to persist as a filter probably. I'll just clear on goHome to be safe.
code = code.replace("setSelectedCourseId(null);\n    setSelectedLevelId(null);", "setSelectedCourseId(null);\n    setSelectedLevelId(null);\n    setSearchQuery('');")

# 4. Integrate into LandingHub
landing_hub_sig_old = "function LandingHub({ onSelectLevel, onLogin, onOpenGuides }) {"
landing_hub_sig_new = "function LandingHub({ onSelectLevel, onLogin, onOpenGuides, searchQuery, onSearchQueryChange }) {"
code = code.replace(landing_hub_sig_old, landing_hub_sig_new)

landing_hub_jsx_old = """      <LandingTopBar onLogin={onLogin} />

      <nav className="landing-quick-nav" aria-label="Page pointers">"""
landing_hub_jsx_new = """      <LandingTopBar onLogin={onLogin} />
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
              .map(c => (
                <CourseCard 
                  key={`${c.levelId}-${c.id}`} 
                  course={c} 
                  levelId={c.levelId} 
                  onSelect={(course) => { onSelectLevel(c.levelId); }} // User has to select level first or we hack it. Let's just dispatch level select then it stays. But CourseCard expects onSelect. 
                  // Wait, CourseHub handles onSelectCourse. LandingHub doesn't get it. 
                />
            ))}
          </section>
        </main>
      ) : (
      <nav className="landing-quick-nav" aria-label="Page pointers">"""

# wait, I need to pass onSelectCourse and selectedBoards handlers to LandingHub if I'm rendering CourseCard!
landing_hub_sig_new = "function LandingHub({ onSelectLevel, onLogin, onOpenGuides, searchQuery, onSearchQueryChange, onSelectCourse, selectedBoards, onBoardChange }) {"
code = code.replace("function LandingHub({ onSelectLevel, onLogin, onOpenGuides, searchQuery, onSearchQueryChange }) {", landing_hub_sig_new)
code = code.replace(landing_hub_jsx_old, landing_hub_jsx_new.replace("onSelect={(course) =>", "selectedBoard={selectedBoards[c.id]} onBoardChange={onBoardChange} onSelect={(course) => { onSelectLevel(c.levelId); setTimeout(() => onSelectCourse(c), 0); }"))

landing_hub_end_old = """        </section>
      </main>
    </div>
  );
}"""
landing_hub_end_new = """        </section>
      </main>
      )}
    </div>
  );
}"""
code = code.replace(landing_hub_end_old, landing_hub_end_new)


# Update App rendering LandingHub
app_landing_old = "<LandingHub onSelectLevel={selectLevel} onLogin={openLogin} onOpenGuides={openGuides} />"
app_landing_new = "<LandingHub onSelectLevel={selectLevel} onLogin={openLogin} onOpenGuides={openGuides} searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} onSelectCourse={selectCourse} selectedBoards={selectedBoards} onBoardChange={selectBoard} />"
code = code.replace(app_landing_old, app_landing_new)

# 5. Integrate into CourseHub
course_hub_sig_old = "function CourseHub({ level, selectedBoards, onBoardChange, onSelectCourse, onBack, onBackHome }) {"
course_hub_sig_new = "function CourseHub({ level, selectedBoards, onBoardChange, onSelectCourse, onBack, onBackHome, searchQuery, onSearchQueryChange, onSelectLevel }) {"
code = code.replace(course_hub_sig_old, course_hub_sig_new)

course_hub_jsx_old = """      <LandingTopBar onBack={onBackHome} />

      <main className="landing-main">"""
course_hub_jsx_new = """      <LandingTopBar onBack={onBackHome} />
      <GlobalSearchBar levelId={level.id} onLevelChange={onSelectLevel} searchQuery={searchQuery} onSearchQueryChange={onSearchQueryChange} />

      <main className="landing-main">"""
code = code.replace(course_hub_jsx_old, course_hub_jsx_new)

course_hub_filter_old = "const courses = COURSE_OPTIONS[level.id] || [];"
course_hub_filter_new = """const allCourses = COURSE_OPTIONS[level.id] || [];
  const courses = searchQuery 
    ? allCourses.filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase()) || (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase())))
    : allCourses;"""
code = code.replace(course_hub_filter_old, course_hub_filter_new)

app_coursehub_old = """<CourseHub
        level={selectedLevel}
        selectedBoards={selectedBoards}
        onBoardChange={selectBoard}
        onSelectCourse={selectCourse}
        onBack={goHome}
        onBackHome={goHome}
      />"""
app_coursehub_new = """<CourseHub
        level={selectedLevel}
        selectedBoards={selectedBoards}
        onBoardChange={selectBoard}
        onSelectCourse={selectCourse}
        onBack={goHome}
        onBackHome={goHome}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSelectLevel={selectLevel}
      />"""
code = code.replace(app_coursehub_old, app_coursehub_new)

# 6. Integrate into LivePhysics
live_physics_top_old = """              </header>

              <Toolbar />

              <div className="reading-box">"""
live_physics_top_new = """              </header>

              <Toolbar />
              
              <GlobalSearchBar inCourse={true} searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />

              <div className="reading-box">"""
code = code.replace(live_physics_top_old, live_physics_top_new)

live_physics_map_old = "{topics.map(t => <TopicSection key={t.id} topic={t} />)}"
live_physics_map_new = "{topics.filter(t => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.questions.some(q => q.title.toLowerCase().includes(searchQuery.toLowerCase()))).map(t => <TopicSection key={t.id} topic={t} />)}"
code = code.replace(live_physics_map_old, live_physics_map_new)

with open("app/src/App.jsx", "w", encoding="utf-8") as f:
    f.write(code)

print("App.jsx patched successfully.")
