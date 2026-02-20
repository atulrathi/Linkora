import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, AtSign, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import axiosInstance from "../services/axiosInstance";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const getPasswordStrength = (password) => {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  if (score <= 1) return { label: "Weak",   color: "bg-red-500",     width: "25%"  };
  if (score === 2) return { label: "Fair",   color: "bg-amber-500",   width: "50%"  };
  if (score === 3) return { label: "Good",   color: "bg-emerald-400", width: "75%"  };
  return               { label: "Strong", color: "bg-emerald-500", width: "100%" };
};

/**
 * Register — Account creation page.
 *
 * POSTs { name, username, email, password } via the shared axiosInstance.
 * On success, navigates to /verify-email and passes the user's email
 * via router state so the OTP page can display it.
 */
export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", username: "", email: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors]                           = useState({});
  const [loading, setLoading]                         = useState(false);

  const strength = getPasswordStrength(form.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())
      e.name = "Full name is required.";
    if (!form.username.trim())
      e.username = "Username is required.";
    else if (!/^[a-z0-9_]{3,20}$/.test(form.username))
      e.username = "3–20 characters: lowercase letters, numbers, and underscores only.";
    if (!form.email.trim())
      e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email address.";
    if (!form.password)
      e.password = "Password is required.";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    if (!form.confirmPassword)
      e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await axiosInstance.post("/auth/register", {
        name:     form.name.trim(),
        username: form.username.trim(),
        email:    form.email.trim(),
        password: form.password,
      });

      // Registration succeeded — navigate to the OTP verification page.
      // The email is passed via router state so the OTP page can display it.
      navigate("/verify-email", { state: { email: form.email.trim() } });

    } catch (err) {
      const status = err.response?.status;
      const msg    = err.response?.data?.message ?? "";

      if (status === 409) {
        if (msg.toLowerCase().includes("email")) {
          setErrors({ email: "An account with this email address already exists." });
        } else if (msg.toLowerCase().includes("username")) {
          setErrors({ username: "This username is already taken. Please choose another." });
        } else {
          setErrors({ global: msg || "An account with these details already exists." });
        }
      } else if (status === 422) {
        setErrors({ global: msg || "Please check your details and try again." });
      } else if (err.code === "ERR_NETWORK" || !err.response) {
        setErrors({ global: "Unable to reach the server. Please check your connection and try again." });
      } else {
        setErrors({ global: msg || "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full rounded-xl border bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600
     transition-all duration-200 focus:bg-white/[0.06] focus:outline-none focus:ring-2
     ${hasError
       ? "border-red-500/40 focus:border-red-500/50 focus:ring-red-500/20"
       : "border-white/[0.07] focus:border-indigo-500/50 focus:ring-indigo-500/20"
     }`;

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
          <blockquote className="text-3xl font-semibold leading-snug tracking-tight text-white">
            "Your story starts<br />here."
          </blockquote>
          <p className="text-sm text-indigo-300/70">
            Create your account in seconds and join a growing community of people sharing what matters.
          </p>
        </div>

        <div className="relative flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-gray-600">linkora.app</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
      </div>

      {/* ── Right register form ───────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center px-6 py-16 lg:px-16">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-2 lg:hidden">
            <span className="text-xl font-bold tracking-tight text-white">Linkora</span>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">Create your account</h1>
            <p className="mt-2 text-sm text-gray-500">
              Join thousands of people already on Linkora.
            </p>
          </motion.div>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
          >
            {/* Global error banner */}
            {errors.global && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                <AlertCircle size={15} aria-hidden="true" className="shrink-0" />
                {errors.global}
              </motion.div>
            )}

            {/* Full name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-xs font-medium text-gray-400">Full name</label>
              <div className="relative">
                <User size={15} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input id="name" name="name" type="text" autoComplete="name"
                  placeholder="Jane Doe" value={form.name} onChange={handleChange}
                  className={inputClass(!!errors.name)} />
              </div>
              {errors.name && <FieldError message={errors.name} />}
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-xs font-medium text-gray-400">Username</label>
              <div className="relative">
                <AtSign size={15} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input id="username" name="username" type="text" autoComplete="username"
                  placeholder="jane_doe" value={form.username} onChange={handleChange}
                  className={inputClass(!!errors.username)} />
              </div>
              {errors.username
                ? <FieldError message={errors.username} />
                : <p className="text-[11px] text-gray-600">3–20 characters: lowercase letters, numbers, and underscores.</p>
              }
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-medium text-gray-400">Email address</label>
              <div className="relative">
                <Mail size={15} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input id="email" name="email" type="email" autoComplete="email"
                  placeholder="jane@example.com" value={form.email} onChange={handleChange}
                  className={inputClass(!!errors.email)} />
              </div>
              {errors.email && <FieldError message={errors.email} />}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-medium text-gray-400">Password</label>
              <div className="relative">
                <Lock size={15} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input id="password" name="password" autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={form.password} onChange={handleChange}
                  className={`${inputClass(!!errors.password)} pr-11`} />
                <ToggleVisibility show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
              </div>
              {strength && (
                <div className="space-y-1">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      className={`h-full rounded-full ${strength.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: strength.width }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Strength:{" "}
                    <span className={`font-medium ${
                      strength.label === "Weak" ? "text-red-400" :
                      strength.label === "Fair" ? "text-amber-400" : "text-emerald-400"
                    }`}>{strength.label}</span>
                  </p>
                </div>
              )}
              {errors.password && <FieldError message={errors.password} />}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-400">
                Confirm password
              </label>
              <div className="relative">
                <Lock size={15} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input id="confirmPassword" name="confirmPassword" autoComplete="new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword} onChange={handleChange}
                  className={`${inputClass(!!errors.confirmPassword)} pr-11`} />
                <ToggleVisibility show={showConfirmPassword} onToggle={() => setShowConfirmPassword((v) => !v)} />
              </div>
              {form.confirmPassword && form.password === form.confirmPassword && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <CheckCircle2 size={11} aria-hidden="true" /> Passwords match
                </motion.p>
              )}
              {errors.confirmPassword && <FieldError message={errors.confirmPassword} />}
            </div>

            {/* Submit */}
            <motion.button
              type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
              className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating your account…
                </span>
              ) : "Create account"}
            </motion.button>

          </motion.form>

          <motion.p variants={itemVariants} className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="font-medium text-indigo-400 transition-colors hover:text-indigo-300">
              Sign in
            </Link>
          </motion.p>

        </motion.div>
      </div>

    </div>
  );
}

function FieldError({ message }) {
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-[11px] text-red-400">
      <AlertCircle size={11} aria-hidden="true" className="shrink-0" />
      {message}
    </motion.p>
  );
}

function ToggleVisibility({ show, onToggle }) {
  return (
    <button type="button" onClick={onToggle}
      aria-label={show ? "Hide password" : "Show password"}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 transition-colors hover:text-gray-400 focus-visible:outline-none">
      {show ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
    </button>
  );
}