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
    return (
      <div
        data-page={pageNumber}
        className="pdf-page"
        style={{ position: 'relative', marginBottom: 16 }}
        ref={(el) => {
          if (el) pageRef.current[pageNumber] = el; // ✅ safely store ref in object
        }}
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
    <canvas
      ref={canvasRef}
      className="drawing-layer"
      style={{ position:'absolute', inset:0, pointerEvents: penMode ? 'auto' : 'none' }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerLeave={up}
    />
      </div>
    );
  }
  
