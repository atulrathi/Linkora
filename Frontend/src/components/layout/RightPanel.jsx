import { useState } from "react";
import { UserPlus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Card from "../ui/Card";

/** Suggested accounts — replace with real API data. */
const SUGGESTED_USERS = [
  { id: 1, username: "samira",   displayName: "Samira K.",    mutuals: 4  },
  { id: 2, username: "jordan",   displayName: "Jordan Lee",   mutuals: 2  },
  { id: 3, username: "priya_d",  displayName: "Priya Desai",  mutuals: 7  },
  { id: 4, username: "marcello", displayName: "Marcello R.",  mutuals: 1  },
];

/**
 * RightPanel — Suggested accounts sidebar.
 *
 * Displays a "Who to Follow" card with follow/unfollow toggles.
 * Visible only on extra-large screens.
 */
export default function RightPanel() {
  const [followed, setFollowed] = useState(new Set());

  const toggleFollow = (id) =>
    setFollowed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <aside className="hidden w-72 shrink-0 xl:block">
      <Card>
        {/* Panel header */}
        <div className="mb-5">
          <h2 className="text-base font-semibold text-white">Who to Follow</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            People you might know based on your activity.
          </p>
        </div>

        {/* Suggested user list */}
        <ul className="space-y-3">
          {SUGGESTED_USERS.map(({ id, username, displayName, mutuals }) => {
            const isFollowing = followed.has(id);

            return (
              <li key={id} className="flex items-center justify-between gap-3">

                {/* Avatar placeholder + user info */}
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/40 to-violet-600/40 text-sm font-semibold text-indigo-200 ring-1 ring-white/10"
                  >
                    {displayName[0]}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {displayName}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      @{username} · {mutuals} mutual{mutuals !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Follow / Following toggle */}
                <motion.button
                  onClick={() => toggleFollow(id)}
                  whileTap={{ scale: 0.92 }}
                  aria-label={isFollowing ? `Unfollow ${displayName}` : `Follow ${displayName}`}
                  className={`
                    flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium
                    ring-1 transition-all duration-200 focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-indigo-500/60
                    ${isFollowing
                      ? "bg-white/5 text-gray-400 ring-white/10 hover:bg-red-500/10 hover:text-red-400 hover:ring-red-500/20"
                      : "bg-indigo-500/10 text-indigo-300 ring-indigo-500/20 hover:bg-indigo-500/20"
                    }
                  `}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isFollowing ? (
                      <motion.span
                        key="following"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-1"
                      >
                        <Check size={11} aria-hidden="true" />
                        Following
                      </motion.span>
                    ) : (
                      <motion.span
                        key="follow"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-1"
                      >
                        <UserPlus size={11} aria-hidden="true" />
                        Follow
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

              </li>
            );
          })}
        </ul>

        {/* Footer link */}
        <button className="mt-5 w-full text-center text-xs text-indigo-400 transition-colors hover:text-indigo-300">
          View more suggestions
        </button>
      </Card>
    </aside>
  );
}