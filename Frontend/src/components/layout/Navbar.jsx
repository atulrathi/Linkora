import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Home, MessageCircle, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../services/axiosInstance";

/**
 * Navbar — Global navigation component
 */
export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const username = pathname.split("/")[2];

  const [loggingOut, setLoggingOut] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const NAV_ITEMS = [
    { path: `/home/${username}`, icon: Home, label: "Feed" },
    { path: `/messages/${username}`, icon: MessageCircle, label: "Messages" },
    { path: `/profile/${username}`, icon: User, label: "Profile" },
  ];

  const isActive = (path) =>
    path.startsWith("/profile")
      ? pathname.startsWith("/profile")
      : pathname === path;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.log("Logout error ignored");
    } finally {
      setLoggingOut(false);
      setShowConfirm(false);
      navigate("/");
    }
  };

  return (
    <>
      {/* ── Desktop Navigation ───────────────────────── */}
      <header className="sticky top-0 z-20 hidden border-b border-white/[0.06] bg-white/[0.03] backdrop-blur-xl md:block lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

          {/* Logo */}
          <Link to={`/home/${username}`} className="group flex items-center gap-2">
            <span className="relative text-xl font-bold tracking-tight text-white">
              Linkora
              <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 rounded-full bg-indigo-400 transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>

          <div className="flex items-center gap-3">

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
                const active = isActive(path);

                return (
                  <Link
                    key={path}
                    to={path}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200
                    ${
                      active
                        ? "bg-indigo-500/10 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.25)]"
                        : "text-gray-400 hover:bg-white/[0.06] hover:text-gray-200"
                    }`}
                  >
                    <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                    <span>{label}</span>

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

            {/* Divider */}
            <div className="h-5 w-px bg-white/[0.08]" />

            {/* Logout */}
            <div className="relative">
              <button
                onClick={() => setShowConfirm((v) => !v)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>

              <AnimatePresence>
                {showConfirm && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/[0.07] bg-[#0f1623] p-4 shadow-2xl"
                  >
                    <p className="mb-1 text-sm font-medium text-white">Sign out?</p>
                    <p className="mb-4 text-xs text-gray-500">
                      You will be returned to login page.
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 rounded-xl border border-white/[0.07] py-2 text-xs text-gray-400 hover:bg-white/[0.05]"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-500/10 py-2 text-xs text-red-400 hover:bg-red-500/20 disabled:opacity-60"
                      >
                        {loggingOut ? "Signing out…" : "Sign out"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </header>

      {/* ── Mobile Bottom Navbar ─────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 flex justify-around border-t border-white/[0.06] bg-[#090e1a]/80 px-2 py-3 backdrop-blur-xl md:hidden">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const active = isActive(path);

          return (
            <Link
              key={path}
              to={path}
              className="relative flex flex-col items-center gap-1 px-4 py-1"
            >
              {active && (
                <motion.span
                  layoutId="mobile-nav-indicator"
                  className="absolute inset-0 rounded-2xl bg-indigo-500/10"
                />
              )}

              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.75}
                className={`relative z-10 ${
                  active ? "text-indigo-400" : "text-gray-500"
                }`}
              />

              <span
                className={`text-[10px] font-medium ${
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