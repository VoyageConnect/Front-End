import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMatchMessages, sendMessage } from "../api/match";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // WebSocket 서버 URL (예시)

const STEPS = {
  INIT: "INIT",
  CHATTING: "CHATTING",
};

const Match = () => {
  const [step, setStep] = useState("INIT");

  const user1 = "user1";
  const user2 = "user2";

  return (
    <div className="container">
      {step === STEPS.INIT && (
        <InitStep onNextStep={() => setStep(STEPS.CHATTING)} />
      )}
      {step === STEPS.CHATTING && <ChattingStep user1={user1} user2={user2} />}
    </div>
  );
};

export default Match;

// 일정 시간 뒤에 특정 동작 실행하는 커스텀 hooks
const useDelayAction = () => {
  const delayAction = ({ action, delay: delayTime = 3000 }) => {
    const timer = setTimeout(action, delayTime);
    return () => clearTimeout(timer);
  };

  return { delayAction };
};

function InitStep({ onNextStep }) {
  const [isLoading, setIsLoading] = useState(false);
  const { delayAction } = useDelayAction();

  const onStartMatching = () => {
    // 이후에 API가 추가된다면, 해당 API 호출 시점에 매칭 시작 표시
    // API response 를 받아오면 매칭 완료, onNextStep 실행하면 됨.
    setIsLoading(true); // 이 시점부터 매칭 중임을 표시
    delayAction({ action: onNextStep, delay: 3000 }); // 3초 뒤에 매칭 시작
  };

  return (
    <div>
      {!isLoading && <button onClick={onStartMatching}>랜덤 매칭 시작</button>}
      {isLoading && <div>매칭중...</div>}
    </div>
  );
}

const COMPANY_POPUP_DELAY = 5000; // 몇초뒤에 팝업 표시할건지

function ChattingStep({ user1, user2 }) {
  console.log("user1, user2 : ", user1, user2);

  const [isChatting, setIsChatting] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);

  const { delayAction } = useDelayAction();

  // 팝업 표시, 채팅 비활성화
  const onPopupVisible = () => {
    setPopupVisible(true);
    setIsChatting(false);
  };

  // 팝업 닫기, 채팅 활성화
  const onPopupClose = () => {
    setPopupVisible(false);
    setIsChatting(true);
  };

  useEffect(() => {
    // 일정 시간 뒤에 팝업 표시
    delayAction({
      action: onPopupVisible,
      delay: COMPANY_POPUP_DELAY, // 5초 뒤에 팝업 표시
    });
  }, []);

  return (
    <div>
      <h2>채팅방</h2>
      <ChatRoom disableChat={!isChatting} />
      {popupVisible && <CompanyPopup onClose={onPopupClose} />}
    </div>
  );
}

// 채팅창
function ChatRoom({ disableChat }) {
  const [input, setInput] = useState("");
  // 채팅 메시지를 API에서 불러오려면 해당 값을 init하면ㄷ 됨.
  const [messages, setMessages] = useState([]);

  // 내가 보낸 메시지
  const onSendMessage = (message) => {
    try {
      // API call 필요
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          user: "me",
          message,
        },
      ]);
      setInput("");
    } catch (error) {}
  };

  // 상대방이 보낸 메시지
  const onReceiveMessage = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        user: "other",
        message,
      },
    ]);
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.user} : {msg.message}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disableChat}
        />
        <button onClick={() => onSendMessage(input)}>전송</button>
      </div>
    </div>
  );
}

// 일정 시간 뒤에 나타나는 동행하기 팝업창
function CompanyPopup({ onClose }) {
  const navigate = useNavigate();

  // 동행하기 버튼 클릭 시 팝업 끄기 및 채팅 활성화
  const handleContinue = () => {
    onClose();
  };

  // 그만하기 버튼 클릭 시 홈으로 돌아가기
  const handleQuit = () => {
    navigate("/home");
  };

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
        right: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          minWidth: "300px",
        }}
      >
        <h3>동행을 하시겠습니까?</h3>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={handleContinue}>동행하기</button>
          <button onClick={handleQuit}>그만하기</button>
        </div>
      </div>
    </div>
  );
}
