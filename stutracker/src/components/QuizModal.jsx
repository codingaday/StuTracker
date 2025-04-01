import { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";

const QuizModal = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setQuestion(null);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setError(null);

      // Fetch a random true/false question
      axios
        .get("https://opentdb.com/api.php?amount=1&type=boolean")
        .then((response) => {
          const fetchedQuestion = response.data.results[0];
          setQuestion({
            text: fetchedQuestion.question,
            correctAnswer: fetchedQuestion.correct_answer, // "True" or "False"
            answers: ["True", "False"],
          });
        })
        .catch((error) => {
          setError("Failed to load quiz question.");
        });
    }
  }, [isOpen]);

  const handleAnswer = (answer) => {
    const isAnswerCorrect = answer === question.correctAnswer;
    setSelectedAnswer(answer);
    setIsCorrect(isAnswerCorrect);
  };

  const handleClose = () => {
    setQuestion(null);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--primary-bg-end)] p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Quiz Challenge</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {question ? (
          <>
            <p
              className="mb-4"
              dangerouslySetInnerHTML={{ __html: question.text }}
            />
            <div className="space-y-2">
              {question.answers.map((answer, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(answer)}
                  className={`w-full ${
                    selectedAnswer !== null
                      ? answer === question.correctAnswer
                        ? "bg-green-500"
                        : "bg-red-500"
                      : ""
                  }`}
                  disabled={selectedAnswer !== null}
                >
                  {answer}
                </Button>
              ))}
            </div>
            {selectedAnswer !== null && (
              <p className="mt-4 text-center">
                {isCorrect ? "Correct!" : "Incorrect!"}
              </p>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
        <Button onClick={handleClose} className="mt-4 w-full">
          Close
        </Button>
      </div>
    </div>
  );
};

export default QuizModal;
