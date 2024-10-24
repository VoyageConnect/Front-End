import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { registerProfile, getProfile } from "../api/profile";

function Profile() {
  // const [nickname, setNickname] = useState("");
  // const [age, setAge] = useState("");
  // const [mbti, setMbti] = useState("");
  // const [gender, setGender] = useState("");
  // const [intro, setIntro] = useState("");
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const isDisabled =
    !profile?.nickname ||
    !profile?.age ||
    !profile?.mbti ||
    !profile?.gender ||
    !profile?.introduction;

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    console.log("handleSubmit: ", profile);
    e.preventDefault();
    try {
      // 백엔드로 프로필 등록 API 호출
      const data = await registerProfile(profile);

      console.log("Profile saved successfully:", data);
      alert("프로필 저장 완료");

      // 프로필 등록 후 설문조사 페이지로 이동
      if (data.nextStep === "survey") {
        navigate("/survey");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("프로필 저장 중 오류 발생");
    }
  };

  const onChangeProfile = (key, value) => {
    setProfile({ ...profile, [key]: value });
  };

  return (
    <div className="container">
      <h1>Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>닉네임</label>
          <input
            type="text"
            value={profile?.nickname}
            onChange={(e) => onChangeProfile("nickname", e.target.value)}
            placeholder="Nickname"
          />
        </div>
        <div>
          <label>나이</label>
          <input
            type="number"
            value={profile?.age}
            onChange={(e) => onChangeProfile("age", e.target.value)}
            placeholder="Age"
          />
        </div>
        <div>
          <label>MBTI</label>
          <select
            value={profile?.mbti}
            onChange={(e) => onChangeProfile("mbti", e.target.value)}
          >
            <option value="">Select MBTI</option>
            <option value="INTJ">INTJ</option>
            <option value="ENTJ">ENTJ</option>
            <option value="INFJ">INFJ</option>
          </select>
        </div>
        <div>
          <label>성별</label>
          <select
            value={profile?.gender}
            onChange={(e) => onChangeProfile("gender", e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label>자기소개</label>
          <input
            type="text"
            value={profile?.introduction}
            onChange={(e) => onChangeProfile("introduction", e.target.value)}
            placeholder="Self Introduction"
          />
        </div>
        <button type="submit" disabled={isDisabled}>
          등록하기
        </button>
      </form>
    </div>
  );
}

export default Profile;
