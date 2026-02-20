import { Link, useLocation } from "react-router-dom";
import { Compass, TrendingUp, Bookmark, Settings } from "lucide-react";

import Card from "../ui/Card";

/** Sidebar navigation items — extend as new pages are added. */
const NAV_ITEMS = [
  { path: "/explore",   icon: Compass,    label: "Explore"   },
  { path: "/trending",  icon: TrendingUp, label: "Trending"  },
  { path: "/bookmarks", icon: Bookmark,   label: "Bookmarks" },
  { path: "/settings",  icon: Settings,   label: "Settings"  },
];

/**
 * Sidebar — Secondary navigation panel.
 *
 * Renders quick-access links to key sections of the app.
 * Visible on large screens and above.
 */
export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <Card>
        {/* Panel header */}
        <div className="mb-5">
          <h2 className="text-base font-semibold text-white">Navigation</h2>
          <p className="mt-0.5 text-xs text-gray-500">Quick access to key sections.</p>
        </div>

        {/* Nav link list */}
        <nav aria-label="Sidebar navigation">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
              const active = pathname === path;

              return (
                <li key={path}>
                  <Link
                    to={path}
                    aria-current={active ? "page" : undefined}
                    className={`
                      group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                      transition-all duration-200 focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-indigo-500/60
                      ${active
                        ? "bg-indigo-500/10 text-indigo-300 ring-1 ring-inset ring-indigo-500/20"
                        : "text-gray-400 hover:bg-white/[0.05] hover:text-gray-200"
                      }
                    `}
                  >
                    <Icon
                      size={16}
                      strokeWidth={active ? 2.5 : 2}
                      aria-hidden="true"
                      className={`transition-colors duration-200 ${
                        active ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-300"
                      }`}
                    />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Divider */}
        <div className="my-5 border-t border-white/[0.06]" />

        {/* User profile snapshot */}
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ring-white/[0.06]">
          <div
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/40 to-violet-600/40 text-sm font-semibold text-indigo-200 ring-1 ring-white/10"
          >
            A
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">Your Name</p>
            <p className="truncate text-xs text-gray-500">@ar</p>
          </div>
        </div>
      </Card>
    </aside>
  );
}