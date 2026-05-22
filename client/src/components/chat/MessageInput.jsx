import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function MessageInput({ onSend, socket, receiverId, disabled }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const typingTimer = useRef(null);
  const isTyping = useRef(false);

  const emitTypingStart = () => {
    if (!isTyping.current && socket) {
      isTyping.current = true;
      socket.emit("typing:start", { senderId: user.id, receiverId });
    }
  };

  const emitTypingStop = () => {
    if (isTyping.current && socket) {
      isTyping.current = false;
      socket.emit("typing:stop", { senderId: user.id, receiverId });
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    emitTypingStart();
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(emitTypingStop, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    emitTypingStop();
    clearTimeout(typingTimer.current);
    onSend(trimmed);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  useEffect(() => () => clearTimeout(typingTimer.current), []);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 px-4 py-3 border-t border-white/5 bg-[#13131f]"
    >
      <textarea
        rows={1}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Type a message… (Enter to send)"
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 transition max-h-32 overflow-y-auto disabled:opacity-40"
        style={{ fieldSizing: "content" }}
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="p-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white transition shrink-0"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </button>
    </form>
  );
}
