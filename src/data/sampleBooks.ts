import { Book } from '../types';

export const SAMPLE_BOOKS: Array<Book & { description?: string; publishYear?: number; imageUrl?: string; category?: string; quantity?: number }> = [
    {
        id: 1,
        title: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        category: 'Tiểu thuyết',
        publishYear: 1988,
        description: 'Một câu chuyện tâm linh về hành trình tìm kiếm kho báu và ý nghĩa của cuộc sống.',
        quantity: 5,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f0/The-Alchemist-Paulo-Coelho.jpg'
    },
    {
        id: 2,
        title: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        category: 'Tự truyện',
        publishYear: 1936,
        description: 'Cuốn sách kinh điển về cách xây dựng mối quan hệ tốt và đạt được thành công.',
        quantity: 8,
        imageUrl: 'https://cdn.shopify.com/s/files/1/1104/5005/products/how-to-win-friends-influence-people-cover.jpg'
    },
    {
        id: 3,
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        category: 'Khoa học',
        publishYear: 2011,
        description: 'Lịch sử loài người từ thời kỳ đá tối sơ đến hiện đại.',
        quantity: 3,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B00ICN066G.01.L.jpg'
    },
    {
        id: 4,
        title: 'Tư Duy Nhanh và Chậm',
        author: 'Daniel Kahneman',
        category: 'Khoa học',
        publishYear: 2011,
        description: 'Khám phá hai hệ thống tư duy và cách chúng quyết định những quyết định của chúng ta.',
        quantity: 4,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/0374533555.01.L.jpg'
    },
    {
        id: 5,
        title: 'Đừng Để Cảm Xúc Nắm Quyền',
        author: 'Susan David',
        category: 'Tự truyện',
        publishYear: 2016,
        description: 'Cách quản lý cảm xúc và phát triển bản thân một cách lành mạnh.',
        quantity: 6,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/1250074681.01.L.jpg'
    },
    {
        id: 6,
        title: 'Atomic Habits',
        author: 'James Clear',
        category: 'Tự truyện',
        publishYear: 2018,
        description: 'Những thói quen nhỏ có thể dẫn đến những kết quả lớn.',
        quantity: 7,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/0735211299.01.L.jpg'
    },
    {
        id: 7,
        title: 'One Piece - Tập 1',
        author: 'Oda Eiichiro',
        category: 'Truyện tranh',
        publishYear: 1997,
        description: 'Cuộc phiêu lưu của Luffy tìm kiếm kho báu One Piece.',
        quantity: 10,
        imageUrl: 'https://m.media-amazon.com/images/P/B00ARDY8M8.jpg'
    },
    {
        id: 8,
        title: 'Lịch Sử Việt Nam',
        author: 'Ngô Sĩ Liên',
        category: 'Lịch sử',
        publishYear: 2000,
        description: 'Tổng quan về lịch sử phát triển của đất nước Việt Nam.',
        quantity: 2,
        imageUrl: 'https://cdn.bookbaby.com/images/products/history.jpg'
    }
];

export const initializeSampleData = (): void => {
    const existingBooks = localStorage.getItem('books');
    if (!existingBooks) {
        localStorage.setItem('books', JSON.stringify(SAMPLE_BOOKS));
        console.log('Sample data initialized');
    }
};
