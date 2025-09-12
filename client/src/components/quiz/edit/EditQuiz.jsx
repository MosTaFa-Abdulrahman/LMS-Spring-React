import "./editQuiz.scss";
import { useState, useEffect } from "react";
import { Calendar, Clock, Plus, Trash2, X } from "lucide-react";

// Components
import Modal from "../../global/modal/Modal";
import Spinner from "../../global/spinner/Spinner";

// RTKQ
import { useGetSingleQuizByIdQuery } from "../../../store/quizzes/quizSlice";

function EditQuiz({ isOpen, onClose, onSubmit, quizId, isLoading }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    questions: [],
  });

  const [errors, setErrors] = useState({});

  // Fetch quiz data when modal opens and quizId is available
  const {
    data: quizResponse,
    isLoading: isLoadingQuiz,
    error: quizError,
  } = useGetSingleQuizByIdQuery(quizId, {
    skip: !quizId || !isOpen,
  });

  // Populate form data when quiz data is fetched
  useEffect(() => {
    if (quizResponse && isOpen) {
      const quizData = quizResponse;

      // Convert ISO dates to datetime-local format
      const formatDateTimeLocal = (isoDate) => {
        if (!isoDate) return "";
        const date = new Date(isoDate);
        const tzOffset = date.getTimezoneOffset() * 60000;
        const localISOTime = new Date(date - tzOffset)
          .toISOString()
          .slice(0, 16);
        return localISOTime;
      };

      setFormData({
        title: quizData.title || "",
        description: quizData.description || "",
        startTime: formatDateTimeLocal(quizData.startTime),
        endTime: formatDateTimeLocal(quizData.endTime),
        questions: quizData.questions || [],
      });
    }
  }, [quizResponse, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        questions: [],
      });
      setErrors({});
    }
  }, [isOpen]);

  // Generate option select letters (A, B, C, D, E, F)
  const generateOptionSelect = (index) => {
    return String.fromCharCode(65 + index); // A=65, B=66, etc.
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Question management
  const addQuestion = () => {
    const newQuestion = {
      id: null, // null for new questions
      questionText: "",
      points: 1.0,
      options: [
        {
          id: null,
          optionText: "",
          optionSelect: "A",
          isCorrect: false,
        },
        {
          id: null,
          optionText: "",
          optionSelect: "B",
          isCorrect: false,
        },
      ],
    };

    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const deleteQuestion = (questionIndex) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex),
    }));

    // Clear any errors related to this question
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`questions.${questionIndex}.questionText`];
      delete newErrors[`questions.${questionIndex}.points`];
      return newErrors;
    });
  };

  const updateQuestion = (questionIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((question, index) =>
        index === questionIndex ? { ...question, [field]: value } : question
      ),
    }));

    // Clear error when user starts typing
    const errorKey = `questions.${questionIndex}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }
  };

  // Option management
  const addOption = (questionIndex) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((question, qIndex) => {
        if (qIndex === questionIndex) {
          const newOptionIndex = question.options.length;
          if (newOptionIndex >= 6) return question; // Max 6 options

          const newOption = {
            id: null,
            optionText: "",
            optionSelect: generateOptionSelect(newOptionIndex),
            isCorrect: false,
          };

          return {
            ...question,
            options: [...question.options, newOption],
          };
        }
        return question;
      }),
    }));
  };

  const deleteOption = (questionIndex, optionIndex) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((question, qIndex) => {
        if (qIndex === questionIndex && question.options.length > 2) {
          const updatedOptions = question.options
            .filter((_, oIndex) => oIndex !== optionIndex)
            .map((option, index) => ({
              ...option,
              optionSelect: generateOptionSelect(index),
            }));

          return {
            ...question,
            options: updatedOptions,
          };
        }
        return question;
      }),
    }));
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((question, qIndex) => {
        if (qIndex === questionIndex) {
          return {
            ...question,
            options: question.options.map((option, oIndex) =>
              oIndex === optionIndex ? { ...option, [field]: value } : option
            ),
          };
        }
        return question;
      }),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic fields validation
    if (!formData.title.trim()) {
      newErrors.title = "Quiz title is required";
    } else if (formData.title.length > 900) {
      newErrors.title = "Title must not exceed 900 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Quiz description is required";
    } else if (formData.description.length > 1000) {
      newErrors.description = "Description must not exceed 1000 characters";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (formData.startTime && formData.endTime) {
      if (new Date(formData.startTime) >= new Date(formData.endTime)) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    // Questions validation
    if (formData.questions.length === 0) {
      newErrors.questions = "Quiz must have at least one question";
    } else if (formData.questions.length > 50) {
      newErrors.questions = "Quiz cannot have more than 50 questions";
    }

    // Individual question validation
    formData.questions.forEach((question, qIndex) => {
      if (!question.questionText.trim()) {
        newErrors[`questions.${qIndex}.questionText`] =
          "Question text is required";
      } else if (question.questionText.length > 2000) {
        newErrors[`questions.${qIndex}.questionText`] =
          "Question text must not exceed 2000 characters";
      }

      if (!question.points || question.points < 0.25 || question.points > 100) {
        newErrors[`questions.${qIndex}.points`] =
          "Points must be between 0.25 and 100";
      }

      if (question.options.length < 2) {
        newErrors[`questions.${qIndex}.options`] =
          "Question must have at least 2 options";
      }

      const hasCorrectAnswer = question.options.some(
        (option) => option.isCorrect
      );
      if (!hasCorrectAnswer) {
        newErrors[`questions.${qIndex}.correctAnswer`] =
          "Question must have at least one correct answer";
      }

      question.options.forEach((option, oIndex) => {
        if (!option.optionText.trim()) {
          newErrors[`questions.${qIndex}.options.${oIndex}.text`] =
            "Option text is required";
        } else if (option.optionText.length > 900) {
          newErrors[`questions.${qIndex}.options.${oIndex}.text`] =
            "Option text must not exceed 900 characters";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Convert datetime-local to ISO format
      const formatToISO = (dateTimeLocal) => {
        if (!dateTimeLocal) return null;
        return new Date(dateTimeLocal).toISOString();
      };

      const submitData = {
        id: quizId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        startTime: formatToISO(formData.startTime),
        endTime: formatToISO(formData.endTime),
        questions: formData.questions.map((question) => ({
          id: question.id,
          questionText: question.questionText.trim(),
          points: parseFloat(question.points),
          options: question.options.map((option) => ({
            id: option.id,
            optionText: option.optionText.trim(),
            optionSelect: option.optionSelect,
            isCorrect: option.isCorrect,
          })),
        })),
      };

      onSubmit(submitData);
    }
  };

  // Loading state
  if (isLoadingQuiz) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Quiz">
        <div className="loading-container">
          <Spinner size={32} text="Loading quiz data..." />
        </div>
      </Modal>
    );
  }

  // Error state
  if (quizError) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Quiz">
        <div className="error-container">
          <h3>Error Loading Quiz</h3>
          <p>{quizError?.data?.message || "Failed to load quiz data"}</p>
          <button onClick={onClose} className="close-btn">
            Close
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Quiz" size="large">
      <form onSubmit={handleSubmit} className="edit-quiz-form">
        {/* Quiz Title */}
        <div className="form-group">
          <label htmlFor="title">Quiz Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter quiz title..."
            className={errors.title ? "error" : ""}
            maxLength={900}
          />
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
        </div>

        {/* Quiz Description */}
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter quiz description..."
            rows="3"
            className={errors.description ? "error" : ""}
            maxLength={1000}
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </div>

        {/* Time Fields */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startTime">
              <Calendar size={16} />
              Start Time *
            </label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className={errors.startTime ? "error" : ""}
            />
            {errors.startTime && (
              <span className="error-message">{errors.startTime}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="endTime">
              <Clock size={16} />
              End Time *
            </label>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className={errors.endTime ? "error" : ""}
            />
            {errors.endTime && (
              <span className="error-message">{errors.endTime}</span>
            )}
          </div>
        </div>

        {/* Questions Section */}
        <div className="questions-section">
          <div className="section-header">
            <h3>
              Questions{" "}
              {formData.questions.length > 0 &&
                `(${formData.questions.length})`}
            </h3>
            <button
              type="button"
              onClick={addQuestion}
              className="add-question-btn"
              disabled={formData.questions.length >= 50}
            >
              <Plus size={16} />
              Add Question
            </button>
          </div>

          {errors.questions && (
            <div className="error-message section-error">
              {errors.questions}
            </div>
          )}

          {formData.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="question-card">
              <div className="question-header">
                <span className="question-number">
                  Question {questionIndex + 1}
                </span>
                <button
                  type="button"
                  onClick={() => deleteQuestion(questionIndex)}
                  className="delete-question-btn"
                  title="Delete Question"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Question Text */}
              <div className="form-group">
                <label>Question Text *</label>
                <textarea
                  value={question.questionText}
                  onChange={(e) =>
                    updateQuestion(
                      questionIndex,
                      "questionText",
                      e.target.value
                    )
                  }
                  placeholder="Enter your question..."
                  rows="2"
                  className={
                    errors[`questions.${questionIndex}.questionText`]
                      ? "error"
                      : ""
                  }
                  maxLength={2000}
                />
                {errors[`questions.${questionIndex}.questionText`] && (
                  <span className="error-message">
                    {errors[`questions.${questionIndex}.questionText`]}
                  </span>
                )}
              </div>

              {/* Question Points */}
              <div className="form-group">
                <label>Points *</label>
                <input
                  type="number"
                  value={question.points}
                  onChange={(e) =>
                    updateQuestion(
                      questionIndex,
                      "points",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="Points"
                  min="0.25"
                  max="100"
                  step="0.25"
                  className={
                    errors[`questions.${questionIndex}.points`] ? "error" : ""
                  }
                />
                {errors[`questions.${questionIndex}.points`] && (
                  <span className="error-message">
                    {errors[`questions.${questionIndex}.points`]}
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="options-section">
                <div className="options-header">
                  <label>Options *</label>
                  <button
                    type="button"
                    onClick={() => addOption(questionIndex)}
                    className="add-option-btn"
                    disabled={question.options.length >= 6}
                  >
                    <Plus size={14} />
                    Add Option
                  </button>
                </div>

                {errors[`questions.${questionIndex}.options`] && (
                  <div className="error-message">
                    {errors[`questions.${questionIndex}.options`]}
                  </div>
                )}

                {errors[`questions.${questionIndex}.correctAnswer`] && (
                  <div className="error-message">
                    {errors[`questions.${questionIndex}.correctAnswer`]}
                  </div>
                )}

                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="option-item">
                    <div className="option-controls">
                      <span className="option-letter">
                        {option.optionSelect}
                      </span>
                      <input
                        type="text"
                        value={option.optionText}
                        onChange={(e) =>
                          updateOption(
                            questionIndex,
                            optionIndex,
                            "optionText",
                            e.target.value
                          )
                        }
                        placeholder="Enter option text..."
                        className={
                          errors[
                            `questions.${questionIndex}.options.${optionIndex}.text`
                          ]
                            ? "error"
                            : ""
                        }
                        maxLength={900}
                      />
                      <div className="option-actions">
                        <label className="correct-checkbox">
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) =>
                              updateOption(
                                questionIndex,
                                optionIndex,
                                "isCorrect",
                                e.target.checked
                              )
                            }
                          />
                          <span>Correct</span>
                        </label>
                        {question.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() =>
                              deleteOption(questionIndex, optionIndex)
                            }
                            className="delete-option-btn"
                            title="Delete Option"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    {errors[
                      `questions.${questionIndex}.options.${optionIndex}.text`
                    ] && (
                      <span className="error-message option-error">
                        {
                          errors[
                            `questions.${questionIndex}.options.${optionIndex}.text`
                          ]
                        }
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {formData.questions.length === 0 && (
            <div className="no-questions">
              <p>
                No questions added yet. Click "Add Question" to start creating
                your quiz.
              </p>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="cancel-btn"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Quiz"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditQuiz;
