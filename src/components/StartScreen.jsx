import { useState } from "react";
import FileUploader from "./FileUploader.jsx";
import catCoin from "../assets/cat-coin.png";
import startHeroCat from "../assets/start-hero-cat.png";

const JSON_HELP_PROMPT = `Составь JSON-файл с вопросами для квиз-игры.

Тема: [вставьте тему]
Количество вопросов: 10
Уровень: [easy / medium / hard]
Аудитория: [например, системный аналитик перед собеседованием]

Формат должен быть строго JSON-массивом без markdown и без пояснений снаружи.

У каждого вопроса должны быть поля:
- question — вопрос
- answer — правильный ответ
- explanation — короткое пояснение
- category — категория вопроса
- difficulty — сложность: easy, medium или hard

Пример структуры:

[
  {
    "question": "Что такое внешний ключ?",
    "answer": "Внешний ключ — это поле в одной таблице, которое ссылается на первичный ключ другой таблицы.",
    "explanation": "Например, order.user_id может ссылаться на users.id и показывать, какому пользователю принадлежит заказ.",
    "category": "Ключи и связи",
    "difficulty": "easy"
  }
]

Сгенерируй только валидный JSON.`;

function StartScreen({
  questions,
  questionSetMeta,
  uploadError,
  lastResult,
  onFileLoaded,
  onUploadError,
  onStart,
}) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const hasQuestions = questions.length > 0;
  const loadedLabel = questionSetMeta
    ? `${questionSetMeta.count} ${getQuestionWord(questionSetMeta.count)} загружено`
    : "Файл пока не выбран";

  async function copyPrompt() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(JSON_HELP_PROMPT);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = JSON_HELP_PROMPT;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setIsPromptCopied(true);
      window.setTimeout(() => setIsPromptCopied(false), 1800);
    } catch {
      setIsPromptCopied(false);
    }
  }

  return (
    <section className="screen start-screen" aria-labelledby="app-title">
      <div className="panel start-panel">
        <span className="start-deco start-sparkle-one" aria-hidden="true">✦</span>
        <span className="start-deco start-sparkle-two" aria-hidden="true">✦</span>
        <span className="start-deco start-fish" aria-hidden="true" />
        <div className="start-hero">
          <div className="hero-cat" aria-hidden="true">
            <img src={startHeroCat} alt="" />
          </div>
          <div className="start-hero-copy">
            <h1 id="app-title">Cat Cards</h1>
            <p className="subtitle">
              Отвечайте вслух, открывайте ответ и собирайте котиков за правильные ответы.
            </p>
          </div>
        </div>

        <section className="question-loader" aria-labelledby="question-loader-title">
          <div className="section-kicker step-pill step-one">Шаг 1</div>
          <div className="loader-heading-row">
            <h2 id="question-loader-title">Выберите набор вопросов</h2>
          </div>
          <p className="question-helper">
            Нужен JSON-файл с вопросами. Его можно быстро сделать через ChatGPT.{" "}
            <button type="button" onClick={() => setIsHelpOpen(true)}>
              Как подготовить файл?
            </button>
          </p>

          <div className="start-actions">
            <FileUploader
              className={`upload-dropzone ${questionSetMeta ? "has-file" : ""}`}
              onFileLoaded={onFileLoaded}
              onUploadError={onUploadError}
            >
              {questionSetMeta ? (
                <>
                  <span className="upload-icon" aria-hidden="true">
                    ✓
                  </span>
                  <span className="upload-dropzone-title">{questionSetMeta.name}</span>
                  <span className="upload-dropzone-text">{loadedLabel}</span>
                  <span className="upload-dropzone-action">
                    Заменить файл
                  </span>
                </>
              ) : (
                <>
                  <span className="upload-icon" aria-hidden="true">
                    ↑
                  </span>
                  <span className="upload-dropzone-title">
                    Перетащите JSON-файл сюда
                  </span>
                  <span className="upload-dropzone-action">
                    или нажмите, чтобы выбрать
                  </span>
                </>
              )}
            </FileUploader>
          </div>
        </section>

        {uploadError && (
          <div className="status-message error-message" role="alert">
            {uploadError}
          </div>
        )}

        <section className={`start-ready start-step ${hasQuestions ? "is-ready" : ""}`}>
          <div className="section-kicker step-pill step-two">Шаг 2</div>
          <h2>Начните игру</h2>
          {hasQuestions ? (
            <button
              className="primary-button start-button"
              type="button"
              onClick={onStart}
            >
              Начать игру
            </button>
          ) : (
            <p>После загрузки файла здесь появится кнопка старта.</p>
          )}
        </section>

        {lastResult && (
          <div className="last-result">
            <span>Последний результат</span>
            <strong>
              <img className="last-result-icon" src={catCoin} alt="" />
              {lastResult.correct} / {lastResult.total}
            </strong>
            <span>Точность {lastResult.accuracy}%</span>
          </div>
        )}
      </div>
      {isHelpOpen && (
        <div
          className="help-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsHelpOpen(false);
            }
          }}
        >
          <section
            className="help-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="json-help-title"
          >
            <button
              className="modal-close-button"
              type="button"
              aria-label="Закрыть"
              onClick={() => setIsHelpOpen(false)}
            >
              ×
            </button>
            <h2 id="json-help-title">Как подготовить JSON-файл</h2>
            <ol className="help-steps">
              <li>Скопируйте промт ниже в ChatGPT.</li>
              <li>Вставьте в промт тему, количество вопросов и уровень сложности.</li>
              <li>Отправьте получившееся сообщение.</li>
            </ol>
            <pre className="prompt-code" tabIndex="0">
              <code>{JSON_HELP_PROMPT}</code>
            </pre>
            <div className="help-modal-actions">
              <button className="primary-button copy-prompt-button" type="button" onClick={copyPrompt}>
                {isPromptCopied ? "Промт скопирован" : "Скопировать промт"}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function getQuestionWord(count) {
  const lastTwo = count % 100;
  const last = count % 10;

  if (lastTwo >= 11 && lastTwo <= 14) {
    return "вопросов";
  }

  if (last === 1) {
    return "вопрос";
  }

  if (last >= 2 && last <= 4) {
    return "вопроса";
  }

  return "вопросов";
}

export default StartScreen;
