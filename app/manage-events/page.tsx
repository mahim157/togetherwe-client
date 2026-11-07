
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

type Toast = {
  message: string;
  type: "success" | "error";
};

const API_URL = "http://localhost:5000/api/events";

const categories = [
  "Donation",
  "Social Work",
  "Cleanup",
  "Plantation",
  "Education",
  "Healthcare",
  "Other",
];

export default function ManageEventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [confirmDeleteEvent, setConfirmDeleteEvent] =
    useState<Event | null>(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const [toast, setToast] = useState<Toast | null>(null);

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });

    window.setTimeout(() => {
      setToast(null);
    }, 3500);
  }

  // Generate JWT token
  async function getAccessToken() {
    const tokenResult = await authClient.token();

    if (tokenResult.error || !tokenResult.data?.token) {
      router.push("/login");
      return null;
    }

    return tokenResult.data.token;
  }

  // Fetch My Events
  async function fetchMyEvents() {
    try {
      setLoading(true);
      setError("");

      const token = await getAccessToken();

      if (!token) return;

      const response = await fetch(`${API_URL}/my-events`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch your events");
      }

      setEvents(result.events || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMyEvents();
  }, []);

  // Update Event
  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editingEvent) return;

    try {
      setSaving(true);

      const token = await getAccessToken();

      if (!token) return;

      const response = await fetch(`${API_URL}/${editingEvent._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editingEvent.title,
          description: editingEvent.description,
          category: editingEvent.category,
          image: editingEvent.image,
          location: editingEvent.location,
          date: editingEvent.date,
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to update event");
      }

      setEvents((previousEvents) =>
        previousEvents.map((event) =>
          event._id === editingEvent._id ? editingEvent : event
        )
      );

      setEditingEvent(null);
      showToast("Event updated successfully!", "success");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to update event",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  // Delete Event
  async function handleDelete() {
    if (!confirmDeleteEvent) return;

    const id = confirmDeleteEvent._id;

    try {
      setDeletingId(id);

      const token = await getAccessToken();

      if (!token) return;

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete event");
      }

      setEvents((previousEvents) =>
        previousEvents.filter((event) => event._id !== id)
      );

      setConfirmDeleteEvent(null);
      showToast("Event deleted successfully!", "success");
    } catch (err) {
      setConfirmDeleteEvent(null);

      showToast(
        err instanceof Error ? err.message : "Failed to delete event",
        "error"
      );
    } finally {
      setDeletingId("");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg font-medium text-slate-600">
          Loading your events...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-600">
              Your Dashboard
            </p>

            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Manage Events
            </h1>

            <p className="mt-3 text-slate-600">
              View, update and manage the events you have created.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              ← Back to Events
            </Link>

            <Link
              href="/events/create"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              + Create New Event
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}

            <button
              onClick={fetchMyEvents}
              className="ml-3 font-semibold underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Event Count */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Events Created
          </p>

          <p className="mt-1 text-3xl font-bold text-emerald-600">
            {events.length}
          </p>
        </div>

        {/* Empty State */}
        {!error && events.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mb-4 text-5xl">📅</div>

            <h2 className="text-2xl font-bold text-slate-900">
              You haven't created any events yet.
            </h2>

            <p className="mx-auto mt-3 max-w-md text-slate-600">
              Start making a difference in your community by creating your
              first social development event.
            </p>

            <Link
              href="/events/create"
              className="mt-6 inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Create Your First Event
            </Link>
          </div>
        )}

        {/* Events Grid */}
        {events.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-52 overflow-hidden bg-slate-100">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {event.category}
                  </span>

                  <h2 className="mt-3 text-xl font-bold text-slate-900">
                    {event.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                    {event.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-500">
                    <p>📍 {event.location}</p>
                    <p>📅 {event.date}</p>
                    <p>👥 {event.volunteers || 0} Volunteers</p>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setEditingEvent({ ...event })}
                      className="flex-1 rounded-lg bg-blue-50 px-4 py-2.5 font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setConfirmDeleteEvent(event)}
                      disabled={deletingId === event._id}
                      className="flex-1 rounded-lg bg-red-50 px-4 py-2.5 font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>

                  <Link
                    href={`/events/${event._id}`}
                    className="mt-3 block text-center text-sm font-semibold text-emerald-700 hover:underline"
                  >
                    View Event Details →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-900">
                Edit Event
              </h2>

              <button
                onClick={() => setEditingEvent(null)}
                disabled={saving}
                className="text-2xl text-slate-400 hover:text-slate-700 disabled:opacity-50"
                aria-label="Close edit form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Event Title
                </label>

                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  required
                  rows={4}
                  value={editingEvent.description}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Event Category
                </label>

                <select
                  required
                  value={editingEvent.category}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      category: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Thumbnail Image URL
                </label>

                <input
                  type="url"
                  required
                  value={editingEvent.image}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      image: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location
                </label>

                <input
                  type="text"
                  required
                  value={editingEvent.location}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      location: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Event Date
                </label>

                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={editingEvent.date}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      date: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  disabled={saving}
                  className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteEvent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-8 w-8 text-red-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.3 3.86 1.9 18.4A2 2 0 0 0 3.63 21h16.74a2 2 0 0 0 1.73-2.6L13.7 3.86a2 2 0 0 0-3.46 0Z"
                />
              </svg>
            </div>

            <h2
              id="delete-modal-title"
              className="text-center text-2xl font-bold text-slate-900"
            >
              Delete this event?
            </h2>

            <p className="mt-3 text-center leading-6 text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                {confirmDeleteEvent.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setConfirmDeleteEvent(null)}
                disabled={deletingId !== ""}
                className="flex-1 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId !== ""}
                className="flex-1 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed right-4 top-5 z-[100] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-top-3 duration-300">
          <div
            className={`flex items-center gap-3 rounded-xl border p-4 shadow-xl ${
              toast.type === "success"
                ? "border-emerald-200 bg-white"
                : "border-red-200 bg-white"
            }`}
            role="status"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                toast.type === "success"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {toast.type === "success" ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m5 12 4 4L19 6"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M5 19h14"
                  />
                </svg>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`font-semibold ${
                  toast.type === "success"
                    ? "text-emerald-700"
                    : "text-red-700"
                }`}
              >
                {toast.type === "success" ? "Success" : "Error"}
              </p>

              <p className="mt-0.5 text-sm text-slate-600">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-xl text-slate-400 transition hover:text-slate-700"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
