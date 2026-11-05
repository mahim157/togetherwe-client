
"use client";

import { useState } from "react";

import {
  ArrowRight,
  Heart,
  Users,
  CalendarDays,
  MapPin,
  HandHeart,
  ArrowUpRight,
  Menu,
  X,
  Globe,
} from "lucide-react";
const events = [
  {
    title: "Winter Clothes Distribution",
    category: "Donation",
    location: "Mirpur 10, Dhaka",
    date: "November 20, 2026",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900",
    people: "25 Volunteers",
  },
  {
    title: "Community Tree Plantation",
    category: "Plantation",
    location: "Savar, Dhaka",
    date: "November 25, 2026",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900",
    people: "18 Volunteers",
  },
  {
    title: "Neighborhood Cleanup Drive",
    category: "Cleanup",
    location: "Dhanmondi, Dhaka",
    date: "November 28, 2026",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=900",
    people: "30 Volunteers",
  },
];

const features = [
  {
    icon: HandHeart,
    title: "Create Events",
    description:
      "Organize meaningful community events and invite people to make a positive difference.",
  },
  {
    icon: Users,
    title: "Join Community",
    description:
      "Connect with passionate people and work together toward a better society.",
  },
  {
    icon: Globe,
    title: "Make an Impact",
    description:
      "Turn small actions into meaningful changes for your local community.",
  },
];

const gallery = [
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=700",
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=700",
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=700",
  "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=700",
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-slate-900">

           {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          {/* LOGO */}
          <a
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Heart size={22} fill="white" />
            </div>

            <span className="text-2xl font-extrabold tracking-tight">
              Together<span className="text-emerald-600">We.</span>
            </span>
          </a>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="/" className="text-emerald-600">
              Home
            </a>

            <a href="#features" className="transition hover:text-emerald-600">
              Features
            </a>

            <a href="/events" className="transition hover:text-emerald-600">
              Upcoming Events
            </a>

            <a href="#gallery" className="transition hover:text-emerald-600">
              Gallery
            </a>
          </div>

          {/* DESKTOP AUTH BUTTONS */}
          <div className="hidden items-center gap-3 md:flex">
            <a
              href="/login"
              className="px-4 py-2 text-sm font-semibold transition hover:text-emerald-600"
            >
              Login
            </a>

            <a
              href="/register"
              className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Get Started
            </a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg border border-gray-200 p-2 text-slate-700 transition hover:bg-emerald-50 md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>

        </div>

        {/* MOBILE NAVIGATION */}
        {isMenuOpen && (
          <div
            id="mobile-navigation"
            className="border-t border-gray-100 bg-white px-5 py-5 shadow-lg md:hidden"
          >
            <div className="flex flex-col gap-1 text-sm font-medium text-slate-700">

              <a
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg bg-emerald-50 px-4 py-3 text-emerald-700"
              >
                Home
              </a>

              <a
                href="#features"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-4 py-3 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                Features
              </a>

              <a
                href="/events"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-4 py-3 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                Upcoming Events
              </a>

              <a
                href="#gallery"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-4 py-3 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                Gallery
              </a>

              <div className="my-3 border-t border-gray-100" />

              <a
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-4 py-3 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                Login
              </a>

              <a
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 rounded-full bg-emerald-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-700"
              >
                Get Started
              </a>

            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="overflow-hidden bg-[#f0fdf4]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Together, We Can Make a Difference
            </div>

            <h1 className="max-w-xl text-5xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl">
              Small Actions.
              <span className="block text-emerald-600">
                Big Changes.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
              Connect with your community, join meaningful social events,
              and become part of something bigger. Together, let's build
              a better tomorrow.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a href="/events" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-4 font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-1 hover:bg-emerald-700">
                Explore Events
                <ArrowRight size={19} />
              </a>

              <a href="/register" className="rounded-full border border-emerald-200 bg-white px-7 py-4 font-semibold text-emerald-700 transition hover:bg-emerald-50">
                Join Our Community
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-8">
              <div>
                <h3 className="text-3xl font-extrabold text-slate-900">500+</h3>
                <p className="mt-1 text-sm text-slate-500">Community Members</p>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-slate-900">120+</h3>
                <p className="mt-1 text-sm text-slate-500">Events Organized</p>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-slate-900">25+</h3>
                <p className="mt-1 text-sm text-slate-500">Local Communities</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-emerald-200/60 blur-3xl" />

            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200"
              alt="Volunteers working together for their community"
              className="relative h-[420px] w-full rounded-[2rem] object-cover shadow-2xl md:h-[500px]"
            />

            <div className="absolute -bottom-6 -left-3 rounded-2xl bg-white p-5 shadow-xl md:-left-8">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
                  <HandHeart size={25} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Make an Impact</p>
                  <p className="text-sm text-slate-500">One action at a time.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">

        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 font-bold uppercase tracking-widest text-emerald-600">
            What We Do
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Bringing People Together for Good
          </h2>
          <p className="mt-4 leading-7 text-slate-500">
            A platform that makes it easier to organize, discover,
            and participate in meaningful community activities.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="group rounded-3xl border border-gray-100 bg-white p-8 transition duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-xl">
                <div className="mb-6 inline-flex rounded-2xl bg-emerald-50 p-4 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <Icon size={29} />
                </div>

                <h3 className="mb-3 text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="leading-7 text-slate-500">
                  {feature.description}
                </p>

                <a href="/events" className="mt-6 inline-flex items-center gap-2 font-semibold text-emerald-600">
                  Learn More <ArrowUpRight size={17} />
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section id="events" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">

          <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-3 font-bold uppercase tracking-widest text-emerald-600">
                Get Involved
              </p>
              <h2 className="text-3xl font-extrabold md:text-4xl">
                Upcoming Community Events
              </h2>
              <p className="mt-3 text-slate-500">
                Find an event near you and be part of the change.
              </p>
            </div>

            <a href="/events" className="inline-flex items-center gap-2 font-bold text-emerald-600 hover:gap-3">
              View All Events <ArrowRight size={18} />
            </a>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article key={event.title} className="overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-56 w-full object-cover"
                  />

                  <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-bold text-emerald-700 shadow">
                    {event.category}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900">
                    {event.title}
                  </h3>

                  <div className="mt-5 space-y-3 text-sm text-slate-500">
                    <p className="flex items-center gap-2">
                      <CalendarDays size={17} className="text-emerald-600" />
                      {event.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin size={17} className="text-emerald-600" />
                      {event.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users size={17} className="text-emerald-600" />
                      {event.people}
                    </p>
                  </div>

                  <a href="/events" className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white">
                    View Event <ArrowRight size={17} />
                  </a>
                </div>

              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY GALLERY */}
      <section id="gallery" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">

        <div className="mb-12 text-center">
          <p className="mb-3 font-bold uppercase tracking-widest text-emerald-600">
            Our Community
          </p>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Moments That Matter
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-500">
            Every smile, every helping hand, and every small contribution
            creates a story worth sharing.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {gallery.map((image, index) => (
            <div key={image} className="group overflow-hidden rounded-2xl">
              <img
                src={image}
                alt={`Community volunteering moment ${index + 1}`}
                className="h-48 w-full object-cover transition duration-500 group-hover:scale-110 md:h-64"
              />
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-5 pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-emerald-700 px-6 py-16 text-center text-white md:px-16">

          <div className="mx-auto mb-5 inline-flex rounded-full bg-white/15 p-4">
            <Heart size={30} />
          </div>

          <h2 className="text-3xl font-extrabold md:text-5xl">
            Be the Reason Someone Smiles Today.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-emerald-100">
            Your time, your effort, and your kindness can make a real
            difference. Join our community and start creating change.
          </p>

          <a href="/register" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-emerald-700 transition hover:bg-emerald-50">
            Join TogetherWe <ArrowRight size={19} />
          </a>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8">

          <div>
            <a href="/" className="flex items-center gap-2 text-2xl font-extrabold">
              <Heart className="text-emerald-400" fill="currentColor" />
              Together<span className="text-emerald-400">We.</span>
            </a>

            <p className="mt-5 max-w-xs leading-7 text-slate-400">
              Bringing communities together through meaningful actions
              and social development initiatives.
            </p>
          </div>

          <div>
            <h3 className="mb-5 font-bold">Quick Links</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <p><a href="/" className="hover:text-emerald-400">Home</a></p>
              <p><a href="/events" className="hover:text-emerald-400">Upcoming Events</a></p>
              <p><a href="#features" className="hover:text-emerald-400">Features</a></p>
              <p><a href="#gallery" className="hover:text-emerald-400">Gallery</a></p>
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-bold">Get Involved</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <p><a href="/register" className="hover:text-emerald-400">Join Community</a></p>
              <p><a href="/login" className="hover:text-emerald-400">Login</a></p>
              <p><a href="/events" className="hover:text-emerald-400">Explore Events</a></p>
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-bold">Follow Our Journey</h3>
            <p className="mb-5 text-sm leading-7 text-slate-400">
              Stay connected and be part of our community.
            </p>

            <div className="flex gap-3">
  <a
    href="#"
    aria-label="Facebook"
    className="rounded-full bg-slate-800 p-3 text-white hover:bg-emerald-600"
  >
    <span className="text-lg font-bold">f</span>
  </a>

  <a
    href="#"
    aria-label="Instagram"
    className="rounded-full bg-slate-800 p-3 text-white hover:bg-emerald-600"
  >
    <span className="text-lg font-bold">◎</span>
  </a>
</div>
          </div>

        </div>

        <div className="border-t border-slate-800 px-5 py-6 text-center text-sm text-slate-500">
          © 2026 TogetherWe. Built for a better community.
        </div>
      </footer>

    </main>
  );
}
