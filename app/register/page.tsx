
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Heart,
  User,
  Mail,
  Lock,
  Camera,
  Eye,
  EyeOff,
  ArrowRight,
  Leaf,
} from "lucide-react";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (!fullName.trim() || !email.trim() || !photoURL.trim() || !password) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      setMessageType("error");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setMessage("Password must contain at least one uppercase letter.");
      setMessageType("error");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setMessage("Password must contain at least one lowercase letter.");
      setMessageType("error");
      return;
    }

    setMessage(
      "Registration form validated. Authentication will be connected in the next step."
    );
    setMessageType("success");
  };

  return (
    <main className="min-h-screen bg-[#f7faf7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[850px] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">

        {/* Left Section */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#064e3b] via-[#087653] to-[#10a36c] p-12 text-white lg:flex">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-white/10" />

          <Link href="/" className="relative z-10 flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-2.5">
              <Heart size={25} fill="white" />
            </div>
            <span className="text-2xl font-bold">TogetherWe</span>
          </Link>

          <div className="relative z-10 max-w-md">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
              <Leaf size={16} />
              Join our community
            </div>

            <h1 className="text-5xl font-bold leading-tight">
              Small actions.
              <br />
              Big changes.
            </h1>

            <p className="mt-6 text-lg leading-8 text-green-50">
              Create an account and become part of a community that works
              together to make positive changes in society.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Discover meaningful volunteer opportunities",
                "Connect with people in your community",
                "Make a positive impact together",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm">
                    ✓
                  </span>
                  <span className="text-green-50">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-sm text-green-100">
            Together, we can build a better tomorrow.
          </p>
        </section>

        {/* Right Section */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">

            <Link
              href="/"
              className="mb-8 flex items-center justify-center gap-2 lg:hidden"
            >
              <Heart className="text-emerald-700" size={26} fill="currentColor" />
              <span className="text-2xl font-bold text-gray-900">
                TogetherWe
              </span>
            </Link>

            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-700">
                Get started today
              </p>

              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-3 text-gray-500">
                Join TogetherWe and start making a difference.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Profile Photo URL
                </label>

                <div className="relative">
                  <Camera
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="url"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-12 text-gray-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  At least 6 characters, including uppercase and lowercase letters.
                </p>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm ${
                    messageType === "error"
                      ? "border border-red-200 bg-red-50 text-red-700"
                      : "border border-green-200 bg-green-50 text-green-700"
                  }`}
                  role="status"
                >
                  {message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800"
              >
                Create Account
                <ArrowRight size={19} />
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm text-gray-400">Or sign up with</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setMessage("Google authentication is not connected yet.");
                  setMessageType("error");
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.73 7.18l7.72 5.99c4.51-4.18 7.05-10.34 7.05-17.64Z" />
                  <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.82l-7.72-5.99c-2.14 1.44-4.89 2.29-8.19 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z" />
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={() => {
                  setMessage("GitHub authentication is not connected yet.");
                  setMessageType("error");
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                  aria-hidden="true"
                >
                  <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.51-1.3-1.24-1.65-1.24-1.65-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.47-.28-5.06-1.24-5.06-5.51 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.56 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.28-2.6 5.23-5.08 5.5.4.35.75 1.02.75 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
                </svg>
                GitHub
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-5 text-center text-xs text-gray-400">
              By creating an account, you agree to our community guidelines.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
