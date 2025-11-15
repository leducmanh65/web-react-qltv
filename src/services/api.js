const API_URL = 'http://localhost:3001';

// User API
export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/users?username=${username}&password=${password}`);
  return response.json();
};

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

export const updateUser = async (id, userData) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

// Books API
export const getBooks = async () => {
  const response = await fetch(`${API_URL}/books`);
  return response.json();
};

export const createBook = async (bookData) => {
  const response = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  });
  return response.json();
};

export const updateBook = async (id, bookData) => {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  });
  return response.json();
};

export const patchBook = async (id, bookData) => {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  });
  return response.json();
};

export const deleteBook = async (id) => {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

// Authors API
export const getAuthors = async () => {
  const response = await fetch(`${API_URL}/authors`);
  return response.json();
};

// Categories API
export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);
  return response.json();
};

// Publishers API
export const getPublishers = async () => {
  const response = await fetch(`${API_URL}/publishers`);
  return response.json();
};

// Borrow Slips API
export const getBorrowSlips = async () => {
  const response = await fetch(`${API_URL}/borrowSlips`);
  return response.json();
};

export const createBorrowSlip = async (slipData) => {
  const response = await fetch(`${API_URL}/borrowSlips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slipData)
  });
  return response.json();
};

export const updateBorrowSlip = async (id, slipData) => {
  const response = await fetch(`${API_URL}/borrowSlips/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slipData)
  });
  return response.json();
};

// Borrow Details API
export const getBorrowDetails = async () => {
  const response = await fetch(`${API_URL}/borrowDetails`);
  return response.json();
};

export const createBorrowDetail = async (detailData) => {
  const response = await fetch(`${API_URL}/borrowDetails`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(detailData)
  });
  return response.json();
};

export const updateBorrowDetail = async (id, detailData) => {
  const response = await fetch(`${API_URL}/borrowDetails/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(detailData)
  });
  return response.json();
};

// Statistics
export const getStatistics = async () => {
  const response = await fetch(`${API_URL}/statistics`);
  return response.json();
};