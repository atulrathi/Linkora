import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, Bell, Mail, Bookmark, User, PenSquare, LogOut, MoreHorizontal, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../services/axiosInstance";

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const popoverRef = useRef(null);
  const username = pathname.split("/")[2];

  const NAV_ITEMS = [
    { path: `/home/${username}`, icon: Home, label: "Home" },
    { path: "/explore", icon: Compass, label: "Explore" },
    { path: "/notifications", icon: Bell, label: "Notifications", badge: 3 },
    { path: `/messages/${username}`, icon: Mail, label: "Messages" },
    { path: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
    { path: `/profile/${username}`, icon: User, label: "Profile" },
  ];

  const [showLogout, setShowLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (path) =>
    path.startsWith("/profile")
      ? pathname.startsWith("/profile")
      : pathname === path;

  // Close popover on outside click
  useEffect(() => {
    if (!showLogout) return;
    const handler = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowLogout(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showLogout]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // proceed regardless
    } finally {
      localStorage.removeItem("token");
      setLoggingOut(false);
      setShowLogout(false);
      navigate("/");
    }
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
  };

  const itemVariants = {
    hidden:  { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: "easeOut" } },
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-white/[0.05] bg-[#070c18] px-3 py-5 lg:flex xl:w-[17rem]">

      {/* ── Top section ── */}
      <div className="flex flex-col gap-0.5">

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Link
            to="/home"
            className="mb-4 flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.03] focus-visible:outline-none"
          >
            <div className="relative flex h-7 w-7 items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-indigo-500/20 blur-sm" />
              <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
                <span className="text-[11px] font-black tracking-tighter text-white">L</span>
              </div>
            </div>
            <span className="text-[17px] font-bold tracking-tight text-white">Linkora</span>
          </Link>
        </motion.div>

        {/* Nav links */}
        <motion.nav
          aria-label="Sidebar navigation"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-0.5"
        >
          {NAV_ITEMS.map(({ path, icon: Icon, label, badge }) => {
            const active = isActive(path);
            const iconClass = active
              ? "text-white"
              : "text-gray-500 group-hover:text-gray-200";
            const linkClass = active
              ? "bg-white/[0.07] text-white"
              : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-100";

            return (
              <motion.div key={path} variants={itemVariants}>
                <Link
                  to={path}
                  aria-current={active ? "page" : undefined}
                  className={
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14.5px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 " +
                    linkClass
                  }
                >
                  {/* Animated active left bar */}
                  {active && (
                    <motion.span
                      layoutId="nav-active-bar"
                      className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-indigo-500"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}

                  {/* Icon + badge dot */}
                  <div className="relative">
                    <Icon
                      size={19}
                      strokeWidth={active ? 2.4 : 1.9}
                      aria-hidden="true"
                      className={"transition-colors duration-150 " + iconClass}
                    />
                    {badge > 0 && !active && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-bold text-white ring-2 ring-[#070c18]">
                        {badge > 9 ? "9+" : badge}
                      </span>
                    )}
                  </div>

                  <span>{label}</span>

                  {/* Inline badge pill when route is active */}
                  {badge > 0 && active && (
                    <span className="ml-auto rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                      {badge}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        {/* New Post button */}
        <motion.button
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.28 }}
          whileTap={{ scale: 0.97 }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
        >
          <PenSquare size={15} strokeWidth={2.2} aria-hidden="true" />
          New Post
        </motion.button>
      </div>

      {/* ── Bottom: User card + logout popover ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.3 }}
        className="relative"
        ref={popoverRef}
      >
        {/* Logout confirmation popover */}
        <AnimatePresence>
          {showLogout && (
            <motion.div
              key="logout-popover"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 0.96, y: 8  }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="absolute bottom-full left-0 mb-2.5 w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c1220] shadow-2xl shadow-black/70"
            >
              {/* Red accent stripe */}
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

              <div className="p-4">
                {/* Header row */}
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
                    <LogOut size={14} className="text-red-400" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Sign out of Linkora?</p>
                    <p className="text-[11px] text-gray-500">You will be returned to login.</p>
                  </div>
                </div>

                <div className="mb-3 h-px w-full bg-white/[0.05]" />

                {/* Action buttons */}
                <div className="flex flex-col gap-1.5">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-2.5 text-xs font-semibold text-red-400 ring-1 ring-red-500/20 transition-all hover:bg-red-500/[0.18] hover:ring-red-500/40 disabled:opacity-60 focus-visible:outline-none"
                  >
                    {loggingOut
                      ? <Loader2 size={13} className="animate-spin" aria-hidden="true" />
                      : <LogOut size={13} aria-hidden="true" />
                    }
                    {loggingOut ? "Signing out…" : "Yes, sign me out"}
                  </motion.button>

                  <button
                    onClick={() => setShowLogout(false)}
                    className="w-full rounded-xl py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-white/[0.04] hover:text-gray-300 focus-visible:outline-none"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User card — click to toggle logout */}
        <button
          onClick={() => setShowLogout((v) => !v)}
          aria-label="Account options"
          className={
            "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10 " +
            (showLogout
              ? "bg-white/[0.06] ring-1 ring-white/[0.07]"
              : "hover:bg-white/[0.04]")
          }
        >
          {/* Avatar with online dot */}
          <div className="relative shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/60 to-violet-600/60 text-sm font-bold text-white ring-2 ring-white/10">
              {username ? username.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070c18]" />
          </div>

          {/* Name + @username */}
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-[13px] font-semibold text-white">
              {username ?? "User"}
            </p>
            <p className="truncate text-[11px] text-gray-500">
              {"@" + (username ?? "user")}
            </p>
          </div>

          {/* More icon */}
          <MoreHorizontal
            size={16}
            aria-hidden="true"
            className={
              "shrink-0 transition-colors duration-150 " +
              (showLogout ? "text-white" : "text-gray-600 group-hover:text-gray-400")
            }
          />
        </button>
      </motion.div>
    </aside>
  );
}