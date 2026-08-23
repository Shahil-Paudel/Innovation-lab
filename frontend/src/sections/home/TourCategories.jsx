import React, { useState } from "react";

const TourCategories = () => {
  const [category, setCategory] = useState("all");

  // =========================
  // TREK DATA
  // =========================
  const treks = [
    {
      title: "Everest Base Camp",
      category: "Trek",
      image: "/images/MOUNT.jpg",
      size: "large",
    },
    {
      title: "Annapurna Base Camp",
      category: "Trek",
      image: "/images/AnnapurnaTour.jpg",
      size: "small",
    },
    {
      title: "Langtang Valley",
      category: "Trek",
      image: "/images/LangtangTour.jpg",
      size: "medium",
    },
  ];

  // =========================
  // TOUR DATA
  // =========================
  const tours = [
    {
      title: "City Tour",
      category: "Tour",
      image: "/images/CityTour.jpg",
      size: "medium",
    },
    {
      title: "UNESCO World Heritage",
      category: "Tour",
      image: "/images/UNESCO Tour.jpg",
      size: "large",
    },
    {
      title: "Bike Tour",
      category: "Tour",
      image: "/images/BikeTour.jpg",
      size: "small",
    },
    {
      title: "Helicopter Tour",
      category: "Tour",
      image: "/images/HelicopterTour.jpg",
      size: "medium",
    },
    {
      title: "Jeep Tour",
      category: "Tour",
      image: "/images/JeepTour.jpg",
      size: "small",
    },
    {
      title: "Chitwan Safari",
      category: "Tour",
      image: "/images/CHITWAN.jpg",
      size: "large",
    },
    {
      title: "Kailash Mansarovar Yatra",
      category: "Tour",
      image: "/images/KailashTour.jpg",
      size: "medium",
    },
  ];

  // =========================
  // SHOW CARDS
  // =========================

  let cards = [];

  if (category === "all") {
    cards = [...treks, ...tours];
  } else if (category === "trek") {
    cards = treks;
  } else if (category === "tour") {
    cards = tours;
  }

  return (
    <section className="bg-[#FBF9F4] px-6 py-14 md:px-10 lg:px-16">

      {/* ========================= */}
      {/* HEADING */}
      {/* ========================= */}

      <div className="mx-auto mb-10 max-w-3xl text-center">

        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#4f8f3a]">
          - TOURS & TRAVEL CATEGORIES
        </h3>

        <h1 className="mb-4 text-3xl font-bold text-[#0b2418] sm:text-4xl lg:text-5xl">
          Choose Your Destination
        </h1>

        <p className="mx-auto max-w-2xl text-base leading-7 text-gray-500">
          Discover breathtaking treks, cultural experiences, adventure tours,
          and unforgettable journeys across Nepal.
        </p>

      </div>


      {/* ========================= */}
      {/* CATEGORY BUTTONS */}
      {/* ========================= */}

      <div className="mb-10 flex flex-wrap items-center justify-center gap-3">

        <span className="mr-2 text-sm font-semibold text-[#0b2418]">
          Category:
        </span>

        {/* TOURS BUTTON */}
        <button
          onClick={() => setCategory("tour")}
          className={`rounded-full px-6 py-2.5 text-sm font-semibold transition duration-300 ${
            category === "tour"
              ? "bg-[#0b2418] text-white shadow-md"
              : "border border-[#0b2418]/20 bg-white text-[#0b2418] hover:bg-[#0b2418] hover:text-white"
          }`}
        >
          Tours
        </button>

        {/* TREKS BUTTON */}
        <button
          onClick={() => setCategory("trek")}
          className={`rounded-full px-6 py-2.5 text-sm font-semibold transition duration-300 ${
            category === "trek"
              ? "bg-[#0b2418] text-white shadow-md"
              : "border border-[#0b2418]/20 bg-white text-[#0b2418] hover:bg-[#0b2418] hover:text-white"
          }`}
        >
          Treks
        </button>

        {/* ALL BUTTON */}
        <button
          onClick={() => setCategory("all")}
          className={`rounded-full px-6 py-2.5 text-sm font-semibold transition duration-300 ${
            category === "all"
              ? "bg-[#4f8f3a] text-white shadow-md"
              : "border border-[#4f8f3a]/30 bg-white text-[#4f8f3a] hover:bg-[#4f8f3a] hover:text-white"
          }`}
        >
          All
        </button>

      </div>


      {/* ========================= */}
      {/* MOSAIC CARD GRID */}
      {/* ========================= */}

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">

        {cards.map((card, index) => (

          <div
            key={`${card.title}-${index}`}
            className={`
              group
              relative
              overflow-hidden
              rounded-2xl
              shadow-md
              ${
                card.size === "large"
                  ? "col-span-2 row-span-2 h-[420px]"
                  : card.size === "medium"
                  ? "col-span-2 h-[260px]"
                  : "col-span-1 h-[260px]"
              }
            `}
          >

            {/* IMAGE */}

            <img
              src={card.image}
              alt={card.title}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
                ease-out
                group-hover:scale-110
              "
            />


            {/* DARK OVERLAY */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/70
                via-black/20
                to-transparent
                transition
                duration-300
                group-hover:from-black/80
              "
            />


            {/* CONTENT */}

            <div className="absolute bottom-0 left-0 right-0 p-5">

              <span className="mb-2 inline-block rounded-full bg-[#9be564] px-3 py-1 text-xs font-semibold text-[#0b2418]">
                {card.category}
              </span>

              <h3 className="text-xl font-bold text-white">
                {card.title}
              </h3>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default TourCategories;