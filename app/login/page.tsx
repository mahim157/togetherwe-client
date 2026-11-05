
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Leaf,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim() || !password.trim()) {
      setMessageType("error");
      setMessage("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessageType("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setMessageType("error");
    setMessage("Authentication is not connected yet. Please try again later.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7faf8] px-4 py-12">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl lg:grid-cols-2">

        {/* Left Side */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-12 text-white lg:flex">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

          <Link href="/" className="relative flex items-center gap-2 text-2xl font-bold">
            <Heart size={30} />
            TogetherWe
          </Link>

          <div className="relative max-w-md">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              <Leaf size={34} />
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              Together, We Can Make a Difference.
            </h1>

            <p className="mt-5 leading-8 text-green-50">
              Join a community of people who believe in kindness,
              compassion, and creating positive change.
            </p>

            <div className="mt-9 flex items-center gap-3">
              <div className="flex -space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-600 bg-yellow-200 text-sm font-bold text-green-900">
                  V
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-600 bg-pink-200 text-sm font-bold text-pink-900">
                  C
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-600 bg-blue-200 text-sm font-bold text-blue-900">
                  T
                </div>
              </div>

              <p className="text-sm text-green-50">
                Making communities stronger together.
              </p>
            </div>
          </div>

          <p className="relative text-sm text-green-100">
            © 2026 TogetherWe. All rights reserved.
          </p>
        </section>

        {/* Right Side */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-14">
          <div className="w-full max-w-md">

            <Link
              href="/"
              className="mb-10 flex items-center gap-2 text-xl font-bold text-green-700 lg:hidden"
            >
              <Heart size={25} />
              TogetherWe
            </Link>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
                Welcome Back
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                Login to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Welcome back! Please enter your details to continue
                making a difference.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-9 space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-green-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Message */}
              {message && (
                <div
                  role="alert"
                  className={`rounded-xl px-4 py-3 text-sm ${
                    messageType === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
              >
                Login
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={() => {
                setMessageType("error");
                setMessage("Google authentication is not connected yet.");
              }}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3 font-semibold text-gray-700 transition hover:border-green-400 hover:bg-green-50"
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
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
            </button>

            {/* GitHub Button */}
<button
  type="button"
  onClick={() => {
    setMessageType("error");
    setMessage("GitHub authentication is not connected yet.");
  }}
  className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3 font-semibold text-gray-700 transition hover:border-green-400 hover:bg-green-50"
>
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5 fill-current"
    aria-hidden="true"
  >
    <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.51-1.3-1.24-1.65-1.24-1.65-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.47-.28-5.06-1.24-5.06-5.51 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.56 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.28-2.6 5.23-5.08 5.5.4.35.75 1.02.75 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
  </svg>

  Continue with GitHub
</button>
            {/* Register Link */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-green-700 transition hover:text-green-800"
              >
                Create an account
              </Link>
            </p>

            <Link
              href="/"
              className="mt-6 block text-center text-sm font-medium text-gray-400 transition hover:text-green-700"
            >
              ← Back to Home
            </Link>

          </div>
        </section>
      </div>
    </main>
  );
}
