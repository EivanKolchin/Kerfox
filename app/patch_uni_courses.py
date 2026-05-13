import re

with open("app/src/App.jsx", "r", encoding="utf-8") as f:
    code = f.read()

# Make search bar icon an SVG
old_search_bar = """        <div className="global-search-input-wrapper">
          <span className="global-search-icon">??</span>
          <input"""

new_search_bar = """        <div className="global-search-input-wrapper">
          <span className="global-search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input"""

code = code.replace(old_search_bar, new_search_bar)

# Refactor the uni courses
new_uni_courses = """  uni: [
    { id: 'uni-physics', label: 'Physics', description: 'Core physical theory, mechanics, and quanta. Features live PHYS1204 module.', icon: '??', implemented: true, module: 'lasers' },
    { id: 'uni-maths', label: 'Mathematics', description: 'Analysis, algebra, modelling and methods.', icon: '?' },
    { id: 'uni-compsci', label: 'Computer Science', description: 'Algorithms, software engineering and computation.', icon: '?' },
    { id: 'uni-engineering', label: 'Engineering', description: 'Mechanical, civil, aeronautical and electrical foundations.', icon: '?' },
    { id: 'uni-medicine', label: 'Medicine', description: 'Human biology, systems and clinical foundations.', icon: '?' },
    { id: 'uni-biology', label: 'Biological Sciences', description: 'Molecular life sciences, genetics and organisms.', icon: '??' },
    { id: 'uni-chemistry', label: 'Chemistry', description: 'Molecular structure, reaction pathways and lab practice.', icon: '??' },
    { id: 'uni-economics', label: 'Economics', description: 'Microeconomics, macroeconomics and quantitative tools.', icon: '??' },
    { id: 'uni-law', label: 'Law', description: 'Public law, tort, contract and legal reasoning.', icon: '?' },
    { id: 'uni-philosophy', label: 'Philosophy', description: 'Logic, ethics and modern philosophical problems.', icon: 'F' },
    { id: 'uni-psychology', label: 'Psychology', description: 'Cognition, behaviour and research methods.', icon: '?' },
    { id: 'uni-history', label: 'History', description: 'Primary-source analysis across historical periods.', icon: '?' },
    { id: 'uni-literature', label: 'Literature', description: 'Close reading, criticism and historical context.', icon: '??' },
    { id: 'uni-politics', label: 'Politics & International Relations', description: 'Political theory, institutions and global affairs.', icon: '?' },
    { id: 'uni-geography', label: 'Geography & Earth Sciences', description: 'Physical and human geography methods, Earth systems.', icon: '?' },
  ],"""

import re
code = re.sub(r'  uni: \[\s*\{.*?oxford-earth-sciences.*?\}\s*,\s*\],', new_uni_courses, code, flags=re.DOTALL | re.MULTILINE)

# Also fix the `isLivePhysics` check
code = code.replace("selectedCourseId === 'physics-first-year'", "selectedCourseId === 'uni-physics'")
# Also fix the CoursePlaceholder/Live Course header if needed? Wait we don't have to remove First Year from the hardcoded live physics yet, or we can.
code = code.replace("University of Southampton · Physics Year 1", "University Physics")

with open("app/src/App.jsx", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated App.jsx successfully.")
