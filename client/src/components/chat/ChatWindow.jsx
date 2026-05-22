import { useEffect, useRef, useState, useCallback } from "react";
import { fetchConversation, markMessagesRead } from "../../api/chat";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import Avatar from "../ui/Avatar";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import Spinner from "../ui/Spinner";

export default function ChatWindow({ selectedUser }) {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const typingClearTimer = useRef(null);

  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    setMessages([]);
    setIsTyping(false);
    setLoading(true);
    fetchConversation(selectedUser._id)
      .then(({ data }) => setMessages(data.messages))
      .catch(console.error)
      .finally(() => setLoading(false));

    markMessagesRead(selectedUser._id).catch(() => {});
  }, [selectedUser._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (msg) => {
      if (
        msg.senderId === selectedUser._id ||
        msg.senderId?.toString() === selectedUser._id
      ) {
        setMessages((prev) => [...prev, msg]);
        socket.emit("message:read", {
          senderId: selectedUser._id,
          receiverId: user.id,
        });
      }
    };

    const handleSent = (msg) => {
      setMessages((prev) =>
        prev.map((m) => (m._pending && m.content === msg.content ? msg : m)),
      );
    };

    const handleDelivered = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, status: "delivered" } : m,
        ),
      );
    };

    const handleRead = () => {
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === user.id || m.senderId?.toString() === user.id
            ? { ...m, status: "read" }
            : m,
        ),
      );
    };

    const handleTypingStart = ({ senderId }) => {
      if (
        senderId === selectedUser._id ||
        senderId?.toString() === selectedUser._id
      ) {
        setIsTyping(true);
        clearTimeout(typingClearTimer.current);
        typingClearTimer.current = setTimeout(() => setIsTyping(false), 3000);
      }
    };

    const handleTypingStop = ({ senderId }) => {
      if (
        senderId === selectedUser._id ||
        senderId?.toString() === selectedUser._id
      ) {
        clearTimeout(typingClearTimer.current);
        setIsTyping(false);
      }
    };

    socket.on("message:receive", handleReceive);
    socket.on("message:sent", handleSent);
    socket.on("message:delivered", handleDelivered);
    socket.on("message:read", handleRead);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.off("message:receive", handleReceive);
      socket.off("message:sent", handleSent);
      socket.off("message:delivered", handleDelivered);
      socket.off("message:read", handleRead);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
      clearTimeout(typingClearTimer.current);
    };
  }, [socket, selectedUser._id, user.id]);

  const handleSend = useCallback(
    (content) => {
      if (!socket) return;

      const optimistic = {
        _id: `pending_${Date.now()}`,
        _pending: true,
        senderId: user.id,
        receiverId: selectedUser._id,
        content,
        status: "sent",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimistic]);

      socket.emit("message:send", {
        senderId: user.id,
        receiverId: selectedUser._id,
        content,
      });
    },
    [socket, user.id, selectedUser._id],
  );

  return (
    <div className="h-full flex flex-col bg-[#0f0f1a]">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5 bg-[#13131f]">
        <Avatar
          name={selectedUser.name}
          src={selectedUser.profilePic}
          size="md"
          isOnline={isOnline}
        />
        <div>
          <p className="text-sm font-semibold text-white">
            {selectedUser.name}
          </p>
          <p
            className={`text-xs ${isOnline ? "text-emerald-400" : "text-slate-500"}`}
          >
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
        {loading ? (
          <div className="flex justify-center pt-16">
            <Spinner />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-16">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">
              No messages yet — say hi to {selectedUser.name}!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isMine={
                msg.senderId === user.id || msg.senderId?.toString() === user.id
              }
            />
          ))
        )}
        {isTyping && <TypingIndicator name={selectedUser.name} />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        socket={socket}
        receiverId={selectedUser._id}
      />
    </div>
  );
}
