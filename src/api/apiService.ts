import axiosClient from './axiosClient'; 

// Interface cho Login
export interface LoginDto {
    username: string;
    password: string;
}



export const loginAuthentication = async (loginDto: LoginDto) => {
    
    const response: any = await axiosClient.post('/authentication/token', loginDto);

 
    if (response && response.result && response.token) {
        localStorage.setItem('accessToken', response.token); 
    }
    
    return response;
};

// 2. AUTHOR CONTROLLER 
export const createAuthor = (authorDto: any) => {
    return axiosClient.post('/api/authors', authorDto);
};

export const getAllAuthors = () => {
    return axiosClient.get('/api/authors');
};

export const getAuthorById = (authorId: number | string) => {
    return axiosClient.get(`/api/authors/${authorId}`);
};

export const updateAuthor = (authorId: number | string, authorDto: any) => {
    return axiosClient.put(`/api/authors/${authorId}`, authorDto);
};

export const deleteAuthor = (authorId: number | string) => {
    return axiosClient.delete(`/api/authors/${authorId}`);
};

// 3. BOOK CONTROLLER 
export const createBook = (bookDto: any) => {
    return axiosClient.post('/api/books', bookDto);
};

export const getAllBooks = () => {
    return axiosClient.get('/api/books');
};

export const getBookById = (bookId: number | string) => {
    return axiosClient.get(`/api/books/${bookId}`);
};

export const getBooksByAuthorId = (authorId: number | string) => {
    return axiosClient.get(`/api/books/author/${authorId}`);
};

export const searchBooksByTitle = (title: string) => {
    return axiosClient.get('/api/books/searchByTitle', {
        params: { title: title }
    });
};

export const getBooksByCategoryAndTags = (categoryId: number | string, listTagsId: (number | string)[]) => {
    // Xử lý query string cho mảng (Java backend thường thích dạng ?tagIds=1&tagIds=2)
    const params = new URLSearchParams();
    if (listTagsId && Array.isArray(listTagsId)) {
        listTagsId.forEach(id => {
            params.append('tagIds', id.toString());
        });
    }
    const queryString = params.toString();
    
    return axiosClient.get(`/api/books/category/${categoryId}/tags?${queryString}`);
};

export const deleteBook = (bookId: number | string) => {
    return axiosClient.delete(`/api/books/${bookId}`);
};

// 4. BORROW SLIP CONTROLLER 
export const getAllBorrowSlips = () => {
    return axiosClient.get('/api/borrowSlips');
};

export const getBorrowSlipById = (id: number | string) => {
    return axiosClient.get(`/api/borrowSlips/${id}`);
};

export const getBorrowSlipsByUserId = (userId: number | string) => {
    return axiosClient.get(`/api/borrowSlips/user/${userId}`);
};

export const getBorrowSlipsByCreatedAt = (createdAt: string) => {
    return axiosClient.get('/api/borrowSlips/createdAt', {
        params: { createdAt: createdAt }
    });
};

export const getBorrowSlipsByBookId = (bookId: number | string) => {
    return axiosClient.get(`/api/borrowSlips/book/${bookId}`);
};

export const createBorrowSlip = (borrowSlipDto: any) => {
    return axiosClient.post('/api/borrowSlips', borrowSlipDto);
};

export const returnBorrowSlipDetail = (detailId: number | string) => {
    return axiosClient.put(`/api/borrowSlips/return/${detailId}`);
};

// 5. CATEGORY CONTROLLER 
export const getAllCategories = () => {
    return axiosClient.get('/api/category');
};

export const getCategoryById = (categoryId: number | string) => {
    return axiosClient.get(`/api/category/${categoryId}`);
};

export const createCategory = (categoryDto: any) => {
    return axiosClient.post('/api/category', categoryDto);
};

export const updateCategory = (categoryId: number | string, categoryDto: any) => {
    return axiosClient.put(`/api/category/${categoryId}`, categoryDto);
};

export const deleteCategory = (categoryId: number | string) => {
    return axiosClient.delete(`/api/category/${categoryId}`);
};

// 6. EBOOK CONTROLLER 
export const getEbookContent = (bookId: number | string) => {
    return axiosClient.get(`/api/ebooks/${bookId}/content`);
};

export const getEbookPageById = (pageId: number | string) => {
    return axiosClient.get(`/api/ebooks/pages/${pageId}`);
};

export const createEbookPage = (pageDto: any) => {
    return axiosClient.post('/api/ebooks/pages', pageDto);
};

export const deleteEbookPage = (pageId: number | string) => {
    return axiosClient.delete(`/api/ebooks/pages/${pageId}`);
};

// 7. READING HISTORY CONTROLLER 
export const getReadingHistoryByBookId = (bookId: number | string) => {
    return axiosClient.get(`/api/reading-history/${bookId}`);
};

export const getReadingHistoryByUserId = (userId: number | string) => {
    return axiosClient.get(`/api/reading-history/user/${userId}`);
};

export const saveReadingProgress = (progressDto: any) => {
    return axiosClient.post('/api/reading-history/progress', progressDto);
};

// 8. TAG CONTROLLER 
export const getAllTags = () => {
    return axiosClient.get('/api/tags');
};

export const createTag = (tagDto: any) => {
    return axiosClient.post('/api/tags', tagDto);
};

export const updateTag = (id: number | string, tagDto: any) => {
    return axiosClient.put(`/api/tags/${id}`, tagDto);
};

export const deleteTag = (id: number | string) => {
    return axiosClient.delete(`/api/tags/${id}`);
};

// 9. USER CONTROLLER 
export const getMyInfo = () => {
    return axiosClient.get('/api/users/myInfo');
};

export const getAllUsers = () => {
    return axiosClient.get('/api/users');
};

export const getUserById = (userId: number | string) => {
    return axiosClient.get(`/api/users/${userId}`);
};

export const createUser = (userDto: any) => {
    return axiosClient.post('/api/users', userDto);
};

export const updateUser = (userId: number | string, userDto: any) => {
    return axiosClient.put(`/api/users/${userId}`, userDto);
};

export const deleteUser = (userId: number | string) => {
    return axiosClient.delete(`/api/users/${userId}`);
};