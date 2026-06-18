function ReviewWrongAnswers({ wrongAnswers, onBackToResult, onBackToStart }) {
  return (
    <section className="screen review-screen" aria-labelledby="review-title">
      <div className="panel review-panel">
        <p className="eyebrow">Разобрать ошибки</p>
        <h1 id="review-title">Неправильные ответы</h1>

        {wrongAnswers.length === 0 ? (
          <div className="empty-review">
            <span aria-hidden="true">😺</span>
            <p>В этой партии ошибок не было.</p>
          </div>
        ) : (
          <div className="wrong-list">
            {wrongAnswers.map((item, index) => (
              <article className="wrong-item" key={`${item.question}-${index}`}>
                <span>Вопрос {index + 1}</span>
                <h2>{item.question}</h2>
                <strong>{item.answer}</strong>
                {item.explanation && <p>{item.explanation}</p>}
              </article>
            ))}
          </div>
        )}

        <div className="result-actions">
          <button className="primary-button" type="button" onClick={onBackToResult}>
            К результату
          </button>
          <button className="secondary-button" type="button" onClick={onBackToStart}>
            На старт
          </button>
        </div>
      </div>
    </section>
  );
}

export default ReviewWrongAnswers;
