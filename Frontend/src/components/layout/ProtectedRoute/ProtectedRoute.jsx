import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../services/axiosInstance";

/**
 * ProtectedRoute — Guards authenticated-only pages.
 *
 * Verifies the session by calling /auth/me. While the check is in
 * flight a branded full-screen loader is shown. If the session is
 * invalid the user is redirected to the login page.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState("checking");
  // "checking" | "authenticated" | "unauthenticated"

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        await axiosInstance.get("/auth/me");
        if (!cancelled) setStatus("authenticated");
      } catch {
        if (!cancelled) setStatus("unauthenticated");
      }
    };

    checkAuth();
    return () => { cancelled = true; };
  }, []);

  if (status === "unauthenticated") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <>
      {/* Full-screen loader — shown while session is being verified */}
      <AnimatePresence>
        {status === "checking" && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090e1a]"
          >
            {/* Ambient glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[100px]"
            />

            <div className="relative flex flex-col items-center gap-6">
              {/* Logo mark */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex items-center gap-2"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-400" aria-hidden="true" />
                <span className="text-2xl font-bold tracking-tight text-white">Linkora</span>
              </motion.div>

              {/* Animated dots */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-1.5"
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>

              {/* Label */}
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-gray-600"
              >
                Verifying your session…
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content — rendered beneath the loader */}
      {status === "authenticated" && children}
    </>
  );
}