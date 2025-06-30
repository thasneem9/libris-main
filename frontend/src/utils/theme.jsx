export const themes = {
  frosty: {
    '--bg-main': '#f5fafd', 
    '--bg-sidebar': '#ffffff',
    '--bg-card': '#f0f4ff',
    '--bg-card-hover': '#d6ecff',
    '--text-color': '#333333',
    '--accent-color': '#3b82f6',
    '--border-light': '#eee',
  },
 galaxy: {
  '--bg-main': '#3556c5',            // deep space
  '--bg-sidebar': '#14142b',           // dark violet
  '--bg-card': '#1d1f47',              // dark blue card
  '--bg-card-hover': '#2a2d6c',        // brightened for hover
  '--text-color': '#f0f3ff',           // light, soft white
  '--accent-color': '#8ab4ff',         // galaxy blue
  '--border-light': '#2f3167',         // border blends in subtly
  '--bg-radial':'radial-gradient(circle at top left, #0e0f2b, #000)',
},
  coffee: {
    '--bg-main': '#f3f1eb',
    '--bg-sidebar': '#e8e2d8',
    '--bg-card': '#d6cab9',
    '--bg-card-hover': '#c4b39e',
    '--text-color': '#5b4636',
    '--accent-color': '#a9746e',
    '--border-light': '#cbbba0',
  }
};

export function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;

  Object.entries(theme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });

  localStorage.setItem('theme', themeName);
}
