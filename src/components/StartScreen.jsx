import { useState } from "react";
import FileUploader from "./FileUploader.jsx";
import catCoin from "../assets/cat-coin.png";
import startHeroCat from "../assets/start-hero-cat.png";
import { getQuestionCountOptions } from "../utils/quiz.js";

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
  availableCategories,
  availableDifficulties,
  filteredQuestionCount,
  selectedCategories,
  selectedDifficulties,
  selectedQuestionCount,
  questionSetMeta,
  uploadError,
  lastResult,
  onFileLoaded,
  onUploadError,
  onCategoriesChange,
  onDifficultiesChange,
  onQuestionCountChange,
  onStart,
}) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const hasQuestions = questions.length > 0;
  const hasActiveFilters = selectedCategories.length > 0 || selectedDifficulties.length > 0;
  const hasMatchingQuestions = filteredQuestionCount > 0;
  const questionCountOptions = getQuestionCountOptions(filteredQuestionCount);
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

  function toggleFilter(value, selectedValues, onChange) {
    const nextValues = selectedValues.includes(value)
      ? selectedValues.filter((selectedValue) => selectedValue !== value)
      : [...selectedValues, value];

    onChange(nextValues);
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
            <>
              {(availableCategories.length > 0 || availableDifficulties.length > 0) && (
                <div className="quiz-filter-panel">
                  {availableCategories.length > 0 && (
                    <fieldset className="quiz-filter-group">
                      <legend>Темы</legend>
                      <p>Можно выбрать одну или несколько. Без выбора — все темы.</p>
                      <div className="filter-options">
                        {availableCategories.map((category) => {
                          const isSelected = selectedCategories.includes(category);

                          return (
                            <label
                              className={`filter-chip ${isSelected ? "is-selected" : ""}`}
                              key={category}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleFilter(category, selectedCategories, onCategoriesChange)
                                }
                              />
                              <span>{category}</span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  )}

                  {availableDifficulties.length > 0 && (
                    <fieldset className="quiz-filter-group">
                      <legend>Уровень сложности</legend>
                      <p>Без выбора будут использоваться все уровни.</p>
                      <div className="filter-options">
                        {availableDifficulties.map((difficulty) => {
                          const isSelected = selectedDifficulties.includes(difficulty);

                          return (
                            <label
                              className={`filter-chip difficulty-chip ${isSelected ? "is-selected" : ""}`}
                              key={difficulty}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleFilter(
                                    difficulty,
                                    selectedDifficulties,
                                    onDifficultiesChange,
                                  )
                                }
                              />
                              <span>{difficulty}</span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  )}

                  <div className="filter-summary" aria-live="polite">
                    <strong>
                      Подходит {filteredQuestionCount} {getQuestionWord(filteredQuestionCount)}
                    </strong>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={() => {
                          onCategoriesChange([]);
                          onDifficultiesChange([]);
                        }}
                      >
                        Сбросить фильтры
                      </button>
                    )}
                  </div>
                </div>
              )}

              {hasMatchingQuestions ? (
                <>
                  <label className="question-count-field" htmlFor="question-count">
                    <span>Сколько вопросов показать?</span>
                    <select
                      id="question-count"
                      value={selectedQuestionCount}
                      onChange={(event) => onQuestionCountChange(Number(event.target.value))}
                    >
                      {questionCountOptions.map((count) => (
                        <option key={count} value={count}>
                          {count === filteredQuestionCount ? `${count} (все)` : count}
                        </option>
                      ))}
                    </select>
                  </label>
                  <p className="random-order-note">
                    Вопросы будут выбраны случайно и показаны в случайном порядке.
                  </p>
                  <button
                    className="primary-button start-button"
                    type="button"
                    onClick={onStart}
                  >
                    Начать игру
                  </button>
                </>
              ) : (
                <div className="no-filter-results" role="alert">
                  Для выбранной комбинации нет вопросов. Измените или сбросьте фильтры.
                </div>
              )}
            </>
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
