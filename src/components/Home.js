import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleShowRecommendations = () => {
    navigate("/rectab");
  };

  const handleMatchButtonClick = () => {
    // 매칭 페이지로 이동하는 코드 (예: /match 경로로 이동)
    navigate("/match");
  };

  return (
    <div className="container">
      <h1>VoyageConnect</h1>

      {/* 매칭 버튼 */}
      <button onClick={handleMatchButtonClick}>매칭하기</button>

      {/* 추천 장소 보기 버튼 */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleShowRecommendations}>추천 장소</button>
      </div>
    </div>
  );
};

export default Home;
