import React, { useState } from "react";
import {
  ShieldCheck,
  BadgeCheck,
  Leaf,
  Headphones,
} from "lucide-react";

const GuideExpert = () => {
  const experts = [
    {
      image: "/images/Expert1.jpg",
      name: "Ram Lamichane",
      role: "FOUNDER AND LEAD GUIDE, SAGARMATHA TREK",
      description:
        "Adventure with people who know Nepal. Our experienced local team helps you discover the mountains, culture, and hidden gems of Nepal with confidence.",
      experience: "15+ years",
      benefits: [
        {
          title: "No Hidden Charges",
          description: "Everything clearly explained.",
          icon: ShieldCheck,
        },
        {
          title: "Experienced Guides",
          description: "Skilled and trained professionals.",
          icon: BadgeCheck,
        },
        {
          title: "Responsible Tourism",
          description: "Respecting Nepal's environment.",
          icon: Leaf,
        },
        {
          title: "24/7 Traveler Support",
          description: "Support throughout your journey.",
          icon: Headphones,
        },
      ],
    },

    {
      image: "/images/Expert2.jpg",
      name: "Suman Gurung",
      role: "SENIOR TREKKING GUIDE, HIMALAYAN ADVENTURES",
      description:
        "Travel Nepal with a guide who understands the trails, local communities, and mountain conditions from years of experience.",
      experience: "12+ years",
      benefits: [
        {
          title: "No Hidden Charges",
          description: "Clear and transparent pricing.",
          icon: ShieldCheck,
        },
        {
          title: "Experienced Guides",
          description: "Professional local trekking guides.",
          icon: BadgeCheck,
        },
        {
          title: "Responsible Tourism",
          description: "Supporting local communities.",
          icon: Leaf,
        },
        {
          title: "24/7 Traveler Support",
          description: "Help whenever you need it.",
          icon: Headphones,
        },
      ],
    },

    {
      image: "/images/Expert3.jpg",
      name: "Anita Thapa",
      role: "TRAVEL EXPERT, NEPAL CULTURAL TOURS",
      description:
        "Discover Nepal beyond the mountains through authentic cultural experiences, family adventures, and carefully planned journeys.",
      experience: "10+ years",
      benefits: [
        {
          title: "No Hidden Charges",
          description: "Simple and honest pricing.",
          icon: ShieldCheck,
        },
        {
          title: "Experienced Guides",
          description: "Knowledgeable local professionals.",
          icon: BadgeCheck,
        },
        {
          title: "Responsible Tourism",
          description: "Travel that benefits local people.",
          icon: Leaf,
        },
        {
          title: "24/7 Traveler Support",
          description: "Always available to assist.",
          icon: Headphones,
        },
      ],
    },

    {
      image: "/images/Expert4.jpg",
      name: "Bikash Tamang",
      role: "ADVENTURE GUIDE, NEPAL HIGHLANDS",
      description:
        "From challenging mountain trails to exciting outdoor adventures, our team helps you choose experiences that match your goals.",
      experience: "9+ years",
      benefits: [
        {
          title: "No Hidden Charges",
          description: "Everything clearly explained.",
          icon: ShieldCheck,
        },
        {
          title: "Experienced Guides",
          description: "Skilled and trained professionals.",
          icon: BadgeCheck,
        },
        {
          title: "Responsible Tourism",
          description: "Respecting Nepal's environment.",
          icon: Leaf,
        },
        {
          title: "24/7 Traveler Support",
          description: "Support throughout your journey.",
          icon: Headphones,
        },
      ],
    },

    {
      image: "/images/Expert5.jpg",
      name: "Prakash Rai",
      role: "DESTINATION EXPERT, NEPAL TRAVEL",
      description:
        "Explore Nepal comfortably with personalized travel experiences designed around your interests, schedule, and expectations.",
      experience: "8+ years",
      benefits: [
        {
          title: "No Hidden Charges",
          description: "Honest and transparent costs.",
          icon: ShieldCheck,
        },
        {
          title: "Experienced Guides",
          description: "Friendly local travel experts.",
          icon: BadgeCheck,
        },
        {
          title: "Responsible Tourism",
          description: "Supporting sustainable travel.",
          icon: Leaf,
        },
        {
          title: "24/7 Traveler Support",
          description: "We're here whenever you need us.",
          icon: Headphones,
        },
      ],
    },
  ];

  const [current, setCurrent] = useState(0);

  const nextImage = () => {
    setCurrent((prev) => (prev + 1) % experts.length);
  };

  const previousImage = () => {
    setCurrent((prev) =>
      prev === 0 ? experts.length - 1 : prev - 1
    );
  };

  const expert = experts[current];

  return (
    <section className="bg-gray-100 px-4 py-5 sm:px-6 lg:px-8">

      {/* ========================================= */}
      {/* TOP SECTION - IMAGE + EXPERT INFORMATION */}
      {/* ========================================= */}

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 lg:flex-row lg:gap-8">

        {/* ================================= */}
        {/* LEFT SIDE - IMAGE SLIDER */}
        {/* ================================= */}

        <div className="flex w-full justify-center lg:w-1/2">

          <div className="relative h-[340px] w-full max-w-[480px] sm:h-[380px] lg:h-[420px]">

            {experts.map((item, index) => {
              let distance = index - current;

              // Circular positioning
              if (distance > experts.length / 2) {
                distance -= experts.length;
              }

              if (distance < -experts.length / 2) {
                distance += experts.length;
              }

              return (
                <img
                  key={item.image}
                  src={item.image}
                  alt={item.name}
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[190px]
                    w-[270px]
                    rounded-2xl
                    object-cover
                    shadow-xl
                    transition-all
                    duration-500
                    ease-out
                    sm:h-[220px]
                    sm:w-[320px]
                    lg:h-[250px]
                    lg:w-[360px]
                  "
                  style={{
                    transform: `
                      translate(-50%, -50%)
                      translateY(${distance * 70}px)
                      scale(${distance === 0 ? 1 : 0.82})
                    `,

                    opacity:
                      Math.abs(distance) > 1
                        ? 0
                        : distance === 0
                        ? 1
                        : 0.45,

                    zIndex: 10 - Math.abs(distance),

                    pointerEvents:
                      distance === 0 ? "auto" : "none",
                  }}
                />
              );
            })}

            {/* ================================= */}
            {/* ARROWS */}
            {/* ================================= */}

            <div
              className="
                absolute
                right-1
                top-1/2
                z-50
                flex
                -translate-y-1/2
                flex-col
                gap-2
              "
            >

              {/* UP */}
              <button
                onClick={nextImage}
                aria-label="Previous expert"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-lg
                  shadow-lg
                  transition
                  duration-200
                  hover:scale-110
                  hover:bg-gray-200
                "
              >
                ↑
              </button>

              {/* DOWN */}
              <button
                onClick={previousImage}
                aria-label="Next expert"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-lg
                  shadow-lg
                  transition
                  duration-200
                  hover:scale-110
                  hover:bg-gray-200
                "
              >
                ↓
              </button>

            </div>

          </div>
        </div>


        {/* ================================= */}
        {/* RIGHT SIDE - EXPERT INFORMATION */}
        {/* ================================= */}

        <div className="w-full lg:w-1/2">

          {/* Small Heading */}
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#4f8f3a] sm:text-sm">
            Why Travel With Us
          </p>

          {/* Main Heading */}
          <h1 className="mb-3 max-w-xl text-2xl font-bold leading-tight text-[#0b2418] sm:text-3xl lg:text-4xl">
            Adventure with People who know Nepal
          </h1>

          {/* Description */}
          <p className="mb-4 max-w-xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
            {expert.description}
          </p>

          {/* Expert Name + Role */}
          <div className="mb-4">

            <h3 className="mb-1 text-xl font-bold text-[#0b2418] sm:text-2xl">
              {expert.name}
            </h3>

            <p className="text-xs font-semibold uppercase tracking-wide text-[#4f8f3a] sm:text-sm">
              {expert.role}
            </p>

          </div>

          {/* Experience */}
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eaf6df] text-[#4f8f3a]">
              <BadgeCheck size={22} />
            </div>

            <div>

              <p className="text-2xl font-bold text-[#0b2418]">
                {expert.experience}
              </p>

              <p className="text-sm text-gray-500">
                Local Himalayan expert
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ========================================= */}
      {/* BENEFITS - BELOW WHOLE CONTAINER */}
      {/* ========================================= */}

      <div className="mx-auto mt-5 w-full max-w-6xl border-t border-gray-200 pt-5">

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {expert.benefits.map((benefit, index) => {

            const Icon = benefit.icon;

            return (
              <div
                key={index}
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  p-4
                  shadow-sm
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >

                {/* Icon */}
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf6df] text-[#4f8f3a]">
                  <Icon size={21} />
                </div>

                {/* Title */}
                <h3 className="mb-1 text-base font-bold text-[#0b2418]">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-5 text-gray-500">
                  {benefit.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
};

export default GuideExpert;