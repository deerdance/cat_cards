import { useEffect, useRef, useState } from "react";
import CatReaction from "./CatReaction.jsx";
import ProgressHeader from "./ProgressHeader.jsx";
import QuestionCard from "./QuestionCard.jsx";
import { playCatSound } from "../utils/sound.js";

const NEXT_BUTTON_DELAY = 720;

function GameScreen({
  question,
  currentIndex,
  totalQuestions,
  catScore,
  onSubmitAnswer,
  onContinue,
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [reaction, setReaction] = useState(null);
  const [isNextReady, setIsNextReady] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setIsRevealed(false);
    setReaction(null);
    setIsNextReady(false);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex]);

  function handleScore(isCorrect) {
    if (reaction) {
      return;
    }

    const nextReaction = isCorrect ? "correct" : "wrong";

    onSubmitAnswer(isCorrect, question);
    setReaction(nextReaction);
    setIsNextReady(false);
    playCatSound(nextReaction);

    timeoutRef.current = window.setTimeout(() => {
      setIsNextReady(true);
    }, NEXT_BUTTON_DELAY);
  }

  function handleNextQuestion() {
    if (!reaction || !isNextReady) {
      return;
    }

    onContinue();
  }

  return (
    <section className="screen game-screen" aria-labelledby="question-heading">
      <ProgressHeader
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        catScore={catScore}
      />

      <QuestionCard
        headingId="question-heading"
        isRevealed={isRevealed}
        question={question}
        onShowAnswer={() => setIsRevealed(true)}
      />

      <CatReaction
        disabled={Boolean(reaction)}
        isAwaitingScore={isRevealed && !reaction}
        showNextButton={Boolean(reaction) && isNextReady}
        onNext={handleNextQuestion}
        onScore={handleScore}
        type={reaction}
      />
    </section>
  );
}

export default GameScreen;
