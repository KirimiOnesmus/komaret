
import { FaQuoteLeft } from "react-icons/fa";

const TESTIMONIALS = [
  {
    id: 1,
    name: "John Kamau",
    role: "CEO, Horizon Properties",
    message:
      "Komaret delivered our office complex on time and the quality exceeded our expectations. Highly professional team!",
  },
  {
    id: 2,
    name: "Mary Wanjiku",
    role: "Director, Wanjiku Homes",
    message:
      "Their attention to detail and project management is outstanding. We felt involved at every stage of the construction.",
  },
  {
    id: 3,
    name: "David Ochieng",
    role: "Managing Director, Ochieng Developers",
    message:
      "Reliable, transparent and innovative. We will definitely work with Komaret again on our next project.",
  },
  {
    id: 4,
    name: "Grace Njeri",
    role: "Property Developer",
    message:
      "From the initial design to the final handover, the Komaret team was professional, responsive and committed to quality.",
  },
  {
    id: 5,
    name: "Peter Mwangi",
    role: "Business Owner",
    message:
      "They understood our requirements and delivered exactly what we envisioned. I would highly recommend their services.",
  },
];

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

          <p className="mt-0.5 text-xs text-gray-500">
            {testimonial.role}
          </p>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {

  const testimonials = [...TESTIMONIALS, ...TESTIMONIALS];

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

