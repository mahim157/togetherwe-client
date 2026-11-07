
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Leaf,
  Loader2,
  Users,
  Sparkles,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const isAuthenticating = loading || googleLoading || githubLoading;

  // Email and Password Login
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim() || !password.trim()) {
      setMessageType("error");
      setMessage("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessageType("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessageType("error");
        setMessage(error.message || "Invalid email or password.");
        return;
      }

      setMessageType("success");
      setMessage("Login successful! Redirecting...");

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      setMessageType("error");
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      setMessage("");
      setGoogleLoading(true);

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000/",
        errorCallbackURL: "http://localhost:3000/login",
      });

      if (error) {
        console.error("Google login error:", error);
        setMessageType("error");
        setMessage(error.message || "Google login failed. Please try again.");
        setGoogleLoading(false);
      }
    } catch (error) {
      console.error("Google login error:", error);

      setMessageType("error");
      setMessage("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  // GitHub Login
  const handleGitHubLogin = async () => {
    try {
      setMessage("");
      setGithubLoading(true);

      const { error } = await authClient.signIn.social({
        provider: "github",
        callbackURL: "http://localhost:3000/",
        errorCallbackURL: "http://localhost:3000/login",
      });

      if (error) {
        console.error("GitHub login error:", error);
        setMessageType("error");
        setMessage(error.message || "GitHub login failed. Please try again.");
        setGithubLoading(false);
      }
    } catch (error) {
      console.error("GitHub login error:", error);

      setMessageType("error");
      setMessage("GitHub login failed. Please try again.");
      setGithubLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#faf9f2] px-4 py-8 sm:px-6 lg:py-12">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#d5ea83]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[450px] w-[450px] rounded-full bg-[#719b4e]/10 blur-3xl" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[#e5e9dc] bg-white shadow-[0_25px_80px_rgba(23,76,56,0.10)] lg:min-h-[720px] lg:grid-cols-2">

        {/* Left Side */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#174c38] p-10 text-white lg:flex xl:p-14">

          {/* Decorative Shapes */}
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#d5ea83]/10 blur-2xl" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#719b4e]/20 blur-3xl" />

          <div className="absolute right-12 top-36 h-24 w-24 rounded-full border border-white/10" />
          <div className="absolute right-28 top-52 h-10 w-10 rounded-full bg-[#d5ea83]/20" />

          {/* Brand */}
          <Link
            href="/"
            className="relative flex w-fit items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d5ea83] text-[#174c38]">
              <Heart size={25} fill="currentColor" />
            </div>

            <span className="text-2xl font-bold tracking-tight">
              TogetherWe<span className="text-[#d5ea83]">.</span>
            </span>
          </Link>

          {/* Main Content */}
          <div className="relative my-12 max-w-lg">

            <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#d5ea83]">
              <Leaf size={34} />
            </div>

            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#d5ea83]">
              Together We Grow
            </p>

            <h1 className="text-4xl font-bold leading-[1.2] xl:text-5xl">
              Small Actions.
              <br />
              <span className="text-[#d5ea83]">
                Big Changes.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-[#dce9dd]">
              Join a community of people who believe in kindness,
              compassion, and creating a better future together.
            </p>

            {/* Community Highlight */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm">

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d5ea83]/15 text-[#d5ea83]">
                  <Users size={25} />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    Stronger Communities
                  </p>
                  <p className="mt-1 text-sm text-[#c4d8c8]">
                    Making a positive impact together.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex -space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#174c38] bg-[#d5ea83] text-xs font-bold text-[#174c38]">
                    V
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#174c38] bg-[#e8b9a5] text-xs font-bold text-[#693c2d]">
                    C
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#174c38] bg-[#b9d7e8] text-xs font-bold text-[#23465c]">
                    T
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#174c38] bg-white text-xs font-bold text-[#174c38]">
                    +
                  </div>
                </div>

                <p className="text-xs text-[#dce9dd]">
                  Every contribution matters.
                </p>
              </div>
            </div>

            {/* Decorative Text */}
            <div className="mt-8 flex items-center gap-2 text-sm text-[#d5ea83]">
              <Sparkles size={17} />
              Be part of something meaningful.
            </div>
          </div>

          {/* Footer */}
          <p className="relative text-sm text-[#c4d8c8]">
            © 2026 TogetherWe. All rights reserved.
          </p>
        </section>

        {/* Right Side */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-14 xl:px-16">

          <div className="w-full max-w-md">

            {/* Mobile Brand */}
            <Link
              href="/"
              className="mb-10 flex w-fit items-center gap-3 lg:hidden"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#174c38] text-[#d5ea83]">
                <Heart size={23} fill="currentColor" />
              </div>

              <span className="text-xl font-bold text-[#174c38]">
                TogetherWe<span className="text-[#719b4e]">.</span>
              </span>
            </Link>

            {/* Heading */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#eef3df] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#456c36]">
                <Leaf size={14} />
                Welcome Back
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#173f2c] sm:text-4xl">
                Login to your account
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#778478]">
                Welcome back! Enter your details to continue making
                a positive difference in your community.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="mt-9 space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#294b37]"
                >
                  Email Address
                </label>

                <div className="group relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a394] transition group-focus-within:text-[#174c38]"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    disabled={isAuthenticating}
                    className="w-full rounded-xl border border-[#e5e9dc] bg-[#fafbf7] py-3.5 pl-12 pr-4 text-sm text-[#173f2c] outline-none transition placeholder:text-[#a0aa9e] focus:border-[#719b4e] focus:bg-white focus:ring-4 focus:ring-[#d5ea83]/25 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#294b37]"
                >
                  Password
                </label>

                <div className="group relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a394] transition group-focus-within:text-[#174c38]"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isAuthenticating}
                    className="w-full rounded-xl border border-[#e5e9dc] bg-[#fafbf7] py-3.5 pl-12 pr-12 text-sm text-[#173f2c] outline-none transition placeholder:text-[#a0aa9e] focus:border-[#719b4e] focus:bg-white focus:ring-4 focus:ring-[#d5ea83]/25 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a394] transition hover:text-[#174c38]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Message */}
              {message && (
                <div
                  role="alert"
                  aria-live="polite"
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    messageType === "success"
                      ? "border-[#d5e8c4] bg-[#f0f7e9] text-[#456c36]"
                      : "border-red-100 bg-red-50 text-red-600"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#174c38] py-3.5 font-semibold text-white shadow-lg shadow-[#174c38]/15 transition hover:bg-[#246647] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login to Account
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e5e9dc]" />

              <span className="text-xs font-medium uppercase tracking-wider text-[#98a397]">
                Or continue with
              </span>

              <div className="h-px flex-1 bg-[#e5e9dc]" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isAuthenticating}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-[#e5e9dc] bg-white py-3 font-semibold text-[#294b37] transition hover:border-[#719b4e] hover:bg-[#f7faf2] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {googleLoading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Connecting to Google...
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 48 48"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.07 13.22l7.98 6.19C12.72 13.72 17.91 9.5 24 9.5z"
                      transform="translate(0 5)"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.93 46.98 31.76 46.98 24.55z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.05 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19z"
                      transform="translate(0 5)"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.9 2.3-8.18 2.3-6.09 0-11.28-4.22-12.95-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48z"
                      transform="translate(0 -5)"
                    />
                  </svg>

                  Continue with Google
                </>
              )}
            </button>

            {/* GitHub Login */}
            <button
              type="button"
              onClick={handleGitHubLogin}
              disabled={isAuthenticating}
              className="mt-3 flex w-full items-center justify-center gap-3 rounded-full border border-[#e5e9dc] bg-white py-3 font-semibold text-[#294b37] transition hover:border-[#719b4e] hover:bg-[#f7faf2] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {githubLoading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Connecting to GitHub...
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.51-1.3-1.24-1.65-1.24-1.65-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.47-.28-5.06-1.24-5.06-5.51 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.56 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.28-2.6 5.23-5.08 5.5.4.35.75 1.02.75 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
                  </svg>

                  Continue with GitHub
                </>
              )}
            </button>

            {/* Register Link */}
            <p className="mt-8 text-center text-sm text-[#778478]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-[#174c38] transition hover:text-[#719b4e]"
              >
                Create an account
              </Link>
            </p>

            {/* Back to Home */}
            <Link
              href="/"
              className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-[#98a397] transition hover:text-[#174c38]"
            >
              <ArrowRight size={15} className="rotate-180" />
              Back to Home
            </Link>

          </div>
        </section>
      </div>
    </main>
  );
}
