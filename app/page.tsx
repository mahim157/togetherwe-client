
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Users,
  CalendarDays,
  MapPin,
  HandHeart,
  Menu,
  X,
  Globe,
  Mail,
  Moon,
  Sun,
  Leaf,
  Sparkles,
  MoveUpRight,
  CheckCircle2,
  Clock3,
  Sprout,
  Flower2,
  Earth,
  TreePine,
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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const features = [
  {
    number: "01",
    icon: HandHeart,
    title: "Create an Event",
    description:
      "Have an idea that could make a difference? Bring people together and turn your vision into meaningful action.",
    link: "Start organizing",
    href: "/create-event",
    color: "bg-[#e9f0dc]",
  },
  {
    number: "02",
    icon: Users,
    title: "Join a Community",
    description:
      "Connect with passionate people, discover shared interests, and become part of something bigger.",
    link: "Meet your people",
    href: "/events",
    color: "bg-[#f5eadd]",
  },
  {
    number: "03",
    icon: Globe,
    title: "Make an Impact",
    description:
      "Every small act matters. Give your time, share your kindness, and help build a better tomorrow.",
    link: "Explore opportunities",
    href: "/events",
    color: "bg-[#e1eddf]",
  },
];

const gallery = [
  {
    id: "community-change",
    image:
      "https://thumbs.wbm.im/pw/medium/f015031bb3b8ee32c8b072d2e02013e9.jpg",
    title: "Together for Change",
    category: "Community",
    number: "01",
  },
  {
    id: "education",
    image:
      "https://lamdong.gov.vn/sites/tdkt/tintuc/tinhoatdong/SiteAssets/SitePages/t5_01_a1-dcyt_20230130192825-1675148351823.jpg",
    title: "Learning Together",
    category: "Education",
    number: "02",
  },
  {
    id: "environment",
    image:
      "https://featured.undp.org/bluer-greener-better/images/img10.jpg",
    title: "A Greener Tomorrow",
    category: "Environment",
    number: "03",
  },
  {
    id: "helping-hands",
    image:
      "https://radarmukomuko.disway.id/upload/large/2777fa01deb80bda5d8dce0bf199ba13.jpg",
    title: "Sharing Kindness",
    category: "Helping Hands",
    number: "04",
  },
  {
    id: "volunteering",
    image:
      "https://images.squarespace-cdn.com/content/v1/6570ba1c5862de67a3c110d8/64a5265e-6367-4d12-8fc6-8f2c7608cf83/53089221786_feaa5d6b35_o%2B%281%29.jpg",
    title: "People Who Care",
    category: "Volunteering",
    number: "05",
  },
];

const stats = [
  { number: "500+", label: "Community Members" },
  { number: "120+", label: "Events Organized" },
  { number: "25+", label: "Local Communities" },
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

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Fetch recent events
  useEffect(() => {
    const controller = new AbortController();

    async function fetchRecentEvents() {
      try {
        setEventsLoading(true);
        setEventsError("");

        const response = await fetch(
          `${API_BASE_URL}/api/events/recent`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load events. Server status: ${response.status}`
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to load events.");
        }

        setEvents(result.events || []);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Recent events error:", error);

        setEventsError(
          error instanceof Error
            ? error.message
            : "Failed to load upcoming events."
        );
      } finally {
        if (!controller.signal.aborted) {
          setEventsLoading(false);
        }
      }
    }

    fetchRecentEvents();

    return () => controller.abort();
  }, []);

  // Logout
  const handleLogout = async () => {
    if (logoutLoading) return;

    try {
      setLogoutLoading(true);
      setLogoutError("");

      const result = await authClient.signOut();

      if (result?.error) {
        setLogoutError(
          result.error.message || "Logout failed. Please try again."
        );
        return;
      }

      setIsProfileOpen(false);
      setIsMenuOpen(false);

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLogoutError("Unable to logout. Please try again.");
    } finally {
      setLogoutLoading(false);
    }
  };

  // Newsletter preview
  const handleNewsletterSubmit = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email.trim()) return;

    setNewsletterMessage(
      "Thank you for joining our community!"
    );

    setEmail("");
  };

  const pageText = isDark
    ? "text-[#f3f3e9]"
    : "text-[#173f2c]";

  const mutedText = isDark
    ? "text-[#a5b5a6]"
    : "text-[#778478]";

  const cardSurface = isDark
    ? "border-[#2a4535] bg-[#14271c]"
    : "border-[#e6e9dd] bg-white";

  const navLink = isDark
    ? "text-[#c2d0c2] hover:bg-[#203b2b] hover:text-[#d5ea83]"
    : "text-[#526557] hover:bg-[#edf2e7] hover:text-[#174c38]";

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
      className={`flex items-center justify-center gap-2 rounded-full transition ${
        mobile
          ? "w-full border px-4 py-3"
          : "h-10 w-10 border"
      } ${
        isDark
          ? "border-[#385541] text-[#d5ea83] hover:bg-[#203b2b]"
          : "border-[#dce4d5] text-[#174c38] hover:bg-[#edf2e7]"
      }`}
    >
      {isDark ? <Sun size={19} /> : <Moon size={19} />}

      {mobile && (
        <span className="text-sm font-semibold">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );

  return (
    <main
      className={`min-h-screen overflow-hidden transition-colors duration-300 ${
        isDark
          ? "bg-[#0d1c13] text-[#f3f3e9]"
          : "bg-[#faf9f2] text-[#173f2c]"
      }`}
    >
      {/* NAVBAR */}
      <nav
        className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
          isDark
            ? "border-[#263d2c] bg-[#0d1c13]/95"
            : "border-[#e9e9dc] bg-[#faf9f2]/95"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#174c38] text-[#d5ea83]">
              <Heart size={23} fill="currentColor" />
            </div>

            <div>
              <span className={`text-2xl font-black tracking-tight ${pageText}`}>
                Together<span className="text-[#739c4c]">We.</span>
              </span>

              <p className={`-mt-1 text-[9px] font-bold uppercase tracking-[0.2em] ${mutedText}`}>
                People. Purpose. Progress.
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <Link
              href="/"
              className="text-[#739c4c]"
            >
              Home
            </Link>

            <a
              href="#features"
              className={`transition ${navLink}`}
            >
              About Us
            </a>

            <Link
              href="/events"
              className={`transition ${navLink}`}
            >
              Explore Events
            </Link>

            <a
              href="#gallery"
              className={`transition ${navLink}`}
            >
              Gallery
            </a>
          </div>

          {/* DESKTOP AUTH */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggleButton />

            {isPending ? (
              <div className="h-10 w-28 animate-pulse rounded-full bg-[#dfe8d9]" />
            ) : user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setLogoutError("");
                  }}
                  className={`flex items-center gap-3 rounded-full border py-1.5 pl-1.5 pr-4 transition ${
                    isDark
                      ? "border-[#385541] hover:bg-[#203b2b]"
                      : "border-[#e0e8da] bg-white hover:bg-[#f0f3e9]"
                  }`}
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d5e6c8] font-bold text-[#174c38]">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  <span className={`max-w-32 truncate text-sm font-bold ${pageText}`}>
                    {user.name || user.email}
                  </span>

                  <span className={`text-xs ${mutedText}`}>
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
                      className={`absolute right-0 top-14 z-50 w-64 rounded-2xl border p-3 shadow-2xl ${
                        isDark
                          ? "border-[#385541] bg-[#14271c]"
                          : "border-[#e6e9dd] bg-white"
                      }`}
                    >
                      <div className={`border-b px-3 py-3 ${
                        isDark ? "border-[#385541]" : "border-[#edf0e8]"
                      }`}>
                        <p className={`font-bold ${pageText}`}>
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
                          className="block rounded-xl bg-[#eaf1df] px-3 py-2.5 font-bold text-[#174c38] transition hover:bg-[#dce9ca]"
                        >
                          My Profile
                        </Link>

                        {[
                          { href: "/create-event", label: "Create Event" },
                          { href: "/manage-events", label: "Manage Events" },
                          { href: "/joined-events", label: "Joined Events" },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsProfileOpen(false)}
                            className={`block rounded-xl px-3 py-2.5 transition ${navLink}`}
                          >
                            {item.label}
                          </Link>
                        ))}

                        <div className={`my-2 border-t ${
                          isDark ? "border-[#385541]" : "border-[#edf0e8]"
                        }`} />

                        {logoutError && (
                          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-500">
                            {logoutError}
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={handleLogout}
                          disabled={logoutLoading}
                          className="w-full rounded-xl px-3 py-2.5 text-left font-bold text-red-500 transition hover:bg-red-500/10 disabled:opacity-60"
                        >
                          {logoutLoading ? "Logging out..." : "Logout"}
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
                  className={`px-4 py-2 text-sm font-bold transition hover:text-[#739c4c] ${pageText}`}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-full bg-[#174c38] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#246647]"
                >
                  Get Started <ArrowUpRight className="ml-1 inline" size={16} />
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`rounded-xl border p-2.5 md:hidden ${
              isDark
                ? "border-[#385541] text-white"
                : "border-[#dce4d5] text-[#174c38]"
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
                ? "border-[#263d2c] bg-[#0d1c13]"
                : "border-[#e9e9dc] bg-[#faf9f2]"
            }`}
          >
            <div className="flex flex-col gap-1 text-sm font-semibold">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl bg-[#eaf1df] px-4 py-3 text-[#174c38]"
              >
                Home
              </Link>

              <a
                href="#features"
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-xl px-4 py-3 ${navLink}`}
              >
                About Us
              </a>

              <Link
                href="/events"
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-xl px-4 py-3 ${navLink}`}
              >
                Explore Events
              </Link>

              <a
                href="#gallery"
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-xl px-4 py-3 ${navLink}`}
              >
                Our Gallery
              </a>

              <div className={`my-3 border-t ${
                isDark ? "border-[#263d2c]" : "border-[#e9e9dc]"
              }`} />

              <ThemeToggleButton mobile />

              {isPending ? (
                <p className={`px-4 py-3 ${mutedText}`}>
                  Loading account...
                </p>
              ) : user ? (
                <>
                  <div className={`mt-3 flex items-center gap-3 rounded-2xl p-3 ${
                    isDark ? "bg-[#14271c]" : "bg-[#edf2e7]"
                  }`}>
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dce9ca] font-bold text-[#174c38]">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className={`truncate font-bold ${pageText}`}>
                        {user.name || "Community Member"}
                      </p>

                      <p className={`truncate text-xs ${mutedText}`}>
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {[
                    { href: "/profile", label: "My Profile" },
                    { href: "/create-event", label: "Create Event" },
                    { href: "/manage-events", label: "Manage Events" },
                    { href: "/joined-events", label: "Joined Events" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`rounded-xl px-4 py-3 ${navLink}`}
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
                    className="rounded-xl px-4 py-3 text-left font-bold text-red-500 hover:bg-red-500/10 disabled:opacity-60"
                  >
                    {logoutLoading ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 ${navLink}`}
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-2 rounded-full bg-[#174c38] px-5 py-3 text-center font-bold text-white"
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
      <section className={`relative overflow-hidden ${
        isDark ? "bg-[#0d1c13]" : "bg-[#f3f1e5]"
      }`}>
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#c4d89b]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-40 h-[450px] w-[450px] rounded-full bg-[#dce8c5]/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          {/* HERO CONTENT */}
          <div>
            <div className={`mb-7 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider ${
              isDark
                ? "border-[#385541] bg-[#14271c] text-[#d5ea83]"
                : "border-[#dce4ce] bg-white/80 text-[#537b42]"
            }`}>
              <Sparkles size={15} />
              A little kindness goes a long way
            </div>

            <h1 className={`max-w-2xl text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-[76px] ${pageText}`}>
              Good people.
              <span className="mt-2 block text-[#719b4e]">
                Meaningful
              </span>
              <span className={isDark ? "text-[#f3f3e9]" : "text-[#173f2c]"}>
                Actions.
              </span>
            </h1>

            <p className={`mt-7 max-w-xl text-base leading-8 sm:text-lg ${mutedText}`}>
              Real change starts with people like you. Discover local
              initiatives, connect with volunteers, and turn small acts
              of kindness into a lasting impact.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/events"
                className="group inline-flex items-center gap-3 rounded-full bg-[#174c38] px-7 py-4 font-bold text-white shadow-xl shadow-[#174c38]/15 transition hover:-translate-y-1 hover:bg-[#246647]"
              >
                Explore Events
                <ArrowRight size={19} className="transition group-hover:translate-x-1" />
              </Link>

              <Link
                href={user ? "/create-event" : "/register"}
                className={`inline-flex items-center gap-2 rounded-full border px-7 py-4 font-bold transition hover:-translate-y-1 ${
                  isDark
                    ? "border-[#385541] text-white hover:bg-[#203b2b]"
                    : "border-[#cdd9c3] bg-white/70 text-[#174c38] hover:bg-white"
                }`}
              >
                {user ? "Create an Event" : "Join Our Community"}
                <MoveUpRight size={17} />
              </Link>
            </div>

            {/* COMMUNITY TRUST */}
            <div className={`mt-12 flex flex-wrap items-center gap-5 border-t pt-8 ${
              isDark ? "border-[#263d2c]" : "border-[#dce4d5]"
            }`}>
              <div className="flex -space-x-3">
                {[
                  "photo-1534528741775-53994a69daeb",
                  "photo-1500648767791-00dcc994a43e",
                  "photo-1531123897727-8f129e1688ce",
                ].map((photo) => (
                  <img
                    key={photo}
                    src={`https://images.unsplash.com/${photo}?w=100&h=100&fit=crop`}
                    alt="Community member"
                    className="h-11 w-11 rounded-full border-2 border-white object-cover"
                  />
                ))}

                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-[#dce9ca] text-xs font-black text-[#174c38]">
                  +
                </div>
              </div>

              <div>
                <p className={`text-sm font-extrabold ${pageText}`}>
                  Everyone can make a difference
                </p>
                <p className={`mt-1 text-xs ${mutedText}`}>
                  One community. Countless possibilities.
                </p>
              </div>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full border border-[#8eaa70]/50" />

            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.8rem]">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1400&auto=format&fit=crop"
                alt="Volunteers working together"
                className="h-[390px] w-full object-cover sm:h-[520px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#102b1b]/75 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d5ea83]">
                  Together we grow
                </p>

                <h2 className="mt-3 max-w-sm text-3xl font-black leading-tight text-white sm:text-4xl">
                  Small acts can change the world.
                </h2>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-white/80">
                  <Leaf size={17} />
                  Grow kindness. Create impact.
                </div>
              </div>
            </div>

            {/* FLOATING CARD */}
            <div className={`absolute -bottom-7 -left-3 rounded-2xl border p-4 shadow-xl sm:-left-8 sm:p-5 ${
              isDark
                ? "border-[#385541] bg-[#14271c]"
                : "border-[#e5e9dc] bg-white"
            }`}>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#eaf1df] p-3 text-[#174c38]">
                  <HandHeart size={25} />
                </div>

                <div>
                  <p className={`font-extrabold ${pageText}`}>
                    Make an Impact
                  </p>
                  <p className={`mt-1 text-xs ${mutedText}`}>
                    Start with one good action.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className={`border-y ${
        isDark
          ? "border-[#294333] bg-[#14271c]"
          : "border-[#e4e7d9] bg-[#174c38]"
      }`}>
        <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-white/15 px-5 py-10 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="px-2 text-center sm:px-6">
              <h3 className="text-2xl font-black text-[#d5ea83] sm:text-4xl">
                {stat.number}
              </h3>
              <p className="mt-2 text-[10px] font-semibold text-white/75 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-28"
      >
        <div className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#719b4e]">
              <Sprout size={17} />
              What brings us together
            </p>

            <h2 className={`max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl ${pageText}`}>
              More than a platform.
              <span className="block text-[#719b4e]">
                A movement for good.
              </span>
            </h2>
          </div>

          <p className={`max-w-lg leading-8 md:ml-auto ${mutedText}`}>
            We make it easier for people to find opportunities, organize
            meaningful activities, and build stronger communities through
            shared experiences.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            const featureLink =
              feature.title === "Create an Event"
                ? user
                  ? "/create-event"
                  : "/register"
                : feature.href;

            return (
              <article
                key={feature.title}
                className={`group relative overflow-hidden rounded-[2rem] border p-8 transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  isDark
                    ? "border-[#294333] bg-[#14271c] hover:border-[#719b4e]"
                    : "border-[#e5e9dc] bg-white hover:border-[#b5c99d]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color} text-[#174c38] transition duration-300 group-hover:bg-[#174c38] group-hover:text-[#d5ea83]`}>
                    <Icon size={27} />
                  </div>

                  <span className={`text-sm font-black ${
                    isDark ? "text-[#49634d]" : "text-[#d6dfca]"
                  }`}>
                    {feature.number}
                  </span>
                </div>

                <h3 className={`mt-9 text-2xl font-black ${pageText}`}>
                  {feature.title}
                </h3>

                <p className={`mt-4 min-h-24 leading-7 ${mutedText}`}>
                  {feature.description}
                </p>

                <Link
                  href={featureLink}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-[#719b4e] transition group-hover:gap-3"
                >
                  {feature.link}
                  <ArrowUpRight size={17} />
                </Link>

                <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-[#d5ea83]/10 transition duration-500 group-hover:scale-150" />
              </article>
            );
          })}
        </div>
      </section>

      {/* EDITORIAL QUOTE */}
      <section className={`px-5 py-20 ${
        isDark ? "bg-[#14271c]" : "bg-[#eaf0df]"
      }`}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div className="flex justify-center">
            <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-[#9cb77f] sm:h-56 sm:w-56">
              <div className="absolute inset-3 rounded-full border border-[#9cb77f]/50" />
              <TreePine size={75} strokeWidth={1.1} className="text-[#719b4e]" />
            </div>
          </div>

          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-[#719b4e]">
              A thought to grow with
            </p>

            <h2 className={`text-3xl font-black leading-tight sm:text-5xl ${pageText}`}>
              "Alone we can do so little; together we can do so much."
            </h2>

            <p className={`mt-6 text-sm font-semibold ${mutedText}`}>
              — The spirit behind TogetherWe
            </p>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section
        id="events"
        className={`py-24 lg:py-28 ${
          isDark ? "bg-[#0d1c13]" : "bg-[#faf9f2]"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#719b4e]">
                Discover opportunities
              </p>

              <h2 className={`text-4xl font-black tracking-tight sm:text-5xl ${pageText}`}>
                Upcoming Events
              </h2>

              <p className={`mt-4 max-w-xl leading-7 ${mutedText}`}>
                Find something meaningful to be part of. Your next good
                experience starts here.
              </p>
            </div>

            <Link
              href="/events"
              className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition hover:bg-[#174c38] hover:text-white ${
                isDark
                  ? "border-[#49634d] text-[#d5ea83]"
                  : "border-[#9cbea0] text-[#39774d]"
              }`}
            >
              View All Events
              <ArrowRight size={17} />
            </Link>
          </div>

          {/* LOADING */}
          {eventsLoading && (
            <div
              className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
              role="status"
              aria-label="Loading upcoming events"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <article
                  key={index}
                  className={`overflow-hidden rounded-[2rem] border ${cardSurface}`}
                >
                  <div className={`h-56 animate-pulse ${
                    isDark ? "bg-[#263d2c]" : "bg-[#e3e9dc]"
                  }`} />

                  <div className="space-y-4 p-6">
                    <div className={`h-6 w-3/4 animate-pulse rounded ${
                      isDark ? "bg-[#263d2c]" : "bg-[#e3e9dc]"
                    }`} />
                    <div className={`h-4 w-1/2 animate-pulse rounded ${
                      isDark ? "bg-[#263d2c]" : "bg-[#e3e9dc]"
                    }`} />
                    <div className={`h-4 w-2/3 animate-pulse rounded ${
                      isDark ? "bg-[#263d2c]" : "bg-[#e3e9dc]"
                    }`} />
                    <div className={`h-11 animate-pulse rounded-xl ${
                      isDark ? "bg-[#263d2c]" : "bg-[#e3e9dc]"
                    }`} />
                  </div>
                </article>
              ))}
              <span className="sr-only">Loading events...</span>
            </div>
          )}

          {/* ERROR */}
          {!eventsLoading && eventsError && (
            <div className={`rounded-2xl border p-8 text-center ${
              isDark
                ? "border-red-900 bg-red-950/30"
                : "border-red-200 bg-red-50"
            }`}>
              <p className="font-semibold text-red-500">
                {eventsError}
              </p>

              <p className="mt-2 text-sm text-red-400">
                Please check your backend server and try again.
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!eventsLoading && !eventsError && events.length === 0 && (
            <div className={`rounded-[2rem] border border-dashed p-14 text-center ${
              isDark
                ? "border-[#385541] bg-[#14271c]"
                : "border-[#d6e3d4] bg-white"
            }`}>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf1df] text-[#174c38]">
                <CalendarDays size={29} />
              </div>

              <h3 className={`mt-5 text-xl font-black ${pageText}`}>
                No Upcoming Events Yet
              </h3>

              <p className={`mt-2 ${mutedText}`}>
                Be the first to create something meaningful.
              </p>

              <Link
                href={user ? "/create-event" : "/register"}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#174c38] px-6 py-3 font-bold text-white transition hover:bg-[#246647]"
              >
                Create an Event
                <ArrowRight size={17} />
              </Link>
            </div>
          )}

          {/* EVENT CARDS */}
          {!eventsLoading && !eventsError && events.length > 0 && (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <article
                  key={event._id}
                  className={`group overflow-hidden rounded-[2rem] border transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                    isDark
                      ? "border-[#294333] bg-[#14271c]"
                      : "border-[#e3e9dc] bg-white"
                  }`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

                    <span className="absolute left-5 top-5 rounded-full bg-[#f7f5ec] px-4 py-2 text-xs font-black text-[#174c38] shadow-sm">
                      {event.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className={`line-clamp-2 text-xl font-black ${pageText}`}>
                      {event.title}
                    </h3>

                    {event.description && (
                      <p className={`mt-3 line-clamp-2 text-sm leading-6 ${mutedText}`}>
                        {event.description}
                      </p>
                    )}

                    <div className={`mt-5 space-y-3 text-sm ${mutedText}`}>
                      <p className="flex items-center gap-3">
                        <CalendarDays size={17} className="shrink-0 text-[#719b4e]" />
                        {new Date(`${event.date}T00:00:00`).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>

                      <p className="flex items-center gap-3">
                        <MapPin size={17} className="shrink-0 text-[#719b4e]" />
                        <span className="line-clamp-1">{event.location}</span>
                      </p>

                      <p className="flex items-center gap-3">
                        <Users size={17} className="shrink-0 text-[#719b4e]" />
                        {event.volunteers ?? 0} Volunteers
                      </p>
                    </div>

                    <Link
                      href={`/events/${event._id}`}
                      className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#eaf1df] py-3.5 text-sm font-black text-[#174c38] transition hover:bg-[#174c38] hover:text-white"
                    >
                      Explore Event
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

 
{/* ========================================
    ORGANIC EDITORIAL GALLERY
======================================== */}

<section
  id="gallery"
  className={`relative overflow-hidden px-5 py-24 lg:px-8 lg:py-32 ${
    isDark ? "bg-[#0d1c13]" : "bg-[#faf9f2]"
  }`}
>
  <div className="mx-auto max-w-7xl">

    {/* HEADER */}
    <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

      <div>
        <p className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#719b4e]">
          <Leaf size={16} />
          Our Community
        </p>

        <h2
          className={`max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl ${
            isDark ? "text-[#f3f3e9]" : "text-[#173f2c]"
          }`}
        >
          Moments That
          <span className="ml-3 font-serif font-normal italic text-[#719b4e]">
            Matter.
          </span>
        </h2>
      </div>

      <div className="max-w-md">
        <p
          className={`text-sm leading-8 sm:text-base ${
            isDark ? "text-[#a5b5a6]" : "text-[#778478]"
          }`}
        >
          Real people. Real stories. Every helping hand creates
          a little more hope and brings our community closer together.
        </p>

        <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#719b4e]">
          <span className="h-px w-10 bg-[#719b4e]" />
          Stories of positive change
        </div>
      </div>

    </div>

    {/* GALLERY GRID */}
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-12">

      {gallery.map((item, index) => (
        <article
          key={item.id}
          className={`group relative isolate overflow-hidden rounded-[1.8rem] ${
            index === 0
              ? "min-h-[430px] sm:col-span-2 md:col-span-7 md:row-span-2 md:min-h-[590px]"
              : index === 1 || index === 2
                ? "min-h-[280px] sm:col-span-1 md:col-span-5"
                : "min-h-[280px] sm:col-span-1 md:col-span-6"
          }`}
        >

          {/* IMAGE */}
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* IMAGE OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#102b1b]/90 via-[#102b1b]/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

          {/* IMAGE NUMBER */}
          <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/10 text-xs font-bold text-white backdrop-blur-md">
            {item.number}
          </div>

          {/* IMAGE CONTENT */}
          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-7">

            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5ea83]">
              {item.category}
            </p>

            <h3
              className={`max-w-md font-black leading-tight text-white ${
                index === 0
                  ? "text-3xl sm:text-4xl lg:text-5xl"
                  : "text-2xl sm:text-3xl"
              }`}
            >
              {item.title}
            </h3>

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/80 transition-all duration-300 group-hover:gap-4">
              Discover the story
              <ArrowUpRight size={16} />
            </div>

          </div>

          {/* HOVER BORDER */}
          <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] border border-white/0 transition duration-500 group-hover:border-[#d5ea83]/70" />

        </article>
      ))}

    </div>

    {/* BOTTOM CTA */}
    <div
      className={`mt-10 flex flex-col items-center justify-between gap-4 border-t pt-7 sm:flex-row ${
        isDark ? "border-[#294333]" : "border-[#e5e9dc]"
      }`}
    >

      <p
        className={`text-sm ${
          isDark ? "text-[#a5b5a6]" : "text-[#778478]"
        }`}
      >
        Every picture tells a story of kindness.
      </p>

      <Link
        href="/events"
        className="inline-flex items-center gap-2 rounded-full bg-[#174c38] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-[#246647]"
      >
        Be Part of Our Story
        <ArrowUpRight size={17} />
      </Link>

    </div>

  </div>
</section>

      {/* NEWSLETTER */}
      <section className={`px-5 py-24 ${
        isDark ? "bg-[#14271c]" : "bg-[#eaf0df]"
      }`}>
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-[#174c38] px-6 py-14 text-center text-white shadow-2xl sm:px-12 sm:py-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-[#d5ea83]">
            <Mail size={29} />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#d5ea83]">
            Stay Connected
          </p>

          <h2 className="mt-3 text-3xl font-black sm:text-5xl">
            Good things are happening.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-8 text-[#e5eddf]/80">
            Stay informed about upcoming events, volunteer opportunities,
            and inspiring community initiatives.
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="mx-auto mt-9 flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-2 sm:flex-row sm:rounded-full"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setNewsletterMessage("");
              }}
              placeholder="Enter your email address"
              className="min-w-0 flex-1 rounded-full px-5 py-3.5 text-sm text-[#173f2c] outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d5ea83] px-7 py-3.5 text-sm font-black text-[#173f2c] transition hover:bg-[#e5f3b5]"
            >
              Subscribe
              <ArrowRight size={17} />
            </button>
          </form>

          {newsletterMessage && (
            <p className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-[#d5ea83]">
              <CheckCircle2 size={17} />
              {newsletterMessage}
            </p>
          )}

          <p className="mt-4 text-xs text-white/50">
            Newsletter design preview. Subscription service is not connected.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-24 lg:py-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#173f2c] px-6 py-16 text-center text-white sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full border-[60px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[#d5ea83]/10 blur-3xl" />

          <div className="relative">
            <div className="mx-auto inline-flex rounded-2xl bg-white/10 p-4 text-[#d5ea83]">
              <Flower2 size={30} />
            </div>

            <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-[#d5ea83]">
              Be part of something meaningful
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
              The change you want to see starts with you.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#dce8d8]">
              Your time, your effort, and your kindness can make a real
              difference. Join our community and start creating change.
            </p>

            <Link
              href={user ? "/create-event" : "/register"}
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#d5ea83] px-8 py-4 font-black text-[#173f2c] transition hover:-translate-y-1 hover:bg-white"
            >
              {user ? "Create an Event" : "Join TogetherWe"}
              <ArrowRight size={19} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#102b1b] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d5ea83] text-[#174c38]">
                <Heart size={22} fill="currentColor" />
              </div>

              <span className="text-2xl font-black">
                Together<span className="text-[#d5ea83]">We.</span>
              </span>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-8 text-[#a9b9a8]">
              Bringing communities together through meaningful actions
              and social development initiatives.
            </p>
          </div>

          <div>
            <h3 className="mb-6 font-black">Explore</h3>
            <div className="space-y-4 text-sm text-[#a9b9a8]">
              <p>
                <Link href="/" className="transition hover:text-[#d5ea83]">
                  Home
                </Link>
              </p>
              <p>
                <Link href="/events" className="transition hover:text-[#d5ea83]">
                  Upcoming Events
                </Link>
              </p>
              <p>
                <a href="#features" className="transition hover:text-[#d5ea83]">
                  About Us
                </a>
              </p>
              <p>
                <a href="#gallery" className="transition hover:text-[#d5ea83]">
                  Gallery
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-6 font-black">Get Involved</h3>
            <div className="space-y-4 text-sm text-[#a9b9a8]">
              <p>
                <Link href="/register" className="transition hover:text-[#d5ea83]">
                  Join Community
                </Link>
              </p>
              <p>
                <Link href="/login" className="transition hover:text-[#d5ea83]">
                  Login
                </Link>
              </p>
              <p>
                <Link href="/events" className="transition hover:text-[#d5ea83]">
                  Explore Events
                </Link>
              </p>
              <p>
                <Link href="/create-event" className="transition hover:text-[#d5ea83]">
                  Create Event
                </Link>
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-6 font-black">Our Purpose</h3>

            <p className="text-sm leading-8 text-[#a9b9a8]">
              A little kindness goes a long way. Together, we can build
              a more caring, connected, and sustainable community.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#49634d] px-4 py-2 text-xs font-bold text-[#d5ea83]">
              <Leaf size={15} />
              Made for a better tomorrow
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-6 text-center text-xs text-[#849786]">
          © 2026 TogetherWe. Built for a better community.
        </div>
      </footer>
    </main>
  );
}
