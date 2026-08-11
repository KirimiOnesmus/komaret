import { Link } from "react-router-dom";
import {
  FaBuilding,
  FaHardHat,
  FaUsers,
  FaCouch,
  FaTools,
  FaHome,
  FaDraftingCompass,
  FaHammer,
  FaCity,
  FaArrowRight,
} from "react-icons/fa";

const SERVICE_ICONS = {
  construction: FaBuilding,
  "machinery-hire": FaHardHat,
  "labor-management": FaUsers,
  "interior-design": FaCouch,
  renovations: FaTools,
  "real-estate-development": FaHome,
  "architectural-design": FaDraftingCompass,
  "building-construction": FaHammer,
  "property-development": FaCity,
};

function ServiceCard({ service }) {
  const Icon = SERVICE_ICONS[service.slug] || FaBuilding;

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-lg
        border
        border-gray-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <div className="relative h-[145px] overflow-hidden">
        {service.image ? (
          <img
            src={service.image}
            alt={service.title}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#071525]">
            <Icon className="text-5xl text-[#f5b400]" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#071525]/30 to-transparent" />
      </div>


      <div className="relative px-3 pb-4 sm:px-4">

        <div
          className="
            relative
            -mt-5
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-md
            border-2
            border-white
            bg-[#071525]
            text-[#f5b400]
            shadow-md
            transition-all
            duration-300
            group-hover:bg-[#f5b400]
            group-hover:text-[#071525]
          "
        >
          <Icon className="text-lg" />
        </div>

 
        <h3
          className="
            mt-3
            text-base
            font-bold
            leading-5
            text-[#071525]
            transition-colors
            duration-200
            group-hover:text-[#dca500]
          "
        >
          {service.title}
        </h3>

    
        {service.summary && (
          <p className="mt-2 line-clamp-3 text-xs leading-5 text-gray-600 sm:text-sm">
            {service.summary}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">

          <Link
            to={`/services/${encodeURIComponent(service.slug)}/request`}
            className="
              inline-flex
              items-center
              justify-center
              rounded-md
              bg-[#071525]
              px-3
              py-2
              text-xs
              font-semibold
              text-white
              transition-all
              duration-200
              hover:bg-[#f5b400]
              hover:text-[#071525]
            "
          >
            Request Service
          </Link>

          <Link
            to={`/services/${encodeURIComponent(service.slug)}/estimate`}
            className="
              group/estimate
              inline-flex
              items-center
              gap-1.5
              text-xs
              font-semibold
              text-[#071525]
              transition-colors
              duration-200
              hover:text-[#dca500]
            "
          >
            Get Instant Estimate

            <FaArrowRight
              className="
                text-[10px]
                transition-transform
                duration-200
                group-hover/estimate:translate-x-1
              "
            />
          </Link>

        </div>
      </div>
    </div>
  );
}

export default ServiceCard;