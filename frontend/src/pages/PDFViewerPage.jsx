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
  const { state }  = useLocation();                    
  const { bookUrl, bookId } = state || {};
  const { scale, zoomIn, zoomOut } = useZoom();

  const [numPages, setNumPages]           = useState(0);
  const [viewMode, setViewMode]           = useState('book');
  const [navMode,  setNavMode]            = useState('flip');
  const [eraserMode, setEraserMode]       = useState(false);

  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showNavPopup,  setShowNavPopup]  = useState(false);

  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const pagesPerTurn = viewMode === 'single' ? 1 : 2;
  const totalTurns   = Math.ceil(numPages / pagesPerTurn);
  const hasPrev      = navMode === 'flip' && currentPageIdx > 0;
  const hasNext      = navMode === 'flip' && currentPageIdx + 1 < totalTurns;
  const startPage    = currentPageIdx * pagesPerTurn + 1;
  const endPage      = Math.min(startPage + pagesPerTurn - 1, numPages);
  const percent      = numPages ? Math.round((endPage / numPages) * 100) : 0;
  const pageRefs = useRef({});

  const { list: annList, add: addAnn, update: updAnn, remove: delAnn } = useAnnotations(bookId);

  const [picker, setPicker] = useState(null);
  const onTextMouseUp       = useSelectionPicker(setPicker);

  const wrapperRef = useRef(null);
  const [penMode, setPenMode] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);
  const strokesRef = useRef({});                     // { [page]: Stroke[] }
const [penColor, setPenColor] = useState('#ff0000');

  const [pageRects, setPageRects] = useState({});
  const savePageRect = (page, el) => {
    if (!el) return;
    const { offsetWidth:w, offsetHeight:h } = el;
    setPageRects(p => (p[page]?.width===w && p[page]?.height===h) ? p
      : { ...p, [page]:{width:w,height:h} });
  };

  useEffect(()=>{
    document.body.classList.add('pdf-viewer-bg');
    return () => document.body.classList.remove('pdf-viewer-bg');
  },[]);

  const confirmColour = (col, cmt='') => {
    addAnn({ ...picker.info, color: col, bookId, ...(cmt && {comment:cmt}) });
    setPicker(null);
  };

  const addWithComment = () => {
    const c=prompt('Enter comment');
    if (c) confirmColour('Amber Gold', c);
  };

  const containerProps = (!highlightMode || penMode || eraserMode)
    ? {}
    : { onMouseUp: onTextMouseUp };

  return (
    <section style={{ padding: 8 }}>
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
    {/* ➜ UPDATE – keep colour in state */}
        <PenButton
          value={penColor}
          onChange={(hex) => {
            setPenColor(hex);
            setPenMode(true);
            setHighlightMode(false);
            setEraserMode(false);
          }}
        />
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

      <div
        className={`
          pdf-viewer-container
          ${penMode      ? 'pen-mode'      : ''}
          ${highlightMode? 'highlight-mode': ''}
          ${eraserMode   ? 'eraser-mode'   : ''}
        `}
        {...containerProps}
      >
        <Document file={bookUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          <div
            ref={wrapperRef}
            className="pdf-doc-wrapper"
            style={{ position:'relative' }}
          >
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

                                penMode={penMode}          /* ➜ ADD */
                        penColor={penColor}        /* ➜ ADD */        
                              strokesRef={strokesRef}    /* ➜ ADD */
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

        {picker && (
          <div style={{
            position:'absolute', left:picker.x, top:picker.y, zIndex:999
          }}>
            <ColorSwatchBar onSelect={confirmColour} onComment={addWithComment}/>
          </div>
        )}

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
