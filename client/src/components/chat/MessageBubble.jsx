function StatusIcon({ status }) {
  if (status === "read") {
    return (
      <svg
        className="w-3.5 h-3.5 text-violet-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M18 7l-8 8-4-4-1.5 1.5L10 18 19.5 8.5z" />
        <path d="M22 7l-8 8-1.5-1.5L20.5 5.5z" />
      </svg>
    );
  }
  if (status === "delivered") {
    return (
      <svg
        className="w-3.5 h-3.5 text-slate-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M18 7l-8 8-4-4-1.5 1.5L10 18 19.5 8.5z" />
        <path d="M22 7l-8 8-1.5-1.5L20.5 5.5z" />
      </svg>
    );
  }
  // sent
  return (
    <svg
      className="w-3 h-3 text-slate-500"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({ message, isMine }) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1`}>
      <div
        className={`group max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isMine
            ? "bg-violet-600 text-white rounded-br-sm"
            : "bg-white/8 text-slate-200 rounded-bl-sm border border-white/5"
        }`}
      >
        <p className="wrap-break-word">{message.content}</p>
        <div
          className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-end"}`}
        >
          <span className="text-[10px] opacity-60">
            {formatTime(message.createdAt)}
          </span>
          {isMine && <StatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  );
}
