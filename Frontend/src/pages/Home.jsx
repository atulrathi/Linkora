import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Smile, BarChart2, MapPin, Loader2, AlertCircle, RefreshCcw } from "lucide-react";

import Sidebar       from "../components/layout/Sidebar";
import RightPanel    from "../components/layout/RightPanel";
import PostCard      from "../components/PostCard";
import axiosInstance from "../services/axiosInstance";

/**
 * Home — The main feed page.
 *
 * Fetches posts from the API with infinite scroll pagination.
 * Allows the logged-in user to create new posts via the compose box.
 */
export default function Home() {
  const [posts,       setPosts]       = useState([]);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [loading,     setLoading]     = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error,       setError]       = useState("");

  // Compose box state
  const [draft,     setDraft]     = useState("");
  const [posting,   setPosting]   = useState(false);
  const [postError, setPostError] = useState("");

  const loaderRef  = useRef(null);
  const textareaRef = useRef(null);

  // ── Fetch posts ─────────────────────────────────────────────────
  const fetchPosts = useCallback(async (pageNum) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosInstance.get("/post/feed", {
        params: { page: pageNum },
      });

      setPosts((prev) =>
        pageNum === 1 ? data.posts : [...prev, ...data.posts]
      );
      setTotalPages(data.totalPages);
    } catch (err) {
      const msg = err.response?.data?.message ?? "";
      setError(msg || "Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  // ── Infinite scroll ─────────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < totalPages) {
          const next = page + 1;
          setPage(next);
          fetchPosts(next);
        }
      },
      { threshold: 0.1 }
    );

    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [loading, page, totalPages, fetchPosts]);

  // Auto-grow the textarea as the user types.
  const handleDraftChange = (e) => {
    setDraft(e.target.value);
    setPostError("");
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  // ── Create post ─────────────────────────────────────────────────
  const handlePost = async () => {
    const content = draft.trim();
    if (!content) return;

    setPosting(true);
    setPostError("");

    try {
      const { data } = await axiosInstance.post("/post/create", {
        content,
        image: null, // image upload will be added later
      });

      // Prepend the new post to the top of the feed immediately.
      setPosts((prev) => [data.post, ...prev]);
      setDraft("");

      // Reset textarea height.
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (err) {
      const msg = err.response?.data?.message ?? "";
      setPostError(msg || "Failed to create post. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  // Submit on Ctrl/Cmd + Enter.
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handlePost();
    }
  };

  const handleRefresh = () => {
    setPage(1);
    fetchPosts(1);
  };

  const charLimit  = 280;
  const charCount  = draft.length;
  const nearLimit  = charCount >= charLimit * 0.8;
  const overLimit  = charCount > charLimit;

  return (
    <div className="flex min-h-screen">

      {/* Left sidebar */}
      <Sidebar />

      {/* Central feed */}
      <main className="flex min-h-screen flex-1 flex-col border-r border-white/[0.05]">

        {/* Feed header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.05] bg-[#090e1a]/80 px-4 py-3 backdrop-blur-xl">
          <h1 className="text-base font-bold text-white">Home</h1>
          <button
            onClick={handleRefresh}
            aria-label="Refresh feed"
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-white/[0.05] hover:text-gray-300 focus-visible:outline-none"
          >
            <RefreshCcw size={15} aria-hidden="true" />
          </button>
        </div>

        {/* ── Compose box ───────────────────────────────────────────── */}
        <div className="border-b border-white/[0.05] px-4 py-4">
          <div className="flex gap-3">

            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-600/30 text-sm font-semibold text-indigo-200 ring-1 ring-white/10">
              J
            </div>

            <div className="flex-1">
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                rows={2}
                value={draft}
                onChange={handleDraftChange}
                onKeyDown={handleKeyDown}
                placeholder="What's happening?"
                maxLength={charLimit + 20}
                className="w-full resize-none bg-transparent text-[15px] text-white placeholder-gray-600 focus:outline-none"
              />

              {/* Post error */}
              <AnimatePresence>
                {postError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-2 flex items-center gap-1.5 text-xs text-red-400"
                  >
                    <AlertCircle size={12} aria-hidden="true" />
                    {postError}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Toolbar */}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1 text-indigo-400">
                  <button aria-label="Add image"    className="rounded-full p-2 transition-colors hover:bg-indigo-500/10 focus-visible:outline-none"><Image     size={18} aria-hidden="true" /></button>
                  <button aria-label="Add emoji"    className="rounded-full p-2 transition-colors hover:bg-indigo-500/10 focus-visible:outline-none"><Smile     size={18} aria-hidden="true" /></button>
                  <button aria-label="Add poll"     className="rounded-full p-2 transition-colors hover:bg-indigo-500/10 focus-visible:outline-none"><BarChart2 size={18} aria-hidden="true" /></button>
                  <button aria-label="Add location" className="rounded-full p-2 transition-colors hover:bg-indigo-500/10 focus-visible:outline-none"><MapPin    size={18} aria-hidden="true" /></button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Character counter */}
                  {draft.length > 0 && (
                    <span className={`text-xs tabular-nums ${
                      overLimit  ? "text-red-400"    :
                      nearLimit  ? "text-amber-400"  :
                      "text-gray-600"
                    }`}>
                      {charLimit - charCount}
                    </span>
                  )}

                  {/* Post button */}
                  <button
                    onClick={handlePost}
                    disabled={!draft.trim() || overLimit || posting}
                    className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-1.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
                  >
                    {posting ? (
                      <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                    ) : null}
                    {posting ? "Posting…" : "Post"}
                  </button>
                </div>
              </div>

              {/* Hint */}
              {draft.length > 0 && (
                <p className="mt-1.5 text-[11px] text-gray-700">
                  Press <kbd className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[10px] text-gray-500">Ctrl+Enter</kbd> to post
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Initial loading skeleton ──────────────────────────────── */}
        {initialLoad && (
          <div className="divide-y divide-white/[0.04]">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 px-4 py-4">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-white/[0.06]" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 w-32 animate-pulse rounded-full bg-white/[0.06]" />
                  <div className="h-3 w-full animate-pulse rounded-full bg-white/[0.06]" />
                  <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/[0.06]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Feed error ────────────────────────────────────────────── */}
        <AnimatePresence>
          {error && !initialLoad && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-4 mt-4 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              <AlertCircle size={16} aria-hidden="true" className="shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                onClick={handleRefresh}
                className="shrink-0 text-xs underline underline-offset-2 hover:text-red-300 focus-visible:outline-none"
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Post feed ─────────────────────────────────────────────── */}
        {!initialLoad && (
          <div>
            {posts.length === 0 && !loading ? (
              <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
                <p className="text-sm font-medium text-gray-400">No posts yet</p>
                <p className="text-xs text-gray-600">
                  Be the first to post something.
                </p>
              </div>
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(index, 5) * 0.06 }}
                  className="border-b border-white/[0.04]"
                >
                  <PostCard post={post} />
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* ── Infinite scroll loader ────────────────────────────────── */}
        <div ref={loaderRef} className="flex justify-center py-6">
          {loading && !initialLoad && (
            <Loader2 size={20} className="animate-spin text-indigo-400" aria-label="Loading more posts…" />
          )}
          {!loading && page >= totalPages && posts.length > 0 && (
            <p className="text-xs text-gray-700">You're all caught up.</p>
          )}
        </div>

      </main>

      {/* Right panel */}
      <RightPanel />

    </div>
  );
}