import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL || '',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        return Promise.reject(error?.response?.data || 'An error occurred');
    }
);

export default axiosInstance;