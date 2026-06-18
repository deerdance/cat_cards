import { useEffect, useRef, useState } from "react";
import catCoin from "../assets/cat-coin.png";

function CatScore({ score }) {
  const previousScore = useRef(score);
  const [isPopping, setIsPopping] = useState(false);

  useEffect(() => {
    if (score > previousScore.current) {
      setIsPopping(true);
      const timeoutId = window.setTimeout(() => setIsPopping(false), 420);
      previousScore.current = score;
      return () => window.clearTimeout(timeoutId);
    }

    previousScore.current = score;
  }, [score]);

  return (
    <div
      className={`cat-score ${isPopping ? "is-popping" : ""}`}
      aria-label={`Котики: ${score}`}
    >
      <span>Котики:</span>
      <strong aria-hidden="true">
        <img className="cat-score-icon" src={catCoin} alt="" />
        {score}
      </strong>
    </div>
  );
}

export default CatScore;
