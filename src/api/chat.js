import { io } from "socket.io-client";

// 서버와 연결 설정
const SOCKET_SERVER_URL = "http://localhost:5000"; // Socket.io 서버 URL
const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket"], // WebSocket을 우선적으로 사용
  reconnection: true, // 연결 재시도 설정
});

// 파트너 ID 전달 및 실시간 통신 관리 함수
export const initializeChat = (userId, partnerId, onMessage, onError) => {
  // 연결 이벤트 처리
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);

    // 서버에 유저 정보 전달
    socket.emit("joinChat", { userId, partnerId });

    // 메시지 수신 이벤트 처리
    socket.on("receiveMessage", (message) => {
      if (onMessage) onMessage(message);
    });
  });

  // 에러 이벤트 처리
  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
    if (onError) onError(error);
  });

  // 연결 해제 이벤트 처리
  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  // 메시지 전송 함수
  const sendMessage = (message) => {
    socket.emit("sendMessage", message);
  };

  // 연결 종료 함수
  const disconnect = () => {
    socket.disconnect();
  };

  return { sendMessage, disconnect };
};
