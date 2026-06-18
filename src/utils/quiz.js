export function shuffleQuestions(questions) {
  const shuffled = [...questions];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function validateQuestionSet(rawValue) {
  if (!Array.isArray(rawValue)) {
    return {
      ok: false,
      error: "JSON должен быть массивом объектов с вопросами.",
    };
  }

  if (rawValue.length === 0) {
    return {
      ok: false,
      error: "Список вопросов пустой. Добавьте хотя бы один вопрос.",
    };
  }

  const questions = [];

  for (let index = 0; index < rawValue.length; index += 1) {
    const item = rawValue[index];
    const label = `Вопрос ${index + 1}`;

    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return {
        ok: false,
        error: `${label} должен быть объектом с полями "question" и "answer".`,
      };
    }

    if (typeof item.question !== "string" || item.question.trim().length === 0) {
      return {
        ok: false,
        error: `${label}: поле "question" должно быть непустой строкой.`,
      };
    }

    if (typeof item.answer !== "string" || item.answer.trim().length === 0) {
      return {
        ok: false,
        error: `${label}: поле "answer" должно быть непустой строкой.`,
      };
    }

    const normalized = {
      question: item.question.trim(),
      answer: item.answer.trim(),
    };

    for (const key of ["explanation", "category", "difficulty"]) {
      if (item[key] === undefined || item[key] === null) {
        continue;
      }

      if (typeof item[key] !== "string") {
        return {
          ok: false,
          error: `${label}: необязательное поле "${key}" должно быть текстом.`,
        };
      }

      const optionalValue = item[key].trim();

      if (optionalValue.length > 0) {
        normalized[key] = optionalValue;
      }
    }

    questions.push(normalized);
  }

  return {
    ok: true,
    questions,
  };
}

export function parseQuestionJson(text) {
  if (text.trim().length === 0) {
    return {
      ok: false,
      error: "Файл пустой. Загрузите JSON-массив с вопросами.",
    };
  }

  try {
    return validateQuestionSet(JSON.parse(text));
  } catch (error) {
    return {
      ok: false,
      error: `JSON не удалось прочитать: ${error.message}`,
    };
  }
}
