import { useState } from "react";
import { Save, X, Upload, Link } from "lucide-react";

export const VideoForm = ({
  initialData,
  onSubmit,
  onCancel,
  uploading,
  onFileUpload,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    sortOrder: initialData?.sortOrder || 1,
    durationSeconds: initialData?.durationSeconds || 60,
    isPreview: initialData?.isPreview || false,
    videoUrl: initialData?.videoUrl || "",
  });

  const [urlInput, setUrlInput] = useState(formData.videoUrl || "");
  const [useUpload, setUseUpload] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleVideoChange = (value) => {
    setFormData((prev) => ({ ...prev, videoUrl: value }));
  };

  return (
    <form className="video-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
      </div>

      <div className="form-group">
        <label>Video</label>
        <div className="video-input">
          <div className="input-toggle">
            <button
              type="button"
              className={`toggle-btn ${!useUpload ? "active" : ""}`}
              onClick={() => setUseUpload(false)}
            >
              <Link size={14} />
              URL
            </button>
            <button
              type="button"
              className={`toggle-btn ${useUpload ? "active" : ""}`}
              onClick={() => setUseUpload(true)}
            >
              <Upload size={14} />
              Upload
            </button>
          </div>

          {useUpload ? (
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  onFileUpload(file, handleVideoChange);
                }
              }}
              disabled={uploading}
            />
          ) : (
            <input
              type="url"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                handleVideoChange(e.target.value);
              }}
              placeholder="Enter video URL"
            />
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Sort Order</label>
          <input
            type="number"
            min="1"
            max="60"
            value={formData.sortOrder}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                sortOrder: parseInt(e.target.value) || 1,
              }))
            }
          />
        </div>

        <div className="form-group">
          <label>Duration (seconds)</label>
          <input
            type="number"
            min="1"
            value={formData.durationSeconds}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                durationSeconds: parseInt(e.target.value) || 60,
              }))
            }
          />
        </div>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.isPreview}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, isPreview: e.target.checked }))
            }
          />
          Is Preview
        </label>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn--primary btn--small"
          disabled={uploading}
        >
          <Save size={14} />
          {uploading ? "Uploading..." : "Save"}
        </button>
        <button
          type="button"
          className="btn btn--secondary btn--small"
          onClick={onCancel}
        >
          <X size={14} />
          Cancel
        </button>
      </div>
    </form>
  );
};
