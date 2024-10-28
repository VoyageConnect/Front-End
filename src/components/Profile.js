import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    age: 0,
    gender: "",
    profileImage: null,
    mbti: "",
    introduction: "",
    locationCountry: null,
    locationRegion: null,
  });

  const isDisabled =
    !profile.age || !profile.mbti || !profile.gender || !profile.introduction;

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token"); // 저장된 액세스 토큰 가져오기
      console.log("Access Token:", token);
      if (!token) {
        throw new Error("No access token found. Make sure you are logged in.");
      }

      const response = await axios.get(
        "http://localhost:8080/api/users/me/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No access token found. Make sure you are logged in.");
      }

      const requestData = new FormData();
      Object.keys(profile).forEach((key) => {
        requestData.append(key, profile[key]);
      });

      const response = await axios.post(
        "http://localhost:8080/api/users/me/profile",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Profile saved successfully:", response.data);
      alert("프로필 저장 완료");

      if (response.data.nextStep === "survey") {
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
          <label>나이</label>
          <input
            type="number"
            value={profile.age}
            onChange={(e) => onChangeProfile("age", e.target.value)}
            placeholder="Age"
          />
        </div>
        <div>
          <label>MBTI</label>
          <select
            value={profile.mbti}
            onChange={(e) => onChangeProfile("mbti", e.target.value)}
          >
            <option value="">Select MBTI</option>
            <option value="INTJ">INTJ</option>
            <option value="ENTJ">ENTJ</option>
            <option value="INFJ">INFJ</option>
            <option value="ENFJ">ENFJ</option>
            <option value="INTP">INTP</option>
            <option value="ENTP">ENTP</option>
            <option value="INFP">INFP</option>
            <option value="ENFP">ENFP</option>
            <option value="ISTJ">ISTJ</option>
            <option value="ESTJ">ESTJ</option>
            <option value="ISFJ">ISFJ</option>
            <option value="ESFJ">ESFJ</option>
            <option value="ISTP">ISTP</option>
            <option value="ESTP">ESTP</option>
            <option value="ISFP">ISFP</option>
            <option value="ESFP">ESFP</option>
          </select>
        </div>
        <div>
          <label>성별</label>
          <select
            value={profile.gender}
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
            value={profile.introduction}
            onChange={(e) => onChangeProfile("introduction", e.target.value)}
            placeholder="Self Introduction"
          />
        </div>
        <div>
          <label>프로필 이미지</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                onChangeProfile("profileImage", file);
              }
            }}
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
