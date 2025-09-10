import { Play, Clock, Eye, Lock } from "lucide-react";

export default function VideoItem({ video, onClick }) {
  const isPreview = video.isPreview;

  return (
    <div
      className={`video-item ${isPreview ? "preview" : "locked"}`}
      onClick={isPreview ? onClick : undefined}
    >
      <div className="video-icon">
        {isPreview ? (
          <Play size={16} className="play-icon" />
        ) : (
          <Lock size={16} className="lock-icon" />
        )}
      </div>

      <div className="video-info">
        <div className="video-title-row">
          <h4 className="video-title">{video.title}</h4>
        </div>

        <div className="video-meta">
          <span className="video-duration">
            <Clock size={12} />
            {video.formattedDuration}
          </span>
          <span className="video-order">Lecture {video.sortOrder}</span>
        </div>
      </div>

      <div className="video-actions">
        {isPreview ? (
          <button className="preview-btn" onClick={onClick}>
            Preview
          </button>
        ) : (
          <div className="locked-indicator">
            <Lock size={12} />
          </div>
        )}
      </div>
    </div>
  );
}
