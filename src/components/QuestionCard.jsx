import InlineCodeText from "./InlineCodeText.jsx";

function QuestionCard({ headingId, isRevealed, onShowAnswer, question }) {
  const hasMeta = Boolean(question.category || question.difficulty);

  return (
    <article className="panel question-card">
      {hasMeta && (
        <div className="question-card-top">
          <div className="question-meta">
            {question.category && (
              <span className="question-chip category-chip">
                <span aria-hidden="true">🔗</span>
                {question.category}
              </span>
            )}
            {question.difficulty && (
              <span className="question-chip difficulty-chip">{question.difficulty}</span>
            )}
          </div>
        </div>
      )}
      <h2 id={headingId}>
        <InlineCodeText text={question.question} />
      </h2>
      {!isRevealed && (
        <button
          className="primary-button question-reveal-button"
          type="button"
          onClick={onShowAnswer}
        >
          Показать ответ
        </button>
      )}
      {isRevealed && (
        <div className="question-answer">
          <span>Правильный ответ</span>
          <strong>
            <InlineCodeText text={question.answer} />
          </strong>
          {question.explanation && (
            <p>
              <InlineCodeText text={question.explanation} />
            </p>
          )}
        </div>
      )}
    </article>
  );
}

export default QuestionCard;
