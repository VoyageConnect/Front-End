import axios from "axios";

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // AI 서버 주소
  headers: {
    "Content-Type": "application/json",
  },
});

// 매칭 요청 함수
export const postMatch = async (latitude, longitude, retry, userId) => {
  try {
    const response = await axiosInstance.post("/match", {
      latitude,
      longitude,
      retry,
      user_id: userId, // user_id를 요청에 포함
    });

    return response.data; // 서버의 응답 데이터 반환
  } catch (error) {
    console.error("매칭 요청 오류:", error);
    throw error; // 에러 발생 시 에러 던지기
  }
};
