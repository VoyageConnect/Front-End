import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPartnerId } from "../api/chat";

const Chat = ({ userId, partnerId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [ws, setWs] = useState(null); // 웹소켓 인스턴스
  const [isChatting, setIsChatting] = useState(false); // 초기 상태는 false로 설정
  const [popupVisible, setPopupVisible] = useState(false);
  const [score, setScore] = useState(null); // 매칭된 score를 저장할 상태
  const navigate = useNavigate();

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const response = await sendPartnerId(userId, partnerId);

        if (response.status === "OK") {
          setScore(response.score); // score를 설정
          const socket = new WebSocket(`ws://localhost:8080/chat/${userId}`);
          setWs(socket);

          socket.onopen = () => {
            console.log("웹소켓 연결 성공");
          };

          socket.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          };

          socket.onclose = () => {
            console.log("웹소켓 연결 종료");
          };

          socket.onerror = (error) => {
            console.error("웹소켓 오류:", error);
          };
        } else {
          console.error("백엔드에서 OK 응답을 받지 못했습니다.");
          navigate("/match"); // OK 응답이 아닌 경우 매칭 페이지로 리다이렉트
        }
      } catch (error) {
        console.error("채팅 초기화 오류:", error);
      }
    };

    initializeChat();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [userId, partnerId, navigate]);

  // 메시지 전송 함수
  const sendMessage = () => {
    if (ws && inputMessage.trim()) {
      const messageData = {
        sender_id: userId,
        message: inputMessage,
      };
      ws.send(JSON.stringify(messageData));
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setInputMessage("");
    }
  };

  // Enter 키로 메시지 전송
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // "동행하기" 버튼을 눌렀을 때 호출되는 함수
  const handleContinueCompanion = () => {
    setPopupVisible(false);
    setIsChatting(true); // "동행 종료" 버튼이 보이도록 설정
  };

  // "동행 종료" 버튼을 눌렀을 때 호출되는 함수
  const handleEndCompanion = () => {
    navigate("/post/create"); // Post.js로 이동
  };

  useEffect(() => {
    // 5초 후에 팝업 표시
    setTimeout(() => {
      setPopupVisible(true);
    }, 5000);
  }, []);

  return (
    <div className="chat-container">
      <h2>채팅</h2>
      {score && <p>매칭 점수: {score}</p>} {/* score 표시 */}
      <ChatRoom
        messages={messages}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        sendMessage={sendMessage}
        handleKeyPress={handleKeyPress}
        disableChat={!isChatting}
        userId={userId} // userId를 props로 전달
      />
      {popupVisible && <CompanyPopup onClose={handleContinueCompanion} />}
      {isChatting && (
        <button
          className="end-companion-btn"
          onClick={handleEndCompanion}
          style={{
            marginTop: "10px",
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "#ff4d4f",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          동행 종료
        </button>
      )}
    </div>
  );
};

export default Chat;

// ChatRoom 컴포넌트
const ChatRoom = ({
  messages,
  inputMessage,
  setInputMessage,
  sendMessage,
  handleKeyPress, // Enter 키 핸들러 추가
  disableChat,
  userId,
}) => {
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
              justifyContent:
                msg.sender_id === userId ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor:
                  msg.sender_id === userId ? "#DCF8C6" : "#ffffff",
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
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress} // Enter 키 핸들러 추가
          placeholder="메시지를 입력하세요"
          disabled={disableChat}
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
          onClick={sendMessage}
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
};

// CompanyPopup 컴포넌트
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
