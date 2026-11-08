
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  const isAuthenticating = loading || socialLoading !== "";

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhotoURL = photoURL.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhotoURL || !password) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    if (trimmedName.length < 2) {
      setMessage("Name must contain at least 2 characters.");
      setMessageType("error");
      return;
    }

    try {
      const photoUrl = new URL(trimmedPhotoURL);

      if (!["http:", "https:"].includes(photoUrl.protocol)) {
        throw new Error("Invalid URL protocol");
      }
    } catch {
      setMessage("Please enter a valid profile photo URL.");
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

    try {
      setLoading(true);

      const { data, error } = await authClient.signUp.email({
        name: trimmedName,
        email: trimmedEmail,
        password,
        image: trimmedPhotoURL,
      });

      if (error) {
        console.error("Better Auth Registration Error:", {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          code: error.code,
        });

        setMessage(error.message || "Registration failed. Please try again.");
        setMessageType("error");
        return;
      }

      if (!data) {
        setMessage("Registration failed. Please try again.");
        setMessageType("error");
        return;
      }

      setMessage("Account created successfully! Redirecting...");
      setMessageType("success");

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);

      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth
  const handleGoogleSignIn = async () => {
    try {
      setSocialLoading("google");
      setMessage("");

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/`,
        errorCallbackURL: `${window.location.origin}/login`,
      });

      if (error) {
        console.error("Google authentication error:", error);

        setMessage(error.message || "Google authentication failed.");
        setMessageType("error");
        setSocialLoading("");
      }
    } catch (error) {
      console.error("Google authentication error:", error);

      setMessage("Google authentication failed. Please try again.");
      setMessageType("error");
      setSocialLoading("");
    }
  };

  // GitHub OAuth
  const handleGitHubSignIn = async () => {
    try {
      setSocialLoading("github");
      setMessage("");

      const { error } = await authClient.signIn.social({
        provider: "github",
        callbackURL: `${window.location.origin}/`,
        errorCallbackURL: `${window.location.origin}/login`,
      });

      if (error) {
        console.error("GitHub authentication error:", error);

        setMessage(error.message || "GitHub authentication failed.");
        setMessageType("error");
        setSocialLoading("");
      }
    } catch (error) {
      console.error("GitHub authentication error:", error);

      setMessage("GitHub authentication failed. Please try again.");
      setMessageType("error");
      setSocialLoading("");
    }
  };

  return (
    <main className="min-h-screen bg-[#faf9f2] px-4 py-8 text-[#173f2c] dark:bg-[#0d1c13] dark:text-[#edf4e9] sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[850px] max-w-6xl overflow-hidden rounded-[2rem] border border-[#e5e9dc] bg-white shadow-xl dark:border-[#294333] dark:bg-[#14271c] lg:grid-cols-2">

        {/* Left Section */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#174c38] p-12 text-white lg:flex">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#d5ea83]/10" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-white/10" />
          <div className="absolute right-16 top-1/2 h-40 w-40 rounded-full bg-[#719b4e]/20 blur-2xl" />

          <Link href="/" className="relative z-10 flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-2.5">
              <Heart size={25} fill="currentColor" />
            </div>

            <span className="text-2xl font-extrabold tracking-tight">
              TogetherWe.
            </span>
          </Link>

          <div className="relative z-10 max-w-md">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
              <Leaf size={16} className="text-[#d5ea83]" />
              Join our community
            </div>

            <h1 className="text-5xl font-extrabold leading-tight">
              Small actions.
              <br />
              Big changes.
            </h1>

            <p className="mt-6 text-lg leading-8 text-green-50/90">
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
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d5ea83] text-sm font-bold text-[#174c38]">
                    ✓
                  </span>

                  <span className="text-green-50">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-sm text-green-100/80">
            Together, we can build a better tomorrow.
          </p>
        </section>

        {/* Right Section */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <Link
              href="/"
              className="mb-8 flex items-center justify-center gap-2 lg:hidden"
            >
              <Heart
                className="text-[#174c38] dark:text-[#d5ea83]"
                size={27}
                fill="currentColor"
              />

              <span className="text-2xl font-extrabold">
                TogetherWe.
              </span>
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#eaf1dd] px-4 py-2 text-sm font-bold text-[#174c38] dark:bg-[#1b3526] dark:text-[#d5ea83]">
                <Leaf size={15} />
                Get started today
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-3 leading-7 text-[#778478] dark:text-[#a5b5a6]">
                Join TogetherWe and start making a difference.
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-5">

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#719b4e]"
                  />

                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    maxLength={100}
                    disabled={isAuthenticating}
                    className="w-full rounded-xl border border-[#e5e9dc] bg-[#faf9f2] py-3.5 pl-12 pr-4 text-[#173f2c] outline-none transition placeholder:text-[#a5b5a6] focus:border-[#719b4e] focus:bg-white focus:ring-4 focus:ring-[#719b4e]/10 disabled:opacity-60 dark:border-[#294333] dark:bg-[#0d1c13] dark:text-white dark:focus:bg-[#14271c]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#719b4e]"
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={isAuthenticating}
                    className="w-full rounded-xl border border-[#e5e9dc] bg-[#faf9f2] py-3.5 pl-12 pr-4 text-[#173f2c] outline-none transition placeholder:text-[#a5b5a6] focus:border-[#719b4e] focus:bg-white focus:ring-4 focus:ring-[#719b4e]/10 disabled:opacity-60 dark:border-[#294333] dark:bg-[#0d1c13] dark:text-white dark:focus:bg-[#14271c]"
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Profile Photo URL
                </label>

                <div className="relative">
                  <Camera
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#719b4e]"
                  />

                  <input
                    type="url"
                    required
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    disabled={isAuthenticating}
                    className="w-full rounded-xl border border-[#e5e9dc] bg-[#faf9f2] py-3.5 pl-12 pr-4 text-[#173f2c] outline-none transition placeholder:text-[#a5b5a6] focus:border-[#719b4e] focus:bg-white focus:ring-4 focus:ring-[#719b4e]/10 disabled:opacity-60 dark:border-[#294333] dark:bg-[#0d1c13] dark:text-white dark:focus:bg-[#14271c]"
                  />
                </div>

                {photoURL.trim() && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full border border-[#e5e9dc] bg-[#eaf1dd] dark:border-[#294333] dark:bg-[#1b3526]">
                      <img
                        src={photoURL}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>

                    <p className="text-xs text-[#778478] dark:text-[#a5b5a6]">
                      Profile photo preview
                    </p>
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#719b4e]"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    disabled={isAuthenticating}
                    className="w-full rounded-xl border border-[#e5e9dc] bg-[#faf9f2] py-3.5 pl-12 pr-12 text-[#173f2c] outline-none transition placeholder:text-[#a5b5a6] focus:border-[#719b4e] focus:bg-white focus:ring-4 focus:ring-[#719b4e]/10 disabled:opacity-60 dark:border-[#294333] dark:bg-[#0d1c13] dark:text-white dark:focus:bg-[#14271c]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#778478] transition hover:text-[#174c38] dark:hover:text-[#d5ea83]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs leading-5 text-[#778478] dark:text-[#a5b5a6]">
                  At least 6 characters, including uppercase and lowercase
                  letters.
                </p>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
                    messageType === "error"
                      ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                      : "border-[#cfe0bd] bg-[#eaf1dd] text-[#174c38] dark:border-[#416443] dark:bg-[#1b3526] dark:text-[#d5ea83]"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {messageType === "error" ? (
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  ) : (
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  )}

                  <span>{message}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#174c38] py-3.5 font-bold text-white shadow-lg shadow-[#174c38]/15 transition hover:-translate-y-0.5 hover:bg-[#246647] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#d5ea83] dark:text-[#173f2c] dark:hover:bg-[#c5df70]"
              >
                {loading ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e5e9dc] dark:bg-[#294333]" />

              <span className="text-sm text-[#778478] dark:text-[#a5b5a6]">
                Or sign up with
              </span>

              <div className="h-px flex-1 bg-[#e5e9dc] dark:bg-[#294333]" />
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isAuthenticating}
                className="flex items-center justify-center gap-2 rounded-full border border-[#e5e9dc] bg-white py-3 font-semibold text-[#173f2c] transition hover:bg-[#f0f4e8] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#294333] dark:bg-[#0d1c13] dark:text-white dark:hover:bg-[#1b3526]"
              >
                <svg
                  viewBox="0 0 48 48"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.73 7.18l7.72 5.99c4.51-4.18 7.05-10.34 7.05-17.64Z" />
                  <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.82l-7.72-5.99c-2.14 1.44-4.89 2.29-8.19 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z" />
                </svg>

                {socialLoading === "google" ? "Connecting..." : "Google"}
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={handleGitHubSignIn}
                disabled={isAuthenticating}
                className="flex items-center justify-center gap-2 rounded-full border border-[#e5e9dc] bg-white py-3 font-semibold text-[#173f2c] transition hover:bg-[#f0f4e8] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#294333] dark:bg-[#0d1c13] dark:text-white dark:hover:bg-[#1b3526]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                  aria-hidden="true"
                >
                  <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.51-1.3-1.24-1.65-1.24-1.65-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.47-.28-5.06-1.24-5.06-5.51 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.56 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.28-2.6 5.23-5.08 5.5.4.35.75 1.02.75 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
                </svg>

                {socialLoading === "github" ? "Connecting..." : "GitHub"}
              </button>
            </div>

            {/* Login Link */}
            <p className="mt-8 text-center text-sm text-[#778478] dark:text-[#a5b5a6]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#174c38] transition hover:text-[#719b4e] dark:text-[#d5ea83]"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-5 text-center text-xs leading-5 text-[#778478] dark:text-[#a5b5a6]">
              By creating an account, you agree to our community guidelines.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
