
import { FaQuoteLeft } from "react-icons/fa";
import useTestimonials from "../../../shared/hooks/useTestimonials";

function TestimonialCard({ testimonial }) {
  const initials = testimonial.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2);

  return (
    <div
      className="
        w-[300px]
        shrink-0
        rounded-2xl
        border border-gray-200
        bg-white
        p-6
        shadow-md
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-md
        sm:w-[340px]
        lg:w-[380px]
    
      "
    >
      <FaQuoteLeft className="text-xl text-[#f5b400]" />

      <p className="mt-2 min-h-[96px] text-sm leading-6 text-gray-600">
        {testimonial.message}
      </p>

      <div className="mt-2 flex items-center gap-3 border-t border-gray-100 pt-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#071525] text-sm font-bold text-white">
          {initials}
        </div>

        <div>
          <p className="text-sm font-bold text-[#071525]">
            {testimonial.name}
          </p>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const { data: published } = useTestimonials();

  const source = Array.isArray(published) ? published : [];

  
  if (source.length === 0) return null;

 
  const testimonials = [...source, ...source];

  return (
    <section className="overflow-hidden bg-white py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">

          <div className="testimonial-marquee overflow-hidden">
            <div className="testimonial-track testimonial-track-right">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`top-${testimonial.id}-${index}`}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </div>

        
          <div className="testimonial-marquee overflow-hidden">
            <div className="testimonial-track testimonial-track-left">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`bottom-${testimonial.id}-${index}`}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .testimonial-marquee {
          width: 100%;
        }

        .testimonial-track {
          display: flex;
          width: max-content;
          gap: 1.5rem;
          animation-duration: 50s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        
        .testimonial-track-right {
          animation-name: testimonial-right;
        }


        .testimonial-track-left {
          animation-name: testimonial-left;
        }

    
        .testimonial-marquee:hover .testimonial-track {
          animation-play-state: paused;
        }

        @keyframes testimonial-right {
          from {
            transform: translateX(-50%);
          }

          to {
            transform: translateX(0);
          }
        }

        @keyframes testimonial-left {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        /*
         * Disable animation for users who prefer reduced motion.
         */
        @media (prefers-reduced-motion: reduce) {
          .testimonial-track {
            animation: none;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}

export default Testimonials;

