  import { Page } from 'react-pdf';
  import AnnotationLayer from '../AnnotationLayer';
import React, {useRef, useEffect, useCallback } from 'react'; 
export default function PDFSinglePage({
  pageNumber, scale, pageRef, savePageRect, pageBox,annotations,
  penMode, penColor, strokesRef, onComment,onDelete,eraserMode,                                              // ➜ UPDATE
}) {

   // ➜ ADD ---------------------------------------------------------------
 const canvasRef     = useRef(null);
 const isDrawing     = useRef(false);
 const currentStroke = useRef(null);

 const toPdf    = (x, y)      => [ x / (pageBox?.width || 1), y / (pageBox?.height || 1) ];
 const toCanvas = ([px, py])  => [ px * (pageBox?.width || 1), py * (pageBox?.height || 1) ];

 const redraw = useCallback(() => {
   const cvs = canvasRef.current;
   if (!cvs || !pageBox) return;

   cvs.width  = pageBox.width;
   cvs.height = pageBox.height;

   const ctx = cvs.getContext('2d');
   ctx.clearRect(0, 0, cvs.width, cvs.height);
   ctx.lineCap  = 'round';
   ctx.lineJoin = 'round';

   const strokes = strokesRef?.current[pageNumber] || [];
   strokes.forEach(stroke => {
     ctx.beginPath();
     ctx.lineWidth   = 2 * window.devicePixelRatio;
     ctx.strokeStyle = stroke.color;
     stroke.points.forEach((p, i) => {
       const [x, y] = toCanvas(p);
       i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
     });
     ctx.stroke();
   });
 }, [pageBox, strokesRef, pageNumber]);

 useEffect(() => { redraw(); }, [redraw, scale, pageBox]);

 const down = e => {
   if (!penMode) return;
   isDrawing.current = true;
   const rect = e.currentTarget.getBoundingClientRect();
   currentStroke.current = {
     color: penColor,
     points: [ toPdf(e.clientX - rect.left, e.clientY - rect.top) ]
   };
 };

 const move = e => {
   if (!isDrawing.current) return;
   const rect = e.currentTarget.getBoundingClientRect();
   currentStroke.current.points.push(
     toPdf(e.clientX - rect.left, e.clientY - rect.top)
   );

   const ctx = canvasRef.current.getContext('2d');
   const pts = currentStroke.current.points;
   const n   = pts.length;
   if (n < 2) return;
   ctx.beginPath();
   ctx.lineWidth   = 2 * window.devicePixelRatio;
   ctx.strokeStyle = penColor;
   const [x0, y0] = toCanvas(pts[n - 2]);
   const [x1, y1] = toCanvas(pts[n - 1]);
   ctx.moveTo(x0, y0);
   ctx.lineTo(x1, y1);
   ctx.stroke();
 };

 const up = () => {
   if (!isDrawing.current) return;
   isDrawing.current = false;
   if (!strokesRef.current[pageNumber])
     strokesRef.current[pageNumber] = [];
   strokesRef.current[pageNumber].push(currentStroke.current);
   currentStroke.current = null;
 };

 // PDFSinglePage.jsx
// ➜ ADD – helpers and eraser logic (place near other refs/handlers)
const HIT_TOLERANCE = 6 * window.devicePixelRatio;        // px

const distToSeg = (px, py, x1, y1, x2, y2) => {
  const dx = x2 - x1, dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (!len2) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.min(1, Math.max(0, t));
  const lx = x1 + t * dx, ly = y1 + t * dy;
  return Math.hypot(px - lx, py - ly);
};

const strokeAtPoint = (cx, cy) => {
  const strokes = strokesRef?.current[pageNumber] || [];
  for (let s = 0; s < strokes.length; s++) {
    const pts = strokes[s].points;
    for (let i = 1; i < pts.length; i++) {
      const [x1, y1] = toCanvas(pts[i - 1]);
      const [x2, y2] = toCanvas(pts[i]);
      if (distToSeg(cx, cy, x1, y1, x2, y2) <= HIT_TOLERANCE) return s;
    }
  }
  return -1;
};

const handleEraserClick = (e) => {
  if (!eraserMode || !pageBox) return;

  const rect = e.currentTarget.getBoundingClientRect();
  const cx = e.clientX - rect.left;
  const cy = e.clientY - rect.top;

  // 1️⃣ Try erasing stroke first
  const idx = strokeAtPoint(cx, cy);
  if (idx > -1) {
    strokesRef.current[pageNumber].splice(idx, 1);
    redraw();
    return;
  }

  // 2️⃣ Then try highlight deletion
  for (const a of annotations) {
    const left   = a.xPct * pageBox.width;
    const top    = a.yPct * pageBox.height;
    const width  = a.wPct * pageBox.width;
    const height = a.hPct * pageBox.height;

    if (
      cx >= left && cx <= left + width &&
      cy >= top  && cy <= top + height
    ) {
      onDelete(a._id); // backend delete
      return;
    }
  }
};



    return (
      <div
        data-page={pageNumber}
        className="pdf-page"
        style={{ position: 'relative', marginBottom: 16 }}
        ref={(el) => {
          if (el) pageRef.current[pageNumber] = el; // ✅ safely store ref in object
        }}
     onClick={eraserMode ? handleEraserClick : undefined} // ✅ on outer wrapper

      >
        <Page
          pageNumber={pageNumber}
          scale={scale}
          onRenderSuccess={() => {
            const el = pageRef.current[pageNumber];
            if (el) savePageRect(pageNumber, el);
          }}
        />

        {pageBox && (
          <AnnotationLayer
            pageBox={pageBox}
            annotations={annotations}
            onComment={onComment}
            onDelete={onDelete}
            eraserMode={eraserMode}
          />
        )}

         {/* ➜ ADD drawing layer */}
  // PDFSinglePage.jsx
// ➜ UPDATE – canvas props
<canvas
  ref={canvasRef}
  className="drawing-layer"
  style={{
    position: 'absolute',
    inset: 0,
    pointerEvents: (penMode || eraserMode) ? 'auto' : 'none',
    cursor: eraserMode ? 'not-allowed' : 'crosshair',
  }}
  onPointerDown={penMode ? down : undefined}
  onPointerMove={penMode ? move : undefined}
  onPointerUp  ={penMode ? up   : undefined}
  onPointerLeave={penMode ? up  : undefined}
 
/>

      </div>
    );
  }
  
