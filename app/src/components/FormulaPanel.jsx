import { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import { useStore } from '../store.js';
import { FORMULA_SECTIONS } from '../data/formulas.js';

export default function FormulaPanel() {
  const formulaOpen  = useStore(s => s.formulaOpen);
  const toggleFormula = useStore(s => s.toggleFormula);
  const [activeTab, setActiveTab] = useState(FORMULA_SECTIONS[0].id);
  const rendered = useRef({});

  const activeSection = FORMULA_SECTIONS.find(s => s.id === activeTab) || FORMULA_SECTIONS[0];

  return (
    <>
      {/* Backdrop on mobile */}
      {formulaOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 199, display: 'none' }}
          className="fp-backdrop"
          onClick={toggleFormula}
        />
      )}

      <div className={`formula-panel${formulaOpen ? ' open' : ''}`}>
        {/* Header */}
        <div className="fp-header">
          <span className="fp-title">Formula Cheat Sheet</span>
          <button className="fp-close-btn" onClick={toggleFormula}>✕</button>
        </div>

        {/* Category tabs */}
        <div className="fp-tabs">
          {FORMULA_SECTIONS.map(sec => (
            <button
              key={sec.id}
              className={`fp-tab${activeTab === sec.id ? ' active' : ''}`}
              onClick={() => setActiveTab(sec.id)}
            >
              {sec.title}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="fp-body">
          <div className="fp-section">
            <div className="fp-section-title">{activeSection.title}</div>
            {activeSection.items.map((item, i) => (
              <FormulaItem key={i} item={item} rendered={rendered} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function FormulaItem({ item, rendered }) {
  const ref = useRef(null);
  const key = item.name;

  useEffect(() => {
    if (ref.current && !rendered.current[key]) {
      rendered.current[key] = true;
      try {
        katex.render(item.tex, ref.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch {
        ref.current.textContent = item.tex;
      }
    }
  }, [key, item.tex]);

  return (
    <div className="fp-item">
      <div className="fp-item-name">{item.name}</div>
      <div className="fp-item-expr" ref={ref} />
    </div>
  );
}
