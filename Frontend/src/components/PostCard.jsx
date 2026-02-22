import { useState } from "react";
import { MessageCircle, Repeat2, Heart, Share, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Formats an ISO date string into a short relative time label.
 * e.g. "just now", "5m", "3h", "2d"
 */
const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)                return "just now";
  if (diff < 3600)              return `${Math.floor(diff / 60)}m`;
  if (diff < 86400)             return `${Math.floor(diff / 3600)}h`;
  if (diff < 86400 * 7)        return `${Math.floor(diff / 86400)}d`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

/**
 * PostCard — A single post in the feed.
 *
 * Expects a `post` object from the API with the following shape:
 * {
 *   _id:       string,
 *   content:   string,
 *   author: {
 *     name:       string,
 *     email:      string,
 *     profilePic: string | null,
 *   },
 *   likes:     string[],   // array of user IDs
 *   createdAt: string,     // ISO date string
 * }
 */
export default function PostCard({ post }) {
  if (!post) return null;
  const { author, content, likes = [], createdAt } = post;

  const [liked,       setLiked]       = useState(false);
  const [reposted,    setReposted]    = useState(false);
  const [likeCount,   setLikeCount]   = useState(likes.length);
  const [repostCount, setRepostCount] = useState(0);

  const handleLike = () => {
    setLiked((v) => !v);
    setLikeCount((v) => liked ? v - 1 : v + 1);
  };

  const handleRepost = () => {
    setReposted((v) => !v);
    setRepostCount((v) => reposted ? v - 1 : v + 1);
  };

  // Safely derive display values from the populated author object.
  const displayName = author?.name     || "Unknown User";
  const username    = author?.username || null;
  const profilePic  = author?.profilePic || null;
  const initial     = displayName.charAt(0).toUpperCase();

  // Format the timestamp as a short relative label (e.g. "2h", "3d").
  const time = timeAgo(createdAt);

  return (
    <article className="flex gap-3 px-4 py-4 transition-colors duration-150 hover:bg-white/[0.02]">

      {/* Avatar */}
      {profilePic ? (
        <img
          src={profilePic}
          alt={displayName}
          className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/10"
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-600/30 text-sm font-semibold text-indigo-200 ring-1 ring-white/10">
          {initial}
        </div>
      )}

      {/* Content */}
      <div className="min-w-0 flex-1">

        {/* Post header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-white">
              {displayName}
            </span>
            {username && (
              <span className="shrink-0 text-sm text-gray-500">@{username}</span>
            )}
            <span className="shrink-0 text-sm text-gray-600">·</span>
            <span className="shrink-0 text-sm text-gray-500">{time}</span>
          </div>
          <button
            aria-label="More options"
            className="shrink-0 rounded-full p-1.5 text-gray-600 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none"
          >
            <MoreHorizontal size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Post body */}
        <p className="mt-1.5 text-sm leading-relaxed text-gray-200">{content}</p>

        {/* Action bar */}
        <div className="mt-3 flex items-center gap-5">

          <ActionButton
            icon={MessageCircle}
            label="Reply"
            activeColor="text-indigo-400"
          />

          <ActionButton
            icon={Repeat2}
            count={repostCount}
            label={reposted ? "Undo repost" : "Repost"}
            active={reposted}
            activeColor="text-emerald-400"
            onClick={handleRepost}
          />

          <ActionButton
            icon={Heart}
            count={likeCount}
            label={liked ? "Unlike" : "Like"}
            active={liked}
            activeColor="text-rose-400"
            fillOnActive
            onClick={handleLike}
          />

          <ActionButton
            icon={Share}
            label="Share"
            activeColor="text-indigo-400"
          />

        </div>
      </div>
    </article>
  );
}

/** Reusable action button with optional count and active state. */
function ActionButton({ icon: Icon, count, label, active, activeColor, fillOnActive, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      aria-label={label}
      className={`
        group flex items-center gap-1.5 text-xs font-medium transition-colors duration-150
        focus-visible:outline-none
        ${active ? activeColor : "text-gray-600 hover:text-gray-300"}
      `}
    >
      <span className="rounded-full p-1.5 transition-colors duration-150 group-hover:bg-white/[0.06]">
        <Icon
          size={16}
          aria-hidden="true"
          fill={active && fillOnActive ? "currentColor" : "none"}
        />
      </span>
      {count !== undefined && count > 0 && (
        <span>{count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count}</span>
      )}
    </motion.button>
  );
}