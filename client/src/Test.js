import "./quizzes.scss";
import { useContext, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Play,
  ChevronLeft,
  ChevronRight,
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

  // Permmison
  const hasPermmison =
    currentUser.role === "ADMIN" || currentUser.role === "INSTRUCTOR";

  // State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // RTKQ Hooks
  const {
    data: quizzesData,
    isLoading: isLoadingQuizzes,
    error: quizzesError,
    refetch: refetchQuizzes,
  } = useGetQuizzesQuery({ page: currentPage, size: pageSize });

  const [createQuiz, { isLoading: isCreating }] = useCreateQuizMutation();
  const [updateQuiz, { isLoading: isUpdating }] = useUpdateQuizMutation();
  const [deleteQuiz, { isLoading: isDeleting }] = useDeleteQuizMutation();

  // Handlers
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
    setCurrentPage(page);
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

  // Loading state
  if (isLoadingQuizzes) {
    return (
      <div className="quizzes-page">
        <Spinner size={48} text="Loading quizzes..." />
      </div>
    );
  }

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

  const quizzes = quizzesData?.data?.content || [];
  const paginationData = quizzesData?.data || {};

  return (
    <div className="quizzes-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Quiz Management</h1>
          <p>Manage all quizzes for your courses</p>
        </div>
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

      {/* Quizzes Grid */}
      <div className="quizzes-grid">
        {quizzes?.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No quizzes found</h3>
            <p>Create your first quiz to get started</p>
            <button
              className="create-btn"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={20} />
              Create Quiz
            </button>
          </div>
        ) : (
          quizzes?.map((quiz) => (
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

                {/* Status */}
                <div
                  className={`quiz-status ${
                    quiz.isCompleted ? "completed" : "active"
                  }`}
                >
                  {quiz.isCompleted ? "Completed" : "Active"}
                </div>
              </div>

              {/* Actions */}
              {hasPermmison && (
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
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
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
