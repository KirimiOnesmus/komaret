
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { PUBLIC_PATHS } from "../../../shared/constants/routes";

import banner1 from "../../../assets/images/banner.png";
import banner2 from "../../../assets/images/banner-2.jpg";
import banner3 from "../../../assets/images/banner-3.jpg";

const SLIDES = [
  {
    image: banner1,
    eyebrow: "WE BUILD THE FUTURE",
    title: "Building Spaces,",
    highlight: "Building Trust.",
    description:
      "We are committed to delivering quality construction, modern design and reliable solutions that bring your vision to life.",
  },
  {
    image: banner2,
    eyebrow: "QUALITY CONSTRUCTION",
    title: "Your Vision,",
    highlight: "Our Expertise.",
    description:
      "From residential homes to commercial developments, we provide professional construction solutions from concept to completion.",
  },
  {
    image: banner3,
    eyebrow: "DESIGN & CONSTRUCTION",
    title: "Creating Spaces,",
    highlight: "Creating Value.",
    description:
      "We combine innovative design, skilled workmanship and quality materials to create spaces built to last.",
  },
];

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const previousSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + SLIDES.length) % SLIDES.length
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);

    return () => clearInterval(interval);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section
      className="
        relative
        h-[520px]
        overflow-hidden
        bg-[#071525]
        sm:h-[580px]
        lg:h-[620px]
      "
    >

      <div className="sticky top-0 h-full w-full">
        {SLIDES.map((item, index) => (
          <div
            key={item.image}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <img
              src={item.image}
              alt=""
              className="
                h-full
                w-full
                object-cover
                object-center
                transition-transform
                duration-[6000ms]
                ease-out
              "
            />

         
            <div className="absolute inset-0 bg-[#061525]/65" />

  
            <div className="absolute inset-0 bg-gradient-to-r from-[#061525]/95 via-[#061525]/70 to-transparent" />
          </div>
        ))}

 
        <div className="absolute inset-0 z-20">
          <div className="mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl">

              <p
                key={`eyebrow-${currentSlide}`}
                className="mb-4 text-xs font-bold tracking-[0.15em] text-[#f5b400] sm:text-sm"
              >
                {slide.eyebrow}
              </p>

              <h1
                key={`title-${currentSlide}`}
                className="text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
              >
                {slide.title}

                <br />

                <span className="text-[#f5b400]">
                  {slide.highlight}
                </span>
              </h1>

              <p
                key={`description-${currentSlide}`}
                className="mt-6 max-w-lg text-sm leading-6 text-gray-200 sm:text-base"
              >
                {slide.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={PUBLIC_PATHS.SERVICES}
                  className="
                    group
                    flex
                    cursor-pointer
                    items-center
                    gap-3
                    bg-[#f5b400]
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-[#071525]
                    transition-all
                    duration-200
                    hover:bg-[#dca500]
                  "
                >
                  Our Services

                  <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to={PUBLIC_PATHS.PROJECTS}
                  className="
                    group
                    flex
                    cursor-pointer
                    items-center
                    gap-3
                    border
                    border-white/70
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    duration-200
                    hover:border-[#f5b400]
                    hover:bg-[#f5b400]
                    hover:text-[#071525]
                  "
                >
                  View Our Projects

                  <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous slide"
          className="
            absolute
            left-5
            top-1/2
            z-30
            flex
            h-10
            w-10
            -translate-y-1/2
            cursor-pointer
            items-center
            justify-center
            rounded-full
            border
            border-white/40
            bg-[#071525]/50
            text-white
            backdrop-blur-sm
            transition-all
            hover:border-[#f5b400]
            hover:bg-[#f5b400]
            hover:text-[#071525]
            sm:left-6
          "
        >
          <FaChevronLeft className="text-sm" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="
            absolute
            right-5
            top-1/2
            z-30
            flex
            h-10
            w-10
            -translate-y-1/2
            cursor-pointer
            items-center
            justify-center
            rounded-full
            border
            border-white/40
            bg-[#071525]/50
            text-white
            backdrop-blur-sm
            transition-all
            hover:border-[#f5b400]
            hover:bg-[#f5b400]
            hover:text-[#071525]
            sm:right-6
          "
        >
          <FaChevronRight className="text-sm" />
        </button>

  
        <div className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-[#f5b400]"
                  : "w-2 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSlider;

