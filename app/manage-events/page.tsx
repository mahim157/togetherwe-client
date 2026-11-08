
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Plus,
  CalendarDays,
  MapPin,
  Users,
  Pencil,
  Trash2,
  Eye,
  X,
  Loader2,
  Heart,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Save,
  CalendarCheck,
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

type Toast = {
  message: string;
  type: "success" | "error";
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "") + "/api/events";

const categories = [
  "Donation",
  "Social Work",
  "Cleanup",
  "Plantation",
  "Education",
  "Healthcare",
  "Other",
];

function getLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

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

  async function getAccessToken() {
    const tokenResult = await authClient.token();

    if (tokenResult.error || !tokenResult.data?.token) {
      router.push("/login");
      return null;
    }

    return tokenResult.data.token;
  }

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

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to fetch your events"
        );
      }

      setEvents(result?.events || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const tokenResult = await authClient.token();

        if (tokenResult.error || !tokenResult.data?.token) {
          router.push("/login");
          return;
        }

        const response = await fetch(`${API_URL}/my-events`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${tokenResult.data.token}`,
          },
        });

        const result = await response.json().catch(() => null);

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            result?.message || "Failed to fetch your events"
          );
        }

        if (isMounted) {
          setEvents(result?.events || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editingEvent) return;

    if (
      !editingEvent.title.trim() ||
      !editingEvent.description.trim() ||
      !editingEvent.category ||
      !editingEvent.image.trim() ||
      !editingEvent.location.trim() ||
      !editingEvent.date
    ) {
      showToast("Please complete all required fields.", "error");
      return;
    }

    if (editingEvent.title.trim().length < 3) {
      showToast("Event title must be at least 3 characters.", "error");
      return;
    }

    if (editingEvent.description.trim().length < 10) {
      showToast(
        "Description must be at least 10 characters.",
        "error"
      );
      return;
    }

    if (
      new Date(editingEvent.date + "T00:00:00") <
      new Date(getLocalDate() + "T00:00:00")
    ) {
      showToast("Please select today or a future date.", "error");
      return;
    }

    try {
      setSaving(true);

      const token = await getAccessToken();

      if (!token) return;

      const response = await fetch(
        `${API_URL}/${editingEvent._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editingEvent.title.trim(),
            description: editingEvent.description.trim(),
            category: editingEvent.category,
            image: editingEvent.image.trim(),
            location: editingEvent.location.trim(),
            date: editingEvent.date,
          }),
        }
      );

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to update event"
        );
      }

      setEvents((previousEvents) =>
        previousEvents.map((event) =>
          event._id === editingEvent._id
            ? { ...editingEvent }
            : event
        )
      );

      setEditingEvent(null);
      showToast("Event updated successfully!", "success");
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : "Failed to update event",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

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

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to delete event"
        );
      }

      setEvents((previousEvents) =>
        previousEvents.filter((event) => event._id !== id)
      );

      setConfirmDeleteEvent(null);
      showToast("Event deleted successfully!", "success");
    } catch (err) {
      setConfirmDeleteEvent(null);

      showToast(
        err instanceof Error
          ? err.message
          : "Failed to delete event",
        "error"
      );
    } finally {
      setDeletingId("");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9f2] px-4 dark:bg-[#0d1c13]">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#174c38] dark:text-[#d5ea83]" />

          <p className="mt-4 font-medium text-[#778478] dark:text-[#a5b5a6]">
            Loading your events...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f2] px-4 py-10 text-[#173f2c] dark:bg-[#0d1c13] dark:text-[#edf4e9] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Navbar */}
        <nav className="mb-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#174c38] text-white">
              <Heart size={21} fill="currentColor" />
            </div>

            <span className="text-xl font-extrabold tracking-tight">
              Together<span className="text-[#719b4e]">We.</span>
            </span>
          </Link>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-full border border-[#e5e9dc] bg-white px-4 py-2.5 text-sm font-semibold text-[#174c38] transition hover:bg-[#f0f4e8] dark:border-[#294333] dark:bg-[#14271c] dark:text-[#d5ea83] dark:hover:bg-[#1b3526]"
          >
            <ArrowLeft size={16} />
            Back to Events
          </Link>
        </nav>

        {/* Page Heading */}
        <section className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#eaf1dd] px-4 py-2 text-sm font-semibold text-[#174c38] dark:bg-[#1b3526] dark:text-[#d5ea83]">
            <CalendarCheck size={16} />
            Your Dashboard
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Manage Your Events
              </h1>

              <p className="mt-3 max-w-xl leading-7 text-[#778478] dark:text-[#a5b5a6]">
                Keep your community activities organized. Update your event
                details and manage the impact you are creating.
              </p>
            </div>

            <Link
              href="/create-event"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#174c38] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#174c38]/15 transition hover:-translate-y-0.5 hover:bg-[#246647] dark:bg-[#d5ea83] dark:text-[#173f2c] dark:hover:bg-[#c5df70]"
            >
              <Plus size={19} />
              Create New Event
            </Link>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <div className="flex items-center gap-2">
              <AlertCircle size={19} />
              <p className="text-sm font-medium">{error}</p>
            </div>

            <button
              onClick={fetchMyEvents}
              className="font-semibold underline underline-offset-4"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Statistics */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[#e5e9dc] bg-white p-6 shadow-sm dark:border-[#294333] dark:bg-[#14271c]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#778478] dark:text-[#a5b5a6]">
                  Total Events Created
                </p>

                <p className="mt-2 text-4xl font-extrabold text-[#174c38] dark:text-[#d5ea83]">
                  {events.length}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf1dd] text-[#174c38] dark:bg-[#1b3526] dark:text-[#d5ea83]">
                <CalendarDays size={27} />
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[#e5e9dc] bg-white p-6 shadow-sm dark:border-[#294333] dark:bg-[#14271c]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#778478] dark:text-[#a5b5a6]">
                  Total Volunteers
                </p>

                <p className="mt-2 text-4xl font-extrabold text-[#174c38] dark:text-[#d5ea83]">
                  {events.reduce(
                    (total, event) => total + (event.volunteers || 0),
                    0
                  )}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf1dd] text-[#174c38] dark:bg-[#1b3526] dark:text-[#d5ea83]">
                <Users size={27} />
              </div>
            </div>
          </div>
        </section>

        {/* Empty State */}
        {!error && events.length === 0 && (
          <section className="rounded-[2rem] border border-dashed border-[#cbd7c3] bg-white px-6 py-20 text-center dark:border-[#294333] dark:bg-[#14271c]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#eaf1dd] text-[#174c38] dark:bg-[#1b3526] dark:text-[#d5ea83]">
              <CalendarDays size={36} />
            </div>

            <h2 className="mt-6 text-2xl font-extrabold">
              No Events Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md leading-7 text-[#778478] dark:text-[#a5b5a6]">
              You haven't created any events yet. Start making a difference
              in your community by publishing your first event.
            </p>

            <Link
              href="/create-event"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#174c38] px-6 py-3.5 font-semibold text-white transition hover:bg-[#246647] dark:bg-[#d5ea83] dark:text-[#173f2c]"
            >
              <Plus size={18} />
              Create Your First Event
            </Link>
          </section>
        )}

        {/* Events Grid */}
        {events.length > 0 && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold">
                  Your Created Events
                </h2>

                <p className="mt-1 text-sm text-[#778478] dark:text-[#a5b5a6]">
                  Update or remove your published events.
                </p>
              </div>
            </div>

            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <article
                  key={event._id}
                  className="group overflow-hidden rounded-[1.7rem] border border-[#e5e9dc] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-[#294333] dark:bg-[#14271c]"
                >
                  <div className="relative h-56 overflow-hidden bg-[#eaf1dd] dark:bg-[#1b3526]">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />

                    <div className="absolute left-4 top-4">
                      <span className="rounded-full border border-white/30 bg-white/90 px-4 py-2 text-xs font-bold text-[#174c38] shadow-sm backdrop-blur">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="line-clamp-1 text-xl font-extrabold">
                      {event.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-[#778478] dark:text-[#a5b5a6]">
                      {event.description}
                    </p>

                    <div className="mt-5 space-y-3 border-t border-[#e5e9dc] pt-5 text-sm text-[#778478] dark:border-[#294333] dark:text-[#a5b5a6]">
                      <div className="flex items-center gap-2">
                        <MapPin
                          size={17}
                          className="shrink-0 text-[#719b4e]"
                        />
                        <span className="line-clamp-1">
                          {event.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={17}
                          className="shrink-0 text-[#719b4e]"
                        />
                        <span>{event.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users
                          size={17}
                          className="shrink-0 text-[#719b4e]"
                        />
                        <span>{event.volunteers || 0} Volunteers</span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingEvent({ ...event })}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#eaf1dd] px-4 py-3 text-sm font-bold text-[#174c38] transition hover:bg-[#dce9c9] dark:bg-[#1b3526] dark:text-[#d5ea83] dark:hover:bg-[#294333]"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmDeleteEvent(event)}
                        disabled={deletingId === event._id}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>

                    <Link
                      href={`/events/${event._id}`}
                      className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-[#719b4e] transition hover:text-[#174c38] dark:text-[#d5ea83] dark:hover:text-white"
                    >
                      <Eye size={16} />
                      View Event Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Edit Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0d1c13]/70 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-[2rem] border border-[#e5e9dc] bg-[#faf9f2] p-6 shadow-2xl dark:border-[#294333] dark:bg-[#14271c] sm:p-8">
            <div className="mb-7 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-[#719b4e]">
                  Event Management
                </p>

                <h2 className="mt-1 text-2xl font-extrabold">
                  Edit Event
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                disabled={saving}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf1dd] text-[#174c38] transition hover:bg-[#dce9c9] disabled:opacity-50 dark:bg-[#1b3526] dark:text-[#d5ea83]"
                aria-label="Close edit form"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Event Title
                </label>

                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={100}
                  value={editingEvent.title}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#e5e9dc] bg-white px-4 py-3.5 text-[#173f2c] outline-none transition placeholder:text-[#a5b5a6] focus:border-[#719b4e] focus:ring-2 focus:ring-[#719b4e]/20 dark:border-[#294333] dark:bg-[#0d1c13] dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Description
                </label>

                <textarea
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={4}
                  value={editingEvent.description}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      description: e.target.value,
                    })
                  }
                  className="w-full resize-y rounded-xl border border-[#e5e9dc] bg-white px-4 py-3.5 text-[#173f2c] outline-none transition focus:border-[#719b4e] focus:ring-2 focus:ring-[#719b4e]/20 dark:border-[#294333] dark:bg-[#0d1c13] dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
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
                  className="w-full rounded-xl border border-[#e5e9dc] bg-white px-4 py-3.5 text-[#173f2c] outline-none focus:border-[#719b4e] dark:border-[#294333] dark:bg-[#0d1c13] dark:text-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Thumbnail Image URL
                </label>

                <div className="relative">
                  <ImageIcon
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#719b4e]"
                  />

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
                    className="w-full rounded-xl border border-[#e5e9dc] bg-white py-3.5 pl-11 pr-4 text-[#173f2c] outline-none focus:border-[#719b4e] dark:border-[#294333] dark:bg-[#0d1c13] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Location
                </label>

                <input
                  type="text"
                  required
                  minLength={3}
                  value={editingEvent.location}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      location: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#e5e9dc] bg-white px-4 py-3.5 text-[#173f2c] outline-none focus:border-[#719b4e] dark:border-[#294333] dark:bg-[#0d1c13] dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Event Date
                </label>

                <input
                  type="date"
                  required
                  min={getLocalDate()}
                  value={editingEvent.date}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      date: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#e5e9dc] bg-white px-4 py-3.5 text-[#173f2c] outline-none focus:border-[#719b4e] dark:border-[#294333] dark:bg-[#0d1c13] dark:text-white"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#e5e9dc] pt-6 dark:border-[#294333] sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  disabled={saving}
                  className="rounded-full border border-[#d5ddce] px-6 py-3 font-bold text-[#174c38] transition hover:bg-[#eaf1dd] disabled:opacity-50 dark:border-[#294333] dark:text-[#d5ea83] dark:hover:bg-[#1b3526]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#174c38] px-7 py-3 font-bold text-white transition hover:bg-[#246647] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#d5ea83] dark:text-[#173f2c]"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteEvent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0d1c13]/75 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-[2rem] border border-[#e5e9dc] bg-[#faf9f2] p-7 shadow-2xl dark:border-[#294333] dark:bg-[#14271c]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300">
              <Trash2 size={29} />
            </div>

            <h2
              id="delete-modal-title"
              className="text-center text-2xl font-extrabold"
            >
              Delete This Event?
            </h2>

            <p className="mt-3 text-center text-sm leading-7 text-[#778478] dark:text-[#a5b5a6]">
              Are you sure you want to delete{" "}
              <span className="font-bold text-[#173f2c] dark:text-white">
                {confirmDeleteEvent.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setConfirmDeleteEvent(null)}
                disabled={deletingId !== ""}
                className="flex-1 rounded-full border border-[#d5ddce] px-5 py-3 font-bold text-[#174c38] transition hover:bg-[#eaf1dd] disabled:opacity-50 dark:border-[#294333] dark:text-[#d5ea83]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId !== ""}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed right-4 top-5 z-[100] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-top-3 duration-300">
          <div
            className={`flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-xl dark:bg-[#14271c] ${
              toast.type === "success"
                ? "border-[#cfe0bd] dark:border-[#416443]"
                : "border-red-200 dark:border-red-900"
            }`}
            role="status"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                toast.type === "success"
                  ? "bg-[#eaf1dd] text-[#174c38] dark:bg-[#1b3526] dark:text-[#d5ea83]"
                  : "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 size={22} />
              ) : (
                <AlertCircle size={22} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`font-bold ${
                  toast.type === "success"
                    ? "text-[#174c38] dark:text-[#d5ea83]"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {toast.type === "success" ? "Success" : "Error"}
              </p>

              <p className="mt-0.5 text-sm text-[#778478] dark:text-[#a5b5a6]">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="rounded-full p-1 text-[#778478] transition hover:bg-[#eaf1dd] hover:text-[#174c38] dark:hover:bg-[#1b3526] dark:hover:text-white"
              aria-label="Close notification"
            >
              <X size={19} />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mx-auto mt-16 max-w-7xl border-t border-[#e5e9dc] py-7 text-center text-sm text-[#778478] dark:border-[#294333] dark:text-[#a5b5a6]">
        Made with{" "}
        <Heart
          size={13}
          className="mx-1 inline text-[#719b4e]"
          fill="currentColor"
        />{" "}
        for a better community.
      </footer>
    </main>
  );
}
