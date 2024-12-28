import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "@/constants/api-urls";
import { SESSION_COOKIE_NAME } from "@/constants/environment";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get(SESSION_COOKIE_NAME) || "";
    if (token) {
      config.headers.Authorization = `bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Modify response if necessary
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
