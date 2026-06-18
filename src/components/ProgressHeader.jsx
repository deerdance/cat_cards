import CatScore from "./CatScore.jsx";

function ProgressHeader({ currentIndex, totalQuestions, catScore }) {
  const currentQuestion = currentIndex + 1;
  const progress = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;

  return (
    <header className="game-topbar">
      <div className="progress-title">
        Вопрос {currentQuestion} из {totalQuestions}
      </div>
      <div
        className="progress-track"
        aria-label={`Прогресс: ${Math.round(progress)}%`}
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={Math.round(progress)}
      >
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <CatScore score={catScore} />
    </header>
  );
}

export default ProgressHeader;
