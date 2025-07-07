import { Document, Page } from 'react-pdf';
import './PDFSidebar.css';

export default function PDFSidebar({ file, numPages, currentPage, onPageSelect }) {
  return (
    <aside className="pdf-sidebar">
      <Document file={file}>
        {Array.from({ length: numPages }, (_, i) => (
          <div
            key={i}
            className={`thumbnail-wrapper ${currentPage === i ? 'active' : ''}`}
            onClick={() => onPageSelect(Math.floor(i / 2))} // Important: match flip mode
          >
            <Page
              pageNumber={i + 1}
              width={80}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
            <div className="thumb-label">Page {i + 1}</div>
          </div>
        ))}
      </Document>
    </aside>
  );
}
