const SOCKET_SERVER_URL = "ws://localhost:3000"; // WebSocket 서버 URL

let socket = null;

/**
 * WebSocket 초기화 및 이벤트 처리
 * @param {string} userId - 현재 사용자 ID
 * @param {string} partnerId - 상대방 사용자 ID
 * @param {function} onMessage - 메시지 수신 시 호출되는 콜백 함수
 * @param {function} onError - 연결 오류 발생 시 호출되는 콜백 함수
 */
export const initializeChat = (userId, partnerId, onMessage, onError) => {
  socket = new WebSocket(SOCKET_SERVER_URL);

  // 연결 성공
  socket.onopen = () => {
    console.log("WebSocket connected");

    // 서버에 채팅방 참여 메시지 전송
    const joinMessage = {
      type: "joinChat",
      userId,
      partnerId,
    };
    socket.send(JSON.stringify(joinMessage));
  };

  // 메시지 수신
  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (onMessage) onMessage(message); // 수신된 메시지 콜백 실행
    } catch (error) {
      console.error("Error parsing message:", event.data);
    }
  };

  // 오류 발생
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    if (onError) onError(error); // 오류 콜백 실행
  };

  // 연결 해제
  socket.onclose = (event) => {
    console.log("WebSocket disconnected:", event.reason);
  };
};

/**
 * 메시지 전송
 * @param {Object} message - 전송할 메시지 데이터
 */
export const sendMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "sendMessage", ...message }));
  } else {
    console.error("WebSocket is not connected.");
  }
};

/**
 * WebSocket 연결 해제
 */
export const disconnect = () => {
  if (socket) {
    socket.close();
    console.log("WebSocket connection closed.");
  }
};
