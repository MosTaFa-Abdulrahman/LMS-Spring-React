import "./editCourse.scss";
import { useState, useEffect } from "react";
import { Edit, Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/global/spinner/Spinner";
import upload from "../../../upload";

// Components
import { CourseDisplay } from "../../../components/course/update/course/CourseDisplay";
import { CourseForm } from "../../../components/course/update/course/CourseForm";
import { SectionForm } from "../../../components/course/update/section/SectionForm";
import { SectionItem } from "../../../components/course/update/section/SectionItem";

// RTKQ
import {
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
} from "../../../store/courses/courseSlice";
import {
  useGetSectionsQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} from "../../../store/sections/sectionSlice";
import {
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
} from "../../../store/videos/videoSlice";
import {
  useCreateFileMutation,
  useUpdateFileMutation,
  useDeleteFileMutation,
} from "../../../store/files/fileSlice";
import toast from "react-hot-toast";

export default function EditCourse() {
  const { courseId } = useParams();

  // Course data and mutations
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useGetCourseByIdQuery(courseId);
  const [updateCourse] = useUpdateCourseMutation();

  // Sections data and mutations
  const { data: sectionsData, refetch: refetchSections } = useGetSectionsQuery({
    courseId,
    page: 1,
    size: 100,
  });
  const [createSection] = useCreateSectionMutation();
  const [updateSection] = useUpdateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();

  // Video mutations
  const [createVideo] = useCreateVideoMutation();
  const [updateVideo] = useUpdateVideoMutation();
  const [deleteVideo] = useDeleteVideoMutation();

  // File mutations
  const [createFile] = useCreateFileMutation();
  const [updateFile] = useUpdateFileMutation();
  const [deleteFile] = useDeleteFileMutation();

  // Local states
  const [editingCourse, setEditingCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({});
  const [editingSection, setEditingSection] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(null);
  const [showAddFile, setShowAddFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  // Initialize course form when course data is loaded
  useEffect(() => {
    if (course) {
      setCourseForm({
        title: course.title || "",
        description: course.description || "",
        shortDescription: course.shortDescription || "",
        courseImg: course.courseImg || "",
        level: course.level || "PRIMARY_GRADE_1",
      });
    }
  }, [course]);

  // Handle file upload
  const handleFileUpload = async (file, callback) => {
    setUploading(true);
    try {
      const url = await upload(file);
      callback(url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  // Course handlers
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      await updateCourse({ courseId, ...courseForm }).unwrap();
      toast.success("Course Updated Success 👌");
      setEditingCourse(false);
    } catch (error) {
      toast.error("Error Update Course 🙄");
      console.error("Failed to update course:", error);
    }
  };

  // Section handlers
  const handleCreateSection = async (sectionData) => {
    try {
      await createSection({ ...sectionData, courseId }).unwrap();
      toast.success("Section Created Success 👌");
      setShowAddSection(false);
      // refetchSections();
    } catch (error) {
      toast.error("Error Create Section 🙄");
      console.error("Failed to create section:", error);
    }
  };

  const handleUpdateSection = async (sectionId, sectionData) => {
    try {
      await updateSection({ sectionId, ...sectionData }).unwrap();
      toast.success("Section Updated Success 👌");
      setEditingSection(null);
      // refetchSections();
    } catch (error) {
      toast.error("Error Update Section 🙄");
      console.error("Failed to update section:", error);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      try {
        await deleteSection(sectionId).unwrap();
        toast.success("Section Deleted Success 👌");
        // refetchSections();
      } catch (error) {
        toast.error("Error Delete Section 🙄");
        console.error("Failed to delete section:", error);
      }
    }
  };

  // Video handlers
  const handleCreateVideo = async (videoData, sectionId) => {
    try {
      await createVideo({ ...videoData, sectionId }).unwrap();
      toast.success("Video Created Success 👌");
      setShowAddVideo(null);
    } catch (error) {
      toast.error("Error Create Video 🙄");
      console.error("Failed to create video:", error);
    }
  };

  const handleUpdateVideo = async (videoId, videoData) => {
    try {
      await updateVideo({ videoId, ...videoData }).unwrap();
      toast.success("Video Updated Success 👌");
      setEditingVideo(null);
    } catch (error) {
      toast.error("Error Update Video 🙄");
      console.error("Failed to update video:", error);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteVideo(videoId).unwrap();
        toast.success("Video Delete Success 👌");
      } catch (error) {
        toast.error("Error Delete Video 🙄");
        console.error("Failed to delete video:", error);
      }
    }
  };

  // File handlers
  const handleCreateFile = async (fileData, sectionId) => {
    try {
      await createFile({ ...fileData, sectionId }).unwrap();
      toast.success("File Created Success 👌");
      setShowAddFile(null);
    } catch (error) {
      toast.error("Error Create File 🙄");
      console.error("Failed to create file:", error);
    }
  };

  const handleUpdateFile = async (fileId, fileData) => {
    try {
      await updateFile({ fileId, ...fileData }).unwrap();
      toast.success("File Updated Success 👌");
      setEditingFile(null);
    } catch (error) {
      toast.error("Error Update File 🙄");
      console.error("Failed to update file:", error);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await deleteFile(fileId).unwrap();
        toast.success("File Deleted Success 👌");
      } catch (error) {
        toast.error("Error Delete File 🙄");
        console.error("Failed to delete file:", error);
      }
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  if (courseLoading)
    return (
      <div style={{ marginTop: "20%" }}>
        <Spinner />
      </div>
    );
  if (courseError) return <div className="error">Error loading course</div>;

  return (
    <div className="edit-course">
      <div className="edit-course__header">
        <h1>Edit Course</h1>
        {!editingCourse && (
          <button
            className="btn btn--primary"
            onClick={() => setEditingCourse(true)}
          >
            <Edit size={16} />
            Edit Course
          </button>
        )}
      </div>

      {/* Course Edit Form */}
      {editingCourse ? (
        <CourseForm
          courseForm={courseForm}
          setCourseForm={setCourseForm}
          onSubmit={handleUpdateCourse}
          onCancel={() => setEditingCourse(false)}
          uploading={uploading}
          onFileUpload={handleFileUpload}
        />
      ) : (
        <CourseDisplay course={course} />
      )}

      {/* Sections */}
      <div className="sections">
        <div className="sections__header">
          <h2>Course Sections</h2>
          <button
            className="btn btn--success"
            onClick={() => setShowAddSection(true)}
          >
            <Plus size={16} />
            Add Section
          </button>
        </div>

        {showAddSection && (
          <SectionForm
            onSubmit={handleCreateSection}
            onCancel={() => setShowAddSection(false)}
          />
        )}

        {sectionsData?.data?.content?.map((section) => (
          <SectionItem
            key={section.id}
            section={section}
            isExpanded={expandedSections[section.id]}
            onToggle={() => toggleSection(section.id)}
            onEdit={() => setEditingSection(section.id)}
            onDelete={() => handleDeleteSection(section.id)}
            editingSection={editingSection}
            onUpdateSection={handleUpdateSection}
            onCancelEdit={() => setEditingSection(null)}
            // Video props
            showAddVideo={showAddVideo}
            setShowAddVideo={setShowAddVideo}
            onCreateVideo={handleCreateVideo}
            editingVideo={editingVideo}
            setEditingVideo={setEditingVideo}
            onUpdateVideo={handleUpdateVideo}
            onDeleteVideo={handleDeleteVideo}
            // File props
            showAddFile={showAddFile}
            setShowAddFile={setShowAddFile}
            onCreateFile={handleCreateFile}
            editingFile={editingFile}
            setEditingFile={setEditingFile}
            onUpdateFile={handleUpdateFile}
            onDeleteFile={handleDeleteFile}
            // Upload props
            uploading={uploading}
            onFileUpload={handleFileUpload}
          />
        ))}
      </div>
    </div>
  );
}
