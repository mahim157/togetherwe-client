
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  Image as ImageIcon,
  FileText,
  Tag,
  Loader2,
  Heart,
  CheckCircle,
  AlertCircle,
  Leaf,
  Sparkles,
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

function getLocalDate() {
  const currentDate = new Date();

  return [
    currentDate.getFullYear(),
    String(currentDate.getMonth() + 1).padStart(2, "0"),
    String(currentDate.getDate()).padStart(2, "0"),
  ].join("-");
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return [
    tomorrow.getFullYear(),
    String(tomorrow.getMonth() + 1).padStart(2, "0"),
    String(tomorrow.getDate()).padStart(2, "0"),
  ].join("-");
}

function isValidImageUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
}

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

  useEffect(() => {
    setToday(getLocalDate());
  }, []);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  function validateForm() {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedImage = image.trim();
    const trimmedLocation = location.trim();

    if (!trimmedTitle) {
      return "Please enter an event title.";
    }

    if (trimmedTitle.length < 3) {
      return "Event title must contain at least 3 characters.";
    }

    if (trimmedTitle.length > 100) {
      return "Event title cannot exceed 100 characters.";
    }

    if (!trimmedDescription) {
      return "Please enter an event description.";
    }

    if (trimmedDescription.length < 10) {
      return "Description must contain at least 10 characters.";
    }

    if (trimmedDescription.length > 2000) {
      return "Description cannot exceed 2000 characters.";
    }

    if (!categories.includes(category)) {
      return "Please select a valid event category.";
    }

    if (!trimmedImage) {
      return "Please enter an event image URL.";
    }

    if (!isValidImageUrl(trimmedImage)) {
      return "Please enter a valid image URL starting with http:// or https://.";
    }

    if (!trimmedLocation) {
      return "Please enter the event location.";
    }

    if (trimmedLocation.length < 3) {
      return "Location must contain at least 3 characters.";
    }

    if (!date) {
      return "Please select an event date.";
    }

    if (date <= today) {
      return "Event date must be in the future. Past dates and today's date are not allowed.";
    }

    return "";
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setSuccess(false);

    if (!session?.user) {
      router.push("/login");
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setMessage(validationError);
      return;
    }

    const eventData = {
      title: title.trim(),
      description: description.trim(),
      category,
      image: image.trim(),
      location: location.trim(),
      date,
    };

    try {
      setLoading(true);

      // Generate JWT token
      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        throw new Error(
          tokenResult.error?.message || "Unable to generate JWT token."
        );
      }

      const token = tokenResult.data.token;

      // Send event data to backend
      const response = await fetch(
        "http://localhost:5000/api/events",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(eventData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create event.");
      }

      setSuccess(true);
      setMessage("Your event has been created successfully!");

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

  if (isPending || !session?.user || !today) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9f2]">
        <div className="text-center">
          <Loader2
            className="mx-auto animate-spin text-[#174c38]"
            size={36}
          />
          <p className="mt-4 text-sm font-medium text-[#778478]">
            Checking your account...
          </p>
        </div>
      </main>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-[#e5e9dc] bg-[#fafbf7] px-4 py-3.5 text-sm text-[#173f2c] outline-none transition placeholder:text-[#a0aa9e] focus:border-[#719b4e] focus:bg-white focus:ring-4 focus:ring-[#d5ea83]/25 disabled:opacity-60";

  const labelClass =
    "mb-2.5 flex items-center gap-2 text-sm font-semibold text-[#294b37]";

  const iconClass = "text-[#719b4e]";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#faf9f2] px-4 py-8 sm:px-6 lg:py-12">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#d5ea83]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-[450px] w-[450px] rounded-full bg-[#719b4e]/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl">

        {/* Top Navigation */}
        <div className="mb-9 flex flex-wrap items-center justify-between gap-4">

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#174c38] text-[#d5ea83]">
              <Heart size={23} fill="currentColor" />
            </div>

            <span className="text-xl font-bold tracking-tight text-[#174c38]">
              TogetherWe<span className="text-[#719b4e]">.</span>
            </span>
          </Link>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-full border border-[#e5e9dc] bg-white px-4 py-2.5 text-sm font-semibold text-[#45634d] transition hover:border-[#719b4e] hover:text-[#174c38]"
          >
            <ArrowLeft size={16} />
            Back to Events
          </Link>
        </div>

        {/* Page Heading */}
        <div className="mb-9">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#dce8c8] bg-[#eef3df] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#456c36]">
            <Leaf size={15} />
            Make a Difference Together
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#173f2c] sm:text-4xl md:text-5xl">
                Create a New Event
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#778478] sm:text-base">
                Turn your ideas into action. Organize a community event
                and bring people together to create positive change.
              </p>
            </div>

            <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#d5ea83]/50 text-[#174c38] sm:flex">
              <Sparkles size={32} />
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-[2rem] border border-[#e5e9dc] bg-white shadow-[0_20px_60px_rgba(23,76,56,0.07)]">

          {/* Card Header */}
          <div className="border-b border-[#e5e9dc] bg-[#f8faf3] px-6 py-6 sm:px-9">
            <h2 className="text-lg font-bold text-[#173f2c]">
              Event Information
            </h2>

            <p className="mt-1 text-sm text-[#849083]">
              Fill in the details below to publish your community event.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7 p-6 sm:p-9">

            {/* Event Title */}
            <div>
              <label htmlFor="title" className={labelClass}>
                <FileText size={17} className={iconClass} />
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
                disabled={loading}
                className={inputClass}
              />

              <p className="mt-2 text-xs text-[#98a397]">
                {title.trim().length}/100 characters. Minimum 3 characters.
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={labelClass}>
                <FileText size={17} className={iconClass} />
                Event Description
              </label>

              <textarea
                id="description"
                required
                minLength={10}
                maxLength={2000}
                rows={5}
                placeholder="Describe your event and explain how people can participate..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                className={`${inputClass} resize-y leading-7`}
              />

              <p className="mt-2 text-xs text-[#98a397]">
                {description.trim().length}/2000 characters. Minimum 10 characters.
              </p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className={labelClass}>
                <Tag size={17} className={iconClass} />
                Event Category
              </label>

              <select
                id="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
                className={inputClass}
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
              <label htmlFor="image" className={labelClass}>
                <ImageIcon size={17} className={iconClass} />
                Event Thumbnail Image URL
              </label>

              <input
                id="image"
                type="url"
                required
                placeholder="https://example.com/event-image.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                disabled={loading}
                className={inputClass}
              />

              <p className="mt-2 text-xs text-[#98a397]">
                Enter a publicly accessible image URL starting with http:// or https://.
              </p>

              {/* Image Preview */}
              {isValidImageUrl(image.trim()) && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-[#e5e9dc] bg-[#fafbf7]">
                  <p className="px-4 py-2.5 text-xs font-semibold text-[#456c36]">
                    Image Preview
                  </p>

                  <img
                    src={image.trim()}
                    alt="Event thumbnail preview"
                    className="h-48 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className={labelClass}>
                <MapPin size={17} className={iconClass} />
                Event Location
              </label>

              <input
                id="location"
                type="text"
                required
                minLength={3}
                maxLength={150}
                placeholder="Example: Savar, Dhaka"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={loading}
                className={inputClass}
              />
            </div>

            {/* Event Date */}
            <div>
              <label htmlFor="date" className={labelClass}>
                <CalendarDays size={17} className={iconClass} />
                Event Date
              </label>

              <input
                id="date"
                type="date"
                required
                min={getTomorrowDate()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={loading}
                className={inputClass}
              />

              <p className="mt-2 text-xs text-[#98a397]">
                Only future dates are allowed. Today's and past dates cannot be selected.
              </p>
            </div>

            {/* Organizer Information */}
            <div className="rounded-2xl border border-[#dce8c8] bg-[#f4f7eb] p-5">

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d5ea83] text-[#174c38]">
                  <Heart size={18} />
                </div>

                <p className="text-sm font-bold text-[#174c38]">
                  Event Organizer
                </p>
              </div>

              <p className="mt-4 font-semibold text-[#294b37]">
                {session.user.name}
              </p>

              <p className="mt-1 text-sm text-[#778478]">
                {session.user.email}
              </p>

              <p className="mt-3 text-xs leading-5 text-[#849083]">
                Your account information will be associated with this event.
              </p>
            </div>

            {/* Success / Error Message */}
            {message && (
              <div
                role="alert"
                aria-live="polite"
                className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
                  success
                    ? "border-[#d5e8c4] bg-[#f0f7e9] text-[#456c36]"
                    : "border-red-100 bg-red-50 text-red-600"
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
            <div className="border-t border-[#e5e9dc] pt-6">

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#174c38] px-6 py-4 font-semibold text-white shadow-lg shadow-[#174c38]/15 transition hover:bg-[#246647] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Creating Event...
                  </>
                ) : (
                  <>
                    <Heart size={19} />
                    Publish Community Event
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs leading-6 text-[#98a397]">
                By creating this event, you agree to provide accurate
                information for your community.
              </p>
            </div>

          </form>
        </div>

        {/* Bottom Text */}
        <div className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-[#849083]">
          <Leaf size={16} className="text-[#719b4e]" />
          Together, we can make our community better.
        </div>

      </div>
    </main>
  );
}
