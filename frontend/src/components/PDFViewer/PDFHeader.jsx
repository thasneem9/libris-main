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
import { LuPanelLeft } from "react-icons/lu";
import { LineChart, LineChartIcon, LineSquiggle } from 'lucide-react';
import PenButton from './PenButton';
import { useState, useRef, useCallback } from 'react';
import { LuPenLine } from 'react-icons/lu';
import tinycolor from 'tinycolor2';
const swatches = [
  { name: 'Red',   hex: '#ff0000' },
  { name: 'Black', hex: '#000000' },
  { name: 'Blue',  hex: '#0066ff' }
];

function ColorPopover({ onSelect, close }) {
  return (
    <div
      role="menu"
      style={{
        position: 'absolute',
        top: 40,
        left: 0,
        background: '#fff',
        border: '1px solid #cbd5e1',
        borderRadius: 8,
        padding: 8,
        display: 'flex',
        gap: 6,
        zIndex: 9999,
        boxShadow: '0 4px 12px rgba(0,0,0,.1)'
      }}
    >
      {swatches.map(({ name, hex }) => (
        <button
          key={name}
          aria-label={name}
          onClick={() => { onSelect(hex); close(); }}
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: '1px solid #e2e8f0',
            background: hex,
            cursor: 'pointer'
          }}
        />
      ))}

      {/* Custom color picker */}
      <input
        type="color"
        aria-label="Custom colour"
        style={{ width: 18, height: 18, border: 'none', padding: 0 }}
        onChange={e => {
          onSelect(tinycolor(e.target.value).toHexString());
          close();
        }}
      />
    </div>
  );
}

export default function PDFHeader(props) {
  const [showPenPicker, setShowPenPicker] = useState(false);
const pickerRef = useRef(null);

const handlePenColorSelect = (hex) => {
  onPenColorChange(hex);  // updates parent
  setPenMode(true);
  setHighlightMode(false);
  setEraserMode(false);
  setShowPenPicker(false);
};

  
  const {
    scale, zoomIn, zoomOut,
    eraserMode, setEraserMode,
    onViewClick, onNavClick,
    penMode, setPenMode,
    highlightMode, setHighlightMode,
    viewAnnotations, setViewAnnotations,
    viewHighlights, setViewHighlights,
    vocabMode, setVocabMode,
        startPage, endPage, numPages,
         showSidebar,
  setShowSidebar,
     penColor,         // ⬅️ add this
  onPenColorChange, // ⬅️ add this
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

         <div style={{ position: 'relative' }} ref={pickerRef}>
  <LineSquiggle
    size={37}
    title="Draw"
    className={`pdf-btn icon ${penMode ? 'active' : ''}`}
    onClick={() => {
      setPenMode(true);
      setHighlightMode(false);
      setEraserMode(false);
      setShowPenPicker(prev => !prev);  // toggle picker
    }}
    style={{ color: penColor }}
  />

  {showPenPicker && (
    <ColorPopover
      onSelect={handlePenColorSelect}
      close={() => setShowPenPicker(false)}
    />
  )}
</div>


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
         <button
  onClick={() => setShowSidebar(prev => !prev)}
  className="sidebar-toggle-btn"
  title="Toggle Sidebar"
>
  <LuPanelLeft  size={26} />
</button>
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
