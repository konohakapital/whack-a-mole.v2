// components/CustomCursor.tsx
import { Hammer } from 'lucide-react';

interface CustomCursorProps {
  showHit: boolean;
  cursorPosition: { x: number, y: number };
  whackerImage: string;
}

const CustomCursor = ({ showHit, cursorPosition, whackerImage }: CustomCursorProps) => (
  <div
    className={`fixed pointer-events-none transition-transform ${
      showHit ? 'scale-90' : 'scale-100'
    }`}
    style={{
      left: cursorPosition.x - 20,
      top: cursorPosition.y - 20,
    }}
  >
    {whackerImage ? (
      <img
        src={whackerImage}
        alt="Whacker"
        className="w-10 h-10 object-contain"
      />
    ) : (
      <Hammer className="w-10 h-10 text-gray-800 transform -rotate-45" />
    )}
  </div>
);

export default CustomCursor;
