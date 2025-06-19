import { LiaComment } from 'react-icons/lia';
import { colorPalette } from '../utils/colors';

export default function ColorSwatchBar({ onSelect, onComment }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'white',
        padding: 8,
        borderRadius: 4,
        boxShadow: '0 0 4px rgba(0,0,0,0.2)',
      }}
    >
      {colorPalette.map(({ name, hex }) => (
        <div
          key={name}
          onClick={() => onSelect(name)}
          style={{
            background: hex, // ✅ show actual color
            width: 20,
            height: 20,
            borderRadius: '50%',
            cursor: 'pointer',
            border: '1px solid #999',
          }}
        />
      ))}

      <div
        onClick={onComment}
        style={{ cursor: 'pointer' }}
        title="Add a comment"
      >
        <LiaComment size={20} color="#555" />
      </div>
    </div>
  );
}
