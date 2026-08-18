import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroSlider = () => {
  const images = [
    "/images/CLIMBER.jpg",
    "/images/MOUNT.jpg",
    "/images/CHITWAN.jpg",
  ];

  const [current, setCurrent] = useState(0);

  const nextImage = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-[500px] w-full overflow-hidden">

      {/* Background Images */}
      <div
        className="absolute inset-0 flex h-full transition-transform duration-700 ease-in-out"
        style={{
          width: `${images.length * 100}%`,
          transform: `translateX(-${current * (100 / images.length)}%)`,
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="h-full bg-cover bg-center"
            style={{
              width: `${100 / images.length}%`,
              backgroundImage: `url("${image}")`,
            }}
          />
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/30" />

      {/* LEFT BUTTON */}
      <button
        onClick={previousImage}
        aria-label="Previous image"
        className="
          absolute left-5 top-1/2 z-50
          flex h-12 w-12
          -translate-y-1/2
          cursor-pointer
          items-center justify-center
          rounded-full
          bg-black/40
          text-white
          transition-all duration-300
          hover:scale-125
          hover:bg-[#9be564]
          hover:text-[#0b2418]
        "
      >
        <ChevronLeft size={30} strokeWidth={1.5} />
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={nextImage}
        aria-label="Next image"
        className="
          absolute right-5 top-1/2 z-50
          flex h-12 w-12
          -translate-y-1/2
          cursor-pointer
          items-center justify-center
          rounded-full
          bg-black/40
          text-white
          transition-all duration-300
          hover:scale-125
          hover:bg-[#9be564]
          hover:text-[#0b2418]
        "
      >
        <ChevronRight size={30} strokeWidth={1.5} />
      </button>

      {/* Content */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <h1 className="text-5xl font-bold text-white">
          Explore Nepal
        </h1>
      </div>

    </div>
  );
};

export default HeroSlider;