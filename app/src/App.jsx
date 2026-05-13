import { useEffect, useState } from 'react';
import { useStore } from './store.js';
import { topics } from './data/questions.js';
import LoginPage from './components/LoginPage.jsx';
import GuidesPage from './components/GuidesPage.jsx';
import { supabase } from './lib/auth/supabase.js';
import { decodeAppState, pushAppState, replaceAppState } from './lib/routing.js';

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
    {
      id: 'uni-physics', label: 'Physics', icon: '⚛️',
      description: 'Core physical theory - mechanics, electromagnetism, thermodynamics, waves, optics, and quantum physics.',
      modules: [
        { id: 'soton-phys1204', label: 'Lasers & Quanta (PHYS1204)', provider: 'University of Southampton', description: 'Laser physics, quantum mechanics, and atomic theory with exam question bank.', implemented: true, module: 'lasers' },
        { id: 'soton-maths-methods', label: 'Maths Methods 1b', provider: 'University of Southampton', description: 'Vector calculus, differential equations, and linear algebra for physics.' },
        { id: 'soton-waves', label: 'Waves', provider: 'University of Southampton', description: 'Wave phenomena, optics, acoustics, and electromagnetic waves.' },
        { id: 'soton-energy-matter', label: 'Energy & Matter', provider: 'University of Southampton', description: 'Thermal physics, thermodynamics, and the kinetic theory of matter.' },
        { id: 'ucl-mech-relativity', label: 'Mechanics, Relativity & Astrophysics', provider: 'UCL', description: 'Newtonian mechanics, special relativity, and introductory astrophysics.' },
        { id: 'ucl-thermal-waves', label: 'Thermal Physics & Waves', provider: 'UCL', description: 'Thermodynamics, kinetic theory, wave motion and optics.' },
        { id: 'ucl-electromag', label: 'Electromagnetism & Optics', provider: 'UCL', description: 'Electrostatics, magnetostatics, Maxwell\'s equations and geometrical optics.' },
        { id: 'ucl-maths-physics', label: 'Mathematical Methods for Physics', provider: 'UCL', description: 'Vector spaces, Fourier analysis, PDEs and complex analysis.' },
        { id: 'imperial-mechanics', label: 'Mechanics', provider: 'Imperial College London', description: 'Particle mechanics, rigid bodies, oscillations and Lagrangian methods.' },
        { id: 'imperial-electromag', label: 'Electromagnetism', provider: 'Imperial College London', description: 'Electrostatics, magnetic fields, Maxwell\'s equations and EM waves.' },
        { id: 'imperial-thermo', label: 'Thermodynamics', provider: 'Imperial College London', description: 'Laws of thermodynamics, entropy, heat transfer and statistical mechanics.' },
        { id: 'imperial-maths', label: 'Mathematics for Physicists', provider: 'Imperial College London', description: 'Calculus, linear algebra, ODEs, PDEs and numerical methods.' },
        { id: 'oxford-physics-1', label: 'Physics I: Mechanics & Special Relativity', provider: 'University of Oxford', description: 'Newtonian mechanics, oscillations, waves and special relativity.' },
        { id: 'oxford-physics-2', label: 'Physics II: Electromagnetism & Thermal', provider: 'University of Oxford', description: 'Electromagnetism, circuits, thermodynamics and kinetic theory.' },
        { id: 'oxford-maths', label: 'Mathematical Methods', provider: 'University of Oxford', description: 'Calculus, vectors, matrices, ODEs and Fourier analysis.' },
        { id: 'cambridge-phys-a', label: 'Physics A', provider: 'University of Cambridge', description: 'Mechanics, special relativity, waves, optics and thermal physics.' },
        { id: 'cambridge-phys-b', label: 'Physics B', provider: 'University of Cambridge', description: 'Electromagnetism, quantum physics, atomic and nuclear physics.' },
        { id: 'edinburgh-phys-1a', label: 'Physics 1A: Foundations', provider: 'University of Edinburgh', description: 'Mechanics, waves, thermodynamics and introductory quantum theory.' },
        { id: 'edinburgh-phys-1b', label: 'Physics 1B: The Material Universe', provider: 'University of Edinburgh', description: 'Electromagnetism, optics, astrophysics and condensed matter.' },
      ],
    },
    {
      id: 'uni-maths', label: 'Mathematics', icon: '∫',
      description: 'Pure and applied mathematics - algebra, analysis, geometry, statistics, and modelling.',
      modules: [
        { id: 'soton-math1054', label: 'Maths Methods 1b', provider: 'University of Southampton', description: 'Vector calculus, differential equations and linear algebra.' },
        { id: 'ucl-math-methods1', label: 'Mathematical Methods 1', provider: 'UCL', description: 'Calculus, linear algebra, sequences and series.' },
        { id: 'ucl-math-methods2', label: 'Mathematical Methods 2', provider: 'UCL', description: 'Multivariable calculus, ODEs, PDEs and vector analysis.' },
        { id: 'imperial-math1', label: 'Mathematics 1', provider: 'Imperial College London', description: 'Analysis, linear algebra, groups and vector calculus.' },
        { id: 'imperial-math2', label: 'Mathematics 2', provider: 'Imperial College London', description: 'Complex analysis, probability, statistics and numerical methods.' },
        { id: 'oxford-analysis', label: 'Analysis I', provider: 'University of Oxford', description: 'Real analysis, sequences, series, continuity and differentiation.' },
        { id: 'oxford-algebra', label: 'Linear Algebra & Groups', provider: 'University of Oxford', description: 'Vector spaces, matrices, linear transformations and group theory.' },
        { id: 'cambridge-math-ia', label: 'Mathematics IA', provider: 'University of Cambridge', description: 'Analysis, linear algebra, probability and vector calculus.' },
        { id: 'cambridge-math-ib', label: 'Mathematics IB', provider: 'University of Cambridge', description: 'Complex analysis, methods, statistics and numerical analysis.' },
        { id: 'edinburgh-math1', label: 'Mathematics for Physics 1', provider: 'University of Edinburgh', description: 'Calculus, linear algebra and differential equations.' },
      ],
    },
    {
      id: 'uni-compsci', label: 'Computer Science', icon: '⌘',
      description: 'Algorithms, programming, systems, artificial intelligence and software engineering.',
      modules: [
        { id: 'soton-cs-prog1', label: 'Programming I', provider: 'University of Southampton', description: 'Java fundamentals, OOP, data structures and algorithms.' },
        { id: 'soton-cs-prog2', label: 'Programming II', provider: 'University of Southampton', description: 'Advanced OOP, concurrency, GUIs and software design.' },
        { id: 'ucl-cs-prog', label: 'Introduction to Programming', provider: 'UCL', description: 'Python, computational thinking and problem solving.' },
        { id: 'ucl-cs-algo', label: 'Algorithms & Data Structures', provider: 'UCL', description: 'Sorting, search, graphs, trees and complexity analysis.' },
        { id: 'imperial-cs1', label: 'Computing 1', provider: 'Imperial College London', description: 'Haskell, Python, functional programming and logic.' },
        { id: 'imperial-cs2', label: 'Computing 2', provider: 'Imperial College London', description: 'Java, OOP, data structures and software engineering.' },
        { id: 'oxford-cs-prog', label: 'Introduction to Programming', provider: 'University of Oxford', description: 'Functional programming, Haskell and algorithmic thinking.' },
        { id: 'oxford-cs-systems', label: 'Computer Systems', provider: 'University of Oxford', description: 'Digital logic, architecture, operating systems and concurrency.' },
        { id: 'cambridge-cs-ia', label: 'Computer Science IA', provider: 'University of Cambridge', description: 'Programming, algorithms, architecture and graphics.' },
        { id: 'cambridge-cs-ib', label: 'Computer Science IB', provider: 'University of Cambridge', description: 'AI, compilers, networks, and theory of computation.' },
        { id: 'edinburgh-inf1', label: 'Informatics 1', provider: 'University of Edinburgh', description: 'Computation and logic, data and analysis.' },
        { id: 'edinburgh-inf2', label: 'Informatics 2', provider: 'University of Edinburgh', description: 'Algorithms, data structures and software engineering.' },
      ],
    },
    {
      id: 'uni-engineering', label: 'Engineering', icon: '⛭',
      description: 'Mechanical, civil, electrical, aeronautical and general engineering foundations.',
      modules: [
        { id: 'soton-eng-mech', label: 'Engineering Mechanics', provider: 'University of Southampton', description: 'Statics, dynamics, stress analysis and materials.' },
        { id: 'soton-eng-thermo', label: 'Thermodynamics & Fluid Mechanics', provider: 'University of Southampton', description: 'Energy, entropy, fluid statics and dynamics.' },
        { id: 'imperial-eng-mech', label: 'Mechanics & Structures', provider: 'Imperial College London', description: 'Solid mechanics, structural analysis and materials.' },
        { id: 'imperial-eng-thermo', label: 'Thermodynamics', provider: 'Imperial College London', description: 'Energy systems, heat transfer and fluid mechanics.' },
        { id: 'ucl-eng-mech', label: 'Engineering Mechanics', provider: 'UCL', description: 'Statics, dynamics and strength of materials.' },
        { id: 'ucl-eng-maths', label: 'Engineering Mathematics', provider: 'UCL', description: 'Calculus, linear algebra and differential equations for engineers.' },
        { id: 'oxford-eng-science', label: 'Engineering Science', provider: 'University of Oxford', description: 'Integrated mechanics, thermodynamics, electronics and maths.' },
        { id: 'cambridge-eng-ia', label: 'Engineering IA', provider: 'University of Cambridge', description: 'Mechanics, materials, thermofluids and electrical engineering.' },
        { id: 'cambridge-eng-ib', label: 'Engineering IB', provider: 'University of Cambridge', description: 'Structural mechanics, fluid mechanics, control and electronics.' },
        { id: 'edinburgh-eng-1', label: 'Engineering 1', provider: 'University of Edinburgh', description: 'Mechanics, electronics, design and engineering skills.' },
      ],
    },
    {
      id: 'uni-medicine', label: 'Medicine', icon: '⚕',
      description: 'Pre-clinical and clinical foundations - anatomy, physiology, pharmacology and pathology.',
      modules: [
        { id: 'soton-med-1', label: 'Foundations of Medicine', provider: 'University of Southampton', description: 'Anatomy, physiology, biochemistry and clinical skills.' },
        { id: 'ucl-med-1', label: 'Medical Sciences 1', provider: 'UCL', description: 'Cell biology, genetics, anatomy and physiology.' },
        { id: 'imperial-med-1', label: 'Integrated Medicine 1', provider: 'Imperial College London', description: 'Body systems, molecular medicine and clinical practice.' },
        { id: 'oxford-med-1', label: 'Pre-Clinical Medicine', provider: 'University of Oxford', description: 'BM BCh year 1: anatomy, physiology, biochemistry and pathology.' },
        { id: 'cambridge-med-1', label: 'Medical Sciences Tripos', provider: 'University of Cambridge', description: 'Biochemistry, physiology, anatomy and pharmacology.' },
        { id: 'edinburgh-med-1', label: 'Medicine 1', provider: 'University of Edinburgh', description: 'Foundations of clinical practice and biomedical sciences.' },
      ],
    },
    {
      id: 'uni-biology', label: 'Biological Sciences', icon: '🧫',
      description: 'Molecular biology, genetics, ecology, evolution and organismal biology.',
      modules: [
        { id: 'soton-bio-1', label: 'Biological Sciences 1', provider: 'University of Southampton', description: 'Cell biology, genetics, evolution and ecology.' },
        { id: 'ucl-bio-1', label: 'Biology 1', provider: 'UCL', description: 'Molecular biology, cell biology and genetics.' },
        { id: 'imperial-bio-1', label: 'Biological Sciences 1', provider: 'Imperial College London', description: 'Biochemistry, genetics, microbiology and cell biology.' },
        { id: 'oxford-bio-1', label: 'Biology 1', provider: 'University of Oxford', description: 'Cell biology, genetics, evolution and animal diversity.' },
        { id: 'cambridge-bio-nst', label: 'Natural Sciences: Biology', provider: 'University of Cambridge', description: 'Cell biology, developmental biology and physiology.' },
        { id: 'edinburgh-bio-1', label: 'Biology 1', provider: 'University of Edinburgh', description: 'Genes, cells, organisms and evolution.' },
      ],
    },
    {
      id: 'uni-chemistry', label: 'Chemistry', icon: '⚗️',
      description: 'Molecular science - organic, inorganic, physical, analytical and computational chemistry.',
      modules: [
        { id: 'soton-chem-1', label: 'Chemistry 1', provider: 'University of Southampton', description: 'Organic, inorganic and physical chemistry foundations.' },
        { id: 'ucl-chem-1', label: 'Chemistry 1', provider: 'UCL', description: 'Bonding, structure, reactivity and spectroscopy.' },
        { id: 'imperial-chem-1', label: 'Chemistry 1', provider: 'Imperial College London', description: 'Atomic structure, kinetics, thermodynamics and organic chemistry.' },
        { id: 'oxford-chem-1', label: 'Chemistry 1', provider: 'University of Oxford', description: 'Inorganic, organic, physical and theoretical chemistry.' },
        { id: 'cambridge-chem-nst', label: 'Natural Sciences: Chemistry', provider: 'University of Cambridge', description: 'Quantum mechanics, spectroscopy, organic and inorganic chemistry.' },
        { id: 'edinburgh-chem-1', label: 'Chemistry 1', provider: 'University of Edinburgh', description: 'Organic, inorganic and physical chemistry with lab work.' },
      ],
    },
    {
      id: 'uni-economics', label: 'Economics', icon: '📈',
      description: 'Microeconomics, macroeconomics, econometrics and quantitative methods.',
      modules: [
        { id: 'soton-econ-1', label: 'Economics 1', provider: 'University of Southampton', description: 'Microeconomics, macroeconomics and quantitative methods.' },
        { id: 'ucl-econ-1', label: 'Economics 1', provider: 'UCL', description: 'Microeconomics, macroeconomics and mathematical economics.' },
        { id: 'oxford-econ-ppe', label: 'Economics (PPE Year 1)', provider: 'University of Oxford', description: 'Microeconomics, macroeconomics and economic history.' },
        { id: 'cambridge-econ-1', label: 'Economics 1', provider: 'University of Cambridge', description: 'Microeconomics, macroeconomics and quantitative methods.' },
        { id: 'edinburgh-econ-1', label: 'Economics 1', provider: 'University of Edinburgh', description: 'Markets, economic principles and data analysis.' },
        { id: 'imperial-econ-data', label: 'Economics for Data Science', provider: 'Imperial College London', description: 'Quantitative economics, statistics and machine learning for economics.' },
      ],
    },
    {
      id: 'uni-law', label: 'Law', icon: '⚖',
      description: 'Legal systems, contract, tort, public law, criminal law and legal reasoning.',
      modules: [
        { id: 'soton-law-1', label: 'Law 1', provider: 'University of Southampton', description: 'Public law, contract, tort and legal skills.' },
        { id: 'ucl-law-1', label: 'Law 1', provider: 'UCL', description: 'Constitutional law, contract, tort and criminal law.' },
        { id: 'oxford-law-1', label: 'Jurisprudence & Law 1', provider: 'University of Oxford', description: 'Constitutional law, contract, tort, criminal law and jurisprudence.' },
        { id: 'cambridge-law-1', label: 'Law 1', provider: 'University of Cambridge', description: 'Constitutional law, contract, tort and criminal law.' },
        { id: 'edinburgh-law-1', label: 'Law 1', provider: 'University of Edinburgh', description: 'Scottish legal system, public law, contract and delict.' },
        { id: 'imperial-law-1', label: 'Law Foundations', provider: 'Imperial College London', description: 'Legal reasoning, regulation and ethics in science and technology.' },
      ],
    },
    {
      id: 'uni-philosophy', label: 'Philosophy', icon: 'Φ',
      description: 'Logic, ethics, metaphysics, epistemology and the history of philosophy.',
      modules: [
        { id: 'soton-phil-1', label: 'Philosophy 1', provider: 'University of Southampton', description: 'Logic, ethics, metaphysics and philosophical reasoning.' },
        { id: 'ucl-phil-1', label: 'Philosophy 1', provider: 'UCL', description: 'Ethics, epistemology, logic and history of philosophy.' },
        { id: 'oxford-phil-ppe', label: 'Philosophy (PPE Year 1)', provider: 'University of Oxford', description: 'Logic, moral philosophy and metaphysics.' },
        { id: 'cambridge-phil-1', label: 'Philosophy 1', provider: 'University of Cambridge', description: 'Ethics, metaphysics, logic and history of analytic philosophy.' },
        { id: 'edinburgh-phil-1', label: 'Philosophy 1', provider: 'University of Edinburgh', description: 'Mind, knowledge, ethics and philosophical skills.' },
      ],
    },
    {
      id: 'uni-psychology', label: 'Psychology', icon: '◌',
      description: 'Cognition, behaviour, neuroscience, development and social psychology.',
      modules: [
        { id: 'soton-psych-1', label: 'Psychology 1', provider: 'University of Southampton', description: 'Cognitive, social, developmental and biological psychology.' },
        { id: 'ucl-psych-1', label: 'Psychology 1', provider: 'UCL', description: 'Brain and behaviour, cognition, social and developmental psychology.' },
        { id: 'oxford-psych-1', label: 'Experimental Psychology 1', provider: 'University of Oxford', description: 'Cognitive neuroscience, perception, learning and social psychology.' },
        { id: 'cambridge-psych-nst', label: 'Natural Sciences: Psychology', provider: 'University of Cambridge', description: 'Behavioural neuroscience, cognition and developmental psychology.' },
        { id: 'edinburgh-psych-1', label: 'Psychology 1', provider: 'University of Edinburgh', description: 'Introduction to psychology: methods, theories and applications.' },
        { id: 'imperial-psych-1', label: 'Psychology & Behaviour', provider: 'Imperial College London', description: 'Cognitive science, behavioural neuroscience and research methods.' },
      ],
    },
    {
      id: 'uni-history', label: 'History', icon: '⌛',
      description: 'Historical analysis across periods and geographies - primary sources, interpretation and argument.',
      modules: [
        { id: 'soton-hist-1', label: 'History 1', provider: 'University of Southampton', description: 'Early modern, modern European and global history.' },
        { id: 'ucl-hist-1', label: 'History 1', provider: 'UCL', description: 'Medieval, early modern and modern British and European history.' },
        { id: 'oxford-hist-1', label: 'History 1', provider: 'University of Oxford', description: 'British, European and world history with source analysis.' },
        { id: 'cambridge-hist-1', label: 'History 1', provider: 'University of Cambridge', description: 'British political, economic and social history.' },
        { id: 'edinburgh-hist-1', label: 'History 1', provider: 'University of Edinburgh', description: 'Scottish, British and global history from early modern to modern.' },
      ],
    },
    {
      id: 'uni-literature', label: 'Literature', icon: '📚',
      description: 'English literature, literary theory, critical analysis and creative writing.',
      modules: [
        { id: 'soton-engl-1', label: 'English 1', provider: 'University of Southampton', description: 'Poetry, prose, drama and critical theory.' },
        { id: 'ucl-engl-1', label: 'English 1', provider: 'UCL', description: 'Medieval to modern literature and critical approaches.' },
        { id: 'oxford-engl-1', label: 'English Language & Literature 1', provider: 'University of Oxford', description: 'Early medieval to Victorian literature and practical criticism.' },
        { id: 'cambridge-engl-1', label: 'English 1', provider: 'University of Cambridge', description: 'Renaissance to modern literature and critical analysis.' },
        { id: 'edinburgh-engl-1', label: 'English Literature 1', provider: 'University of Edinburgh', description: 'Reading literature: genres, periods and critical methods.' },
      ],
    },
    {
      id: 'uni-politics', label: 'Politics & IR', icon: '⌬',
      description: 'Political theory, comparative politics, international relations and public policy.',
      modules: [
        { id: 'soton-politics-1', label: 'Politics 1', provider: 'University of Southampton', description: 'Political theory, comparative politics and global governance.' },
        { id: 'ucl-politics-1', label: 'Politics 1', provider: 'UCL', description: 'Political theory, comparative politics and international relations.' },
        { id: 'oxford-politics-ppe', label: 'Politics (PPE Year 1)', provider: 'University of Oxford', description: 'Political theory, comparative government and international relations.' },
        { id: 'edinburgh-politics-1', label: 'Politics 1', provider: 'University of Edinburgh', description: 'Political ideas, institutions and global politics.' },
      ],
    },
    {
      id: 'uni-geography', label: 'Geography', icon: '⛰',
      description: 'Human and physical geography - climate, landscapes, urban systems and global development.',
      modules: [
        { id: 'soton-geog-1', label: 'Geography 1', provider: 'University of Southampton', description: 'Human geography, physical geography and GIS.' },
        { id: 'ucl-geog-1', label: 'Geography 1', provider: 'UCL', description: 'Globalisation, environmental change and geographical methods.' },
        { id: 'oxford-geog-1', label: 'Geography 1', provider: 'University of Oxford', description: 'Earth systems, human geography and geographical techniques.' },
        { id: 'cambridge-geog-1', label: 'Geography 1', provider: 'University of Cambridge', description: 'People, environment and spatial analysis.' },
        { id: 'edinburgh-geog-1', label: 'Geography 1', provider: 'University of Edinburgh', description: 'Environment, society and spatial data science.' },
      ],
    },
    {
      id: 'uni-accounting', label: 'Accounting & Finance', icon: '🧮',
      description: 'Financial accounting, management accounting, corporate finance and quantitative methods.',
      modules: [
        { id: 'soton-acc-1', label: 'Accounting 1', provider: 'University of Southampton', description: 'Financial accounting, management accounting and quantitative methods.' },
        { id: 'ucl-acc-1', label: 'Accounting & Finance 1', provider: 'UCL', description: 'Financial reporting, valuation and quantitative finance.' },
        { id: 'edinburgh-acc-1', label: 'Accountancy 1', provider: 'University of Edinburgh', description: 'Financial accounting, management accounting and business law.' },
        { id: 'imperial-fin-1', label: 'Finance 1', provider: 'Imperial College London', description: 'Corporate finance, investments and financial econometrics.' },
      ],
    },
    {
      id: 'uni-sociology', label: 'Sociology & Criminology', icon: '🤝',
      description: 'Social theory, inequality, crime, justice and research methods.',
      modules: [
        { id: 'soton-socio-1', label: 'Sociology 1', provider: 'University of Southampton', description: 'Social theory, inequality, crime and research methods.' },
        { id: 'ucl-socio-1', label: 'Sociology 1', provider: 'UCL', description: 'Classical theory, modern society and social research.' },
        { id: 'edinburgh-socio-1', label: 'Sociology 1', provider: 'University of Edinburgh', description: 'Sociological imagination, social divisions and research skills.' },
        { id: 'cambridge-socio-1', label: 'Sociology 1', provider: 'University of Cambridge', description: 'Social theory, comparative sociology and methods.' },
      ],
    },
    {
      id: 'uni-nursing', label: 'Nursing & Midwifery', icon: '🩺',
      description: 'Clinical practice, patient care, healthcare sciences and public health.',
      modules: [
        { id: 'soton-nurs-1', label: 'Nursing 1', provider: 'University of Southampton', description: 'Foundations of nursing practice, anatomy and physiology.' },
        { id: 'ucl-nurs-1', label: 'Nursing 1', provider: 'UCL', description: 'Clinical skills, health sciences and evidence-based practice.' },
        { id: 'edinburgh-nurs-1', label: 'Nursing 1', provider: 'University of Edinburgh', description: 'Nursing practice, life sciences and professional development.' },
      ],
    },
    {
      id: 'uni-oceanography', label: 'Ocean & Earth Sciences', icon: '🌊',
      description: 'Marine ecosystems, ocean dynamics, climate science, geology and geophysics.',
      modules: [
        { id: 'soton-ocean-1', label: 'Ocean & Earth Science 1', provider: 'University of Southampton', description: 'Oceanography, marine biology, geology and climate dynamics.' },
        { id: 'edinburgh-ocean-1', label: 'Earth Sciences 1', provider: 'University of Edinburgh', description: 'Geology, geophysics, ocean systems and environmental change.' },
        { id: 'ucl-ocean-1', label: 'Earth Sciences 1', provider: 'UCL', description: 'Earth systems, palaeontology, geochemistry and sediments.' },
        { id: 'cambridge-ocean-nst', label: 'Natural Sciences: Earth Sciences', provider: 'University of Cambridge', description: 'Solid earth, ocean systems, climate and environmental science.' },
      ],
    },
    {
      id: 'uni-music', label: 'Music', icon: '🎵',
      description: 'Performance, composition, musicology, analysis and music technology.',
      modules: [
        { id: 'soton-music-1', label: 'Music 1', provider: 'University of Southampton', description: 'Music history, analysis, composition and performance.' },
        { id: 'ucl-music-1', label: 'Music 1', provider: 'UCL', description: 'Music history, theory, analysis and performance studies.' },
        { id: 'edinburgh-music-1', label: 'Music 1', provider: 'University of Edinburgh', description: 'Musicology, composition, performance and technology.' },
        { id: 'cambridge-music-1', label: 'Music 1', provider: 'University of Cambridge', description: 'Historical musicology, analysis, composition and performance.' },
      ],
    },
    {
      id: 'uni-education', label: 'Education', icon: '🎓',
      description: 'Pedagogy, learning theory, educational psychology, policy and research.',
      modules: [
        { id: 'soton-edu-1', label: 'Education 1', provider: 'University of Southampton', description: 'Learning theories, educational policy and research methods.' },
        { id: 'ucl-edu-1', label: 'Education 1', provider: 'UCL', description: 'Education policy, pedagogy, psychology and social justice.' },
        { id: 'edinburgh-edu-1', label: 'Education 1', provider: 'University of Edinburgh', description: 'Philosophy of education, curriculum and child development.' },
        { id: 'cambridge-edu-1', label: 'Education 1', provider: 'University of Cambridge', description: 'Psychology, sociology, history and philosophy of education.' },
      ],
    },
    {
      id: 'uni-languages', label: 'Languages & Linguistics', icon: '🗣️',
      description: 'Modern languages, linguistics, translation and intercultural communication.',
      modules: [
        { id: 'soton-lang-1', label: 'Languages 1', provider: 'University of Southampton', description: 'Language structure, translation, cultural studies and linguistics.' },
        { id: 'ucl-lang-1', label: 'Languages 1', provider: 'UCL', description: 'Phonetics, syntax, semantics and language acquisition.' },
        { id: 'edinburgh-lang-1', label: 'Linguistics 1', provider: 'University of Edinburgh', description: 'Sounds, structure, meaning and sociolinguistics of language.' },
        { id: 'cambridge-lang-1', label: 'Modern & Medieval Languages 1', provider: 'University of Cambridge', description: 'Language study, literature, linguistics and cultural history.' },
      ],
    },
    {
      id: 'uni-archaeology', label: 'Archaeology & Anthropology', icon: '🏺',
      description: 'Human origins, material culture, ancient societies and ethnographic fieldwork.',
      modules: [
        { id: 'soton-arch-1', label: 'Archaeology 1', provider: 'University of Southampton', description: 'World prehistory, archaeological methods and material culture.' },
        { id: 'ucl-arch-1', label: 'Archaeology 1', provider: 'UCL', description: 'Human evolution, world archaeology and anthropological theory.' },
        { id: 'cambridge-arch-1', label: 'Archaeology 1', provider: 'University of Cambridge', description: 'Archaeological science, world prehistory and heritage.' },
        { id: 'edinburgh-arch-1', label: 'Archaeology 1', provider: 'University of Edinburgh', description: 'Archaeological methods, theory and global prehistory.' },
      ],
    },
    {
      id: 'uni-fineart', label: 'Fine Art & Design', icon: '🎨',
      description: 'Visual arts practice, art history, studio techniques, design thinking and curatorial studies.',
      modules: [
        { id: 'soton-art-1', label: 'Fine Art 1', provider: 'University of Southampton', description: 'Studio practice, art history, drawing and visual culture.' },
        { id: 'ucl-art-1', label: 'Fine Art 1', provider: 'UCL', description: 'Fine art practice, critical studies and contemporary art.' },
        { id: 'edinburgh-art-1', label: 'Art 1', provider: 'University of Edinburgh', description: 'Studio practice, art history and critical theory.' },
        { id: 'cambridge-art-1', label: 'History of Art 1', provider: 'University of Cambridge', description: 'Art historical methods, Renaissance to modern art.' },
      ],
    },
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
              Choose a subject, then pick a module from your university.
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

function ModuleHub({ course, onBack, onBackHome, onSelectModule }) {
  const modules = course.modules || [];

  return (
    <div className="landing-shell course-shell">
      <LandingTopBar onBack={onBackHome} />

      <main className="landing-main">
        <section className="module-hub-hero">
          <button className="ghost-chip module-back-btn" onClick={onBack}>
            ← Back to courses
          </button>
          <div className="module-hub-header">
            <div>
              <span className="course-hero-kicker">{course.icon} {course.label}</span>
              <h1>Choose a module</h1>
              <p>Select from available university modules below.</p>
            </div>
          </div>
        </section>

        <section className="module-grid">
          {modules.map(mod => (
            <div
              key={mod.id}
              className={`module-card${mod.implemented ? ' live' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => onSelectModule(mod)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectModule(mod); } }}
              aria-label={`Select ${mod.label}`}
            >
              <div className="module-card-icon">{course.icon}</div>
              <div className="module-card-provider">{mod.provider}</div>
              <div className="module-card-label">{mod.label}</div>
              <div className="module-card-desc">{mod.description || ''}</div>
              <div className="module-card-footer">
                <span className={`module-card-state${mod.implemented ? ' live' : ''}`}>
                  {mod.implemented ? 'Live' : 'Coming soon'}
                </span>
                <span className="module-card-arrow">→</span>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

function CoursePlaceholder({ level, course, selectedBoard, onBack, onBackHome, searchQuery, onSearchQueryChange }) {
  return (
    <div className="landing-shell course-shell">
      <LandingTopBar onBack={onBackHome} />
      <GlobalSearchBar inCourse={true} searchQuery={searchQuery} onSearchQueryChange={onSearchQueryChange} />

      <main className="landing-main">
        <section className="placeholder-panel">
          <span className="landing-hero-kicker">{level.title}</span>
          <div className="placeholder-icon">{course.icon}</div>
          <h1>{course.label}</h1>
          {course.provider && <div className="placeholder-board-chip">{course.provider}</div>}
          <p>{course.description}</p>
          {selectedBoard && <div className="placeholder-board-chip">Exam board: {selectedBoard}</div>}
          <div className="placeholder-actions">
            <button className="ghost-chip" onClick={onBack}>
              ← Back
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

const DIFF_LABELS = { easy: 'Easy', medium: 'Med', hard: 'Hard' };

function FocusQuestionCard({ question, topicId }) {
  const { qid, num, textHtml, marks, answerHtml, advanced } = question;
  const expandedCards  = useStore(s => s.expandedCards);
  const toggleCard     = useStore(s => s.toggleCard);
  const difficulties   = useStore(s => s.difficulties);
  const setDifficulty  = useStore(s => s.setDifficulty);
  const records        = useStore(s => s.records);
  const hideEasy       = useStore(s => s.hideEasy);
  const searchQuery    = useStore(s => s.searchQuery);
  const activeFolder   = useStore(s => s.activeFolder);
  const getFolder      = useStore(s => s.getFolder);

  const diff   = difficulties[qid];
  const rec    = records[qid] || { right: 0, wrong: 0 };
  const isOpen = !!expandedCards[qid];
  const folder = getFolder(qid);

  if (hideEasy && diff === 'easy') return null;
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    const text = (textHtml + answerHtml).toLowerCase();
    if (!text.includes(q)) return null;
  }
  if (activeFolder !== 'all' && folder !== activeFolder) return null;

  return (
    <div className={`focus-q${advanced ? ' advanced' : ''}${isOpen ? ' open' : ''}`} data-qid={qid}>
      <div className="focus-q-head" onClick={() => toggleCard(qid)}>
        <div className="focus-q-num">{num.replace('Q', '').replace('H', 'H')}</div>
        <div className="focus-q-text" dangerouslySetInnerHTML={{ __html: textHtml }} />
        <div className="focus-q-meta">
          <span className="focus-q-marks">{marks}m</span>
          {diff && <span className={`focus-q-diff ${diff}`}>{DIFF_LABELS[diff]}</span>}
          <button className={`focus-q-toggle${isOpen ? ' open' : ''}`}>
            ▾
          </button>
        </div>
      </div>

      <div className={`focus-q-answer${isOpen ? ' open' : ''}`}>
        <div className="focus-q-answer-inner">
          <div className="focus-q-answer-body">
            <div className="focus-answer-label">EXAM MODEL ANSWER</div>
            <div dangerouslySetInnerHTML={{ __html: answerHtml }} />

            <div className="focus-diff-row">
              <span className="focus-diff-label">Rate:</span>
              {['easy', 'medium', 'hard'].map(level => (
                <button
                  key={level}
                  className={`focus-diff-btn focus-diff-btn-${level}${diff === level ? ' active' : ''}`}
                  onClick={e => { e.stopPropagation(); setDifficulty(qid, level); }}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
              {(rec.right + rec.wrong > 0) && (
                <div className="focus-record">
                  <span className="focus-record-right">✓{rec.right}</span>
                  <span className="focus-record-wrong">✗{rec.wrong}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FocusTopicSection({ topic }) {
  return (
    <section className="focus-section" id={topic.id}>
      <div className="focus-section-head">
        <span className="focus-section-num">{topic.topicNum}</span>
        <h2 className="focus-section-title">{topic.title}</h2>
      </div>
      {topic.questions.map(q => (
        <FocusQuestionCard key={q.qid} question={q} topicId={topic.id} />
      ))}
    </section>
  );
}

function FocusContent({ module, course, onBack }) {
  const [activeTopic, setActiveTopic] = useState(null);
  const totalQ = topics.reduce((n, t) => n + t.questions.length, 0);

  useEffect(() => {
    if (!activeTopic && topics.length > 0) setActiveTopic(topics[0].id);
  }, []);

  function scrollToTopic(id) {
    setActiveTopic(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="focus-shell">
      <div className="focus-topbar">
        <div className="focus-topbar-brand">
          <div className="brand-mark" style={{ width: 36, height: 36, borderRadius: 10 }}>
            <img src="/kerfox.png" alt="Kerfox" />
          </div>
          <div>
            <div className="focus-topbar-brand-name">Lasers &amp; Quanta</div>
            <div className="focus-topbar-brand-sub">{module.provider}</div>
          </div>
        </div>
        <button className="focus-topbar-back" onClick={onBack}>
          ← Back
        </button>
      </div>

      <div className="focus-body">
        <header className="focus-header">
          <div className="focus-header-badge">{totalQ} questions · {topics.length} topics</div>
          <h1>Lasers &amp; <em>Quanta</em></h1>
          <p>PHYS1204 Exam Question Bank - tap any card to reveal the answer</p>
        </header>

        <div className="focus-tabs">
          {topics.map(t => (
            <button
              key={t.id}
              className={`focus-tab${activeTopic === t.id ? ' active' : ''}`}
              onClick={() => scrollToTopic(t.id)}
            >
              {t.topicNum.replace('Topic ', 'T')}
            </button>
          ))}
        </div>

        {topics.map(t => <FocusTopicSection key={t.id} topic={t} />)}
      </div>

      <button className="focus-totop" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        ↑
      </button>
    </div>
  );
}

export default function App() {
  const initialState = decodeAppState(window.location.hash);
  const [page, setPage] = useState(initialState.page);
  const [searchQuery, setSearchQuery] = useState(initialState.searchQuery);
  const [selectedLevelId, setSelectedLevelId] = useState(initialState.selectedLevelId);
  const [selectedCourseId, setSelectedCourseId] = useState(initialState.selectedCourseId);
  const [selectedModuleId, setSelectedModuleId] = useState(initialState.selectedModuleId);
  const [selectedBoards, setSelectedBoards] = useState({});
  const [guidesSection, setGuidesSection] = useState(initialState.guidesSection);
  const expandAll    = useStore(s => s.expandAll);
  const setModule    = useStore(s => s.setModule);
  const formulaOpen  = useStore(s => s.formulaOpen);
  const toggleFormula = useStore(s => s.toggleFormula);
  const closeExam    = useStore(s => s.closeExam);
  const closeResults = useStore(s => s.closeResults);
  const selectedLevel = LEARNING_LEVELS.find(level => level.id === selectedLevelId) || null;

  useEffect(() => {
    function handleHashChange() {
      const newState = decodeAppState(window.location.hash);
      setPage(newState.page);
      setSearchQuery(newState.searchQuery);
      setSelectedLevelId(newState.selectedLevelId);
      setSelectedCourseId(newState.selectedCourseId);
      setSelectedModuleId(newState.selectedModuleId);
      setGuidesSection(newState.guidesSection);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        pushAppState({
          page,
          selectedLevelId,
          selectedCourseId,
          selectedModuleId,
          guidesSection,
          searchQuery,
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, page, selectedLevelId, selectedCourseId, selectedModuleId, guidesSection]);
  const selectedCourse = selectedLevel
    ? (COURSE_OPTIONS[selectedLevel.id] || []).find(course => course.id === selectedCourseId) || null
    : null;
  const selectedModule = selectedLevelId === 'uni' && selectedCourse
    ? (selectedCourse.modules || []).find(m => m.id === selectedModuleId) || null
    : null;
  const hasLiveContent = selectedModule && selectedModule.implemented;

  function resetPhysicsUi() {
    if (formulaOpen) toggleFormula();
    closeExam();
    closeResults();
  }

  function goHome() {
    resetPhysicsUi();
    setSelectedCourseId(null);
    setSelectedModuleId(null);
    setSelectedLevelId(null);
    setGuidesSection(null);
    setSearchQuery('');
    setPage('learn');
    replaceAppState({
      page: 'learn',
      selectedLevelId: null,
      selectedCourseId: null,
      selectedModuleId: null,
      guidesSection: null,
      searchQuery: '',
    });
  }

  function openGuides(section) {
    setGuidesSection(section || 'all');
    setPage('learn');
    pushAppState({
      page: 'learn',
      selectedLevelId,
      selectedCourseId,
      selectedModuleId,
      guidesSection: section || 'all',
      searchQuery,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBackToCourses() {
    resetPhysicsUi();
    setSelectedCourseId(null);
    setSelectedModuleId(null);
  }

  function goBackToModules() {
    resetPhysicsUi();
    setSelectedModuleId(null);
  }

  function selectModule(mod) {
    resetPhysicsUi();
    setSelectedModuleId(mod.id);
    if (mod.implemented) {
      setModule(mod.module || mod.id);
    }
    pushAppState({
      page,
      selectedLevelId,
      selectedCourseId,
      selectedModuleId: mod.id,
      guidesSection,
      searchQuery,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function selectLevel(levelId) {
    resetPhysicsUi();
    setSelectedLevelId(levelId);
    setSelectedCourseId(null);
    pushAppState({
      page,
      selectedLevelId: levelId,
      selectedCourseId: null,
      selectedModuleId: null,
      guidesSection,
      searchQuery,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function selectCourse(course) {
    resetPhysicsUi();
    setSelectedCourseId(course.id);
    setSelectedModuleId(null);
    pushAppState({
      page,
      selectedLevelId,
      selectedCourseId: course.id,
      selectedModuleId: null,
      guidesSection,
      searchQuery,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function selectBoard(courseId, board) {
    setSelectedBoards(prev => ({ ...prev, [courseId]: board }));
  }

  function openLogin() {
    setPage('login');
    pushAppState({
      page: 'login',
      selectedLevelId,
      selectedCourseId,
      selectedModuleId,
      guidesSection,
      searchQuery,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Keyboard shortcut: Ctrl+E → expand all
  useEffect(() => {
    if (!hasLiveContent) return undefined;

    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        const allIds = topics.flatMap(t => t.questions.map(q => q.qid));
        expandAll(allIds);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expandAll, hasLiveContent]);

  useEffect(() => {
    async function handleAuthCallback() {
      if (!supabase) return;

      const isAuthCallback = window.location.pathname === '/auth/callback';
      if (!isAuthCallback) return;

      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      window.history.replaceState({}, '', '/');
      setPage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    handleAuthCallback();
  }, []);

  if (guidesSection) {
    return <GuidesPage section={guidesSection} onBack={goHome} />;
  }

  if (page === 'login') {
    return <LoginPage onBack={goHome} />;
  }

  if (!selectedLevel) {
    return <LandingHub onSelectLevel={selectLevel} onLogin={openLogin} onOpenGuides={openGuides} searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} selectedBoards={selectedBoards} onBoardChange={selectBoard} onSelectCourse={selectCourse} />;
  }

  if (!selectedCourse) {
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

  // Uni course with modules → show module hub
  if (selectedLevelId === 'uni' && selectedCourse.modules && selectedCourse.modules.length > 0 && !selectedModule) {
    return (
      <ModuleHub
        course={selectedCourse}
        onBack={goBackToCourses}
        onBackHome={goHome}
        onSelectModule={selectModule}
      />
    );
  }

  // Live content - focus theme
  if (hasLiveContent) {
    return <FocusContent module={selectedModule} course={selectedCourse} onBack={goHome} />;
  }

  // Placeholder for non-implemented courses/modules
  return (
    <CoursePlaceholder
      level={selectedLevel}
      course={selectedModule || selectedCourse}
      selectedBoard={selectedBoards[selectedCourse.id]}
      onBack={selectedModule ? goBackToModules : goBackToCourses}
      onBackHome={goHome}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    />
  );
}


