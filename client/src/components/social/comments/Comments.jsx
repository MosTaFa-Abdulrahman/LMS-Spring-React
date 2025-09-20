import "./comments.scss";
import {
  Heart,
  MessageCircle,
  Trash2,
  Send,
  MoreHorizontal,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";

// Dummy-Data (userImg)
import { defaultUserImg } from "../../../dummyData";

// Components
import Replies from "../replies/Replies";
import Spinner from "../../../components/global/spinner/Spinner";
import ErrorData from "../../../components/global/error/ErrorData";

// Context && RTKQ
import { AuthContext } from "../../../context/AuthContext";
import {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useToggleCommentLikeMutation,
} from "../../../store/comment/commentSlice";
import {
  useCreateReplyMutation,
  useDeleteReplyMutation,
  useToggleReplyLikeMutation,
} from "../../../store/reply/replySlice";
import toast from "react-hot-toast";

// From Post Component
function Comments({ postId }) {
  // States
  const [page, setPage] = useState(1);
  const [newComment, setNewComment] = useState("");
  const [replyTexts, setReplyTexts] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [showDropdown, setShowDropdown] = useState({});
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [deletingReplyId, setDeletingReplyId] = useState(null);
  const [togglingCommentLike, setTogglingCommentLike] = useState(null);
  const [togglingReplyLike, setTogglingReplyLike] = useState(null);

  // Context & RTKQ
  const { currentUser: userData } = useContext(AuthContext);
  const currentUser = userData?.userInfo;

  // RTKQ
  const { data, isLoading, isError, error, isFetching, refetch } =
    useGetCommentsQuery({ postId, page, size: 10 });

  // Comment mutations
  const [createComment, { isLoading: isCreatingComment }] =
    useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [toggleCommentLike] = useToggleCommentLikeMutation();

  // Reply mutations
  const [createReply, { isLoading: isCreatingReply }] =
    useCreateReplyMutation();
  const [deleteReply] = useDeleteReplyMutation();
  const [toggleReplyLike] = useToggleReplyLikeMutation();

  // Infinite Scroll for comments
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1000 >=
        document.documentElement.offsetHeight
      ) {
        if (data?.hasMore && !isFetching) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data?.hasMore, isFetching]);

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const weeks = Math.floor(diff / 604800000);
    const months = Math.floor(diff / 2629746000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    if (weeks < 4) return `${weeks}w ago`;
    return `${months}mo ago`;
  };

  // Handle new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!currentUser) {
      toast.error("Please login to comment");
      return;
    }

    try {
      await createComment({
        text: newComment,
        postId: postId,
        userId: currentUser.id,
      }).unwrap();

      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error("Failed to add comment");
      console.error("Error creating comment:", error);
    }
  };

  // Handle like toggle for comments
  const handleCommentLike = async (commentId) => {
    if (!currentUser) {
      toast.error("Please login to like comments");
      return;
    }

    setTogglingCommentLike(commentId);
    try {
      await toggleCommentLike(commentId).unwrap();
    } catch (error) {
      toast.error("Failed to toggle like");
      console.error("Error toggling comment like:", error);
    } finally {
      setTogglingCommentLike(null);
    }
  };

  // Handle reply
  const handleReply = async (commentId) => {
    const replyText = replyTexts[commentId];
    if (!replyText?.trim()) return;
    if (!currentUser) {
      toast.error("Please login to reply");
      return;
    }

    try {
      await createReply({
        text: replyText,
        commentId: commentId,
        userId: currentUser.id,
      }).unwrap();

      setReplyTexts({ ...replyTexts, [commentId]: "" });
      setShowReplyInput({ ...showReplyInput, [commentId]: false });
      setShowReplies({ ...showReplies, [commentId]: true });
      toast.success("Reply added successfully!");
    } catch (error) {
      toast.error("Failed to add reply");
      console.error("Error creating reply:", error);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    if (!currentUser) {
      toast.error("Please login to delete comments");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmDelete) return;

    setDeletingCommentId(commentId);
    try {
      await deleteComment(commentId).unwrap();
      setShowDropdown({});
      toast.success("Comment deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete comment");
      console.error("Error deleting comment:", error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  // Handle delete reply
  const handleDeleteReply = async (replyId) => {
    if (!currentUser) {
      toast.error("Please login to delete replies");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this reply?"
    );
    if (!confirmDelete) return;

    setDeletingReplyId(replyId);
    try {
      await deleteReply(replyId).unwrap();
      setShowDropdown({});
      toast.success("Reply deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete reply");
      console.error("Error deleting reply:", error);
    } finally {
      setDeletingReplyId(null);
    }
  };

  // Handle reply like
  const handleReplyLike = async (replyId) => {
    if (!currentUser) {
      toast.error("Please login to like replies");
      return;
    }

    setTogglingReplyLike(replyId);
    try {
      await toggleReplyLike(replyId).unwrap();
    } catch (error) {
      toast.error("Failed to toggle like");
      console.error("Error toggling reply like:", error);
    } finally {
      setTogglingReplyLike(null);
    }
  };

  // Toggle dropdown menu
  const toggleDropdown = (id, isReply = false) => {
    const key = isReply ? `reply_${id}` : `comment_${id}`;
    setShowDropdown({
      ...showDropdown,
      [key]: !showDropdown[key],
    });
  };

  // Handle reply input toggle
  const toggleReplyInput = (commentId) => {
    setShowReplyInput({
      ...showReplyInput,
      [commentId]: !showReplyInput[commentId],
    });
  };

  // Handle show/hide replies
  const toggleReplies = (commentId) => {
    setShowReplies({
      ...showReplies,
      [commentId]: !showReplies[commentId],
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="comments">
        <Spinner size={20} text="Loading comments..." />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="comments">
        <ErrorData
          message={error?.data?.message || "Failed to load comments"}
          onRetry={() => {
            setPage(1);
            refetch();
          }}
        />
      </div>
    );
  }

  const comments = data?.content || [];

  return (
    <div className="comments">
      {/* Comments Header */}
      <div className="comments-header">
        <h3>Comments ({data?.totalItems || 0})</h3>
      </div>

      {/* Write new comment */}
      {currentUser && (
        <div className="write-comment">
          <div className="user-avatar">
            <img
              src={currentUser?.profileImageUrl || defaultUserImg}
              alt="Your avatar"
              onError={(e) => {
                e.target.src = defaultUserImg;
              }}
            />
          </div>
          <div className="comment-input-container">
            <textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              rows="1"
              disabled={isCreatingComment}
            />
            <button
              className={`send-btn ${newComment.trim() ? "active" : ""}`}
              onClick={handleAddComment}
              disabled={!newComment.trim() || isCreatingComment}
            >
              {isCreatingComment ? <Spinner size={18} /> : <Send size={18} />}
            </button>
          </div>
        </div>
      )}

      {/* Login prompt for guests */}
      {!currentUser && (
        <div className="login-prompt">
          <p>Please login to write comments</p>
        </div>
      )}

      {/* Comments list */}
      <div className="comments-list">
        {comments?.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-avatar">
              <img
                src={comment.userImg || defaultUserImg}
                alt={`${comment.username}'s avatar`}
                onError={(e) => {
                  e.target.src = defaultUserImg;
                }}
              />
            </div>

            <div className="comment-content">
              {/* Comment Header */}
              <div className="comment-header">
                <div className="user-info">
                  <span className="username">
                    {comment.userFirstName && comment.userLastName
                      ? `${comment.userFirstName} ${comment.userLastName}`
                      : comment.username || "Unknown User"}
                  </span>
                  <span className="timestamp">
                    {formatTimeAgo(comment.createdDate)}
                  </span>
                </div>

                {comment.userId === currentUser?.id && (
                  <div className="comment-menu">
                    <button
                      className="menu-trigger"
                      onClick={() => toggleDropdown(comment.id, false)}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {showDropdown[`comment_${comment.id}`] && (
                      <div className="dropdown-menu">
                        <button
                          className="menu-item delete-item"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={deletingCommentId === comment.id}
                        >
                          <Trash2 size={14} />
                          {deletingCommentId === comment.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Comment Text */}
              <div className="comment-text">
                <p>{comment.text}</p>
              </div>

              {/* Comment Actions */}
              <div className="comment-actions">
                <button
                  className={`action-btn like-btn ${
                    comment.isLikedByCurrentUser ? "liked" : ""
                  }`}
                  onClick={() => handleCommentLike(comment.id)}
                  disabled={togglingCommentLike === comment.id || !currentUser}
                >
                  <Heart
                    size={16}
                    fill={
                      comment.isLikedByCurrentUser ? "currentColor" : "none"
                    }
                  />
                  <span>{comment.likesCount || 0}</span>
                  {togglingCommentLike === comment.id && <Spinner size={12} />}
                </button>

                {currentUser && (
                  <button
                    className="action-btn reply-btn"
                    onClick={() => toggleReplyInput(comment.id)}
                  >
                    <MessageCircle size={16} />
                    Reply
                  </button>
                )}

                {/* See all replies button  */}
                <button
                  className="action-btn view-replies-btn"
                  onClick={() => toggleReplies(comment.id)}
                >
                  {showReplies[comment.id] ? "Hide" : "See all"} replies
                </button>
              </div>

              {/* Reply Input */}
              {showReplyInput[comment.id] && currentUser && (
                <div className="reply-input">
                  <div className="user-avatar">
                    <img
                      src={currentUser?.imgUrl || defaultUserImg}
                      alt="Your avatar"
                      onError={(e) => {
                        e.target.src = defaultUserImg;
                      }}
                    />
                  </div>
                  <div className="reply-input-container">
                    <textarea
                      placeholder="Write a reply..."
                      value={replyTexts[comment.id] || ""}
                      onChange={(e) =>
                        setReplyTexts({
                          ...replyTexts,
                          [comment.id]: e.target.value,
                        })
                      }
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleReply(comment.id);
                        }
                      }}
                      rows="1"
                      disabled={isCreatingReply}
                    />
                    <button
                      className={`send-btn ${
                        replyTexts[comment.id]?.trim() ? "active" : ""
                      }`}
                      onClick={() => handleReply(comment.id)}
                      disabled={
                        !replyTexts[comment.id]?.trim() || isCreatingReply
                      }
                    >
                      {isCreatingReply ? (
                        <Spinner size={16} />
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              <Replies
                comment={comment}
                currentUser={currentUser}
                showReplies={showReplies[comment.id]}
                onToggleReplyLike={handleReplyLike}
                onDeleteReply={handleDeleteReply}
                isTogglingReplyLike={togglingReplyLike}
                isDeletingReply={deletingReplyId}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Loading more comments */}
      {isFetching && page > 1 && (
        <div className="loading-more">
          <Spinner size={15} text="Loading more comments..." />
        </div>
      )}

      {/* End of comments */}
      {!data?.hasMore && comments.length > 0 && (
        <div className="comments-end">
          <p>No more comments to load</p>
        </div>
      )}

      {/* Empty State */}
      {comments.length === 0 && (
        <div className="empty-state">
          <MessageCircle size={48} />
          <h4>No comments yet</h4>
          <p>Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}

export default Comments;
