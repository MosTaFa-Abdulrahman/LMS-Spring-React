import "./video.scss";
import { useState, useEffect } from "react";
import { Clock, Eye } from "lucide-react";

// Components
import VideoItem from "./VideoItem";
import Modal from "../../../global/modal/Modal";
import Spinner from "../../../global/spinner/Spinner";

// RTKQ
import { useGetVideosQuery } from "../../../../store/videos/videoSlice";

// From Section Component
function Video({ sectionId }) {
  // States
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [allVideos, setAllVideos] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // RTKQ
  const {
    data: videosResponse,
    isLoading,
    error,
    refetch,
  } = useGetVideosQuery({ sectionId, page, size: pageSize });

  // Update videos when new data comes
  useEffect(() => {
    if (videosResponse?.data?.content) {
      if (page === 1) {
        setAllVideos(videosResponse.data.content);
      } else {
        setAllVideos((prev) => [...prev, ...videosResponse.data.content]);
      }
      setLoadingMore(false);
    }
  }, [videosResponse, page]);

  // Transformations
  const hasNext = videosResponse?.data?.hasNext || false;
  const totalItems = videosResponse?.data?.totalItems || 0;
  const totalVideos = allVideos.length;

  // Load more videos
  const loadMore = () => {
    if (hasNext && !loadingMore) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  // Handle video click
  const handleVideoClick = (video) => {
    if (video.isPreview) {
      setSelectedVideo(video);
      setIsModalOpen(true);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  if (isLoading && page === 1) {
    return <Spinner size={20} text="Loading videos..." />;
  }

  if (error) {
    return (
      <div className="video-error">
        <p>Error loading videos</p>
        <button onClick={refetch} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  if (!allVideos.length) {
    return null; // No videos to show
  }

  return (
    <div className="videos-container">
      {/* Video List */}
      <div className="videos-list">
        {allVideos?.map((video) => (
          <VideoItem
            key={video.id}
            video={video}
            onClick={() => handleVideoClick(video)}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasNext && (
        <div className="videos-load-more">
          <button
            onClick={loadMore}
            className="load-more-videos-btn"
            disabled={loadingMore}
          >
            {loadingMore ? (
              <div className="loading-content">
                <Spinner size={14} />
                Loading more videos...
              </div>
            ) : (
              `Show ${Math.min(pageSize, totalItems - totalVideos)} more videos`
            )}
          </button>
        </div>
      )}

      {/* Video Preview Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedVideo?.title || "Video Preview"}
      >
        {selectedVideo && (
          <div className="video-modal-content">
            <div className="video-player">
              <video
                controls
                width="100%"
                poster="/api/placeholder/800/450"
                preload="metadata"
              >
                <source src={selectedVideo.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="video-info">
              <h3>{selectedVideo.title}</h3>
              <div className="video-meta">
                <span className="duration">
                  <Clock size={14} />
                  {selectedVideo.formattedDuration}
                </span>
                <span className="preview-badge">
                  <Eye size={14} />
                  Preview
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Video;
