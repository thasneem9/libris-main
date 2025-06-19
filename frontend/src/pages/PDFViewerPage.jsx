// 📄 PDFViewerPage.jsx
import { useRef, useState, useEffect } from 'react';
import { pdfjs, Document } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import useZoom from '../hooks/useZoom';
import useAnnotations from '../hooks/useAnnotations.js';
import useSelectionPicker from '../hooks/useSelectionPicker.js';

import PDFHeader from '../components/PDFViewer/PDFHeader';
import ViewModePopup from '../components/PDFViewer/ViewModePopup';
import NavModePopup from '../components/PDFViewer/NavModePopup';
import PDFSinglePage from '../components/PDFViewer/PDFSinglePage';
import PDFProgressBar from '../components/PDFViewer/PDFProgressBar';
import ColorSwatchBar from '../components/ColorSwatchBar';

import './PDFViewerPage.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export default function PDFViewerPage() {
  const { state } = useLocation();
  const { bookUrl, bookId } = state || {};

  const [numPages, setNumPages] = useState(0);
  const [eraserMode, setEraserMode] = useState(false);
  const [viewMode, setViewMode] = useState('book');
  const [navMode, setNavMode] = useState('flip');
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showNavPopup, setShowNavPopup] = useState(false);
  const [picker, setPicker] = useState(null);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const pageRefs = useRef({});
  const [pageRects, setPageRects] = useState({});

  const { scale, zoomIn, zoomOut } = useZoom();
  const { list: annList, add: addAnn, update: updAnn, remove: delAnn } = useAnnotations(bookId);
  const onMouseUp = useSelectionPicker(setPicker);

  useEffect(() => {
    document.body.classList.add('pdf-viewer-bg');
    return () => document.body.classList.remove('pdf-viewer-bg');
  }, []);

  const pagesPerTurn = viewMode === 'single' ? 1 : 2;
  const totalTurns = Math.ceil(numPages / pagesPerTurn);
  const hasPrev = navMode === 'flip' && currentPageIdx > 0;
  const hasNext = navMode === 'flip' && currentPageIdx + 1 < totalTurns;

  const startPage = currentPageIdx * pagesPerTurn + 1;
  const endPage = Math.min(startPage + pagesPerTurn - 1, numPages);
  const percent = numPages ? Math.round((endPage / numPages) * 100) : 0;

  const confirmColour = (colorName, comment = '') => {
    addAnn({ ...picker.info, color: colorName, bookId, ...(comment && { comment }) });
    setPicker(null);
  };

  const addWithComment = () => {
    const comment = prompt('Enter comment');
    if (comment) confirmColour('Amber Gold', comment);
  };

  const savePageRect = (page, el) => {
    const { offsetWidth: w, offsetHeight: h } = el;
    setPageRects(prev => {
      const old = prev[page] || {};
      if (old.width !== w || old.height !== h) {
        return { ...prev, [page]: { width: w, height: h } };
      }
      return prev;
    });
  };

  return (
    <section style={{ padding: 8 }}>
    <PDFHeader
  scale={scale}
  zoomIn={zoomIn}
  zoomOut={zoomOut}
  eraserMode={eraserMode}
  setEraserMode={() => setEraserMode(m => !m)} // ✅ Fix: correct function
  onViewClick={() => setShowViewPopup(v => !v)} // ✅ Fix: use prop name matching inside header
  onNavClick={() => setShowNavPopup(v => !v)}   // ✅ Fix
/>


      {showViewPopup && (
        <ViewModePopup
          viewMode={viewMode}
          setViewMode={setViewMode}
          close={() => setShowViewPopup(false)}
        />
      )}
      {showNavPopup && (
        <NavModePopup
          navMode={navMode}
          setNavMode={setNavMode}
          close={() => setShowNavPopup(false)}
        />
      )}

      <div className={eraserMode ? 'eraser-mode' : ''} onMouseUp={onMouseUp}>
        <Document file={bookUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          <div className="pdf-doc-wrapper">
            {navMode === 'flip' ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPageIdx}
                  className="page-pair"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {Array.from({ length: pagesPerTurn }, (_, i) => {
                    const pageNum = startPage + i;
                    return (
                      pageNum <= numPages && (
                        <PDFSinglePage
                          key={pageNum}
                          pageNumber={pageNum}
                          scale={scale}
                          pageRef={pageRefs}
                          savePageRect={savePageRect}
                          pageBox={pageRects[pageNum]}
                          annotations={annList.filter(a => a.page === pageNum)}
                          eraserMode={eraserMode}
                          onComment={updAnn}
                          onDelete={delAnn}
                        />
                      )
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            ) : (
              Array.from({ length: numPages }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <PDFSinglePage
                    key={pageNum}
                    pageNumber={pageNum}
                    scale={scale}
                    pageRef={pageRefs}
                    savePageRect={savePageRect}
                    pageBox={pageRects[pageNum]}
                    annotations={annList.filter(a => a.page === pageNum)}
                    eraserMode={eraserMode}
                    onComment={updAnn}
                    onDelete={delAnn}
                  />
                );
              })
            )}
          </div>
        </Document>

        {picker && (
          <div style={{ position: 'absolute', left: picker.x, top: picker.y, zIndex: 999 }}>
            <ColorSwatchBar onSelect={confirmColour} onComment={addWithComment} />
          </div>
        )}

        {navMode === 'flip' && numPages > 0 && (
          <PDFProgressBar
            startPage={startPage}
            endPage={endPage}
            numPages={numPages}
            percent={percent}
            onPrev={() => setCurrentPageIdx(idx => Math.max(idx - 1, 0))}
            onNext={() => setCurrentPageIdx(idx => Math.min(idx + 1, totalTurns - 1))}
            hasPrev={hasPrev}
            hasNext={hasNext}
          />
        )}
      </div>
    </section>
  );
}
