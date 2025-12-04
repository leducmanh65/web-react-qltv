import { useState } from 'react';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookData: BookFormData) => void;
}

export interface BookFormData {
  title: string;
  bookCode: string;
  publishYear: string;
  totalQuantity: string;
  isbn: string;
  description: string;
  categoryId: string;
  authorIds: string;
  tagId: string;
}

export default function AddBookModal({ isOpen, onClose, onSubmit }: AddBookModalProps) {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    bookCode: '',
    publishYear: '',
    totalQuantity: '',
    isbn: '',
    description: '',
    categoryId: '',
    authorIds: '',
    tagId: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Validate totalQuantity to ensure it's not negative
    if (name === 'totalQuantity') {
      const numValue = parseInt(value);
      if (numValue < 0 || isNaN(numValue)) {
        return; // Don't update if negative or invalid
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      title: '',
      bookCode: '',
      publishYear: '',
      totalQuantity: '',
      isbn: '',
      description: '',
      categoryId: '',
      authorIds: '',
      tagId: ''
    });
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      bookCode: '',
      publishYear: '',
      totalQuantity: '',
      isbn: '',
      description: '',
      categoryId: '',
      authorIds: '',
      tagId: ''
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bookCode">Book code</label>
              <input
                type="text"
                id="bookCode"
                name="bookCode"
                value={formData.bookCode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="publishYear">Publish year</label>
              <input
                type="text"
                id="publishYear"
                name="publishYear"
                value={formData.publishYear}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="totalQuantity">Total quantity</label>
              <input
                type="number"
                id="totalQuantity"
                name="totalQuantity"
                value={formData.totalQuantity}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="isbn">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoryId">ID Category</label>
              <input
                type="text"
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="authorIds">ID Authors</label>
              <input
                type="text"
                id="authorIds"
                name="authorIds"
                value={formData.authorIds}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tagId">ID Tag</label>
              <input
                type="text"
                id="tagId"
                name="tagId"
                value={formData.tagId}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              SUBmit
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
