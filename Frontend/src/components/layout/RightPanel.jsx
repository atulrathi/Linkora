import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TRENDING = [
  { category: "Technology", tag: "#ReactJS",        posts: "12.4K" },
  { category: "Design",     tag: "Tailwind CSS 4.0", posts: "8.2K"  },
  { category: "Sports",     tag: "Champions League", posts: "45K"   },
  { category: "Music",      tag: "#NewAlbumDrop",    posts: "3.1K"  },
];

const SUGGESTIONS = [
  { id: 1, name: "Jane Smith",    username: "janesmith",  initial: "J" },
  { id: 2, name: "Alex Chen",     username: "alexchen",   initial: "A" },
  { id: 3, name: "Sarah Kim",     username: "sarahkim",   initial: "S" },
];

/**
 * RightPanel — Twitter-style right sidebar.
 *
 * Contains a search bar, trending topics, and suggested accounts.
 * Visible only on extra-large screens.
 */
export default function RightPanel() {
  const [followed, setFollowed] = useState(new Set());
  const [query, setQuery]       = useState("");

  const toggleFollow = (id) =>
    setFollowed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <aside className="sticky top-0 hidden h-screen w-80 shrink-0 overflow-y-auto border-l border-white/[0.05] px-4 py-6 xl:block">

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={15}
          aria-hidden="true"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="search"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 transition-all duration-200 focus:border-indigo-500/40 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* Trending */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.02]">
        <div className="flex items-center gap-2 border-b border-white/[0.05] px-4 py-3">
          <TrendingUp size={15} className="text-indigo-400" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-white">Trending</h2>
        </div>

        <ul>
          {TRENDING.map(({ category, tag, posts }, index) => (
            <li key={tag}>
              <button className="group w-full px-4 py-3 text-left transition-colors duration-150 hover:bg-white/[0.03]">
                <p className="text-[11px] text-gray-600">{category}</p>
                <p className="mt-0.5 text-sm font-semibold text-white">{tag}</p>
                <p className="mt-0.5 text-[11px] text-gray-600">{posts} posts</p>
              </button>
              {index < TRENDING.length - 1 && (
                <div className="mx-4 h-px bg-white/[0.04]" aria-hidden="true" />
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Who to follow */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.02]">
        <div className="border-b border-white/[0.05] px-4 py-3">
          <h2 className="text-sm font-semibold text-white">Who to Follow</h2>
        </div>

        <ul>
          {SUGGESTIONS.map(({ id, name, username, initial }, index) => {
            const isFollowing = followed.has(id);
            return (
              <li key={id}>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  {/* Avatar + info */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-600/30 text-sm font-semibold text-indigo-200 ring-1 ring-white/10">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{name}</p>
                      <p className="truncate text-xs text-gray-500">@{username}</p>
                    </div>
                  </div>

                  {/* Follow toggle */}
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={() => toggleFollow(id)}
                    aria-label={isFollowing ? `Unfollow ${name}` : `Follow ${name}`}
                    className={`
                      shrink-0 rounded-2xl px-4 py-1.5 text-xs font-semibold transition-all duration-200
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20
                      ${isFollowing
                        ? "bg-transparent text-white ring-1 ring-white/20 hover:bg-red-500/10 hover:text-red-400 hover:ring-red-500/20"
                        : "bg-white text-black hover:bg-gray-100"
                      }
                    `}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={isFollowing ? "following" : "follow"}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{    opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.12 }}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                </div>

                {index < SUGGESTIONS.length - 1 && (
                  <div className="mx-4 h-px bg-white/[0.04]" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ul>

        <div className="px-4 py-3">
          <button className="text-xs text-indigo-400 transition-colors hover:text-indigo-300 focus-visible:outline-none">
            Show more
          </button>
        </div>
      </section>

    </aside>
  );
}