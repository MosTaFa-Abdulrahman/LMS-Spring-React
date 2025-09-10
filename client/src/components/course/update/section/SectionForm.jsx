import { useState } from "react";
import { Save, X } from "lucide-react";

export const SectionForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    sortOrder: initialData?.sortOrder || 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="section-form" onSubmit={handleSubmit}>
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
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="99999.99"
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                price: parseFloat(e.target.value) || 0,
              }))
            }
          />
        </div>

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
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn--primary btn--small">
          <Save size={14} />
          Save
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
