import "./quizzes.scss";
import { useContext, useState, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Play,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Calendar,
  User,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Components
import CreateQuiz from "../../components/quiz/create/CreateQuiz";
import EditQuiz from "../../components/quiz/edit/EditQuiz";
import Spinner from "../../components/global/spinner/Spinner";

// Context & RTKQ
import { AuthContext } from "../../context/AuthContext";
import {
  useGetQuizzesQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
} from "../../store/quizzes/quizSlice";
import toast from "react-hot-toast";

function Quizzes() {
  // Context & RTKQ
  const { currentUser: userData } = useContext(AuthContext);
  const currentUser = userData?.userInfo;
  const navigate = useNavigate();

  // Permission
  const hasPermmison =
    currentUser.role === "ADMIN" || currentUser.role === "INSTRUCTOR";

  // State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Filter States
  const [filters, setFilters] = useState({
    courseLevel: "",
    instructorName: "",
    startDate: "",
    endDate: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // RTKQ Hooks - Get more data to handle client-side filtering and pagination properly
  const {
    data: quizzesData,
    isLoading: isLoadingQuizzes,
    error: quizzesError,
    refetch: refetchQuizzes,
  } = useGetQuizzesQuery({ page: 1, size: 100 }); // Get more items for better filtering

  const [createQuiz, { isLoading: isCreating }] = useCreateQuizMutation();
  const [updateQuiz, { isLoading: isUpdating }] = useUpdateQuizMutation();
  const [deleteQuiz, { isLoading: isDeleting }] = useDeleteQuizMutation();

  // Get all quizzes from API
  const allQuizzes = quizzesData?.data?.content || [];

  // Get unique course levels and instructors for filter dropdowns
  const uniqueCourseLevels = useMemo(() => {
    const levels = [...new Set(allQuizzes.map((quiz) => quiz.courseLevel))];
    return levels.filter((level) => level).sort();
  }, [allQuizzes]);

  const uniqueInstructors = useMemo(() => {
    const instructors = [
      ...new Set(
        allQuizzes.map((quiz) => `${quiz.userFirstName} ${quiz.userLastName}`)
      ),
    ];
    return instructors.filter((instructor) => instructor.trim()).sort();
  }, [allQuizzes]);

  // Filter quizzes based on current filters
  const filteredQuizzes = useMemo(() => {
    let filtered = [...allQuizzes];

    // Filter by course level
    if (filters.courseLevel) {
      filtered = filtered.filter((quiz) =>
        quiz.courseLevel
          ?.toLowerCase()
          .includes(filters.courseLevel.toLowerCase())
      );
    }

    // Filter by instructor name
    if (filters.instructorName) {
      filtered = filtered.filter((quiz) => {
        const fullName =
          `${quiz.userFirstName} ${quiz.userLastName}`.toLowerCase();
        return fullName.includes(filters.instructorName.toLowerCase());
      });
    }

    // Filter by start date
    if (filters.startDate) {
      filtered = filtered.filter((quiz) => {
        const quizStartDate = new Date(quiz.startTime);
        const filterStartDate = new Date(filters.startDate);
        return quizStartDate >= filterStartDate;
      });
    }

    // Filter by end date
    if (filters.endDate) {
      filtered = filtered.filter((quiz) => {
        const quizEndDate = new Date(quiz.endTime);
        const filterEndDate = new Date(filters.endDate);
        return quizEndDate <= filterEndDate;
      });
    }

    return filtered;
  }, [allQuizzes, filters]);

  // Calculate pagination data for filtered results
  const paginationData = useMemo(() => {
    const totalItems = filteredQuizzes.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      currentPage,
      totalPages,
      totalItems,
      hasPrevious: currentPage > 1,
      hasNext: currentPage < totalPages,
    };
  }, [filteredQuizzes.length, currentPage, pageSize]);

  // Paginate filtered results
  const paginatedQuizzes = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredQuizzes.slice(startIndex, startIndex + pageSize);
  }, [filteredQuizzes, currentPage, pageSize]);

  // Filter Handlers
  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      courseLevel: "",
      instructorName: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((filter) => filter);

  // Existing Handlers
  const handleCreateQuiz = async (quizData) => {
    try {
      await createQuiz(quizData).unwrap();
      toast.success("Quiz created successfully!");
      setIsCreateModalOpen(false);
      refetchQuizzes();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create quiz");
    }
  };

  const handleEditQuiz = async (quizData) => {
    try {
      await updateQuiz({ quizId: selectedQuizId, ...quizData }).unwrap();
      toast.success("Quiz updated successfully!");
      setIsEditModalOpen(false);
      setSelectedQuizId(null);
      refetchQuizzes();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update quiz");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await deleteQuiz(quizId).unwrap();
        toast.success("Quiz deleted successfully!");
        refetchQuizzes();
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete quiz");
      }
    }
  };

  const handleEditClick = (quizId) => {
    setSelectedQuizId(quizId);
    setIsEditModalOpen(true);
  };

  const handleGoToQuiz = (quiz) => {
    if (currentUser?.userLevel === quiz.courseLevel) {
      navigate(`/quizzes/${quiz.id}`);
    } else {
      toast.error("You don't have permission to take this quiz.");
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().slice(0, 16);
  };

  // Loading state
  if (isLoadingQuizzes) {
    return (
      <div className="quizzes-page">
        <Spinner size={48} text="Loading quizzes..." />
      </div>
    );
  }

  console.log(paginationData);

  // Error state
  if (quizzesError) {
    return (
      <div className="quizzes-page">
        <div className="error-message">
          <h3>Error loading quizzes</h3>
          <p>{quizzesError?.data?.message || "Something went wrong"}</p>
          <button onClick={refetchQuizzes} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quizzes-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Quiz Management</h1>
          <p>Manage all quizzes for your courses</p>
        </div>
        <div className="header-actions">
          <button
            className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filters
            {hasActiveFilters && <span className="filter-indicator" />}
          </button>
          {hasPermmison && (
            <button
              className="create-btn"
              onClick={() => setIsCreateModalOpen(true)}
              disabled={isCreating}
            >
              <Plus size={20} />
              Create New Quiz
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      <div className={`filters-panel ${showFilters ? "open" : ""}`}>
        <div className="filters-header">
          <h3>Filter Quizzes</h3>
          <div className="filters-actions">
            {hasActiveFilters && (
              <button className="clear-filters-btn" onClick={clearFilters}>
                <X size={16} />
                Clear All
              </button>
            )}
            <button
              className="close-filters-btn"
              onClick={() => setShowFilters(false)}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="filters-content">
          <div className="filter-row">
            {/* Course Level Filter */}
            <div className="filter-group">
              <label htmlFor="courseLevel">
                <GraduationCap size={16} />
                Course Level
              </label>
              <select
                id="courseLevel"
                value={filters.courseLevel}
                onChange={(e) =>
                  handleFilterChange("courseLevel", e.target.value)
                }
              >
                <option value="">All Levels</option>
                {uniqueCourseLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Instructor Filter */}
            <div className="filter-group">
              <label htmlFor="instructorName">
                <User size={16} />
                Instructor
              </label>
              <select
                id="instructorName"
                value={filters.instructorName}
                onChange={(e) =>
                  handleFilterChange("instructorName", e.target.value)
                }
              >
                <option value="">All Instructors</option>
                {uniqueInstructors.map((instructor) => (
                  <option key={instructor} value={instructor}>
                    {instructor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-row">
            {/* Start Date Filter */}
            <div className="filter-group">
              <label htmlFor="startDate">
                <Calendar size={16} />
                Start Date From
              </label>
              <input
                type="datetime-local"
                id="startDate"
                value={formatDateForInput(filters.startDate)}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
              />
            </div>

            {/* End Date Filter */}
            <div className="filter-group">
              <label htmlFor="endDate">
                <Calendar size={16} />
                End Date Until
              </label>
              <input
                type="datetime-local"
                id="endDate"
                value={formatDateForInput(filters.endDate)}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="filter-results">
          <span className="results-count">
            Showing {filteredQuizzes.length} of {allQuizzes.length} quizzes
          </span>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="quizzes-grid">
        {paginatedQuizzes?.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            {hasActiveFilters ? (
              <>
                <h3>No quizzes match your filters</h3>
                <p>Try adjusting your filter criteria</p>
                <button className="clear-filters-btn" onClick={clearFilters}>
                  <X size={20} />
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <h3>No quizzes found</h3>
                <p>Create your first quiz to get started</p>
                {hasPermmison && (
                  <button
                    className="create-btn"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Plus size={20} />
                    Create Quiz
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          paginatedQuizzes?.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              {/* Course Image */}
              <div className="quiz-image">
                <img src={quiz.courseImg} alt={quiz.title} />
                <div className="quiz-level">{quiz.courseLevel}</div>
              </div>

              {/* Quiz Content */}
              <div className="quiz-content">
                <h3 className="quiz-title">{quiz.title}</h3>
                <p className="quiz-description">{quiz.description}</p>

                <div className="quiz-meta">
                  <div className="meta-item">
                    <span className="label">Instructor:</span>
                    <span className="value">
                      {quiz.userFirstName} {quiz.userLastName}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="label">Start:</span>
                    <span className="value">{formatDate(quiz.startTime)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="label">End:</span>
                    <span className="value">{formatDate(quiz.endTime)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="quiz-actions">
                {currentUser.userLevel === quiz.courseLevel && (
                  <button
                    className="action-btn go-btn"
                    onClick={() => handleGoToQuiz(quiz)}
                    title="Go to Quiz"
                  >
                    <Play size={18} />
                    Go Now
                  </button>
                )}
                {hasPermmison && (
                  <>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditClick(quiz.id)}
                      title="Edit Quiz"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      disabled={isDeleting}
                      title="Delete Quiz"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination - Show when there are multiple pages */}
      {paginationData.totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!paginationData.hasPrevious}
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <div className="pagination-info">
            <span>
              Page {paginationData.currentPage} of {paginationData.totalPages}
            </span>
            <span>({paginationData.totalItems} total quizzes)</span>
          </div>

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!paginationData.hasNext}
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Modals */}
      <CreateQuiz
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateQuiz}
        isLoading={isCreating}
      />

      <EditQuiz
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedQuizId(null);
        }}
        onSubmit={handleEditQuiz}
        quizId={selectedQuizId}
        isLoading={isUpdating}
      />
    </div>
  );
}

export default Quizzes;
