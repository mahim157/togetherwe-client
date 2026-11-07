
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowRight,
  Heart,
  Users,
  CalendarDays,
  MapPin,
  HandHeart,
  ArrowUpRight,
  Menu,
  X,
  Globe,
  Mail,
  Moon,
  Sun,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useTheme } from "./components/ThemeProvider";

type Event = {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  image: string;
  volunteers: number;
};

const features = [
  {
    icon: HandHeart,
    title: "Create Events",
    description:
      "Organize meaningful community events and invite people to make a positive difference.",
  },
  {
    icon: Users,
    title: "Join Community",
    description:
      "Connect with passionate people and work together toward a better society.",
  },
  {
    icon: Globe,
    title: "Make an Impact",
    description:
      "Turn small actions into meaningful changes for your local community.",
  },
];

const gallery = [
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=700",
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=700",
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=700",
  "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=700",
];

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState("");

  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  // Authentication
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  // Fetch Recent Events
  useEffect(() => {
    let isMounted = true;

    async function fetchRecentEvents() {
      try {
        setEventsLoading(true);
        setEventsError("");

        const response = await fetch(
          "http://localhost:5000/api/events/recent",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load events. Server status: ${response.status}`
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to load events."
          );
        }

        if (isMounted) {
          setEvents(result.events || []);
        }
      } catch (error) {
        console.error("Recent events error:", error);

        if (isMounted) {
          setEventsError(
            error instanceof Error
              ? error.message
              : "Failed to load upcoming events."
          );
        }
      } finally {
        if (isMounted) {
          setEventsLoading(false);
        }
      }
    }

    fetchRecentEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  // Logout
  const handleLogout = async () => {
    if (logoutLoading) return;

    try {
      setLogoutLoading(true);
      setLogoutError("");

      const result = await authClient.signOut();

      if (result?.error) {
        console.error("Logout error:", {
          message: result.error.message,
          status: result.error.status,
          statusText: result.error.statusText,
          code: result.error.code,
        });

        setLogoutError(
          result.error.message ||
            "Logout failed. Please try again."
        );

        return;
      }

      setIsProfileOpen(false);
      setIsMenuOpen(false);

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout exception:", error);

      setLogoutError(
        "Unable to logout. Please check your connection and try again."
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  // Newsletter
  const handleNewsletterSubmit = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email.trim()) return;

    setNewsletterMessage(
      "Thank you for your interest in TogetherWe!"
    );

    setEmail("");
  };

  // Theme Toggle Button
  const ThemeToggleButton = ({
    mobile = false,
  }: {
    mobile?: boolean;
  }) => (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark ? "Switch to light mode" : "Switch to dark mode"
      }
      title={
        isDark ? "Switch to light mode" : "Switch to dark mode"
      }
      className={
        mobile
          ? `flex w-full items-center justify-center gap-3 rounded-xl border px-4 py-3 font-semibold transition ${
              isDark
                ? "border-slate-700 text-slate-200 hover:bg-slate-800"
                : "border-gray-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
            }`
          : `flex h-10 w-10 items-center justify-center rounded-full border transition ${
              isDark
                ? "border-slate-700 text-yellow-300 hover:bg-slate-800"
                : "border-gray-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
            }`
      }
    >
      {isDark ? (
        <>
          <Sun size={20} />
          {mobile && <span>Light Mode</span>}
        </>
      ) : (
        <>
          <Moon size={20} />
          {mobile && <span>Dark Mode</span>}
        </>
      )}
    </button>
  );

  const sectionHeading = isDark
    ? "text-white"
    : "text-slate-900";

  const mutedText = isDark
    ? "text-slate-400"
    : "text-slate-500";

  const surface = isDark
    ? "border-slate-700 bg-slate-900"
    : "border-gray-100 bg-white";

  const navLink = isDark
    ? "text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
    : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700";

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-slate-950 text-slate-100"
          : "bg-white text-slate-900"
      }`}
    >
      {/* NAVBAR */}
      <nav
        className={`sticky top-0 z-50 border-b backdrop-blur transition-colors duration-300 ${
          isDark
            ? "border-slate-800 bg-slate-950/95"
            : "border-gray-100 bg-white/95"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Heart size={22} fill="white" />
            </div>

            <span
              className={`text-2xl font-extrabold tracking-tight ${sectionHeading}`}
            >
              Together<span className="text-emerald-500">We.</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div
            className={`hidden items-center gap-8 text-sm font-medium md:flex ${mutedText}`}
          >
            <Link href="/" className="text-emerald-500">
              Home
            </Link>

            <a
              href="#features"
              className="transition hover:text-emerald-500"
            >
              Features
            </a>

            <Link
              href="/events"
              className="transition hover:text-emerald-500"
            >
              Upcoming Events
            </Link>

            <a
              href="#gallery"
              className="transition hover:text-emerald-500"
            >
              Gallery
            </a>
          </div>

          {/* DESKTOP AUTHENTICATION */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggleButton />

            {isPending ? (
              <div
                className={`h-10 w-28 animate-pulse rounded-full ${
                  isDark ? "bg-slate-800" : "bg-gray-100"
                }`}
              />
            ) : user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setLogoutError("");
                  }}
                  className={`flex items-center gap-3 rounded-full border px-3 py-2 transition ${
                    isDark
                      ? "border-slate-700 hover:bg-slate-800"
                      : "border-gray-200 hover:bg-emerald-50"
                  }`}
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  <span
                    className={`max-w-32 truncate text-sm font-semibold ${
                      isDark ? "text-slate-200" : "text-slate-700"
                    }`}
                  >
                    {user.name || user.email}
                  </span>

                  <span className={mutedText}>
                    {isProfileOpen ? "▲" : "▼"}
                  </span>
                </button>

                {isProfileOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close profile menu"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setIsProfileOpen(false)}
                    />

                    <div
                      className={`absolute right-0 top-14 z-50 w-64 rounded-2xl border p-3 shadow-xl ${surface}`}
                    >
                      <div
                        className={`border-b px-3 py-3 ${
                          isDark
                            ? "border-slate-700"
                            : "border-gray-100"
                        }`}
                      >
                        <p className={sectionHeading + " font-bold"}>
                          {user.name || "Community Member"}
                        </p>

                        <p className={`mt-1 truncate text-xs ${mutedText}`}>
                          {user.email}
                        </p>
                      </div>

                      <div className="mt-2 space-y-1 text-sm">
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="block rounded-lg bg-emerald-500/10 px-3 py-2.5 font-semibold text-emerald-500 transition hover:bg-emerald-500/20"
                        >
                          My Profile
                        </Link>

                        {[
                          {
                            href: "/create-event",
                            label: "Create Event",
                          },
                          {
                            href: "/manage-events",
                            label: "Manage Events",
                          },
                          {
                            href: "/joined-events",
                            label: "Joined Events",
                          },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsProfileOpen(false)}
                            className={`block rounded-lg px-3 py-2 transition ${navLink}`}
                          >
                            {item.label}
                          </Link>
                        ))}

                        <div
                          className={`my-2 border-t ${
                            isDark
                              ? "border-slate-700"
                              : "border-gray-100"
                          }`}
                        />

                        {logoutError && (
                          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-500">
                            {logoutError}
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={handleLogout}
                          disabled={logoutLoading}
                          className="w-full rounded-lg px-3 py-2 text-left font-semibold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {logoutLoading
                            ? "Logging out..."
                            : "Logout"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-4 py-2 text-sm font-semibold transition hover:text-emerald-500 ${sectionHeading}`}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`rounded-lg border p-2 transition md:hidden ${
              isDark
                ? "border-slate-700 text-slate-200 hover:bg-slate-800"
                : "border-gray-200 text-slate-700 hover:bg-emerald-50"
            }`}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        {isMenuOpen && (
          <div
            id="mobile-navigation"
            className={`border-t px-5 py-5 shadow-lg md:hidden ${
              isDark
                ? "border-slate-800 bg-slate-950"
                : "border-gray-100 bg-white"
            }`}
          >
            <div className="flex flex-col gap-1 text-sm font-medium">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg bg-emerald-500/10 px-4 py-3 text-emerald-500"
              >
                Home
              </Link>

              <a
                href="#features"
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-lg px-4 py-3 transition ${navLink}`}
              >
                Features
              </a>

              <Link
                href="/events"
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-lg px-4 py-3 transition ${navLink}`}
              >
                Upcoming Events
              </Link>

              <a
                href="#gallery"
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-lg px-4 py-3 transition ${navLink}`}
              >
                Gallery
              </a>

              <div
                className={`my-3 border-t ${
                  isDark ? "border-slate-800" : "border-gray-100"
                }`}
              />

              <div className="mb-2">
                <ThemeToggleButton mobile />
              </div>

              {isPending ? (
                <p className={`px-4 py-3 text-sm ${mutedText}`}>
                  Loading account...
                </p>
              ) : user ? (
                <>
                  <div
                    className={`flex items-center gap-3 rounded-xl p-3 ${
                      isDark ? "bg-slate-900" : "bg-emerald-50"
                    }`}
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className={`truncate font-bold ${sectionHeading}`}>
                        {user.name || "Community Member"}
                      </p>

                      <p className={`truncate text-xs ${mutedText}`}>
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg bg-emerald-500/10 px-4 py-3 font-semibold text-emerald-500"
                  >
                    My Profile
                  </Link>

                  {[
                    {
                      href: "/create-event",
                      label: "Create Event",
                    },
                    {
                      href: "/manage-events",
                      label: "Manage Events",
                    },
                    {
                      href: "/joined-events",
                      label: "Joined Events",
                    },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`rounded-lg px-4 py-3 transition ${navLink}`}
                    >
                      {item.label}
                    </Link>
                  ))}

                  {logoutError && (
                    <p className="rounded-lg bg-red-500/10 px-4 py-2 text-xs text-red-500">
                      {logoutError}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="rounded-lg px-4 py-3 text-left font-semibold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {logoutLoading ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`rounded-lg px-4 py-3 transition ${navLink}`}
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-2 rounded-full bg-emerald-600 px-5 py-3 text-center font-semibold text-white"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section
        className={`overflow-hidden transition-colors duration-300 ${
          isDark ? "bg-slate-950" : "bg-[#f0fdf4]"
        }`}
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <div
              className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
                isDark
                  ? "border-emerald-800 bg-slate-900 text-emerald-300"
                  : "border-emerald-200 bg-white text-emerald-700"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Together, We Can Make a Difference
            </div>

            <h1
              className={`max-w-xl text-5xl font-extrabold leading-tight tracking-tight md:text-6xl ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Small Actions.
              <span
                className={`block ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                Big Changes.
              </span>
            </h1>

            <p
              className={`mt-6 max-w-lg text-lg leading-8 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Connect with your community, join meaningful social events,
              and become part of something bigger. Together, let&apos;s
              build a better tomorrow.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-4 font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-1 hover:bg-emerald-700"
              >
                Explore Events
                <ArrowRight size={19} />
              </Link>

              <Link
                href={user ? "/create-event" : "/register"}
                className={`rounded-full border px-7 py-4 font-semibold transition ${
                  isDark
                    ? "border-emerald-700 bg-slate-900 text-emerald-300 hover:bg-slate-800"
                    : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                {user ? "Create an Event" : "Join Our Community"}
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4">
              {[
                { number: "500+", label: "Community Members" },
                { number: "120+", label: "Events Organized" },
                { number: "25+", label: "Local Communities" },
              ].map((stat) => (
                <div key={stat.label}>
                  <h3
                    className={`text-2xl font-extrabold sm:text-3xl ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {stat.number}
                  </h3>

                  <p
                    className={`mt-1 text-xs sm:text-sm ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              className={`absolute -right-8 -top-8 h-40 w-40 rounded-full blur-3xl ${
                isDark ? "bg-emerald-500/20" : "bg-emerald-200/60"
              }`}
            />

            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200"
              alt="Volunteers working together for their community"
              className="relative h-[360px] w-full rounded-[2rem] object-cover shadow-2xl sm:h-[420px] lg:h-[500px]"
            />

            <div
              className={`absolute -bottom-6 left-3 rounded-2xl p-5 shadow-xl sm:-left-8 ${
                isDark
                  ? "border border-slate-700 bg-slate-900"
                  : "bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 p-3 text-emerald-700">
                  <HandHeart size={25} />
                </div>

                <div>
                  <p className={`font-bold ${sectionHeading}`}>
                    Make an Impact
                  </p>

                  <p className={`text-sm ${mutedText}`}>
                    One action at a time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24"
      >
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 font-bold uppercase tracking-widest text-emerald-500">
            What We Do
          </p>

          <h2
            className={`text-3xl font-extrabold tracking-tight md:text-4xl ${sectionHeading}`}
          >
            Bringing People Together for Good
          </h2>

          <p className={`mt-4 leading-7 ${mutedText}`}>
            A platform that makes it easier to organize, discover,
            and participate in meaningful community activities.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            const featureLink =
              feature.title === "Create Events"
                ? user
                  ? "/create-event"
                  : "/register"
                : "/events";

            return (
              <div
                key={feature.title}
                className={`group rounded-3xl border p-8 transition duration-300 hover:-translate-y-2 hover:border-emerald-500 hover:shadow-xl ${surface}`}
              >
                <div className="mb-6 inline-flex rounded-2xl bg-emerald-500/10 p-4 text-emerald-500 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <Icon size={29} />
                </div>

                <h3 className={`mb-3 text-xl font-bold ${sectionHeading}`}>
                  {feature.title}
                </h3>

                <p className={`leading-7 ${mutedText}`}>
                  {feature.description}
                </p>

                <Link
                  href={featureLink}
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-emerald-500 transition-all duration-300 hover:gap-3 hover:text-emerald-400"
                >
                  Learn More
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section
        id="events"
        className={`py-20 transition-colors duration-300 lg:py-24 ${
          isDark ? "bg-slate-900" : "bg-slate-50"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-3 font-bold uppercase tracking-widest text-emerald-500">
                Get Involved
              </p>

              <h2
                className={`text-3xl font-extrabold md:text-4xl ${sectionHeading}`}
              >
                Upcoming Community Events
              </h2>

              <p className={`mt-3 ${mutedText}`}>
                Find an event near you and be part of the change.
              </p>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 font-bold text-emerald-500 transition hover:gap-3"
            >
              View All Events
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* SKELETON LOADING */}
          {eventsLoading && (
            <div
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
              role="status"
              aria-label="Loading upcoming events"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <article
                  key={index}
                  className={`overflow-hidden rounded-3xl border shadow-sm ${
                    isDark
                      ? "border-slate-700 bg-slate-900"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  {/* Image Skeleton */}
                  <div
                    className={`h-56 w-full animate-pulse ${
                      isDark ? "bg-slate-800" : "bg-gray-200"
                    }`}
                  />

                  <div className="space-y-5 p-6">
                    {/* Event Title Skeleton */}
                    <div
                      className={`h-6 w-3/4 animate-pulse rounded-lg ${
                        isDark ? "bg-slate-800" : "bg-gray-200"
                      }`}
                    />

                    {/* Event Details Skeleton */}
                    <div className="space-y-3">
                      <div
                        className={`h-4 w-2/3 animate-pulse rounded ${
                          isDark ? "bg-slate-800" : "bg-gray-200"
                        }`}
                      />

                      <div
                        className={`h-4 w-4/5 animate-pulse rounded ${
                          isDark ? "bg-slate-800" : "bg-gray-200"
                        }`}
                      />

                      <div
                        className={`h-4 w-1/2 animate-pulse rounded ${
                          isDark ? "bg-slate-800" : "bg-gray-200"
                        }`}
                      />
                    </div>

                    {/* Button Skeleton */}
                    <div
                      className={`h-12 w-full animate-pulse rounded-xl ${
                        isDark ? "bg-slate-800" : "bg-gray-200"
                      }`}
                    />
                  </div>
                </article>
              ))}
              <span className="sr-only">
                Loading upcoming community events...
              </span>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {!eventsLoading && eventsError && (
            <div
              className={`rounded-2xl border px-6 py-10 text-center ${
                isDark
                  ? "border-red-900 bg-red-950/30"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <p className="font-semibold text-red-500">
                {eventsError}
              </p>

              <p className="mt-2 text-sm text-red-400">
                Please check your backend server and try again.
              </p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!eventsLoading && !eventsError && events.length === 0 && (
            <div
              className={`rounded-3xl border border-dashed px-6 py-16 text-center ${
                isDark
                  ? "border-slate-700 bg-slate-950"
                  : "border-gray-300 bg-white"
              }`}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <CalendarDays size={30} />
              </div>

              <h3 className={`mt-5 text-xl font-bold ${sectionHeading}`}>
                No Upcoming Events Yet
              </h3>

              <p className={`mt-2 ${mutedText}`}>
                Be the first to create an event for your community.
              </p>

              <Link
                href={user ? "/create-event" : "/register"}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                Create an Event
                <ArrowRight size={17} />
              </Link>
            </div>
          )}

          {/* EVENT CARDS */}
          {!eventsLoading && !eventsError && events.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <article
                  key={event._id}
                  className={`overflow-hidden rounded-3xl border shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl ${surface}`}
                >
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-56 w-full object-cover"
                    />

                    <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-bold text-emerald-700 shadow">
                      {event.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className={`text-xl font-bold ${sectionHeading}`}>
                      {event.title}
                    </h3>

                    <div className={`mt-5 space-y-3 text-sm ${mutedText}`}>
                      <p className="flex items-center gap-2">
                        <CalendarDays
                          size={17}
                          className="shrink-0 text-emerald-500"
                        />

                        {new Date(
                          `${event.date}T00:00:00`
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>

                      <p className="flex items-center gap-2">
                        <MapPin
                          size={17}
                          className="shrink-0 text-emerald-500"
                        />
                        {event.location}
                      </p>

                      <p className="flex items-center gap-2">
                        <Users
                          size={17}
                          className="shrink-0 text-emerald-500"
                        />
                        {event.volunteers ?? 0} Volunteers
                      </p>
                    </div>

                    <Link
                      href={`/events/${event._id}`}
                      className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold transition ${
                        isDark
                          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                      }`}
                    >
                      View Event
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* COMMUNITY GALLERY */}
      <section
        id="gallery"
        className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24"
      >
        <div className="mb-12 text-center">
          <p className="mb-3 font-bold uppercase tracking-widest text-emerald-500">
            Our Community
          </p>

          <h2
            className={`text-3xl font-extrabold md:text-4xl ${sectionHeading}`}
          >
            Moments That Matter
          </h2>

          <p className={`mx-auto mt-4 max-w-xl leading-7 ${mutedText}`}>
            Every smile, every helping hand, and every small contribution
            creates a story worth sharing.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {gallery.map((image, index) => (
            <div
              key={image}
              className="group overflow-hidden rounded-2xl"
            >
              <img
                src={image}
                alt={`Community volunteering moment ${index + 1}`}
                className="h-48 w-full object-cover transition duration-500 group-hover:scale-110 md:h-64"
              />
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section
        className={`px-5 py-20 ${
          isDark ? "bg-slate-900" : "bg-emerald-50"
        }`}
      >
        <div
          className={`mx-auto max-w-4xl rounded-3xl border px-6 py-12 text-center shadow-sm sm:px-12 ${surface}`}
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <Mail size={27} />
          </div>

          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-emerald-500">
            Stay Connected
          </p>

          <h2
            className={`text-3xl font-extrabold md:text-4xl ${sectionHeading}`}
          >
            Get Community Updates
          </h2>

          <p className={`mx-auto mt-4 max-w-xl leading-7 ${mutedText}`}>
            Stay informed about upcoming events, volunteer opportunities,
            and inspiring community initiatives.
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className={`min-w-0 flex-1 rounded-full border px-5 py-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${
                isDark
                  ? "border-slate-700 bg-slate-950 text-white placeholder:text-slate-500"
                  : "border-gray-200 bg-white text-slate-900"
              }`}
            />

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 py-4 font-semibold text-white transition hover:bg-emerald-700"
            >
              Subscribe
              <ArrowRight size={17} />
            </button>
          </form>

          {newsletterMessage && (
            <p className="mt-4 text-sm font-medium text-emerald-500">
              {newsletterMessage}
            </p>
          )}

          <p className={`mt-4 text-xs ${mutedText}`}>
            Newsletter design preview. Subscription service is not connected.
          </p>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-5 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-emerald-700 px-6 py-16 text-center text-white md:px-16">
          <div className="mx-auto mb-5 inline-flex rounded-full bg-white/15 p-4">
            <Heart size={30} />
          </div>

          <h2 className="text-3xl font-extrabold md:text-5xl">
            Be the Reason Someone Smiles Today.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-emerald-100">
            Your time, your effort, and your kindness can make a real
            difference. Join our community and start creating change.
          </p>

          <Link
            href={user ? "/create-event" : "/register"}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-emerald-700 transition hover:bg-emerald-50"
          >
            {user ? "Create an Event" : "Join TogetherWe"}
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-extrabold"
            >
              <Heart
                className="text-emerald-400"
                fill="currentColor"
              />
              Together<span className="text-emerald-400">We.</span>
            </Link>

            <p className="mt-5 max-w-xs leading-7 text-slate-400">
              Bringing communities together through meaningful actions
              and social development initiatives.
            </p>
          </div>

          <div>
            <h3 className="mb-5 font-bold">Quick Links</h3>

            <div className="space-y-3 text-sm text-slate-400">
              <p>
                <Link href="/" className="hover:text-emerald-400">
                  Home
                </Link>
              </p>

              <p>
                <Link
                  href="/events"
                  className="hover:text-emerald-400"
                >
                  Upcoming Events
                </Link>
              </p>

              <p>
                <a href="#features" className="hover:text-emerald-400">
                  Features
                </a>
              </p>

              <p>
                <a href="#gallery" className="hover:text-emerald-400">
                  Gallery
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-bold">Get Involved</h3>

            <div className="space-y-3 text-sm text-slate-400">
              <p>
                <Link
                  href="/register"
                  className="hover:text-emerald-400"
                >
                  Join Community
                </Link>
              </p>

              <p>
                <Link href="/login" className="hover:text-emerald-400">
                  Login
                </Link>
              </p>

              <p>
                <Link href="/events" className="hover:text-emerald-400">
                  Explore Events
                </Link>
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-bold">Follow Our Journey</h3>

            <p className="mb-5 text-sm leading-7 text-slate-400">
              Stay connected and be part of our community.
            </p>

            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="rounded-full bg-slate-800 p-3 text-white transition hover:bg-emerald-600"
              >
                <span className="text-lg font-bold">f</span>
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="rounded-full bg-slate-800 p-3 text-white transition hover:bg-emerald-600"
              >
                <span className="text-lg font-bold">◎</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 px-5 py-6 text-center text-sm text-slate-500">
          © 2026 TogetherWe. Built for a better community.
        </div>
      </footer>
    </main>
  );
}
