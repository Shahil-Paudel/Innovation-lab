import React, { useEffect, useState } from "react";
import {
  Search,
  User,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const blogListAPI = "/api/v1/blogs";

const categories = [
  "ALL",
  "TREKKING",
  "PEAK CLIMBING",
  "MOUNTAINEERING",
  "ADVENTURE",
  "TRAVEL & TOURS",
  "GUIDES & TIPS",
  "NEWS",
  "DESTINATIONS & CULTURE",
];

/* =========================================================
   CATEGORY FUNCTION
========================================================= */

const getCategory = (blog) => {
  const slug = blog.slug?.toLowerCase() || "";

  /* TREKKING */
  if (
    slug.includes("trek") ||
    slug.includes("trekking") ||
    slug.includes("base-camp-trek")
  ) {
    return "TREKKING";
  }

  /* PEAK CLIMBING */
  if (
    slug.includes("peak-climbing") ||
    slug.includes("peak-climb") ||
    slug.includes("mera-peak") ||
    slug.includes("island-peak") ||
    slug.includes("ama-dablam") ||
    slug.includes("baruntse")
  ) {
    return "PEAK CLIMBING";
  }

  /* MOUNTAINEERING */
  if (
    slug.includes("expedition") ||
    slug.includes("mountaineering") ||
    slug.includes("climbing-mount")
  ) {
    return "MOUNTAINEERING";
  }

  /* ADVENTURE */
  if (
    slug.includes("rafting") ||
    slug.includes("paragliding") ||
    slug.includes("mountain-biking") ||
    slug.includes("jungle-safari") ||
    slug.includes("adventure")
  ) {
    return "ADVENTURE";
  }

  /* TRAVEL & TOURS */
  if (
    slug.includes("nepal-tour") ||
    slug.includes("tibet-tour") ||
    slug.includes("travel-agent") ||
    slug.includes("tour")
  ) {
    return "TRAVEL & TOURS";
  }

  /* GUIDES & TIPS */
  if (
    slug.includes("guide") ||
    slug.includes("tips") ||
    slug.includes("how-to") ||
    slug.includes("safety") ||
    slug.includes("best-season") ||
    slug.includes("preparation") ||
    slug.includes("altitude")
  ) {
    return "GUIDES & TIPS";
  }

  /* NEWS */
  if (
    slug.includes("world-record") ||
    slug.includes("successful-ascent") ||
    slug.includes("record") ||
    slug.includes("summit")
  ) {
    return "NEWS";
  }

  /* DESTINATIONS & CULTURE */
  if (
    slug.includes("dolpo") ||
    slug.includes("culture") ||
    slug.includes("sherpa") ||
    slug.includes("destination") ||
    slug.includes("heritage")
  ) {
    return "DESTINATIONS & CULTURE";
  }

  return "OTHER";
};

/* =========================================================
   DATE FORMATTER
========================================================= */

const formatDate = (date) => {
  if (!date) {
    return "N/A";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/* =========================================================
   BLOG LIST
========================================================= */

const BlogList = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  /* =======================================================
     FETCH BLOGS
  ======================================================= */

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(blogListAPI);

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const result = await response.json();

        setBlogs(result.data || []);
      } catch (error) {
        console.error("FETCH ERROR:", error);
      }
    };

    fetchBlogs();
  }, []);

  /* =======================================================
     ADD CATEGORY
  ======================================================= */

  const categorizedBlogs = blogs.map((blog) => ({
    ...blog,
    category: getCategory(blog),
  }));

  /* =======================================================
     CATEGORY FILTER
  ======================================================= */

  const categoryFilteredBlogs =
    selectedCategory === "ALL"
      ? categorizedBlogs
      : categorizedBlogs.filter(
          (blog) => blog.category === selectedCategory
        );

  /* =======================================================
     SEARCH FILTER
  ======================================================= */

  const filteredBlogs = categoryFilteredBlogs.filter((blog) =>
    blog.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  /* =======================================================
     SEARCH DROPDOWN RESULTS
  ======================================================= */

  const searchResults =
    searchTerm.trim() === ""
      ? []
      : categorizedBlogs.filter((blog) =>
          blog.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        );

  /* =======================================================
     OPEN BLOG DETAIL
  ======================================================= */

  const openBlog = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <section
      className="w-full"
      style={{ backgroundColor: "#FBF9F4F2" }}
    >

      {/* =====================================================
          BLOG HERO
          The search bar now lives inside this section, pinned
          near the bottom of the background image (instead of
          straddling the seam between hero and content).
      ===================================================== */}

      <section
        id="blogs"
        className="
          relative
          left-1/2
          right-1/2
          -ml-[50vw]
          -mr-[50vw]
          -mt-24
          w-screen
          min-h-[640px]
          overflow-visible
        "
      >

        {/* =================================================
            BACKGROUND IMAGE
        ================================================= */}

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/CLIMBER.jpg')",
          }}
        />

        {/* =================================================
            DARK OVERLAY
        ================================================= */}

        <div className="absolute inset-0 bg-black/35" />

        {/* =================================================
            LEFT GRADIENT
        ================================================= */}

        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

        {/* =================================================
            HERO TEXT CONTENT
            Sits in the upper/middle part of the image; the
            search bar (below) is pinned separately near the
            bottom so the two don't compete for space.
        ================================================= */}

        <div
          className="
            relative
            z-10
            flex
            min-h-[490px]
            items-center
            px-6
            pt-40
            md:px-10
            lg:px-16
          "
        >

          <div className="mx-auto w-full max-w-2xl text-center">

            {/* =================================================
                LABEL
            ================================================= */}

            <div className="">
                <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-white
                "
              >
               - Stories & Guides
              </span>

            </div>

            {/* =================================================
                HEADING
            ================================================= */}

            <h1
              className="
                mx-auto
                max-w-xl
                text-3xl
                font-bold
                leading-tight
                sm:text-4xl
                lg:text-5xl
              "
            >

              <span className="text-white">
                Explore the awesome
              </span>

              <span className="block text-[#9be564]">
                stories and journeys.
              </span>

            </h1>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <p
              className="
                mx-auto
                mt-5
                max-w-xl
                text-sm
                leading-6
                text-white/80
                sm:text-base
              "
            >
              Discover inspiring adventures, trekking guides,
              travel stories, mountain expeditions and destinations
              across Nepal.
            </p>

          </div>

        </div>

        {/* =================================================
            SEARCH BAR — pinned to the bottom-center of the
            hero background image, still inside the image
            area (not below it). z-20 keeps it above the
            overlay/gradient layers.
        ================================================= */}

        <div
          className="
            absolute
            bottom-10
            left-0
            right-0
            z-20
            px-6
            md:px-10
            lg:px-16
          "
        >

          <div className="relative mx-auto w-full max-w-2xl">

            {/* Search Box */}

            <div
              className="
                flex
                h-16
                items-center
                rounded-full
                border
                border-black/5
                bg-white
                p-2
                shadow-[0_20px_45px_-15px_rgba(0,0,0,0.45)]
              "
            >

              {/* Search Icon */}

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#eaf6df]
                  text-[#4f8f3a]
                "
              >
                <Search
                  size={20}
                  strokeWidth={1.8}
                />
              </div>

              {/* Input */}

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search blogs by title..."
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-4
                  text-sm
                  text-gray-800
                  outline-none
                  placeholder:text-gray-400
                  sm:text-base
                "
              />

            </div>

            {/* =================================================
                SEARCH RESULTS
            ================================================= */}

            {searchTerm.trim() !== "" && (

              <div
                className="
                  absolute
                  left-0
                  right-0
                  top-full
                  z-[100]
                  mt-3
                  max-h-[350px]
                  overflow-y-auto
                  rounded-2xl
                  bg-white
                  p-2
                  shadow-2xl
                "
              >

                {searchResults.length > 0 ? (

                  searchResults.map((blog) => (

                    <div
                      key={blog.id}
                      onClick={() => openBlog(blog.id)}
                      className="
                        flex
                        cursor-pointer
                        items-center
                        gap-3
                        rounded-xl
                        p-3
                        transition
                        hover:bg-gray-100
                      "
                    >

                      {/* Small Image */}

                      <img
                        src={
                          blog.image ||
                          "/images/MOUNT.jpg"
                        }
                        alt={blog.title}
                        className="
                          h-14
                          w-20
                          shrink-0
                          rounded-lg
                          object-cover
                        "
                        onError={(e) => {
                          e.currentTarget.src =
                            "/images/MOUNT.jpg";
                        }}
                      />

                      {/* Blog Information */}

                      <div className="min-w-0 flex-1">

                        <p
                          className="
                            mb-1
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wide
                            text-[#4f8f3a]
                          "
                        >
                          {blog.category}
                        </p>

                        <h3
                          className="
                            line-clamp-2
                            text-sm
                            font-semibold
                            text-gray-900
                          "
                        >
                          {blog.title}
                        </h3>

                      </div>

                    </div>

                  ))

                ) : (

                  <div className="px-4 py-7 text-center">

                    <Search
                      size={25}
                      className="mx-auto mb-2 text-gray-300"
                    />

                    <p className="text-sm font-medium text-gray-600">
                      No blogs found
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Try another search term
                    </p>

                  </div>

                )}

              </div>

            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          BLOG CONTENT
      ===================================================== */}

      <section className="bg-transparent">

        <div
          className="
            mx-auto
            max-w-7xl
            px-6
            pb-14
            pt-14
            md:px-10
            lg:px-12
          "
        >

          {/* =================================================
              HEADING
          ================================================= */}

          <div className="mb-8">

            <p
              className="
                mb-2
                text-xs
                font-bold
                uppercase
                tracking-[3px]
                text-[#4f8f3a]
              "
            >
              Our Stories
            </p>

            <h2
              className="
                text-3xl
                font-bold
                text-gray-900
                md:text-4xl
              "
            >
              Latest Blogs
            </h2>

          </div>


          {/* =================================================
              CATEGORIES
          ================================================= */}

          <div className="mb-8 flex flex-wrap gap-3">

            {categories.map((category) => (

              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`
                  rounded-full
                  px-5
                  py-2.5
                  text-xs
                  font-semibold
                  transition
                  md:text-sm

                  ${
                    selectedCategory === category
                      ? "bg-[#0b2418] text-[#9be564]"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {category}
              </button>

            ))}

          </div>


          {/* =================================================
              BLOG COUNT
          ================================================= */}

          <p className="mb-7 text-sm text-gray-500">

            Showing{" "}

            <span className="font-semibold text-gray-900">
              {filteredBlogs.length}
            </span>

            {" "}blogs

          </p>


          {/* =================================================
              BLOG GRID
          ================================================= */}

          {filteredBlogs.length > 0 ? (

            <div
              className="
                grid
                grid-cols-1
                gap-7
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >

              {filteredBlogs.map((blog) => (

                <article
                  key={blog.id}
                  className="
                    group
                    flex
                    min-h-[440px]
                    flex-col
                    overflow-hidden
                    rounded-3xl
                    border
                    border-black/5
                    bg-white
                    shadow-[0_10px_30px_-12px_rgba(11,36,24,0.18)]
                    transition-all
                    duration-300
                    ease-out
                    hover:-translate-y-1.5
                    hover:shadow-[0_25px_45px_-15px_rgba(11,36,24,0.3)]
                  "
                >

                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div className="h-52 shrink-0 overflow-hidden">

                    <img
                      src={
                        blog.image ||
                        "/images/MOUNT.jpg"
                      }
                      alt={blog.title}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-500
                        group-hover:scale-105
                      "
                      onError={(e) => {
                        e.currentTarget.src =
                          "/images/MOUNT.jpg";
                      }}
                    />

                  </div>


                  {/* =================================================
                      CARD CONTENT
                  ================================================= */}

                  <div className="flex flex-1 flex-col p-5">

                    {/* Category */}

                    <span
                      className="
                        mb-3
                        inline-block
                        w-fit
                        rounded-full
                        bg-[#eaf6df]
                        px-3
                        py-1
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wide
                        text-[#4f8f3a]
                      "
                    >
                      {blog.category}
                    </span>


                    {/* Title */}

                    <h2
                      className="
                        mb-4
                        line-clamp-2
                        text-lg
                        font-bold
                        leading-6
                        text-gray-900
                        transition-colors
                        duration-200
                        group-hover:text-[#0b2418]
                      "
                    >
                      {blog.title}
                    </h2>


                    {/* =================================================
                        AUTHOR
                    ================================================= */}

                    <div
                      className="
                        mb-2
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-gray-500
                      "
                    >

                      <User
                        size={16}
                        strokeWidth={1.8}
                        className="shrink-0"
                      />

                      <span>
                        {blog.author || "Makalu Adventure"}
                      </span>

                    </div>


                    {/* =================================================
                        PUBLISHED DATE
                    ================================================= */}

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-gray-500
                      "
                    >

                      <CalendarDays
                        size={16}
                        strokeWidth={1.8}
                        className="shrink-0"
                      />

                      <span>
                        Published At:{" "}
                        {formatDate(
                          blog.published_at ||
                          blog.created_at ||
                          blog.date
                        )}
                      </span>

                    </div>


                    {/* =================================================
                        READ MORE
                    ================================================= */}

                    <div className="mt-auto flex justify-end pt-6">

                      <button
                        onClick={() => openBlog(blog.id)}
                        className="
                          flex
                          items-center
                          gap-1.5
                          text-sm
                          font-semibold
                          text-[#4f8f3a]
                          transition
                          duration-200
                          hover:text-[#0b2418]
                        "
                      >

                        <span>
                          Read more
                        </span>

                        <ArrowRight
                          size={16}
                          strokeWidth={2}
                          className="
                            transition-transform
                            duration-200
                            group-hover:translate-x-1
                          "
                        />

                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            /* =================================================
               NO BLOGS
            ================================================= */

            <div
              className="
                rounded-2xl
                bg-white
                py-16
                text-center
              "
            >

              <Search
                size={35}
                className="mx-auto mb-3 text-gray-300"
              />

              <h3
                className="
                  text-lg
                  font-semibold
                  text-gray-800
                "
              >
                No blogs found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your category or search term.
              </p>

            </div>

          )}

        </div>

      </section>

    </section>
  );
};

export default BlogList;