import { useLocation } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import { useState } from 'react';
import './PDFViewerPage.css'; // for styling

const PDFViewerPage = () => {
  const location = useLocation();
  const { bookUrl } = location.state || {};
  const [numPages, setNumPages] = useState(null);

  if (!bookUrl) return <p>No PDF selected</p>;

  return (
    <div className="pdf-page">
      <nav className="custom-navbar">
        <h2>PDF Viewer</h2>
        {/* Add highlight buttons, save etc. here */}
      </nav>

      <div className="pdf-container">
        <Document
          file={bookUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading="Loading PDF..."
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={800}
            />
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PDFViewerPage;
