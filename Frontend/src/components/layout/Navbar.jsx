import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, User } from "lucide-react";
import { motion } from "framer-motion";

/** Navigation items shared between desktop and mobile layouts. */
const NAV_ITEMS = [
  { path: "/",            icon: Home,          label: "Feed"     },
  { path: "/messages",    icon: MessageCircle, label: "Messages" },
  { path: "/profile/ar",  icon: User,          label: "Profile"  },
];

/**
 * Navbar — Global navigation component.
 *
 * Renders a sticky top bar on desktop and a fixed bottom tab bar on
 * mobile. The active route is highlighted with a soft glow indicator.
 */
export default function Navbar() {
  const { pathname } = useLocation();

  /**
   * Returns true when the given path matches the current route.
   * Profile links use a prefix match to cover dynamic segments such
   * as `/profile/:username`.
   */
  const isActive = (path) =>
    path.startsWith("/profile")
      ? pathname.startsWith("/profile")
      : pathname === path;

  return (
    <>
      {/* ── Desktop Navigation Bar ─────────────────────────────────── */}
      <header className="sticky top-0 z-20 hidden border-b border-white/[0.06] bg-white/[0.03] backdrop-blur-xl md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

          {/* Brand wordmark */}
          <Link to="/" className="group flex items-center gap-2">
            <span className="relative text-xl font-bold tracking-tight text-white">
              Linkora
              <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 rounded-full bg-indigo-400 transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav aria-label="Primary navigation" className="flex items-center gap-1">
            {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  aria-current={active ? "page" : undefined}
                  className={`
                    relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium
                    transition-all duration-200 focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-indigo-500/60
                    ${active
                      ? "bg-indigo-500/10 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.25)]"
                      : "text-gray-400 hover:bg-white/[0.06] hover:text-gray-200"
                    }
                  `}
                >
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                  <span>{label}</span>

                  {/* Active pill indicator */}
                  {active && (
                    <motion.span
                      layoutId="desktop-nav-indicator"
                      className="absolute inset-0 rounded-xl ring-1 ring-inset ring-indigo-500/20"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ── Mobile Bottom Tab Bar ──────────────────────────────────── */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-20 flex justify-around border-t border-white/[0.06] bg-[#090e1a]/80 px-2 py-3 backdrop-blur-xl md:hidden"
      >
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className="relative flex flex-col items-center gap-1 px-4 py-1"
            >
              {/* Active background pill */}
              {active && (
                <motion.span
                  layoutId="mobile-nav-indicator"
                  className="absolute inset-0 rounded-2xl bg-indigo-500/10"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}

              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.75}
                aria-hidden="true"
                className={`relative z-10 transition-colors duration-200 ${
                  active ? "text-indigo-400" : "text-gray-500"
                }`}
              />
              <span
                className={`relative z-10 text-[10px] font-medium tracking-wide transition-colors duration-200 ${
                  active ? "text-indigo-400" : "text-gray-600"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}