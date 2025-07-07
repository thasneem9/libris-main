import { useRef, useState, useEffect, useCallback } from 'react';    
import { pdfjs, Document } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {PiPencilSimpleLineDuotone} from 'react-icons/pi'
import useZoom            from '../hooks/useZoom';
import useAnnotations     from '../hooks/useAnnotations';
import useDrawings from '../hooks/useDrawings';
import useSelectionPicker from '../hooks/useSelectionPicker';
import PDFSidebar from '../components/PDFViewer/PDFSidebar'

import PDFHeader       from '../components/PDFViewer/PDFHeader';
import ViewModePopup   from '../components/PDFViewer/ViewModePopup';
import NavModePopup    from '../components/PDFViewer/NavModePopup';
import PDFSinglePage   from '../components/PDFViewer/PDFSinglePage';
import PDFProgressBar  from '../components/PDFViewer/PDFProgressBar';
import ColorSwatchBar  from '../components/ColorSwatchBar';
import PenButton       from '../components/PDFViewer/PenButton';
import { PiHighlighterLight } from "react-icons/pi";
import { FiBox } from "react-icons/fi";
import './PDFViewerPage.css';
import { FiSearch, FiBookOpen } from 'react-icons/fi';
import { BsBookmarksFill } from "react-icons/bs";
import HighlightsSidebar from '../components/PDFViewer/HighlightsSidebar';
import { FaRegStickyNote } from "react-icons/fa";
import AnnotationsSidebar from '../components/PDFViewer/AnnotationSidebar';


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
const { data: drawingList, add: addStroke, remove: delStroke } = useDrawings(bookId);

  const [picker, setPicker] = useState(null);
  const onTextMouseUp       = useSelectionPicker(setPicker);

  const wrapperRef = useRef(null);
  const [penMode, setPenMode] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);
const [viewHighlights,setViewHighlights]=useState(false)
const [viewAnnotations,setViewAnnotations]=useState(false)

  const [vocabMode,setVocabMode]=useState(false)
const [vocabList, setVocabList] = useState([]); // { word, meaning }
const [selectedWord, setSelectedWord] = useState(null);
const [meaning, setMeaning] = useState('');
const [loadingMeaning, setLoadingMeaning] = useState(false);
const [activeComment, setActiveComment] = useState(null); //to view comment added

const fetchDefinition = async (word) => {
  setLoadingMeaning(true);
  setMeaning('');
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json();
    const definition = data[0]?.meanings?.[0]?.definitions?.[0]?.definition;
    setMeaning(definition || 'No definition found.');
  } catch (err) {
    setMeaning('Error fetching meaning.');
  } finally {
    setLoadingMeaning(false);
  }
};


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
const editComment = () => {
  const newComment = prompt('Edit comment', activeComment.comment);
  if (newComment !== null && newComment !== activeComment.comment) {
    const updated = { ...activeComment, comment: newComment };
    setActiveComment(updated);
    updAnn(activeComment._id, { comment: newComment });
  }
};

  const containerProps =
  (highlightMode || vocabMode) && !penMode && !eraserMode
    ? {
        onMouseUp: (e) => {
          const sel = window.getSelection();
          const text = sel?.toString().trim();
          if (text) {
            const rect = sel.getRangeAt(0).getBoundingClientRect();
            const x = rect.left + window.scrollX;
            const y = rect.bottom + window.scrollY;
            if (vocabMode) {
              setSelectedWord({ word: text, x, y });
            } else {
              onTextMouseUp(e);
            }
          }
        }
      }
    : {};

useEffect(() => {
  if (!drawingList) return;
  const map = {};
  for (const d of drawingList) {
    if (!map[d.page]) map[d.page] = [];
    map[d.page].push(d);
  }
  strokesRef.current = map;
}, [drawingList]);

useEffect(() => {
  console.log('📘 Vocab List:', vocabList);
}, [vocabList]);


  return (
    <>
      <div className="flex h-full">
      {/* ← LEFT: Thumbnails Sidebar */}
      <PDFSidebar
        file={bookUrl}
        numPages={numPages}
        currentPage={startPage - 1}
        onPageSelect={(newPageIdx) => setCurrentPageIdx(newPageIdx)}
      />

       <section style={{ padding: 8 }}>
      
<PDFHeader
  startPage={startPage} endPage={endPage} numPages={numPages}
  scale={scale}
  zoomIn={zoomIn}
  zoomOut={zoomOut}
  eraserMode={eraserMode}
  setEraserMode={setEraserMode}
  penMode={penMode}
  setPenMode={setPenMode}
  highlightMode={highlightMode}
  setHighlightMode={setHighlightMode}
  viewAnnotations={viewAnnotations}
  setViewAnnotations={setViewAnnotations}
  viewHighlights={viewHighlights}
  setViewHighlights={setViewHighlights}
  vocabMode={vocabMode}
  setVocabMode={setVocabMode}
  onViewClick={() => setShowViewPopup(v => !v)}
  onNavClick={() => setShowNavPopup(v => !v)}
  
/>





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
             ${vocabMode ? 'vocab-mode' : ''}
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
                            onCommentIconClick={setActiveComment}


                                penMode={penMode}          /* ➜ ADD */
                        penColor={penColor}        /* ➜ ADD */        
                              strokesRef={strokesRef}    /* ➜ ADD */
                              bookId={bookId}
                        onAddStroke={addStroke}
                        onDeleteStroke={delStroke}
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

                        onCommentIconClick={setActiveComment}
                       penMode={penMode}
                        penColor={penColor}
                        strokesRef={strokesRef}
                        onAddStroke={addStroke}
                        onDeleteStroke={delStroke}

                       

                    />
                  );
                })
              )
            }
          </div>
        </Document>
        {activeComment && (
  <div
    style={{
      position: 'absolute',
      left: activeComment.x + 30,
      top: activeComment.y,
      zIndex: 1000,
      background: '#fff',
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '12px 16px',
      maxWidth: '250px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
      animation: 'fadeIn 0.2s ease-out'
    }}
  >
    <div style={{ fontWeight: 'bold', marginBottom: 6 }}>Note</div>
    <div style={{ fontSize: 14, color: '#333' }}>
      {activeComment.comment || 'No comment'}
    </div>
    <div style={{ textAlign: 'right', marginTop: 8 }}>
      <button
        onClick={() => setActiveComment(null)}
        style={{
          background: '#f5f5f5',
          border: '1px solid #ccc',
          borderRadius: 6,
          padding: '4px 10px',
          cursor: 'pointer',
          fontSize: 13,
        }}
      >
        Close
      </button>
     <button
  onClick={editComment}
  style={{
    background: '#f5f5f5',
    border: '1px solid #ccc',
    borderRadius: 6,
    padding: '4px 10px',
    cursor: 'pointer',
    fontSize: 13,
  }}
>
  Edit
</button>

    </div>
  </div>
)}

        {viewHighlights && (
  <HighlightsSidebar
    annotations={annList}
  />
)}
{viewAnnotations && (
  <AnnotationsSidebar annotations={annList} />
)}


        {picker && (
          <div style={{
            position:'absolute', left:picker.x, top:picker.y, zIndex:999
          }}>
            <ColorSwatchBar onSelect={confirmColour} onComment={addWithComment}/>
          </div>
        )}
{selectedWord && vocabMode && (
  <div style={{
    position: 'absolute',
    left: selectedWord.x,
    top: selectedWord.y,
    zIndex: 1000,
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
    minWidth: '280px',
    fontFamily: 'sans-serif',
    animation: 'fadeIn 0.2s ease-out'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: '18px', fontWeight: 600, color: '#333' }}>
        {selectedWord.word}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          title="Search on Google"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => {
            const query = encodeURIComponent(selectedWord.word);
            window.open(`https://www.google.com/search?q=${query}`, '_blank');
          }}
        >
          <FiSearch size={20} color="#555" />
        </button>
        <button
          title="Define"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => fetchDefinition(selectedWord.word)}
        >
          <FiBookOpen size={20} color="#555" />
        </button>
      </div>
    </div>

    <input
      type="text"
      placeholder="Type your own meaning..."
      style={{
        marginTop: '12px',
        width: '100%',
        padding: '8px 10px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '14px'
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          const userMeaning = e.target.value.trim();
          if (userMeaning) {
            setVocabList(v => [...v, { word: selectedWord.word, meaning: userMeaning }]);
            setSelectedWord(null);
          }
        }
      }}
    />

    {loadingMeaning && (
      <div style={{ marginTop: '10px', fontSize: '14px', color: '#888' }}>
        Fetching meaning...
      </div>
    )}

    {meaning && (
      <div style={{
        marginTop: '10px',
        padding: '10px',
        background: '#f9f9f9',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#333'
      }}>
        <strong>Meaning:</strong> {meaning}
      </div>
    )}

    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
      <button
        style={{
          background: '#f5f5f5',
          border: '1px solid #ccc',
          borderRadius: '6px',
          padding: '6px 12px',
          fontSize: '13px',
          cursor: 'pointer'
        }}
        onClick={() => {
          setSelectedWord(null);
          setMeaning('');
        }}
      >
        Cancel
      </button>
    </div>
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
   </div>
    </>
  );
}
