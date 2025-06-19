import { Page } from 'react-pdf';
import AnnotationLayer from '../AnnotationLayer';

export default function PDFSinglePage({
  pageNumber,
  scale,
  savePageRect,
  pageRef, // this is actually a map like pageRefs from parent
  annotations,
  eraserMode,
  pageBox,
  onComment,
  onDelete
}) {
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
    </div>
  );
}
