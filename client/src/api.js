import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // TODO: Use env var for production
});

// Add a request interceptor to include the token in headers
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return req;
});

export default API;
