import "./posts.scss";
import { useState, useEffect, useContext } from "react";

// Components
import CreatePost from "../../components/social/createPost/CreatePost";
import Post from "../../components/social/post/Post";
import Spinner from "../../components/global/spinner/Spinner";
import ErrorData from "../../components/global/error/ErrorData";

// Context & RTKQ
import { AuthContext } from "../../context/AuthContext";
import {
  useGetPostsQuery,
  useGetPostsForUserQuery,
} from "../../store/post/postSlice";

// Get userId from ((Profile Page))
function Posts({ userId = null }) {
  // Context & RTKQ
  const { currentUser: userData } = useContext(AuthContext);
  const currentUser = userData?.userInfo;

  // States
  const [page, setPage] = useState(1);
  const size = 10;

  // RTKQ
  const queryArgs = userId ? { userId, page, size } : { page, size };

  const { data, isLoading, isError, error, isFetching, refetch } = userId
    ? useGetPostsForUserQuery(queryArgs)
    : useGetPostsQuery(queryArgs);

  // Reset page when userId changes
  useEffect(() => {
    setPage(1);
  }, [userId]);

  // Infinite Scroll
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

  // Loading + Error (only for initial load)
  if (isLoading) {
    return (
      <div className="posts">
        <Spinner
          size={20}
          text={userId ? "Loading user posts..." : "Loading posts..."}
        />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="posts">
        <ErrorData
          message={error?.data?.message || "Failed to load posts"}
          onRetry={() => {
            setPage(1);
            refetch();
          }}
        />
      </div>
    );
  }

  // Has Access ADMIN OR INSTRUCTOR
  const hasAccess =
    currentUser.role === "ADMIN" || currentUser.role === "INSTRUCTOR";

  const posts = data?.content || [];

  return (
    <div className="posts">
      {hasAccess && <CreatePost />}

      {posts.length === 0 ? (
        <div className="posts__empty">
          <p>
            {userId
              ? "No posts found for this user. They haven't shared anything yet!"
              : "No posts found. Be the first to share something!"}
          </p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}

          {/* Loading More */}
          {isFetching && page > 1 && (
            <div className="posts__loading-more">
              <Spinner size={15} text="Loading more posts..." />
            </div>
          )}

          {/* End of Posts */}
          {!data?.hasMore && posts.length > 0 && (
            <div className="posts__end">
              <p>You've reached the end! 🎉😘</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Posts;
