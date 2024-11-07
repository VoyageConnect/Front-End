import axiosInstance from "./base"; // axiosInstance 가져오기

// 특정 지역의 피드를 가져오는 함수
export const fetchFeeds = async (region) => {
  try {
    const response = await axiosInstance.get(`/api/sns/posts`, {
      params: { location: region },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching feeds:", error);
    throw new Error("피드를 불러오는 중 오류가 발생했습니다.");
  }
};
