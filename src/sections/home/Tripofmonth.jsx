import React, { useState } from "react";


const Tripofmonth = () => {
  const [selectedTrip, setSelectedTrip] = useState("everest");

  const trips = {
    everest: {
      title: "Everest Climbing",
      image: "/images/MOUNT.jpg",
      details: ["12 Days", "Moderate", "Max 8840m", "Rating 4.2"],
    //   we use map
      description:
        "Experience the breathtaking Himalayas and the world's highest mountain. Explore the legendary Everest region and enjoy spectacular mountain views.",
      why:
        "This is a perfect time to explore the Everest region, with beautiful mountain views and favorable trekking conditions.",
    },

    api: {
      title: "Api Base Camp Trek",
      image: "/images/API.jpg",
      details: ["14 Days", "Hard", "Max 7132m", "Rating 4.5"],
      description:
        "Discover the remote and beautiful Api region of western Nepal. Experience untouched landscapes, dramatic mountains, and traditional Himalayan culture.",
      why:
        "Api is ideal for travelers looking for a remote Himalayan adventure away from the more crowded trekking routes.",
    },

    chitwan: {
      title: "Chitwan Jungle Safari",
      image: "/images/CHITWAN.jpg",
      details: ["3 Days", "Easy", "Terai Region", "Rating 4.6"],
      description:
        "Explore the beautiful Chitwan National Park and experience wildlife, jungle safaris, canoe rides, and the natural beauty of Nepal's Terai region.",
      why:
        "Chitwan is perfect this month for wildlife experiences, jungle activities, and exploring Nepal's diverse natural environment.",
    },
  };
//    remenber this
  const trip = trips[selectedTrip];

  return (
    <div className="relative grid grid-cols-1 gap-10 bg-[#141714] p-2 text-white sm:p-20 lg:grid-cols-2 lg:gap-16 lg:p-10">

     
      <div className="flex flex-col justify-center">

        
        <h6 className="mb-5 text-sm font-semibold tracking-widest text-green-300">
          - TRIP OF THE MONTH
        </h6>

       
        <div className="mb-8 flex flex-wrap gap-3">

          <button
            onClick={() => setSelectedTrip("everest")}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
              selectedTrip === "everest"
                ? "border-green-300 bg-green-300 text-green-950"
                : "border-green-300 text-green-300 hover:bg-green-300 hover:text-green-950"
            }`}
          >
            EVEREST
          </button>

          <button
            onClick={() => setSelectedTrip("api")}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
              selectedTrip === "api"
                ? "border-green-300 bg-green-300 text-green-950"
                : "border-green-300 text-green-300 hover:bg-green-300 hover:text-green-950"
            }`}
          >
            API
          </button>

          <button
            onClick={() => setSelectedTrip("chitwan")}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
              selectedTrip === "chitwan"
                ? "border-green-300 bg-green-300 text-green-950"
                : "border-green-300 text-green-300 hover:bg-green-300 hover:text-green-950"
            }`}
          >
            CHITWAN
          </button>

        </div>

        {/* Dynamic Title */}
        <h1 className="mb-5 text-3xl font-bold sm:text-4xl lg:text-5xl">
          {trip.title}
        </h1>

        {/* Dynamic Details */}
        <div className="mb-6 flex flex-wrap gap-3">
          {trip.details.map((detail, index) => (
            <span
              key={index}
              className="rounded-full border border-green-300 px-4 py-2 text-sm"
            >
              {detail}
            </span>
          ))}
        </div>

        {/* Dynamic Description */}
        <p className="mb-8 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
          {trip.description}
        </p>

        {/* Why this month */}
        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md sm:p-6">
          <h2 className="mb-3 text-xl font-semibold text-green-300">
            Why this month?
          </h2>

          <p className="text-sm leading-7 text-white/80 sm:text-base">
            {trip.why}
          </p>
        </div>

        {/* Button */}
        <button className="mt-8 w-fit rounded-full bg-white px-4 py-3 font-bold text-green-950 transition hover:bg-green-300">
          Explore This Trek →
        </button>
      </div>

      {/* RIGHT COLUMN - DYNAMIC IMAGE */}
      <div className="flex h-[300px] w-full max-w-[700px] items-center justify-center overflow-hidden rounded-2xl shadow-2xl sm:h-[400px] lg:h-[500px]">
        <img
          src={trip.image}
          alt={trip.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

    </div>
  );
};

export default Tripofmonth;