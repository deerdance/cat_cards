import { useEffect, useMemo, useState } from "react";
import StartScreen from "./components/StartScreen.jsx";
import GameScreen from "./components/GameScreen.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import ReviewWrongAnswers from "./components/ReviewWrongAnswers.jsx";
import {
  filterQuestions,
  getQuestionCategories,
  getQuestionCountOptions,
  getQuestionDifficulties,
  selectRandomQuestions,
} from "./utils/quiz.js";
import { loadStoredJson, saveStoredJson } from "./utils/storage.js";

const LAST_RESULT_KEY = "catQuiz:lastResult";
const LAST_SET_KEY = "catQuiz:lastQuestionSet";

function App() {
  const [screen, setScreen] = useState("start");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(10);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [questionSetMeta, setQuestionSetMeta] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [gameQuestions, setGameQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [catScore, setCatScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    setLastResult(loadStoredJson(LAST_RESULT_KEY));
  }, []);

  const availableCategories = useMemo(
    () => getQuestionCategories(questions),
    [questions],
  );
  const availableDifficulties = useMemo(
    () => getQuestionDifficulties(questions),
    [questions],
  );
  const filteredQuestions = useMemo(
    () => filterQuestions(questions, selectedCategories, selectedDifficulties),
    [questions, selectedCategories, selectedDifficulties],
  );

  useEffect(() => {
    const options = getQuestionCountOptions(filteredQuestions.length);

    setSelectedQuestionCount((currentCount) =>
      options.includes(currentCount) ? currentCount : (options[0] ?? 0),
    );
  }, [filteredQuestions.length]);

  const currentQuestion = gameQuestions[currentIndex];

  const result = useMemo(() => {
    const total = gameQuestions.length;
    const correct = catScore;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    return {
      correct,
      total,
      accuracy,
      wrongCount: wrongAnswers.length,
      setName: questionSetMeta?.name ?? "Набор вопросов",
    };
  }, [catScore, gameQuestions.length, questionSetMeta?.name, wrongAnswers.length]);

  function applyQuestionSet(nextQuestions, nextMeta) {
    setQuestions(nextQuestions);
    setSelectedQuestionCount(Math.min(10, nextQuestions.length));
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setQuestionSetMeta(nextMeta);
    setUploadError("");
    saveStoredJson(LAST_SET_KEY, nextMeta);
  }

  function handleFileLoaded(nextQuestions, fileName) {
    applyQuestionSet(nextQuestions, {
      name: fileName,
      count: nextQuestions.length,
      source: "upload",
    });
  }

  function handleUploadError(message) {
    setUploadError(message);
    setQuestions([]);
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setQuestionSetMeta(null);
  }

  function startGame() {
    if (filteredQuestions.length === 0) {
      return;
    }

    setGameQuestions(selectRandomQuestions(filteredQuestions, selectedQuestionCount));
    setCurrentIndex(0);
    setCatScore(0);
    setWrongAnswers([]);
    setScreen("game");
  }

  function submitAnswer(isCorrect, question) {
    if (isCorrect) {
      setCatScore((score) => score + 1);
      return;
    }

    setWrongAnswers((answers) => [
      ...answers,
      {
        ...question,
        answeredAt: new Date().toISOString(),
      },
    ]);
  }

  function continueGame() {
    const isLastQuestion = currentIndex >= gameQuestions.length - 1;

    if (isLastQuestion) {
      const finalResult = {
        ...result,
        finishedAt: new Date().toISOString(),
      };

      saveStoredJson(LAST_RESULT_KEY, finalResult);
      setLastResult(finalResult);
      setScreen("result");
      return;
    }

    setCurrentIndex((index) => index + 1);
  }

  function playAgain() {
    startGame();
  }

  function backToStart() {
    setScreen("start");
  }

  return (
    <main className="app-shell">
      {screen === "start" && (
        <StartScreen
          questions={questions}
          availableCategories={availableCategories}
          availableDifficulties={availableDifficulties}
          filteredQuestionCount={filteredQuestions.length}
          selectedCategories={selectedCategories}
          selectedDifficulties={selectedDifficulties}
          selectedQuestionCount={selectedQuestionCount}
          questionSetMeta={questionSetMeta}
          uploadError={uploadError}
          lastResult={lastResult}
          onFileLoaded={handleFileLoaded}
          onUploadError={handleUploadError}
          onCategoriesChange={setSelectedCategories}
          onDifficultiesChange={setSelectedDifficulties}
          onQuestionCountChange={setSelectedQuestionCount}
          onStart={startGame}
        />
      )}

      {screen === "game" && currentQuestion && (
        <GameScreen
          question={currentQuestion}
          currentIndex={currentIndex}
          totalQuestions={gameQuestions.length}
          catScore={catScore}
          onSubmitAnswer={submitAnswer}
          onContinue={continueGame}
        />
      )}

      {screen === "result" && (
        <ResultScreen
          result={result}
          wrongAnswers={wrongAnswers}
          onPlayAgain={playAgain}
          onBackToStart={backToStart}
          onReviewWrong={() => setScreen("review")}
        />
      )}

      {screen === "review" && (
        <ReviewWrongAnswers
          wrongAnswers={wrongAnswers}
          onBackToResult={() => setScreen("result")}
          onBackToStart={backToStart}
        />
      )}
    </main>
  );
}

export default App;
