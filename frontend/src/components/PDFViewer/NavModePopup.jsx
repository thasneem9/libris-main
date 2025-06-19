export default function NavModePopup({ navMode, setNavMode, close }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 40,
        left: 260,
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: 4,
        padding: 8,
        zIndex: 9999,
      }}
    >
      <p
        style={{ margin: 4, cursor: 'pointer', fontWeight: navMode === 'scroll' ? 600 : 400 }}
        onClick={() => {
          setNavMode('scroll');
          close();
        }}
      >
        📜 Scroll
      </p>
      <p
        style={{ margin: 4, cursor: 'pointer', fontWeight: navMode === 'flip' ? 600 : 400 }}
        onClick={() => {
          setNavMode('flip');
          close();
        }}
      >
        🔁 Flip
      </p>
    </div>
  );
}
