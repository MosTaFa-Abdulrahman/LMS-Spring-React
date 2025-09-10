import "./editQuiz.scss";
import { useState, useEffect } from "react";
import { Search, Calendar, Clock, Award, BookOpen } from "lucide-react";
import Modal from "../../global/modal/Modal";
import Spinner from "../../global/spinner/Spinner";

// RTKQ
import { useSearchCoursesQuery } from "../../../store/courses/courseSlice";
import { useGetQuizByIdQuery } from "../../../store/quizzes/quizSlice";

function EditQuiz({ isOpen, onClose, onSubmit, quizId, isLoading }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    totalScore: "",
    courseId: "",
  });

  const [errors, setErrors] = useState({});
  const [courseSearch, setCourseSearch] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Fetch quiz data when modal opens and quizId is available
  const {
    data: quizData,
    isLoading: isLoadingQuiz,
    error: quizError,
  } = useGetQuizByIdQuery(quizId, {
    skip: !quizId || !isOpen,
  });

  // Filter courses based on search
  useEffect(() => {
    if (coursesData) {
      const filtered = coursesData.filter((course) =>
        course.title.toLowerCase().includes(courseSearch.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [coursesData, courseSearch]);

  // Populate form with quiz data
  useEffect(() => {
    if (quizData && isOpen) {
      const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16); // Format for datetime-local input
      };

      setFormData({
        title: quizData.title || "",
        description: quizData.description || "",
        startTime: formatDateTime(quizData.startTime),
        endTime: formatDateTime(quizData.endTime),
        totalScore: quizData.totalScore?.toString() || "",
        courseId: quizData.courseId || "",
      });

      // Set course search to the current course title
      const currentCourse = coursesData?.find(
        (course) => course.id === quizData.courseId
      );
      if (currentCourse) {
        setCourseSearch(currentCourse.title);
      }
    }
  }, [quizData, isOpen, coursesData]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        totalScore: "",
        courseId: "",
      });
      setErrors({});
      setCourseSearch("");
    }
  }, [isOpen]);

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

  const handleCourseSelect = (course) => {
    setFormData((prev) => ({
      ...prev,
      courseId: course.id,
    }));
    setCourseSearch(course.title);

    if (errors.courseId) {
      setErrors((prev) => ({
        ...prev,
        courseId: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Quiz title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Quiz description is required";
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

    if (!formData.totalScore) {
      newErrors.totalScore = "Total score is required";
    } else if (
      isNaN(formData.totalScore) ||
      parseInt(formData.totalScore) <= 0
    ) {
      newErrors.totalScore = "Total score must be a positive number";
    }

    if (!formData.courseId) {
      newErrors.courseId = "Course selection is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData = {
        ...formData,
        totalScore: parseInt(formData.totalScore),
      };
      onSubmit(submitData);
    }
  };

  const selectedCourse = coursesData?.find(
    (course) => course.id === formData.courseId
  );

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
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Quiz">
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

        {/* Total Score */}
        <div className="form-group">
          <label htmlFor="totalScore">
            <Award size={16} />
            Total Score *
          </label>
          <input
            type="number"
            id="totalScore"
            name="totalScore"
            value={formData.totalScore}
            onChange={handleInputChange}
            placeholder="Enter total score..."
            min="1"
            className={errors.totalScore ? "error" : ""}
          />
          {errors.totalScore && (
            <span className="error-message">{errors.totalScore}</span>
          )}
        </div>

        {/* Course Selection */}
        <div className="form-group">
          <label htmlFor="courseSearch">
            <BookOpen size={16} />
            Select Course *
          </label>
          <div className="course-search-wrapper">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                id="courseSearch"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder="Search for a course..."
                className={errors.courseId ? "error" : ""}
              />
            </div>

            {courseSearch && !selectedCourse && (
              <div className="course-dropdown">
                {isLoadingCourses ? (
                  <div className="dropdown-loading">Loading courses...</div>
                ) : filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="course-option"
                      onClick={() => handleCourseSelect(course)}
                    >
                      <img
                        src={course.courseImg}
                        alt={course.title}
                        className="course-image"
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
