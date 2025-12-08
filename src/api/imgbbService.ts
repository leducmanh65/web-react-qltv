export interface ImgBBUploadResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string; // Đây là link trực tiếp đến ảnh
    display_url: string;
    width: number;
    height: number;
    size: number;
    time: number;
    expiration: number;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export class ImgBBService {
  private apiKey: string;
  private uploadUrl = 'https://api.imgbb.com/1/upload';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Upload một file (ảnh hoặc PDF đã convert) lên ImgBB
   */
  async uploadImage(file: File, name?: string): Promise<ImgBBUploadResponse> {
    try {
      // Chuyển file thành Base64 (ImgBB yêu cầu base64 string cho tham số image)
      const base64 = await this.fileToBase64(file);
      const base64Data = base64.split(',')[1]; // Bỏ prefix data:image/...

      const formData = new FormData();
      formData.append('image', base64Data);
      
      // Lấy tên file
      const finalName = name || file.name;
      formData.append('name', finalName);
      formData.append('key', this.apiKey);

      const response = await fetch(this.uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`ImgBB upload failed: ${response.statusText}`);
      }

      const result: ImgBBUploadResponse = await response.json();

      if (!result.success) {
        throw new Error('ImgBB API returned success: false');
      }

      return result;
    } catch (error) {
      console.error('ImgBB upload error:', error);
      throw error;
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
    });
  }
}

// Thay key của bạn vào đây (Nên dùng biến môi trường trong thực tế)
const IMGBB_API_KEY = "af7b7d56508af0ac75fac9f055aa3ced"; 

export const imgbbService = new ImgBBService(IMGBB_API_KEY);