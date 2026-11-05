
"use client";

import { Suspense, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Heart,
  Clock,
  Share2,
  CheckCircle2,
} from "lucide-react";

const events = [
  {
    id: "1",
    title: "Winter Clothes Distribution",
    category: "Donation",
    location: "Mirpur 10, Dhaka",
    date: "2026-11-20",
    time: "10:00 AM",
    volunteers: 45,
    description:
      "Help us distribute warm clothes to people who need support during the winter season.",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200",
    organizer: "TogetherWe Community",
    fullDescription:
      "Winter can be difficult for people who cannot afford warm clothing. Through this initiative, we aim to collect and distribute winter clothes to underprivileged families and individuals in the Mirpur area. Volunteers will help organize, sort, and distribute donated clothes. Join us and help make winter a little warmer for everyone.",
    requirements: [
      "Bring clean and usable winter clothes if possible.",
      "Arrive at the event location on time.",
      "Follow the instructions of the event organizers.",
      "Help distribute clothes respectfully.",
    ],
  },
  {
    id: "2",
    title: "Community Tree Plantation",
    category: "Plantation",
    location: "Savar, Dhaka",
    date: "2026-11-25",
    time: "9:00 AM",
    volunteers: 32,
    description:
      "Join our initiative to make the community greener by planting trees.",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200",
    organizer: "TogetherWe Community",
    fullDescription:
      "Trees are essential for a healthy environment. Join our community plantation program and help make our surroundings greener. Volunteers will plant trees in selected public spaces and learn about basic tree care.",
    requirements: [
      "Wear comfortable clothing.",
      "Bring gardening gloves if available.",
      "Follow the plantation instructions.",
      "Help keep the area clean.",
    ],
  },
  {
    id: "3",
    title: "Neighborhood Cleanup Drive",
    category: "Cleanup",
    location: "Dhanmondi, Dhaka",
    date: "2026-11-28",
    time: "8:00 AM",
    volunteers: 28,
    description:
      "Work together to clean public spaces and create a healthier neighborhood.",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200",
    organizer: "TogetherWe Community",
    fullDescription:
      "A clean neighborhood creates a healthier and more welcoming environment. Volunteers will work together to collect litter, clean public spaces, and encourage responsible waste disposal.",
    requirements: [
      "Wear comfortable shoes and clothing.",
      "Bring reusable gloves if possible.",
      "Follow waste collection instructions.",
      "Work safely with other volunteers.",
    ],
  },
  {
    id: "4",
    title: "Food for Everyone",
    category: "Donation",
    location: "Uttara, Dhaka",
    date: "2026-12-02",
    time: "11:00 AM",
    volunteers: 60,
    description:
      "Support our food distribution program for underprivileged families.",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200",
    organizer: "TogetherWe Community",
    fullDescription:
      "Our goal is to support families facing food insecurity. Volunteers will help organize food packages and distribute essential food items to people in need.",
    requirements: [
      "Arrive at the distribution point on time.",
      "Help organize food packages.",
      "Treat every recipient with respect.",
      "Follow the organizer's instructions.",
    ],
  },
  {
    id: "5",
    title: "Community Health Awareness",
    category: "Awareness",
    location: "Mohammadpur, Dhaka",
    date: "2026-12-05",
    time: "10:00 AM",
    volunteers: 35,
    description:
      "Take part in a community awareness program focused on health and wellbeing.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200",
    organizer: "TogetherWe Community",
    fullDescription:
      "This community program aims to promote basic health awareness and encourage healthy habits. Volunteers will help arrange the event and share educational information with community members.",
    requirements: [
      "Arrive before the program starts.",
      "Help organize the awareness materials.",
      "Communicate respectfully.",
      "Support the event organizers.",
    ],
  },
  {
    id: "6",
    title: "Help for Street Children",
    category: "Social Work",
    location: "Farmgate, Dhaka",
    date: "2026-12-10",
    time: "9:00 AM",
    volunteers: 25,
    description:
      "Support street children through education and essential supplies.",
   image:
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=900",
    organizer: "TogetherWe Community",
    fullDescription:
      "This initiative focuses on supporting children who need educational resources and essential supplies. Volunteers will help organize learning materials and distribute necessary items.",
    requirements: [
      "Bring educational supplies if possible.",
      "Follow child safety guidelines.",
      "Treat every child with kindness.",
      "Coordinate with the event organizers.",
    ],
  },
];

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function EventDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const event = events.find((item) => item.id === id);

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7faf8] px-5">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <Heart size={34} className="text-green-600" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Event Not Found
          </h1>

          <p className="mt-3 text-gray-500">
            Sorry, we could not find the event you are looking for.
          </p>

          <Link
            href="/events"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            <ArrowLeft size={18} />
            Back to Events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7faf8] text-gray-900">
      {/* Hero Image */}
      <section className="relative h-[320px] overflow-hidden md:h-[460px]">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-10">
          <Link
            href="/events"
            className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/30"
          >
            <ArrowLeft size={17} />
            Back to Events
          </Link>

          <span className="block w-fit rounded-full bg-green-500 px-4 py-1.5 text-xs font-semibold text-white">
            {event.category}
          </span>

          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl">
            {event.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-5 text-sm text-white/90">
            <span className="flex items-center gap-2">
              <MapPin size={17} />
              {event.location}
            </span>

            <span className="flex items-center gap-2">
              <CalendarDays size={17} />
              {formatDate(event.date)}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1fr_350px]">
        {/* Event Information */}
        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              About This Event
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              {event.fullDescription}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Volunteer Guidelines
            </h2>

            <div className="mt-6 space-y-4">
              {event.requirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <p className="text-sm leading-7 text-gray-600">
                    {requirement}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Event Organizer
            </h2>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <Heart size={25} className="text-green-600" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  {event.organizer}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Community Event Organizer
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Summary Card */}
        <aside>
          <div className="sticky top-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Event Information
            </h2>

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-3">
                <CalendarDays
                  size={21}
                  className="mt-0.5 text-green-600"
                />

                <div>
                  <p className="text-sm text-gray-500">Event Date</p>
                  <p className="mt-1 font-semibold text-gray-800">
                    {formatDate(event.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock
                  size={21}
                  className="mt-0.5 text-green-600"
                />

                <div>
                  <p className="text-sm text-gray-500">Starting Time</p>
                  <p className="mt-1 font-semibold text-gray-800">
                    {event.time}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  size={21}
                  className="mt-0.5 text-green-600"
                />

                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="mt-1 font-semibold text-gray-800">
                    {event.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users
                  size={21}
                  className="mt-0.5 text-green-600"
                />

                <div>
                  <p className="text-sm text-gray-500">
                    Interested Volunteers
                  </p>
                  <p className="mt-1 font-semibold text-gray-800">
                    {event.volunteers} people
                  </p>
                </div>
              </div>
            </div>

            <div className="my-7 border-t border-gray-100" />

            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
            >
              <Heart size={18} />
              Join This Event
            </Link>

            <p className="mt-3 text-center text-xs leading-5 text-gray-400">
              Please log in to join this community event.
            </p>

            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: event.title,
                    text: event.description,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 font-medium text-gray-600 transition hover:border-green-500 hover:text-green-700"
            >
              <Share2 size={17} />
              Share Event
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7faf8]">
          <p className="text-lg font-medium text-green-600">
            Loading event details...
          </p>
        </div>
      }
    >
      <EventDetailsContent params={params} />
    </Suspense>
  );
}
