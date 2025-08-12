import axios from "axios";
import { useAuthStore } from "@/store/appStore";
import { API_URL } from "./config";

const request = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important: Sends HttpOnly cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use(
  (config) => {
    const { auth } = useAuthStore.getState();

    const token = auth?.accessToken;
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor to handle 401 errors and refresh tokens
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { setAuth } = useAuthStore.getState();

      try {
        const refreshResponse = await axios.get(
          `${API_URL}/api/supabase/refresh_token`,
          { withCredentials: true },
        );
        const newAuth = refreshResponse.data;
        setAuth(newAuth); // Update the state

        // Attach the new token directly to the original request
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${newAuth.accessToken}`;

        return request(originalRequest); // Retry with updated token
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        setAuth(null);
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default request;
