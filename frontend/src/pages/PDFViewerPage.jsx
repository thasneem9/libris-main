import { useRef, useState, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import useZoom from '../hooks/useZoom.js';
import useAnnotations from '../hooks/useAnnotations.js';
import ColorSwatchBar from '../components/ColorSwatchBar';
import AnnotationLayer from '../components/AnnotationLayer';
import { LuGalleryHorizontal } from "react-icons/lu";

import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './PDFViewerPage.css';

import { LiaEye, LiaSyncAltSolid } from 'react-icons/lia'; // new icon

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export default function PDFViewerPage() {
  const [showNavPopup, setShowNavPopup] = useState(false);

  const { state } = useLocation();
  const { bookUrl, bookId } = state || {};

  const [numPages, setNumPages] = useState(null);
  const [eraserMode, setEraserMode] = useState(false);
  const [viewMode, setViewMode] = useState('book'); // 'single' | 'book'
  const [navMode, setNavMode] = useState('flip');   // 'scroll' | 'flip'
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [picker, setPicker] = useState(null);
  const [currentPageIdx, setCurrentPageIdx] = useState(0); // starts at 0 for flip mode
const pageRefs = useRef({});     // 🔑 keeps a ref per page


useEffect(() => {
  document.body.classList.add('pdf-viewer-bg');
  return () => {
    document.body.classList.remove('pdf-viewer-bg');
  };
}, []);

 // --- flip helpers -------------
const pagesPerTurn = viewMode === 'single' ? 1 : 2;
const totalTurns   = Math.ceil((numPages || 0) / pagesPerTurn);
const hasPrevTurn  = navMode === 'flip' && currentPageIdx > 0;
const hasNextTurn  = navMode === 'flip' && currentPageIdx + 1 < totalTurns;

// --------------------------------
  /* Bar------ */
  const currentStartPage = currentPageIdx * pagesPerTurn + 1;
const currentEndPage   = Math.min(currentStartPage + pagesPerTurn - 1, numPages || 0);
const percent = numPages ? Math.round((currentEndPage / numPages) * 100) : 0;
/* ---- */
  const { scale, zoomIn, zoomOut } = useZoom();
  const { list: annList, add: addAnn, update: updAnn, remove: delAnn } = useAnnotations(bookId);
  const [pageRects, setPageRects] = useState({});


 
  const confirmColour = (colorName, comment = '') => {
    addAnn({ ...picker.info, color: colorName, bookId, ...(comment && { comment }) });
    setPicker(null);
  };

  const addWithComment = () => {
    const comment = prompt('Enter your comment');
    if (comment) {
      const color = 'Amber Gold';
      addAnn({ ...picker.info, color, comment, bookId });
      setPicker(null);
    }
  };

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

  const onMouseUp = () => {
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
  };

  const onComment = (ann) => {
    const txt = prompt('Enter comment', ann.comment || '');
    if (txt !== null) updAnn(ann._id, { comment: txt });
  };

const renderPage = (pageNum) => (
  <div
    key={pageNum}
    data-page={pageNum}
    className="pdf-page"
    style={{ position: 'relative', marginBottom: 16 }}
    ref={(el) => {
      if (!el) return;
      pageRefs.current[pageNum] = el;
    }}
  >
    <Page
      pageNumber={pageNum}
      scale={scale}
      onRenderSuccess={() => {
        const el = pageRefs.current[pageNum];
        if (el) {
          const { offsetWidth: w, offsetHeight: h } = el;
          setPageRects((prev) => {
            const old = prev[pageNum] || {};
            if (old.width !== w || old.height !== h) {
              return { ...prev, [pageNum]: { width: w, height: h } };
            }
            return prev;
          });
        }
      }}
    />

    {pageRects[pageNum] && (
      <AnnotationLayer
        pageBox={pageRects[pageNum]}
        annotations={annList.filter((a) => a.page === pageNum)}
        onComment={onComment}
        onDelete={delAnn}
        eraserMode={eraserMode}
      />
    )}
  </div>
);




  const renderPages = () => {
    if (navMode === 'scroll') {
      // full scrollable view
      if (viewMode === 'single') {
        return Array.from({ length: numPages || 0 }).map((_, i) => renderPage(i + 1));
      }
      if (viewMode === 'book') {
        return Array.from({ length: Math.ceil((numPages || 0) / 2) }).map((_, idx) => {
          const left = idx * 2 + 1;
          const right = left + 1;
          return (
            <div key={`pair-${idx}`} className="page-pair">
              {renderPage(left)}
              {right <= numPages && renderPage(right)}
            </div>
          );
        });
      }
    } else {
      // flip mode (paginate)
      const start = currentPageIdx * (viewMode === 'single' ? 1 : 2);
      const left = start + 1;
      const right = left + 1;

      return (
        <div className="page-pair">
          {renderPage(left)}
          {viewMode === 'book' && right <= numPages && renderPage(right)}
        </div>
      );
    }
  };

  const totalFlips = viewMode === 'single'
    ? Math.ceil((numPages || 0) / 1)
    : Math.ceil((numPages || 0) / 2);

  return (
    <section style={{ padding: 8 }}>
     <header className="pdf-header">
  <div className="pdf-toolbar">
    <button className="pdf-btn" onClick={zoomOut}>−</button>
    <span className="pdf-zoom">{Math.round(scale * 100)}%</span>
    <button className="pdf-btn" onClick={zoomIn}>+</button>

    <button
      className={`pdf-btn ${eraserMode ? 'active' : ''}`}
      onClick={() => setEraserMode((m) => !m)}
      title="Toggle eraser"
    >
      🧹 Eraser
    </button>

    <button className="pdf-btn icon" onClick={() => setShowViewPopup(v => !v)} title="View Mode">
      <LiaEye size={18} />
    </button>

    <button className="pdf-btn icon" onClick={() => setShowNavPopup(v => !v)} title="Navigation Mode">
      <LuGalleryHorizontal size={18} />
    </button>
  </div>
</header>


      {showViewPopup && (
        <div
          className='pdf-popup'
        >
          <p
            style={{ margin: 4, cursor: 'pointer', fontWeight: viewMode === 'single' ? 600 : 400 }}
            onClick={() => {
              console.log('📄 viewMode → single');
              setViewMode('single');
              setShowViewPopup(false);
            }}
          >
            📄 Single page
          </p>
          <p
            style={{ margin: 4, cursor: 'pointer', fontWeight: viewMode === 'book' ? 600 : 400 }}
            onClick={() => {
              console.log('📖 viewMode → book');
              setViewMode('book');
              setShowViewPopup(false);
            }}
          >
            📖 Two-page (book)
          </p>
        </div>
      )}
      {showNavPopup && (
  <div
    style={{
      position: 'absolute',
      top: 40,
      left: 260,
      background: '#fff',
      border: '1px solid #ccc',
      borderRadius: 4,
      padding: 8,
      zIndex: 9999,
    }}
  >
    <p
      style={{ margin: 4, cursor: 'pointer', fontWeight: navMode === 'scroll' ? 600 : 400 }}
      onClick={() => {
        console.log('📜 navMode → scroll');
        setNavMode('scroll');
        setShowNavPopup(false);
        setCurrentPageIdx(0);
      }}
    >
      📜 Scroll
    </p>
    <p
      style={{ margin: 4, cursor: 'pointer', fontWeight: navMode === 'flip' ? 600 : 400 }}
      onClick={() => {
        console.log('🔁 navMode → flip');
        setNavMode('flip');
        setShowNavPopup(false);
        setCurrentPageIdx(0);
      }}
    >
   🔁 Flip
    </p>
  </div>
)}


      <div className={eraserMode ? 'eraser-mode' : ''} onMouseUp={onMouseUp}>
        <Document file={bookUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          <div className="pdf-doc-wrapper">{renderPages()}</div>
        </Document>

        {picker && (
          <div
            style={{
              position: 'absolute',
              left: picker.x,
              top: picker.y,
              zIndex: 999,
            }}
          >
            <ColorSwatchBar onSelect={confirmColour} onComment={addWithComment} />
          </div>
        )}

        {/* Flip arrows */}
{navMode === 'flip' && numPages && (
  <div
    style={{
      position: 'fixed',
      bottom: 12,
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#fff',
      border: '1px solid #ccc',
      borderRadius: 8,
      padding: '4px 12px',
      boxShadow: '0 2px 6px rgba(0,0,0,.15)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      zIndex: 1000,
    }}
  >
    {/* ⬅️ Previous */}
    {hasPrevTurn && (
      <button onClick={() => setCurrentPageIdx(i => i - 1)}>⬅️</button>
    )}

    {/* Page X‑Y of Z */}
    <span>
      {currentStartPage}
      {pagesPerTurn === 2 && currentEndPage !== currentStartPage ? `‑${currentEndPage}` : ''} / {numPages}
    </span>

    {/* 📊 Progress Bar */}
   <input
  type="range"
  className="pdf-progress"
  min={0}
  max={totalTurns - 1}
  value={currentPageIdx}
  onChange={(e) => {
    const value = Number(e.target.value);
    console.log('📖 jump to turn', value);
    setCurrentPageIdx(value);
  }}
  style={{ '--progress': `${(currentPageIdx / (totalTurns - 1)) * 100}%` }}
/>


    {/* 📈 Percent */}
    <span>{percent}%</span>

    {/* ➡️ Next */}
    {hasNextTurn && (
      <button onClick={() => setCurrentPageIdx(i => i + 1)}>➡️</button>
    )}
  </div>
)}





      </div>
    </section>
  );
}
