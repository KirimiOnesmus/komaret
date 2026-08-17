import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaCalendarAlt,
} from 'react-icons/fa';

import { formatDate } from '../../../shared/utils/formatters';
import { mediaUrl } from '../../../shared/utils/mediaUrl';

function NewsCard({ article }) {
  const image = mediaUrl(
    article.image ||
    article.imageUrl ||
    article.featuredImage ||
    article.coverImage
  );

  const category =
    article.category ||
    article.type ||
    'Company Updates';

  return (
    <Link
      to={`/news/${encodeURIComponent(article.slug)}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >

      <div className="relative h-52 overflow-hidden bg-gray-100">

        {image ? (
          <img
            src={image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#071525]">
            <span className="text-sm text-gray-400">
              KOMARET
            </span>
          </div>
        )}

      
        <span className="absolute bottom-3 left-3 bg-[#f5b400] px-3 py-1 text-[10px] font-bold text-[#071525]">
          {category}
        </span>

      </div>


  
      <div className="p-5">

        <h3 className="line-clamp-2 text-lg font-bold leading-6 text-[#071525] transition-colors group-hover:text-[#f5b400]">
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
            {article.excerpt}
          </p>
        )}


  
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FaCalendarAlt className="text-[#f5b400]" />
            <span>
              {formatDate(article.publishedAt)}
            </span>
          </div>


          <span className="flex items-center gap-2 text-xs font-semibold text-[#071525] transition-colors group-hover:text-[#f5b400]">

            Read More

            <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1" />

          </span>

        </div>

      </div>
    </Link>
  );
}

export default NewsCard;