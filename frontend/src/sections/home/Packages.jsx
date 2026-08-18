import React, { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Mountain,
  Star,
  Heart,
  MapPin,
  Gauge,
} from "lucide-react";
import TripDetails from "./TripDetails";

const Packages = () => {
  const [wishlist, setWishlist] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const packages = [
    {
      image: "/images/MOUNT.jpg",
      region: "EVEREST REGION",
      difficulty: "Challenging",
      title: "Everest Base Camp Trek",
      days: "14 days",
      height: "5,364m",
      rating: "4.8",
      reviews: "284",
      oldPrice: "$1450",
      price: "$1290",
      discount: "Save 11%",
    },
    {
      image: "/images/API.jpg",
      region: "API REGION",
      difficulty: "Challenging",
      title: "Api Base Camp Trek",
      days: "14 days",
      height: "7,132m",
      rating: "4.7",
      reviews: "126",
      oldPrice: "$1500",
      price: "$1350",
      discount: "Save 10%",
    },
    {
      image: "/images/CHITWAN.jpg",
      region: "CHITWAN",
      difficulty: "Easy",
      title: "Chitwan Jungle Safari",
      days: "3 days",
      height: "Tarai",
      rating: "4.6",
      reviews: "198",
      oldPrice: "$500",
      price: "$440",
      discount: "Save 12%",
    },
    {
      image: "/images/MOUNT.jpg",
      region: "ANNAPURNA REGION",
      difficulty: "Moderate",
      title: "Annapurna Base Camp",
      days: "10 days",
      height: "4,130m",
      rating: "4.9",
      reviews: "342",
      oldPrice: "$1200",
      price: "$1050",
      discount: "Save 13%",
    },
  ];

  const handleWishlist = (index) => {
    if (!wishlist.includes(index)) {
      setWishlist([...wishlist, index]);

      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    } else {
      setWishlist(wishlist.filter((item) => item !== index));
    }
  };

  return (
    <section className="parent px-6 py-16 md:px-10 lg:px-16">

      {/* Wishlist Popup */}
      {showPopup && (
        <div className="fixed right-6 top-24 z-[100] flex items-center gap-2 rounded-xl bg-[#0b2418] px-5 py-3 text-sm font-medium text-white shadow-xl">
          <Heart size={17} fill="currentColor" />
          Added to wishlist
        </div>
      )}

      {/* Heading */}
      <div className="mb-10 max-w-2xl">

        <h5 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#4f8f3a]">
          - Popular trekking packages
        </h5>

        <h1 className="mb-4 text-3xl font-bold text-[#0b2418] sm:text-4xl lg:text-5xl">
          Find Your Next Adventure
        </h1>

        <p className="text-base leading-7 text-gray-500">
          Handpick journeys through Nepal's most spectacular landscapes.
        </p>

      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {packages.map((pkg, index) => (

          <div
            key={index}
            className="overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >

            {/* Image */}
            <div className="group relative h-64 overflow-hidden">

              <img
                src={pkg.image}
                alt={pkg.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/30"></div>

              {/* Save Badge */}
              <div className="absolute left-4 top-4 rounded-full bg-[#9be564] px-3 py-1.5 text-xs font-bold text-[#0b2418] shadow-md">
                {pkg.discount}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => handleWishlist(index)}
                className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition duration-300 hover:scale-110 ${
                  wishlist.includes(index)
                    ? "text-red-500"
                    : "text-gray-700"
                }`}
              >
                <Heart
                  size={20}
                  strokeWidth={2}
                  fill={
                    wishlist.includes(index)
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            </div>

            {/* Information */}
            <div className="p-5">

              {/* Region + Difficulty */}
              <div className="mb-3 flex items-center justify-between gap-2">

                <div className="flex items-center gap-1.5">

                  <MapPin
                    size={14}
                    className="text-[#4f8f3a]"
                  />

                  <span className="text-xs font-semibold uppercase tracking-wide text-[#4f8f3a]">
                    {pkg.region}
                  </span>

                </div>

                <div className="flex items-center gap-1 rounded-full border border-[#4f8f3a]/30 bg-[#eaf6df] px-2.5 py-1 text-[11px] font-medium text-[#4f8f3a]">

                  <Gauge size={12} />

                  {pkg.difficulty}

                </div>

              </div>

              {/* Title */}
              <h3 className="mb-4 text-lg font-bold leading-6 text-[#0b2418]">
                {pkg.title}
              </h3>

              {/* Days + Height */}
              <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">

                {/* Days */}
                <div className="flex items-center gap-1.5">

                  <CalendarDays
                    size={16}
                    className="text-[#4f8f3a]"
                  />

                  <span>{pkg.days}</span>

                </div>

                {/* Height */}
                <div className="flex items-center gap-1.5">

                  <Mountain
                    size={17}
                    className="text-[#4f8f3a]"
                  />

                  <span>{pkg.height}</span>

                </div>

              </div>

              {/* Rating */}
              <div className="mb-5 flex items-center gap-2 text-sm">

                <Star
                  size={16}
                  className="text-[#f5b942]"
                  fill="currentColor"
                />

                <span className="font-semibold text-[#0b2418]">
                  {pkg.rating}
                </span>

                <span className="text-gray-400">
                  ({pkg.reviews} reviews)
                </span>

              </div>

              {/* Bottom */}
              <div className="flex items-end justify-between border-t border-gray-100 pt-4">

                {/* Price */}
                <div>

                  <div className="mb-1 text-xs text-gray-400">
                    <span className="line-through">
                      {pkg.oldPrice}
                    </span>
                  </div>

                  <div className="text-lg font-bold text-[#0b2418]">

                    {pkg.price}

                    <span className="ml-1 text-xs font-normal text-gray-400">
                      /person
                    </span>

                  </div>

                </div>

                {/* View Trip */}
                <button
                  onClick={() => setSelectedTrip(pkg)}
                  className="flex items-center gap-1 text-sm font-semibold text-[#0b2418] transition hover:text-[#4f8f3a]"
                >
                  View trip
                  <ArrowRight size={16} />
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Trip Details Modal */}
      {selectedTrip && (
        <TripDetails
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}

    </section>
  );
};

export default Packages;