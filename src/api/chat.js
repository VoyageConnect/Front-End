import axiosInstance from "./base"; // 기존 설정된 Axios 인스턴스 가져오기

// 파트너 ID 전달 함수
export const sendPartnerId = async (userId, partnerId) => {
  try {
    const response = await axiosInstance.post("/chat/partner", {
      user_id: userId,
      partner_id: partnerId,
    });
    return response.data;
  } catch (error) {
    console.error("파트너 ID 전달 오류:", error);
    throw error;
  }
};
