// isolated, memoised pen‑button + colour‑picker
import { useState, useRef, useCallback, memo } from 'react';
import { LuPenLine } from 'react-icons/lu';
import tinycolor from 'tinycolor2';      // small (~7 kB) helper

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
        top: 32,
        right: 0,
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

      {/* custom colour */}
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

function PenButton({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const select = useCallback(
    (hex) => {
      console.log('[ColorPicker] Selected color:', hex);
      onChange(hex);
    },
    [onChange]
  );

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button
        className="pdf-btn icon"
        aria-label="Choose drawing colour"
        onClick={() => {
          console.log('[PenIcon] Click detected – opening palette');
          setOpen(o => !o);
        }}
        style={{
          borderColor: open ? value : undefined,
          outline: open ? `2px solid ${value}` : undefined
        }}
      >
        <LuPenLine size={18} color={value} />
      </button>

      {open && (
        <ColorPopover
          onSelect={select}
          close={() => setOpen(false)}
        />
      )}
    </div>
  );
}

export default memo(PenButton);
