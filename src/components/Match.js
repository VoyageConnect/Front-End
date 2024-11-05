import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "./image/icon.png";

const STEPS = {
  INIT: "INIT",
  LOADING: "LOADING",
  CHATTING: "CHATTING",
};

const Match = () => {
  const [step, setStep] = useState(STEPS.INIT);
  const [showEndCompanionButton, setShowEndCompanionButton] = useState(false);
  const navigate = useNavigate();

  const startMatching = () => {
    setStep(STEPS.LOADING);
    setTimeout(() => {
      setStep(STEPS.CHATTING);
    }, 3000);
  };

  const handleEndCompanion = () => {
    setShowEndCompanionButton(false);
    navigate("/post/create");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#6a11cb] to-[#2575fc] relative">
      <img
        src={Icon}
        alt="설명"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="bg-white p-10 rounded-lg shadow-lg text-center w-1/3 z-10">
        <div className="flex items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 flex-grow">
            랜덤 매칭
          </h1>
          {showEndCompanionButton && (
            <button
              onClick={handleEndCompanion}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
              style={{ height: "45px", width: "60px" }}
            >
              동행 종료
            </button>
          )}
        </div>
        <p className="text-gray-600 mb-4">새로운 친구와 대화를 나눠 보세요!</p>
        {step === STEPS.INIT && (
          <button
            className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            onClick={startMatching}
          >
            랜덤 매칭 시작
          </button>
        )}
        {step === STEPS.LOADING && <LoadingScreen />}
        {step === STEPS.CHATTING && (
          <ChattingStep
            onShowEndButton={() => setShowEndCompanionButton(true)}
          />
        )}
      </div>
    </div>
  );
};

export default Match;

// 로딩 화면 컴포넌트
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1 }}
      className="mb-4"
    >
      <div className="w-12 h-12 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
    </motion.div>
    <p className="text-xl font-semibold text-gray-700">Loading ... 💬</p>
  </div>
);

const ChattingStep = ({ onShowEndButton }) => {
  const [isChatting, setIsChatting] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPopupVisible(true);
      setIsChatting(false);
    }, 5000);
  }, []);

  const handleContinueCompanion = () => {
    setPopupVisible(false);
    setIsChatting(true);
    onShowEndButton();
  };

  return (
    <div>
      <h2>채팅방</h2>
      <ChatRoom disableChat={!isChatting} />
      {popupVisible && <CompanyPopup onClose={handleContinueCompanion} />}
    </div>
  );
};

function ChatRoom({ disableChat }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { user: "me", message: "익명1님이 입장하셨습니다." },
    { user: "other", message: "익명2님이 입장하셨습니다." },
  ]);

  const onSendMessage = (message) => {
    if (message.trim()) {
      setMessages((prevMessages) => [...prevMessages, { user: "me", message }]);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSendMessage(input);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        maxWidth: "500px",
        margin: "auto",
        border: "1px solid #e0e0e0",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          flex: 1,
          padding: "10px",
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          backgroundColor: "#f5f5f7",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.user === "me" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: msg.user === "me" ? "#DCF8C6" : "#ffffff",
                color: "#000",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disableChat}
          placeholder="메시지를 입력하세요"
          style={{
            flex: 1,
            height: "45px",
            padding: "0 15px",
            borderRadius: "20px",
            border: "1px solid #e0e0e0",
            outline: "none",
            fontSize: "16px",
          }}
        />
        <button
          onClick={() => onSendMessage(input)}
          disabled={disableChat}
          style={{
            marginLeft: "10px",
            height: "45px",
            padding: "0 15px",
            borderRadius: "20px",
            backgroundColor: "#34b7f1",
            color: "#fff",
            border: "none",
            fontSize: "14px",
            cursor: "pointer",
            width: "60px",
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
}

function CompanyPopup({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        top: 0,
        left: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          minWidth: "400px",
          maxWidth: "500px",
        }}
      >
        <h3
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          동행을 하시겠습니까?
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          <button
            style={{ flex: 1, padding: "10px", fontSize: "1rem" }}
            onClick={onClose}
          >
            동행하기
          </button>
          <button
            style={{ flex: 1, padding: "10px", fontSize: "1rem" }}
            onClick={() => (window.location.href = "/home")}
          >
            그만하기
          </button>
        </div>
      </div>
    </div>
  );
}
