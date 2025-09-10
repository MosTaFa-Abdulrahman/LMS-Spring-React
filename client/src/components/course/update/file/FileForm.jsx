import { useState } from "react";
import { Save, X, Upload, Link } from "lucide-react";

export const FileForm = ({
  initialData,
  onSubmit,
  onCancel,
  uploading,
  onFileUpload,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    isPreview: initialData?.isPreview || false,
    fileUrl: initialData?.fileUrl || "",
  });

  const [urlInput, setUrlInput] = useState(formData.fileUrl || "");
  const [useUpload, setUseUpload] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    if (formData.title.length < 3 || formData.title.length > 200) {
      alert("Title must be between 3 and 200 characters");
      return;
    }

    if (!formData.fileUrl.trim()) {
      alert("File URL or upload is required");
      return;
    }

    onSubmit(formData);
  };

  const handleFileChange = (value) => {
    setFormData((prev) => ({ ...prev, fileUrl: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        alert("File size must be less than 50MB");
        return;
      }

      // Validate file type (common document and media types)
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/avi",
        "video/mov",
        "audio/mp3",
        "audio/wav",
        "application/zip",
        "application/rar",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert(
          "File type not supported. Please upload PDF, DOC, XLS, PPT, images, videos, audio, or archive files."
        );
        return;
      }

      onFileUpload(file, handleFileChange);
    }
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrlInput(value);
    handleFileChange(value);
  };

  const getFileTypeFromUrl = (url) => {
    if (!url) return "file";

    const extension = url.split(".").pop()?.toLowerCase();

    if (["pdf"].includes(extension)) return "PDF";
    if (["doc", "docx"].includes(extension)) return "Word";
    if (["xls", "xlsx"].includes(extension)) return "Excel";
    if (["ppt", "pptx"].includes(extension)) return "PowerPoint";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension))
      return "Image";
    if (["mp4", "avi", "mov"].includes(extension)) return "Video";
    if (["mp3", "wav"].includes(extension)) return "Audio";
    if (["zip", "rar"].includes(extension)) return "Archive";
    if (["txt"].includes(extension)) return "Text";

    return "File";
  };

  return (
    <div className="file-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="file-title">
            Title <span className="required">*</span>
          </label>
          <input
            id="file-title"
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Enter file title (3-200 characters)"
            required
            minLength={3}
            maxLength={200}
            className={
              formData.title.length > 0 &&
              (formData.title.length < 3 || formData.title.length > 200)
                ? "error"
                : ""
            }
          />
          <small className="form-hint">
            {formData.title.length}/200 characters
          </small>
        </div>

        <div className="form-group">
          <label>
            File <span className="required">*</span>
          </label>
          <div className="file-input">
            <div className="input-toggle">
              <button
                type="button"
                className={`toggle-btn ${!useUpload ? "active" : ""}`}
                onClick={() => setUseUpload(false)}
                disabled={uploading}
              >
                <Link size={14} />
                URL
              </button>
              <button
                type="button"
                className={`toggle-btn ${useUpload ? "active" : ""}`}
                onClick={() => setUseUpload(true)}
                disabled={uploading}
              >
                <Upload size={14} />
                Upload
              </button>
            </div>

            {useUpload ? (
              <div className="upload-section">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.webp,.mp4,.avi,.mov,.mp3,.wav,.zip,.rar"
                  className="file-upload-input"
                />
                <div className="upload-info">
                  <small>
                    Supported formats: PDF, DOC, XLS, PPT, Images, Videos,
                    Audio, Archives
                    <br />
                    Max file size: 50MB
                  </small>
                </div>
              </div>
            ) : (
              <input
                type="url"
                value={urlInput}
                onChange={handleUrlChange}
                placeholder="Enter file URL (e.g., https://example.com/file.pdf)"
                disabled={uploading}
              />
            )}
          </div>

          {formData.fileUrl && (
            <div className="file-preview">
              <div className="file-info">
                <span className="file-type-badge">
                  {getFileTypeFromUrl(formData.fileUrl)}
                </span>
                <span className="file-url">
                  {formData.fileUrl.length > 50
                    ? `${formData.fileUrl.substring(0, 50)}...`
                    : formData.fileUrl}
                </span>
              </div>
              <a
                href={formData.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="preview-link"
              >
                Preview
              </a>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.isPreview}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isPreview: e.target.checked,
                }))
              }
              disabled={uploading}
            />
            <span className="checkbox-text">
              Is Preview
              <small>Allow free access to this file</small>
            </span>
          </label>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn--primary btn--small"
            disabled={
              uploading || !formData.title.trim() || !formData.fileUrl.trim()
            }
          >
            <Save size={14} />
            {uploading
              ? "Uploading..."
              : initialData
              ? "Update File"
              : "Add File"}
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--small"
            onClick={onCancel}
            disabled={uploading}
          >
            <X size={14} />
            Cancel
          </button>
        </div>

        {uploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <span className="progress-text">Uploading file...</span>
          </div>
        )}
      </form>
    </div>
  );
};
