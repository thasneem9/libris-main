export default function ViewModePopup({ viewMode, setViewMode, close }) {
  return (
    <div className="pdf-popup">
      <p
        style={{ margin: 4, cursor: 'pointer', fontWeight: viewMode === 'single' ? 600 : 400 }}
        onClick={() => {
          setViewMode('single');
          close();
        }}
      >
        📄 Single page
      </p>
      <p
        style={{ margin: 4, cursor: 'pointer', fontWeight: viewMode === 'book' ? 600 : 400 }}
        onClick={() => {
          setViewMode('book');
          close();
        }}
      >
        📖 Two-page (book)
      </p>
    </div>
  );
}
