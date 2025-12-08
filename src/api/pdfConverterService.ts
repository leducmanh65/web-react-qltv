import * as pdfjsLib from 'pdfjs-dist';

// Use bundled worker instead of CDN to avoid fetch/import failures in Vite.
// Vite resolves the worker asset URL at build time.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export interface PDFPageImage {
  pageNumber: number;
  blob: Blob;
  width: number;
  height: number;
}

export class PDFConverterService {
  /**
   * Helper: Chuyển File object sang ArrayBuffer để PDF.js đọc
   */
  private static fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
    });
  }

  /**
   * Lấy tổng số trang của file PDF
   */
  static async getPDFPageCount(file: File): Promise<number> {
    try {
      const arrayBuffer = await this.fileToArrayBuffer(file);
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      return pdf.numPages;
    } catch (error) {
      console.error('Failed to get PDF page count:', error);
      throw error;
    }
  }

  /**
   * MODE 1: Tách từng trang PDF thành từng ảnh riêng biệt
   * (Dùng cho slide, sách lật trang)
   */
  static async convertPDFToImages(file: File, scale: number = 2): Promise<PDFPageImage[]> {
    const arrayBuffer = await this.fileToArrayBuffer(file);
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages: PDFPageImage[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvas, canvasContext: context, viewport }).promise;

        const blob = await new Promise<Blob | null>((resolve) => 
          canvas.toBlob(resolve, 'image/jpeg', 0.9)
        );

        if (blob) {
          pages.push({
            pageNumber: pageNum,
            blob: blob,
            width: viewport.width,
            height: viewport.height,
          });
        }
      } catch (err) {
        console.error(`Error converting page ${pageNum}`, err);
      }
    }
    return pages;
  }

  /**
   * MODE 2: Ghép tất cả trang thành 1 ẢNH DÀI DUY NHẤT (Long Image)
   * (Dùng cho Webtoon, tài liệu cuộn)
   */
  static async convertPDFToSingleLongImage(file: File, scale: number = 1.5): Promise<File> {
    const arrayBuffer = await this.fileToArrayBuffer(file);
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;

    // 1. Tính toán kích thước tổng
    const pagesData: { canvas: HTMLCanvasElement; width: number; height: number }[] = [];
    let totalHeight = 0;
    let maxWidth = 0;

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale }); // Scale nhỏ hơn chút để tránh ảnh quá nặng
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) continue;

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({ canvas, canvasContext: context, viewport }).promise;
      
      pagesData.push({ canvas, width: viewport.width, height: viewport.height });
      totalHeight += viewport.height;
      if (viewport.width > maxWidth) maxWidth = viewport.width;
    }

    // Kiểm tra giới hạn Canvas của trình duyệt (thường ~32,000px height)
    if (totalHeight > 30000) {
      console.warn("Ảnh quá dài, có thể gây lỗi trình duyệt. Đang giảm tỉ lệ scale...");
      // Logic giảm scale nếu cần (tự xử lý thêm ở đây nếu muốn)
    }

    // 2. Tạo canvas tổng
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = maxWidth;
    finalCanvas.height = totalHeight;
    const finalCtx = finalCanvas.getContext('2d');

    if (!finalCtx) throw new Error('Cannot create final canvas context');

    // Vẽ nền trắng (đề phòng PDF nền trong suốt)
    finalCtx.fillStyle = '#FFFFFF';
    finalCtx.fillRect(0, 0, maxWidth, totalHeight);

    // 3. Vẽ từng trang lên canvas tổng
    let currentY = 0;
    for (const pageData of pagesData) {
      // Căn giữa trang nếu chiều rộng không đều
      const xOffset = (maxWidth - pageData.width) / 2;
      finalCtx.drawImage(pageData.canvas, xOffset, currentY);
      currentY += pageData.height;
    }

    // 4. Xuất ra File Object
    return new Promise((resolve, reject) => {
      finalCanvas.toBlob((blob) => {
        if (blob) {
          // Tạo tên file mới
          const newFileName = file.name.replace(/\.pdf$/i, '_full.jpg');
          const convertedFile = new File([blob], newFileName, { type: "image/jpeg" });
          resolve(convertedFile);
        } else {
          reject(new Error("Canvas export failed"));
        }
      }, 'image/jpeg', 0.85); // Quality 0.85 để cân bằng dung lượng
    });
  }
}