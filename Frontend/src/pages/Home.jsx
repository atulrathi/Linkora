import { motion } from "framer-motion";

import Sidebar from "../components/layout/Sidebar";
import RightPanel from "../components/layout/RightPanel";
import PostCard from "../components/PostCard";

/** Placeholder posts — replace with real data from your API or state. */
const MOCK_POSTS = [{ id: 1 }, { id: 2 }, { id: 3 }];

/**
 * Home — The main feed page.
 *
 * Renders a three-column layout: a left sidebar for navigation,
 * a central post feed, and a right panel for suggestions or trending
 * content. The sidebar and right panel collapse on smaller screens.
 * Bottom padding is handled globally in App.jsx to clear the mobile
 * bottom navigation bar.
 */
export default function Home() {
  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 pt-6 sm:px-6">

      {/* Left sidebar — hidden on mobile */}
      <Sidebar />

      {/* Central feed */}
      <main className="mx-auto w-full max-w-2xl flex-1">

        {/* Feed header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Your Feed</h2>
          <p className="text-sm text-gray-500">
            Catch up on the latest posts from people you follow.
          </p>
        </div>

        {/* Post list */}
        <div className="space-y-4 pb-20">
          {MOCK_POSTS.map(({ id }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
            >
              <PostCard />
            </motion.div>
          ))}
        </div>

      </main>

      {/* Right panel — hidden on tablet and mobile */}
      <RightPanel />

    </div>
  );
}