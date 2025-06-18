import { LiaComment } from 'react-icons/lia';
import { getRgba } from '../utils/colors';

export default function AnnotationLayer({ pageBox, annotations, onComment }) {
  if (!pageBox) return null;           // page not measured yet
  const { width, height } = pageBox;

  return annotations.map(a => {
    const style = {
      position: 'absolute',
      left: a.xPct * width,
      top : a.yPct * height,
      width : a.wPct * width,
      height: a.hPct * height,
      background: getRgba(a.color),
      borderRadius: 2,
      pointerEvents: 'none',
    };
    return (
      <div key={a._id}>
        <div style={style} />
        {a.comment && (
          <div
            style={{
              position: 'absolute',
              left: style.left + style.width + 4,
              top : style.top,
              cursor: 'pointer',
            }}
            onClick={() => onComment(a)}
          >
            <LiaComment size={18} color="#FBBF24" />
          </div>
        )}
      </div>
    );
  });
}
