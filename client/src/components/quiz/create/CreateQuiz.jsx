import "./createQuiz.scss";
import { useState, useEffect, useCallback, useMemo, useContext } from "react";
import {
  Search,
  Calendar,
  Clock,
  Award,
  BookOpen,
  Plus,
  Trash2,
} from "lucide-react";

// Components
import Modal from "../../global/modal/Modal";

// RTKQ & Context
import { useSearchCoursesQuery } from "../../../store/courses/courseSlice";
import { AuthContext } from "../../../context/AuthContext";

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

// Helper function to format datetime for input
const formatDateTimeForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Helper function to convert local datetime to ISO string
const formatDateTimeForSubmit = (dateTimeString) => {
  if (!dateTimeString) return null;
  const localDate = new Date(dateTimeString);
  return localDate.toISOString();
};

function CreateQuiz({ isOpen, onClose, onSubmit, isLoading }) {
  // Context
  const { currentUser: userData } = useContext(AuthContext);
  const currentUser = userData?.userInfo;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
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
        startTime: "",
        endTime: "",
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

  const handleDateTimeChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
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
      questionText: "",
      points: 5.0,
      options: [
        {
          id: Date.now() + 1,
          optionText: "",
          optionSelect: "A",
          isCorrect: false,
        },
        {
          id: Date.now() + 2,
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

  const addOption = (questionId) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          const nextLabel = String.fromCharCode(65 + q.options.length); // A, B, C, D...
          const newOption = {
            id: Date.now(),
            optionText: "",
            optionSelect: nextLabel,
            isCorrect: false,
          };
          return { ...q, options: [...q.options, newOption] };
        }
        return q;
      }),
    }));
  };

  const removeOption = (questionId, optionId) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          const updatedOptions = q.options
            .filter((o) => o.id !== optionId)
            .map((o, index) => ({
              ...o,
              optionSelect: String.fromCharCode(65 + index), // Re-label A, B, C...
            }));
          return { ...q, options: updatedOptions };
        }
        return q;
      }),
    }));
  };

  const updateOption = (questionId, optionId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((o) => {
              if (o.id === optionId) {
                // If setting this option as correct, unset others
                if (field === "isCorrect" && value === true) {
                  return { ...o, [field]: value };
                }
                return { ...o, [field]: value };
              }
              // If setting this option as correct, unset others
              if (field === "isCorrect" && value === true) {
                return { ...o, isCorrect: false };
              }
              return o;
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
      newErrors.title = "Title is required";
    } else if (formData.title.length > 500) {
      newErrors.title = "Title must not exceed 500 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 1000) {
      newErrors.description = "Description must not exceed 1000 characters";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    } else if (new Date(formData.startTime) <= new Date()) {
      newErrors.startTime = "Start time must be in the future";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    } else if (new Date(formData.endTime) <= new Date()) {
      newErrors.endTime = "End time must be in the future";
    } else if (
      formData.startTime &&
      new Date(formData.endTime) <= new Date(formData.startTime)
    ) {
      newErrors.endTime = "End time must be after start time";
    }

    if (!formData.courseId) {
      newErrors.courseId = "Course ID is required";
    }

    if (!formData.questions.length) {
      newErrors.questions = "Quiz must have at least one question";
    } else if (formData.questions.length > 50) {
      newErrors.questions = "Quiz cannot have more than 50 questions";
    }

    // Validate questions
    const questionErrors = {};
    formData.questions.forEach((question, index) => {
      const qErrors = {};

      if (!question.questionText.trim()) {
        qErrors.questionText = "Question text is required";
      } else if (question.questionText.length > 2000) {
        qErrors.questionText = "Question text must not exceed 2000 characters";
      }

      if (!question.points || question.points < 0.25 || question.points > 100) {
        qErrors.points = "Points must be between 0.25 and 100";
      }

      if (!question.options.length || question.options.length < 2) {
        qErrors.options = "Question must have at least 2 options";
      } else if (question.options.length > 6) {
        qErrors.options = "Question must have between 2 and 6 options";
      }

      // Check for exactly one correct answer
      const correctOptions = question.options.filter((o) => o.isCorrect);
      if (correctOptions.length !== 1) {
        qErrors.correctOption = "Exactly one option must be marked as correct";
      }

      // Validate individual options
      const optionErrors = {};
      question.options.forEach((option, oIndex) => {
        if (!option.optionText.trim()) {
          optionErrors[oIndex] = "Option text is required";
        } else if (option.optionText.length > 900) {
          optionErrors[oIndex] = "Option text must not exceed 900 characters";
        }
      });

      if (Object.keys(optionErrors).length) {
        qErrors.optionErrors = optionErrors;
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
        description: formData.description.trim(),
        startTime: formatDateTimeForSubmit(formData.startTime),
        endTime: formatDateTimeForSubmit(formData.endTime),
        courseId: formData.courseId,
        userId: currentUser?.id, // Add userId from context
        questions: formData.questions.map((q) => ({
          questionText: q.questionText.trim(),
          points: parseFloat(q.points),
          options: q.options.map((o) => ({
            optionText: o.optionText.trim(),
            optionSelect: o.optionSelect,
            isCorrect: o.isCorrect,
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

  // Get minimum datetime for input (current time + 1 minute)
  const minDateTime = formatDateTimeForInput(new Date(Date.now() + 60000));

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
            maxLength={500}
          />
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
          <small className="char-count">{formData.title.length}/500</small>
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
          <small className="char-count">
            {formData.description.length}/1000
          </small>
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
              onChange={(e) =>
                handleDateTimeChange("startTime", e.target.value)
              }
              min={minDateTime}
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
              onChange={(e) => handleDateTimeChange("endTime", e.target.value)}
              min={formData.startTime || minDateTime}
              className={errors.endTime ? "error" : ""}
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
                  value={question.questionText}
                  onChange={(e) =>
                    updateQuestion(question.id, "questionText", e.target.value)
                  }
                  placeholder="Enter question text..."
                  rows="2"
                  className={
                    errors.questionErrors?.[qIndex]?.questionText ? "error" : ""
                  }
                  maxLength={2000}
                />
                {errors.questionErrors?.[qIndex]?.questionText && (
                  <span className="error-message">
                    {errors.questionErrors[qIndex].questionText}
                  </span>
                )}
                <small className="char-count">
                  {question.questionText.length}/2000
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
                  min="0.25"
                  max="100"
                  step="0.25"
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

              {/* Options */}
              <div className="options-section">
                <div className="options-header">
                  <label>
                    Answer Options * (Select exactly one correct answer)
                  </label>
                  <button
                    type="button"
                    onClick={() => addOption(question.id)}
                    className="add-option-btn"
                    disabled={question.options.length >= 6}
                  >
                    <Plus size={14} />
                    Add Option
                  </button>
                </div>

                {errors.questionErrors?.[qIndex]?.options && (
                  <span className="error-message">
                    {errors.questionErrors[qIndex].options}
                  </span>
                )}

                {errors.questionErrors?.[qIndex]?.correctOption && (
                  <span className="error-message">
                    {errors.questionErrors[qIndex].correctOption}
                  </span>
                )}

                {question.options.map((option, oIndex) => (
                  <div key={option.id} className="option-item">
                    <div className="option-label">{option.optionSelect}</div>
                    <input
                      type="text"
                      value={option.optionText}
                      onChange={(e) =>
                        updateOption(
                          question.id,
                          option.id,
                          "optionText",
                          e.target.value
                        )
                      }
                      placeholder={`Option ${option.optionSelect}...`}
                      className={
                        errors.questionErrors?.[qIndex]?.optionErrors?.[oIndex]
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
                              question.id,
                              option.id,
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
                          onClick={() => removeOption(question.id, option.id)}
                          className="remove-option-btn"
                          title="Remove Option"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    {errors.questionErrors?.[qIndex]?.optionErrors?.[
                      oIndex
                    ] && (
                      <span className="error-message">
                        {errors.questionErrors[qIndex].optionErrors[oIndex]}
                      </span>
                    )}
                    <small className="char-count">
                      {option.optionText.length}/900
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
