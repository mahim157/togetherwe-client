
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Image as ImageIcon,
  FileText,
  Tag,
  Loader2,
  Heart,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const categories = [
  "Donation",
  "Social Work",
  "Cleanup",
  "Plantation",
  "Education",
  "Healthcare",
  "Other",
];

export default function CreateEventPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Donation");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const [today, setToday] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // Calculate today's date.
  useEffect(() => {
    const currentDate = new Date();

    const formattedDate = [
      currentDate.getFullYear(),
      String(currentDate.getMonth() + 1).padStart(2, "0"),
      String(currentDate.getDate()).padStart(2, "0"),
    ].join("-");

    setToday(formattedDate);
  }, []);

  // Redirect users who are not logged in.
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  // Submit event to Express backend.
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setSuccess(false);

    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (!date || date <= today) {
      setMessage("Please select a future event date.");
      return;
    }

    const eventData = {
      title,
      description,
      category,
      image,
      location,
      date,
    };

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/events",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create event."
        );
      }

      setSuccess(true);
      setMessage("Your event has been created successfully!");

      // Redirect to Upcoming Events.
      setTimeout(() => {
        router.push("/events");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Create event error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Show loading while checking the login session.
  if (isPending || !session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7faf8]">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-green-600" size={36} />
          <p className="mt-4 text-gray-600">
            Checking your account...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7faf8] px-5 py-12">
      <div className="mx-auto max-w-3xl">

        {/* Back Button */}
        <Link
          href="/events"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-green-700"
        >
          <ArrowLeft size={18} />
          Back to Upcoming Events
        </Link>

        {/* Page Heading */}
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            <Heart size={16} />
            Make a Difference Together
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Create a New Event
          </h1>

          <p className="mt-3 leading-7 text-gray-500">
            Organize a community event and bring people together
            to make a positive difference.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-9">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Event Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
              >
                <FileText size={17} className="text-green-600" />
                Event Title
              </label>

              <input
                id="title"
                type="text"
                required
                minLength={3}
                maxLength={100}
                placeholder="Enter your event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Event Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
              >
                <FileText size={17} className="text-green-600" />
                Event Description
              </label>

              <textarea
                id="description"
                required
                minLength={10}
                rows={5}
                placeholder="Describe your event and explain how people can participate..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm leading-7 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
              >
                <Tag size={17} className="text-green-600" />
                Event Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
              >
                <ImageIcon size={17} className="text-green-600" />
                Event Thumbnail Image URL
              </label>

              <input
                id="image"
                type="url"
                required
                placeholder="https://example.com/event-image.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
              />

              <p className="mt-2 text-xs text-gray-400">
                Enter a publicly accessible image URL.
              </p>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
              >
                <MapPin size={17} className="text-green-600" />
                Event Location
              </label>

              <input
                id="location"
                type="text"
                required
                placeholder="Example: Savar, Dhaka"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Event Date */}
            <div>
              <label
                htmlFor="date"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
              >
                <CalendarDays size={17} className="text-green-600" />
                Event Date
              </label>

              <input
                id="date"
                type="date"
                required
                min={today || undefined}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
              />

              <p className="mt-2 text-xs text-gray-400">
                Please select a future date.
              </p>
            </div>

            {/* Creator Information */}
            <div className="rounded-xl border border-green-100 bg-green-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
                Event Organizer
              </p>

              <p className="mt-2 font-semibold text-gray-800">
                {session.user.name}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {session.user.email}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Your account information will be associated with this event.
              </p>
            </div>

            {/* Success / Error Message */}
            {message && (
              <div
                className={`flex items-start gap-3 rounded-xl p-4 text-sm ${
                  success
                    ? "border border-green-200 bg-green-50 text-green-700"
                    : "border border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {success ? (
                  <CheckCircle size={20} className="shrink-0" />
                ) : (
                  <AlertCircle size={20} className="shrink-0" />
                )}

                <p>{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !today}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Creating Event...
                </>
              ) : (
                <>
                  <Heart size={19} />
                  Create Event
                </>
              )}
            </button>

          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Together, we can make our community better.
        </p>
      </div>
    </main>
  );
}
