import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitSurvey } from "../api/survey";

function Survey() {
  const navigate = useNavigate();
  const [step, setStep] = useState("1-page");

  const [request, setRequest] = useState({});

  const handleNext = async (step, data) => {
    const newRequest = { ...request, ...data };
    console.log("newRequest: ", newRequest);
    setRequest(newRequest);
    if (step === "final") {
      try {
        await submitSurvey(newRequest);
        navigate("/home");
      } catch (error) {
        console.error(error);
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
            style={buttonStyle(selected.preferredGender === "male")}
            onClick={() => handleSelected("preferredGender", "male")}
          >
            남성
          </button>
          <button
            style={buttonStyle(selected.preferredGender === "female")}
            onClick={() => handleSelected("preferredGender", "female")}
          >
            여성
          </button>
          <button
            style={buttonStyle(selected.preferredGender === "any")}
            onClick={() => handleSelected("preferredGender", "any")}
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
      <button
        onClick={() => !isDisabled && onNext(selected)}
        disabled={isDisabled}
      >
        다음 페이지
      </button>
    </div>
  );
}

const surveyItemKeys = [
  {
    key: "food",
    name: "음식",
  },
  {
    key: "shopping",
    name: "쇼핑",
  },
  {
    key: "natureTourism",
    name: "자연관광",
  },
  {
    key: "cultureTourism",
    name: "문화관광",
  },
  {
    key: "historyTourism",
    name: "역사관광",
  },
  {
    key: "leisureSports",
    name: "레저/스포츠",
  },
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
      acc[item.key] = null;
      return acc;
    }, {})
  );

  const isDisabled = Object.values(selected).some((value) => !value);

  const handleSelected = (key, value) => {
    setSelected({ ...selected, [key]: value });
  };

  const itemLabelStyle = {
    border: "1px solid black",
    height: "36px",
    lineHeight: "36px",
    padding: "0 10px",
    borderRadius: "10px",
    minWidth: "100px",
    textAlign: "center",
  };

  const itemWrapperStyle = {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  };

  const surveyOptionLabelStyle = {
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
    padding: "0 26px",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ width: "121px", height: "20px" }}></div>
        <div style={surveyOptionLabelStyle}>
          {surveyItemOptions.map((item) => (
            <span>{item.value}</span>
          ))}
        </div>
      </div>
      {surveyItemKeys.map((item) => (
        <div style={itemWrapperStyle}>
          <div style={itemLabelStyle}>{item.name}</div>

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
  name = "", // 식별을 위한 이름 prop 추가
  isNoLabel = false,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleClick = (value) => {
    setSelectedValue(value);
    onChange?.(value, name); // name도 함께 전달하여 어떤 selector가 변경됐는지 식별
  };

  const styles = {
    container: {
      width: "100%",
      maxWidth: "768px",
      margin: "0 auto",
      padding: "16px",
    },
    wrapper: {
      position: "relative",
      height: "fit-content",
    },
    backgroundLine: {
      position: "absolute",
      left: 0,
      top: "50%",
      transform: "translateY(-50%)",
      height: "2px",
      backgroundColor: "#E5E7EB",
      width: "100%",
    },
    stepsContainer: {
      position: "relative",
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
    },
    stepWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
    },
    label: {
      marginBottom: "8px",
      fontSize: "14px",
      color: "#4B5563",
      position: "absolute",
      top: "-20px",
      width: "fit-content",
      whiteSpace: "nowrap",
    },
    circle: (isSelected) => ({
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      backgroundColor: isSelected ? "#3B82F6" : "#FFFFFF",
      border: isSelected ? "2px solid transparent" : "2px solid #D1D5DB",
      boxShadow: isSelected ? "0 0 0 4px #BFDBFE" : "none",
      transition: "all 0.2s ease",
    }),
  };

  // options가 없는 경우 에러 방지를 위한 early return
  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.backgroundLine} />
        <div style={styles.stepsContainer}>
          {options.map((option, index) => (
            <div
              key={`${name}-${index}`}
              onClick={() => handleClick(option.value)}
              style={styles.stepWrapper}
            >
              {!isNoLabel && <div style={styles.label}>{option.name}</div>}
              <div style={styles.circle(selectedValue === option.value)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
