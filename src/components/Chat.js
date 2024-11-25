import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { initializeChat, sendMessage, disconnect } from "../api/chat";

const Chat = ({ userId, partnerId, chatRoomId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const navigate = useNavigate();

  // WebSocket 연결 초기화
  useEffect(() => {
    const onMessage = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const onError = (error) => {
      console.error("WebSocket error:", error);
      navigate("/match"); // 에러 발생 시 매칭 페이지로 이동
    };

    initializeChat(userId, partnerId, onMessage, onError);

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      disconnect();
    };
  }, [userId, partnerId, navigate]);

  // 메시지 전송 핸들러
  const handleSendMessage = useCallback(() => {
    if (inputMessage.trim()) {
      const messageData = {
        chatRoomId,
        senderId: userId,
        content: inputMessage,
      };

      sendMessage(messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setInputMessage("");
    }
  }, [inputMessage, userId, chatRoomId]);

  // Enter 키로 메시지 전송
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  // "동행하기" 버튼 핸들러
  const handleContinueCompanion = () => {
    setPopupVisible(false);
    setIsChatting(true);
  };

  // "동행 종료" 버튼 핸들러
  const handleEndCompanion = () => {
    navigate("/post/create");
  };

  // 팝업 5초 후 자동 표시
  useEffect(() => {
    const popupTimer = setTimeout(() => setPopupVisible(true), 5000);
    return () => clearTimeout(popupTimer);
  }, []);

  return (
    <div className="chat-container" style={styles.container}>
      <h2 style={styles.header}>채팅</h2>
      <ChatRoom
        messages={messages}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        sendMessage={handleSendMessage}
        handleKeyPress={handleKeyPress}
        disableChat={!isChatting}
        userId={userId}
      />
      {popupVisible && <CompanyPopup onClose={handleContinueCompanion} />}
      {isChatting && (
        <button style={styles.endButton} onClick={handleEndCompanion}>
          동행 종료
        </button>
      )}
    </div>
  );
};

const ChatRoom = ({
  messages,
  inputMessage,
  setInputMessage,
  sendMessage,
  handleKeyPress,
  disableChat,
  userId,
}) => {
  return (
    <div style={styles.chatRoom}>
      <div style={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.senderId === userId ? "flex-end" : "flex-start",
              backgroundColor: msg.senderId === userId ? "#DCF8C6" : "#ffffff",
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요"
          disabled={disableChat}
          style={styles.input}
        />
        <button
          onClick={sendMessage}
          disabled={disableChat}
          style={styles.sendButton}
        >
          전송
        </button>
      </div>
    </div>
  );
};

const CompanyPopup = ({ onClose }) => (
  <div style={styles.popupBackground}>
    <div style={styles.popup}>
      <h3 style={styles.popupHeader}>동행을 하시겠습니까?</h3>
      <div style={styles.popupButtons}>
        <button style={styles.popupButton} onClick={onClose}>
          동행하기
        </button>
        <button
          style={styles.popupButton}
          onClick={() => (window.location.href = "/home")}
        >
          그만하기
        </button>
      </div>
    </div>
  </div>
);

// 스타일 객체
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    margin: "auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "10px",
  },
  chatRoom: {
    display: "flex",
    flexDirection: "column",
    height: "80vh",
    border: "1px solid #e0e0e0",
    borderRadius: "15px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  messages: {
    flex: 1,
    padding: "10px",
    overflowY: "scroll",
    backgroundColor: "#f5f5f7",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  message: {
    maxWidth: "70%",
    padding: "10px",
    borderRadius: "10px",
    color: "#000",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
    wordBreak: "break-word",
  },
  inputArea: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #e0e0e0",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #e0e0e0",
    outline: "none",
    fontSize: "16px",
  },
  sendButton: {
    marginLeft: "10px",
    padding: "10px 20px",
    borderRadius: "20px",
    backgroundColor: "#34b7f1",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  endButton: {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#ff4d4f",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  popupBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  popupHeader: {
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center",
  },
  popupButtons: {
    display: "flex",
    gap: "10px",
  },
  popupButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    backgroundColor: "#34b7f1",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Chat;
