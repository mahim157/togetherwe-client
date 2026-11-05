"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  CalendarDays,
  MapPin,
  Users,
  ArrowRight,
  Heart,
  SlidersHorizontal,
} from "lucide-react";

const events = [
  {
    id: "1",
    title: "Winter Clothes Distribution",
    category: "Donation",
    location: "Mirpur 10, Dhaka",
    date: "2026-11-20",
    volunteers: 45,
    description:
      "Help us distribute warm clothes to people who need support during the winter season.",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
  },
  {
    id: "2",
    title: "Community Tree Plantation",
    category: "Plantation",
    location: "Savar, Dhaka",
    date: "2026-11-25",
    volunteers: 32,
    description:
      "Join our initiative to make the community greener by planting trees.",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
  },
  {
    id: "3",
    title: "Neighborhood Cleanup Drive",
    category: "Cleanup",
    location: "Dhanmondi, Dhaka",
    date: "2026-11-28",
    volunteers: 28,
    description:
      "Work together to clean public spaces and create a healthier neighborhood.",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
  },
  {
    id: "4",
    title: "Food for Everyone",
    category: "Donation",
    location: "Uttara, Dhaka",
    date: "2026-12-02",
    volunteers: 60,
    description:
      "Support our food distribution program for underprivileged families.",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800",
  },
  {
    id: "5",
    title: "Community Health Awareness",
    category: "Awareness",
    location: "Mohammadpur, Dhaka",
    date: "2026-12-05",
    volunteers: 35,
    description:
      "Take part in a community awareness program focused on health and wellbeing.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
  },
  {
    id: "6",
    title: "Help for Street Children",
    category: "Social Work",
    location: "Farmgate, Dhaka",
    date: "2026-12-10",
    volunteers: 25,
    description:
      "Spend time supporting street children through education and essential supplies.",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
  },
];

const categories = [
  "All Categories",
  "Donation",
  "Plantation",
  "Cleanup",
  "Awareness",
  "Social Work",
];

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");

  // Current date is calculated after the initial render.
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    const currentDate = new Date();
    const formattedToday = [
      currentDate.getFullYear(),
      String(currentDate.getMonth() + 1).padStart(2, "0"),
      String(currentDate.getDate()).padStart(2, "0"),
    ].join("-");

    setToday(formattedToday);
  }, []);

  // Only show events scheduled for today or a future date.
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

              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-green-500 hover:text-green-700"
              >
                Create an Event
              </Link>
            </div>
          </div>

          {/* Event Statistics */}
          <div className="mt-14 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur">
              <h3 className="text-3xl font-bold text-green-600">
                {upcomingEvents.length}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Upcoming Events
              </p>
            </div>

            <div className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur">
              <h3 className="text-3xl font-bold text-green-600">
                {totalLocations}
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

        {/* Event Cards */}
        <div className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <article
              key={event.id}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Event Image */}
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

              {/* Event Information */}
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
                    <span>{event.volunteers} volunteers interested</span>
                  </div>
                </div>

                <Link
                  href={`/events/${event.id}`}
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

        {/* Loading State */}
        {!today && (
          <div className="mt-10 text-center text-sm text-gray-500">
            Loading upcoming events...
          </div>
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

          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-green-700 shadow-lg transition hover:bg-green-50"
          >
            Create an Event
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}