import axiosInstance from "./base"; // axios 대신 axiosInstance 가져오기

// 설문 제출 함수
export const submitSurvey = async (surveyData) => {
  try {
    const response = await axiosInstance.post("/api/survey", surveyData); // axiosInstance 사용
    return response.data;
  } catch (error) {
    console.error("Error submitting survey:", error);
    throw new Error("Failed to submit survey");
  }
};
