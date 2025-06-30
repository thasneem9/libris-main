import { LiaComment } from 'react-icons/lia';
import { getRgba } from '../utils/colors';

import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
export default function AnnotationLayer({ pageBox, annotations, onComment, onDelete, eraserMode,onCommentIconClick }) {
  if (!pageBox) return null;
  const { width, height } = pageBox;

// AnnotationLayer.jsx  ➜ replace only the outer <div> props

return annotations.map((a) => {
  const pos = {
    position: 'absolute',
    left  : a.xPct * width,
    top   : a.yPct * height,
    width : a.wPct * width,
    height: a.hPct * height,
  };

  return (
    <div
      key={a._id}
      className="ann-wrapper"
      /* 1️⃣ raise z‑index above PDF text layer (which is 2) 
         2️⃣ tiny transparent bg to receive pointer events       */
      style={{
        ...pos,
        zIndex: 5,
        background: 'rgba(0,0,0,0.001)',
        pointerEvents: 'auto',
      }}
      onMouseDown={(e) => {          // fire even before selection starts
        if (!eraserMode) return;
        e.stopPropagation();         // don’t bubble to page mouseUp
        console.log('🧹 ERASE', a._id);
        onDelete(a._id);             // optimistic + backend delete
      }}
    >
      {/* coloured rectangle (no pointer events) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: getRgba(a.color),
          borderRadius: 2,
          pointerEvents: 'none',
        }}
      />

      {/* comment icon still works when not erasing */}
      {!eraserMode && a.comment && (
        <div
          className="comment-icon"
          style={{
            position: 'absolute',
            left: pos.width + 4,
            top : -15,
            cursor: 'pointer',
          }}
    onClick={() =>
  onCommentIconClick({
    text: a.text,
    comment: a.comment,
    x: pos.left,
    y: pos.top,
  })
}


        >
          <LiaComment size={18} color="#FBBF24" />
        </div>
      )}  


    </div>

    
  );
});

}
