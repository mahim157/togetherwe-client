
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  User,
  Mail,
  Camera,
  Save,
  Loader2,
  Heart,
  Moon,
  Sun,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useTheme } from "../components/ThemeProvider";

export default function ProfilePage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Profile states
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Load existing user information
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImage(user.image || "");
    }
  }, [user]);

  // Redirect if user is not logged in
  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login");
    }
  }, [isPending, user, router]);

  // Theme styles
  const pageBg = isDark ? "bg-[#0d1c13]" : "bg-[#faf9f2]";
  const surface = isDark
    ? "border-[#294333] bg-[#14271c]"
    : "border-[#e5e9dc] bg-white";

  const heading = isDark ? "text-[#f3f3e9]" : "text-[#173f2c]";
  const muted = isDark ? "text-[#a5b5a6]" : "text-[#778478]";

  const inputStyle = `w-full rounded-xl border py-3.5 pl-12 pr-12 outline-none transition ${
    isDark
      ? "border-[#385541] bg-[#0d1c13] text-[#f3f3e9] placeholder:text-[#718575] focus:border-[#a4c66e] focus:ring-2 focus:ring-[#719b4e]/20"
      : "border-[#e0e8da] bg-[#fafbf7] text-[#173f2c] placeholder:text-[#a0aa9e] focus:border-[#719b4e] focus:ring-2 focus:ring-[#719b4e]/15"
  }`;

  const labelStyle = `mb-2 block text-sm font-bold ${heading}`;

  // Update Profile
  const handleUpdateProfile = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setProfileMessage("");
    setProfileError("");

    if (!name.trim()) {
      setProfileError("Please enter your name.");
      return;
    }

    if (name.trim().length < 2) {
      setProfileError("Name must contain at least 2 characters.");
      return;
    }

    if (image.trim()) {
      try {
        const imageUrl = new URL(image.trim());

        if (
          imageUrl.protocol !== "http:" &&
          imageUrl.protocol !== "https:"
        ) {
          setProfileError("Please enter a valid image URL.");
          return;
        }
      } catch {
        setProfileError("Please enter a valid image URL.");
        return;
      }
    }

    setProfileLoading(true);

    try {
      const { error: updateError } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || null,
      });

      if (updateError) {
        setProfileError(
          updateError.message || "Profile update failed."
        );
        return;
      }

      setProfileMessage(
        "Your profile has been updated successfully!"
      );

      router.refresh();
    } catch (error) {
      console.error("Profile update error:", error);
      setProfileError("Something went wrong. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  // Change Password
  const handleChangePassword = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError(
        "New password must contain at least one uppercase letter."
      );
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setPasswordError(
        "New password must contain at least one lowercase letter."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "New password must be different from your current password."
      );
      return;
    }

    setPasswordLoading(true);

    try {
      const { error: changeError } =
        await authClient.changePassword({
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        });

      if (changeError) {
        setPasswordError(
          changeError.message ||
            "Password change failed. Please check your current password."
        );
        return;
      }

      setPasswordMessage(
        "Your password has been changed successfully!"
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error("Password change error:", error);
      setPasswordError(
        "Something went wrong. Please try again."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // Loading screen
  if (isPending || !user) {
    return (
      <main
        className={`flex min-h-screen items-center justify-center ${pageBg}`}
      >
        <div className="text-center">
          <Loader2
            className="mx-auto animate-spin text-[#719b4e]"
            size={38}
          />
          <p className={`mt-4 text-sm ${muted}`}>
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
      {/* NAVBAR */}
      <nav
        className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
          isDark
            ? "border-[#263d2c] bg-[#0d1c13]/95"
            : "border-[#e9e9dc] bg-[#faf9f2]/95"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#174c38] text-[#d5ea83]">
              <Heart size={23} fill="currentColor" />
            </div>

            <div>
              <span className={`text-2xl font-black tracking-tight ${heading}`}>
                Together<span className="text-[#719b4e]">We.</span>
              </span>

              <p className={`-mt-1 text-[9px] font-bold uppercase tracking-[0.2em] ${muted}`}>
                People. Purpose. Progress.
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                isDark
                  ? "border-[#385541] text-[#d5ea83] hover:bg-[#203b2b]"
                  : "border-[#dce4d5] text-[#174c38] hover:bg-[#edf2e7]"
              }`}
            >
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            <Link
              href="/"
              className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                isDark
                  ? "border-[#385541] text-[#d5ea83] hover:bg-[#203b2b]"
                  : "border-[#dce4d5] text-[#174c38] hover:bg-[#edf2e7]"
              }`}
            >
              <ArrowLeft size={17} />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <section className="px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">

          {/* PAGE HEADING */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf1df] text-[#174c38]">
              <User size={30} />
            </div>

            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#719b4e]">
              Account Settings
            </p>

            <h1 className={`text-4xl font-black tracking-tight sm:text-5xl ${heading}`}>
              My Profile
            </h1>

            <p className={`mx-auto mt-4 max-w-xl leading-7 ${muted}`}>
              Manage your personal information, profile picture,
              and account security in one place.
            </p>
          </div>

          {/* PROFILE INFORMATION CARD */}
          <div className={`mb-8 overflow-hidden rounded-[2rem] border shadow-sm ${surface}`}>

            {/* PROFILE HEADER */}
            <div className={`relative overflow-hidden px-6 py-10 text-center ${
              isDark ? "bg-[#1b3525]" : "bg-[#eaf1df]"
            }`}>
              <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full border-[25px] border-[#719b4e]/10" />

              <div className="relative mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#dce9ca] shadow-lg">
                {image.trim() ? (
                  <img
                    src={image}
                    alt={name || "Profile"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <User size={48} className="text-[#174c38]" />
                )}
              </div>

              <h2 className={`relative mt-5 text-2xl font-black ${heading}`}>
                {user.name || "Community Member"}
              </h2>

              <p className={`relative mt-2 text-sm ${muted}`}>
                TogetherWe Community Member
              </p>

              <div className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-[#174c38] px-4 py-2 text-xs font-bold text-[#d5ea83]">
                <ShieldCheck size={15} />
                Account Profile
              </div>
            </div>

            {/* PROFILE FORM */}
            <form
              onSubmit={handleUpdateProfile}
              className="space-y-6 p-6 sm:p-9"
            >
              <div>
                <h3 className={`text-xl font-black ${heading}`}>
                  Personal Information
                </h3>
                <p className={`mt-2 text-sm ${muted}`}>
                  Update your name and profile picture.
                </p>
              </div>

              {/* NAME */}
              <div>
                <label htmlFor="name" className={labelStyle}>
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#719b4e]"
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    minLength={2}
                    maxLength={100}
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label htmlFor="email" className={labelStyle}>
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#719b4e]"
                  />

                  <input
                    id="email"
                    type="email"
                    value={user.email}
                    readOnly
                    className={`w-full cursor-not-allowed rounded-xl border py-3.5 pl-12 pr-4 outline-none ${
                      isDark
                        ? "border-[#385541] bg-[#0d1c13] text-[#829582]"
                        : "border-[#e0e8da] bg-[#f0f3ec] text-[#849184]"
                    }`}
                  />
                </div>

                <p className={`mt-2 text-xs ${muted}`}>
                  Your email address cannot be changed here.
                </p>
              </div>

              {/* IMAGE URL */}
              <div>
                <label htmlFor="image" className={labelStyle}>
                  Profile Picture URL
                </label>

                <div className="relative">
                  <Camera
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#719b4e]"
                  />

                  <input
                    id="image"
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/profile.jpg"
                    className={inputStyle}
                  />
                </div>

                <p className={`mt-2 text-xs ${muted}`}>
                  Enter a publicly accessible image URL.
                </p>
              </div>

              {/* PROFILE SUCCESS */}
              {profileMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-[#719b4e]/30 bg-[#719b4e]/10 p-4 text-sm font-semibold text-[#719b4e]">
                  <CheckCircle2 size={19} className="shrink-0" />
                  {profileMessage}
                </div>
              )}

              {/* PROFILE ERROR */}
              {profileError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-500">
                  {profileError}
                </div>
              )}

              {/* PROFILE BUTTON */}
              <button
                type="submit"
                disabled={profileLoading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#174c38] py-4 font-black text-white transition hover:-translate-y-0.5 hover:bg-[#246647] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {profileLoading ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Updating Profile...
                  </>
                ) : (
                  <>
                    <Save size={19} />
                    Update Profile
                  </>
                )}
              </button>
            </form>
          </div>

          {/* CHANGE PASSWORD CARD */}
          <div className={`overflow-hidden rounded-[2rem] border shadow-sm ${surface}`}>

            {/* PASSWORD HEADER */}
            <div className={`border-b px-6 py-7 sm:px-9 ${
              isDark ? "border-[#294333] bg-[#1b3525]" : "border-[#e5e9dc] bg-[#f3f5ed]"
            }`}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#174c38] text-[#d5ea83]">
                  <KeyRound size={24} />
                </div>

                <div>
                  <h3 className={`text-xl font-black ${heading}`}>
                    Change Password
                  </h3>

                  <p className={`mt-1 text-sm ${muted}`}>
                    Keep your TogetherWe account secure.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleChangePassword}
              className="space-y-6 p-6 sm:p-9"
            >

              {/* CURRENT PASSWORD */}
              <div>
                <label htmlFor="currentPassword" className={labelStyle}>
                  Current Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#719b4e]"
                  />

                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    autoComplete="current-password"
                    required
                    className={inputStyle}
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#819482] transition hover:text-[#719b4e]"
                  >
                    {showCurrentPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div>
                <label htmlFor="newPassword" className={labelStyle}>
                  New Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#719b4e]"
                  />

                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    className={inputStyle}
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#819482] transition hover:text-[#719b4e]"
                  >
                    {showNewPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                <div className={`mt-3 space-y-1.5 text-xs ${muted}`}>
                  <p className="font-semibold">Password requirements:</p>

                  <p className={`flex items-center gap-2 ${
                    newPassword.length >= 6 ? "text-[#719b4e]" : ""
                  }`}>
                    <CheckCircle2 size={14} />
                    At least 6 characters
                  </p>

                  <p className={`flex items-center gap-2 ${
                    /[A-Z]/.test(newPassword) ? "text-[#719b4e]" : ""
                  }`}>
                    <CheckCircle2 size={14} />
                    At least one uppercase letter (A-Z)
                  </p>

                  <p className={`flex items-center gap-2 ${
                    /[a-z]/.test(newPassword) ? "text-[#719b4e]" : ""
                  }`}>
                    <CheckCircle2 size={14} />
                    At least one lowercase letter (a-z)
                  </p>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label htmlFor="confirmPassword" className={labelStyle}>
                  Confirm New Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#719b4e]"
                  />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    required
                    className={inputStyle}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#819482] transition hover:text-[#719b4e]"
                  >
                    {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                {confirmPassword.length > 0 && (
                  <p className={`mt-2 flex items-center gap-2 text-xs font-semibold ${
                    newPassword === confirmPassword
                      ? "text-[#719b4e]"
                      : "text-red-500"
                  }`}>
                    {newPassword === confirmPassword
                      ? "Passwords match."
                      : "Passwords do not match."}
                  </p>
                )}
              </div>

              {/* PASSWORD SUCCESS */}
              {passwordMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-[#719b4e]/30 bg-[#719b4e]/10 p-4 text-sm font-semibold text-[#719b4e]">
                  <CheckCircle2 size={19} className="shrink-0" />
                  {passwordMessage}
                </div>
              )}

              {/* PASSWORD ERROR */}
              {passwordError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-500">
                  {passwordError}
                </div>
              )}

              {/* PASSWORD BUTTON */}
              <button
                type="submit"
                disabled={passwordLoading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#174c38] py-4 font-black text-white transition hover:-translate-y-0.5 hover:bg-[#246647] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={19} />
                    Change Password
                  </>
                )}
              </button>

              <p className={`text-center text-xs leading-6 ${muted}`}>
                For security, other active sessions will be signed out
                after a successful password change.
              </p>
            </form>
          </div>

          {/* BOTTOM NOTE */}
          <div className={`mt-7 flex items-start gap-3 rounded-2xl border p-5 ${surface}`}>
            <ShieldCheck size={22} className="shrink-0 text-[#719b4e]" />

            <div>
              <h4 className={`font-bold ${heading}`}>
                Your account security matters
              </h4>

              <p className={`mt-1 text-sm leading-6 ${muted}`}>
                Never share your password with anyone. Always use a
                strong and unique password for your account.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#102b1b] px-5 py-7 text-center text-xs text-[#a9b9a8]">
        © 2026 TogetherWe. Built for a better community.
      </footer>
    </main>
  );
}
