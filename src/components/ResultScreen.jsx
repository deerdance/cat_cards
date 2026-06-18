import catCoin from "../assets/cat-coin.png";

function getResultMessage(accuracy) {
  if (accuracy === 100) {
    return "Идеальный забег. Котики ликуют.";
  }

  if (accuracy >= 80) {
    return "Отличный результат и очень довольный котик.";
  }

  if (accuracy >= 50) {
    return "Хорошая партия. В следующий раз соберём ещё больше котиков.";
  }

  return "Смелая попытка. Котики всё равно верят в вас.";
}

function ResultScreen({
  result,
  wrongAnswers,
  onPlayAgain,
  onBackToStart,
  onReviewWrong,
}) {
  return (
    <section className="screen result-screen" aria-labelledby="result-title">
      <div className="panel result-panel">
        <p className="eyebrow">Итоговый счёт</p>
        <h1 id="result-title" className="result-score">
          <img src={catCoin} alt="" />
          <span>{result.correct}</span>
        </h1>
        <p className="result-message">{getResultMessage(result.accuracy)}</p>

        <div className="result-grid">
          <div>
            <span>Правильно</span>
            <strong>{result.correct}</strong>
          </div>
          <div>
            <span>Всего</span>
            <strong>{result.total}</strong>
          </div>
          <div>
            <span>Точность</span>
            <strong>{result.accuracy}%</strong>
          </div>
        </div>

        <div className="result-actions">
          <button className="primary-button" type="button" onClick={onPlayAgain}>
            Сыграть ещё раз
          </button>
          <button className="secondary-button" type="button" onClick={onBackToStart}>
            На старт
          </button>
          <button className="secondary-button" type="button" onClick={onReviewWrong}>
            {wrongAnswers.length > 0 ? "Разобрать ошибки" : "Ошибок нет"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ResultScreen;
