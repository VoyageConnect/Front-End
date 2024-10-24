import axiosInstance from "./base";

// 설문 제출
export const submitSurvey = async (survey) => {
  const response = await axiosInstance.post("/api/survey/submit", survey);
  return response.data;
};
