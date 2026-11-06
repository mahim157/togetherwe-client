
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
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

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

  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");

  const [today, setToday] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get today's date.
  useEffect(() => {
    const currentDate = new Date();

    const formattedToday = [
      currentDate.getFullYear(),
      String(currentDate.getMonth() + 1).padStart(2, "0"),
      String(currentDate.getDate()).padStart(2, "0"),
    ].join("-");

    setToday(formattedToday);
  }, []);

  // Fetch events from MongoDB through Express API.
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

  // Navigate to Create Event page.
  const handleCreateEvent = () => {
    if (isPending) return;

    if (session?.user) {
      router.push("/create-event");
    } else {
      router.push("/login");
    }
  };

  // Show upcoming events only.
  const upcomingEvents = today
    ? events.filter((event) => event.date >= today)
    : [];

  // Search and category filtering.
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
    <main className="min-h-screen bg-[#f7faf8] text-gray-900">
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 px-5 py-20 md:py-24">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-green-100/60 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm">
              <Heart size={16} />
              Make a Difference Together
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
              Upcoming Community{" "}
              <span className="text-green-600">Events</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 md:text-lg">
              Discover meaningful community activities, connect with
              volunteers, and take part in creating positive change.
              Every small contribution matters.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#events-list"
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
              >
                Explore Events
                <ArrowRight size={18} />
              </a>

              <button
                onClick={handleCreateEvent}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-green-500 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Checking Login..." : "Create an Event"}
              </button>
            </div>
          </div>

          {/* Event Statistics */}
          <div className="mt-14 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur">
              <h3 className="text-3xl font-bold text-green-600">
                {loading ? "..." : upcomingEvents.length}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Upcoming Events
              </p>
            </div>

            <div className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur">
              <h3 className="text-3xl font-bold text-green-600">
                {loading ? "..." : totalLocations}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Locations
              </p>
            </div>

            <div className="col-span-2 rounded-2xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur sm:col-span-1">
              <h3 className="text-3xl font-bold text-green-600">
                100%
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Community Spirit
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section
        id="events-list"
        className="mx-auto max-w-7xl px-5 py-16 md:py-20"
      >
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
              Find Your Opportunity
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Explore Events
            </h2>

            <p className="mt-3 max-w-xl text-gray-500">
              Find an event that matches your interests and become
              part of something meaningful.
            </p>
          </div>

          <p className="text-sm font-medium text-gray-500">
            Showing{" "}
            <span className="font-bold text-green-600">
              {filteredEvents.length}
            </span>{" "}
            of {upcomingEvents.length} events
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mt-9 grid gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_260px] md:p-5">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by event name, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-12 text-center text-gray-500">
            Loading upcoming events...
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 px-5 py-12 text-center">
            <p className="text-red-600">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Event Cards */}
        {!loading && !error && (
          <>
            <div className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <article
                  key={event._id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-green-700 shadow-sm">
                      {event.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 transition group-hover:text-green-700">
                      {event.title}
                    </h3>

                    <p className="mt-3 min-h-[48px] text-sm leading-6 text-gray-500">
                      {event.description}
                    </p>

                    <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <CalendarDays
                          size={17}
                          className="shrink-0 text-green-600"
                        />
                        <span>{formatDate(event.date)}</span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <MapPin
                          size={17}
                          className="shrink-0 text-green-600"
                        />
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Users
                          size={17}
                          className="shrink-0 text-green-600"
                        />
                        <span>
                          {event.volunteers ?? 0} volunteers interested
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/events/${event._id}`}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-green-600 py-3 font-semibold text-green-700 transition hover:bg-green-600 hover:text-white"
                    >
                      View Details
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Empty State */}
            {today && filteredEvents.length === 0 && (
              <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                  <Search size={28} className="text-green-600" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  No Events Found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try another search term or select a different category.
                </p>

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All Categories");
                  }}
                  className="mt-6 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 to-emerald-600 px-6 py-12 text-center text-white md:px-12 md:py-16">
          <h2 className="text-3xl font-bold md:text-4xl">
            Have an Idea for a Community Event?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-green-50">
            Bring people together and make a positive impact in your
            community. Start organizing your own event today.
          </p>

          <button
            onClick={handleCreateEvent}
            disabled={isPending}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-green-700 shadow-lg transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create an Event
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}
