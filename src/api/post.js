import axiosInstance from "./base"; // axiosInstance 가져오기

// 게시물 생성 API 함수
export const createPost = async (provinceName, cityName, file) => {
  try {
    // FormData 객체 생성
    const formData = new FormData();
    formData.append("provinceName", provinceName);
    formData.append("cityName", cityName);
    formData.append("file", file);

    // POST 요청 전송
    const response = await axiosInstance.post("/api/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; // 서버 응답 데이터 반환
  } catch (error) {
    console.error("Error creating post:", error);
    throw error; // 오류 발생 시 에러를 throw
  }
};
