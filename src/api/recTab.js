import axiosInstance from "./base";

// 위치 정보를 보내고 추천 장소 정보를 가져오는 함수
export const getRecommendedLocations = async (userId, latitude, longitude) => {
  try {
    const response = await axiosInstance.post("/api/ai/process-location", {
      user_id: userId,
      latitude: latitude,
      longitude: longitude,
    });

    // 응답 데이터에서 추천 장소 정보 추출
    if (response.data && response.data.results) {
      return response.data.results.map((location) => ({
        name: location.name || "Unknown",
        mapId: location.mapId || "N/A",
        description: location.description || "No description available",
        latitude: location.latitude,
        longitude: location.longitude,
      }));
    } else {
      throw new Error("Unexpected response format from server");
    }
  } catch (error) {
    console.error("Error fetching recommended locations:", error);
    throw new Error("Failed to fetch recommended locations.");
  }
};
