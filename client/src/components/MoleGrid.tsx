// components/MoleGrid.tsx
interface MoleGridProps {
  activeMole: number | null;
  onMoleClick: (index: number) => void;
  moleImage: string;
}

const MoleGrid = ({ activeMole, onMoleClick, moleImage }: MoleGridProps) => (
  <div className="grid grid-cols-3 gap-4 relative">
    {Array(9).fill(null).map((_, index) => (
      <div
        key={index}
        onClick={() => onMoleClick(index)}
        className="aspect-square bg-brown-400 rounded-full relative overflow-hidden cursor-pointer"
        style={{ backgroundColor: '#8B4513' }}
      >
        <div 
          className={`absolute inset-0 transition-transform duration-200 ${
            activeMole === index ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <img
            src={moleImage}
            alt="Mole"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    ))}
  </div>
);

export default MoleGrid;
