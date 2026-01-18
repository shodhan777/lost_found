import axios from 'axios';

const API = axios.create({
    baseURL: '/api', // Vite proxy will handle this
});

// Add token to requests
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const signup = (formData) => API.post('/auth/signup', formData);

export const fetchLostItems = () => API.get('/items/lost');
export const fetchFoundItems = () => API.get('/items/found');

export const reportLostItem = (formData) => API.post('/items/lost', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const reportFoundItem = (formData) => API.post('/items/found', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const fetchUserProfile = (id) => API.get(`/users/${id}`);
export const updateUserProfile = (id, data) => API.put(`/users/${id}`, data);
export const fetchUserHistory = (id) => API.get(`/users/${id}/history`);
export const claimFoundItem = (id) => API.put(`/items/found/${id}/claim`);

export default API;
