
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  CalendarDays,
  MapPin,
  Users,
  Loader2,
  Heart,
  ArrowRight,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

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

export default function JoinedEventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJoinedEvents() {
      try {
        setLoading(true);
        setError("");

        // Generate JWT token
        const tokenResult = await authClient.token();

        if (tokenResult.error || !tokenResult.data?.token) {
          router.push("/login");
          return;
        }

        const token = tokenResult.data.token;

        // Fetch joined events using JWT
        const response = await fetch(
          "http://localhost:5000/api/events/joined",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${token}`,
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
            result.message || "Failed to load joined events"
          );
        }

        setEvents(result.events || []);
      } catch (err) {
        console.error("Joined events error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchJoinedEvents();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="font-semibold text-green-600">
            My Activities
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            My Joined Events
          </h1>

          <p className="mt-3 text-gray-600">
            Keep track of the community events you have joined.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {!error && events.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <Heart size={30} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              No Joined Events Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-600">
              You haven't joined any community events yet.
              Explore upcoming events and start making a difference!
            </p>

            <Link
              href="/events"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Explore Events
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {events.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="font-medium text-gray-700">
                {events.length} Joined Events
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-52">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white">
                      {event.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-900">
                      {event.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                      {event.description}
                    </p>

                    <div className="mt-5 space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={17}
                          className="text-green-600"
                        />

                        {new Date(
                          `${event.date}T00:00:00`
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin
                          size={17}
                          className="text-green-600"
                        />

                        {event.location}
                      </div>

                      <div className="flex items-center gap-2">
                        <Users
                          size={17}
                          className="text-green-600"
                        />

                        {event.volunteers} Volunteers
                      </div>
                    </div>

                    <Link
                      href={`/events/${event._id}`}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
                    >
                      View Details
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
