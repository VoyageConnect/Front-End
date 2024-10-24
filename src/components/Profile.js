import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [mbti, setMbti] = useState("");
  const [gender, setGender] = useState("");
  const [intro, setIntro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // JWT 토큰 가져오기
      if (!token) {
        throw new Error("User not logged in");
      }

      // 백엔드로 프로필 등록 API 호출
      const response = await axios.post(
        "http://localhost:8080/api/users/me/profile",
        { nickname, age, mbti, gender, introduction: intro },
        {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰을 헤더에 포함
          },
        }
      );
      console.log("Profile saved successfully:", response.data);
      alert("프로필 저장 완료");

      // 프로필 등록 후 설문조사 페이지로 이동
      if (response.data.nextStep === "survey") {
        navigate("/survey");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("프로필 저장 중 오류 발생");
    }
  };

  return (
    <div className="container">
      <h1>Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Nickname"
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
        />
        <select value={mbti} onChange={(e) => setMbti(e.target.value)}>
          <option value="">Select MBTI</option>
          <option value="INTJ">INTJ</option>
          <option value="ENTJ">ENTJ</option>
          <option value="INFJ">INFJ</option>
        </select>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="text"
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="Self Introduction"
        />
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default Profile;
