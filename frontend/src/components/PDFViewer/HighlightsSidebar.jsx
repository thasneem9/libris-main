import './HighlightsSidebar.css';
import { colorPalette } from '../../utils/colors';
import { useState } from 'react';

export default function HighlightsSidebar({ annotations }) {
  const [searchTerm, setSearchTerm] = useState('');

  const grouped = colorPalette.reduce((acc, { name }) => {
    acc[name] = annotations.filter(a => a.color === name);
    return acc;
  }, {});

  return (
    <div className="highlight-sidebar">
      {/* ✅ Swatch bar (visual only) */}
      <div className="swatch-bar">
        {colorPalette.map(({ name, hex }) => (
          <div key={name} className="swatch" style={{ backgroundColor: hex }} />
        ))}
      </div>

      {/* ✅ Search input */}
      <input
        type="text"
        className="highlight-search"
        placeholder="Search highlights..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* ✅ Filtered highlights display */}
      <div className="highlight-groups">
        {colorPalette.map(({ name }) => {
          const filtered = grouped[name].filter(a =>
            a.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.comment?.toLowerCase().includes(searchTerm.toLowerCase())
          );

          return filtered.length > 0 && (
            <div key={name} className="highlight-group">
              <h5 className="group-title">{name}</h5>
              {filtered.map((a, idx) => (
                <div key={idx} className="highlight-box">
                  <p>{a.text || '—'}</p>
                  {a.comment && <small className="comment">{a.comment}</small>}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
