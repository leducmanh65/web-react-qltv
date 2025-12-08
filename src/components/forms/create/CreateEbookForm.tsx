import React, { useState, useEffect } from "react";
import { X, BookOpen, Maximize, Image, Type, Upload, Loader, FileText, Combine, AlertTriangle } from "lucide-react";
import { createEbookPage, getAllBooks } from "../../../api/apiService";
import { imgbbService } from "../../../api/imgbbService";
import { PDFConverterService } from "../../../api/pdfConverterService";
import type { Book } from "../../../hooks/useManagementHooks";
import "../../../styles/Admin/ebook.css";

interface CreateEbookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  books?: Book[];
  initialBookId?: number;
}

export default function CreateEbookForm({ isOpen, onClose, onSuccess, books = [], initialBookId = 0 }: CreateEbookFormProps) {
  const [form, setForm] = useState({ bookId: initialBookId, pageNumber: 1, imageUrl: "", contentText: "", width: 0, height: 0 });
  const [localBooks, setLocalBooks] = useState<Book[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pdfPages, setPdfPages] = useState<number | null>(null);
  const [uploadMode, setUploadMode] = useState<'separate' | 'long'>('separate'); 
  const [uploadProgress, setUploadProgress] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      if (books.length > 0) setLocalBooks(books);
      else getAllBooks().then((res: any) => setLocalBooks(res?.data || res || [])).catch(console.error);
      if (initialBookId > 0) setForm(prev => ({ ...prev, bookId: initialBookId }));
    }
  }, [isOpen, books, initialBookId]);

  const resetForm = () => {
    setUploadedFile(null);
    setPdfPages(null);
    setUploadProgress("");
    setForm(prev => ({ ...prev, imageUrl: "", contentText: "" }));
  };

  const handleProcessPDF = async () => {
    if (!uploadedFile || !form.bookId) return alert("Chon sach va file PDF truoc!");
    setIsUploading(true);

    try {
      if (uploadMode === 'long') {
        setUploadProgress("Dang ghep cac trang thanh 1 anh (long image)...");

        if (pdfPages && pdfPages > 25) {
          const proceed = window.confirm(`File co ${pdfPages} trang. Anh tao ra se rat dai va nang. Tiep tuc?`);
          if (!proceed) { setIsUploading(false); return; }
        }

        const longImageFile = await PDFConverterService.convertPDFToSingleLongImage(uploadedFile);
        setUploadProgress("Dang upload file anh dai len ImgBB...");
        const response = await imgbbService.uploadImage(longImageFile);

        await createEbookPage({
          bookId: Number(form.bookId),
          pageNumber: Number(form.pageNumber),
          imageUrl: response.data.url,
          contentText: "",
          width: response.data.width,
          height: response.data.height,
        });

        alert("Upload thanh cong (dang anh dai)!");
        setForm(prev => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
      } else {
        setUploadProgress("Dang tach trang PDF...");
        const pages = await PDFConverterService.convertPDFToImages(uploadedFile);

        let successCount = 0;
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          setUploadProgress(`Dang upload trang ${i + 1} / ${pages.length}...`);

          try {
            const pageFile = new File([page.blob], `page-${page.pageNumber}.jpg`, { type: 'image/jpeg' });
            const res = await imgbbService.uploadImage(pageFile);

            await createEbookPage({
              bookId: Number(form.bookId),
              pageNumber: Number(form.pageNumber) + i,
              imageUrl: res.data.url,
              contentText: "",
              width: page.width,
              height: page.height,
            });
            successCount++;
          } catch (err) {
            console.error(`Loi trang ${i + 1}`, err);
          }
        }
        alert(`Hoan tat: ${successCount}/${pages.length} trang.`);
        setForm(prev => ({ ...prev, pageNumber: prev.pageNumber + pages.length }));
      }

      onSuccess();
      resetForm();

    } catch (error: any) {
      console.error(error);
      alert(`Loi: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress("");
    }
  };

  const handleFileChange = async (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'].includes(file.type)) 
      return alert('Chi ho tro anh hoac PDF');
    
    if (file.size > 32 * 1024 * 1024) return alert('File qua lon (>32MB)');

    if (file.type === 'application/pdf') {
      try {
        const count = await PDFConverterService.getPDFPageCount(file);
        setPdfPages(count);
        setUploadedFile(file);
      } catch (e: any) { alert("Loi doc PDF"); }
    } else {
      setIsUploading(true);
      setUploadedFile(file);
      try {
        const res = await imgbbService.uploadImage(file);
        setForm(prev => ({ ...prev, imageUrl: res.data.url, width: res.data.width, height: res.data.height }));
        alert("Upload anh xong!");
      } catch (e) { alert("Loi upload anh"); setUploadedFile(null); }
      finally { setIsUploading(false); }
    }
  };

  const handleSubmitManual = async () => {
    if (!form.bookId || !form.imageUrl) return alert("Thieu thong tin");
    setIsSubmitting(true);
    try {
        await createEbookPage(form);
        alert("Luu thanh cong");
        onSuccess();
        setForm(prev => ({ ...prev, pageNumber: prev.pageNumber + 1, imageUrl: "" }));
    } catch (e) { alert("Loi luu"); }
    finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="ebook-overlay" onClick={onClose}>
      <div className="ebook-modal" onClick={e => e.stopPropagation()}>
        <div className="ebook-modal-header">
          <h3 className="ebook-modal-title">Upload Ebook</h3>
          <button className="ebook-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="ebook-modal-body">
          <div className="ebook-field">
            <label className="ebook-label"><BookOpen size={16}/> Sach</label>
            <select className="ebook-select" value={form.bookId} onChange={e => setForm({...form, bookId: +e.target.value})}>
              <option value="0">-- Chon sach --</option>
               {localBooks.map(b => <option key={b.id} value={b.id}>ID{b.id} - {b.title}</option>)}
            </select>
          </div>

          <div className="ebook-field">
             <label className="ebook-label"><Maximize size={16}/> Trang so</label>
             <input type="number" className="ebook-input" value={form.pageNumber} onChange={e => setForm({...form, pageNumber: +e.target.value})} />
          </div>

          <div className="ebook-field">
            <label className="ebook-label"><Image size={16}/> File Upload</label>

            {pdfPages && (
                <div className="mode-switch">
                    <button className={`mode-btn ${uploadMode === 'separate' ? 'active' : ''}`} onClick={() => setUploadMode('separate')}>
                        <FileText size={16} /> Tach tung trang
                    </button>
                    <button className={`mode-btn ${uploadMode === 'long' ? 'active' : ''}`} onClick={() => setUploadMode('long')}>
                        <Combine size={16} /> Gop 1 anh dai
                    </button>
                </div>
            )}

            <div 
                className={`upload-zone ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={e => { e.preventDefault(); setIsDragOver(false); if(e.dataTransfer.files[0]) handleFileChange(e.dataTransfer.files[0]); }}
            >
                <input type="file" id="f-input" accept="image/*,.pdf" onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0])} />
                <label htmlFor="f-input" className="upload-label">
                  {isUploading ? (
                    <div>
                      <Loader className="spinner" style={{ margin: '0 auto' }} />
                      <p className="text-muted" style={{ marginTop: 8 }}>{uploadProgress}</p>
                    </div>
                  ) : (
                    <div>
                      <Upload size={32} style={{ margin: '0 auto', color: '#3b82f6' }} />
                      <p style={{ fontWeight: 600, marginTop: 8 }}>{uploadedFile ? uploadedFile.name : 'Keo tha file hoac click'}</p>
                      {pdfPages && <div className="ebook-warning"><AlertTriangle size={14}/> PDF {pdfPages} trang</div>}
                    </div>
                  )}
                </label>
            </div>

            {!uploadedFile && (
                <div>
                    <label className="text-muted">Hoac URL anh:</label>
                    <input className="ebook-input" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="https://..." />
                </div>
            )}
          </div>
          
          <div className="ebook-field">
              <label className="ebook-label"><Type size={16}/> Noi dung chu (Optional)</label>
              <textarea className="ebook-textarea" value={form.contentText} onChange={e => setForm({...form, contentText: e.target.value})} />
          </div>

        </div>

        <div className="ebook-modal-footer">
            <button onClick={onClose} className="btn btn-secondary">Dong</button>
            {pdfPages ? (
                <button 
                    onClick={handleProcessPDF} 
                    disabled={isUploading}
                    className="btn btn-success"
                >
                {isUploading ? 'Dang xu ly...' : `Upload PDF`}
                </button>
            ) : (
                <button 
                    onClick={handleSubmitManual} 
                    disabled={isSubmitting}
                    className="btn btn-primary"
                >
                    Luu trang
                </button>
            )}
        </div>
      </div>
    </div>
  );
}
