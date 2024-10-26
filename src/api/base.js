import axios from "axios";

/**
 * api를 사용할 때, 해당 instance를 사용해주세요.
 * 자동으로 api를 호출 할 때 token을 header에 넣어서 보내는 코드가 작성되어있습니다.
 * 궁금하시다면 구글에 axios interceptor 검색해보세요.
 */
const axiosInstance = axios.create({
  baseURL: "http://3.34.182.245:8080",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // JWT 토큰 가져오기

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
