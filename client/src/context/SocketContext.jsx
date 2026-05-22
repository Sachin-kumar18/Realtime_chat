import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const sock = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
      {
        transports: ["polling","websocket"],
        auth: { token: localStorage.getItem("token") },
      },
    );

    socketRef.current = sock;
    sock.on("connect", () => {
      setSocket(sock);
      sock.emit("user:online", user.id);
    });

    sock.on("users:online", (userIds) => {
      setOnlineUsers(userIds);
    });

    sock.on("user:status", ({ userId, isOnline }) => {
      setOnlineUsers((prev) =>
        isOnline
          ? [...new Set([...prev, userId])]
          : prev.filter((id) => id !== userId),
      );
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
