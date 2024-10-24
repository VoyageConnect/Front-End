import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessToken = async (code) => {
      try {
        console.log("Fetching access token with code:", code); // 인가 코드 로그 출력

        // 백엔드로 인가 코드를 전달하여 JWT 토큰 및 nextStep 값을 받아옴
        const response = await axios.get(
          `http://localhost:8080/api/auth/kakao/callback?code=${code}`
        );
        console.log("Response received from backend:", response.data);

        const { token, nextStep } = response.data; // 응답에서 JWT 토큰과 nextStep을 받아옴

        // 응답에 따라 처리
        if (token) {
          // JWT 토큰을 localStorage에 저장
          localStorage.setItem("token", token);
          console.log("Token stored in localStorage:", token);

          // nextStep에 따라 적절한 페이지로 리다이렉트
          if (nextStep === "home") {
            navigate("/home"); // 홈 화면으로 이동
          } else if (nextStep === "profile") {
            navigate("/profile"); // 프로필 작성 페이지로 이동
          }
        } else {
          console.error("Token not found in response");
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    // URL에서 인가 코드를 가져와서 백엔드로 전달
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      fetchAccessToken(code); // 인가 코드가 있으면 백엔드로 전달하여 처리
    } else {
      console.error("Authorization code not found in URL");
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default CallbackPage;
