import axios from 'axios';
import { getToken, setToken, removeToken } from './localStorageService';

let isRefreshing = false;
let pendingRequests = [];

const processQueue = (error, newToken = null) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(newToken);
    }
  });
  pendingRequests = [];
};

export const setupAxiosInterceptors = (navigate) => {
  axios.interceptors.request.use((config) => {
    const token = getToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config || {};
      const status = error.response ? error.response.status : null;

      if (status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          try {
            const newToken = await new Promise((resolve, reject) => {
              pendingRequests.push({ resolve, reject });
            });
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (e) {
            // fall through to logout
          }
        }

        originalRequest._retry = true;
        isRefreshing = true;
        try {
          const currentToken = getToken();
          if (!currentToken) throw new Error('No token');
          const refreshResp = await axios.post('http://localhost:8080/driving-school-management/auth/refresh', { token: currentToken });
          const newToken = refreshResp?.data?.result?.token;
          if (!newToken) throw new Error('No token in refresh response');
          setToken(newToken);
          axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          removeToken();
          if (navigate) navigate('/login');
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axios;


