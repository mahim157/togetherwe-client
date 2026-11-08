
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
  Share2,
  Heart,
  UserRound,
  Loader2,
  Leaf,
  Sparkles,
  Clock3,
  HandHeart,
  CheckCircle2,
  Moon,
  Sun,
  Bookmark,
  MessageCircle,
  Send,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useTheme } from "../../components/ThemeProvider";

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

type Comment = {
  _id: string;
  eventId: string;
  userId: string;
  userEmail: string;
  userName: string;
  userImage: string | null;
  text: string;
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function EventDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // Join states
  const [joining, setJoining] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");
  const [joinError, setJoinError] = useState("");
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  // Bookmark states
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkChecking, setBookmarkChecking] = useState(true);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarkMessage, setBookmarkMessage] = useState("");
  const [bookmarkError, setBookmarkError] = useState("");

  // Comment states
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [commentMessage, setCommentMessage] = useState("");

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [updatingComment, setUpdatingComment] = useState(false);

  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [error, setError] = useState("");

  // =====================================
  // Fetch Event Details
  // =====================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEvent() {
      try {
        setLoading(true);
        setError("");

        if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
          throw new Error("Invalid event ID");
        }

        const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load event.");
        }

        setEvent(result.event);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        console.error("Event details error:", err);

        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchEvent();

    return () => controller.abort();
  }, [id]);

  // =====================================
  // Fetch Event Comments
  // =====================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchComments() {
      try {
        setCommentsLoading(true);
        setCommentError("");

        const response = await fetch(
          `${API_BASE_URL}/api/events/${id}/comments`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load comments.");
        }

        if (!controller.signal.aborted) {
          setComments(result.comments || []);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        console.error("Fetch comments error:", err);

        if (!controller.signal.aborted) {
          setCommentError(
            err instanceof Error ? err.message : "Could not load comments."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setCommentsLoading(false);
        }
      }
    }

    fetchComments();

    return () => controller.abort();
  }, [id]);

  // =====================================
  // Check Existing Bookmark
  // =====================================

  useEffect(() => {
    let cancelled = false;

    async function checkBookmark() {
      if (isPending) return;

      if (!user) {
        setIsBookmarked(false);
        setBookmarkChecking(false);
        return;
      }

      try {
        setBookmarkChecking(true);
        setBookmarkError("");

        const tokenResult = await authClient.token();

        if (tokenResult.error || !tokenResult.data?.token) {
          throw new Error("Unable to verify your login. Please login again.");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/events/bookmarked`,
          {
            method: "GET",
            credentials: "include",
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
            result.message || "Failed to check bookmark status."
          );
        }

        const saved = result.events?.some(
          (savedEvent: Event) => savedEvent._id === id
        );

        if (!cancelled) {
          setIsBookmarked(Boolean(saved));
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Bookmark check error:", err);

          setBookmarkError(
            err instanceof Error
              ? err.message
              : "Could not check bookmark status."
          );
        }
      } finally {
        if (!cancelled) {
          setBookmarkChecking(false);
        }
      }
    }

    checkBookmark();

    return () => {
      cancelled = true;
    };
  }, [id, user, isPending, router]);

  // =====================================
  // Join Event
  // =====================================

  async function handleJoin() {
    if (!event || joining || alreadyJoined) return;

    if (isPending) return;

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setJoining(true);
      setJoinMessage("");
      setJoinError("");

      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        throw new Error(
          "Unable to generate authentication token. Please logout and login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/events/${id}/join`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${tokenResult.data.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (response.status === 409) {
        setAlreadyJoined(true);
        setJoinMessage("You have already joined this event.");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to join this event.");
      }

      setEvent((previous) =>
        previous
          ? {
              ...previous,
              volunteers: previous.volunteers + 1,
            }
          : null
      );

      setAlreadyJoined(true);
      setJoinMessage("You have successfully joined this event!");
    } catch (err) {
      console.error("Join event error:", err);

      setJoinError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setJoining(false);
    }
  }

  // =====================================
  // Bookmark / Remove Bookmark
  // =====================================

  async function handleBookmark() {
    if (!event || bookmarkLoading || bookmarkChecking) return;

    if (isPending) return;

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setBookmarkLoading(true);
      setBookmarkMessage("");
      setBookmarkError("");

      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        throw new Error(
          "Unable to generate authentication token. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/events/${id}/bookmark`,
        {
          method: isBookmarked ? "DELETE" : "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${tokenResult.data.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (response.status === 409 && !isBookmarked) {
        setIsBookmarked(true);
        setBookmarkMessage("This event is already saved.");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update bookmark.");
      }

      const newBookmarkStatus = !isBookmarked;

      setIsBookmarked(newBookmarkStatus);

      setBookmarkMessage(
        newBookmarkStatus
          ? "Event saved successfully!"
          : "Event removed from your saved events."
      );
    } catch (err) {
      console.error("Bookmark event error:", err);

      setBookmarkError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setBookmarkLoading(false);
    }
  }

  // =====================================
  // Add Comment
  // =====================================

  async function handleAddComment() {
    if (!commentText.trim() || commentLoading) return;

    if (isPending) return;

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setCommentLoading(true);
      setCommentError("");
      setCommentMessage("");

      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        throw new Error(
          "Unable to generate authentication token. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/events/${id}/comments`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${tokenResult.data.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: commentText.trim(),
          }),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to add comment.");
      }

      setComments((previous) => [result.comment, ...previous]);
      setCommentText("");
      setCommentMessage("Your comment has been posted successfully!");
    } catch (err) {
      console.error("Add comment error:", err);

      setCommentError(
        err instanceof Error ? err.message : "Failed to post comment."
      );
    } finally {
      setCommentLoading(false);
    }
  }

  // =====================================
  // Edit Comment
  // =====================================

  function startEditingComment(comment: Comment) {
    setEditingCommentId(comment._id);
    setEditingText(comment.text);
    setCommentError("");
    setCommentMessage("");
    setConfirmDeleteId(null);
  }

  function cancelEditingComment() {
    setEditingCommentId(null);
    setEditingText("");
  }

  async function handleUpdateComment(commentId: string) {
    if (!editingText.trim() || updatingComment) return;

    try {
      setUpdatingComment(true);
      setCommentError("");
      setCommentMessage("");

      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        throw new Error(
          "Unable to generate authentication token. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/events/${id}/comments/${commentId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${tokenResult.data.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: editingText.trim(),
          }),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update comment.");
      }

      setComments((previous) =>
        previous.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                text: editingText.trim(),
                updatedAt: new Date().toISOString(),
              }
            : comment
        )
      );

      setEditingCommentId(null);
      setEditingText("");
      setCommentMessage("Comment updated successfully!");
    } catch (err) {
      console.error("Update comment error:", err);

      setCommentError(
        err instanceof Error ? err.message : "Failed to update comment."
      );
    } finally {
      setUpdatingComment(false);
    }
  }

  // =====================================
  // Delete Comment
  // =====================================

  async function handleDeleteComment(commentId: string) {
    if (deletingCommentId) return;

    try {
      setDeletingCommentId(commentId);
      setCommentError("");
      setCommentMessage("");

      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        throw new Error(
          "Unable to generate authentication token. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/events/${id}/comments/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
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
        throw new Error(result.message || "Failed to delete comment.");
      }

      setComments((previous) =>
        previous.filter((comment) => comment._id !== commentId)
      );

      setConfirmDeleteId(null);
      setCommentMessage("Comment deleted successfully!");
    } catch (err) {
      console.error("Delete comment error:", err);

      setCommentError(
        err instanceof Error ? err.message : "Failed to delete comment."
      );
    } finally {
      setDeletingCommentId(null);
    }
  }

  // =====================================
  // Share Event
  // =====================================

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
        setJoinMessage("Event link copied successfully!");
      }
    } catch (err) {
      console.log("Share cancelled or failed:", err);
    }
  }

  // =====================================
  // Theme Styles
  // =====================================

  const pageText = isDark
    ? "text-[#f3f3e9]"
    : "text-[#173f2c]";

  const mutedText = isDark
    ? "text-[#a5b5a6]"
    : "text-[#778478]";

  const surface = isDark
    ? "border-[#294333] bg-[#14271c]"
    : "border-[#e5e9dc] bg-white";

  const pageBackground = isDark
    ? "bg-[#0d1c13]"
    : "bg-[#faf9f2]";

  const formattedDate = event
    ? new Date(`${event.date}T00:00:00`).toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )
    : "";

  // =====================================
  // Loading State
  // =====================================

  if (loading) {
    return (
      <main
        className={`flex min-h-screen flex-col items-center justify-center ${pageBackground}`}
      >
        <Loader2 className="h-10 w-10 animate-spin text-[#719b4e]" />
        <p className={`mt-4 font-semibold ${mutedText}`}>
          Loading event details...
        </p>
      </main>
    );
  }

  // =====================================
  // Event Not Found
  // =====================================

  if (error || !event) {
    return (
      <main
        className={`flex min-h-screen flex-col items-center justify-center px-5 text-center ${pageBackground}`}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#eaf1df] text-[#174c38]">
          <CalendarDays size={35} />
        </div>

        <h1 className={`mt-6 text-3xl font-black ${pageText}`}>
          Event Not Found
        </h1>

        <p className={`mt-3 max-w-md ${mutedText}`}>
          {error || "The event does not exist."}
        </p>

        <Link
          href="/events"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#174c38] px-7 py-3.5 font-bold text-white transition hover:bg-[#246647]"
        >
          <ArrowLeft size={18} />
          Back to Events
        </Link>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${pageBackground}`}
    >
      {/* NAVBAR */}
      <nav
        className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
          isDark
            ? "border-[#263d2c] bg-[#0d1c13]/95"
            : "border-[#e9e9dc] bg-[#faf9f2]/95"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#174c38] text-[#d5ea83]">
              <Heart size={23} fill="currentColor" />
            </div>

            <div>
              <span className={`text-2xl font-black tracking-tight ${pageText}`}>
                Together<span className="text-[#739c4c]">We.</span>
              </span>

              <p className={`-mt-1 text-[9px] font-bold uppercase tracking-[0.2em] ${mutedText}`}>
                People. Purpose. Progress.
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className={`hidden text-sm font-bold transition hover:text-[#719b4e] sm:block ${mutedText}`}
            >
              Explore Events
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                isDark
                  ? "border-[#385541] text-[#d5ea83] hover:bg-[#203b2b]"
                  : "border-[#dce4d5] text-[#174c38] hover:bg-[#edf2e7]"
              }`}
            >
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {isPending ? (
              <div className="h-10 w-20 animate-pulse rounded-full bg-[#dfe8d9]" />
            ) : user ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-[#dce4d5] py-1 pl-1 pr-3 transition hover:bg-[#edf2e7]"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dce9ca] font-bold text-[#174c38]">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <span className="hidden max-w-28 truncate text-sm font-bold text-[#174c38] sm:block">
                  {user.name || "My Profile"}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-[#174c38] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#246647]"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        {/* BACK LINK */}
        <Link
          href="/events"
          className={`mb-8 inline-flex items-center gap-2 text-sm font-bold transition hover:text-[#719b4e] ${mutedText}`}
        >
          <ArrowLeft size={18} />
          Back to Upcoming Events
        </Link>

        {/* EVENT HERO */}
        <section className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.8rem]">
          <div className="relative h-[330px] sm:h-[480px] lg:h-[540px]">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#102b1b]/95 via-[#102b1b]/30 to-black/5" />

            <div className="absolute left-5 top-5 sm:left-9 sm:top-9">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wider text-white backdrop-blur-md">
                <Leaf size={15} />
                {event.category}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 lg:p-14">
              <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#d5ea83]">
                <Sparkles size={16} />
                Together for a better tomorrow
              </div>

              <h1 className="max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                {event.title}
              </h1>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/85">
                <span className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-[#d5ea83]" />
                  {formattedDate}
                </span>

                <span className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#d5ea83]" />
                  {event.location}
                </span>

                <span className="flex items-center gap-2">
                  <Users size={18} className="text-[#d5ea83]" />
                  {event.volunteers ?? 0} Volunteers
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            {/* ABOUT */}
            <section className={`rounded-[2rem] border p-6 sm:p-9 ${surface}`}>
              <p className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#719b4e]">
                <HandHeart size={17} />
                About this event
              </p>

              <h2 className={`text-2xl font-black sm:text-3xl ${pageText}`}>
                Be Part of Something Meaningful
              </h2>

              <p className={`mt-5 whitespace-pre-line text-sm leading-8 sm:text-base ${mutedText}`}>
                {event.description}
              </p>
            </section>

            {/* EVENT INFORMATION */}
            <section className={`rounded-[2rem] border p-6 sm:p-9 ${surface}`}>
              <p className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-[#719b4e]">
                Event Information
              </p>

              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  {
                    label: "Event Date",
                    value: formattedDate,
                    icon: <CalendarDays size={23} />,
                  },
                  {
                    label: "Location",
                    value: event.location,
                    icon: <MapPin size={23} />,
                  },
                  {
                    label: "Volunteers",
                    value: `${event.volunteers ?? 0} People Joined`,
                    icon: <Users size={23} />,
                  },
                  {
                    label: "Event Type",
                    value: event.category,
                    icon: <Clock3 size={23} />,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-4 rounded-2xl p-5 ${
                      isDark ? "bg-[#203b2b]" : "bg-[#f3f5eb]"
                    }`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#dce9ca] text-[#174c38]">
                      {item.icon}
                    </div>

                    <div className="min-w-0">
                      <p className={`text-xs font-bold ${mutedText}`}>
                        {item.label}
                      </p>
                      <p className={`mt-1 truncate text-sm font-black ${pageText}`}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* GUIDELINES */}
            <section className={`rounded-[2rem] border p-6 sm:p-9 ${surface}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf1df] text-[#174c38]">
                  <Leaf size={24} />
                </div>

                <h2 className={`text-xl font-black ${pageText}`}>
                  Volunteer Guidelines
                </h2>
              </div>

              <ul className={`mt-6 space-y-4 text-sm leading-7 ${mutedText}`}>
                {[
                  "Arrive at the event location on time.",
                  "Follow the event organizer's instructions.",
                  "Cooperate with other volunteers.",
                  "Help make a positive impact in the community.",
                ].map((guideline) => (
                  <li key={guideline} className="flex gap-3">
                    <CheckCircle2
                      size={19}
                      className="mt-1 shrink-0 text-[#719b4e]"
                    />
                    {guideline}
                  </li>
                ))}
              </ul>
            </section>

            {/* EVENT DISCUSSION / COMMENTS */}
            <section className={`rounded-[2rem] border p-6 sm:p-9 ${surface}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#719b4e]">
                    <MessageCircle size={17} />
                    Community Discussion
                  </p>

                  <h2 className={`text-2xl font-black sm:text-3xl ${pageText}`}>
                    Event Comments
                  </h2>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    isDark
                      ? "bg-[#203b2b] text-[#d5ea83]"
                      : "bg-[#edf2e7] text-[#174c38]"
                  }`}
                >
                  {comments.length} Comments
                </span>
              </div>

              <p className={`mt-3 text-sm leading-7 ${mutedText}`}>
                Share your thoughts, ask questions, and connect with the community.
              </p>

              {/* ADD COMMENT FORM */}
              <div
                className={`mt-7 rounded-2xl p-4 sm:p-5 ${
                  isDark ? "bg-[#203b2b]" : "bg-[#f3f5eb]"
                }`}
              >
                {user ? (
                  <div className="flex items-start gap-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "Your profile"}
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dce9ca] font-black text-[#174c38]">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className={`mb-3 text-sm font-black ${pageText}`}>
                        {user.name || "Community Member"}
                      </p>

                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write your comment..."
                        maxLength={1000}
                        rows={3}
                        className={`w-full resize-y rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#719b4e] ${
                          isDark
                            ? "border-[#49634d] bg-[#14271c] text-white placeholder:text-[#829486]"
                            : "border-[#dce4d5] bg-white text-[#173f2c] placeholder:text-[#899589]"
                        }`}
                      />

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <span className={`text-xs ${mutedText}`}>
                          {commentText.length}/1000 characters
                        </span>

                        <button
                          type="button"
                          onClick={handleAddComment}
                          disabled={!commentText.trim() || commentLoading}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#174c38] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#246647] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {commentLoading ? (
                            <>
                              <Loader2 size={17} className="animate-spin" />
                              Posting...
                            </>
                          ) : (
                            <>
                              <Send size={17} />
                              Post Comment
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-3 text-center">
                    <MessageCircle
                      size={30}
                      className="mx-auto text-[#719b4e]"
                    />

                    <p className={`mt-3 font-bold ${pageText}`}>
                      Join the conversation
                    </p>

                    <p className={`mt-2 text-sm ${mutedText}`}>
                      Please login to share your thoughts.
                    </p>

                    <Link
                      href="/login"
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#174c38] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#246647]"
                    >
                      Login to Comment
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </div>

              {/* COMMENT FEEDBACK */}
              {commentMessage && (
                <p className="mt-5 flex items-start gap-2 rounded-xl bg-[#eaf1df] p-4 text-sm font-semibold text-[#174c38]">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  {commentMessage}
                </p>
              )}

              {commentError && (
                <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
                  {commentError}
                </p>
              )}

              {/* COMMENTS LIST */}
              <div className="mt-8 space-y-5">
                {commentsLoading ? (
                  <div className="flex items-center justify-center gap-3 py-10">
                    <Loader2 size={22} className="animate-spin text-[#719b4e]" />
                    <span className={`text-sm font-semibold ${mutedText}`}>
                      Loading comments...
                    </span>
                  </div>
                ) : comments.length === 0 ? (
                  <div
                    className={`rounded-2xl border border-dashed p-8 text-center ${
                      isDark ? "border-[#49634d]" : "border-[#dce4d5]"
                    }`}
                  >
                    <MessageCircle
                      size={34}
                      className="mx-auto text-[#719b4e]"
                    />

                    <h3 className={`mt-3 font-black ${pageText}`}>
                      No comments yet
                    </h3>

                    <p className={`mt-2 text-sm ${mutedText}`}>
                      Be the first person to share something about this event.
                    </p>
                  </div>
                ) : (
                  comments.map((comment) => {
                    // FIX: user undefined হলেও TypeScript error হবে না
                    const isOwnComment =
                      user?.email === comment.userEmail;

                    const isEditing =
                      editingCommentId === comment._id;

                    const isConfirmingDelete =
                      confirmDeleteId === comment._id;

                    const commentDate = new Date(
                      comment.createdAt
                    ).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    });

                    return (
                      <article
                        key={comment._id}
                        className={`rounded-2xl border p-4 sm:p-5 ${
                          isDark
                            ? "border-[#294333] bg-[#203b2b]/60"
                            : "border-[#e5e9dc] bg-[#fcfcf8]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {comment.userImage ? (
                            <img
                              src={comment.userImage}
                              alt={comment.userName}
                              className="h-11 w-11 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dce9ca] font-black text-[#174c38]">
                              {comment.userName?.charAt(0).toUpperCase() || "U"}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <p className={`text-sm font-black ${pageText}`}>
                                  {comment.userName || "Community Member"}
                                </p>

                                <p className={`mt-1 text-xs ${mutedText}`}>
                                  {commentDate}
                                  {comment.updatedAt !== comment.createdAt &&
                                    " · Edited"}
                                </p>
                              </div>

                              {isOwnComment && !isEditing && (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => startEditingComment(comment)}
                                    aria-label="Edit your comment"
                                    className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                                      isDark
                                        ? "text-[#d5ea83] hover:bg-[#385541]"
                                        : "text-[#174c38] hover:bg-[#eaf1df]"
                                    }`}
                                  >
                                    <Pencil size={16} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setConfirmDeleteId(comment._id);
                                      setEditingCommentId(null);
                                      setEditingText("");
                                    }}
                                    aria-label="Delete your comment"
                                    className="flex h-9 w-9 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </div>

                            {isEditing ? (
                              <div className="mt-4">
                                <textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  maxLength={1000}
                                  rows={3}
                                  className={`w-full resize-y rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#719b4e] ${
                                    isDark
                                      ? "border-[#49634d] bg-[#14271c] text-white"
                                      : "border-[#dce4d5] bg-white text-[#173f2c]"
                                  }`}
                                />

                                <div className="mt-3 flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateComment(comment._id)}
                                    disabled={!editingText.trim() || updatingComment}
                                    className="inline-flex items-center gap-2 rounded-full bg-[#174c38] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#246647] disabled:opacity-50"
                                  >
                                    {updatingComment ? (
                                      <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                      <CheckCircle2 size={14} />
                                    )}
                                    Save Changes
                                  </button>

                                  <button
                                    type="button"
                                    onClick={cancelEditingComment}
                                    disabled={updatingComment}
                                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold ${
                                      isDark
                                        ? "border-[#49634d] text-[#d5ea83]"
                                        : "border-[#dce4d5] text-[#174c38]"
                                    }`}
                                  >
                                    <X size={14} />
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className={`mt-4 whitespace-pre-line break-words text-sm leading-7 ${pageText}`}>
                                {comment.text}
                              </p>
                            )}

                            {isConfirmingDelete && (
                              <div
                                className={`mt-4 rounded-xl border p-4 ${
                                  isDark
                                    ? "border-red-900 bg-red-950/30"
                                    : "border-red-200 bg-red-50"
                                }`}
                              >
                                <p className="text-sm font-bold text-red-600">
                                  Are you sure you want to delete this comment?
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteComment(comment._id)}
                                    disabled={deletingCommentId === comment._id}
                                    className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                                  >
                                    {deletingCommentId === comment._id ? (
                                      <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                      <Trash2 size={14} />
                                    )}
                                    Confirm Delete
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(null)}
                                    disabled={deletingCommentId === comment._id}
                                    className={`rounded-full border px-4 py-2.5 text-xs font-bold ${
                                      isDark
                                        ? "border-[#49634d] text-[#d5ea83]"
                                        : "border-[#dce4d5] text-[#174c38]"
                                    }`}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-6">
            {/* JOIN AND BOOKMARK CARD */}
            <section className={`h-fit rounded-[2rem] border p-6 sm:p-7 lg:sticky lg:top-28 ${surface}`}>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#719b4e]">
                Make a Difference
              </p>

              <h2 className={`mt-3 text-2xl font-black ${pageText}`}>
                Join This Event
              </h2>

              <p className={`mt-3 text-sm leading-7 ${mutedText}`}>
                Your participation matters. Join other community members and help create a positive change.
              </p>

              <div className={`my-6 border-t ${
                isDark ? "border-[#385541]" : "border-[#e6e9dd]"
              }`} />

              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-2 text-sm font-semibold ${mutedText}`}>
                  <Users size={18} className="text-[#719b4e]" />
                  Volunteers
                </span>

                <span className={`text-2xl font-black ${pageText}`}>
                  {event.volunteers ?? 0}
                </span>
              </div>

              {joinMessage && (
                <p className="mt-5 flex items-start gap-2 rounded-2xl bg-[#eaf1df] p-4 text-sm font-semibold leading-6 text-[#174c38]">
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                  {joinMessage}
                </p>
              )}

              {joinError && (
                <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-600">
                  {joinError}
                </p>
              )}

              {/* JOIN BUTTON */}
              <button
                type="button"
                onClick={handleJoin}
                disabled={joining || alreadyJoined || isPending}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#174c38] px-5 py-4 font-black text-white shadow-lg shadow-[#174c38]/15 transition hover:-translate-y-1 hover:bg-[#246647] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {joining ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Joining...
                  </>
                ) : alreadyJoined ? (
                  <>
                    <Heart size={19} fill="currentColor" />
                    Already Joined
                  </>
                ) : isPending ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Checking...
                  </>
                ) : user ? (
                  <>
                    <Heart size={19} />
                    Join This Event
                  </>
                ) : (
                  <>
                    <UserRound size={19} />
                    Login to Join
                  </>
                )}
              </button>

              {!user && !isPending && (
                <p className={`mt-3 text-center text-xs leading-6 ${mutedText}`}>
                  Please login to become a volunteer for this event.
                </p>
              )}

              {/* BOOKMARK MESSAGE */}
              {bookmarkMessage && (
                <p className="mt-5 flex items-start gap-2 rounded-2xl bg-[#eaf1df] p-4 text-sm font-semibold leading-6 text-[#174c38]">
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                  {bookmarkMessage}
                </p>
              )}

              {bookmarkError && (
                <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-600">
                  {bookmarkError}
                </p>
              )}

              {/* BOOKMARK BUTTON */}
              <button
                type="button"
                onClick={handleBookmark}
                disabled={bookmarkLoading || bookmarkChecking || isPending}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full border px-5 py-4 font-black transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60 ${
                  isBookmarked
                    ? "border-[#719b4e] bg-[#eaf1df] text-[#174c38] hover:bg-[#dce9ca]"
                    : isDark
                      ? "border-[#49634d] text-[#d5ea83] hover:bg-[#203b2b]"
                      : "border-[#cdd9c3] text-[#174c38] hover:bg-[#edf2e7]"
                }`}
              >
                {bookmarkLoading || bookmarkChecking ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    {bookmarkLoading ? "Saving..." : "Checking..."}
                  </>
                ) : (
                  <>
                    <Bookmark
                      size={19}
                      fill={isBookmarked ? "currentColor" : "none"}
                    />
                    {isBookmarked ? "Saved Event" : "Save Event"}
                  </>
                )}
              </button>

              {!user && !isPending && (
                <p className={`mt-3 text-center text-xs leading-6 ${mutedText}`}>
                  Login to save this event for later.
                </p>
              )}

              {/* SHARE BUTTON */}
              <button
                type="button"
                onClick={handleShare}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3.5 text-sm font-bold transition ${
                  isDark
                    ? "border-[#49634d] text-[#d5ea83] hover:bg-[#203b2b]"
                    : "border-[#cdd9c3] text-[#174c38] hover:bg-[#edf2e7]"
                }`}
              >
                <Share2 size={18} />
                Share Event
              </button>
            </section>

            {/* ORGANIZER CARD */}
            <section className={`rounded-[2rem] border p-6 ${surface}`}>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#719b4e]">
                Organized By
              </p>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#dce9ca] text-[#174c38]">
                  <UserRound size={27} />
                </div>

                <div className="min-w-0">
                  <p className={`truncate font-black ${pageText}`}>
                    {event.creatorName || "Community Member"}
                  </p>

                  <p className={`mt-1 text-xs ${mutedText}`}>
                    Event Organizer
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {/* BOTTOM CTA */}
        <section className="relative mt-12 overflow-hidden rounded-[2rem] bg-[#174c38] px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border-[45px] border-white/5" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#d5ea83]">
              <HandHeart size={29} />
            </div>

            <h2 className="mt-6 text-3xl font-black sm:text-4xl">
              Small Actions. Big Changes.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/75">
              Together, we can build a more caring and connected community.
              Explore more opportunities and make a difference.
            </p>

            <Link
              href="/events"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#d5ea83] px-7 py-3.5 font-black text-[#173f2c] transition hover:-translate-y-1 hover:bg-white"
            >
              Explore More Events
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="mt-10 bg-[#102b1b] px-5 py-8 text-center text-xs text-[#a9b9a8]">
        © 2026 TogetherWe. Built for a better community.
      </footer>
    </main>
  );
}
