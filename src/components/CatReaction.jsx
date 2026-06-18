import happyCat from "../assets/cat-state-happy.png";
import neutralCat from "../assets/cat-state-neutral.png";
import sadCat from "../assets/cat-state-sad.png";

function CatReaction({
  disabled = false,
  isAwaitingScore = false,
  onNext,
  onScore,
  showNextButton = false,
  type,
}) {
  const isCorrect = type === "correct";
  const isWrong = type === "wrong";
  const catImage = isCorrect ? happyCat : isWrong ? sadCat : neutralCat;
  const text = isCorrect
    ? "Котик получен!"
    : isWrong
      ? "Котик загрустил..."
      : isAwaitingScore
        ? "Котик ждёт твою оценку"
        : "Котик думает...";

  return (
    <div
      className={`cat-reaction ${
        isCorrect
          ? "is-happy"
          : isWrong
            ? "is-sad"
            : isAwaitingScore
              ? "is-waiting-score"
              : "is-thinking"
      }`}
      role="status"
    >
      <span className="cat-decoration cat-paw cat-paw-left" aria-hidden="true">🐾</span>
      <span className="cat-decoration cat-paw cat-paw-right" aria-hidden="true">🐾</span>
      <span className="cat-decoration cat-fish" aria-hidden="true">●</span>
      <div className="cat-mascot-wrap" aria-hidden="true">
        <img className="reaction-cat-image" src={catImage} alt="" />
      </div>
      <strong>{text}</strong>
      {isAwaitingScore && (
        <div className="score-actions" aria-label="Оценить ответ">
          <button
            className="success-button"
            type="button"
            disabled={disabled}
            onClick={() => onScore(true)}
          >
            <span aria-hidden="true">✓</span>
            Правильно
          </button>
          <button
            className="danger-button"
            type="button"
            disabled={disabled}
            onClick={() => onScore(false)}
          >
            <span aria-hidden="true">×</span>
            Неправильно
          </button>
        </div>
      )}
      {showNextButton && (
        <button className="next-question-button" type="button" onClick={onNext}>
          Следующий вопрос
        </button>
      )}
    </div>
  );
}

export default CatReaction;
