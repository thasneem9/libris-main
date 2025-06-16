import './PDFViewerpage.css';
import { useState, useRef, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { useLocation } from 'react-router-dom';
import { LiaComment } from "react-icons/lia";

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

function PDFViewerPage() {
  const location = useLocation();
  const { bookUrl } = location.state || {};

  const [numPages, setNumPages] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const [popupPos, setPopupPos] = useState({ visible: false, x: 0, y: 0 });
  const [annotations, setAnnotations] = useState([]);
  const [commentMode, setCommentMode] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [activeComment, setActiveComment] = useState(null);

  const [scale, setScale] = useState(1);
  const ZOOM_STEP = 0.15;
  const zoomIn = () => setScale((s) => s + ZOOM_STEP);
  const zoomOut = () => setScale((s) => Math.max(0.3, s - ZOOM_STEP));

  const selectionRangeRef = useRef(null);
  const commentPosRef = useRef({ x: 0, y: 0 });

  const modernColors = [
    { name: 'Sky Blue', hex: '#60A5FA' },
    { name: 'Amber Gold', hex: '#FBBF24' },
    { name: 'Rose', hex: '#F87171' },
    { name: 'Emerald', hex: '#34D399' },
    { name: 'Purple', hex: '#A78BFA' },
  ];

  const rgba = (c) => {
    switch (c) {
      case 'sky blue': return 'rgba(96, 165, 250, 0.35)';
      case 'amber gold': return 'rgba(251, 191, 36, 0.35)';
      case 'rose': return 'rgba(248, 113, 113, 0.35)';
      case 'emerald': return 'rgba(52, 211, 153, 0.35)';
      case 'purple': return 'rgba(167, 139, 250, 0.35)';
      default: return 'rgba(0,0,0,0.1)';
    }
  };

  const onDocumentLoad = ({ numPages }) => setNumPages(numPages);
  const onPageLoadSuccess = (p) => console.log(`Page ${p.pageNumber} loaded`);
  const onPageLoadError = (e) => console.error('Render error:', e);

  const handleMouseUp = () => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (!text) return;

    const range = sel.getRangeAt(0);
    selectionRangeRef.current = range;
    const rect = range.getBoundingClientRect();

    setSelectedText(text);
    setPopupPos({
      visible: true,
      x: rect.right + window.scrollX,
      y: rect.top + window.scrollY - 6,
    });
  };

  const handleDoubleClick = () => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (!text) return;

    const range = sel.getRangeAt(0);
    selectionRangeRef.current = range;
    const rect = range.getBoundingClientRect();
    commentPosRef.current = {
      x: rect.right + window.scrollX,
      y: rect.top + window.scrollY - 10,
    };

    setSelectedText(text);
    setCommentMode(true);
    setCommentText('');
    setPopupPos({ visible: false });
    window.getSelection().removeAllRanges();
  };

  const applyHighlight = (color, keepRange = false) => {
    try {
      const rangeRef = selectionRangeRef.current;
      if (!rangeRef) return;

      const range = rangeRef.cloneRange();
      const span = document.createElement('span');
      span.style.backgroundColor = rgba(color);
      span.style.padding = '1px 2px';
      span.style.borderRadius = '2px';

      range.surroundContents(span);
      const { left, top } = span.getBoundingClientRect();
      const highlight = {
        text: range.toString(),
        color,
        comment: null,
        x: left + window.scrollX,
        y: top + window.scrollY,
      };

      setAnnotations((prev) => [...prev, highlight]);
      setPopupPos({ visible: false, x: 0, y: 0 });

      if (!keepRange) {
        window.getSelection().removeAllRanges();
        selectionRangeRef.current = null;
      }
      setSelectedText('');
    } catch (err) {
      console.error('Highlight error:', err);
    }
  };

  const submitComment = () => {
    const range = selectionRangeRef.current;
    if (!range) return;

    const icon = document.createElement('span');
    icon.style.marginLeft = '4px';
    icon.style.verticalAlign = 'middle';
    icon.style.fontSize = '16px';
    icon.style.color = '#FBBF24'; // Amber Yellow
    icon.style.cursor = 'pointer';
    icon.setAttribute('data-comment', commentText);

    icon.onclick = () => {
      const msg = icon.getAttribute('data-comment');
      setActiveComment(msg);
      alert(`💬 Comment:\n\n${msg}`);
    };

    const commentIcon = document.createElement('div');
    commentIcon.style.display = 'inline-block';
    commentIcon.appendChild(
      Object.assign(document.createElement('span'), {
        innerHTML: `<svg width="18" height="18" fill="#FBBF24" viewBox="0 0 24 24"><path d="M21 6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12l4-4h12a2 2 0 0 0 2-2V6z"/></svg>`
      })
    );
    icon.appendChild(commentIcon);

    range.endContainer.parentElement.appendChild(icon);

    const { left, top } = range.getBoundingClientRect();
    const note = {
      text: selectedText,
      color: 'amber gold',
      comment: commentText,
      x: left + window.scrollX,
      y: top + window.scrollY,
    };

    setAnnotations((prev) => [...prev, note]);
    setCommentMode(false);
    setShowCommentBox(false);
    setCommentText('');
    selectionRangeRef.current = null;
    setSelectedText('');
  };

  useEffect(() => {
    if (annotations.length) {
      console.log('Annotations:', annotations);
    }
  }, [annotations]);

  return (
    <div
      className="viewer-wrapper"
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      <h2>PDF Annotator</h2>

      <div className="toolbar">
        <button className="zoom-btn" onClick={zoomOut} title="Zoom out">➖</button>
        <span className="zoom-label">{Math.round(scale * 100)}%</span>
        <button className="zoom-btn" onClick={zoomIn} title="Zoom in">➕</button>
      </div>

      {selectedText && (
        <p className="info-box">
          📝 <strong>Selected:</strong> {selectedText}
        </p>
      )}

      {/* highlight popup */}
      {popupPos.visible && (
        <div
          className="color-popup"
          style={{ top: popupPos.y, left: popupPos.x }}
        >
          {modernColors.map(({ name, hex }) => (
            <span
              key={hex}
              className="swatch"
              style={{ backgroundColor: hex }}
              onClick={() => applyHighlight(name.toLowerCase(), true)}
              title={`Highlight ${name}`}
            />
          ))}
        </div>
      )}

      {/* comment mode popup */}
      {commentMode && (
        <div
          className="comment-box"
          style={{ top: commentPosRef.current.y, left: commentPosRef.current.x }}
        >
          <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            {modernColors.map(({ name, hex }) => (
              <span
                key={hex}
                className="swatch"
                style={{ backgroundColor: hex }}
                onClick={() => applyHighlight(name.toLowerCase(), true)}
                title={`Highlight ${name}`}
              />
            ))}
            <button
              style={{
                padding: '2px 8px',
                fontSize: 13,
                border: '1px solid #ccc',
                borderRadius: 4,
                cursor: 'pointer',
              }}
              onClick={() => setShowCommentBox(true)}
            >
              Add
              <LiaComment size={18} style={{ verticalAlign: 'middle' }} />
            </button>
          </div>

          {showCommentBox && (
            <>
              <textarea
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button onClick={submitComment}>💾 Save Comment</button>
            </>
          )}
        </div>
      )}

      <Document file={bookUrl} onLoadSuccess={onDocumentLoad}>
        {Array.from({ length: numPages ?? 0 }, (_, i) => (
          <Page
            key={i}
            pageNumber={i + 1}
            renderAnnotationLayer={false}
            renderMode="canvas"
            onLoadSuccess={onPageLoadSuccess}
            onRenderError={onPageLoadError}
            scale={scale}
          />
        ))}
      </Document>
    </div>
  );
}

export default PDFViewerPage;
