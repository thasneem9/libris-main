import { LiaEye } from 'react-icons/lia';
import { LuGalleryHorizontal } from 'react-icons/lu';

export default function PDFHeader(props) {
  const {
    scale, zoomIn, zoomOut,
    eraserMode, setEraserMode,
    onViewClick, onNavClick,
    children          // ⬅️ receive extra nodes safely
  } = props;
 
  return (
    <header className="pdf-header">
      <div className="pdf-toolbar">
        <button className="pdf-btn" onClick={zoomOut}>−</button>
        <span className="pdf-zoom">{Math.round(scale * 100)}%</span>
        <button className="pdf-btn" onClick={zoomIn}>+</button>

        <button
          className={`pdf-btn ${eraserMode ? 'active' : ''}`}
          onClick={setEraserMode} // ✅ call directly
          title="Toggle eraser"
        >
          🧹 Eraser
        </button>

        <button className="pdf-btn icon" onClick={onViewClick} title="View Mode">
          <LiaEye size={18} />
        </button>

        <button className="pdf-btn icon" onClick={onNavClick} title="Navigation Mode">
          <LuGalleryHorizontal size={18} />
        </button>
         {children /* ⬅️ pen icon lives here */}
      </div>
    </header>
  );
}
