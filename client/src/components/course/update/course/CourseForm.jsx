import { useState } from "react";
import { Save, X, Upload, Link } from "lucide-react";

// Dummy-Data
import { courseLevels as COURSE_LEVELS } from "../../../../dummyData";

export const CourseForm = ({
  courseForm,
  setCourseForm,
  onSubmit,
  onCancel,
  uploading,
  onFileUpload,
}) => {
  const [urlInput, setUrlInput] = useState(courseForm.courseImg || "");
  const [useUpload, setUseUpload] = useState(false);

  const handleImageChange = (value) => {
    setCourseForm((prev) => ({ ...prev, courseImg: value }));
  };

  return (
    <form className="course-form" onSubmit={onSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={courseForm.title}
          onChange={(e) =>
            setCourseForm((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={courseForm.description}
          onChange={(e) =>
            setCourseForm((prev) => ({ ...prev, description: e.target.value }))
          }
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Short Description</label>
        <textarea
          value={courseForm.shortDescription}
          onChange={(e) =>
            setCourseForm((prev) => ({
              ...prev,
              shortDescription: e.target.value,
            }))
          }
          rows="2"
        />
      </div>

      <div className="form-group">
        <label>Course Image</label>
        <div className="image-input">
          <div className="input-toggle">
            <button
              type="button"
              className={`toggle-btn ${!useUpload ? "active" : ""}`}
              onClick={() => setUseUpload(false)}
            >
              <Link size={16} />
              URL
            </button>
            <button
              type="button"
              className={`toggle-btn ${useUpload ? "active" : ""}`}
              onClick={() => setUseUpload(true)}
            >
              <Upload size={16} />
              Upload
            </button>
          </div>

          {useUpload ? (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  onFileUpload(file, handleImageChange);
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
                handleImageChange(e.target.value);
              }}
              placeholder="Enter image URL"
            />
          )}
        </div>
        {courseForm.courseImg && (
          <div className="image-preview">
            <img src={courseForm.courseImg} alt="Preview" />
          </div>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Level</label>
          <select
            value={courseForm.level}
            onChange={(e) =>
              setCourseForm((prev) => ({ ...prev, level: e.target.value }))
            }
          >
            {COURSE_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row"></div>

      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={uploading}>
          <Save size={16} />
          {uploading ? "Uploading..." : "Save Changes"}
        </button>
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          <X size={16} />
          Cancel
        </button>
      </div>
    </form>
  );
};
