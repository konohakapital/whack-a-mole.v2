// components/Prize.tsx
interface PrizeProps {
  score: number;
  ranking: number;
}

const Prize = ({ score, ranking }: PrizeProps) => {
  let prizeAmount = 0;

  if (ranking === 1) {
    prizeAmount = score * 2; // 2x for 1st place
  } else if (ranking === 2) {
    prizeAmount = score * 1.5; // 1.5x for 2nd place
  } else if (ranking === 3) {
    prizeAmount = score * 1.2; // 1.2x for 3rd place
  } else {
    prizeAmount = score; // 1x for lower rankings
  }

  return (
    <div className="text-center mt-8">
      <h2 className="text-xl font-semibold">Prize: {prizeAmount} Memecoins</h2>
      <p className="text-gray-600">Congratulations! You earned a reward based on your score and rank.</p>
    </div>
  );
};

export default Prize;
