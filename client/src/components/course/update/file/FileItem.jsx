import { Edit, Trash2 } from "lucide-react";

// Components
import { FileForm } from "./FileForm";

export const FileItem = ({
  file,
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
      <FileForm
        initialData={file}
        onSubmit={onUpdate}
        onCancel={onCancelEdit}
        uploading={uploading}
        onFileUpload={onFileUpload}
      />
    );
  }

  return (
    <div className="content-item file-item">
      <div className="content-info">
        <h5>{file.title}</h5>
        <div className="content-meta">
          {file.isPreview && <span className="preview-badge">Preview</span>}
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
