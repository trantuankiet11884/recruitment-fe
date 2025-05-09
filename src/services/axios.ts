import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import toast from '~/utils/functions/toast';
import PATH from '~/utils/path';

interface CustomAxiosResponse extends AxiosResponse {
  action?: string;
}

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 5000,
  withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = localStorage.getItem('token1');
    const refreshToken = localStorage.getItem('token2');

    if (accessToken && config.headers)
      config.headers.Authorization = `Bearer ${accessToken}`;

    if (refreshToken && config.headers)
      config.headers.Cookies = `${refreshToken}`;

    return config;
  },
  (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response: AxiosResponse): any => {
    const { accessToken, refreshToken } = response.data;

    if (accessToken) localStorage.setItem('token1', accessToken);
    if (refreshToken) localStorage.setItem('token2', refreshToken);

    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      (error.response as CustomAxiosResponse)?.data?.action ===
        'REFRESH_TOKEN' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response: any = await instance.post<{
          accessToken: string;
        }>('/auth/refresh');

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] =
            `Bearer ${response.accessToken}`;
        }

        return instance(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);

        localStorage.removeItem('token1');
        localStorage.removeItem('token2');

        window.location.href = PATH.USER_SIGN_IN;
        toast.warning('Phiên đăng nhập đã hết hạn. Xin vui lòng đăng nhập lại');

        return Promise.reject(refreshError);
      }
    }
    // else if (error?.code?.includes('ERR_NETWORK'))
    //   toast.error(error?.message || 'Có lỗi xảy ra');

    return Promise.reject(error);
  }
);

let isWarningShown = false;

const retryRequest = async <T>(
  config: InternalAxiosRequestConfig,
  retries = 3,
  delay = 3000
): Promise<T> => {
  try {
    const response = await instance(config);
    return response as T;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      !error.response &&
      error.code === 'ECONNABORTED'
    ) {
      if (retries === 1) {
        if (!isWarningShown) {
          toast.warning('Hết thời gian truy cập. Xin vui lòng thử lại.');
          isWarningShown = true;
        }
        return Promise.reject(error);
      }

      if (retries === 0) {
        isWarningShown = true;
        return Promise.reject(error);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));

      return retryRequest<T>(config, retries - 1, delay * 2);
    }

    return Promise.reject(error);
  }
};

const axiosApi = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    retryRequest<T>({
      ...config,
      method: 'get',
      url,
    } as InternalAxiosRequestConfig),
  post: <T = any>(url: string, data?: any, config?: any) =>
    retryRequest<T>({
      ...config,
      method: 'post',
      url,
      data,
    } as InternalAxiosRequestConfig),
  put: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ) =>
    retryRequest<T>({
      ...config,
      method: 'put',
      url,
      data,
    } as InternalAxiosRequestConfig),
  delete: <T = any>(url: string, config?: InternalAxiosRequestConfig) =>
    retryRequest<T>({
      ...config,
      method: 'delete',
      url,
    } as InternalAxiosRequestConfig),
  patch: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ) =>
    retryRequest<T>({
      ...config,
      method: 'patch',
      url,
      data,
    } as InternalAxiosRequestConfig),
};

export default axiosApi;
