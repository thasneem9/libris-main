import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight,
} from "react-pdf-highlighter";

import "./PDFViewerPage.css";

const getNextId = () => String(Math.random()).slice(2);

const PDFViewerPage = () => {
  const location = useLocation();
  const { bookUrl, bookId } = location.state || {};
  const [highlights, setHighlights] = useState([]);

  const addHighlight = (highlight) => {
    const newHighlight = {
      ...highlight,
      id: getNextId(),
      color: "yellow",
    };
    const updated = [...highlights, newHighlight];
    setHighlights(updated);
    // (optional: send to server here)
  };

  if (!bookUrl) return <div>No PDF selected</div>;

  return (
    <div className="outer-wrapper">
      <div className="pdf-container">
        <PdfLoader url={bookUrl} beforeLoad={<div>Loading PDF...</div>}>
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={() => true}
              highlights={highlights}
              onSelectionFinished={(
                position,
                content,
                hideTipAndSelection,
                transformSelection
              ) => (
                <Tip
                  onOpen={transformSelection}
                  onConfirm={(comment) => {
                    addHighlight({ content, position, comment });
                    hideTipAndSelection();
                  }}
                />
              )}
              highlightTransform={(highlight, index, setTip, hideTip, _, __, isScrolledTo) => (
                <Popup
                  popupContent={<div>{highlight.comment}</div>}
                  onMouseOver={() => setTip(highlight)}
                  onMouseOut={hideTip}
                  key={index}
                >
                  <Highlight
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    comment={highlight.comment}
                    color={highlight.color}
                  />
                </Popup>
              )}
            />
          )}
        </PdfLoader>
      </div>
    </div>
  );
};

export default PDFViewerPage;
