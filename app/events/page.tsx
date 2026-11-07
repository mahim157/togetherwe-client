
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Search,
  CalendarDays,
  MapPin,
  Users,
  ArrowRight,
  Heart,
  SlidersHorizontal,
  Sun,
  Moon,
  Leaf,
  Sparkles,
  Plus,
  ArrowUpRight,
  X,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useTheme } from "../components/ThemeProvider";

type Event = {
  _id: string;
  id?: string;
  title: string;
  category: string;
  location: string;
  date: string;
  volunteers: number;
  description: string;
  image: string;
};

const categories = [
  "All Categories",
  "Donation",
  "Social Work",
  "Cleanup",
  "Plantation",
  "Education",
  "Healthcare",
  "Other",
];

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");

  const [today, setToday] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageBg = isDark ? "bg-[#101c17]" : "bg-[#f7f7f0]";
  const mainText = isDark ? "text-[#f3f5ed]" : "text-[#183b2d]";
  const mutedText = isDark ? "text-slate-400" : "text-[#718077]";

  const cardStyle = isDark
    ? "border-white/10 bg-[#192820]"
    : "border-[#e8e9df] bg-white";

  const inputStyle = isDark
    ? "border-white/10 bg-[#101c17] text-white placeholder:text-slate-500 focus:border-[#a8d66d]"
    : "border-[#e4e7dc] bg-[#fafbf7] text-[#183b2d] placeholder:text-gray-400 focus:border-[#638b48]";

  useEffect(() => {
    const currentDate = new Date();

    const formattedToday = [
      currentDate.getFullYear(),
      String(currentDate.getMonth() + 1).padStart(2, "0"),
      String(currentDate.getDate()).padStart(2, "0"),
    ].join("-");

    setToday(formattedToday);
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/events",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load events.");
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.events)) {
          throw new Error("Invalid event data received.");
        }

        setEvents(result.events);
      } catch (err) {
        console.error("Fetch events error:", err);

        setError(
          "Unable to load events. Please make sure the server is running."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const handleCreateEvent = () => {
    if (isPending) return;

    if (session?.user) {
      router.push("/create-event");
    } else {
      router.push("/login");
    }
  };

  const upcomingEvents = today
    ? events.filter((event) => event.date >= today)
    : [];

  const filteredEvents = upcomingEvents.filter((event) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      event.title.toLowerCase().includes(search) ||
      event.location.toLowerCase().includes(search) ||
      event.description.toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === "All Categories" ||
      event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalLocations = new Set(
    filteredEvents.map((event) => event.location)
  ).size;

  return (
    <main
      className={`min-h-screen overflow-hidden transition-colors duration-300 ${pageBg} ${mainText}`}
    >
      {/* HERO SECTION */}
      <section
        className={`relative overflow-hidden ${
          isDark ? "bg-[#14251c]" : "bg-[#e9eddf]"
        }`}
      >
        <div className="pointer-events-none absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full border border-[#77966b]/20" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-[320px] w-[320px] rounded-full border border-[#77966b]/20" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-[350px] w-[350px] rounded-full bg-[#91a77d]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-8 md:px-8 md:pb-28 md:pt-12">
          {/* TOP BAR */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className={`flex items-center gap-2 text-xl font-black tracking-tight ${
                isDark ? "text-white" : "text-[#183b2d]"
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#244d38] text-[#d9ed9c]">
                <Heart size={21} fill="currentColor" />
              </span>
              TogetherWe
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                isDark
                  ? "border-white/15 bg-white/5 text-yellow-300 hover:bg-white/10"
                  : "border-[#d6ddcc] bg-white/70 text-[#244d38] hover:bg-white"
              }`}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
              <span className="hidden sm:inline">
                {isDark ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
          </div>

          {/* HERO CONTENT */}
          <div className="mt-20 grid items-end gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:mt-28">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#91a77d]/40 bg-[#91a77d]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#527442]">
                <Sparkles size={15} />
                Make a Difference Together
              </span>

              <h1
                className={`mt-7 text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl md:text-7xl ${
                  isDark ? "text-white" : "text-[#183b2d]"
                }`}
              >
                Upcoming
                <br />
                Community{" "}
                <span className="text-[#6e914e]">Events.</span>
              </h1>

              <p
                className={`mt-7 max-w-xl text-base leading-8 md:text-lg ${mutedText}`}
              >
                Discover meaningful community events, meet people
                who care, and turn your ideas into positive action.
                Together, we can build a better tomorrow.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#events-list"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#244d38] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-[#244d38]/20 transition hover:-translate-y-1 hover:bg-[#183b2d]"
                >
                  Explore Events
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </a>

                <button
                  onClick={handleCreateEvent}
                  disabled={isPending}
                  className={`inline-flex items-center gap-2 rounded-full border px-7 py-4 text-sm font-bold transition hover:-translate-y-1 disabled:opacity-50 ${
                    isDark
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-[#aab99e] text-[#244d38] hover:bg-white/70"
                  }`}
                >
                  <Plus size={18} />
                  {isPending ? "Checking..." : "Create an Event"}
                </button>
              </div>
            </div>

            {/* HERO SIDE CARD */}
            <div
              className={`relative overflow-hidden rounded-[28px] p-7 md:p-9 ${
                isDark
                  ? "border border-white/10 bg-[#1d3528]"
                  : "border border-white/70 bg-[#244d38]"
              }`}
            >
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#a8c67c]/15 blur-2xl" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9ed9c] text-[#244d38]">
                  <Leaf size={24} />
                </div>

                <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#c7df91]">
                  Our Community
                </p>

                <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-4xl">
                  Be part of
                  <br />
                  something good.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/70">
                  Every volunteer, every idea, and every small
                  contribution brings us closer to a better community.
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-white/15 pt-5">
                  <span className="text-sm font-medium text-white/70">
                    Your community needs you.
                  </span>
                  <Heart
                    size={21}
                    className="text-[#c7df91]"
                    fill="currentColor"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STATISTICS */}
          <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                value: loading ? "..." : upcomingEvents.length,
                label: "Upcoming Events",
              },
              {
                value: loading ? "..." : totalLocations,
                label: "Community Locations",
              },
              {
                value: "100%",
                label: "Community Spirit",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl border p-5 ${
                  isDark
                    ? "border-white/10 bg-white/[0.04]"
                    : "border-white/80 bg-white/60"
                }`}
              >
                <h3 className="text-3xl font-black text-[#779956]">
                  {stat.value}
                </h3>
                <p className={`mt-1 text-sm ${mutedText}`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISCOVER EVENTS SECTION */}
      <section
        id="events-list"
        className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#779956]">
              <Leaf size={15} />
              Find Your Opportunity
            </div>

            <h2
              className={`mt-4 text-4xl font-black tracking-tight md:text-5xl ${mainText}`}
            >
              Discover Events<span className="text-[#8ba765]">.</span>
            </h2>

            <p className={`mt-4 max-w-xl text-base leading-7 ${mutedText}`}>
              Find an opportunity that matches your interests.
              Join hands with others and make a meaningful difference.
            </p>
          </div>

          <p className={`text-sm font-medium ${mutedText}`}>
            Showing{" "}
            <span className="font-bold text-[#779956]">
              {filteredEvents.length}
            </span>{" "}
            of {upcomingEvents.length} events
          </p>
        </div>

        {/* SEARCH AND FILTER */}
        <div
          className={`mt-10 grid gap-4 rounded-[24px] border p-4 shadow-sm md:grid-cols-[1fr_270px] md:p-5 ${cardStyle}`}
        >
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b998c]"
            />

            <input
              type="text"
              placeholder="Search events, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-xl border py-4 pl-12 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-[#779956]/20 ${inputStyle}`}
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b998c] hover:text-[#779956]"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <div className="relative">
            <SlidersHorizontal
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b998c]"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full appearance-none rounded-xl border py-4 pl-11 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-[#779956]/20 ${inputStyle}`}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className={`overflow-hidden rounded-[24px] border ${cardStyle}`}
              >
                <div className="h-56 animate-pulse bg-[#8ba765]/15" />
                <div className="space-y-4 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-[#8ba765]/15" />
                  <div className="h-4 w-full animate-pulse rounded bg-[#8ba765]/10" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-[#8ba765]/10" />
                  <div className="h-11 animate-pulse rounded-xl bg-[#8ba765]/15" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div
            className={`mt-12 rounded-[24px] border px-5 py-14 text-center ${
              isDark
                ? "border-red-900 bg-red-950/30"
                : "border-red-200 bg-red-50"
            }`}
          >
            <p className="text-red-500">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-[#244d38] px-7 py-3 font-bold text-white transition hover:bg-[#183b2d]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EVENT CARDS */}
        {!loading && !error && (
          <>
            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <article
                  key={event._id}
                  className={`group overflow-hidden rounded-[24px] border shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl ${
                    isDark
                      ? "border-white/10 bg-[#192820]"
                      : "border-[#e8e9df] bg-white"
                  }`}
                >
                  <div className="relative h-60 overflow-hidden bg-[#e9eddf]">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#10291e]/70 via-transparent to-black/10" />

                    <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-[#183b2d]/85 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                      {event.category}
                    </span>

                    <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition group-hover:rotate-45 group-hover:bg-[#d9ed9c] group-hover:text-[#244d38]">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3
                      className={`text-xl font-black leading-snug transition group-hover:text-[#779956] ${mainText}`}
                    >
                      {event.title}
                    </h3>

                    <p
                      className={`mt-3 line-clamp-2 min-h-[48px] text-sm leading-6 ${mutedText}`}
                    >
                      {event.description}
                    </p>

                    <div
                      className={`mt-6 space-y-3 border-t pt-5 ${
                        isDark ? "border-white/10" : "border-[#edf0e8]"
                      }`}
                    >
                      <div className={`flex items-center gap-3 text-sm ${mutedText}`}>
                        <CalendarDays
                          size={17}
                          className="shrink-0 text-[#779956]"
                        />
                        <span>{formatDate(event.date)}</span>
                      </div>

                      <div className={`flex items-center gap-3 text-sm ${mutedText}`}>
                        <MapPin
                          size={17}
                          className="shrink-0 text-[#779956]"
                        />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>

                      <div className={`flex items-center gap-3 text-sm ${mutedText}`}>
                        <Users
                          size={17}
                          className="shrink-0 text-[#779956]"
                        />
                        <span>
                          {event.volunteers ?? 0} volunteers interested
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/events/${event._id}`}
                      className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#244d38] py-3.5 text-sm font-bold text-white transition hover:bg-[#183b2d]"
                    >
                      View Details
                      <ArrowRight
                        size={17}
                        className="transition group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* EMPTY STATE */}
            {today && filteredEvents.length === 0 && (
              <div
                className={`mt-12 rounded-[28px] border border-dashed px-5 py-20 text-center ${
                  isDark
                    ? "border-white/15 bg-[#192820]"
                    : "border-[#dce3d4] bg-white"
                }`}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#779956]/15 text-[#779956]">
                  <Search size={27} />
                </div>

                <h3 className={`mt-6 text-2xl font-black ${mainText}`}>
                  No Events Found
                </h3>

                <p className={`mx-auto mt-3 max-w-md text-sm leading-7 ${mutedText}`}>
                  We couldn't find any events matching your search.
                  Try another keyword or choose a different category.
                </p>

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All Categories");
                  }}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#244d38] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#183b2d]"
                >
                  Clear Filters
                  <X size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* BOTTOM CTA */}
      <section className="px-5 pb-20 md:px-8 md:pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-[#244d38] px-6 py-16 text-center text-white md:px-12 md:py-20">
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-10 -top-16 h-60 w-60 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#a8c67c]/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d9ed9c] text-[#244d38]">
              <Heart size={27} fill="currentColor" />
            </div>

            <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#c7df91]">
              Start Something Meaningful
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
              Have an Idea for a Community Event?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/70 md:text-base">
              Bring people together and create a positive impact
              in your community. Your next great idea could inspire
              hundreds of people.
            </p>

            <button
              onClick={handleCreateEvent}
              disabled={isPending}
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#d9ed9c] px-8 py-4 text-sm font-black text-[#244d38] shadow-lg transition hover:-translate-y-1 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create an Event
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
