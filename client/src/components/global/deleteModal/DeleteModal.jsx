import "./deleteModal.scss";
import { X } from "lucide-react";

export default function DeleteModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <div className="delete-modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <div className="delete-modal-body">
          <p>{message}</p>
        </div>

        <div className="delete-modal-footer">
          <button className="btn cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
