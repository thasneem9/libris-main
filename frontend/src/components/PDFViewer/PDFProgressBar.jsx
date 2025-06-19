import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

export default function PDFProgressBar({ currentStartPage, currentEndPage, numPages, percent, onPrev, onNext, hasPrev, hasNext }) {
  return (
    <div className="pdf-progress-bar">
      <button className="pdf-arrow" onClick={onPrev} disabled={!hasPrev}>
        <LuChevronLeft size={20} />
      </button>

      <div className="progress-info">
        <div className="progress-label">{currentStartPage}–{currentEndPage} / {numPages} ({percent}%)</div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <button className="pdf-arrow" onClick={onNext} disabled={!hasNext}>
        <LuChevronRight size={20} />
      </button>
    </div>
  );
}
