import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, MoreHorizontal, ChevronLeft, MessageSquareDashed } from "lucide-react";

// ── Mock data ────────────────────────────────────────────────────
const CONVERSATIONS = [
  { id: 1, name: "Aria Chen",     initial: "A", color: "from-violet-500/60 to-indigo-600/60",  lastMessage: "That sounds like a great idea!",          time: "2m",    unread: 3, online: true  },
  { id: 2, name: "Marcus Reid",   initial: "M", color: "from-emerald-500/60 to-teal-600/60",   lastMessage: "Did you see the latest update?",           time: "18m",   unread: 0, online: true  },
  { id: 3, name: "Priya Nair",    initial: "P", color: "from-rose-500/60 to-pink-600/60",       lastMessage: "Thanks for sharing that article.",         time: "1h",    unread: 1, online: false },
  { id: 4, name: "Jordan Blake",  initial: "J", color: "from-amber-500/60 to-orange-600/60",   lastMessage: "Are we still on for tomorrow?",            time: "3h",    unread: 0, online: false },
  { id: 5, name: "Sofia Martins", initial: "S", color: "from-cyan-500/60 to-blue-600/60",      lastMessage: "Just sent over the files.",                time: "Yesterday", unread: 0, online: true  },
];

const MESSAGES = {
  1: [
    { id: 1, from: "them", text: "Hey! How's the project going?",                              time: "10:24 AM" },
    { id: 2, from: "me",   text: "Really well! We just finished the main layout.",             time: "10:26 AM" },
    { id: 3, from: "them", text: "That's great. I'd love to see it when you're ready.",        time: "10:27 AM" },
    { id: 4, from: "me",   text: "I'll send a preview later today.",                           time: "10:28 AM" },
    { id: 5, from: "them", text: "That sounds like a great idea!",                             time: "10:31 AM" },
  ],
};

// ── Skeleton ─────────────────────────────────────────────────────
function Skeleton({ className }) {
  return (
    <div
      className={"rounded-lg bg-white/[0.05] " + className}
      style={{ animation: "pulse 1.6s ease-in-out infinite" }}
    />
  );
}

function ConvoSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-24 rounded-md" />
        <Skeleton className="h-2.5 w-40 rounded-md" />
      </div>
      <Skeleton className="h-2 w-7 rounded-md" />
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────
export default function Messages() {
  const navigate   = useNavigate();
  const { username } = useParams();

  const [loading,      setLoading]      = useState(true);
  const [selected,     setSelected]     = useState(null);
  const [search,       setSearch]       = useState("");
  const [input,        setInput]        = useState("");
  const [messages,     setMessages]     = useState([]);
  const [mobileView,   setMobileView]   = useState("list");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  const selectConvo = (convo) => {
    setSelected(convo);
    setMessages(MESSAGES[convo.id] ?? []);
    setMobileView("chat");
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id:   Date.now(),
        from: "me",
        text: input.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInput("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const filtered = CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`@keyframes pulse { 0%,100%{opacity:.35} 50%{opacity:.7} }`}</style>

      {/* Full-height wrapper — fixed on mobile with bottom nav offset, relative on desktop */}
      <div className="fixed inset-x-0 top-0 bottom-16 flex flex-col sm:relative sm:inset-auto sm:bottom-auto sm:mx-auto sm:h-[calc(100vh-3rem)] sm:max-w-5xl sm:px-4">
        <div className="flex min-h-0 flex-1 overflow-hidden rounded-none border border-white/[0.05] bg-[#070c18] sm:rounded-2xl">

          {/* ── LEFT: Conversation list ─────────────────────── */}
          <div className={"flex min-h-0 w-full flex-col border-r border-white/[0.05] sm:w-72 sm:flex " + (mobileView === "chat" ? "hidden" : "flex")}>

            {/* Header */}
            <div className="shrink-0 border-b border-white/[0.05] px-4 py-4">
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={() => navigate("/home/" + username)}
                  aria-label="Go to home"
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] p-1.5 text-gray-400 transition-all hover:bg-white/[0.07] hover:text-white focus-visible:outline-none"
                >
                  <ChevronLeft size={15} />
                </motion.button>
                <h2 className="text-[15px] font-bold text-white">Messages</h2>
              </div>
              {!loading && (
                <p className="mt-0.5 text-[11px] text-gray-600 pl-[2.125rem]">
                  {filtered.some((c) => c.unread > 0) ? filtered.filter((c) => c.unread > 0).length + " unread" : "All caught up"}
                </p>
              )}
            </div>

            {/* Search */}
            <div className="shrink-0 px-3 py-2.5">
              {loading ? (
                <Skeleton className="h-8 w-full rounded-xl" />
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.03] px-3 py-2 focus-within:border-indigo-500/25">
                  <Search size={12} className="shrink-0 text-gray-700" />
                  <input
                    type="text"
                    placeholder="Search…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent text-xs text-gray-300 placeholder-gray-700 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* List */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <ConvoSkeleton key={i} />)
                : filtered.map((c, i) => (
                    <motion.button
                      key={c.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => selectConvo(c)}
                      className={"flex w-full items-center gap-3 px-4 py-3 text-left transition-colors " + (selected?.id === c.id ? "bg-white/[0.05]" : "hover:bg-white/[0.03]")}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className={"flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white " + c.color}>
                          {c.initial}
                        </div>
                        {c.online && (
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070c18]" />
                        )}
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className={"truncate text-[13px] " + (c.unread > 0 ? "font-semibold text-white" : "font-medium text-gray-300")}>
                            {c.name}
                          </p>
                          <span className="ml-2 shrink-0 text-[10px] text-gray-700">{c.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="truncate text-[11px] text-gray-600">{c.lastMessage}</p>
                          {c.unread > 0 && (
                            <span className="ml-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-bold text-white">
                              {c.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
            </div>
          </div>

          {/* ── RIGHT: Chat panel ───────────────────────────── */}
          <div className={"flex min-h-0 flex-1 flex-col " + (mobileView === "list" ? "hidden sm:flex" : "flex")}>

            {loading ? (
              /* Skeleton chat */
              <>
                <div className="shrink-0 flex items-center gap-3 border-b border-white/[0.05] px-4 py-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24 rounded-md" />
                    <Skeleton className="h-2.5 w-14 rounded-md" />
                  </div>
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-4 py-4">
                  {[["left","w-52"],["right","w-44"],["left","w-64"],["right","w-36"],["left","w-56"]].map(([side, w], i) => (
                    <div key={i} className={"flex items-end gap-2 " + (side === "right" ? "flex-row-reverse" : "")}>
                      {side === "left" && <Skeleton className="h-7 w-7 shrink-0 rounded-full" />}
                      <Skeleton className={"h-10 rounded-2xl " + w} />
                    </div>
                  ))}
                </div>
                <div className="shrink-0 border-t border-white/[0.05] px-4 py-3">
                  <Skeleton className="h-10 w-full rounded-2xl" />
                </div>
              </>
            ) : !selected ? (
              /* Empty state */
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                  <MessageSquareDashed size={22} className="text-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">No conversation selected</p>
                  <p className="mt-0.5 text-xs text-gray-700">Pick a conversation to start messaging.</p>
                </div>
              </div>
            ) : (
              /* Active chat */
              <>
                {/* Chat header */}
                <div className="shrink-0 flex items-center justify-between border-b border-white/[0.05] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={() => setMobileView("list")}
                      aria-label="Back to conversations"
                      className="sm:hidden rounded-full border border-white/[0.08] bg-white/[0.03] p-1.5 text-gray-400 transition-all hover:bg-white/[0.07] hover:text-white focus-visible:outline-none"
                    >
                      <ChevronLeft size={15} />
                    </motion.button>
                    <div className="relative">
                      <div className={"flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white " + selected.color}>
                        {selected.initial}
                      </div>
                      {selected.online && (
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#070c18]" />
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-white">{selected.name}</p>
                      <p className="text-[11px] text-gray-600">{selected.online ? "Active now" : "Offline"}</p>
                    </div>
                  </div>
                  <button className="rounded-full p-2 text-gray-600 transition-colors hover:text-gray-300 focus-visible:outline-none">
                    <MoreHorizontal size={15} />
                  </button>
                </div>

                {/* Messages */}
                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                  <div className="flex flex-col gap-3">
                    {messages.map((msg, i) => {
                      const isMe = msg.from === "me";
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={"flex items-end gap-2 " + (isMe ? "flex-row-reverse" : "")}
                        >
                          {!isMe && (
                            <div className={"flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white " + selected.color}>
                              {selected.initial}
                            </div>
                          )}
                          <div className={"flex flex-col gap-1 " + (isMe ? "items-end" : "items-start")}>
                            <div className={"max-w-[260px] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed sm:max-w-sm " + (isMe ? "rounded-br-sm bg-indigo-600 text-white" : "rounded-bl-sm bg-white/[0.06] text-gray-200")}>
                              {msg.text}
                            </div>
                            <span className="text-[10px] text-gray-700">{msg.time}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Input */}
                <div className="shrink-0 border-t border-white/[0.05] px-4 py-3">
                  <div className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 focus-within:border-indigo-500/25">
                    <input
                      type="text"
                      placeholder={"Message " + selected.name + "…"}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      className="flex-1 bg-transparent text-[13px] text-gray-200 placeholder-gray-700 focus:outline-none"
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={sendMessage}
                      disabled={!input.trim()}
                      aria-label="Send"
                      className={"shrink-0 rounded-xl p-2 transition-all " + (input.trim() ? "bg-indigo-600 text-white hover:bg-indigo-500" : "text-gray-700 cursor-not-allowed")}
                    >
                      <Send size={13} />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}