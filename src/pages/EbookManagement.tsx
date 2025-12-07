import { useState, useMemo } from "react";
import TopBar from "../components/TopBar";
import { Loader2, Eye, UploadCloud, Search, Trash2 } from "lucide-react";
import CreateEbookForm from "../components/forms/create/CreateEbookForm";
import EbookViewerModal from "../components/modals/EbookViewerModal";
import { useEbookData } from "../hooks/useManagementHooks";
import { deleteEbookPage } from "../api/apiService";
import { formatDateArray } from "../utils/dateUtils";
import "../styles/ebook.css";
import "../styles/global.css"

export default function EbookManagement() {
	const { data: ebooks, loading, refetch } = useEbookData(true);
	const [searchQuery, setSearchQuery] = useState("");

	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [uploadBookId, setUploadBookId] = useState<number | null>(null);

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editPageId, setEditPageId] = useState<number | null>(null);

	const [viewerOpenFor, setViewerOpenFor] = useState<{ id: number; title?: string } | null>(null);

	// Dữ liệu thô từ API
	const rawList = (ebooks as unknown as any[]) || [];

	// 1. Tối ưu: Lọc dữ liệu
	const filteredList = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return rawList;
		return rawList.filter((item: any) =>
			(item.book?.title || "").toLowerCase().includes(q) ||
			(item.book?.bookCode || "").toLowerCase().includes(q)
		);
	}, [searchQuery, rawList]);

	// 2. Tối ưu: Gom nhóm (Grouping) theo Book ID
	const groupedEbooks = useMemo(() => {
		const groups = new Map<number, { 
            bookId: number; 
            title: string; 
            pageIds: number[]; 
            pageCount: number; 
            hasImage: boolean; 
            createdAt: any 
        }>();

		for (const p of filteredList) {
			const bid = p.book?.id;
            if (!bid) continue;

			const existing = groups.get(bid);
			if (existing) {
				existing.pageIds.push(p.id);
				existing.pageCount++;
				if (p.imageUrl) existing.hasImage = true;
			} else {
				groups.set(bid, {
					bookId: bid,
					title: p.book?.title || `Book #${bid}`,
					pageIds: [p.id],
					pageCount: 1,
					hasImage: !!p.imageUrl,
					createdAt: p.book?.createdAt
				});
			}
		}
		return Array.from(groups.values());
	}, [filteredList]);

    // --- Handlers ---
	const openUpload = (bookId?: number) => {
		setUploadBookId(bookId ?? null);
		setIsUploadModalOpen(true);
	};

	const handleDeletePage = async (pageId: number) => {
		if (!confirm('Bạn chắc chắn muốn xoá trang đầu của sách này?')) return;
		try {
			await deleteEbookPage(pageId);
			alert('✅ Xoá thành công!');
			refetch && refetch();
		} catch (err: any) {
			alert('Xoá thất bại!');
		}
	};

	const handleDeleteAllPages = async (pageIds: number[], title: string) => {
		if (!confirm(`Bạn chắc chắn muốn xoá TẤT CẢ ${pageIds.length} trang ebook của sách "${title}"?`)) return;
		
		let successCount = 0;
		let failCount = 0;

		for (const pageId of pageIds) {
			try {
				await deleteEbookPage(pageId);
				successCount++;
			} catch (err: any) {
				console.error(`Lỗi xoá trang ${pageId}:`, err);
				failCount++;
			}
		}

		if (failCount === 0) {
			alert(`✅ Đã xoá thành công tất cả ${successCount} trang!`);
		} else {
			alert(`⚠️ Xoá xong: ${successCount} thành công, ${failCount} thất bại`);
		}
		
		refetch && refetch();
	};

	return (
		<div>
			<TopBar title="Ebook Management" />

			<div className="card ">
				<div className="section-header">
					<h3 className="section-title">Danh sách Ebook</h3>
					<div className="ebook-actions">
						<div className="search-wrapper">
							<Search size={18} color="#999" />
							<input className="search-input-field" placeholder="Tim sach..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
						</div>
						<button className="btn-primary" onClick={() => openUpload()}>
	              <UploadCloud size={16} /> Upload moi
	            </button>
					</div>
				</div>

				{loading ? (
					<div style={{ textAlign:'center', padding:40 }}><Loader2 className="spinner" size={30} /></div>
				) : (
					<table className="table-container">
						<thead>
							<tr>
								<th  style={{width: "10%"}}>Book ID</th>
								<th style={{width: "10%"}}>Ten sach</th>
								<th style={{width: "10%"}}>Tong so trang</th>
								<th style={{width: "10%"}}>Trang thai anh</th>
								<th style={{width: "10%"}}>Ngay tao</th>
								<th style={{width: "20%"}}>Thao tac</th>
							</tr>
						</thead>
						<tbody>
							{groupedEbooks.length === 0 ? (
								<tr><td colSpan={6} style={{ padding:20, textAlign:'center' }}>Khong co du lieu</td></tr>
							) : (
								groupedEbooks.map((g) => (
									<tr key={g.bookId}>
										<td>{g.bookId}</td>
										<td style={{ fontWeight: 600 }}>{g.title}</td>
										<td>{g.pageCount}</td>
										<td>
											<span className={`status-badge ${g.hasImage ? 'status-success' : 'status-danger'}`}>
												{g.hasImage ? 'Co anh' : 'Chi text'}
											</span>
										</td>
										<td>{formatDateArray(g.createdAt)}</td>
										<td>
											<div className="action-group">
												<button className="icon-btn" onClick={() => setViewerOpenFor({ id: g.bookId, title: g.title })} title="Xem"><Eye size={18} /></button>
												<button className="icon-btn" onClick={() => openUpload(g.bookId)} title="Thêm trang"><UploadCloud size={18} /></button>
												<button className="icon-btn danger" onClick={() => handleDeletePage(g.pageIds[0])} title="Xóa trang đầu"><Trash2 size={18} /></button>
												<button className="btn btn-sm btn-danger" onClick={() => handleDeleteAllPages(g.pageIds, g.title)} title="Xóa tất cả">Xoá tất cả</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				)}
			</div>

			<CreateEbookForm 
                isOpen={isUploadModalOpen} 
                onClose={() => setIsUploadModalOpen(false)} 
                onSuccess={() => { setIsUploadModalOpen(false); refetch && refetch(); }} 
                initialBookId={uploadBookId ?? 0} 
            />

			{viewerOpenFor && (
				<EbookViewerModal bookId={viewerOpenFor.id} bookTitle={viewerOpenFor.title} onClose={() => setViewerOpenFor(null)} />
			)}
		</div>
	);
}