import api from "./axios";

export const fetchUsers = () => api.get("/chat/users");
export const fetchConversation = (userId) =>
  api.get(`/chat/conversation/${userId}`);
export const sendMessageREST = (data) => api.post("/chat/send", data);
export const markMessagesRead = (userId) => api.patch(`/chat/read/${userId}`);
