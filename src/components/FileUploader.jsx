import { useState } from "react";
import { parseQuestionJson } from "../utils/quiz.js";

function FileUploader({
  children,
  className = "upload-button",
  label = "Загрузить JSON-файл",
  onFileLoaded,
  onUploadError,
}) {
  const [isDragging, setIsDragging] = useState(false);

  function handleSelectedFile(file, resetInput) {
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".json")) {
      onUploadError("Загрузите .json-файл со списком вопросов.");
      resetInput?.();
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = parseQuestionJson(String(reader.result ?? ""));

      if (!result.ok) {
        onUploadError(result.error);
        resetInput?.();
        return;
      }

      onFileLoaded(result.questions, file.name);
      resetInput?.();
    };

    reader.onerror = () => {
      onUploadError("Не удалось прочитать файл. Попробуйте загрузить его ещё раз.");
      resetInput?.();
    };

    reader.readAsText(file);
  }

  function handleFileChange(event) {
    handleSelectedFile(event.target.files?.[0], () => {
      event.target.value = "";
    });
  }

  function handleDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    handleSelectedFile(file);
  }

  const resolvedClassName = `${className} ${isDragging ? "is-dragging" : ""}`.trim();

  return (
    <label
      className={resolvedClassName}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children ?? <span>{label}</span>}
      <input
        className="file-input"
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
      />
    </label>
  );
}

export default FileUploader;
