
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CalendarDays,
  MapPin,
  Users,
  Loader2,
  Trash2,
  Heart,
  Search,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Event = {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  date: string;
  volunteers: number;
};

export default function SavedEventsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState("");

  const fetchSavedEvents = useCallback(async () => {
    if (isPending) return;

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        throw new Error("Please login again to view your saved events.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/events/bookmarked`,
        {
          headers: {
            Authorization: `Bearer ${tokenResult.data.token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load saved events."
        );
      }

      setEvents(Array.isArray(result.events) ? result.events : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [user, isPending, router]);

  useEffect(() => {
    fetchSavedEvents();
  }, [fetchSavedEvents]);

  const handleRemoveBookmark = async (eventId: string) => {
    if (removingId) return;

    try {
      setRemovingId(eventId);
      setError("");

      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/events/${eventId}/bookmark`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenResult.data.token}`,
          },
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Could not remove this bookmark."
        );
      }

      setEvents((previousEvents) =>
        previousEvents.filter((event) => event._id !== eventId)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setRemovingId("");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isPending || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9f2] px-5">
        <div className="text-center">
          <Loader2
            size={38}
            className="mx-auto animate-spin text-[#174c38]"
          />
          <p className="mt-4 font-semibold text-[#174c38]">
            Loading your saved events...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f2] px-5 py-10 text-[#173f2c] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">

        {/* Back Navigation */}
        <Link
          href="/events"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#719b4e] transition hover:text-[#174c38]"
        >
          <ArrowLeft size={17} />
          Back to Events
        </Link>

        {/* Page Heading */}
        <section className="mb-10">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf1dc]">
            <Bookmark
              size={27}
              className="text-[#174c38]"
            />
          </div>

          <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-[#719b4e]">
            Your Personal Collection
          </p>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Saved Events
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#778478]">
            Keep track of the community events that matter to you.
            Find your favorite opportunities and make a difference.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#e5e9dc] bg-white px-5 py-3 text-sm font-bold text-[#174c38]">
            <Bookmark size={17} />
            {events.length} Saved {events.length === 1 ? "Event" : "Events"}
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            {error}
            <button
              onClick={fetchSavedEvents}
              className="ml-3 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {events.length === 0 && !error && (
          <section className="rounded-[2rem] border border-[#e5e9dc] bg-white px-6 py-16 text-center shadow-sm sm:px-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf1dc]">
              <Bookmark
                size={35}
                className="text-[#174c38]"
              />
            </div>

            <h2 className="mt-7 text-2xl font-black">
              No Saved Events Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#778478]">
              You haven't bookmarked any events yet.
              Explore upcoming community events and save the ones
              you are interested in.
            </p>

            <Link
              href="/events"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#174c38] px-7 py-4 text-sm font-black text-white transition hover:bg-[#246647]"
            >
              Explore Events
              <ArrowRight size={18} />
            </Link>
          </section>
        )}

        {/* Saved Events Grid */}
        {events.length > 0 && (
          <section className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="group overflow-hidden rounded-[2rem] border border-[#e5e9dc] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Event Image */}
                <div className="relative h-56 overflow-hidden bg-[#eaf1dc]">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Heart size={42} className="text-[#719b4e]" />
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-[#d5ea83] px-4 py-2 text-xs font-black text-[#173f2c]">
                    {event.category}
                  </span>

                  <button
                    onClick={() => handleRemoveBookmark(event._id)}
                    disabled={removingId === event._id}
                    aria-label="Remove bookmark"
                    title="Remove from saved events"
                    className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {removingId === event._id ? (
                      <Loader2 size={19} className="animate-spin" />
                    ) : (
                      <Trash2 size={19} />
                    )}
                  </button>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <h2 className="line-clamp-2 text-xl font-black leading-7 text-[#173f2c]">
                    {event.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#778478]">
                    {event.description}
                  </p>

                  <div className="mt-5 space-y-3 border-t border-[#e5e9dc] pt-5">
                    <div className="flex items-center gap-3 text-sm font-semibold text-[#778478]">
                      <CalendarDays
                        size={17}
                        className="shrink-0 text-[#719b4e]"
                      />
                      {formatDate(event.date)}
                    </div>

                    <div className="flex items-center gap-3 text-sm font-semibold text-[#778478]">
                      <MapPin
                        size={17}
                        className="shrink-0 text-[#719b4e]"
                      />
                      <span className="line-clamp-1">
                        {event.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm font-semibold text-[#778478]">
                      <Users
                        size={17}
                        className="shrink-0 text-[#719b4e]"
                      />
                      {event.volunteers || 0} Volunteers
                    </div>
                  </div>

                  <Link
                    href={`/events/${event._id}`}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#174c38] px-5 py-4 text-sm font-black text-white transition hover:bg-[#246647]"
                  >
                    View Event Details
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* Bottom CTA */}
        <section className="mt-16 rounded-[2rem] bg-[#174c38] px-7 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-black sm:text-3xl">
            Ready to Make a Difference?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/75">
            Discover more community events, connect with volunteers,
            and become part of something meaningful.
          </p>

          <Link
            href="/events"
            className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#d5ea83] px-7 py-4 text-sm font-black text-[#173f2c] transition hover:bg-white"
          >
            Explore More Events
            <ArrowRight size={18} />
          </Link>
        </section>

      </div>
    </main>
  );
}

