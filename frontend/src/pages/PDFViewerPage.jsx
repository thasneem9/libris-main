// 📄 src/pages/PDFViewerPage.jsx
import { useRef, useState, useEffect, useCallback } from 'react';
import { pdfjs, Document } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import useZoom            from '../hooks/useZoom';
import useAnnotations     from '../hooks/useAnnotations';
import useSelectionPicker from '../hooks/useSelectionPicker';

import PDFHeader       from '../components/PDFViewer/PDFHeader';
import ViewModePopup   from '../components/PDFViewer/ViewModePopup';
import NavModePopup    from '../components/PDFViewer/NavModePopup';
import PDFSinglePage   from '../components/PDFViewer/PDFSinglePage';
import PDFProgressBar  from '../components/PDFViewer/PDFProgressBar';
import ColorSwatchBar  from '../components/ColorSwatchBar';
import PenButton       from '../components/PDFViewer/PenButton';
import { PiHighlighterLight } from "react-icons/pi";
import './PDFViewerPage.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export default function PDFViewerPage() {
  /* ──────────────────────────── routing & zoom ────────────────────────── */
  const { state }  = useLocation();                    // { bookUrl, bookId }
  const { bookUrl, bookId } = state || {};
  const { scale, zoomIn, zoomOut } = useZoom();

  /* ────────────────────────────── ui state ────────────────────────────── */
  const [numPages, setNumPages]           = useState(0);
  const [viewMode, setViewMode]           = useState('book');   // 'single' | 'book'
  const [navMode,  setNavMode]            = useState('flip');   // 'scroll' | 'flip'
  const [eraserMode, setEraserMode]       = useState(false);

  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showNavPopup,  setShowNavPopup]  = useState(false);

  /* ───────────────────────── navigation helpers ──────────────────────── */
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const pagesPerTurn = viewMode === 'single' ? 1 : 2;
  const totalTurns   = Math.ceil(numPages / pagesPerTurn);
  const hasPrev      = navMode === 'flip' && currentPageIdx > 0;
  const hasNext      = navMode === 'flip' && currentPageIdx + 1 < totalTurns;
  const startPage    = currentPageIdx * pagesPerTurn + 1;
  const endPage      = Math.min(startPage + pagesPerTurn - 1, numPages);
  const percent      = numPages ? Math.round((endPage / numPages) * 100) : 0;
const pageRefs = useRef({});

  /* ─────────────────── highlights (server‑backed) ────────────────────── */
  const { list: annList, add: addAnn, update: updAnn, remove: delAnn }
    = useAnnotations(bookId);

  /* highlight picker (only when highlight‑mode ON) */
  const [picker, setPicker] = useState(null);
  const onTextMouseUp       = useSelectionPicker(setPicker);

  /* ─────────────────────────── drawing state ─────────────────────────── */
  const wrapperRef = useRef(null);
  const [penMode,       setPenMode]       = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);

  /** one "live" line while dragging */
  const [draftLine, setDraftLine] = useState(null);
  /**
   * persisted drawings:
   * { id:string, color:string, points:[{x,y}] }
   */
  const [drawings, setDrawings] = useState([]);

const toLocal = (e) => {
  const rect = wrapperRef.current.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
};


  /* push finished line into drawings */
  const commitDraft = useCallback(() => {
    if (!draftLine || draftLine.points.length < 2) return;
    setDrawings(d => [...d, draftLine]);
    setDraftLine(null);
  }, [draftLine]);

  /* hit‑test helper for eraser (distance to polyline ≤ 6 px) */
  const hitDrawing = useCallback((pt) => {
    const dist = (p,q) => Math.hypot(p.x-q.x, p.y-q.y);
    for (const d of drawings) {
      for (let i=1;i<d.points.length;i++){
        const a=d.points[i-1], b=d.points[i];
        // nearest distance from point → segment
        const t = Math.max(0, Math.min(1,
          ((pt.x-a.x)*(b.x-a.x)+(pt.y-a.y)*(b.y-a.y)) /
          ((b.x-a.x)**2 + (b.y-a.y)**2 || 1)
        ));
        const proj = { x: a.x + t*(b.x-a.x), y: a.y + t*(b.y-a.y) };
        if (dist(pt,proj) <= 6) return d.id;
      }
    }
    return null;
  }, [drawings]);

  /* ─────────────────────── page size map (for ann) ───────────────────── */
  const [pageRects, setPageRects] = useState({});
  const savePageRect = (page, el) => {
    if (!el) return;
    const { offsetWidth:w, offsetHeight:h } = el;
    setPageRects(p => (p[page]?.width===w && p[page]?.height===h) ? p
      : { ...p, [page]:{width:w,height:h} });
  };

  /* ───────────────────────── body background hook ────────────────────── */
  useEffect(()=>{
    document.body.classList.add('pdf-viewer-bg');
    return () => document.body.classList.remove('pdf-viewer-bg');
  },[]);

  /* ────────────────────────── pointer handlers ───────────────────────── */
  const onPointerDown = (e) => {
    if (eraserMode) {
      /* maybe delete a drawing */
      const hitId = hitDrawing(toLocal(e));
      if (hitId) {
        setDrawings(d => d.filter(x => x.id !== hitId));
        console.log('🧹 ERASE drawing', hitId);
      }
      return;
    }
    if (!penMode) return;
    const p = toLocal(e);
    setDraftLine({ id: crypto.randomUUID(), color: draftLine?.color || '#ff0000', points: [p] });
  };

  const onPointerMove = (e) => {
    if (!penMode || !draftLine?.points) return;
    setDraftLine(dl => ({ ...dl, points:[...dl.points, toLocal(e)] }));
  };

  const onPointerUp = () => commitDraft();

  /* ─────────────────────── Highlight helpers ─────────────────────────── */
  const confirmColour = (col, cmt='') => {
    addAnn({ ...picker.info, color: col, bookId, ...(cmt && {comment:cmt}) });
    setPicker(null);
  };
  const addWithComment = () => {
    const c=prompt('Enter comment');
    if (c) confirmColour('Amber Gold', c);
  };

  /* bind highlight only when highlight‑mode is active */
  const containerProps = (!highlightMode || penMode || eraserMode)
    ? {}
    : { onMouseUp: onTextMouseUp };

  /* ─────────────────────────────── JSX ──────────────────────────────── */
  return (
    <section style={{ padding: 8 }}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <PDFHeader
        scale={scale} zoomIn={zoomIn} zoomOut={zoomOut}
       eraserMode={eraserMode}
setEraserMode={() => {
  setEraserMode(e => {
    const next = !e;
    if (next) {
      setPenMode(false);
      setHighlightMode(false);
    }
    return next;
  });
}}

        onViewClick={() => setShowViewPopup(v => !v)}
        onNavClick ={() => setShowNavPopup (v => !v)}
      >
        {/* Pen toggle */}
        <PenButton
          value={draftLine?.color || '#ff0000'}
         onChange={(hex) => {
  setPenMode(true);
  setHighlightMode(false);
  setEraserMode(false);
  setDraftLine(dl => ({ ...(dl||{}), color: hex }));
}}

        />
        {/* Highlight toggle */}
       <PiHighlighterLight 
          className={`pdf-btn icon ${highlightMode ? 'active' : ''}`}
          title="Highlight text"
         onClick={() => {
  setHighlightMode(h => {
    const next = !h;
    if (next) {
      setPenMode(false);
      setEraserMode(false);
    }
    return next;
  });
}}

       />
      </PDFHeader>

      {showViewPopup && (
        <ViewModePopup viewMode={viewMode} setViewMode={setViewMode}
          close={() => setShowViewPopup(false)} />
      )}
      {showNavPopup && (
        <NavModePopup navMode={navMode} setNavMode={setNavMode}
          close={() => setShowNavPopup(false)} />
      )}

      {/* ── Main area ───────────────────────────────────────────────── */}
      <div
        className={`
          pdf-viewer-container
          ${penMode      ? 'pen-mode'      : ''}
          ${highlightMode? 'highlight-mode': ''}
          ${eraserMode   ? 'eraser-mode'   : ''}
        `}
        {...containerProps}
      >
      

        {/* ── PDF document ────────────────────────────────────────── */}
       <Document file={bookUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
  <div
    ref={wrapperRef}
    className={`pdf-doc-wrapper ${penMode ? 'pen-mode' : ''}`}
    style={{ position:'relative' }}
    onPointerDown={onPointerDown}
    onPointerMove={onPointerMove}
    onPointerUp  ={onPointerUp}
  >
  
    {/* ⬇ Put the SVG inside the scrollable wrapper */}
    {(drawings.length || draftLine?.points?.length > 1) && (
      <svg
        style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:9 }}
        width="100%" height="100%"
      >
        {drawings.map(d => (
          <polyline key={d.id}
            points={d.points.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none" stroke={d.color} strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round"
          />
        ))}
        {draftLine?.points?.length > 1 && (
          <polyline
            points={draftLine.points.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none" stroke={draftLine.color} strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round"
          />
        )}
      </svg>
    )}

    {/* Page rendering continues below... */}

            {navMode === 'flip'
              ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPageIdx}
                    className="page-pair"
                    initial={{ opacity:0, x:50 }}
                    animate={{ opacity:1, x:0 }}
                    exit =  {{ opacity:0, x:-50 }}
                    transition={{ duration:0.3, ease:'easeInOut' }}
                  >
                    {Array.from({ length: pagesPerTurn }, (_, i) => {
                      const pageNumber = startPage + i;
                      return pageNumber <= numPages && (
                        <PDFSinglePage
                          key={pageNumber}
                          pageNumber={pageNumber}
                          scale={scale}
                          pageRef={pageRefs}
                          savePageRect={savePageRect}
                          pageBox={pageRects[pageNumber]}
                          annotations={annList.filter(a => a.page === pageNumber)}
                          eraserMode={eraserMode}
                          onComment={updAnn}
                          onDelete={delAnn}
                        />
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              )
              : (
                Array.from({ length: numPages }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <PDFSinglePage
                      key={pageNumber}
                      pageNumber={pageNumber}
                      scale={scale}
                      pageRef={pageRefs}
                      savePageRect={savePageRect}
                      pageBox={pageRects[pageNumber]}
                      annotations={annList.filter(a => a.page === pageNumber)}
                      eraserMode={eraserMode}
                      onComment={updAnn}
                      onDelete={delAnn}
                    />
                  );
                })
              )
            }
          </div>
        </Document>

        {/* highlight swatch popup */}
        {picker && (
          <div style={{
            position:'absolute', left:picker.x, top:picker.y, zIndex:999
          }}>
            <ColorSwatchBar onSelect={confirmColour} onComment={addWithComment}/>
          </div>
        )}

        {/* progress bar (flip mode) */}
        {navMode==='flip' && numPages>0 && (
          <PDFProgressBar
            startPage={startPage} endPage={endPage} numPages={numPages}
            percent={percent}
            onPrev={()=>setCurrentPageIdx(i=>Math.max(i-1,0))}
            onNext={()=>setCurrentPageIdx(i=>Math.min(i+1,totalTurns-1))}
            hasPrev={hasPrev} hasNext={hasNext}
          />
        )}
      </div>
    </section>
  );
}
