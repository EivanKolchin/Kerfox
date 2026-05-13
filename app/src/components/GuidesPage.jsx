import { useEffect, useState } from 'react';

function LogoMark() {
  return (
    <div className="brand-mark">
      <img src="/kerfox.png" alt="Kerfox logo" />
    </div>
  );
}

function TopBar({ onBack }) {
  return (
    <div className="landing-topbar">
      <div className="landing-brand">
        <LogoMark />
        <div>
          <div className="landing-brand-kicker">Kerfox</div>
          <div className="landing-brand-subtitle">Study guides & resources</div>
        </div>
      </div>
      <div className="landing-topbar-actions">
        <button className="ghost-chip" onClick={onBack}>
          ← Back to learning hub
        </button>
      </div>
    </div>
  );
}

function ResearchToggle({ children, label }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="guide-research-wrap">
      <button className="guide-research-toggle" onClick={() => setOpen(!open)}>
        <span>{open ? '−' : '+'}</span>
        {label || 'Show research & evidence'}
      </button>
      {open && <div className="guide-research-body">{children}</div>}
    </div>
  );
}

function SourceList({ sources }) {
  if (!sources || sources.length === 0) return null;
  return (
    <div className="guide-sources">
      <strong>Recommended sources</strong>
      <ul>
        {sources.map((s, i) => (
          <li key={i}>
            {s.url ? (
              <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
            ) : (
              s.label
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const GUIDE_SECTIONS = [
  {
    id: 'learning',
    title: 'Optimising Your Learning',
    subtitle: 'Study techniques backed by cognitive science',
    emoji: '🧠',
    tips: [
      {
        title: 'Active recall',
        summary: 'Test yourself instead of re-reading. Close the book and retrieve the information from memory — that is what strengthens neural pathways.',
        research: (
          <>
            <p><strong>What research found:</strong> Karpicke &amp; Roediger (2008) demonstrated that students who practiced retrieval remembered ~50% more after one week than those who only re-studied. The effect holds across subjects from biology to history.</p>
            <p><strong>What it means for you:</strong> Replace passive re-reading with flashcards, practice questions, or explaining a topic from memory. Every retrieval attempt — even failed ones — strengthens learning.</p>
          </>
        ),
      },
      {
        title: 'Spaced repetition',
        summary: 'Review material at increasing intervals — 1 day, 3 days, 1 week, 1 month. This aligns with how memory consolidation works.',
        research: (
          <>
            <p><strong>What research found:</strong> Cepeda et al. (2006, 2008) showed that spaced practice produces dramatically better long-term retention than massed (cramming) practice. The optimal gap between study sessions is about 10–20% of the time you want to remember the material.</p>
            <p><strong>Data point:</strong> In one study, students using spaced repetition scored 92% on a final test vs 64% for massed practice.</p>
            <p><strong>What it means for you:</strong> Use apps like Anki or a simple calendar. Review notes from today's lecture tomorrow, then in 3 days, then weekly.</p>
          </>
        ),
      },
      {
        title: 'Interleaving',
        summary: 'Mix different topics in a single study session instead of blocking them. This forces your brain to discriminate between problem types.',
        research: (
          <>
            <p><strong>What research found:</strong> Rohrer (2012) found that interleaving led to 43% higher test scores than blocked practice. The effect is strongest in maths and science but applies broadly.</p>
            <p><strong>Why it works:</strong> Interleaving forces you to identify <em>which</em> strategy fits the problem before solving it — a skill that mirrors real exam conditions.</p>
            <p><strong>What it means for you:</strong> If you have three topics to revise, mix questions from all three in each session rather than finishing one topic entirely before moving on.</p>
          </>
        ),
      },
      {
        title: 'Elaboration & concrete examples',
        summary: 'Explain ideas in your own words and connect them to real-world examples. Ask "why" and "how" questions.',
        research: (
          <>
            <p><strong>What research found:</strong> Dunlosky et al. (2013) rated elaborative interrogation and self-explanation as "moderate to high utility" — particularly effective for complex material.</p>
            <p><strong>What it means for you:</strong> When studying a concept, ask yourself: "How does this relate to something I already know? Can I think of an example from everyday life?" Teaching someone else is one of the best elaboration strategies.</p>
          </>
        ),
      },
    ],
    sources: [
      { label: 'Dunlosky et al. (2013) — Improving Students\' Learning With Effective Learning Techniques', url: 'https://journals.sagepub.com/doi/10.1177/1529100612453266' },
      { label: 'Brown, Roediger & McDaniel — "Make It Stick: The Science of Successful Learning"' },
      { label: 'Karpicke & Roediger (2008) — The Critical Importance of Retrieval for Learning', url: 'https://doi.org/10.1126/science.1152408' },
    ],
  },
  {
    id: 'health',
    title: 'Taking Care of Your Health',
    subtitle: 'Physical and mental wellbeing for sustainable studying',
    emoji: '💚',
    tips: [
      {
        title: 'Sleep is non-negotiable',
        summary: 'Aim for 7–9 hours. Sleep is when your brain consolidates memories and clears metabolic waste. Pulling all-nighters can reduce retention by up to 40%.',
        research: (
          <>
            <p><strong>What research found:</strong> Walker (2017) in "Why We Sleep" presents extensive evidence that sleep before learning prepares the brain to absorb new information, and sleep after learning solidifies it. A single night of 4–5 hours of sleep can reduce cognitive performance by as much as being legally drunk.</p>
            <p><strong>Data point:</strong> Students who consistently get 7+ hours of sleep score an average of one letter grade higher than those who sleep less (Walker, 2017).</p>
            <p><strong>What it means for you:</strong> Prioritise sleep over last-minute cramming. A good night's rest is more productive than a bleary-eyed hour of re-reading.</p>
          </>
        ),
      },
      {
        title: 'Move your body',
        summary: '20–30 minutes of aerobic exercise a day boosts blood flow to the brain, improves mood, and enhances attention and memory.',
        research: (
          <>
            <p><strong>What research found:</strong> Hillman et al. (2008) showed that children and young adults who were more physically active had superior academic performance and cognitive control. Exercise increases BDNF (brain-derived neurotrophic factor), a protein that supports neuron growth.</p>
            <p><strong>Data point:</strong>A 2019 meta-analysis found that students who exercised 3+ times per week had 0.3–0.5 SD higher GPAs than sedentary peers.</p>
            <p><strong>What it means for you:</strong> A brisk walk, jog, or 20-minute workout before a study session can sharpen focus. Use movement as a break — it's more restorative than scrolling your phone.</p>
          </>
        ),
      },
      {
        title: 'Nutrition & hydration',
        summary: 'Your brain consumes ~20% of your energy. Feed it with complex carbs, healthy fats, and plenty of water throughout the day.',
        research: (
          <>
            <p><strong>What research found:</strong> Gomez-Pinilla (2008) reviewed the impact of diet on brain function. Omega-3 fatty acids (found in fish, nuts), antioxidants (berries, dark chocolate), and complex carbohydrates (oats, whole grains) all support cognitive performance. Even mild dehydration (1–2% fluid loss) impairs concentration.</p>
            <p><strong>What it means for you:</strong> Start your study day with a balanced meal. Keep water on your desk. Avoid sugar spikes that lead to energy crashes.</p>
          </>
        ),
      },
      {
        title: 'Structured breaks',
        summary: 'Study in focused blocks (e.g. 50 minutes) followed by 10-minute breaks. The Pomodoro Technique is a simple way to maintain high concentration.',
        research: (
          <>
            <p><strong>What research found:</strong> Ericsson et al. (1993) found that elite performers practice in focused sessions of ~90 minutes with rest in between. The brain's attentional resources deplete after 45–60 minutes of intense focus; a short break restores them.</p>
            <p><strong>What it means for you:</strong> Use a timer. During breaks, step away from your desk — stretch, walk, hydrate. Avoid screens if possible. Your brain needs true rest, not just a different stimulus.</p>
          </>
        ),
      },
    ],
    sources: [
      { label: 'Walker — "Why We Sleep" (2017)', url: 'https://www.sleepdiplomat.com/' },
      { label: 'Hillman, Erickson & Kramer (2008) — Exercise and the Brain', url: 'https://doi.org/10.1038/nrn2298' },
      { label: 'Gomez-Pinilla (2008) — Brain foods: the effects of nutrients on brain function', url: 'https://doi.org/10.1038/nrn2421' },
    ],
  },
  {
    id: 'coping',
    title: 'Coping & Wellbeing',
    subtitle: 'Managing stress, building resilience, and knowing when to seek help',
    emoji: '🫂',
    tips: [
      {
        title: 'Stress management',
        summary: 'Moderate stress can enhance performance — but chronic stress impairs memory and health. Learn to recognise your stress signals and act early.',
        research: (
          <>
            <p><strong>What research found:</strong> Crum &amp; Langer (2007) showed that mindset about stress matters: students who viewed stress as enhancing (rather than debilitating) had better health and performance outcomes. The Yerkes-Dodson law describes an inverted-U relationship — moderate stress sharpens focus, but too much impairs it.</p>
            <p><strong>What it means for you:</strong> Reframe exam stress as your body preparing to perform. Use deep breathing (4 counts in, 6 counts out) to regulate your nervous system during study sessions and before exams.</p>
          </>
        ),
      },
      {
        title: 'Mindfulness & meditation',
        summary: 'Even 5–10 minutes of daily mindfulness practice can reduce anxiety and improve concentration.',
        research: (
          <>
            <p><strong>What research found:</strong> Zeidan et al. (2010) found that 4 days of 20-minute mindfulness training significantly improved working memory, visuospatial processing, and reduced fatigue. A 2014 meta-analysis of 47 trials found that mindfulness programs reduced anxiety, depression, and stress.</p>
            <p><strong>What it means for you:</strong> Try a brief breathing exercise before studying. Free apps like Insight Timer or Medito offer short guided sessions. Consistency matters more than duration.</p>
          </>
        ),
      },
      {
        title: 'Imposter syndrome',
        summary: 'Feeling like you do not belong or will be "found out" is incredibly common. It affects 70% of people at some point — including high achievers.',
        research: (
          <>
            <p><strong>What research found:</strong> Clance &amp; Imes (1978) first described imposter phenomenon, noting that high-achieving individuals often attribute success to luck rather than ability. More recent research (Sakulku &amp; Alexander, 2011) shows it is especially prevalent in academic settings and among underrepresented groups.</p>
            <p><strong>What it means for you:</strong> Talk to peers — you will likely find they feel the same way. Keep a "success file" of positive feedback and achievements. Reframe "I do not know this yet" as a learning opportunity, not a failing.</p>
          </>
        ),
      },
      {
        title: 'When to seek help',
        summary: 'If stress, anxiety, or low mood are affecting your daily life, reach out. Universities and schools have free counselling services.',
        research: (
          <>
            <p><strong>What research found:</strong> Early intervention for mental health concerns significantly improves outcomes. The UK's NHS reports that 1 in 6 university students experience clinically significant anxiety or depression. Counselling and CBT are both highly effective treatments.</p>
            <p><strong>What it means for you:</strong> There is no shame in asking for help. Most institutions offer same-day or next-day wellbeing appointments. You can also call Samaritans (116 123) or text SHOUT (85258) 24/7 in the UK.</p>
          </>
        ),
      },
    ],
    sources: [
      { label: 'Crum & Langer (2007) — Mindset and Stress', url: 'https://doi.org/10.1037/0022-3514.92.4.716' },
      { label: 'Zeidan et al. (2010) — Mindfulness Meditation Improves Cognition', url: 'https://doi.org/10.1016/j.cognition.2010.03.006' },
      { label: 'Clance & Imes (1978) — The Imposter Phenomenon in High Achieving Women' },
    ],
  },
  {
    id: 'exam',
    title: 'Exam Preparation Timelines',
    subtitle: 'A structured approach to preparing for exams over weeks, days, and hours',
    emoji: '📅',
    tips: [
      {
        title: '12–8 weeks out: Build the foundation',
        summary: 'Create a syllabus checklist. Attend all lectures/tutorials. Make summary notes topic-by-topic. Do not cram — aim to understand, not memorise.',
        research: (
          <>
            <p><strong>What research suggests:</strong> Distributed practice (spacing your studying over weeks) is one of the most robust findings in learning science (Cepeda et al., 2006). Starting 12 weeks before exams gives your brain time to consolidate material across multiple sleep cycles.</p>
            <p><strong>Practical plan:</strong> Divide your syllabus into 8–10 chunks. Cover one chunk per week, reviewing the previous week's material for 15 minutes before starting new content.</p>
          </>
        ),
      },
      {
        title: '6–4 weeks out: Deep practice',
        summary: 'Switch from note-making to active testing. Do past papers, write out answers from memory, identify weak areas.',
        research: (
          <>
            <p><strong>What research found:</strong> Putnam et al. (2016) reviewed practice testing and found it consistently outperforms re-reading, summarising, and concept mapping. A student who does 3+ past papers under timed conditions improves by an average of 0.5–1 grade boundaries.</p>
            <p><strong>Practical plan:</strong> Do one past paper per week, untimed at first. Review mistakes immediately. Build a "mistake log" — a single document listing types of errors you make.</p>
          </>
        ),
      },
      {
        title: '4–2 weeks out: Targeted revision',
        summary: 'Focus on your weakest topics. Use active recall and spaced repetition. Do timed past papers under exam conditions.',
        research: (
          <>
            <p><strong>What research suggests:</strong> This is the time for "desirable difficulties" (Bjork &amp; Bjork, 2011). Making practice slightly harder — by imposing time pressure, mixing topics, or reducing cues — enhances long-term retention more than easy practice.</p>
            <p><strong>Practical plan:</strong> Identify 3–5 weakest topics from your past paper performance. Dedicate 60% of your time to these. Use the Pomodoro method. Do one full timed paper every 3–4 days.</p>
          </>
        ),
      },
      {
        title: 'The week before: Consolidate & rest',
        summary: 'Light review only. Trust your preparation. Prioritise sleep, nutrition, and calm. Do not attempt new material.',
        research: (
          <>
            <p><strong>What research found:</strong> Cramming the night before is the least effective strategy. A meta-analysis by Kornell &amp; Bjork (2007) showed that spaced learners consistently outperformed massed learners even when total study time was the same.</p>
            <p><strong>Practical plan:</strong> The final 2–3 days: review your mistake log, do one short active recall session per topic (no more than 90 minutes total per day). Walk, sleep, eat well.</p>
          </>
        ),
      },
      {
        title: 'Exam day: Execute',
        summary: 'Have a calm morning routine. Arrive early. Read all questions before starting. Tackle easier questions first. Watch your timing.',
        research: (
          <>
            <p><strong>What research suggests:</strong> Performance anxiety is normal. The "arousal reappraisal" technique — telling yourself "I am excited, not anxious" — has been shown to improve exam performance (Brooks, 2014). Deep breathing before starting reduces cortisol and improves access to working memory.</p>
            <p><strong>Practical plan:</strong> 3 deep breaths before opening the paper. Skim all questions. Start with a question you are confident about to build momentum. Allocate time per question and stick to it.</p>
          </>
        ),
      },
    ],
    sources: [
      { label: 'Cepeda et al. (2006) — Spaced Repetition and Memory', url: 'https://doi.org/10.1037/0033-2909.132.3.354' },
      { label: 'Putnam et al. (2016) — Does Practice Testing Boost Learning?', url: 'https://doi.org/10.1177/1529100616680033' },
      { label: 'Bjork & Bjork (2011) — Desirable Difficulties in Learning' },
      { label: 'Brooks (2014) — Arousal Reappraisal and Performance', url: 'https://doi.org/10.1037/a0037410' },
    ],
  },
];

function GuideSection({ section, initialOpen }) {
  const [openResearch, setOpenResearch] = useState(false);
  const [expandedTips, setExpandedTips] = useState({});

  useEffect(() => {
    if (initialOpen) setOpenResearch(true);
  }, [initialOpen]);

  function toggleTip(i) {
    setExpandedTips(prev => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <article className="guide-section" id={`guide-${section.id}`}>
      <div className="guide-section-header">
        <span className="guide-section-emoji">{section.emoji}</span>
        <div>
          <h2 className="guide-section-title">{section.title}</h2>
          <p className="guide-section-subtitle">{section.subtitle}</p>
        </div>
      </div>

      <div className="guide-tips">
        {section.tips.map((tip, i) => (
          <div key={i} className="guide-tip-card">
            <div className="guide-tip-head">
              <h3 className="guide-tip-title">{tip.title}</h3>
              <button
                className={`guide-tip-toggle ${expandedTips[i] ? 'open' : ''}`}
                onClick={() => toggleTip(i)}
                aria-label={expandedTips[i] ? 'Show less' : 'Show research details'}
              >
                <span>{expandedTips[i] ? '–' : '+'}</span>
                Research
              </button>
            </div>
            <p className="guide-tip-summary">{tip.summary}</p>
            {expandedTips[i] && (
              <div className="guide-tip-research">
                {tip.research}
              </div>
            )}
          </div>
        ))}
      </div>

      <ResearchToggle label="View all references & sources">
        <SourceList sources={section.sources} />
      </ResearchToggle>
    </article>
  );
}

export default function GuidesPage({ section, onBack }) {
  useEffect(() => {
    if (section && section !== 'all') {
      setTimeout(() => {
        document.getElementById(`guide-${section}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [section]);

  return (
    <div className="landing-shell guides-shell">
      <TopBar onBack={onBack} />

      <main className="landing-main">
        <section className="guides-hero">
          <div className="guides-hero-copy">
            <span className="landing-hero-kicker">Evidence-based study guides</span>
            <h1>Learn smarter, not harder</h1>
            <p>
              Each guide below summarises what cognitive science and education research tell us about effective
              studying, student wellbeing, and exam preparation. Expand any section to see the original studies
              and recommendations.
            </p>
          </div>
          <nav className="guides-hero-nav">
            {GUIDE_SECTIONS.map(s => (
              <a key={s.id} href={`#guide-${s.id}`} className="guides-hero-nav-item">
                <span>{s.emoji}</span>
                <span>{s.title}</span>
              </a>
            ))}
          </nav>
        </section>

        {GUIDE_SECTIONS.map((s, i) => (
          <GuideSection key={s.id} section={s} initialOpen={section === s.id} />
        ))}

        <footer className="guides-footer">
          <p>
            These guides summarise peer-reviewed research to help students study more effectively. Always consult
            your institution's wellbeing and academic support services for personalised advice.
          </p>
        </footer>
      </main>
    </div>
  );
}
