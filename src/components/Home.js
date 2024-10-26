import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleShowRecommendations = () => {
    navigate("/rectab");
  };

  return (
    <div className="container">
      <h1>VoyageConnect</h1>
      <p>This is the main page after logging in.</p>

      <h2>Welcome to the Home Page!</h2>
      <p>Here is some welcome message for the user.</p>

      {/* 추천 장소 보기 버튼 */}
      <button onClick={handleShowRecommendations}>
        Show Recommended Locations
      </button>
    </div>
  );
};

export default Home;
