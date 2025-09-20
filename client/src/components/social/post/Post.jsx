import "./post.scss";
import { useContext, useState, useEffect } from "react";
import {
  Heart,
  Loader2,
  MessageCircleDashed,
  Share,
  Trash,
} from "lucide-react";
import { Link } from "react-router-dom";
import moment from "moment";

// Dummy-Data (userImg)
import { defaultUserImg } from "../../../dummyData";

// Components
import Comments from "../comments/Comments";

// Context & RTKQ
import { AuthContext } from "../../../context/AuthContext";
import {
  useDeletePostMutation,
  useToggleLikeMutation,
} from "../../../store/post/postSlice";
import toast from "react-hot-toast";

// From Posts Page
function Post({ post }) {
  // States
  const [commentOpen, setCommentOpen] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(post.likesCount);
  const [isLiked, setIsLiked] = useState(false);

  // Context & RTKQ
  const { currentUser: userData } = useContext(AuthContext);
  const currentUser = userData?.userInfo;

  // RTKQ
  const [toggleLike, { isLoading: isToggleLikeLoading }] =
    useToggleLikeMutation();
  const [deletePost, { isLoading: isDeleteLoading }] = useDeletePostMutation();

  // Handle like status from API response
  useEffect(() => {
    setIsLiked(post.isLikedByCurrentUser || false);
  }, [post.isLikedByCurrentUser]);

  // ********************************* ((Actions-Buttons)) ************************************* //
  // Handle like toggle
  const handleLikeToggle = async () => {
    if (!currentUser) {
      toast.error("Please login to like posts");
      return;
    }

    // Prevent multiple clicks
    if (isToggleLikeLoading) return;

    const previousIsLiked = isLiked;
    const previousLikesCount = localLikesCount;

    try {
      // Optimistic update
      const newIsLiked = !isLiked;
      const newLikesCount = newIsLiked
        ? localLikesCount + 1
        : localLikesCount - 1;

      setIsLiked(newIsLiked);
      setLocalLikesCount(newLikesCount);

      await toggleLike(post.id).unwrap();
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(previousIsLiked);
      setLocalLikesCount(previousLikesCount);

      toast.error("Failed to toggle like");
      console.error("Toggle like error:", error);
    }
  };

  // Handle delete post
  const handleDelete = async () => {
    if (!currentUser || currentUser.id !== post.userId) {
      toast.error("You can only delete your own posts");
      return;
    }

    if (isDeleteLoading) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      await deletePost(post.id).unwrap();
      toast.success("Post deleted successfully 🥰");
    } catch (error) {
      toast.error("Failed to delete post 😥");
      console.error("Delete post error:", error);
    }
  };

  // Get display name
  const getDisplayName = () => {
    if (post.userFirstName && post.userLastName) {
      return `${post.userFirstName} ${post.userLastName}`;
    }
    return post.userFullName || post.username || "Unknown User";
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img
              src={post?.userImg || defaultUserImg}
              alt="userImg"
              onError={(e) => {
                e.target.src = defaultUserImg;
              }}
            />
            <div className="details">
              <Link
                to={`/profile/${post?.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{getDisplayName()}</span>
              </Link>
              <span className="date">
                {moment(post?.createdDate).format("MMMM Do YYYY [at] h:mm A")}
              </span>
            </div>
          </div>

          {/* Delete button - only show for post owner */}
          {currentUser?.id === post?.userId && (
            <Trash
              size={18}
              style={{
                color: "tomato",
                cursor: isDeleteLoading ? "not-allowed" : "pointer",
                opacity: isDeleteLoading ? 0.5 : 1,
              }}
              onClick={handleDelete}
            />
          )}
        </div>

        <div className="content">
          <p>{post.text || post.description}</p>
          {post?.imageUrl && (
            <img
              src={post.imageUrl}
              alt="postImg"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
        </div>

        <div className="info">
          <div
            className={`item like-item ${isLiked ? "liked" : ""}`}
            onClick={handleLikeToggle}
            style={{ cursor: isToggleLikeLoading ? "not-allowed" : "pointer" }}
          >
            {isToggleLikeLoading ? (
              <Loader2 className="like-loader" size={16} />
            ) : (
              <Heart
                className={`heart-icon ${isLiked ? "heart-filled" : ""}`}
                fill={isLiked ? "currentColor" : "none"}
                size={16}
              />
            )}
            <span className="like-count">{localLikesCount} Likes</span>
          </div>

          <div
            className="item"
            onClick={() => setCommentOpen(!commentOpen)}
            style={{ cursor: "pointer" }}
          >
            <MessageCircleDashed size={16} />
            Comments
          </div>

          <div className="item" style={{ cursor: "pointer" }}>
            <Share size={16} />
            Share
          </div>
        </div>

        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
}

export default Post;
