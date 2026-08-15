import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { getCategoryIcon } from "./categoryIcons";
import { PUBLIC_PATHS } from "../../../shared/constants/routes";


function CategoryCard({ category }) {
  const Icon = getCategoryIcon(category.slug);
  const to = `${PUBLIC_PATHS.SERVICES}?category=${encodeURIComponent(category.slug)}`;

  return (
    <Link
      to={to}
      className="
        group
        flex
        h-full
        flex-col
        rounded-lg
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#f5b400]/60
        hover:shadow-lg
      "
    >
      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-md
          border
          border-gray-100
          bg-[#f5b400]/10
          text-[#f5b400]
          transition-all
          duration-300
          group-hover:bg-[#f5b400]
          group-hover:text-[#071525]
        "
      >
        <Icon className="text-2xl" />
      </div>

      <h3 className="mt-5 text-lg font-bold leading-snug text-[#071525] transition-colors duration-200 group-hover:text-[#dca500]">
        {category.name}
      </h3>

      {category.summary && (
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
          {category.summary}
        </p>
      )}

      <span
        className="
          mt-auto
          inline-flex
          items-center
          gap-1.5
          pt-5
          text-xs
          font-semibold
          text-[#071525]
          transition-colors
          duration-200
          group-hover:text-[#dca500]
        "
      >
        View services
        <FaArrowRight className="text-[10px] transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export default CategoryCard;
