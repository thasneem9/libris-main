import { colorPalette } from '../utils/colors';

export default function ColorSwatchBar({ onSelect }) {
  return (
    <div style={{
      display: 'flex', gap: 6, padding: 6,
      background: '#fff', border: '1px solid #ddd', borderRadius: 4
    }}>
      {colorPalette.map(({ name, hex }) => (
        <span
          key={name}
          style={{
            width: 18, height: 18, borderRadius: '50%',
            background: hex, cursor: 'pointer', border: '1px solid #ccc'
          }}
          title={name}
          onClick={() => onSelect(name)}
        />
      ))}
    </div>
  );
}
