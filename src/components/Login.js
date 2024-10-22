import React, { useEffect } from "react";

const LoginPage = () => {
  useEffect(() => {
    // Kakao SDK 초기화
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init("be95001b9262be92ca9f7558d83cf1f0");
    }
  }, []);

  const handleKakaoLogin = () => {
    // 로그인 버튼 클릭 시 Kakao 인증 페이지로 이동
    window.Kakao.Auth.authorize({
      redirectUri: "http://localhost:8080/callback", // 백엔드와 동일한 Redirect URI
    });
  };

  return (
    <div>
      <h2>Login with Kakao</h2>
      <button onClick={handleKakaoLogin}>Login with Kakao</button>
    </div>
  );
};

export default LoginPage;
