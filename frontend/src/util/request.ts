import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { store } from "@/redux/store";
import { toast } from "sonner";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = store.getState().auth.token;
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
    const message = (response?.data as { message?: string })?.message;
    if (message) {
      toast.success(message);
    }
    return response.data;
  },
  (error: AxiosError) => {
    const status = error?.response?.status;
    const message = (error?.response?.data as { message?: string })?.message;
    if (status === 401) {
      toast.error(message || "Unauthorized. Please login again.");
    } else if (status === 403) {
      toast.error(message || "Access denied.");
    } else if (status === 404) {
      toast.error(message || "Resource not found.");
    } else if (status === 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error(message || "An error occurred");
    }
    return Promise.reject(error?.response?.data || "An error occurred");
  }
);

export default axiosInstance;
