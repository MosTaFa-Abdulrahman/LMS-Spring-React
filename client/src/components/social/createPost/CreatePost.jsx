import "./createPost.scss";
import { useContext, useState } from "react";
import { Send, Image, X } from "lucide-react";
import upload from "../../../upload";

// Context & RTKQ
import { AuthContext } from "../../../context/AuthContext";
import { useCreatePostMutation } from "../../../store/post/postSlice";
import toast from "react-hot-toast";

function CreatePost() {
  // Context & RTKQ
  const { currentUser: userData } = useContext(AuthContext);
  const currentUser = userData?.userInfo;
  const [createPost, { isLoading }] = useCreatePostMutation();

  // State
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Please select an image or video file");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && !selectedFile) {
      toast.error("Please add text or select an image");
      return;
    }

    if (!currentUser?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      let imageUrl = null;

      // Upload file if selected
      if (selectedFile) {
        setIsUploading(true);
        imageUrl = await upload(selectedFile);
      }

      // Create post DTO
      const postData = {
        text: text.trim() || null,
        imageUrl: imageUrl,
        userId: currentUser.id,
      };

      await createPost(postData).unwrap();

      // Reset form
      setText("");
      removeFile();
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const isSubmitDisabled =
    (!text.trim() && !selectedFile) || isLoading || isUploading;

  return (
    <div className="create-post">
      <div className="create-post__header">
        <div className="create-post__avatar">
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              alt={currentUser.firstName}
              className="create-post__avatar-img"
            />
          ) : (
            <div className="create-post__avatar-placeholder">
              {currentUser?.firstName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
        </div>
        <div className="create-post__user-info">
          <span className="create-post__username">
            {currentUser?.firstName || "User"} {currentUser?.lastName}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="create-post__form">
        {/* Text Input */}
        <div className="create-post__input-wrapper">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`What's on your mind ${currentUser?.firstName} ${currentUser?.lastName} 🎯`}
            className="create-post__textarea"
            maxLength={1500}
            rows={4}
          />
          <div className="create-post__char-count">{text.length}/1500</div>
        </div>

        {/* File Preview */}
        {filePreview && (
          <div className="create-post__file-preview">
            <img
              src={filePreview}
              alt="Preview"
              className="create-post__preview-image"
            />
            <button
              type="button"
              onClick={removeFile}
              className="create-post__remove-file"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {selectedFile && !filePreview && (
          <div className="create-post__file-info">
            <span className="create-post__file-name">{selectedFile.name}</span>
            <button
              type="button"
              onClick={removeFile}
              className="create-post__remove-file"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="create-post__actions">
          <div className="create-post__file-input">
            <input
              type="file"
              id="post-file-input"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="create-post__file-hidden"
            />
            <label
              htmlFor="post-file-input"
              className="create-post__file-button"
            >
              <Image size={20} />
              <span>Add Photo</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="create-post__submit"
          >
            {isLoading || isUploading ? (
              <div className="create-post__loading">
                <div className="create-post__spinner"></div>
                <span>{isUploading ? "Uploading..." : "Posting..."}</span>
              </div>
            ) : (
              <>
                <Send size={18} />
                <span>Post</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
