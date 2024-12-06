import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 가져오기
import { createPost } from "../api/post"; // API 파일에서 함수 불러오기

const Post = () => {
  const [provinceName, setProvinceName] = useState("");
  const [cityName, setCityName] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // 미리보기 URL 상태 추가
  const navigate = useNavigate(); // useNavigate 인스턴스 생성

  // 사용자의 현재 위치를 가져오고, Google Maps API를 통해 주소 변환
  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=ko&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;

            fetch(url)
              .then((response) => response.json())
              .then((data) => {
                if (data.status === "OK") {
                  const addressComponents = data.results[0].address_components;
                  let province = null;
                  let city = null;

                  for (const component of addressComponents) {
                    if (
                      component.types.includes("administrative_area_level_1")
                    ) {
                      province = component.long_name;
                    } else if (component.types.includes("locality")) {
                      city = component.long_name;
                    } else if (
                      component.types.includes("administrative_area_level_2") &&
                      !city
                    ) {
                      city = component.long_name;
                    } else if (
                      component.types.includes("sublocality_level_1") &&
                      !city
                    ) {
                      city = component.long_name;
                    }
                  }

                  if (province && city) {
                    setProvinceName(province);
                    setCityName(city);
                  }
                }
              })
              .catch(() => {
                // 위치 데이터를 가져오는 중 오류가 발생했을 때 아무 동작도 하지 않음
              });
          },
          () => {
            // 위치를 가져오는 데 실패했을 때 아무 동작도 하지 않음
          }
        );
      }
    };

    fetchLocation();
  }, []);

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile)); // 선택한 파일의 URL 생성하여 미리보기 설정
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!provinceName || !cityName || !file) {
      return;
    }

    try {
      const response = await createPost(provinceName, cityName, file); // API 파일의 createPost 호출
      console.log("게시글 등록 성공:", response);
      navigate("/home"); // 성공 시 Home 페이지로 이동
    } catch (error) {
      console.error("게시글 등록 실패:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">게시글 등록</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">현재 위치</label>
          <p className="text-gray-600">
            {provinceName && cityName
              ? `${provinceName} ${cityName}`
              : "위치 정보를 가져오는 중입니다..."}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">사진 업로드</label>
          <input type="file" onChange={handleFileChange} />
          {/* 미리보기 이미지 */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="미리보기"
              className="mt-4 w-full h-64 object-cover rounded-lg shadow-md"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          게시글 등록
        </button>
      </form>
    </div>
  );
};

export default Post;
