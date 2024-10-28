import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/base"; // axios 대신 axiosInstance 가져오기

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessToken = async (code) => {
      try {
        console.log("Fetching access token with code:", code);

        const response = await axiosInstance.get(
          `/api/auth/kakao/callback?code=${code}`
        );

        const { token, nextStep } = response.data;

        if (token) {
          localStorage.setItem("token", token);
          console.log("Token stored in localStorage:", token);

          if (nextStep === "home") {
            navigate("/home");
          } else if (nextStep === "profile") {
            navigate("/profile");
          }
        } else {
          console.error("Token not found in response");
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    console.log("Authorization Code:", code); // code 값 확인

    if (code) {
      fetchAccessToken(code);
    } else {
      console.error("Authorization code not found in URL");
    }
  }, [navigate]);

  return <div>Loading…</div>;
};

export default CallbackPage;
