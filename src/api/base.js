import axios from "axios";

// 기본 URL 및 Axios 인스턴스 설정
const axiosInstance = axios.create({
  baseURL: "http://3.34.182.245:8080", // API 서버 URL 설정
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 시 JWT 토큰 자동 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken"); // 토큰 키를 'jwtToken'으로 맞춤
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // 요청 중 오류 발생 시 처리
  }
);

export default axiosInstance;
