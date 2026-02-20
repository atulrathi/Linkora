import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ShieldCheck, AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";
import axiosInstance from "../services/axiosInstance";

const OTP_LENGTH      = 6;
const RESEND_COOLDOWN = 60; // seconds

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};

/**
 * VerifyEmail — OTP verification page.
 *
 * POSTs { email, otp } to /auth/verify-otp via the shared axiosInstance.
 * The email is received via router state passed from the Register page.
 * On success, navigates the user to /home.
 */
export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  // Email is passed via router state from the Register page.
  const email = location.state?.email ?? "";

  const [otp, setOtp]             = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown]   = useState(0);

  const inputRefs = useRef([]);

  // Start the resend cooldown automatically on mount.
  useEffect(() => {
    startCooldown();
  }, []);

  // Tick the cooldown counter down every second.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const startCooldown = () => setCooldown(RESEND_COOLDOWN);

  /** Handles individual digit input and auto-advances focus. */
  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next  = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /** Handles backspace and arrow key navigation between digit fields. */
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft"  && index > 0)             inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  /** Handles pasting a full OTP code into the fields. */
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted    = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((char, i) => { next[i] = char; });
    setOtp(next);
    const lastIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/auth/verify-otp", {
        email,
        otp: code,
      });

      // Verification succeeded — show the success state then navigate.
      setSuccess(true);
      setTimeout(() => navigate("/home"), 1800);

    } catch (err) {
      const status = err.response?.status;
      const msg    = err.response?.data?.message ?? "";

      if (status === 400 || status === 401) {
        setError("The code you entered is incorrect or has expired. Please try again.");
      } else if (err.code === "ERR_NETWORK" || !err.response) {
        setError("Unable to reach the server. Please check your connection and try again.");
      } else {
        setError(msg || "Something went wrong. Please try again.");
      }

      // Clear the fields and refocus on the first input after an error.
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError("");
    setOtp(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
    try {
      await axiosInstance.post("/auth/resend-otp", { email });
      startCooldown();
    } catch (err) {
      const msg = err.response?.data?.message ?? "";
      setError(msg || "Failed to resend the code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const isFilled = otp.every((d) => d !== "");

  return (
    <div className="relative flex min-h-screen">

      {/* ── Left decorative panel ─────────────────────────────────── */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-indigo-950/40 p-12 lg:flex">
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[100px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-20 h-[350px] w-[350px] rounded-full bg-violet-700/20 blur-[100px]" />

        <div className="relative">
          <span className="text-2xl font-bold tracking-tight text-white">Linkora</span>
        </div>

        <div className="relative space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
            <ShieldCheck size={28} className="text-indigo-400" aria-hidden="true" />
          </div>
          <blockquote className="text-3xl font-semibold leading-snug tracking-tight text-white">
            "One step away<br />from your community."
          </blockquote>
          <p className="text-sm text-indigo-300/70">
            We sent a verification code to your email. Enter it to confirm your account and get started.
          </p>
        </div>

        <div className="relative flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-gray-600">linkora.app</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
      </div>

      {/* ── Right OTP form ────────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center px-6 py-16 lg:px-16">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Mobile brand */}
          <motion.div variants={itemVariants} className="mb-2 lg:hidden">
            <span className="text-xl font-bold tracking-tight text-white">Linkora</span>
          </motion.div>

          {/* Email icon badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
              <Mail size={24} className="text-indigo-400" aria-hidden="true" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Check your email</h1>
          </motion.div>
          <motion.p variants={itemVariants} className="mb-8 text-sm text-gray-500">
            We sent a 6-digit verification code to{" "}
            <span className="font-medium text-gray-300">{email || "your email address"}</span>.
            Enter it below to verify your account.
          </motion.p>

          {/* Success state */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-8 text-center"
              >
                <CheckCircle2 size={36} className="text-emerald-400" aria-hidden="true" />
                <p className="text-base font-semibold text-white">Email verified!</p>
                <p className="text-sm text-gray-500">Taking you to your feed…</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!success && (
            <form onSubmit={handleVerify} noValidate>

              {/* Error banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-5 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                  >
                    <AlertCircle size={15} aria-hidden="true" className="mt-0.5 shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* OTP digit inputs */}
              <motion.div
                variants={itemVariants}
                className="mb-6 flex justify-between gap-2 sm:gap-3"
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
                    whileFocus={{ scale: 1.06 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className={`
                      h-14 w-full max-w-[56px] rounded-xl border text-center text-xl font-bold
                      text-white caret-transparent outline-none transition-all duration-200
                      focus:ring-2 sm:h-16 sm:text-2xl
                      ${digit
                        ? "border-indigo-500/60 bg-indigo-500/10 shadow-[0_0_16px_rgba(99,102,241,0.2)] focus:border-indigo-400/80 focus:ring-indigo-500/30"
                        : "border-white/[0.07] bg-white/[0.04] focus:border-indigo-500/50 focus:ring-indigo-500/20"
                      }
                    `}
                  />
                ))}
              </motion.div>

              {/* Verify button */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading || !isFilled}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Verifying…
                  </span>
                ) : "Verify email"}
              </motion.button>

              {/* Resend code */}
              <motion.div variants={itemVariants} className="mt-6 text-center">
                {cooldown > 0 ? (
                  <p className="text-sm text-gray-600">
                    Resend code in{" "}
                    <span className="tabular-nums text-gray-400">
                      0:{String(cooldown).padStart(2, "0")}
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="inline-flex items-center gap-1.5 text-sm text-indigo-400 transition-colors hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none"
                  >
                    <RotateCcw size={13} aria-hidden="true" className={resending ? "animate-spin" : ""} />
                    {resending ? "Sending…" : "Resend code"}
                  </button>
                )}
              </motion.div>

              {/* Wrong email hint */}
              <motion.p variants={itemVariants} className="mt-3 text-center text-xs text-gray-700">
                Wrong email address?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-gray-500 underline underline-offset-2 transition-colors hover:text-gray-300 focus-visible:outline-none"
                >
                  Go back and change it
                </button>
              </motion.p>

            </form>
          )}

        </motion.div>
      </div>

    </div>
  );
}