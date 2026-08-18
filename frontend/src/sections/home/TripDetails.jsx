import React from "react";
import { X, CalendarDays, Mountain, Star } from "lucide-react";

const TripDetails = ({ trip, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-md">

      {/* Detail Card */}
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/30 bg-white shadow-2xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition hover:scale-110 hover:bg-white"
        >
          <X size={20} />
        </button>

        {/* Image */}
        <div className="h-72 w-full overflow-hidden">
          <img
            src={trip.image}
            alt={trip.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-7">

          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#4f8f3a]">
            {trip.region}
          </p>

          <h2 className="mb-5 text-3xl font-bold text-[#0b2418]">
            {trip.title}
          </h2>

          {/* Trip Information */}
          <div className="mb-6 flex flex-wrap gap-5 text-sm text-gray-600">

            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-[#4f8f3a]" />
              {trip.days}
            </div>

            <div className="flex items-center gap-2">
              <Mountain size={18} className="text-[#4f8f3a]" />
              {trip.height}
            </div>

            <div className="flex items-center gap-2">
              <Star
                size={18}
                className="text-[#f5b942]"
                fill="currentColor"
              />
              {trip.rating} ({trip.reviews} reviews)
            </div>

          </div>

          <p className="mb-6 leading-7 text-gray-600">
            Experience an unforgettable journey through the spectacular
            landscapes of Nepal. This carefully designed trek offers
            incredible mountain views, beautiful villages, and memorable
            adventures.
          </p>

          {/* Price */}
          <div className="flex items-center justify-between border-t pt-5">

            <div>
              <span className="mr-2 text-sm text-gray-400 line-through">
                {trip.oldPrice}
              </span>

              <span className="text-2xl font-bold text-[#0b2418]">
                {trip.price}
              </span>

              <span className="ml-1 text-sm text-gray-400">
                /person
              </span>
            </div>

            <button className="rounded-full bg-[#9be564] px-6 py-3 font-semibold text-[#0b2418] transition hover:bg-[#b5f27d]">
              Book This Trip
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default TripDetails;