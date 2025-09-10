// Components
import { Edit, Trash2, Plus } from "lucide-react";
import { SectionForm } from "./SectionForm";
import { VideoForm } from "../video/VideoForm";
import { VideoItem } from "../video/VideoItem";
import { FileForm } from "../file/FileForm";
import { FileItem } from "../file/FileItem";

// RTKQ
import { useGetVideosQuery } from "../../../../store/videos/videoSlice";
import { useGetFilesQuery } from "../../../../store/files/fileSlice";

export const SectionItem = ({
  section,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  editingSection,
  onUpdateSection,
  onCancelEdit,
  showAddVideo,
  setShowAddVideo,
  onCreateVideo,
  editingVideo,
  setEditingVideo,
  onUpdateVideo,
  onDeleteVideo,
  showAddFile,
  setShowAddFile,
  onCreateFile,
  editingFile,
  setEditingFile,
  onUpdateFile,
  onDeleteFile,
  uploading,
  onFileUpload,
}) => {
  // Get videos and files for this section
  const { data: videosData } = useGetVideosQuery({
    sectionId: section.id,
    page: 1,
    size: 100,
  });

  const { data: filesData } = useGetFilesQuery({
    sectionId: section.id,
    page: 1,
    size: 100,
  });

  return (
    <div className="section-item">
      <div className="section-header">
        <div className="section-info" onClick={onToggle}>
          <h3>{section.title}</h3>
          <span className="section-meta">
            Price: ${section.price} | Order: {section.sortOrder}
          </span>
        </div>
        <div className="section-actions">
          <button className="btn-icon" onClick={onEdit}>
            <Edit size={16} />
          </button>
          <button className="btn-icon btn-icon--danger" onClick={onDelete}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {editingSection === section.id && (
        <SectionForm
          initialData={section}
          onSubmit={(data) => onUpdateSection(section.id, data)}
          onCancel={onCancelEdit}
        />
      )}

      {isExpanded && (
        <div className="section-content">
          <p>{section.description}</p>

          {/* Videos Section */}
          <div className="content-section">
            <div className="content-header">
              <h4>Videos</h4>
              <button
                className="btn btn--success btn--small"
                onClick={() => setShowAddVideo(section.id)}
              >
                <Plus size={14} />
                Add Video
              </button>
            </div>

            {showAddVideo === section.id && (
              <VideoForm
                onSubmit={(data) => onCreateVideo(data, section.id)}
                onCancel={() => setShowAddVideo(null)}
                uploading={uploading}
                onFileUpload={onFileUpload}
              />
            )}

            {videosData?.data?.content?.map((video) => (
              <VideoItem
                key={video.id}
                video={video}
                isEditing={editingVideo === video.id}
                onEdit={() => setEditingVideo(video.id)}
                onDelete={() => onDeleteVideo(video.id)}
                onUpdate={(data) => onUpdateVideo(video.id, data)}
                onCancelEdit={() => setEditingVideo(null)}
                uploading={uploading}
                onFileUpload={onFileUpload}
              />
            ))}
          </div>

          {/* Files Section */}
          <div className="content-section">
            <div className="content-header">
              <h4>Files</h4>
              <button
                className="btn btn--success btn--small"
                onClick={() => setShowAddFile(section.id)}
              >
                <Plus size={14} />
                Add File
              </button>
            </div>

            {showAddFile === section.id && (
              <FileForm
                onSubmit={(data) => onCreateFile(data, section.id)}
                onCancel={() => setShowAddFile(null)}
                uploading={uploading}
                onFileUpload={onFileUpload}
              />
            )}

            {filesData?.data?.content?.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                isEditing={editingFile === file.id}
                onEdit={() => setEditingFile(file.id)}
                onDelete={() => onDeleteFile(file.id)}
                onUpdate={(data) => onUpdateFile(file.id, data)}
                onCancelEdit={() => setEditingFile(null)}
                uploading={uploading}
                onFileUpload={onFileUpload}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
