export default function TypingIndicator({ name }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="bg-white/8 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-2.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
      <span className="text-xs text-slate-500">{name} is typing</span>
    </div>
  );
}
