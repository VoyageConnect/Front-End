import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/base";

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        console.log("Token found in localStorage. Redirecting to /home...");
        navigate("/home");
        return true;
      }
      return false;
    };

    const fetchAccessToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        console.error("Authorization code not found in URL");
        return;
      }

      console.log("Fetching access token with code:", code);

      try {
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
          } else {
            navigate("/");
          }
        } else {
          console.error("Token not found in response");
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    if (!checkExistingToken()) {
      fetchAccessToken();
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-purple-500 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">LOADING...💬</h1>
      </div>
    </div>
  );
};

export default CallbackPage;
