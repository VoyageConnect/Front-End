import React, { useState } from "react";

function Profile() {
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [mbti, setMbti] = useState("");
  const [gender, setGender] = useState("");
  const [intro, setIntro] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 프로필 정보 저장 API 호출 (필요 시 추가)
    alert("프로필 저장 완료");
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
          {/* 추가 MBTI 옵션 */}
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
