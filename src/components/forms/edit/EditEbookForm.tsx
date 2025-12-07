import React, { useState, useEffect } from "react";
import { X, Layers, Maximize, Image, Type, Upload, Loader } from "lucide-react";
import { updateEbookPage, getEbookPageById } from "../../../api/apiService";
import { imgbbService } from "../../../api/imgbbService";
import "../../../styles/ebook.css";

interface EditEbookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  pageId: number | null;
}

export default function EditEbookForm({ isOpen, onClose, onSuccess, pageId }: EditEbookFormProps) {
  const [form, setForm] = useState({
    pageNumber: 1,
    imageUrl: "",
    contentText: "",
    width: 0,
    height: 0,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Load page data when modal opens
  useEffect(() => {
    if (isOpen && pageId) {
      loadPageData();
    }
  }, [isOpen, pageId]);

  const loadPageData = async () => {
    if (!pageId) return;
    setIsLoading(true);
    try {
      const pageData: any = await getEbookPageById(pageId);
      setForm({
        pageNumber: pageData.pageNumber || 1,
        imageUrl: pageData.imageUrl || "",
        contentText: pageData.contentText || "",
        width: pageData.width || 0,
        height: pageData.height || 0,
      });
    } catch (err: any) {
      console.error("Load page failed:", err);
      alert("Không thể tải dữ liệu trang. Vui lòng thử lại.");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageId) return alert("ID trang không hợp lệ!");
    if (!form.imageUrl.trim()) return alert("URL hình ảnh bắt buộc!");
    
    setIsSubmitting(true);

    const payload = {
      pageNumber: Number(form.pageNumber) || 1,
      imageUrl: form.imageUrl,
      contentText: form.contentText || "",
      width: Number(form.width) || 0,
      height: Number(form.height) || 0,
    };

    try {
      await updateEbookPage(pageId, payload);
      alert("✅ Cập nhật trang thành công!");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Update ebook page failed:", err);
      alert(err?.response?.data?.message || "Cập nhật trang thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle file upload to ImgBB
   */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Chỉ hỗ trợ JPG, PNG, GIF, WebP hoặc PDF');
      return;
    }

    const maxSize = 32 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File quá lớn. Tối đa 32MB. File của bạn: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);

    try {
      const response = await imgbbService.uploadImage(file);
      const imageUrl = response.data.url;
      const { width, height } = response.data;

      setForm(prev => ({
        ...prev,
        imageUrl: imageUrl,
        width: width,
        height: height,
      }));

      alert('✅ Upload thành công!');
    } catch (error: any) {
      console.error('Upload to ImgBB failed:', error);
      alert(`❌ Upload thất bại: ${error?.message || 'Vui lòng thử lại'}`);
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ebook-overlay" onClick={onClose}>
      <div className="ebook-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ebook-modal-header">
          <h3 className="ebook-modal-title">Sua Trang Ebook</h3>
          <button onClick={onClose} className="ebook-close-btn">
            <X size={20} color="#6b7280" />
          </button>
        </div>

        <div className="ebook-modal-body">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Loader size={30} className="spinner" />
              <p style={{ marginTop: '12px', color: '#666' }}>Dang tai du lieu...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="ebook-row" style={{ marginBottom: 16 }}>
                <div className="col">
                  <label className="ebook-label"><Layers size={16} color="#f59e0b"/> Trang so *</label>
                  <input
                    type="number"
                    className="ebook-input"
                    value={form.pageNumber}
                    onChange={(e) => setForm({ ...form, pageNumber: parseInt(e.target.value || "0") })}
                    required
                  />
                </div>
                <div className="col">
                  <label className="ebook-label"><Maximize size={16} color="#10b981"/> Rong (px)</label>
                  <input type="number" className="ebook-input" value={form.width} onChange={(e) => setForm({ ...form, width: parseInt(e.target.value || "0") })} placeholder="0" />
                </div>
                <div className="col">
                  <label className="ebook-label"><Maximize size={16} color="#10b981"/> Cao (px)</label>
                  <input type="number" className="ebook-input" value={form.height} onChange={(e) => setForm({ ...form, height: parseInt(e.target.value || "0") })} placeholder="0" />
                </div>
              </div>

              <div className="ebook-field">
                <label className="ebook-label"><Image size={16} color="#8b5cf6"/> URL Hinh Anh *</label>

                <div className={`upload-zone ${isUploading ? 'drag-over' : ''}`} style={{ cursor: isUploading ? 'not-allowed' : 'pointer' }}>
                  <input
                    type="file"
                    id="edit-ebook-file-input"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  <label htmlFor="edit-ebook-file-input" className="upload-label" style={{ opacity: isUploading ? 0.6 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      {isUploading ? (
                        <>
                          <Loader size={18} color="#3b82f6" className="spinner" />
                          <span className="text-muted">Dang upload...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={18} color="#3b82f6" />
                          <span style={{ fontSize: '14px', color: '#3b82f6', fontWeight: 500 }}>
                            {uploadedFile ? `✓ ${uploadedFile.name}` : 'Chon anh hoac PDF de thay doi'}
                          </span>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <small className="text-muted" style={{ marginBottom: '4px', display: 'block' }}>Hoac dan URL truc tiep:</small>
                  <input
                    className="ebook-input"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    disabled={isUploading}
                  />
                </div>

                {form.imageUrl && (
                  <div style={{ marginTop: '8px', padding: '10px', border: '1px dashed #d1d5db', borderRadius: '6px', textAlign: 'center' }}>
                    <img src={form.imageUrl} alt="Preview" style={{ maxHeight: '100px', maxWidth: '100%', objectFit: 'contain' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>

              <div className="ebook-field">
                <label className="ebook-label"><Type size={16} color="#6b7280"/> Noi dung van ban (OCR)</label>
                <textarea
                  className="ebook-textarea"
                  value={form.contentText}
                  onChange={(e) => setForm({ ...form, contentText: e.target.value })}
                  placeholder="Nhap noi dung chu..."
                />
              </div>

            </form>
          )}
        </div>

        <div className="ebook-modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={isLoading || isSubmitting}>Dong</button>
          <button onClick={handleSubmit} disabled={isLoading || isSubmitting} className="btn btn-primary">
            {isSubmitting ? "Dang cap nhat..." : "Cap nhat"}
          </button>
        </div>
      </div>
    </div>
  );
}
