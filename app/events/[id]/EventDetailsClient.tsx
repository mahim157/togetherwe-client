
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Share2,
  Heart,
  UserRound,
  Loader2,
} from "lucide-react";

type Event = {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  date: string;
  volunteers: number;
  creatorName?: string;
  creatorEmail?: string;
};

export default function EventDetailsClient({ id }: { id: string }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        setError("");

        if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
          throw new Error("Invalid event ID");
        }

        console.log("Fetching Event ID:", id);

        const response = await fetch(
          `http://localhost:5000/api/events/${id}`,
          { cache: "no-store" }
        );

        const result = await response.json();

        console.log("Event API Response:", result);

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load event");
        }

        setEvent(result.event);
      } catch (err) {
        console.error("Event details error:", err);
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  async function handleShare() {
    if (!event) return;

    const shareData = {
      title: event.title,
      text: event.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        window.alert("Event link copied successfully!");
      }
    } catch (err) {
      console.log("Share cancelled or failed:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
        <p className="mt-4 text-gray-600">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Event Not Found
        </h1>

        <p className="mt-3 text-gray-600">
          {error || "The event does not exist."}
        </p>

        <Link
          href="/events"
          className="mt-6 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Back to Upcoming Events
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(
    `${event.date}T00:00:00`
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/events"
          className="mb-6 inline-flex items-center gap-2 font-medium text-gray-600 hover:text-green-600"
        >
          <ArrowLeft size={18} />
          Back to Upcoming Events
        </Link>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="relative h-64 w-full sm:h-96">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
            />

            <div className="absolute left-5 top-5">
              <span className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white">
                {event.category}
              </span>
            </div>
          </div>

          <div className="grid gap-10 p-5 sm:p-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                {event.title}
              </h1>

              <div className="mt-6 flex flex-wrap gap-5 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-green-600" />
                  {formattedDate}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-green-600" />
                  {event.location}
                </div>

                <div className="flex items-center gap-2">
                  <Users size={18} className="text-green-600" />
                  {event.volunteers} Volunteers
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-xl font-bold text-gray-900">
                  About This Event
                </h2>

                <p className="mt-4 whitespace-pre-line leading-8 text-gray-600">
                  {event.description}
                </p>
              </div>

              <div className="mt-10 rounded-xl bg-green-50 p-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Volunteer Guidelines
                </h2>

                <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-700">
                  <li>• Arrive at the event location on time.</li>
                  <li>• Follow the event organizer's instructions.</li>
                  <li>• Cooperate with other volunteers.</li>
                  <li>• Help make a positive impact in the community.</li>
                </ul>
              </div>
            </div>

            <aside className="h-fit rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Event Organizer
              </h2>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <UserRound size={24} />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    {event.creatorName || "Community Member"}
                  </p>
                  <p className="text-sm text-gray-500">Event Organizer</p>
                </div>
              </div>

              <div className="my-6 border-t border-gray-200" />

              <h3 className="font-bold text-gray-900">
                Event Information
              </h3>

              <div className="mt-4 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <CalendarDays size={19} className="shrink-0 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Date</p>
                    <p className="mt-1 text-gray-600">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={19} className="shrink-0 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="mt-1 text-gray-600">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users size={19} className="shrink-0 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Volunteers</p>
                    <p className="mt-1 text-gray-600">
                      {event.volunteers} people joined
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/login"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
              >
                <Heart size={18} />
                Join This Event
              </Link>

              <button
                onClick={handleShare}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                <Share2 size={18} />
                Share Event
              </button>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
