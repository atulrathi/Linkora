import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, AlertCircle, Loader2, LogOut,
  UserCircle2, Camera, MoreHorizontal, ArrowLeft,
} from "lucide-react";
import axiosInstance from "../services/axiosInstance";

export default function Profile() {
  const { username } = useParams();
  const navigate     = useNavigate();
  const moreRef      = useRef(null);

  const [user,           setUser]           = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState("");
  const [activeTab,      setActiveTab]      = useState("posts");
  const [loggingOut,     setLoggingOut]     = useState(false);
  const [showMore,       setShowMore]       = useState(false);

  const TABS = ["Posts", "Replies", "Likes"];

  // ── Fetch profile ────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axiosInstance.get("/users");
        if (!cancelled) setUser(data.user);
      } catch (err) {
        if (cancelled) return;
        const status = err.response?.status;
        const msg    = err.response?.data?.message ?? "";
        if (status === 404) setError("Profile not found.");
        else setError(msg || "Failed to load profile. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchUser();
    return () => { cancelled = true; };
  }, [username]);

  // ── Close dropdown on outside click ─────────────────────────────
  useEffect(() => {
    if (!showMore) return;
    const handler = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setShowMore(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMore]);

  // ── Logout ───────────────────────────────────────────────────────
  const handleLogout = async () => {
    setLoggingOut(true);
    setShowMore(false);
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("token");
      navigate("/");
    } catch {
      setLoggingOut(false);
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────
  const fmt = (n) => {
    if (!n && n !== 0) return "0";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
    return String(n);
  };

  const fmtDate = (d) => d
    ? new Date(d).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : "";

  const initial = user?.name?.charAt(0).toUpperCase()
               ?? username?.charAt(0).toUpperCase()
               ?? "U";

  // ── Loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070c18]">
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" />
            <Loader2 size={22} className="animate-spin text-indigo-400" />
          </div>
          <p className="text-xs text-gray-600">Loading your profile…</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col">
        <div className="flex flex-col items-center gap-3 px-6 py-24 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle size={22} className="text-red-400" />
          </div>
          <p className="text-sm font-medium text-white">Something went wrong</p>
          <p className="text-xs text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded-xl border border-white/[0.07] px-4 py-2 text-xs font-medium text-gray-400 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────
  return (
    <>
      {/* Logout overlay */}
      <AnimatePresence>
        {loggingOut && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-[#070c18]/95 backdrop-blur-xl"
          >
            <div className="relative flex h-16 w-16 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" />
              <span className="absolute inset-2 animate-pulse rounded-full bg-indigo-500/10" />
              <Loader2 size={26} className="animate-spin text-indigo-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">Signing you out…</p>
              <p className="mt-1 text-xs text-gray-500">
                {"See you soon, " + (user?.name?.split(" ")[0] ?? "friend") + " 👋"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto flex max-w-2xl flex-col">

        {/* ── Top bar ── */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.05] bg-[#070c18]/90 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {/* Back to home */}
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => navigate("/home/" + username)}
              aria-label="Go to home"
              className="rounded-full border border-white/[0.08] bg-white/[0.03] p-1.5 text-gray-400 transition-all hover:bg-white/[0.07] hover:text-white focus-visible:outline-none"
            >
              <ArrowLeft size={15} />
            </motion.button>
            <div>
              <h1 className="text-sm font-bold text-white">My Profile</h1>
              <p className="text-[11px] text-gray-600">{fmt(user.postCount)} posts</p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1.5">
            {/* Edit profile */}
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => navigate("/settings/profile")}
              aria-label="Edit profile"
              className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-gray-300 transition-all hover:border-indigo-500/30 hover:bg-indigo-500/[0.06] hover:text-indigo-300 focus-visible:outline-none"
            >
              <UserCircle2 size={13} />
              <span className="hidden sm:inline">Add Profile</span>
            </motion.button>

            {/* More / Logout */}
            <div className="relative" ref={moreRef}>
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => setShowMore((v) => !v)}
                aria-label="More options"
                className={
                  "rounded-full border p-1.5 transition-all focus-visible:outline-none " +
                  (showMore
                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                    : "border-white/[0.08] bg-white/[0.03] text-gray-400 hover:bg-white/[0.06] hover:text-white")
                }
              >
                <MoreHorizontal size={14} />
              </motion.button>

              <AnimatePresence>
                {showMore && (
                  <motion.div
                    key="more-menu"
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1,    y: 0  }}
                    exit={{    opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1424] shadow-2xl shadow-black/70"
                  >
                    {/* Red stripe */}
                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                    <div className="p-3">
                      {/* User row */}
                      <div className="mb-3 flex items-center gap-2.5 rounded-xl bg-white/[0.03] p-2">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10" />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/50 to-violet-600/50 text-[11px] font-bold text-white">
                            {initial}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-semibold text-white">{user.name}</p>
                          <p className="truncate text-[10px] text-gray-500">{"@" + user.username}</p>
                        </div>
                        {/* Online dot */}
                        <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                      </div>

                      <div className="mb-2 h-px bg-white/[0.05]" />

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/10 focus-visible:outline-none"
                      >
                        <LogOut size={13} />
                        Sign out of Linkora
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Cover ── */}
        <div className="relative h-36 w-full overflow-hidden sm:h-44">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-violet-900/50 to-[#070c18]" />
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-indigo-600/20 blur-[90px]" />
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-violet-600/20 blur-[90px]" />
          {/* Edit cover hint */}
          <button
            aria-label="Change cover photo"
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-black/40 px-2.5 py-1.5 text-[10px] font-medium text-white/70 opacity-0 backdrop-blur-sm transition-all hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none sm:opacity-100"
          >
            <Camera size={11} />
            Edit cover
          </button>
        </div>

        {/* ── Avatar + stats ribbon ── */}
        <div className="relative px-4">
          {/* Avatar */}
          <div className="group absolute -top-11 left-4">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-[#070c18] sm:h-24 sm:w-24"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/70 to-violet-600/70 text-2xl font-bold text-white ring-4 ring-[#070c18] sm:h-24 sm:w-24">
                  {initial}
                </div>
              )}
              {/* Camera hover overlay */}
              <button
                aria-label="Change avatar"
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/55 group-hover:opacity-100 focus-visible:bg-black/55 focus-visible:opacity-100 focus-visible:outline-none"
              >
                <Camera size={17} className="text-white" />
              </button>
            </div>
          </div>

          {/* Stats row — right side of avatar row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-end gap-6 pb-2 pt-3"
          >
            {[
              { label: "Posts",     value: user.postCount },
              { label: "Following", value: user.following },
              { label: "Followers", value: user.followers },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-sm font-bold text-white">{fmt(value)}</p>
                <p className="text-[11px] text-gray-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Identity block ── */}
        <div className="mt-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              {user.isVerified && (
                <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 ring-1 ring-indigo-500/30">
                  Verified
                </span>
              )}
              {/* Online indicator */}
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Online
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">{"@" + user.username}</p>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-3"
          >
            {user.bio ? (
              <p className="text-sm leading-relaxed text-gray-300">{user.bio}</p>
            ) : (
              <button
                onClick={() => navigate("/settings/profile")}
                className="flex items-center gap-1.5 rounded-xl border border-dashed border-white/[0.08] px-3 py-2 text-xs text-gray-600 transition-all hover:border-indigo-500/30 hover:text-indigo-400 focus-visible:outline-none"
              >
                <UserCircle2 size={11} />
                Add a bio to your profile
              </button>
            )}
          </motion.div>

          {/* Join date */}
          {user.createdAt && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-3 flex items-center gap-1.5 text-xs text-gray-600"
            >
              <Calendar size={11} />
              {"Joined " + fmtDate(user.createdAt)}
            </motion.p>
          )}
        </div>

        {/* ── Tabs ── */}
        <div className="mt-5 flex border-b border-white/[0.05]">
          {TABS.map((tab) => {
            const active = activeTab === tab.toLowerCase();
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={
                  "relative flex-1 py-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none " +
                  (active ? "text-white" : "text-gray-600 hover:text-gray-400")
                }
              >
                {tab}
                {active && (
                  <motion.span
                    layoutId="tab-bar"
                    className="absolute bottom-0 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-indigo-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === "posts" && (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                  <UserCircle2 size={20} className="text-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-300">Share something with the world</p>
                  <p className="mt-0.5 text-xs text-gray-600">Your posts will show up here.</p>
                </div>
                <button className="mt-1 rounded-2xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-500 focus-visible:outline-none">
                  Create your first post
                </button>
              </div>
            )}
            {activeTab === "replies" && (
              <div className="flex flex-col items-center gap-2 py-16 text-center">
                <p className="text-sm font-medium text-gray-500">No replies yet</p>
                <p className="text-xs text-gray-700">Your replies will appear here.</p>
              </div>
            )}
            {activeTab === "likes" && (
              <div className="flex flex-col items-center gap-2 py-16 text-center">
                <p className="text-sm font-medium text-gray-500">Nothing liked yet</p>
                <p className="text-xs text-gray-700">Posts you like will appear here.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </>
  );
}