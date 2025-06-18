import { useState } from 'react';

export default function useZoom(min = 0.3, max = 3, step = 0.15) {
  const [scale, setScale] = useState(1);
  return {
    scale,
    zoomIn:  () => setScale(s => Math.min(max, s + step)),
    zoomOut: () => setScale(s => Math.max(min, s - step)),
  };
}
