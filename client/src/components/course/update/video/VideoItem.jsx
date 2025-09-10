import { Edit, Trash2 } from "lucide-react";

// Components
import { VideoForm } from "./VideoForm";

export const VideoItem = ({
  video,
  isEditing,
  onEdit,
  onDelete,
  onUpdate,
  onCancelEdit,
  uploading,
  onFileUpload,
}) => {
  if (isEditing) {
    return (
      <VideoForm
        initialData={video}
        onSubmit={onUpdate}
        onCancel={onCancelEdit}
        uploading={uploading}
        onFileUpload={onFileUpload}
      />
    );
  }

  return (
    <div className="content-item video-item">
      <div className="content-info">
        <h5>{video.title}</h5>
        <div className="content-meta">
          <span>Order: {video.sortOrder}</span>
          <span>Duration: {video.durationSeconds}s</span>
          {video.isPreview && <span className="preview-badge">Preview</span>}
        </div>
      </div>
      <div className="content-actions">
        <button className="btn-icon" onClick={onEdit}>
          <Edit size={14} />
        </button>
        <button className="btn-icon btn-icon--danger" onClick={onDelete}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};
