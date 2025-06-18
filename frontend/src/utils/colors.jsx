export const colorPalette = [
  { name: 'Sky Blue',  hex: '#60A5FA', rgba: 'rgba(96,165,250,0.35)' },
  { name: 'Amber Gold',hex: '#FBBF24', rgba: 'rgba(251,191,36,0.35)' },
  { name: 'Emerald',   hex: '#34D399', rgba: 'rgba(52,211,153,0.35)' },
  { name: 'Rose',      hex: '#F87171', rgba: 'rgba(248,113,113,0.35)' },
  { name: 'Purple',    hex: '#A78BFA', rgba: 'rgba(167,139,250,0.35)' },
];

export const getRgba = (name) =>
  colorPalette.find(c => c.name === name)?.rgba || 'rgba(0,0,0,0.2)';
