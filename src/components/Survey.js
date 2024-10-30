import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitSurvey } from "../api/survey";

const AgeCategory = {
  TWENTIES: "TWENTIES",
  THIRTIES: "THIRTIES",
  FORTIES: "FORTIES",
  FIFTIES: "FIFTIES",
  SIXTIES_PLUS: "SIXTIES_PLUS",
};

const ageCategoryMapping = {
  1: AgeCategory.TWENTIES,
  2: AgeCategory.THIRTIES,
  3: AgeCategory.FORTIES,
  4: AgeCategory.FIFTIES,
  5: AgeCategory.SIXTIES_PLUS,
};

function Survey() {
  const navigate = useNavigate();
  const [step, setStep] = useState("1-page");
  const [request, setRequest] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token")); // 토큰을 상태로 관리

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
      console.log("Updated Access Token:", newToken);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleNext = async (step, data) => {
    const newRequest = { ...request, ...data };
    console.log("newRequest: ", newRequest);
    setRequest(newRequest);
    if (step === "final") {
      try {
        await submitSurvey(newRequest, token);
        navigate("/home");
      } catch (error) {
        console.error("Error submitting survey:", error);
      }
    } else {
      setStep(step);
    }
  };

  return (
    <div
      style={{ padding: "24px", backgroundColor: "#F9FAFB", margin: "24px" }}
    >
      {step === "1-page" && (
        <Survey1Page onNext={(data) => handleNext("2-page", data)} />
      )}
      {step === "2-page" && (
        <Survey2Page onNext={(data) => handleNext("final", data)} />
      )}
    </div>
  );
}

export default Survey;

function Survey1Page({ onNext }) {
  const [selected, setSelected] = useState({
    preferredGender: null,
    preferredAge: null,
  });

  const isDisabled =
    selected.preferredGender === null || selected.preferredAge === null;

  const handleSelected = (key, value) => {
    setSelected({ ...selected, [key]: value });
  };

  const handleNext = () => {
    const updatedData = {
      ...selected,
      preferredAge: ageCategoryMapping[selected.preferredAge], // 숫자 값에서 Enum 값으로 변환
    };
    onNext(updatedData);
  };

  const buttonStyle = (isSelected) => ({
    backgroundColor: isSelected ? "#ddd" : "#FFFFFF",
  });

  return (
    <div>
      <h1>설문조사</h1>
      <div>
        <p>선호하는 동행자 성별</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            style={buttonStyle(selected.preferredGender === "MALE")}
            onClick={() => handleSelected("preferredGender", "MALE")}
          >
            남성
          </button>
          <button
            style={buttonStyle(selected.preferredGender === "FEMALE")}
            onClick={() => handleSelected("preferredGender", "FEMALE")}
          >
            여성
          </button>
          <button
            style={buttonStyle(selected.preferredGender === "ANY")}
            onClick={() => handleSelected("preferredGender", "ANY")}
          >
            상관없음
          </button>
        </div>
      </div>
      <div>
        <p>선호하는 동행자 나이대</p>
        <div>
          <RangeSelector
            options={[
              { name: "20대", value: 1 },
              { name: "30대", value: 2 },
              { name: "40대", value: 3 },
              { name: "50대", value: 4 },
              { name: "60대 이상", value: 5 },
            ]}
            onChange={(value) => handleSelected("preferredAge", value)}
            name="preferredAge"
          />
        </div>
      </div>
      <button onClick={handleNext} disabled={isDisabled}>
        다음 페이지
      </button>
    </div>
  );
}

const surveyItemKeys = [
  { key: "food", name: "음식" },
  { key: "shopping", name: "쇼핑" },
  { key: "natureTourism", name: "자연관광" },
  { key: "culturalTourism", name: "문화관광" },
  { key: "historicalTourism", name: "역사관광" },
  { key: "leisureSports", name: "레저/스포츠" },
];

const surveyItemOptions = [
  { name: "1", value: 1 },
  { name: "2", value: 2 },
  { name: "3", value: 3 },
  { name: "4", value: 4 },
  { name: "5", value: 5 },
];

function Survey2Page({ onNext }) {
  const [selected, setSelected] = useState(
    surveyItemKeys.reduce((acc, item) => {
      acc[item.key] = 1; // 초기값을 1로 설정하여 모든 항목이 payload에 포함되도록 설정
      return acc;
    }, {})
  );

  const isDisabled = Object.values(selected).some((value) => !value);

  const handleSelected = (key, value) => {
    const updatedSelected = { ...selected, [key]: value };
    console.log("Updated selected:", updatedSelected);
    setSelected(updatedSelected);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ width: "121px", height: "20px" }}></div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flex: 1,
            padding: "0 26px",
          }}
        >
          {surveyItemOptions.map((item) => (
            <span key={item.value}>{item.value}</span>
          ))}
        </div>
      </div>
      {surveyItemKeys.map((item) => (
        <div
          key={item.key}
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <div
            style={{
              border: "1px solid black",
              height: "36px",
              lineHeight: "36px",
              padding: "0 10px",
              borderRadius: "10px",
              minWidth: "100px",
              textAlign: "center",
            }}
          >
            {item.name}
          </div>
          <RangeSelector
            options={surveyItemOptions}
            onChange={(value) => handleSelected(item.key, value)}
            name={item.key}
            isNoLabel
          />
        </div>
      ))}
      <button
        onClick={() => !isDisabled && onNext(selected)}
        disabled={isDisabled}
      >
        설문조사 완료
      </button>
    </div>
  );
}

const RangeSelector = ({
  options,
  onChange,
  defaultValue,
  name = "",
  isNoLabel = false,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleClick = (value) => {
    setSelectedValue(value);
    onChange?.(value, name);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "768px",
        margin: "0 auto",
        padding: "16px",
      }}
    >
      <div style={{ position: "relative", height: "fit-content" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            height: "2px",
            backgroundColor: "#E5E7EB",
            width: "100%",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {options.map((option, index) => (
            <div
              key={`${name}-${index}`}
              onClick={() => handleClick(option.value)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              {!isNoLabel && (
                <div
                  style={{
                    marginBottom: "8px",
                    fontSize: "14px",
                    color: "#4B5563",
                    position: "absolute",
                    top: "-20px",
                    width: "fit-content",
                    whiteSpace: "nowrap",
                  }}
                >
                  {option.name}
                </div>
              )}
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor:
                    selectedValue === option.value ? "#3B82F6" : "#FFFFFF",
                  border:
                    selectedValue === option.value
                      ? "2px solid transparent"
                      : "2px solid #D1D5DB",
                  boxShadow:
                    selectedValue === option.value
                      ? "0 0 0 4px #BFDBFE"
                      : "none",
                  transition: "all 0.2s ease",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
