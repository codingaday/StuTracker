import { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";

const QuizModal = ({ isOpen, onClose }) => {
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch a single quiz question from Open Trivia DB
      axios
        .get("https://opentdb.com/api.php?amount=1&type=multiple")
        .then((response) => {
          const question = response.data.results[0];
          const answers = [
            ...question.incorrect_answers,
            question.correct_answer,
          ].sort(() => Math.random() - 0.5); // Shuffle answers
          setQuiz({
            question: question.question,
            answers,
            correctAnswer: question.correct_answer,
          });
        })
        .catch((error) => {
          console.error("Error fetching quiz:", error);
        });
    }
  }, [isOpen]);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setQuiz(null);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen || !quiz) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--primary-bg-start)] p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Daily Quiz Challenge</h3>
        <p
          className="mb-4"
          dangerouslySetInnerHTML={{ __html: quiz.question }}
        ></p>
        <div className="space-y-2">
          {quiz.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(answer)}
              disabled={isSubmitted}
              className={`w-full p-2 rounded-lg text-left ${
                selectedAnswer === answer
                  ? "bg-[var(--accent)]"
                  : "bg-[var(--primary-bg-end)]"
              } ${
                isSubmitted && answer === quiz.correctAnswer
                  ? "border-2 border-green-500"
                  : ""
              } ${
                isSubmitted &&
                selectedAnswer === answer &&
                answer !== quiz.correctAnswer
                  ? "border-2 border-red-500"
                  : ""
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: answer }}></span>
            </button>
          ))}
        </div>
        {isSubmitted && (
          <p className="mt-4">
            {selectedAnswer === quiz.correctAnswer ? "Correct!" : "Incorrect!"}
            {selectedAnswer !== quiz.correctAnswer && (
              <span>
                {" The correct answer is: "}
                <span
                  dangerouslySetInnerHTML={{ __html: quiz.correctAnswer }}
                ></span>
              </span>
            )}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-4">
          {!isSubmitted ? (
            <Button onClick={handleSubmit} disabled={!selectedAnswer}>
              Submit
            </Button>
          ) : (
            <Button onClick={handleClose}>Close</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
