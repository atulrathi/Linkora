import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home        from "./pages/Home";
import Messages    from "./pages/Messages";
import Profile     from "./pages/Profile";
import Login       from "./pages/Login";
import Register    from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Navbar      from "./components/layout/Navbar";

/**
 * Routes on which the global navbar should not be rendered.
 * Auth and verification pages use a full-screen, immersive layout.
 */
const AUTH_ROUTES = ["/", "/register", "/verify-email"];

/**
 * AppLayout — Conditionally renders the Navbar.
 *
 * Auth pages (login, register, email verification) use a full-screen
 * layout with no navigation bar. All other pages receive the standard
 * navbar shell.
 */
function AppLayout() {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}

      <main className={`relative z-10 ${isAuthPage ? "" : "pb-24 md:pb-0"}`}>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Auth routes — full screen, no navbar */}
            <Route path="/"             element={<Login />}       />
            <Route path="/register"     element={<Register />}    />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* App routes — with navbar */}
            <Route path="/home"              element={<Home />}     />
            <Route path="/messages"          element={<Messages />} />
            <Route path="/profile/:username" element={<Profile />}  />

            {/* Catch-all: redirect unknown routes to the login page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  );
}

/**
 * App — Root application component.
 *
 * Applies the global dark background, ambient glow effects, and
 * noise texture overlay before delegating to AppLayout for routing.
 */
function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090e1a] text-white">

      {/* Ambient background glow — top center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[140px]"
      />

      {/* Ambient background glow — bottom right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-700/10 blur-[120px]"
      />

      {/* Subtle noise texture overlay for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <Router>
        <AppLayout />
      </Router>

    </div>
  );
}

export default App;