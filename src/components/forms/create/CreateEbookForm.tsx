import { useState, useEffect, useCallback } from "react";
import { X, BookOpen, Image, Type, Upload, Loader, FileText, Combine, AlertTriangle, Search } from "lucide-react";
import { createEbookPage, getAllBooks, getEbookContent } from "../../../api/apiService";
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
  const [form, setForm] = useState({ bookId: initialBookId, imageUrl: "", contentText: "", width: 0, height: 0 });
  const [localBooks, setLocalBooks] = useState<Book[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pdfPages, setPdfPages] = useState<number | null>(null);
  const [uploadMode, setUploadMode] = useState<'separate' | 'long'>('separate'); 
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [nextPageNumber, setNextPageNumber] = useState<number>(1);

  const fetchNextPageNumber = useCallback(async (bookId: number) => {
    try {
      const res: any = await getEbookContent(bookId);
      const pages = res?.data || res || [];
      const maxPage = pages.length > 0 
        ? Math.max(...pages.map((p: any) => p.pageNumber || 0))
        : 0;
      setNextPageNumber(maxPage + 1);
    } catch (err) {
      console.warn("Không tải được trang hiện tại, mặc định pageNumber = 1");
      setNextPageNumber(1);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (books.length > 0) setLocalBooks(books);
      else getAllBooks().then((res: any) => setLocalBooks(res?.data || res || [])).catch(console.error);
      if (initialBookId > 0) {
        setForm(prev => ({ ...prev, bookId: initialBookId }));
        fetchNextPageNumber(initialBookId);
      }
    }
  }, [isOpen, books, initialBookId, fetchNextPageNumber]);

  const filteredBooks = localBooks.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toString().includes(searchQuery)
  );

  const handleSelectBook = (bookId: number) => {
    setForm(prev => ({ ...prev, bookId }));
    setSearchQuery(localBooks.find(b => b.id === bookId)?.title || "");
    setShowSuggestions(false);
    fetchNextPageNumber(bookId);
  };

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
          pageNumber: nextPageNumber,
          imageUrl: response.data.url,
          contentText: "",
          width: response.data.width,
          height: response.data.height,
        });

        alert("Upload thanh cong (dang anh dai)!");
        setNextPageNumber(prev => prev + 1);
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
              pageNumber: nextPageNumber + i,
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
        setNextPageNumber(prev => prev + pages.length);
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
        await createEbookPage({ ...form, pageNumber: nextPageNumber });
        alert("Luu thanh cong");
        onSuccess();
        setNextPageNumber(prev => prev + 1);
        setForm(prev => ({ ...prev, imageUrl: "" }));
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
          <div className="ebook-field" style={{ position: "relative" }}>
            <label className="ebook-label"><BookOpen size={16}/> Tim kiem sach</label>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#999" }} />
              <input 
                type="text" 
                className="ebook-input" 
                style={{ paddingLeft: 36 }}
                placeholder="Nhap ten hoac ID sach..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && searchQuery && filteredBooks.length > 0 && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, right: 0,
                  background: "white", border: "1px solid #ddd", borderRadius: 6,
                  maxHeight: 200, overflowY: "auto", zIndex: 10, marginTop: 4,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>
                  {filteredBooks.slice(0, 10).map(b => (
                    <div 
                      key={b.id} 
                      style={{ 
                        padding: "8px 12px", cursor: "pointer", 
                        borderBottom: "1px solid #f0f0f0",
                        background: form.bookId === b.id ? "#e3f2fd" : "white"
                      }}
                      onClick={() => handleSelectBook(b.id)}
                      onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                      onMouseLeave={e => e.currentTarget.style.background = form.bookId === b.id ? "#e3f2fd" : "white"}
                    >
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{b.title}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>ID: {b.id}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {form.bookId > 0 && (
              <div style={{ marginTop: 8, padding: "8px 12px", background: "#f0f9ff", borderRadius: 6, fontSize: 13 }}>
                <strong>Sach da chon:</strong> ID {form.bookId} | <strong>Trang tiep theo:</strong> #{nextPageNumber}
              </div>
            )}
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
