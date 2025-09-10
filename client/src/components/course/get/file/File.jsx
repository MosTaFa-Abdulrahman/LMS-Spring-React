import "./file.scss";
import { useState, useEffect } from "react";
import { FileText, Download, Eye, Lock } from "lucide-react";
import Spinner from "../../../global/spinner/Spinner";
import Modal from "../../../global/modal/Modal";

// RTKQ
import { useGetFilesQuery } from "../../../../store/files/fileSlice";

// From Section Component
function File({ sectionId }) {
  // States
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [allFiles, setAllFiles] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // RTKQ
  const {
    data: filesResponse,
    isLoading,
    error,
    refetch,
  } = useGetFilesQuery({ sectionId, page, size: pageSize });

  // Update files when new data comes
  useEffect(() => {
    if (filesResponse?.data?.content) {
      if (page === 1) {
        setAllFiles(filesResponse.data.content);
      } else {
        setAllFiles((prev) => [...prev, ...filesResponse.data.content]);
      }
      setLoadingMore(false);
    }
  }, [filesResponse, page]);

  // Transformations
  const hasNext = filesResponse?.data?.hasNext || false;
  const totalItems = filesResponse?.data?.totalItems || 0;
  const totalFiles = allFiles.length;

  // Load more files
  const loadMore = () => {
    if (hasNext && !loadingMore) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  // Handle file click
  const handleFileClick = (file) => {
    if (file.isPreview) {
      setSelectedFile(file);
      setIsModalOpen(true);
    }
  };

  // Handle file download
  const handleDownload = (file, e) => {
    e.stopPropagation();
    if (file.isPreview) {
      // Create a temporary link to download the file
      const link = document.createElement("a");
      link.href = file.fileUrl;
      link.download = file.title;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  // Get file extension
  const getFileExtension = (url) => {
    return url?.split(".").pop()?.toUpperCase() || "FILE";
  };

  if (isLoading && page === 1) {
    return <Spinner size={20} text="Loading files..." />;
  }

  if (error) {
    return (
      <div className="file-error">
        <p>Error loading files</p>
        <button onClick={refetch} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  if (!allFiles.length) {
    return null; // No files to show
  }

  return (
    <div className="files-container">
      {/* Files List */}
      <div className="files-list">
        {allFiles.map((file, index) => (
          <FileItem
            key={file.id}
            file={file}
            index={index}
            onClick={() => handleFileClick(file)}
            onDownload={(e) => handleDownload(file, e)}
            fileExtension={getFileExtension(file.fileUrl)}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasNext && (
        <div className="files-load-more">
          <button
            onClick={loadMore}
            className="load-more-files-btn"
            disabled={loadingMore}
          >
            {loadingMore ? (
              <div className="loading-content">
                <Spinner size={14} />
                Loading more files...
              </div>
            ) : (
              `Show ${Math.min(pageSize, totalItems - totalFiles)} more files`
            )}
          </button>
        </div>
      )}

      {/* File Preview Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedFile?.title || "File Preview"}
      >
        {selectedFile && (
          <div className="file-modal-content">
            <div className="file-preview">
              {getFileExtension(selectedFile.fileUrl) === "PDF" ? (
                <iframe
                  src={selectedFile.fileUrl}
                  width="100%"
                  height="500px"
                  title={selectedFile.title}
                  className="pdf-viewer"
                />
              ) : (
                <div className="file-placeholder">
                  <FileText size={64} />
                  <p>Preview not available for this file type</p>
                </div>
              )}
            </div>

            <div className="file-modal-actions">
              <button
                onClick={(e) => handleDownload(selectedFile, e)}
                className="download-btn"
              >
                <Download size={16} />
                Download File
              </button>

              <button
                onClick={() => window.open(selectedFile.fileUrl, "_blank")}
                className="open-btn"
              >
                <Eye size={16} />
                Open in New Tab
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// File Item Component
function FileItem({ file, index, onClick, onDownload, fileExtension }) {
  const isPreview = file.isPreview;

  return (
    <div
      className={`file-item ${isPreview ? "preview" : "locked"}`}
      onClick={isPreview ? onClick : undefined}
    >
      <div className="file-icon">
        <div className="file-type-badge">
          <FileText size={16} />
          <span className="file-extension">{fileExtension}</span>
        </div>
      </div>

      <div className="file-info">
        <div className="file-title-row">
          <h4 className="file-title">{file.title}</h4>
          {isPreview && (
            <span className="preview-label">
              <Eye size={12} />
              Preview
            </span>
          )}
        </div>

        <div className="file-meta">
          <span className="file-type">{fileExtension} File</span>
          <span className="file-resource">Resource</span>
        </div>
      </div>

      <div className="file-actions">
        {isPreview ? (
          <div className="file-buttons">
            <button
              className="preview-btn"
              onClick={onClick}
              title="Preview file"
            >
              <Eye size={14} />
            </button>
            <button
              className="download-btn"
              onClick={onDownload}
              title="Download file"
            >
              <Download size={14} />
            </button>
          </div>
        ) : (
          <div className="locked-indicator">
            <Lock size={14} />
          </div>
        )}
      </div>
    </div>
  );
}

export default File;
