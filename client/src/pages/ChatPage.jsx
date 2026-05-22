import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="h-screen flex bg-[#0f0f1a] overflow-hidden">
      <div className="w-72 shrink-0 h-full">
        <Sidebar selectedUser={selectedUser} onSelectUser={setSelectedUser} />
      </div>

      <div className="flex-1 h-full">
        {selectedUser ? (
          <ChatWindow key={selectedUser._id} selectedUser={selectedUser} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center gap-4 bg-[#0f0f1a]">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10">
        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-slate-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-white mb-1">Your messages</h2>
        <p className="text-slate-500 text-sm max-w-xs">
          Select someone from the sidebar to start a conversation
        </p>
      </div>
    </div>
  );
}
