import NepalMap from "./NepalMap";
import PopularPackages from "./PopularPackages";
import Tripofmonth from "./Tripofmonth";
import GuideExpert from "./GuideExpert";
import TourCategories from "./TourCategories";

import {
  Mountain,
  Star,
  ShieldCheck,
  BadgeDollarSign,
  Search,
} from "lucide-react";

const Hero = () => {
  return (
    <div className="bg-white">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section
        id="home"
        className="relative min-h-[750px] overflow-hidden"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/CLIMBER.jpg')",
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Hero Content */}
        <div className="relative z-10 flex min-h-[750px] items-center justify-center px-6 pt-24">
          <div className="w-full max-w-5xl text-center text-white">

            {/* Small Label */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#9be564]" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                Welcome to Nepal
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              Explore
              <span className="block text-[#9be564]">
                Nepal
              </span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Discover breathtaking mountains, ancient cultures,
              unforgettable adventures and the natural beauty of Nepal.
            </p>

            {/* Search */}
            <div className="mx-auto mt-9 flex w-full max-w-2xl items-center rounded-full bg-white p-2 shadow-2xl">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eaf6df] text-[#4f8f3a]">
                <Search size={22} strokeWidth={1.8} />
              </div>

              <input
                type="text"
                placeholder="Search destinations, treks or tours..."
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-gray-800 outline-none sm:text-base"
              />

              <button className="rounded-full bg-[#0b2418] px-6 py-3 text-sm font-semibold text-[#9be564] transition hover:bg-[#4f8f3a] hover:text-white">
                Search
              </button>
            </div>

            {/* Features */}
            <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">

              {/* Top Rated */}
              <div className="text-center">
                <div className="mb-2 flex justify-center text-[#9be564]">
                  <Star size={28} strokeWidth={1.5} />
                </div>

                <h3 className="font-semibold">
                  Top Rated
                </h3>

                <p className="mt-1 text-xs text-white/60">
                  Loved by travelers
                </p>
              </div>

              {/* Secure Booking */}
              <div className="text-center">
                <div className="mb-2 flex justify-center text-[#9be564]">
                  <ShieldCheck size={28} strokeWidth={1.5} />
                </div>

                <h3 className="font-semibold">
                  Secure Booking
                </h3>

                <p className="mt-1 text-xs text-white/60">
                  Safe & reliable
                </p>
              </div>

              {/* Private Treks */}
              <div className="text-center">
                <div className="mb-2 flex justify-center text-[#9be564]">
                  <Mountain size={28} strokeWidth={1.5} />
                </div>

                <h3 className="font-semibold">
                  Private Treks
                </h3>

                <p className="mt-1 text-xs text-white/60">
                  Made for you
                </p>
              </div>

              {/* Best Price */}
              <div className="text-center">
                <div className="mb-2 flex justify-center text-[#9be564]">
                  <BadgeDollarSign size={28} strokeWidth={1.5} />
                </div>

                <h3 className="font-semibold">
                  Best Price
                </h3>

                <p className="mt-1 text-xs text-white/60">
                  Price guarantee
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TREKKING / PACKAGES
      ===================================================== */}
      <section id="trekking" className="bg-white">
        <PopularPackages />
      </section>

      {/* =====================================================
          TOURS
      ===================================================== */}
      <section id="tours">
        <Tripofmonth />
      </section>

      {/* =====================================================
          DESTINATIONS
      ===================================================== */}
      <section id="destinations">
        <NepalMap />
      </section>

      {/* =====================================================
          HERO SLIDER
      ===================================================== */}
      {/*
      <section id="heroslider">
        <HeroSlider />
      </section>
      */}

      {/* =====================================================
          GUIDE EXPERT
      ===================================================== */}
      <section id="GuideExpert">
        <GuideExpert />
      </section>

      {/* =====================================================
          TOUR CATEGORIES
      ===================================================== */}
      <section id="Categories">
        <TourCategories />
      </section>

    </div>
  );
};

export default Hero;