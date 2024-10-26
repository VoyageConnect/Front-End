import axios from "axios";

// URL에서 인가 코드를 추출하는 함수
export const getKakaoCodeFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
};

// 카카오 로그인 URL을 가져오는 함수
export const getKakaoLoginUrl = async () => {
  try {
    // 백엔드의 /api/login 엔드포인트로 요청을 보냄
    const response = await axios.get("http://3.34.182.245:8080/api/login");
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
    const response = await axios.get(`/api/auth/kakao/callback?code=${code}`);
    return response.data; // 사용자 프로필 데이터를 반환
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
};
