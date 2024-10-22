import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessToken = async (code) => {
      try {
        console.log("Fetching access token with code:", code); // 로그 추가

        // 백엔드로 인가 코드를 전달하여 액세스 토큰을 받아옵니다
        const response = await axios.get(
          `http://localhost:8080/api/auth/kakao/callback?code=${code}`
        );
        console.log("Response received from backend:", response.data); // 응답 데이터 확인을 위한 로그 추가

        const accessToken = response.data;

        // 토큰 저장 및 리다이렉트 처리
        if (accessToken) {
          localStorage.setItem("token", accessToken);
          console.log("Navigating to /home");
          navigate("/home");
        } else {
          console.error("Access token not found in response");
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      fetchAccessToken(code);
    } else {
      console.error("Authorization code not found in URL");
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default CallbackPage;
