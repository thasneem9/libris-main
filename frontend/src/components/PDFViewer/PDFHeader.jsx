import { LiaEye } from 'react-icons/lia';
import { LuGalleryHorizontal } from 'react-icons/lu';
import { PiHighlighterLight } from 'react-icons/pi';
import { FiPenTool } from 'react-icons/fi';
import { TbEraser } from 'react-icons/tb';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BsBookmarksFill } from 'react-icons/bs';
import { FaRegStickyNote } from 'react-icons/fa';
import { MdOutlineNotes } from 'react-icons/md';
import { PiScrollLight } from 'react-icons/pi';

export default function PDFHeader(props) {
  const {
    scale, zoomIn, zoomOut,
    eraserMode, setEraserMode,
    onViewClick, onNavClick,
    penMode, setPenMode,
    highlightMode, setHighlightMode,
    viewAnnotations, setViewAnnotations,
    viewHighlights, setViewHighlights,
    vocabMode, setVocabMode,
        startPage, endPage, numPages, // ✅ Add these
    children
  } = props;


  return (
    <header className="pdf-header dark-version">
      <div className="pdf-toolbar">
        <div className="logo-section">
          <PiBookOpenTextLight size={28} />
          <span className="brand-name">Libris</span>
        </div>

        <div className="tool-icons">
          <PiHighlighterLight
            size={40}
            title="Highlight"
            className={`pdf-btn icon ${highlightMode ? 'active' : ''}`}
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

          <FiPenTool
            size={37}
            title="Draw"
            className={`pdf-btn icon ${penMode ? 'active' : ''}`}
            onClick={() => {
              setPenMode(p => {
                const next = !p;
                if (next) {
                  setHighlightMode(false);
                  setEraserMode(false);
                }
                return next;
              });
            }}
          />

          <TbEraser
            size={37}
            title="Eraser"
            className={`pdf-btn icon ${eraserMode ? 'active' : ''}`}
            onClick={setEraserMode}
          />
        </div>

        <div className="page-controls">
    <span className="page-number">
  {startPage === endPage ? `Page ${startPage}` : `${startPage}–${endPage}`} / {numPages}
</span>

          <div className="zoom-controls">
            <button className="pdf-btn" onClick={zoomOut}>−</button>
            <span className="pdf-zoom">{Math.round(scale * 100)}%</span>
            <button className="pdf-btn" onClick={zoomIn}>+</button>
          </div>
        </div>

        <div className="nav-icons">
          <PiScrollLight size={37} className="pdf-btn icon" title="View Mode" onClick={onViewClick} />
          <LuGalleryHorizontal size={37} className="pdf-btn icon" title="Navigation Mode" onClick={onNavClick} />
        
        </div>


      <div className="notes-buttons">
  <button
    className={`pdf-btn ghost ${viewAnnotations ? 'active' : ''}`}
    onClick={() => {
      setViewAnnotations(v => {
        const next = !v;
        if (next) setViewHighlights(false);
        return next;
      });
    }}
  >
    Notes
  </button>

  <button
    className={`pdf-btn ghost ${viewHighlights ? 'active' : ''}`}
    onClick={() => {
      setViewHighlights(v => {
        const next = !v;
        if (next) setViewAnnotations(false);
        return next;
      });
    }}
  >
    Highlights
  </button>
</div>

      </div>
    </header>
  );
}
