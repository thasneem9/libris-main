import { useState } from 'react';

export default function usePageRects() {
  const [pageRects, setPageRects] = useState({});

  const savePageRect = (page, el) => {
    if (!el) return;
    const { offsetWidth: w, offsetHeight: h } = el;
    setPageRects(prev => {
      const old = prev[page] || {};
      if (old.width !== w || old.height !== h) {
        return { ...prev, [page]: { width: w, height: h } };
      }
      return prev;
    });
  };

  return { pageRects, savePageRect };
}
