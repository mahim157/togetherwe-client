
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
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  // Update profile
  const handleUpdateProfile = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || null,
      });

      if (updateError) {
        setError(updateError.message || "Profile update failed.");
        return;
      }

      setMessage("Your profile has been updated successfully!");

      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-emerald-600" size={35} />
          <p className="mt-3 text-sm text-slate-500">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-emerald-600 p-2 text-white">
              <Heart size={22} fill="white" />
            </div>

            <span className="text-xl font-extrabold">
              Together<span className="text-emerald-600">We.</span>
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

        </div>
      </nav>

      {/* PROFILE CONTENT */}
      <section className="px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">

          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-emerald-600">
              Account Settings
            </p>

            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-3 text-slate-500">
              Manage your personal information and profile picture.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

            {/* PROFILE HEADER */}
            <div className="bg-emerald-50 px-6 py-10 text-center">

              <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-emerald-100 shadow-md">

                {image.trim() ? (
                  <img
                    src={image}
                    alt={name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-emerald-600" />
                )}

              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {user.name || "Community Member"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                TogetherWe Community Member
              </p>

            </div>

            {/* PROFILE FORM */}
            <form
              onSubmit={handleUpdateProfile}
              className="space-y-6 p-6 sm:p-8"
            >

              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-slate-500 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Email address cannot be changed here.
                </p>
              </div>

              {/* PROFILE IMAGE */}
              <div>
                <label
                  htmlFor="image"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Profile Picture URL
                </label>

                <div className="relative">
                  <Camera
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="image"
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/profile.jpg"
                    className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Enter a publicly accessible image URL.
                </p>
              </div>

              {/* SUCCESS MESSAGE */}
              {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                  {message}
                </div>
              )}

              {/* ERROR MESSAGE */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* UPDATE BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
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

        </div>
      </section>

    </main>
  );
}
