import Avatar from "../ui/Avatar";

export default function UserItem({ user, isSelected, isOnline, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${
        isSelected
          ? "bg-violet-600/20 border border-violet-500/30"
          : "hover:bg-white/5 border border-transparent"
      }`}
    >
      <Avatar
        name={user.name}
        src={user.profilePic}
        size="md"
        isOnline={isOnline}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{user.name}</p>
        <p
          className={`text-xs truncate ${isOnline ? "text-emerald-400" : "text-slate-500"}`}
        >
          {isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </button>
  );
}
