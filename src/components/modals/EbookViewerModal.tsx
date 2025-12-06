import { useEffect, useState } from "react";
import { X, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { getEbookContent, deleteEbookPage } from "../../api/apiService";

interface EbookViewerModalProps {
    bookId: number;
    bookTitle: string;
    onClose: () => void;
}

export default function EbookViewerModal({ bookId, bookTitle, onClose }: EbookViewerModalProps) {
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Hàm gọi API lấy dữ liệu
    const fetchPages = async () => {
        try {
            setLoading(true);
            console.log("Đang lấy nội dung sách ID:", bookId);

            const res: any = await getEbookContent(bookId);
            console.log("Kết quả API trả về:", res); // Xem log này để biết cấu trúc dữ liệu

            // Xử lý dữ liệu trả về (đề phòng backend trả về dạng mảng hoặc object)
            const list = Array.isArray(res) ? res : (res?.data || res?.result || []);
            setPages(list);

        } catch (error) {
            console.error("Lỗi tải nội dung ebook:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bookId) fetchPages();
    }, [bookId]);

    const handleDeletePage = async (pageId: number) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa trang này?")) return;
        try {
            await deleteEbookPage(pageId);
            // Xóa thành công thì lọc bỏ khỏi danh sách đang hiển thị
            setPages(prev => prev.filter(p => p.id !== pageId));
        } catch (error) {
            alert("Xóa trang thất bại!");
        }
    };

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Nội dung: {bookTitle}</h3>
                        <p className="text-xs text-gray-500">ID: {bookId} • Tổng số trang: {pages.length}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Loader2 className="animate-spin mb-2" size={32} />
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : pages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <ImageIcon size={48} className="mb-2 opacity-50" />
                            <p>Chưa có trang nào được tải lên.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {/* Sắp xếp theo số trang (pageNumber) */}
                            {pages.sort((a, b) => a.pageNumber - b.pageNumber).map((page) => (
                                <div key={page.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">

                                    {/* Header Card */}
                                    <div className="px-3 py-2 border-b text-xs font-bold text-gray-600 bg-gray-50 flex justify-between items-center">
                                        <span>Trang {page.pageNumber}</span>
                                        <button
                                            onClick={() => handleDeletePage(page.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                            title="Xóa trang này"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {/* Ảnh */}
                                    <div className="relative aspect-[3/4] bg-gray-100 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={page.imageUrl}
                                            alt={`Page ${page.pageNumber}`}
                                            className="w-full h-full object-contain"
                                            loading="lazy"
                                            onError={(e) => {
                                                // Nếu ảnh lỗi thì hiện placeholder
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement?.classList.add('bg-gray-200');
                                            }}
                                        />
                                    </div>

                                    {/* Text OCR (nếu có) */}
                                    <div className="p-2 h-16 overflow-hidden bg-white border-t border-gray-100">
                                        <p className="text-[10px] text-gray-500 line-clamp-3">
                                            {page.contentText || "Không có văn bản mô tả..."}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}