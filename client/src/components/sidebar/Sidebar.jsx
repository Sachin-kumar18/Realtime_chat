import { useEffect, useState } from "react";
import { fetchUsers } from "../../api/chat";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import Avatar from "../ui/Avatar";
import UserItem from "./UserItem";
import Spinner from "../ui/Spinner";

export default function Sidebar({ selectedUser, onSelectUser }) {
  const { user, logout } = useAuth();
  const { onlineUsers } = useSocket();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers()
      .then(({ data }) => setUsers(data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="h-full flex flex-col bg-[#13131f] border-r border-white/5">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
            <span className="text-white font-semibold tracking-tight text-lg">
              Chatter
            </span>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>

        {/* Current user */}
        <div className="flex items-center gap-2.5 px-2 py-2 bg-white/5 rounded-xl">
          <Avatar
            name={user?.name}
            src={user?.profilePic}
            size="sm"
            isOnline={true}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {user?.name}
            </p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search people…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/8 rounded-xl pl-8 pr-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
          />
        </div>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
        {loading ? (
          <div className="flex justify-center pt-8">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-slate-600 text-sm pt-8">
            No users found
          </p>
        ) : (
          filtered.map((u) => (
            <UserItem
              key={u._id}
              user={u}
              isSelected={selectedUser?._id === u._id}
              isOnline={onlineUsers.includes(u._id)}
              onClick={() => onSelectUser(u)}
            />
          ))
        )}
      </div>
    </div>
  );
}
