import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, AlertCircle, Loader2, LogOut,
  UserCircle2, Camera, MoreHorizontal, ArrowLeft,
  Heart, MessageCircle, Repeat2, Bookmark, ImageIcon,
} from "lucide-react";
import axiosInstance from "../services/axiosInstance";

// ─── Post Card ───────────────────────────────────────────────────────────────
function PostCard({ post, initial, index }) {
  const [liked,      setLiked]      = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount,  setLikeCount]  = useState(post.likes ?? 0);

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "";

  const fmt = (n) => {
    if (!n && n !== 0) return "0";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
    return String(n);
  };

  const handleLike = () => {
    setLiked((v) => !v);
    setLikeCount((c) => liked ? c - 1 : c + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.22 }}
      className="group relative border-b border-white/[0.05] px-4 py-4 transition-colors hover:bg-white/[0.015]"
    >
      <div className="flex gap-3">

        {/* Avatar */}
        <div className="shrink-0">
          {post.author?.profilePic ? (
            <img
              src={post.author.profilePic}
              alt={post.author.name}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/70 to-violet-600/70 text-sm font-bold text-white ring-1 ring-white/10">
              {initial}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="min-w-0 flex-1">

          {/* Author + date */}
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span className="text-sm font-semibold text-white">
              {post.author?.name ?? "You"}
            </span>
            <span className="text-xs text-gray-600">·</span>
            <span className="text-xs text-gray-600">{fmtDate(post.createdAt)}</span>
          </div>

          {/* Title */}
          {post.title && (
            <p className="mt-0.5 text-sm font-semibold text-gray-200">{post.title}</p>
          )}

          {/* Content */}
          {post.content && (
            <p className="mt-1 text-sm leading-relaxed text-gray-400 line-clamp-4">
              {post.content}
            </p>
          )}

          {/* Image */}
          {post.image && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-white/[0.06]">
              <img
                src={post.image}
                alt="Post media"
                className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                onError={(e) => e.currentTarget.closest("div").remove()}
              />
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center gap-1">

            {/* Like */}
            <button
              onClick={handleLike}
              className={
                "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all hover:bg-red-500/10 " +
                (liked ? "text-red-400" : "text-gray-600 hover:text-red-400")
              }
            >
              <Heart size={13} fill={liked ? "currentColor" : "none"} />
              <span>{fmt(likeCount)}</span>
            </button>

            {/* Comment */}
            <button className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-all hover:bg-indigo-500/10 hover:text-indigo-400">
              <MessageCircle size={13} />
              <span>{fmt(post.commentCount ?? 0)}</span>
            </button>

            {/* Repost */}
            <button className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-all hover:bg-emerald-500/10 hover:text-emerald-400">
              <Repeat2 size={13} />
              <span>{fmt(post.repostCount ?? 0)}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => setBookmarked((v) => !v)}
              className={
                "ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all hover:bg-indigo-500/10 " +
                (bookmarked ? "text-indigo-400" : "text-gray-600 hover:text-indigo-400")
              }
            >
              <Bookmark size={13} fill={bookmarked ? "currentColor" : "none"} />
            </button>

          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty Posts State ────────────────────────────────────────────────────────
function EmptyPosts({ onNavigate }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <ImageIcon size={20} className="text-gray-700" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-300">Share something with the world</p>
        <p className="mt-0.5 text-xs text-gray-600">Your posts will show up here.</p>
      </div>
      <button
        onClick={onNavigate}
        className="mt-1 rounded-2xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-500 focus-visible:outline-none"
      >
        Create your first post
      </button>
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export default function Profile() {
  const { username } = useParams();
  const navigate     = useNavigate();
  const moreRef      = useRef(null);

  // ── Upload refs ────────────────────────────────────────
  const avatarInputRef                        = useRef(null);
  const coverInputRef                         = useRef(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [coverUploading,  setCoverUploading]  = useState(false);

  const [user,       setUser]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [activeTab,  setActiveTab]  = useState("posts");
  const [loggingOut, setLoggingOut] = useState(false);
  const [showMore,   setShowMore]   = useState(false);

  // ── Posts state ─────────────────────────────────────────────────
  const [posts,        setPosts]        = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError,   setPostsError]   = useState("");
  const [page,         setPage]         = useState(1);
  const [pagination,   setPagination]   = useState(null);

  const TABS = ["Posts"];

  // ── Avatar upload handler ───────────────────────────────────────
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic client-side validation
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file); // ← matches upload.single('image') on backend

    setAvatarUploading(true);
    try {
      const { data } = await axiosInstance.post("users/upload/profilepic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Handle common response shapes — adjust to match your API
      const newAvatar =data.imageUrl

      if (newAvatar) {
        setUser((prev) => ({ ...prev, avatar: newAvatar }));
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      alert(err.response?.data?.message ?? "Upload failed. Please try again.");
    } finally {
      setAvatarUploading(false);
      e.target.value = ""; // reset so same file can be re-selected
    }
  };

  // ── Cover upload handler ───────────────────────────────
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setCoverUploading(true);
    try {
      const { data } = await axiosInstance.post("users/upload/coverphoto", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newCover =
        data?.user?.coverPhoto ??
        data?.user?.coverImage ??
        data?.coverPhoto       ??
        data?.coverImage       ??
        data?.url;

      if (newCover) {
        setUser((prev) => ({ ...prev, coverPhoto: newCover }));
      }
    } catch (err) {
      console.error("Cover upload failed:", err);
      alert(err.response?.data?.message ?? "Cover upload failed. Please try again.");
    } finally {
      setCoverUploading(false);
      e.target.value = "";
    }
  };

  // ── Fetch profile ───────────────────────────────────────────────
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

  // ── Fetch posts ─────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== "posts") return;
    let cancelled = false;

    const fetchPosts = async () => {
      setPostsLoading(true);
      setPostsError("");
      try {
        const { data } = await axiosInstance.get("/post/userpost", {
          params: { page, limit: 10 },
        });
        if (!cancelled) {
          const fetchedPosts      = data?.data?.posts      ?? data?.posts      ?? [];
          const fetchedPagination = data?.data?.pagination ?? data?.pagination ?? null;

          setPosts((prev) =>
            page === 1 ? fetchedPosts : [...prev, ...fetchedPosts]
          );
          setPagination(fetchedPagination);
        }
      } catch (err) {
        if (!cancelled) {
          setPostsError(err.response?.data?.message ?? "Failed to load posts.");
        }
      } finally {
        if (!cancelled) setPostsLoading(false);
      }
    };

    fetchPosts();
    return () => { cancelled = true; };
  }, [activeTab, page]);

  // Reset pagination when switching to posts tab
  useEffect(() => {
    if (activeTab === "posts") {
      setPosts([]);
      setPage(1);
    }
  }, [activeTab]);

  // ── Close dropdown on outside click ────────────────────────────
  useEffect(() => {
    if (!showMore) return;
    const handler = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target))
        setShowMore(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMore]);

  // ── Logout ──────────────────────────────────────────────────────
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

  // ── Helpers ─────────────────────────────────────────────────────
  const fmt = (n) => {
    if (!n && n !== 0) return "0";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
    return String(n);
  };

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "";

  const initial =
    user?.name?.charAt(0).toUpperCase() ??
    username?.charAt(0).toUpperCase() ??
    "U";

  // ── Loading ─────────────────────────────────────────────────────
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

  // ── Error ─────────────────────────────────────────────────────────
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

  // ── Main ───────────────────────────────────────────────────────────
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

          <div className="flex items-center gap-1.5">
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => navigate("/settings/profile")}
              aria-label="Edit profile"
              className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-gray-300 transition-all hover:border-indigo-500/30 hover:bg-indigo-500/[0.06] hover:text-indigo-300 focus-visible:outline-none"
            >
              <UserCircle2 size={13} />
              <span className="hidden sm:inline">Edit Profile</span>
            </motion.button>

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
                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                    <div className="p-3">
                      <div className="mb-3 flex items-center gap-2.5 rounded-xl bg-white/[0.03] p-2">
                        {user.profilePic ? (
                          <img src={user.profilePic} alt={user.name} className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10" />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/50 to-violet-600/50 text-[11px] font-bold text-white">
                            {initial}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-semibold text-white">{user.name}</p>
                          <p className="truncate text-[10px] text-gray-500">{"@" + user.username}</p>
                        </div>
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
        <div className="group relative h-36 w-full overflow-hidden sm:h-44">
          {/* Hidden file input for cover */}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverUpload}
          />

          {/* Cover image or gradient fallback */}
          {user.coverPhoto ? (
            <img
              src={user.coverPhoto}
              alt="Cover"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-violet-900/50 to-[#070c18]" />
              <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-indigo-600/20 blur-[90px]" />
              <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-violet-600/20 blur-[90px]" />
            </>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 transition-all duration-200 group-hover:bg-black/30" />

          {/* Edit cover button */}
          <button
            aria-label="Change cover photo"
            onClick={() => coverInputRef.current?.click()}
            disabled={coverUploading}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-black/40 px-2.5 py-1.5 text-[10px] font-medium text-white/70 opacity-0 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none disabled:cursor-not-allowed sm:opacity-100"
          >
            {coverUploading ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Camera size={11} />
            )}
            {coverUploading ? "Uploading…" : "Edit cover"}
          </button>
        </div>

        {/* ── Avatar + stats ── */}
        <div className="relative px-4">

          {/* Hidden file input for avatar */}
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />

          <div className="group absolute -top-11 left-4">
            <div className="relative">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-[#070c18] sm:h-24 sm:w-24"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/70 to-violet-600/70 text-2xl font-bold text-white ring-4 ring-[#070c18] sm:h-24 sm:w-24">
                  {initial}
                </div>
              )}

              {/* Upload overlay */}
              <button
                aria-label="Change avatar"
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/55 group-hover:opacity-100 focus-visible:bg-black/55 focus-visible:opacity-100 focus-visible:outline-none disabled:cursor-not-allowed"
              >
                {avatarUploading ? (
                  <Loader2 size={17} className="animate-spin text-white" />
                ) : (
                  <Camera size={17} className="text-white" />
                )}
              </button>
            </div>
          </div>

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

        {/* ── Identity ── */}
        <div className="mt-12 px-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              {user.isVerified && (
                <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 ring-1 ring-indigo-500/30">
                  Verified
                </span>
              )}
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Online
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">{"@" + user.username}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-3">
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

          {user.createdAt && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-3 flex items-center gap-1.5 text-xs text-gray-600">
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
        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >

            {/* ── POSTS TAB ── */}
            {activeTab === "posts" && (
              <>
                {/* Loading skeleton */}
                {postsLoading && page === 1 && (
                  <div className="flex flex-col">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-3 border-b border-white/[0.05] px-4 py-4">
                        <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-white/[0.06]" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-32 animate-pulse rounded-full bg-white/[0.06]" />
                          <div className="h-3 w-full animate-pulse rounded-full bg-white/[0.04]" />
                          <div className="h-3 w-3/4 animate-pulse rounded-full bg-white/[0.04]" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Error state */}
                {postsError && !postsLoading && (
                  <div className="flex flex-col items-center gap-3 py-12 text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10">
                      <AlertCircle size={18} className="text-red-400" />
                    </div>
                    <p className="text-xs text-gray-500">{postsError}</p>
                    <button
                      onClick={() => { setPosts([]); setPage(1); }}
                      className="rounded-xl border border-white/[0.07] px-4 py-2 text-xs font-medium text-gray-400 hover:bg-white/[0.05] hover:text-white"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Empty state */}
                {!postsLoading && !postsError && posts.length === 0 && (
                  <EmptyPosts onNavigate={() => navigate("/home/" + username)} />
                )}

                {/* Posts list */}
                {posts.length > 0 && (
                  <>
                    <div className="flex flex-col divide-y divide-white/[0.03]">
                      {posts.map((post, i) => (
                        <PostCard key={post._id} post={post} initial={initial} index={i} />
                      ))}
                    </div>

                    {/* Load more */}
                    {pagination?.hasNextPage && (
                      <div className="flex justify-center py-6">
                        <button
                          onClick={() => setPage((p) => p + 1)}
                          disabled={postsLoading}
                          className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2 text-xs font-medium text-gray-400 transition-all hover:bg-white/[0.07] hover:text-white disabled:opacity-50"
                        >
                          {postsLoading ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : null}
                          Load more posts
                        </button>
                      </div>
                    )}

                    {/* End of feed */}
                    {!pagination?.hasNextPage && posts.length > 0 && (
                      <p className="py-8 text-center text-[11px] text-gray-700">
                        You've seen all your posts
                      </p>
                    )}
                  </>
                )}
              </>
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