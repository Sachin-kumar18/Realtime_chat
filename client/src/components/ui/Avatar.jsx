export default function Avatar({ name = "", src = "", size = "md", isOnline }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
  };

  const initial = name?.charAt(0)?.toUpperCase() || "?";

  const colors = [
    "bg-violet-500",
    "bg-indigo-500",
    "bg-sky-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-pink-500",
    "bg-teal-500",
  ];
  const colorIdx = name ? name.charCodeAt(0) % colors.length : 0;

  return (
    <div className="relative inline-flex shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover ring-2 ring-white/10`}
        />
      ) : (
        <div
          className={`${sizes[size]} ${colors[colorIdx]} rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white/10`}
        >
          {initial}
        </div>
      )}
      {isOnline !== undefined && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-[#0f0f1a] ${
            size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5"
          } ${isOnline ? "bg-emerald-400" : "bg-slate-500"}`}
        />
      )}
    </div>
  );
}
