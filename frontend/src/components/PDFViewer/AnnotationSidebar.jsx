import './HighlightsSidebar.css';
import { useState } from 'react';

export default function AnnotationsSidebar({ annotations }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = annotations.filter(a =>
    a.comment?.trim() &&
    a.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const grouped = filtered.reduce((acc, a) => {
    if (!acc[a.page]) acc[a.page] = [];
    acc[a.page].push(a);
    return acc;
  }, {});

  return (
    <div className="highlight-sidebar">
      <input
        type="text"
        className="highlight-search"
        placeholder="Search comments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="highlight-groups">
        {Object.keys(grouped).map(page => (
          <div key={page} className="highlight-group">
            <h5 className="group-title">Page {page}</h5>
            {grouped[page].map((a, idx) => (
              <div key={idx} className="highlight-box">
                <small className="comment">{a.comment}</small>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
