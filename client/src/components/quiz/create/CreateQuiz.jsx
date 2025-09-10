import "./createQuiz.scss";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Calendar,
  Clock,
  Award,
  BookOpen,
  Plus,
  Trash2,
  ImageIcon,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

// Components
import Modal from "../../global/modal/Modal";

// RTKQ
import { useSearchCoursesQuery } from "../../../store/courses/courseSlice";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

function CreateQuiz({ isOpen, onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: null,
    endTime: null,
    courseId: "",
    questions: [],
  });

  const [errors, setErrors] = useState({});
  const [courseSearch, setCourseSearch] = useState("");
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  // Debounce course search
  const debouncedCourseSearch = useDebounce(courseSearch, 300);

  // Course search query with debouncing
  const {
    data: coursesResponse,
    isLoading: isLoadingCourses,
    error: coursesError,
  } = useSearchCoursesQuery(
    {
      title: debouncedCourseSearch,
      page: 1,
      size: 10,
    },
    {
      skip: !debouncedCourseSearch || debouncedCourseSearch.length < 2,
      refetchOnMountOrArgChange: true,
    }
  );

  // Memoized courses data
  const coursesData = useMemo(() => {
    return coursesResponse?.data?.content || [];
  }, [coursesResponse]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: "",
        description: "",
        startTime: null,
        endTime: null,
        courseId: "",
        questions: [],
      });
      setErrors({});
      setCourseSearch("");
      setShowCourseDropdown(false);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowCourseDropdown(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleInputChange = useCallback(
    (e) => {
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
    },
    [errors]
  );

  const handleDateChange = useCallback(
    (date, field) => {
      setFormData((prev) => ({
        ...prev,
        [field]: date,
      }));

      // Clear related errors
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    },
    [errors]
  );

  const handleCourseSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setCourseSearch(value);
      setShowCourseDropdown(value.length >= 2);

      // Clear course selection if user is typing
      if (formData.courseId) {
        const selectedCourse = coursesData?.find(
          (course) => course.id === formData.courseId
        );
        if (selectedCourse && value !== selectedCourse.title) {
          setFormData((prev) => ({ ...prev, courseId: "" }));
        }
      }
    },
    [formData.courseId, coursesData]
  );

  const handleCourseSelect = useCallback(
    (course) => {
      setFormData((prev) => ({
        ...prev,
        courseId: course.id,
      }));
      setCourseSearch(course.title);
      setShowCourseDropdown(false);

      if (errors.courseId) {
        setErrors((prev) => ({
          ...prev,
          courseId: "",
        }));
      }
    },
    [errors.courseId]
  );

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(), // temporary ID for UI
      text: "",
      questionImage: "",
      correctAnswer: "",
      points: 5,
      choices: [
        {
          id: Date.now() + 1,
          choiceText: "",
          choiceLabel: "A",
          isCorrect: false,
        },
        {
          id: Date.now() + 2,
          choiceText: "",
          choiceLabel: "B",
          isCorrect: false,
        },
      ],
    };

    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));

    // Clear questions error if it exists
    if (errors.questions) {
      setErrors((prev) => ({
        ...prev,
        questions: "",
      }));
    }
  };

  const removeQuestion = (questionId) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));

    // Clear question-specific errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (newErrors.questionErrors) {
        const questionIndex = formData.questions.findIndex(
          (q) => q.id === questionId
        );
        if (questionIndex !== -1) {
          const updatedQuestionErrors = { ...newErrors.questionErrors };
          delete updatedQuestionErrors[questionIndex];

          // Re-index remaining errors
          const reindexedErrors = {};
          Object.keys(updatedQuestionErrors).forEach((index) => {
            const newIndex =
              parseInt(index) > questionIndex
                ? parseInt(index) - 1
                : parseInt(index);
            reindexedErrors[newIndex] = updatedQuestionErrors[index];
          });

          newErrors.questionErrors = reindexedErrors;
        }
      }
      return newErrors;
    });
  };

  const updateQuestion = (questionId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q
      ),
    }));

    // Clear specific question error
    const questionIndex = formData.questions.findIndex(
      (q) => q.id === questionId
    );
    if (
      questionIndex !== -1 &&
      errors.questionErrors?.[questionIndex]?.[field]
    ) {
      setErrors((prev) => ({
        ...prev,
        questionErrors: {
          ...prev.questionErrors,
          [questionIndex]: {
            ...prev.questionErrors[questionIndex],
            [field]: "",
          },
        },
      }));
    }
  };

  const addChoice = (questionId) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          const nextLabel = String.fromCharCode(65 + q.choices.length); // A, B, C, D...
          const newChoice = {
            id: Date.now(),
            choiceText: "",
            choiceLabel: nextLabel,
            isCorrect: false,
          };
          return { ...q, choices: [...q.choices, newChoice] };
        }
        return q;
      }),
    }));
  };

  const removeChoice = (questionId, choiceId) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          const updatedChoices = q.choices
            .filter((c) => c.id !== choiceId)
            .map((c, index) => ({
              ...c,
              choiceLabel: String.fromCharCode(65 + index), // Re-label A, B, C...
            }));
          return { ...q, choices: updatedChoices };
        }
        return q;
      }),
    }));
  };

  const updateChoice = (questionId, choiceId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            choices: q.choices.map((c) => {
              if (c.id === choiceId) {
                // If setting this choice as correct, unset others
                if (field === "isCorrect" && value === true) {
                  return { ...c, [field]: value };
                }
                return { ...c, [field]: value };
              }
              // If setting this choice as correct, unset others
              if (field === "isCorrect" && value === true) {
                return { ...c, isCorrect: false };
              }
              return c;
            }),
          };
        }
        return q;
      }),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validations
    if (!formData.title.trim()) {
      newErrors.title = "Quiz title is required";
    } else if (formData.title.length < 3 || formData.title.length > 200) {
      newErrors.title = "Title must be between 3 and 200 characters";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    } else if (moment(formData.startTime).isBefore(moment())) {
      newErrors.startTime = "Start time must be in the future";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    } else if (
      formData.startTime &&
      moment(formData.endTime).isBefore(moment(formData.startTime))
    ) {
      newErrors.endTime = "End time must be after start time";
    }

    if (!formData.courseId) {
      newErrors.courseId = "Course selection is required";
    }

    if (!formData.questions.length) {
      newErrors.questions = "At least one question is required";
    } else if (formData.questions.length > 50) {
      newErrors.questions = "Quiz cannot have more than 50 questions";
    }

    // Validate questions
    const questionErrors = {};
    formData.questions.forEach((question, index) => {
      const qErrors = {};

      if (!question.text.trim()) {
        qErrors.text = "Question text is required";
      } else if (question.text.length < 10 || question.text.length > 500) {
        qErrors.text = "Question text must be between 10 and 500 characters";
      }

      if (!question.correctAnswer.trim()) {
        qErrors.correctAnswer = "Correct answer is required";
      } else if (question.correctAnswer.length > 200) {
        qErrors.correctAnswer = "Correct answer cannot exceed 200 characters";
      }

      if (!question.points || question.points < 0.5 || question.points > 100) {
        qErrors.points = "Points must be between 0.5 and 100";
      }

      if (!question.choices.length || question.choices.length < 2) {
        qErrors.choices = "At least 2 choices are required";
      } else if (question.choices.length > 9) {
        qErrors.choices = "Question cannot have more than 9 choices";
      }

      // Check for exactly one correct answer
      const correctChoices = question.choices.filter((c) => c.isCorrect);
      if (correctChoices.length !== 1) {
        qErrors.correctChoice = "Exactly one choice must be marked as correct";
      }

      // Validate individual choices
      const choiceErrors = {};
      question.choices.forEach((choice, cIndex) => {
        if (!choice.choiceText.trim()) {
          choiceErrors[cIndex] = "Choice text is required";
        } else if (choice.choiceText.length > 500) {
          choiceErrors[cIndex] = "Choice text cannot exceed 500 characters";
        }
      });

      if (Object.keys(choiceErrors).length) {
        qErrors.choiceErrors = choiceErrors;
      }

      if (Object.keys(qErrors).length) {
        questionErrors[index] = qErrors;
      }
    });

    if (Object.keys(questionErrors).length) {
      newErrors.questionErrors = questionErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        startTime: moment(formData.startTime).format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(formData.endTime).format("YYYY-MM-DD HH:mm:ss"),
        courseId: formData.courseId,
        questions: formData.questions.map((q) => ({
          text: q.text.trim(),
          questionImage: q.questionImage?.trim() || null,
          correctAnswer: q.correctAnswer.trim(),
          points: parseFloat(q.points),
          choices: q.choices.map((c) => ({
            choiceText: c.choiceText.trim(),
            choiceLabel: c.choiceLabel,
            isCorrect: c.isCorrect,
          })),
        })),
      };

      console.log("Submitting quiz data:", JSON.stringify(submitData, null, 2));
      onSubmit(submitData);
    }
  };

  const selectedCourse = coursesData?.find(
    (course) => course.id === formData.courseId
  );

  // Calculate total points
  const totalPoints = formData.questions.reduce(
    (sum, q) => sum + (parseFloat(q.points) || 0),
    0
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Quiz"
      size="large"
    >
      <form onSubmit={handleSubmit} className="create-quiz-form">
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
            maxLength={200}
          />
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
          <small className="char-count">{formData.title.length}/200</small>
        </div>

        {/* Quiz Description */}
        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
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
          <small className="char-count">
            {formData.description.length}/1000
          </small>
        </div>

        {/* Time Fields */}
        <div className="form-row">
          <div className="form-group">
            <label>
              <Calendar size={16} />
              Start Time *
            </label>
            <DatePicker
              selected={formData.startTime}
              onChange={(date) => handleDateChange(date, "startTime")}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
              timeFormat="HH:mm"
              timeIntervals={15}
              minDate={new Date()}
              placeholderText="Select start time..."
              className={`date-picker ${errors.startTime ? "error" : ""}`}
              popperClassName="date-picker-popper"
            />
            {errors.startTime && (
              <span className="error-message">{errors.startTime}</span>
            )}
          </div>

          <div className="form-group">
            <label>
              <Clock size={16} />
              End Time *
            </label>
            <DatePicker
              selected={formData.endTime}
              onChange={(date) => handleDateChange(date, "endTime")}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
              timeFormat="HH:mm"
              timeIntervals={15}
              minDate={formData.startTime || new Date()}
              placeholderText="Select end time..."
              className={`date-picker ${errors.endTime ? "error" : ""}`}
              popperClassName="date-picker-popper"
            />
            {errors.endTime && (
              <span className="error-message">{errors.endTime}</span>
            )}
          </div>
        </div>

        {/* Course Selection */}
        <div className="form-group">
          <label htmlFor="courseSearch">
            <BookOpen size={16} />
            Select Course *
          </label>
          <div
            className="course-search-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                id="courseSearch"
                value={courseSearch}
                onChange={handleCourseSearchChange}
                placeholder="Search for a course..."
                className={errors.courseId ? "error" : ""}
                onFocus={() =>
                  courseSearch.length >= 2 && setShowCourseDropdown(true)
                }
              />
            </div>

            {showCourseDropdown && courseSearch.length >= 2 && (
              <div className="course-dropdown">
                {isLoadingCourses ? (
                  <div className="dropdown-loading">Searching courses...</div>
                ) : coursesError ? (
                  <div className="dropdown-error">Error loading courses</div>
                ) : coursesData.length > 0 ? (
                  coursesData.map((course) => (
                    <div
                      key={course.id}
                      className="course-option"
                      onClick={() => handleCourseSelect(course)}
                    >
                      <img
                        src={course.courseImg}
                        alt={course.title}
                        className="course-image"
                        onError={(e) => {
                          e.target.src = "/placeholder-course.png";
                        }}
                      />
                      <div className="course-info">
                        <div className="course-title">{course.title}</div>
                        <div className="course-level">{course.level}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">No courses found</div>
                )}
              </div>
            )}

            {selectedCourse && (
              <div className="selected-course">
                <img
                  src={selectedCourse.courseImg}
                  alt={selectedCourse.title}
                  className="course-image"
                  onError={(e) => {
                    e.target.src = "/placeholder-course.png";
                  }}
                />
                <div className="course-info">
                  <div className="course-title">{selectedCourse.title}</div>
                  <div className="course-level">{selectedCourse.level}</div>
                </div>
                <button
                  type="button"
                  className="remove-course"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, courseId: "" }));
                    setCourseSearch("");
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
          {errors.courseId && (
            <span className="error-message">{errors.courseId}</span>
          )}
        </div>

        {/* Questions Section */}
        <div className="questions-section">
          <div className="questions-header">
            <h3>
              Questions ({formData.questions.length})
              {totalPoints > 0 && (
                <span className="total-points">
                  {" "}
                  • Total: {totalPoints} points
                </span>
              )}
            </h3>
            <button
              type="button"
              onClick={addQuestion}
              className="add-question-btn"
            >
              <Plus size={16} />
              Add Question
            </button>
          </div>

          {errors.questions && (
            <div className="error-message">{errors.questions}</div>
          )}

          {formData.questions.map((question, qIndex) => (
            <div key={question.id} className="question-card">
              <div className="question-header">
                <span className="question-number">Question {qIndex + 1}</span>
                <button
                  type="button"
                  onClick={() => removeQuestion(question.id)}
                  className="remove-question-btn"
                  title="Remove Question"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Question Text */}
              <div className="form-group">
                <label>Question Text *</label>
                <textarea
                  value={question.text}
                  onChange={(e) =>
                    updateQuestion(question.id, "text", e.target.value)
                  }
                  placeholder="Enter question text..."
                  rows="2"
                  className={
                    errors.questionErrors?.[qIndex]?.text ? "error" : ""
                  }
                  maxLength={500}
                />
                {errors.questionErrors?.[qIndex]?.text && (
                  <span className="error-message">
                    {errors.questionErrors[qIndex].text}
                  </span>
                )}
                <small className="char-count">{question.text.length}/500</small>
              </div>

              {/* Question Image */}
              <div className="form-group">
                <label>
                  <ImageIcon size={16} />
                  Question Image (Optional)
                </label>
                <input
                  type="text"
                  value={question.questionImage}
                  onChange={(e) =>
                    updateQuestion(question.id, "questionImage", e.target.value)
                  }
                  placeholder="Enter image URL..."
                />
              </div>

              <div className="form-row">
                {/* Correct Answer */}
                <div className="form-group">
                  <label>Correct Answer *</label>
                  <input
                    type="text"
                    value={question.correctAnswer}
                    onChange={(e) =>
                      updateQuestion(
                        question.id,
                        "correctAnswer",
                        e.target.value
                      )
                    }
                    placeholder="Enter correct answer..."
                    className={
                      errors.questionErrors?.[qIndex]?.correctAnswer
                        ? "error"
                        : ""
                    }
                    maxLength={200}
                  />
                  {errors.questionErrors?.[qIndex]?.correctAnswer && (
                    <span className="error-message">
                      {errors.questionErrors[qIndex].correctAnswer}
                    </span>
                  )}
                  <small className="char-count">
                    {question.correctAnswer.length}/200
                  </small>
                </div>

                {/* Points */}
                <div className="form-group">
                  <label>
                    <Award size={16} />
                    Points *
                  </label>
                  <input
                    type="number"
                    value={question.points}
                    onChange={(e) =>
                      updateQuestion(question.id, "points", e.target.value)
                    }
                    placeholder="Enter points..."
                    min="0.5"
                    max="100"
                    step="0.5"
                    className={
                      errors.questionErrors?.[qIndex]?.points ? "error" : ""
                    }
                  />
                  {errors.questionErrors?.[qIndex]?.points && (
                    <span className="error-message">
                      {errors.questionErrors[qIndex].points}
                    </span>
                  )}
                </div>
              </div>

              {/* Choices */}
              <div className="choices-section">
                <div className="choices-header">
                  <label>
                    Answer Choices * (Select exactly one correct answer)
                  </label>
                  <button
                    type="button"
                    onClick={() => addChoice(question.id)}
                    className="add-choice-btn"
                    disabled={question.choices.length >= 9}
                  >
                    <Plus size={14} />
                    Add Choice
                  </button>
                </div>

                {errors.questionErrors?.[qIndex]?.choices && (
                  <span className="error-message">
                    {errors.questionErrors[qIndex].choices}
                  </span>
                )}

                {errors.questionErrors?.[qIndex]?.correctChoice && (
                  <span className="error-message">
                    {errors.questionErrors[qIndex].correctChoice}
                  </span>
                )}

                {question.choices.map((choice, cIndex) => (
                  <div key={choice.id} className="choice-item">
                    <div className="choice-label">{choice.choiceLabel}</div>
                    <input
                      type="text"
                      value={choice.choiceText}
                      onChange={(e) =>
                        updateChoice(
                          question.id,
                          choice.id,
                          "choiceText",
                          e.target.value
                        )
                      }
                      placeholder={`Choice ${choice.choiceLabel}...`}
                      className={
                        errors.questionErrors?.[qIndex]?.choiceErrors?.[cIndex]
                          ? "error"
                          : ""
                      }
                      maxLength={500}
                    />
                    <div className="choice-actions">
                      <label className="correct-checkbox">
                        <input
                          type="checkbox"
                          checked={choice.isCorrect}
                          onChange={(e) =>
                            updateChoice(
                              question.id,
                              choice.id,
                              "isCorrect",
                              e.target.checked
                            )
                          }
                        />
                        <span>Correct</span>
                      </label>
                      {question.choices.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeChoice(question.id, choice.id)}
                          className="remove-choice-btn"
                          title="Remove Choice"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    {errors.questionErrors?.[qIndex]?.choiceErrors?.[
                      cIndex
                    ] && (
                      <span className="error-message">
                        {errors.questionErrors[qIndex].choiceErrors[cIndex]}
                      </span>
                    )}
                    <small className="char-count">
                      {choice.choiceText.length}/500
                    </small>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {formData.questions.length === 0 && (
            <div className="empty-questions">
              <p>
                No questions added yet. Click "Add Question" to get started.
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
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading || formData.questions.length === 0}
          >
            {isLoading ? "Creating Quiz..." : "Create Quiz"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateQuiz;
