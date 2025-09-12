import "./quiz.scss";
import { useState, useEffect } from "react";
import {
  Clock,
  User,
  BookOpen,
  Award,
  CheckCircle,
  XCircle,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

// Components
import Spinner from "../../components/global/spinner/Spinner";

// Context & RTKQ
import {
  useGetQuizByIdQuery,
  useSubmitAnswersMutation,
} from "../../store/quizzes/quizSlice";
import toast from "react-hot-toast";

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  // RTKQ
  const {
    data: quiz,
    isLoading: quizLoading,
    error: quizError,
  } = useGetQuizByIdQuery(id);

  const [submitAnswers, { isLoading: submitting }] = useSubmitAnswersMutation();

  // State
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  // Timer effect
  useEffect(() => {
    if (quiz?.data && quizStarted) {
      const endTime = new Date(quiz.data.endTime);
      const now = new Date();

      if (now >= endTime) {
        setTimeLeft(0);
        return;
      }

      const timer = setInterval(() => {
        const currentTime = new Date();
        const difference = endTime - currentTime;

        if (difference <= 0) {
          setTimeLeft(0);
          clearInterval(timer);
          handleAutoSubmit();
        } else {
          setTimeLeft(difference);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, quizStarted]);

  // Auto submit when time runs out
  const handleAutoSubmit = async () => {
    if (Object.keys(selectedAnswers).length > 0) {
      await handleSubmitQuiz();
      toast.error("Time's up! Quiz submitted automatically.");
    }
  };

  // Format time
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Start quiz
  const handleStartQuiz = () => {
    const now = new Date();
    const startTime = new Date(quiz.data.startTime);
    const endTime = new Date(quiz.data.endTime);

    if (now < startTime) {
      toast.error("Quiz hasn't started yet!");
      return;
    }

    if (now > endTime) {
      toast.error("Quiz has ended!");
      return;
    }

    setQuizStarted(true);
    toast.success("Quiz started! Good luck!");
  };

  // Submit quiz
  const handleSubmitQuiz = async () => {
    const unansweredQuestions = quiz.data.questions.filter(
      (q) => !selectedAnswers[q.id]
    );

    if (unansweredQuestions.length > 0) {
      toast.error(
        `Please answer all questions! ${unansweredQuestions.length} questions remaining.`
      );
      return;
    }

    try {
      const result = await submitAnswers({
        quizId: id,
        answers: selectedAnswers,
      }).unwrap();

      setResults(result);
      setShowResults(true);
      toast.success("Quiz submitted successfully!");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error?.data?.errors?.[0]?.message || "Failed to submit quiz");
    }
  };

  // Check if quiz is available
  const isQuizAvailable = () => {
    if (!quiz?.data) return false;
    const now = new Date();
    const startTime = new Date(quiz.data.startTime);
    const endTime = new Date(quiz.data.endTime);
    return now >= startTime && now <= endTime;
  };

  // Calculate progress
  const getProgress = () => {
    const totalQuestions = quiz?.data?.questions?.length || 0;
    const answeredQuestions = Object.keys(selectedAnswers).length;
    return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  };

  // Loading state
  if (quizLoading) {
    return (
      <div className="quiz-loading">
        <Spinner size={40} text="Loading Quiz..." />
      </div>
    );
  }

  // Error state
  if (quizError) {
    return (
      <div className="quiz-error">
        <XCircle size={48} />
        <h2>Error Loading Quiz</h2>
        <p>{quizError?.data?.errors?.[0]?.message || "Something went wrong"}</p>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          Go Back
        </button>
      </div>
    );
  }

  // Quiz not found
  if (!quiz?.data) {
    return (
      <div className="quiz-error">
        <AlertCircle size={48} />
        <h2>Quiz Not Found</h2>
        <p>The quiz you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          Go Back
        </button>
      </div>
    );
  }

  const quizData = quiz.data;

  // Results view
  if (showResults && results) {
    return (
      <div className="quiz-container">
        <div className="quiz-results">
          <div className="results-header">
            <CheckCircle size={64} className="success-icon" />
            <h1>Quiz Completed!</h1>
            <div className="score-display">
              <span className="score">{results.totalScore}</span>
              <span className="total">/ {results.totalPossiblePoints}</span>
            </div>
          </div>

          <div className="results-info">
            <div className="info-grid">
              <div className="info-item">
                <Award size={20} />
                <span>
                  Score:{" "}
                  {(
                    (results.totalScore / results.totalPossiblePoints) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="info-item">
                <Clock size={20} />
                <span>
                  Completed: {new Date(results.completedAt).toLocaleString()}
                </span>
              </div>
              <div className="info-item">
                <BookOpen size={20} />
                <span>Attempt: {results.attemptNumber}</span>
              </div>
            </div>
          </div>

          <div className="results-breakdown">
            <h3>Question Breakdown</h3>
            {results.userAnswers.map((answer, index) => (
              <div
                key={answer.id}
                className={`answer-result ${
                  answer.isCorrect ? "correct" : "incorrect"
                }`}
              >
                <div className="question-header">
                  <span className="question-number">Q{index + 1}</span>
                  <div className="question-status">
                    {answer.isCorrect ? (
                      <CheckCircle size={20} className="correct-icon" />
                    ) : (
                      <XCircle size={20} className="incorrect-icon" />
                    )}
                    <span>{answer.pointsEarned} pts</span>
                  </div>
                </div>
                <p className="question-text">{answer.questionText}</p>
                <div className="answer-details">
                  <div className="selected-answer">
                    <strong>Your Answer:</strong> {answer.selectedOptionSelect}.{" "}
                    {answer.selectedOptionText}
                  </div>
                  {!answer.isCorrect && (
                    <div className="correct-answer">
                      <strong>Correct Answer:</strong>{" "}
                      {answer.correctAnswer.optionSelect}.{" "}
                      {answer.correctAnswer.optionText}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="results-actions">
            <button
              onClick={() => navigate(`/courses/${quizData.courseId}`)}
              className="btn-primary"
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {/* Quiz Header */}
      <div className="quiz-header">
        <div className="quiz-info">
          <div className="course-badge">
            <BookOpen size={16} />
            {quizData.courseTitle}
          </div>
          <h1>{quizData.title}</h1>
          <p>{quizData.description}</p>

          <div className="quiz-meta">
            <div className="meta-item">
              <User size={16} />
              <span>
                {quizData.userFirstName} {quizData.userLastName}
              </span>
            </div>
            <div className="meta-item">
              <Clock size={16} />
              <span>
                {new Date(quizData.startTime).toLocaleString()} -{" "}
                {new Date(quizData.endTime).toLocaleString()}
              </span>
            </div>
            <div className="meta-item">
              <Award size={16} />
              <span>Max Attempts: {quizData.maxAttempts}</span>
            </div>
          </div>
        </div>

        {quizStarted && timeLeft !== null && (
          <div className="timer">
            <Clock size={20} />
            <span className={timeLeft < 300000 ? "time-warning" : ""}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      {!quizStarted ? (
        /* Pre-Quiz Screen */
        <div className="pre-quiz">
          <div className="quiz-overview">
            <h2>Quiz Overview</h2>
            <div className="overview-stats">
              <div className="stat">
                <span className="stat-number">{quizData.questions.length}</span>
                <span className="stat-label">Questions</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {quizData.questions.reduce((total, q) => total + q.points, 0)}
                </span>
                <span className="stat-label">Total Points</span>
              </div>
              <div className="stat">
                <span className="stat-number">{quizData.maxAttempts}</span>
                <span className="stat-label">Max Attempts</span>
              </div>
            </div>

            <div className="quiz-instructions">
              <h3>Instructions</h3>
              <ul>
                <li>Answer all questions to submit the quiz</li>
                <li>You can change your answers before submitting</li>
                <li>The quiz will auto-submit when time runs out</li>
                <li>Make sure you have a stable internet connection</li>
              </ul>
            </div>

            <div className="start-quiz-section">
              {isQuizAvailable() ? (
                <button
                  onClick={handleStartQuiz}
                  className="btn-primary start-btn"
                  disabled={!isQuizAvailable()}
                >
                  Start Quiz <ArrowRight size={20} />
                </button>
              ) : (
                <div className="quiz-unavailable">
                  <AlertCircle size={24} />
                  <p>
                    {new Date() < new Date(quizData.startTime)
                      ? "Quiz hasn't started yet"
                      : "Quiz has ended"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Taking Screen */
        <div className="quiz-content">
          {/* Progress Bar */}
          <div className="quiz-progress">
            <div className="progress-info">
              <span>
                Progress: {Object.keys(selectedAnswers).length}/
                {quizData.questions.length}
              </span>
              <span>{getProgress().toFixed(0)}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>

          {/* Questions */}
          <div className="questions-container">
            {quizData.questions.map((question, index) => (
              <div
                key={question.id}
                className={`question-card ${
                  selectedAnswers[question.id] ? "answered" : ""
                }`}
              >
                <div className="question-header">
                  <span className="question-number">Question {index + 1}</span>
                  <span className="question-points">
                    {question.points} points
                  </span>
                </div>

                <h3 className="question-text">{question.questionText}</h3>

                <div className="options-container">
                  {question.options.map((option) => (
                    <label
                      key={option.id}
                      className={`option-label ${
                        selectedAnswers[question.id] === option.id
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.id}
                        checked={selectedAnswers[question.id] === option.id}
                        onChange={() =>
                          handleAnswerSelect(question.id, option.id)
                        }
                        className="option-input"
                      />
                      <div className="option-content">
                        <span className="option-select">
                          {option.optionSelect}
                        </span>
                        <span className="option-text">{option.optionText}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Section */}
          <div className="submit-section">
            <div className="submit-info">
              <p>
                {Object.keys(selectedAnswers).length ===
                quizData.questions.length
                  ? "All questions answered! You can submit now."
                  : `${
                      quizData.questions.length -
                      Object.keys(selectedAnswers).length
                    } questions remaining.`}
              </p>
            </div>
            <button
              onClick={handleSubmitQuiz}
              disabled={
                submitting ||
                Object.keys(selectedAnswers).length !==
                  quizData.questions.length
              }
              className="btn-primary submit-btn"
            >
              {submitting ? (
                <>
                  <Spinner size={20} />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Quiz <CheckCircle size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
