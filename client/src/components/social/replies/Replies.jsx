import "./replies.scss";
import { Heart, MoreHorizontal, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

// Dummy-Data (userImg)
import { defaultUserImg } from "../../../dummyData";

// Component
import Spinner from "../../../components/global/spinner/Spinner";

// RTKQ
import { useGetRepliesQuery } from "../../../store/reply/replySlice";

// From Comments Component
function Replies({
  comment,
  currentUser,
  showReplies,
  onToggleReplyLike,
  onDeleteReply,
  isTogglingReplyLike,
  isDeletingReply,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [allReplies, setAllReplies] = useState([]);
  const [showDropdown, setShowDropdown] = useState({});
  const [showAllReplies, setShowAllReplies] = useState(false);

  // Fetch replies only when showReplies is true
  const {
    data: repliesData,
    isLoading: repliesLoading,
    isFetching: repliesFetching,
    error: repliesError,
  } = useGetRepliesQuery(
    {
      commentId: comment.id,
      page: currentPage,
      size: showAllReplies ? 1000 : 10, // Load all when showAllReplies is true
    },
    {
      skip: !showReplies,
      // Keep previous data while fetching new pages
      keepPreviousData: true,
    }
  );

  // Update allReplies when new data comes in
  useEffect(() => {
    if (repliesData?.content) {
      if (currentPage === 1 || showAllReplies) {
        // First page or show all - replace all replies
        setAllReplies(repliesData.content);
      } else {
        // Subsequent pages - append new replies
        setAllReplies((prev) => [...prev, ...repliesData.content]);
      }
    }
  }, [repliesData, currentPage, showAllReplies]);

  // Reset when showReplies changes
  useEffect(() => {
    if (!showReplies) {
      setCurrentPage(1);
      setAllReplies([]);
      setShowAllReplies(false);
    }
  }, [showReplies]);

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

  const toggleDropdown = (replyId) => {
    const key = `reply_${replyId}`;
    setShowDropdown((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLoadMoreReplies = () => {
    if (repliesData && !repliesData.last && !repliesFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await onDeleteReply(replyId);
      // Remove the deleted reply from local state immediately for better UX
      setAllReplies((prev) => prev.filter((reply) => reply.id !== replyId));
      // Close dropdown
      setShowDropdown((prev) => ({
        ...prev,
        [`reply_${replyId}`]: false,
      }));
    } catch (error) {
      console.error("Failed to delete reply:", error);
    }
  };

  const handleToggleReplyLike = async (replyId) => {
    try {
      await onToggleReplyLike(replyId);
      // Optimistically update the like status
      setAllReplies((prev) =>
        prev.map((reply) => {
          if (reply.id === replyId) {
            return {
              ...reply,
              isLikedByCurrentUser: !reply.isLikedByCurrentUser,
              likesCount: reply.isLikedByCurrentUser
                ? reply.likesCount - 1
                : reply.likesCount + 1,
            };
          }
          return reply;
        })
      );
    } catch (error) {
      console.error("Failed to toggle reply like:", error);
      // Revert optimistic update on error
      // In a real app, you might want to show an error message
    }
  };

  if (!showReplies) return null;

  // Show error state
  if (repliesError) {
    return (
      <div className="replies">
        <div className="error-state">
          <p>Failed to load replies. Please try again.</p>
        </div>
      </div>
    );
  }

  // Check if we have more replies to load
  const hasMoreReplies =
    !showAllReplies && repliesData?.hasNext && repliesData?.content?.length > 0;

  return (
    <div className="replies">
      {/* Loading state for initial load */}
      {repliesLoading && currentPage === 1 && (
        <div className="replies-loading">
          <Spinner size={15} text={"Loading replies..."} />
        </div>
      )}

      {/* Render replies */}
      {allReplies?.length > 0 &&
        allReplies.map((reply) => (
          <div key={reply.id} className="reply">
            <div className="reply-avatar">
              <img
                src={reply.userImg || defaultUserImg}
                alt={`${reply.username}'s avatar`}
                onError={(e) => {
                  e.target.src = defaultUserImg;
                }}
              />
            </div>

            <div className="reply-content">
              {/* Reply Header */}
              <div className="reply-header">
                <div className="user-info">
                  <span className="username">
                    {reply.userFirstName && reply.userLastName
                      ? `${reply.userFirstName} ${reply.userLastName}`
                      : reply.username || "Unknown User"}
                  </span>
                  <span className="timestamp">
                    {formatTimeAgo(reply.createdDate)}
                  </span>
                </div>

                {reply.userId === currentUser?.id && (
                  <div className="reply-menu">
                    <button
                      className="menu-trigger"
                      onClick={() => toggleDropdown(reply.id)}
                      disabled={isDeletingReply === reply.id}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                    {showDropdown[`reply_${reply.id}`] && (
                      <div className="dropdown-menu">
                        <button
                          className="menu-item delete-item"
                          onClick={() => handleDeleteReply(reply.id)}
                          disabled={isDeletingReply === reply.id}
                        >
                          {isDeletingReply === reply.id ? (
                            <>
                              <Spinner size={12} />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 size={12} />
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Reply Text */}
              <div className="reply-text">
                <p>{reply.text}</p>
              </div>

              {/* Reply Actions */}
              <div className="reply-actions">
                <button
                  className={`action-btn like-btn ${
                    reply.isLikedByCurrentUser ? "liked" : ""
                  }`}
                  onClick={() => handleToggleReplyLike(reply.id)}
                  disabled={isTogglingReplyLike === reply.id || !currentUser}
                >
                  <Heart
                    size={14}
                    fill={reply.isLikedByCurrentUser ? "currentColor" : "none"}
                  />
                  <span>{reply.likesCount}</span>
                  {isTogglingReplyLike === reply.id && <Spinner size={12} />}
                </button>
              </div>
            </div>
          </div>
        ))}

      {/* Load More Replies Button - only show for regular pagination */}
      {!showAllReplies && hasMoreReplies ? (
        <button
          className="load-more-replies-btn"
          onClick={handleLoadMoreReplies}
          disabled={repliesFetching}
        >
          {repliesFetching ? (
            <>
              <Spinner size={16} />
              Loading...
            </>
          ) : (
            "Load more replies"
          )}
        </button>
      ) : (
        ""
      )}

      {/* No replies message */}
      {!repliesLoading && allReplies.length === 0 && (
        <div className="no-replies">
          <p>No replies yet. Be the first to reply!</p>
        </div>
      )}
    </div>
  );
}

export default Replies;
