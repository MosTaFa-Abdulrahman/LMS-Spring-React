import "./createCourse.scss";
import { useContext, useState } from "react";
import {
  Plus,
  Trash2,
  Upload,
  Video,
  FileText,
  DollarSign,
  Clock,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { courseLevels } from "../../../dummyData";
import Spinner from "../../../components/global/spinner/Spinner";
import upload from "../../../upload";

// RTKQ & Context
import { useCreateCourseTransactionMutation } from "../../../store/courses/courseSlice";
import { AuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";

function CreateCourse() {
  // Context && RTKQ
  const { currentUser: userData } = useContext(AuthContext);
  const currentUser = userData?.userInfo;

  const [createCourse, { isLoading: isCreating }] =
    useCreateCourseTransactionMutation();

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    courseImg: "",
    level: "",
    sections: [],
  });

  const [uploadingFiles, setUploadingFiles] = useState({});

  // Add new section
  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: "",
          description: "",
          price: "",
          sortOrder: prev.sections.length + 1,
          videos: [],
          files: [],
        },
      ],
    }));
  };

  // Remove section
  const removeSection = (sectionIndex) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections
        .filter((_, index) => index !== sectionIndex)
        .map((section, index) => ({ ...section, sortOrder: index + 1 })),
    }));
  };

  // Update section
  const updateSection = (sectionIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex ? { ...section, [field]: value } : section
      ),
    }));
  };

  // Add video to section
  const addVideo = (sectionIndex) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              videos: [
                ...section.videos,
                {
                  title: "",
                  videoUrl: "",
                  sortOrder: section.videos.length + 1,
                  durationSeconds: "",
                  isPreview: false,
                },
              ],
            }
          : section
      ),
    }));
  };

  // Remove video
  const removeVideo = (sectionIndex, videoIndex) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              videos: section.videos
                .filter((_, vIndex) => vIndex !== videoIndex)
                .map((video, vIndex) => ({ ...video, sortOrder: vIndex + 1 })),
            }
          : section
      ),
    }));
  };

  // Update video
  const updateVideo = (sectionIndex, videoIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              videos: section.videos.map((video, vIndex) =>
                vIndex === videoIndex ? { ...video, [field]: value } : video
              ),
            }
          : section
      ),
    }));
  };

  // Add file to section
  const addFile = (sectionIndex) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              files: [
                ...section.files,
                {
                  title: "",
                  fileUrl: "",
                  isPreview: false,
                },
              ],
            }
          : section
      ),
    }));
  };

  // Remove file
  const removeFile = (sectionIndex, fileIndex) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              files: section.files.filter((_, fIndex) => fIndex !== fileIndex),
            }
          : section
      ),
    }));
  };

  // Update file
  const updateFile = (sectionIndex, fileIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              files: section.files.map((file, fIndex) =>
                fIndex === fileIndex ? { ...file, [field]: value } : file
              ),
            }
          : section
      ),
    }));
  };

  // Handle file upload
  const handleFileUpload = async (file, type, callback) => {
    const uploadId = `${type}-${Date.now()}`;
    setUploadingFiles((prev) => ({ ...prev, [uploadId]: true }));

    try {
      const url = await upload(file);
      callback(url);
      toast.success(
        `${type === "image" ? "Image" : "Video"} uploaded successfully!`
      );
    } catch (error) {
      toast.error(`Failed to upload ${type}. Please try again.`);
    } finally {
      setUploadingFiles((prev) => {
        const updated = { ...prev };
        delete updated[uploadId];
        return updated;
      });
    }
  };

  // Convert duration from MM:SS to seconds
  const convertDurationToSeconds = (duration) => {
    const [minutes, seconds] = duration.split(":").map(Number);
    return (minutes || 0) * 60 + (seconds || 0);
  };

  // Convert seconds to MM:SS format
  const convertSecondsToMMSS = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("You must be logged in to create a course");
      return;
    }

    if (formData.sections.length === 0) {
      toast.error("At least one section is required");
      return;
    }

    // Validate and prepare data
    const courseData = {
      ...formData,
      sections: formData.sections.map((section) => ({
        ...section,
        price: parseFloat(section.price),
        videos: section.videos.map((video) => ({
          ...video,
          durationSeconds: parseInt(video.durationSeconds),
        })),
      })),
    };

    try {
      await createCourse(courseData).unwrap();
      toast.success("Course created successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        shortDescription: "",
        courseImg: "",
        level: "",
        sections: [],
      });
    } catch (error) {
      toast.error(error.data?.message || "Failed to create course");
    }
  };

  return (
    <div className="create-course">
      <div className="create-course__container">
        <div className="create-course__header">
          <h1>Create New Course</h1>
          <p>Fill out the form below to create your course</p>
        </div>

        <form onSubmit={handleSubmit} className="create-course__form">
          {/* Course Basic Information */}
          <div className="form-section">
            <h2>Course Information</h2>

            <div className="form-group">
              <label>Course Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter course title"
                required
                maxLength={200}
              />
            </div>

            <div className="form-group">
              <label>Short Description</label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shortDescription: e.target.value,
                  }))
                }
                placeholder="Brief description of the course"
                maxLength={500}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Detailed course description"
                rows={4}
                maxLength={2000}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Course Level *</label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, level: e.target.value }))
                  }
                  required
                >
                  <option value="">Select Level</option>
                  {courseLevels?.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Course Image *</label>
              <div className="file-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleFileUpload(file, "image", (url) => {
                        setFormData((prev) => ({ ...prev, courseImg: url }));
                      });
                    }
                  }}
                  id="course-image"
                />
                <label htmlFor="course-image" className="file-upload-label">
                  <Upload size={20} />
                  Upload Course Image
                </label>
                {formData.courseImg && (
                  <div className="uploaded-preview">
                    <img src={formData.courseImg} alt="Course preview" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="form-section">
            <div className="section-header">
              <h2>Course Sections</h2>
              <button
                type="button"
                onClick={addSection}
                className="btn btn-secondary"
              >
                <Plus size={20} />
                Add Section
              </button>
            </div>

            {formData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="section-card">
                <div className="section-card__header">
                  <h3>Section {sectionIndex + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeSection(sectionIndex)}
                    className="btn btn-danger"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="section-card__body">
                  <div className="form-group">
                    <label>Section Title *</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) =>
                        updateSection(sectionIndex, "title", e.target.value)
                      }
                      placeholder="Enter section title"
                      required
                      maxLength={200}
                    />
                  </div>

                  <div className="form-group">
                    <label>Section Description</label>
                    <textarea
                      value={section.description}
                      onChange={(e) =>
                        updateSection(
                          sectionIndex,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Section description"
                      rows={3}
                      maxLength={2000}
                    />
                  </div>

                  <div className="form-group">
                    <label>Section Price *</label>
                    <div className="input-with-icon">
                      <DollarSign size={20} />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={section.price}
                        onChange={(e) =>
                          updateSection(sectionIndex, "price", e.target.value)
                        }
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  {/* Videos */}
                  <div className="subsection">
                    <div className="subsection-header">
                      <h4>
                        <Video size={20} /> Videos
                      </h4>
                      <button
                        type="button"
                        onClick={() => addVideo(sectionIndex)}
                        className="btn btn-outline"
                      >
                        <Plus size={16} />
                        Add Video
                      </button>
                    </div>

                    {section.videos.map((video, videoIndex) => (
                      <div key={videoIndex} className="video-card">
                        <div className="video-card__header">
                          <span>Video {videoIndex + 1}</span>
                          <button
                            type="button"
                            onClick={() =>
                              removeVideo(sectionIndex, videoIndex)
                            }
                            className="btn btn-danger-outline"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="video-card__body">
                          <div className="form-group">
                            <label>Video Title *</label>
                            <input
                              type="text"
                              value={video.title}
                              onChange={(e) =>
                                updateVideo(
                                  sectionIndex,
                                  videoIndex,
                                  "title",
                                  e.target.value
                                )
                              }
                              placeholder="Enter video title"
                              required
                              maxLength={200}
                            />
                          </div>

                          <div className="form-group">
                            <label>Video File *</label>
                            <div className="file-upload">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    handleFileUpload(file, "video", (url) => {
                                      updateVideo(
                                        sectionIndex,
                                        videoIndex,
                                        "videoUrl",
                                        url
                                      );
                                    });
                                  }
                                }}
                                id={`video-${sectionIndex}-${videoIndex}`}
                              />
                              <label
                                htmlFor={`video-${sectionIndex}-${videoIndex}`}
                                className="file-upload-label"
                              >
                                <Upload size={16} />
                                Upload Video
                              </label>
                              {video.videoUrl && (
                                <span className="file-uploaded">
                                  Video uploaded ✓
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label>Duration (seconds) *</label>
                              <div className="input-with-icon">
                                <Clock size={16} />
                                <input
                                  type="number"
                                  min="1"
                                  value={video.durationSeconds}
                                  onChange={(e) =>
                                    updateVideo(
                                      sectionIndex,
                                      videoIndex,
                                      "durationSeconds",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Duration in seconds"
                                  required
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={video.isPreview}
                                  onChange={(e) =>
                                    updateVideo(
                                      sectionIndex,
                                      videoIndex,
                                      "isPreview",
                                      e.target.checked
                                    )
                                  }
                                />
                                <span className="checkbox-custom"></span>
                                Preview Video
                                {video.isPreview ? (
                                  <Eye size={16} />
                                ) : (
                                  <EyeOff size={16} />
                                )}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Files */}
                  <div className="subsection">
                    <div className="subsection-header">
                      <h4>
                        <FileText size={20} /> Files
                      </h4>
                      <button
                        type="button"
                        onClick={() => addFile(sectionIndex)}
                        className="btn btn-outline"
                      >
                        <Plus size={16} />
                        Add File
                      </button>
                    </div>

                    {section.files.map((file, fileIndex) => (
                      <div key={fileIndex} className="file-card">
                        <div className="file-card__header">
                          <span>File {fileIndex + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(sectionIndex, fileIndex)}
                            className="btn btn-danger-outline"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="file-card__body">
                          <div className="form-group">
                            <label>File Title *</label>
                            <input
                              type="text"
                              value={file.title}
                              onChange={(e) =>
                                updateFile(
                                  sectionIndex,
                                  fileIndex,
                                  "title",
                                  e.target.value
                                )
                              }
                              placeholder="Enter file title"
                              required
                              maxLength={200}
                            />
                          </div>

                          <div className="form-group">
                            <label>File URL *</label>
                            <input
                              type="url"
                              value={file.fileUrl}
                              onChange={(e) =>
                                updateFile(
                                  sectionIndex,
                                  fileIndex,
                                  "fileUrl",
                                  e.target.value
                                )
                              }
                              placeholder="Enter file URL"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={file.isPreview}
                                onChange={(e) =>
                                  updateFile(
                                    sectionIndex,
                                    fileIndex,
                                    "isPreview",
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="checkbox-custom"></span>
                              Preview File
                              {file.isPreview ? (
                                <Eye size={16} />
                              ) : (
                                <EyeOff size={16} />
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={isCreating}
              className="btn btn-primary"
            >
              {isCreating ? (
                <Spinner size={30} text={"Creating Course..."} />
              ) : (
                <>
                  <Save size={20} />
                  Create Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;
