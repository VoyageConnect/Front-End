import axiosInstance from "./base";

/**
 * age
 * gender
 * profileImage
 * mbti
 * introduction
 * locationCountry
 * locationRegion
 */

// 사용자 프로필 조회
export const getProfile = async () => {
  const token = localStorage.getItem("token"); // JWT 토큰 가져오기

  const response = await axiosInstance.get(
    `/api/users/me/profile?userId=${token}`
  );
  return response.data;
};

// 사용자 프로필 등록
// response

export const registerProfile = async (request) => {
  const token = localStorage.getItem("token"); // JWT 토큰 가져오기
  const response = await axiosInstance.post(
    `/api/users/me/profile?userId=${token}`,
    request
  );
  return response.data;
};
