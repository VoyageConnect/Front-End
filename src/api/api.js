import axios from "axios";

// .env 파일에서 API URL 가져오기
const BASE_URL = process.env.REACT_APP_API_URL;

// URL에서 인가 코드를 추출하는 함수
export const getKakaoCodeFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
};

// 카카오 로그인 URL을 가져오는 함수
export const getKakaoLoginUrl = async () => {
  try {
    // 백엔드의 /api/login 엔드포인트로 요청을 보냄
    const response = await axios.get(`${BASE_URL}/api/login`); // api url 불러옴
    return response.data.url; // 백엔드에서 반환한 Kakao 로그인 URL 반환
  } catch (error) {
    console.error("Error fetching Kakao login URL:", error);
    throw new Error("Failed to fetch Kakao login URL");
  }
};

// 사용자 프로필 가져오는 함수
export const getUserProfile = async () => {
  const code = getKakaoCodeFromUrl();
  if (!code) {
    throw new Error("No authorization code found in URL");
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/api/auth/kakao/callback?code=${code}`
    ); // api url
    return response.data; // 사용자 프로필 데이터를 반환
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
};
