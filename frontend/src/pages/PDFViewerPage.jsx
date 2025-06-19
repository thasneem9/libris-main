import { useRef, useState,useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import useZoom from '../hooks/useZoom.js';
import useAnnotations from '../hooks/useAnnotations.js';
import ColorSwatchBar from '../components/ColorSwatchBar';
import AnnotationLayer from '../components/AnnotationLayer';


import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './PDFViewerPage.css';

pdfjs.GlobalWorkerOptions.workerSrc ='/pdf.worker.min.js'

export default function PDFViewerPage() {
  const { state } = useLocation();                  // { bookUrl, bookId }
  const { bookUrl, bookId } = state || {};
  const [numPages, setNumPages] = useState(null);
  const [eraserMode, setEraserMode] = useState(false);


  /* zoom */
  const { scale, zoomIn, zoomOut } = useZoom();


 const { list: annList, add: addAnn, update: updAnn, remove: delAnn } = useAnnotations(bookId);




  /* keeps each page's bounding box */
  const [pageRects, setPageRects] = useState({});   // {1:{w,h}, 2:{w,h}}
  const confirmColour = (colorName, comment = '') => {
  addAnn({ ...picker.info, color: colorName, bookId, ...(comment && { comment }) });
  setPicker(null);
};
const addWithComment = () => {
  const comment = prompt('Enter your comment');
  if (comment) {
    const color = 'yellow'; // or let user choose later
    addAnn({ ...picker.info, color, comment, bookId });
    setPicker(null);
  }
};




const savePageRect = (page, el) => {
  if (!el) return;           // unmount
  const { offsetWidth: w, offsetHeight: h } = el;
  setPageRects(prev => {
    const old = prev[page] || {};
    if (old.width !== w || old.height !== h) {
      return { ...prev, [page]: { width: w, height: h } };
    }
    return prev;
  });
};


  /* popup state */
  const [picker, setPicker] = useState(null);       // {x,y,info}

 const onMouseUp = () => {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) return;

  const text = sel.toString().trim();
  if (!text) return;

  const range = sel.getRangeAt(0);
  const rect  = range.getBoundingClientRect();

  // ensure we have an Element that supports .closest()
  const node = range.startContainer.nodeType === Node.TEXT_NODE
    ? range.startContainer.parentElement
    : range.startContainer;

  const pageDiv  = node?.closest('.pdf-page');
  if (!pageDiv) return;                        // extra safety

  const page     = Number(pageDiv.dataset.page);
  const pageRect = pageDiv.getBoundingClientRect();

  setPicker({
    x: rect.left - pageRect.left,
    y: rect.top  - pageRect.top  - 32,
    info: {
      page,
      text,
      xPct: (rect.left - pageRect.left) / pageRect.width,
      yPct: (rect.top  - pageRect.top ) / pageRect.height,
      wPct: rect.width  / pageRect.width,
      hPct: rect.height / pageRect.height,
    },
  });

  sel.removeAllRanges();
};




  /* comment editing */
  const onComment = (ann) => {
    const txt = prompt('Enter comment', ann.comment || '');
    if (txt !== null) updAnn(ann._id, { comment: txt });
  };

  return (
    <section style={{ padding: 8 }}>
 <header style={{ marginBottom: 8 }}>
  <button onClick={zoomOut}>−</button>
  <span style={{ margin: '0 8px' }}>{Math.round(scale * 100)}%</span>
  <button onClick={zoomIn}>+</button>
 <button
   onClick={() => setEraserMode((m) => !m)}
   style={{ marginLeft: 12, background: eraserMode ? '#F87171' : '#eee' }}
 >
   🧹 Eraser
 </button>
</header>





 <div
   className={eraserMode ? 'eraser-mode' : ''}
   onMouseUp={onMouseUp}
 >


        <Document file={bookUrl}   onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
      

{Array.from({ length: numPages || 0 }).map((_, i) => {
  const pageNum = i + 1;
  return (
    <div
      key={pageNum}
      data-page={pageNum}
      className="pdf-page"
      style={{ position: 'relative', marginBottom: 16 }}
      ref={el => savePageRect(pageNum, el)}
    >
      <Page
        pageNumber={pageNum}
        scale={scale}
        onRenderSuccess={() => {
          // canvas now has final size – update rects
          savePageRect(pageNum, document.querySelector(`div[data-page="${pageNum}"]`));
        }}
      />

     
<AnnotationLayer
  pageBox={pageRects[pageNum]}
  annotations={annList.filter(a => a.page === pageNum)}
  onComment={onComment}
  onDelete={delAnn}
 eraserMode={eraserMode}
/>



    </div>
  );
})}


        </Document>

 {picker && (
  <div
    style={{
      position: 'absolute',
      left: picker.x,
      top : picker.y,
      zIndex: 999,
    }}
  >
    <ColorSwatchBar
      onSelect={confirmColour}
      onComment={addWithComment}
    />
  </div>
)}


      </div>
    </section>
  );
}
