import axiosInstance from "./base";

// JWT 토큰을 파싱하는 함수
export const parseJwt = (token) => {
  try {
    // 토큰을 '.'으로 분리하고, 두 번째 파트(payload)를 Base64 URL 디코딩
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload); // payload를 JSON으로 파싱하여 반환
  } catch (error) {
    console.error("Invalid JWT token", error);
    return null;
  }
};

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
