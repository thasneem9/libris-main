import { useCallback } from 'react';

export default function useSelectionPicker(setPicker) {
  return useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;

    const text = sel.toString().trim();
    if (!text) return;

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const node = range.startContainer.nodeType === Node.TEXT_NODE
      ? range.startContainer.parentElement
      : range.startContainer;

    const pageDiv = node?.closest('.pdf-page');
    if (!pageDiv) return;

    const page = Number(pageDiv.dataset.page);
    const pageRect = pageDiv.getBoundingClientRect();

    setPicker({
      x: rect.left - pageRect.left,
      y: rect.top - pageRect.top - 32,
      info: {
        page,
        text,
        xPct: (rect.left - pageRect.left) / pageRect.width,
        yPct: (rect.top - pageRect.top) / pageRect.height,
        wPct: rect.width / pageRect.width,
        hPct: rect.height / pageRect.height,
      },
    });

    sel.removeAllRanges();
  }, [setPicker]);
}
